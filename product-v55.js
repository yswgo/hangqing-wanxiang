// V55: market-specific stock detail behavior, persistent reminders and real share/copy action.
(function(){
 const REMINDER_KEY='hw-price-reminders-v1';
 function getReminders(){try{return new Set(JSON.parse(localStorage.getItem(REMINDER_KEY)||'[]'))}catch(e){return new Set()}}
 function saveReminders(set){localStorage.setItem(REMINDER_KEY,JSON.stringify([...set]))}
 function marketKind(x){if(x.tag==='A股')return'A股';if(x.tag==='港股')return'港股';if(x.region==='美股')return'美股';if(x.region==='日本')return'日本';if(x.region==='韩国')return'韩国';if(x.region==='欧洲')return'欧洲';return x.region||'全球'}
 function sessionInfo(x){const k=marketKind(x);const map={
  'A股':['人民币 CNY','09:30–11:30 / 13:00–15:00','集合竞价 + 连续竞价'],
  '港股':['港币 HKD','09:30–12:00 / 13:00–16:00','港股连续交易时段'],
  '美股':['美元 USD','09:30–16:00 ET','支持盘前 / 盘中 / 盘后'],
  '日本':['日元 JPY','09:00–11:30 / 12:30–15:30','东京交易所常规时段'],
  '韩国':['韩元 KRW','09:00–15:30','韩国交易所常规时段'],
  '欧洲':['欧元/本币','当地交易所时段','不同交易所时间略有差异']};return map[k]||['—','—','—']}
 function sidePanel(x){const k=marketKind(x),p=parseFloat(String(x.price).replace(/,/g,''))||0,step=Math.max(p*.001,.01);const f=n=>n.toLocaleString('zh-CN',{maximumFractionDigits:2});
  if(k==='A股'||k==='港股'){
   let o=`<div class="depth-title">五档盘口</div>`;for(let i=5;i>=1;i--)o+=`<div><span>卖${i}</span><b class="down">${f(p+i*step)}</b><em>${18+i*7}万</em></div>`;for(let i=1;i<=5;i++)o+=`<div><span>买${i}</span><b class="up">${f(p-i*step)}</b><em>${25+i*9}万</em></div>`;return o;
  }
  if(k==='美股')return `<div class="depth-title">美股时段</div><div class="session-quote"><span>盘前</span><b class="up">+0.36%</b></div><div class="session-quote"><span>常规</span><b class="${x.chg>=0?'up':'down'}">${x.chg>=0?'+':''}${x.chg.toFixed(2)}%</b></div><div class="session-quote"><span>盘后</span><b class="down">−0.12%</b></div><div class="bidask"><small>Bid</small><b>${f(p-step)}</b><small>Ask</small><b>${f(p+step)}</b></div><div class="side-note">模拟时段报价</div>`;
  return `<div class="depth-title">市场快照</div><div class="session-quote"><span>最新</span><b class="${x.chg>=0?'up':'down'}">${x.chg>=0?'+':''}${x.chg.toFixed(2)}%</b></div><div class="session-quote"><span>买价</span><b>${f(p-step)}</b></div><div class="session-quote"><span>卖价</span><b>${f(p+step)}</b></div><div class="session-quote"><span>状态</span><b>${x.status}</b></div><div class="side-note">不套用A股五档盘口</div>`;
 }
 function patchProfile(x){const panel=document.getElementById('stockPanel');if(!panel)return;const active=document.querySelector('#stockSubtabs button.active')?.dataset.panel;if(active!=='简况')return;const bad=[...panel.querySelectorAll('b')].find(n=>n.textContent==='undefined');if(bad)bad.textContent=x.tag||x.group||'代表个股'}
 function addMarketMeta(x){const q=document.querySelector('.quote-block');if(!q||document.querySelector('.market-meta'))return;const s=sessionInfo(x),k=marketKind(x);q.insertAdjacentHTML('afterend',`<div class="market-meta"><div><small>市场</small><b>${k}</b></div><div><small>计价</small><b>${s[0]}</b></div><div><small>常规时段</small><b>${s[1]}</b></div></div><div class="market-note">${s[2]} · 当前页面行情仍为模拟数据</div>`)}
 async function shareAsset(x,button){const text=`${x.name} ${x.code}  ${x.price}  ${x.chg>=0?'+':''}${x.chg.toFixed(2)}% · 行情万象`;try{if(navigator.share){await navigator.share({title:`${x.name} · 行情万象`,text,url:location.href});button.textContent='✓ 已分享'}else if(navigator.clipboard){await navigator.clipboard.writeText(text+' '+location.href);button.textContent='✓ 已复制'}else{button.textContent='分享不可用'}}catch(e){if(e&&e.name!=='AbortError')button.textContent='分享失败'}}
 const baseOpen=openDetail;
 openDetail=function(name){baseOpen(name);const x=assets.find(a=>a.name===name);if(!x||x.type!=='股票')return;
  const depth=document.querySelector('.trade-detail .depth');if(depth)depth.innerHTML=sidePanel(x);addMarketMeta(x);
  const reminders=getReminders(),alertBtn=document.querySelector('[data-action="alert"]'),shareBtn=document.querySelector('[data-action="share"]');
  if(alertBtn){alertBtn.textContent=reminders.has(name)?'✓ 已提醒':'提醒';alertBtn.classList.toggle('reminder-on',reminders.has(name));alertBtn.onclick=()=>{const s=getReminders();s.has(name)?s.delete(name):s.add(name);saveReminders(s);alertBtn.textContent=s.has(name)?'✓ 已提醒':'提醒';alertBtn.classList.toggle('reminder-on',s.has(name))}}
  if(shareBtn)shareBtn.onclick=()=>shareAsset(x,shareBtn);
  document.querySelectorAll('#stockSubtabs [data-panel]').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>patchProfile(x),0)));
  patchProfile(x)
 };
})();