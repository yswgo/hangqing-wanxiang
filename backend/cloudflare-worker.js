// 行情万象 · Cloudflare Worker 行情网关模板
// 目标：先支持美股 GLOBAL_QUOTE，API Key 仅保存在 Worker 环境变量中。
// 环境变量：ALPHA_VANTAGE_API_KEY（必填）
// 可选：ALLOW_ORIGIN，默认 *。

const AV_BASE='https://www.alphavantage.co/query';
const SUPPORTED_US=/^[A-Z][A-Z0-9.-]{0,9}$/;

function cors(env){return {
  'Access-Control-Allow-Origin':env.ALLOW_ORIGIN||'*',
  'Access-Control-Allow-Methods':'GET,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type,Accept',
  'Cache-Control':'no-store'
}}
function json(data,status,env){return new Response(JSON.stringify(data),{status,headers:{...cors(env),'Content-Type':'application/json; charset=utf-8'}})}
function n(v){const x=Number(String(v||'').replace('%',''));return Number.isFinite(x)?x:null}
function normalize(symbol,payload){const q=payload?.['Global Quote'];if(!q||!q['05. price'])return null;return {
  code:symbol,
  name:symbol,
  price:q['05. price'],
  chg:n(q['10. change percent'])??0,
  status:'按数据源',
  provider:'alpha_vantage',
  isMock:false,
  timestamp:Date.now()
}}
async function avQuote(symbol,key){const url=new URL(AV_BASE);url.searchParams.set('function','GLOBAL_QUOTE');url.searchParams.set('symbol',symbol);url.searchParams.set('apikey',key);const res=await fetch(url.toString(),{headers:{Accept:'application/json'}});if(!res.ok)throw new Error(`upstream_http_${res.status}`);const payload=await res.json();if(payload?.Note||payload?.Information)throw new Error('upstream_rate_limited');const q=normalize(symbol,payload);if(!q)throw new Error('quote_unavailable');return q}
async function quotes(request,env){if(!env.ALPHA_VANTAGE_API_KEY)return json({error:'server_not_configured',message:'Missing ALPHA_VANTAGE_API_KEY'},503,env);const url=new URL(request.url),raw=(url.searchParams.get('codes')||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,5);if(!raw.length)return json({error:'missing_codes'},400,env);const unsupported=raw.filter(s=>!SUPPORTED_US.test(s));const symbols=raw.filter(s=>SUPPORTED_US.test(s));const data=[],errors=[];for(const symbol of symbols){try{data.push(await avQuote(symbol,env.ALPHA_VANTAGE_API_KEY))}catch(e){errors.push({code:symbol,error:e.message||'quote_failed'})}}
  unsupported.forEach(code=>errors.push({code,error:'unsupported_symbol'}));
  return json({data,errors,meta:{provider:'alpha_vantage',scope:'US stocks first',requested:raw.length,returned:data.length,timestamp:Date.now()}},data.length?200:502,env)
}
export default {async fetch(request,env){if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors(env)});const url=new URL(request.url);if(url.pathname==='/health')return json({ok:true,service:'hangqing-wanxiang-gateway',provider:env.ALPHA_VANTAGE_API_KEY?'alpha_vantage':'unconfigured',scope:['US_STOCKS'],timestamp:Date.now()},200,env);if(url.pathname==='/quotes'&&request.method==='GET')return quotes(request,env);return json({error:'not_found'},404,env)}};
