// V60: runnable HTTP-proxy provider, provider center, delay policy and exchange-calendar readiness.
(function(){
 const ENDPOINT_KEY='hw-proxy-endpoint-v1';
 const PROVIDER_KEY='hw-data-provider-v1';
 const TIMEOUT_MS=8000;
 function getEndpoint(){return (localStorage.getItem(ENDPOINT_KEY)||'').trim().replace(/\/$/,'')}
 function setEndpoint(v){localStorage.setItem(ENDPOINT_KEY,String(v||'').trim().replace(/\/$/,''))}
 function normalizeQuote(q){if(!q||!q.code)return null;const chg=Number(q.chg);return {code:String(q.code),name:q.name||q.code,price:q.price==null?'—':String(q.price),chg:Number.isFinite(chg)?chg:0,status:q.status||'—',provider:q.provider||'proxy',isMock:false,timestamp:Number(q.timestamp)||Date.now()}}
 function unpack(payload){const list=Array.isArray(payload)?payload:Array.isArray(payload?.data)?payload.data:Array.isArray(payload?.quotes)?payload.quotes:[];return list.map(normalizeQuote).filter(Boolean)}
 async function proxyBatch(codes){const base=getEndpoint();if(!base)throw new Error('proxy_endpoint_not_configured');const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);try{const url=`${base}/quotes?codes=${encodeURIComponent((codes||[]).join(','))}`;const res=await fetch(url,{headers:{Accept:'application/json'},signal:controller.signal,cache:'no-store'});if(!res.ok)throw new Error(`proxy_http_${res.status}`);const data=unpack(await res.json());if(!data.length)throw new Error('proxy_empty_quotes');return data}finally{clearTimeout(timer)}}
 window.HttpProxyMarketAdapter={batch:proxyBatch};
 if(window.MarketDataService){
  MarketDataService.register?.('proxy',HttpProxyMarketAdapter);
  const saved=localStorage.getItem(PROVIDER_KEY);if(saved==='proxy'&&getEndpoint())MarketDataService.setProvider?.('proxy');
 }
 // Explicit delay policy. These are display policies, not claims about a vendor's actual latency.
 window.QuoteDelayPolicy={
  policyFor(x){if(!x)return{label:'未知',seconds:null};if(MarketDataService?.provider==='mock')return{label:'模拟数据',seconds:null};if(x.type==='股票')return{label:'按数据源',seconds:null};if(['商品','外汇','债券','指数'].includes(x.type))return{label:'按数据源授权',seconds:null};return{label:'按数据源',seconds:null}}
 };
 if(window.ExchangeCalendar){
  ExchangeCalendar.meta=ExchangeCalendar.meta||{};
  ExchangeCalendar.install=function(kind,dates,source){this.load(kind,dates);this.meta[kind]={source:source||'external',updatedAt:Date.now(),count:Array.isArray(dates)?dates.length:0}};
  ExchangeCalendar.info=function(kind){return this.meta[kind]||{source:null,updatedAt:null,count:(this.holidays[kind]||[]).length}}
 }
 function providerName(){return MarketDataService?.provider==='proxy'?'HTTP Proxy':'Mock 模拟源'}
 function providerCenter(){const ep=getEndpoint(),active=MarketDataService?.provider||'mock';return `<div class="provider-center"><div class="section-head"><b>行情数据源</b><span>Provider v1</span></div><div class="provider-choice"><button data-provider="mock" class="${active==='mock'?'active':''}"><b>Mock</b><span>内置模拟数据</span></button><button data-provider="proxy" class="${active==='proxy'?'active':''}"><b>HTTP Proxy</b><span>连接你的后端行情网关</span></button></div><label class="endpoint-field"><span>后端地址</span><input data-proxy-endpoint value="${ep.replace(/"/g,'&quot;')}" placeholder="https://your-api.example.com"><small>前端只请求 /quotes?codes=…；API Key 应保存在后端，不要写进 GitHub Pages。</small></label><div class="provider-actions"><button data-save-provider>保存并切换</button><button data-test-provider>测试连接</button></div><div class="provider-test" data-provider-test><i></i><span>${active==='proxy'?(ep?'Proxy 已配置':'Proxy 未配置'):'当前使用 Mock 模拟源'}</span></div><div class="provider-contract"><b>接口返回格式</b><code>{ data: [{ code, name, price, chg, status, timestamp }] }</code><small>也兼容直接返回数组或 { quotes: [...] }。</small></div></div>`}
 function calendarCard(){const kinds=['A股','港股','美股','日本','韩国','欧洲'];return `<div class="calendar-ready"><div class="section-head"><b>交易所日历</b><span>节假日接口</span></div>${kinds.map(k=>{const i=ExchangeCalendar?.info?.(k)||{count:0,source:null};return `<div><b>${k}</b><span>${i.count?`${i.count} 个日期`:'尚未加载官方日历'}</span><em class="${i.count?'ready':'pending'}">${i.count?'已加载':'待接入'}</em></div>`}).join('')}<small>当前开闭市判断仍以常规交易时段为主。只有加载可信交易所日历后，才会把节假日纳入自动判断。</small></div>`}
 function delayCard(){return `<div class="delay-policy"><div class="section-head"><b>延迟标识策略</b><span>${providerName()}</span></div><div><b>实时</b><span>仅当数据源明确提供实时授权时显示</span></div><div><b>延迟</b><span>由 Provider 返回或配置具体延迟分钟数</span></div><div><b>缓存</b><span>请求失败时明确标记“最近一次可用数据”</span></div><div><b>模拟</b><span>当前 Mock 数据始终明确标识，不冒充实时行情</span></div></div>`}
 function installProviderCenter(){if(state.page!=='数据')return;const c=el('content');if(!c||c.querySelector('.provider-center'))return;c.insertAdjacentHTML('afterbegin',providerCenter());const ready=c.querySelector('.provider-ready');if(ready)ready.insertAdjacentHTML('afterend',delayCard()+calendarCard());else c.insertAdjacentHTML('beforeend',delayCard()+calendarCard());bindProviderCenter(c)}
 function status(root,text,state){const box=root.querySelector('[data-provider-test]');if(!box)return;box.className=`provider-test ${state||''}`;box.querySelector('span').textContent=text}
 function bindProviderCenter(root){
  root.querySelectorAll('[data-provider]').forEach(b=>b.onclick=()=>{root.querySelectorAll('[data-provider]').forEach(z=>z.classList.toggle('active',z===b));b.dataset.selected='1'});
  root.querySelector('[data-save-provider]')?.addEventListener('click',()=>{const input=root.querySelector('[data-proxy-endpoint]'),selected=root.querySelector('[data-provider].active')?.dataset.provider||'mock';setEndpoint(input?.value||'');if(selected==='proxy'&&!getEndpoint()){status(root,'请先填写后端地址','error');return}MarketDataService.setProvider?.(selected);localStorage.setItem(PROVIDER_KEY,selected);status(root,selected==='proxy'?'已切换到 HTTP Proxy':'已切换到 Mock 模拟源','ok');setTimeout(()=>renderAll(),250)});
  root.querySelector('[data-test-provider]')?.addEventListener('click',async e=>{const input=root.querySelector('[data-proxy-endpoint]');setEndpoint(input?.value||'');if(!getEndpoint()){status(root,'请先填写后端地址','error');return}const b=e.currentTarget;b.disabled=true;b.textContent='测试中…';status(root,'正在请求示例行情…','loading');try{const sample=await HttpProxyMarketAdapter.batch(['NVDA','AAPL','XAU/USD']);status(root,`连接成功 · 返回 ${sample.length} 条行情`,'ok')}catch(err){status(root,`连接失败 · ${err?.message||'unknown_error'}`,'error')}finally{b.disabled=false;b.textContent='测试连接'}})
 }
 function annotateQuotes(){document.querySelectorAll('.row[data-name]').forEach(r=>{const x=assets.find(a=>a.name===r.dataset.name);if(!x||r.querySelector('.source-chip'))return;const p=QuoteDelayPolicy.policyFor(x),chip=document.createElement('span');chip.className='source-chip';chip.textContent=x._fromCache?'缓存':MarketDataService?.provider==='mock'?'模拟':p.label;r.appendChild(chip)})}
 const baseRender=renderAll;renderAll=function(){baseRender();installProviderCenter();annotateQuotes()};
 document.addEventListener('marketdata:updated',()=>annotateQuotes());
})();