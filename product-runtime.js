// 行情万象 Product Runtime V69
// V69 starts the physical consolidation phase: one stable runtime for render/detail hooks,
// quote schema normalization and request coordination. Legacy product layers remain compatible.
(function(){
 const R=window.ProductRuntime||{};
 const renderHooks=R._renderHooks||[],detailHooks=R._detailHooks||[];
 R.version=69;R._renderHooks=renderHooks;R._detailHooks=detailHooks;
 R.afterRender=function(fn){if(typeof fn==='function'&&!renderHooks.includes(fn))renderHooks.push(fn)};
 R.afterDetail=function(fn){if(typeof fn==='function'&&!detailHooks.includes(fn))detailHooks.push(fn)};
 R.run=function(){renderHooks.slice().forEach(fn=>{try{fn()}catch(e){console.warn('render hook failed',e)}})};
 R.runDetail=function(x){detailHooks.slice().forEach(fn=>{try{fn(x)}catch(e){console.warn('detail hook failed',e)}})};
 window.ProductRuntime=R;
 function num(v){const n=Number(String(v??'').replace('%',''));return Number.isFinite(n)?n:null}
 function normalize(q){if(!q||!q.code)return q;const pct=num(q.chgPct??q.chg)??0;return {...q,schemaVersion:q.schemaVersion||2,price:q.price==null?'—':String(q.price),change:num(q.change),chgPct:pct,chg:pct,currency:q.currency||null,delayed:typeof q.delayed==='boolean'?q.delayed:null,delayMinutes:num(q.delayMinutes),source:q.source||q.provider||'unknown',timestamp:Number(q.timestamp)||Date.now()}}
 window.QuoteSchema={version:2,fields:['code','name','price','change','chgPct','currency','delayed','delayMinutes','timestamp','source'],normalize};
 window.MarketRequestCoordinator=window.MarketRequestCoordinator||{pending:new Map(),run(key,producer){if(this.pending.has(key))return this.pending.get(key);const p=Promise.resolve().then(producer).finally(()=>this.pending.delete(key));this.pending.set(key,p);return p}};
 function card(){if(typeof state==='undefined'||state.page!=='数据')return;const c=typeof el==='function'?el('content'):null;if(!c||c.querySelector('.v69-runtime'))return;c.insertAdjacentHTML('beforeend',`<div class="v69-runtime"><div class="section-head"><b>统一产品运行时</b><span>V69</span></div><div class="v69-runtime-grid"><div><small>Render Hooks</small><b>${renderHooks.length}</b></div><div><small>Detail Hooks</small><b>${detailHooks.length}</b></div><div><small>Quote Schema</small><b>v2</b></div><div><small>请求协调</small><b>启用</b></div></div><small>V69 开始物理收敛。新功能只进入 product-runtime.js；旧版本层仅作为兼容模块，后续按功能迁移后逐批移除。</small></div>`)}
 R.afterRender(card);
})();