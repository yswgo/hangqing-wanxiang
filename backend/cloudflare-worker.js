// 行情万象 · Cloudflare Worker 行情网关 V71
// Quote Schema v2 + deployment readiness + safer market routing.
// IMPORTANT: upstream entitlement determines whether a quote is real-time or delayed.

const AV_BASE='https://www.alphavantage.co/query';
const MAX_CODES=5;
const QUOTE_TTL=20;
const HISTORY_TTL=6*60*60;
const CALENDAR_TTL=12*60*60;
const US_SYMBOL=/^[A-Z][A-Z0-9-]{0,7}(?:\.[A-Z])?$/;

function cors(env){return {
  'Access-Control-Allow-Origin':env.ALLOW_ORIGIN||'*',
  'Access-Control-Allow-Methods':'GET,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type,Accept',
  'Cache-Control':'no-store'
}}
function json(data,status,env,extra={}){return new Response(JSON.stringify(data),{status,headers:{...cors(env),'Content-Type':'application/json; charset=utf-8',...extra}})}
function n(v){const x=Number(String(v??'').replace('%',''));return Number.isFinite(x)?x:null}
function marketOf(code){
  const s=String(code||'').toUpperCase().trim();
  if(/^\d{6}$/.test(s))return'CN';
  if(/^\d{4}\.HK$/.test(s))return'HK';
  if(/\.T$/.test(s))return'JP';
  if(/\.KS$/.test(s))return'KR';
  if(/\.(DE|AS|PA)$/.test(s))return'EU';
  if(US_SYMBOL.test(s))return'US';
  return'OTHER'
}
function providerFor(market,env){
  if(market==='US'&&env.ALPHA_VANTAGE_API_KEY)return'alpha_vantage';
  if(market==='CN'&&env.CN_PROVIDER_URL)return'cn_proxy';
  if(market==='HK'&&env.HK_PROVIDER_URL)return'hk_proxy';
  return null
}
function currencyFor(market,q={}){return q.currency||({US:'USD',CN:'CNY',HK:'HKD'})[market]||null}
function quoteV2({code,name,price,change,chgPct,currency,status,provider,market,delayed,delayMinutes,quoteTime,quoteDate,fetchedAt,timestamp,source,isMock=false,_edgeCache=false}){
  const pct=n(chgPct)??0, fetchTs=Number(fetchedAt||timestamp)||Date.now();
  return {
    schemaVersion:2,code:String(code),name:name||String(code),price:String(price),change:n(change),chgPct:pct,chg:pct,
    currency:currency||null,status:status||'按数据源',provider:provider||source||'unknown',source:source||provider||'unknown',
    market:market||marketOf(code),delayed:typeof delayed==='boolean'?delayed:null,
    delayMinutes:Number.isFinite(Number(delayMinutes))?Number(delayMinutes):null,isMock:!!isMock,
    quoteTime:quoteTime||null,quoteDate:quoteDate||null,fetchedAt:fetchTs,timestamp:fetchTs,_edgeCache:!!_edgeCache
  }
}
function normalizeUSQuote(symbol,payload){
  const q=payload?.['Global Quote'];
  if(!q||!q['05. price'])return null;
  return quoteV2({
    code:symbol,name:symbol,price:q['05. price'],change:q['09. change'],chgPct:q['10. change percent'],currency:'USD',
    status:'按数据源',provider:'alpha_vantage',source:'alpha_vantage',market:'US',delayed:null,delayMinutes:null,
    quoteTime:null,quoteDate:q['07. latest trading day']||null,fetchedAt:Date.now()
  })
}
async function avQuery(params,key){
  const url=new URL(AV_BASE);Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));url.searchParams.set('apikey',key);
  const res=await fetch(url.toString(),{headers:{Accept:'application/json'}});
  if(!res.ok)throw new Error(`upstream_http_${res.status}`);
  const payload=await res.json();
  if(payload?.Note||payload?.Information)throw new Error('upstream_rate_limited');
  if(payload?.['Error Message'])throw new Error('upstream_invalid_symbol');
  return payload
}
async function edgeCached(key,ttl,producer){
  const cache=globalThis.caches?.default, req=new Request(`https://hangqing-cache.invalid/${encodeURIComponent(key)}`);
  if(cache){try{const hit=await cache.match(req);if(hit){const v=await hit.json();if(v&&typeof v==='object')v._edgeCache=true;return v}}catch(e){}}
  const value=await producer();
  if(cache){try{await cache.put(req,new Response(JSON.stringify(value),{headers:{'Content-Type':'application/json','Cache-Control':`public, max-age=${ttl}`}}))}catch(e){}}
  return value
}
async function usQuote(symbol,env){return edgeCached(`quote:US:${symbol}`,QUOTE_TTL,async()=>{
  const payload=await avQuery({function:'GLOBAL_QUOTE',symbol},env.ALPHA_VANTAGE_API_KEY),q=normalizeUSQuote(symbol,payload);
  if(!q)throw new Error('quote_unavailable');return q
})}
async function externalProxyQuote(code,market,env){
  const base=market==='CN'?env.CN_PROVIDER_URL:env.HK_PROVIDER_URL;if(!base)throw new Error('provider_not_configured');
  const token=market==='CN'?env.CN_PROVIDER_TOKEN:env.HK_PROVIDER_TOKEN,u=new URL(base.replace(/\/$/,'')+'/quote');u.searchParams.set('code',code);
  const headers={Accept:'application/json'};if(token)headers.Authorization=`Bearer ${token}`;
  const res=await fetch(u.toString(),{headers});if(!res.ok)throw new Error(`upstream_http_${res.status}`);
  const q=await res.json();if(!q||q.price==null)throw new Error('quote_unavailable');
  return quoteV2({
    code,name:q.name||code,price:q.price,change:q.change,chgPct:q.chgPct??q.chg,currency:currencyFor(market,q),
    status:q.status||'按数据源',provider:market==='CN'?'cn_proxy':'hk_proxy',source:q.source||(market==='CN'?'cn_proxy':'hk_proxy'),market,
    delayed:q.delayed,delayMinutes:q.delayMinutes,quoteTime:q.quoteTime,quoteDate:q.quoteDate,fetchedAt:q.fetchedAt||q.timestamp,isMock:false
  })
}
async function quoteOne(code,env){
  const market=marketOf(code),provider=providerFor(market,env);
  if(!provider)throw new Error(market==='OTHER'?'unsupported_symbol':'provider_not_configured');
  return provider==='alpha_vantage'?usQuote(code,env):externalProxyQuote(code,market,env)
}
async function quotes(request,env){
  const url=new URL(request.url),raw=[...new Set((url.searchParams.get('codes')||'').split(',').map(s=>s.trim()).filter(Boolean))].slice(0,MAX_CODES);
  if(!raw.length)return json({error:'missing_codes'},400,env);
  const settled=await Promise.all(raw.map(async code=>{try{return{ok:true,code,value:await quoteOne(code,env)}}catch(e){return{ok:false,code,error:e.message||'quote_failed'}}}));
  const data=settled.filter(x=>x.ok).map(x=>x.value),errors=settled.filter(x=>!x.ok).map(x=>({code:x.code,market:marketOf(x.code),error:x.error}));
  const status=data.length?200:502;
  return json({data,errors,meta:{gateway:'v71',schemaVersion:2,requested:raw.length,returned:data.length,partial:data.length>0&&errors.length>0,fetchedAt:Date.now(),cacheTtlSeconds:QUOTE_TTL}},status,env)
}
function normalizeSeries(payload,key,limit=180){
  const series=payload?.[key];if(!series)return[];
  return Object.entries(series).slice(0,limit).map(([date,v])=>({ts:new Date(`${date}T00:00:00Z`).getTime(),o:n(v['1. open']),h:n(v['2. high']),l:n(v['3. low']),c:n(v['4. close']),v:n(v['5. volume'])})).filter(p=>p.c!=null).sort((a,b)=>a.ts-b.ts)
}
function historySpec(period){
  const p=String(period||'1d').toLowerCase();
  if(['1d','daily'].includes(p))return{period:'1d',fn:'TIME_SERIES_DAILY',key:'Time Series (Daily)',params:{outputsize:'compact'}};
  if(['1w','weekly'].includes(p))return{period:'1w',fn:'TIME_SERIES_WEEKLY',key:'Weekly Time Series',params:{}};
  if(['1m','monthly'].includes(p))return{period:'1m',fn:'TIME_SERIES_MONTHLY',key:'Monthly Time Series',params:{}};
  return null
}
async function history(request,env){
  const url=new URL(request.url),code=(url.searchParams.get('code')||'').trim(),period=(url.searchParams.get('period')||'1d').toLowerCase();
  if(!code)return json({error:'missing_code'},400,env);
  const market=marketOf(code);if(market!=='US')return json({error:'history_provider_not_configured',market},501,env);
  if(!env.ALPHA_VANTAGE_API_KEY)return json({error:'server_not_configured'},503,env);
  const spec=historySpec(period);if(!spec)return json({error:'unsupported_period',supported:['1d','1w','1m']},400,env);
  try{
    const result=await edgeCached(`history:US:${code}:${spec.period}`,HISTORY_TTL,async()=>{
      const payload=await avQuery({function:spec.fn,symbol:code,...spec.params},env.ALPHA_VANTAGE_API_KEY),points=normalizeSeries(payload,spec.key);
      if(!points.length)throw new Error('history_unavailable');
      return {code,period:spec.period,market:'US',provider:'alpha_vantage',source:'alpha_vantage',currency:'USD',isMock:false,points,meta:{schemaVersion:2,count:points.length,fetchedAt:Date.now(),cacheTtlSeconds:HISTORY_TTL}}
    });
    return json(result,200,env)
  }catch(e){return json({error:e.message||'history_failed',code},502,env)}
}
function parseCalendarPayload(payload,market){const src=payload?.markets?.[market]??payload?.[market]??payload?.dates??[];return Array.isArray(src)?src.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(String(x))).map(String):[]}
async function loadCalendarSource(env){
  if(env.CALENDAR_JSON){try{return JSON.parse(env.CALENDAR_JSON)}catch(e){throw new Error('calendar_json_invalid')}}
  if(!env.CALENDAR_URL)throw new Error('calendar_not_configured');
  const res=await fetch(env.CALENDAR_URL,{headers:{Accept:'application/json'}});if(!res.ok)throw new Error(`calendar_http_${res.status}`);return res.json()
}
async function calendar(request,env){
  const market=(new URL(request.url).searchParams.get('market')||'').toUpperCase();
  if(!['US','CN','HK','JP','KR','EU'].includes(market))return json({error:'unsupported_market'},400,env);
  if(!env.CALENDAR_JSON&&!env.CALENDAR_URL)return json({error:'calendar_not_configured'},501,env);
  try{const result=await edgeCached(`calendar:${market}`,CALENDAR_TTL,async()=>{const payload=await loadCalendarSource(env),dates=parseCalendarPayload(payload,market);return {market,dates,source:env.CALENDAR_URL?'external_url':'env_json',fetchedAt:Date.now(),meta:{count:dates.length,cacheTtlSeconds:CALENDAR_TTL}}});return json(result,200,env)}catch(e){return json({error:e.message||'calendar_failed',market},502,env)}
}
function providers(env){return {
  US:{configured:!!env.ALPHA_VANTAGE_API_KEY,provider:'alpha_vantage',quotes:true,history:['1d','1w','1m'],market:'US'},
  CN:{configured:!!env.CN_PROVIDER_URL,provider:'cn_proxy',quotes:!!env.CN_PROVIDER_URL,history:[],market:'CN'},
  HK:{configured:!!env.HK_PROVIDER_URL,provider:'hk_proxy',quotes:!!env.HK_PROVIDER_URL,history:[],market:'HK'},
  JP:{configured:false,provider:null,quotes:false,history:[],market:'JP'},KR:{configured:false,provider:null,quotes:false,history:[],market:'KR'},EU:{configured:false,provider:null,quotes:false,history:[],market:'EU'}
}}
function health(env){
  const p=providers(env),scope=Object.entries(p).filter(([,v])=>v.configured).map(([k])=>k);
  return {ok:true,service:'hangqing-wanxiang-gateway',version:'71',schemaVersion:2,providers:p,scope,ready:scope.length>0,limits:{quotesPerRequest:MAX_CODES},cache:{quotesSeconds:QUOTE_TTL,historySeconds:HISTORY_TTL,calendarSeconds:CALENDAR_TTL},features:{historyPeriods:['1d','1w','1m'],calendar:!!(env.CALENDAR_JSON||env.CALENDAR_URL),quoteSchema:['price','change','chgPct','currency','delayed','delayMinutes','quoteTime','quoteDate','fetchedAt','source']},fetchedAt:Date.now()}
}
function ready(env){const h=health(env),us=h.providers.US;return {ok:!!h.ready,version:h.version,schemaVersion:h.schemaVersion,liveMarkets:h.scope,US:{configured:us.configured,quotes:us.configured&&us.quotes,history:us.configured?us.history:[]},note:us.configured?'US provider configured; freshness depends on provider entitlement.':'No live provider configured yet.',fetchedAt:Date.now()}}
export default {async fetch(request,env){
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors(env)});
  const url=new URL(request.url);
  if(url.pathname==='/health'&&request.method==='GET')return json(health(env),200,env);
  if(url.pathname==='/ready'&&request.method==='GET')return json(ready(env),200,env);
  if(url.pathname==='/quotes'&&request.method==='GET')return quotes(request,env);
  if(url.pathname==='/history'&&request.method==='GET')return history(request,env);
  if(url.pathname==='/calendar'&&request.method==='GET')return calendar(request,env);
  return json({error:'not_found'},404,env)
}};
