// 行情万象 · Quote Integrity UI V75
(function(){
'use strict';
const fmtTime=v=>{if(!v)return'—';const d=new Date(v);return Number.isNaN(d.getTime())?'—':d.toLocaleString('zh-CN',{hour12:false})};
function statusOf(q){
  if(!q)return{key:'unavailable',label:'暂不可用',note:'没有可验证的行情数据'};
  if(q.isMock)return{key:'mock',label:'Mock 演示',note:'演示数据，不是实时行情'};
  if(q.isSandbox)return{key:'sandbox',label:'Sandbox 测试',note:'开发测试行情，不代表正式行情权限'};
  if(q._fromCache||q._staleCache||q._edgeCache)return{key:'cache',label:'缓存行情',note:'当前展示最近一次真实行情缓存'};
  if(q.delayed===true)return{key:'delayed',label:q.delayMinutes!=null?`延迟 ${q.delayMinutes} 分钟`:'延迟行情',note:'数据源明确声明为延迟行情'};
  if(q.isMock===false&&q.delayed===false)return{key:'real',label:'正式行情',note:'数据源返回非 Mock 且明确声明非延迟'};
  if(q.isMock===false)return{key:'unknown',label:'时效未声明',note:'真实数据源已返回报价，但未声明实时/延迟权限'};
  return{key:'unavailable',label:'暂不可用',note:'无法确认行情属性'};
}
window.QuoteIntegrity={statusOf};
function currentAsset(){
  const code=document.getElementById('detailCode')?.textContent||'';
  if(typeof assets==='undefined')return null;
  return assets.find(a=>code.includes(a.code))||null;
}
function paint(){
  const root=document.querySelector('.trade-detail .runtime-detail-blocks');
  const q=currentAsset();
  if(!root||!q)return;
  const s=statusOf(q), live=root.querySelector('.runtime-live');
  if(!live)return;
  live.dataset.integrity=s.key;
  const src=live.querySelector('[data-runtime-source]');
  if(src)src.textContent=s.label;
  const dot=live.querySelector('i');
  if(dot){dot.classList.remove('real');if(s.key==='real')dot.classList.add('real')}
  const msg=live.querySelector('[data-runtime-msg]');
  if(msg)msg.textContent=s.note;
  let meta=live.querySelector('.integrity-times');
  if(!meta){meta=document.createElement('div');meta.className='integrity-times';live.appendChild(meta)}
  meta.innerHTML=`<span>行情时间 <b>${fmtTime(q.quoteTime||q.quoteDate)}</b></span><span>获取时间 <b>${fmtTime(q.fetchedAt||q.timestamp)}</b></span>`;
}
function repaintPrice(){
  const q=currentAsset(), trade=document.querySelector('.trade-detail');if(!q||!trade)return;
  const price=trade.querySelector('.big-price,.price-main,.quote-price,.current-price');
  if(price&&q.price!=null)price.textContent=q.price;
  const change=trade.querySelector('.price-change,.quote-change,.change-main');
  if(change){const pct=Number(q.chgPct??q.chg);const ch=Number(q.change);change.textContent=`${Number.isFinite(ch)?(ch>=0?'+':'')+ch:''}${Number.isFinite(pct)?`  ${pct>=0?'+':''}${pct.toFixed(2)}%`:''}`.trim();change.classList.toggle('up',pct>=0);change.classList.toggle('down',pct<0)}
}
document.addEventListener('marketdata:updated',()=>setTimeout(()=>{paint();repaintPrice()},0));
const obs=new MutationObserver(()=>paint());
document.addEventListener('DOMContentLoaded',()=>{const sheet=document.getElementById('detailSheet');if(sheet)obs.observe(sheet,{subtree:true,childList:true});setTimeout(paint,100)});
})();