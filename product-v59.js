// V59: quote cache, freshness/stale UX, client-side alert evaluation and provider readiness.
(function(){
 const CACHE_KEY='hw-quote-cache-v1', TRIGGER_KEY='hw-alert-trigger-history-v1';
 const STALE_MS=2*60*1000, EXPIRE_MS=30*60*1000;
 function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
 function writeJSON(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
 function now(){return Date.now()}
 function num(v){const n=parseFloat(String(v??'').replace(/,/g,'').replace('%',''));return Number.isFinite(n)?n:null}
 window.QuoteCacheService={
  all(){const x=readJSON(CACHE_KEY,{});return x&&typeof x==='object'?x:{}},
  put(list){const c=this.all(),ts=now();(list||[]).forEach(q=>{if(!q?.code)return;c[q.code]={...q,timestamp:q.timestamp||ts,cacheSavedAt:ts}});writeJSON(CACHE_KEY,c)},
  get(code){return this.all()[code]||null},
  age(code){const q=this.get(code);return q?now()-(q.timestamp||q.cacheSavedAt||0):Infinity},
  state(code){const a=this.age(code);return a<=STALE_MS?'fresh':a<=EXPIRE_MS?'stale':'expired'},
  fallback(codes){const c=this.all(),wanted=codes?.length?new Set(codes):null;return Object.values(c).filter(q=>!wanted||wanted.has(q.code)).filter(q=>this.state(q.code)!=='expired').map(q=>({...q,fromCache:true}))}
 };
 function mergeQuotes(list){(list||[]).forEach(q=>{const x=assets.find(a=>a.code===q.code);if(!x)return;if(q.price!=null)x.price=String(q.price);if(Number.isFinite(+q.chg))x.chg=+q.chg;if(q.status)x.status=q.status;x._quoteTimestamp=q.timestamp||now();x._provider=q.provider||MarketDataService?.provider||'mock';x._fromCache=!!q.fromCache})}
 if(window.MarketDataService){
  const baseRefresh=MarketDataService.refresh?.bind(MarketDataService);
  MarketDataService.refresh=async function(codes){try{const list=await baseRefresh(codes);const normalized=(list||[]).map(q=>({...q,timestamp:q.timestamp||now(),provider:q.provider||this.provider,isMock:q.isMock??this.provider==='mock'}));QuoteCacheService.put(normalized);mergeQuotes(normalized);return normalized}catch(e){const fallback=QuoteCacheService.fallback(codes);if(fallback.length){mergeQuotes(fallback);this.lastUpdated=Math.max(...fallback.map(q=>q.timestamp||q.cacheSavedAt||0));document.dispatchEvent(new CustomEvent('marketdata:cache-fallback',{detail:{count:fallback.length,at:this.lastUpdated}}));return fallback}throw e}}
 }
 function ageText(ts){if(!ts)return'尚未刷新';const s=Math.max(0,Math.round((now()-ts)/1000));if(s<60)return`${s}秒前`;const m=Math.round(s/60);if(m<60)return`${m}分钟前`;return`${Math.round(m/60)}小时前`}
 function globalFreshness(){const ts=MarketDataService?.lastUpdated||Math.max(0,...assets.map(x=>x._quoteTimestamp||0));const age=ts?now()-ts:Infinity;return {ts,state:age<=STALE_MS?'fresh':age<=EXPIRE_MS?'stale':'expired'}}
 function freshnessBadge(){const f=globalFreshness(),mock=MarketDataService?.provider==='mock';const title=f.state==='fresh'?'数据新鲜':f.state==='stale'?'数据可能延迟':'暂无近期刷新';return `<div class="freshness ${f.state}" data-freshness><div><i></i><b>${title}</b><span>${mock?'Mock 模拟源 · ':''}${ageText(f.ts)}</span></div><small>${f.state==='stale'?'继续显示最近一次可用数据':f.state==='expired'?'等待下一次成功刷新':'已启用本地缓存兜底'}</small></div>`}
 function installFreshness(){if(!['首页','数据'].includes(state.page))return;const c=el('content');if(!c||c.querySelector('[data-freshness]'))return;const anchor=c.querySelector('.health-banner')||c.querySelector('.data-health-card')||c.firstElementChild;anchor?.insertAdjacentHTML('afterend',freshnessBadge())}
 function updateFreshness(){const old=document.querySelector('[data-freshness]');if(!old)return;const wrap=document.createElement('div');wrap.innerHTML=freshnessBadge();old.replaceWith(wrap.firstElementChild)}
 function rules(){return window.PriceAlertService?.all?.()||{}}
 function triggered(){const x=readJSON(TRIGGER_KEY,[]);return Array.isArray(x)?x:[]}
 function saveTriggered(x){writeJSON(TRIGGER_KEY,x.slice(0,40))}
 function shouldTrigger(x,r){const p=num(x.price);if(p===null||!r?.enabled)return false;if(r.mode==='above')return p>=+r.value;if(r.mode==='below')return p<=+r.value;return Math.abs(+x.chg||0)>=+r.value}
 function evaluateAlerts(){const rs=rules(),hist=triggered(),cooldown=15*60*1000;let added=0;Object.entries(rs).forEach(([name,r])=>{const x=assets.find(a=>a.name===name);if(!x||!shouldTrigger(x,r))return;const prev=hist.find(h=>h.name===name&&h.mode===r.mode&&h.value===r.value);if(prev&&now()-prev.at<cooldown)return;hist.unshift({name,code:x.code,mode:r.mode,value:r.value,price:x.price,chg:x.chg,at:now()});added++});if(added){saveTriggered(hist);document.dispatchEvent(new CustomEvent('alerts:triggered',{detail:{count:added}}))}}
 function ruleText(h){if(h.mode==='above')return`价格达到 ${h.value}`;if(h.mode==='below')return`价格低于 ${h.value}`;return`涨跌幅达到 ±${h.value}%`}
 function alertHistory(){const a=triggered().slice(0,8);return `<div class="trigger-card"><div class="section-head"><b>触发记录</b><span>仅应用打开期间判断</span></div>${a.length?`<div class="trigger-list">${a.map(h=>`<button data-trigger-open="${h.name}"><div><b>${h.name}</b><small>${ruleText(h)}</small></div><div><strong>${h.price}</strong><span>${new Date(h.at).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}</span></div></button>`).join('')}</div><button class="trigger-clear" data-trigger-clear>清空记录</button>`:`<div class="trigger-empty">暂无触发记录。当前版本只会在网页打开并刷新行情时判断规则，不代表后台推送。</div>`}</div>`}
 function installAlertHistory(){if(state.page!=='自选')return;const c=el('content');if(!c||c.querySelector('.trigger-card'))return;c.insertAdjacentHTML('beforeend',alertHistory());c.querySelectorAll('[data-trigger-open]').forEach(b=>b.onclick=()=>openDetail(b.dataset.triggerOpen));c.querySelector('[data-trigger-clear]')?.addEventListener('click',()=>{writeJSON(TRIGGER_KEY,[]);renderAll()})}
 function providerReadiness(){const rows=[['股票','未接入','A股/港股/美股/日欧韩'],['指数','未接入','全球主要指数'],['商品','未接入','贵金属/工业金属/能源'],['外汇','未接入','DXY 与主要货币对'],['债券','未接入','美债收益率']];return `<div class="provider-ready"><div class="section-head"><b>真实数据接入准备</b><span>Provider v1</span></div>${rows.map(r=>`<div><b>${r[0]}</b><span>${r[2]}</span><em>${r[1]}</em></div>`).join('')}<small>正式接入时会分别配置数据源、延迟级别、授权范围与失败回退策略。</small></div>`}
 function installProviderReadiness(){if(state.page!=='数据')return;const c=el('content');if(!c||c.querySelector('.provider-ready'))return;c.insertAdjacentHTML('beforeend',providerReadiness())}
 function markLoading(on){document.body.classList.toggle('market-loading',!!on);document.querySelectorAll('[data-refresh-now]').forEach(b=>{if(on)b.setAttribute('aria-busy','true');else b.removeAttribute('aria-busy')})}
 document.addEventListener('marketdata:health',e=>{markLoading(e.detail.status==='loading');if(e.detail.status==='ok'){updateFreshness();evaluateAlerts()}});
 document.addEventListener('marketdata:updated',()=>{updateFreshness();evaluateAlerts()});
 document.addEventListener('marketdata:cache-fallback',()=>updateFreshness());
 document.addEventListener('alerts:triggered',()=>{if(state.page==='自选')renderAll()});
 const baseRender=renderAll;renderAll=function(){baseRender();installFreshness();installAlertHistory();installProviderReadiness()};
 setInterval(()=>{if(document.visibilityState==='visible')updateFreshness()},30000);
})();