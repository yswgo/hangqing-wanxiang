// 行情万象 · UX Runtime V76
(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function enhanceGroupSheet(){
 const sheet=$('#runtimeGroupSheet'); if(!sheet)return;
 $$('[data-ren]').forEach(btn=>{if(btn.dataset.v76)return;btn.dataset.v76='1';btn.onclick=e=>{e.preventDefault();e.stopPropagation();const old=btn.dataset.ren,row=btn.closest('.runtime-grow');if(!row)return;row.innerHTML=`<input class="v76-rename" maxlength="8" value="${String(old).replace(/"/g,'&quot;')}"><button data-v76-save>保存</button><button data-v76-cancel>取消</button>`;const input=row.querySelector('input');input.focus();input.select();const cancel=()=>{if(typeof renderGroupSheet==='function')renderGroupSheet()};row.querySelector('[data-v76-cancel]').onclick=cancel;row.querySelector('[data-v76-save]').onclick=()=>{const n=input.value.trim();if(window.WatchGroupService?.rename(old,n)){renderGroupSheet();if(typeof installWatch==='function')installWatch()}else{input.classList.add('invalid');input.focus()}};input.onkeydown=ev=>{if(ev.key==='Enter')row.querySelector('[data-v76-save]').click();if(ev.key==='Escape')cancel()};};});
}
function enhanceWatchSort(){
 if(typeof state==='undefined'||state.page!=='自选')return;const c=$('#content'),list=c?.querySelector('.watch-list');if(!list||c.querySelector('.v76-sort'))return;
 const bar=document.createElement('div');bar.className='v76-sort';bar.innerHTML='<span>排序</span><button data-sort="default" class="active">默认</button><button data-sort="chgDesc">涨幅</button><button data-sort="chgAsc">跌幅</button><button data-sort="name">名称</button>';list.before(bar);
 const original=[...list.querySelectorAll('.row[data-name]')].map(r=>r.dataset.name);
 const paint=mode=>{let names=[...original];if(typeof assets!=='undefined'){const get=n=>assets.find(a=>a.name===n);if(mode==='chgDesc')names.sort((a,b)=>(get(b)?.chg??-Infinity)-(get(a)?.chg??-Infinity));if(mode==='chgAsc')names.sort((a,b)=>(get(a)?.chg??Infinity)-(get(b)?.chg??Infinity));if(mode==='name')names.sort((a,b)=>a.localeCompare(b,'zh-CN'))}const map=new Map([...list.querySelectorAll('.row[data-name]')].map(r=>[r.dataset.name,r]));names.forEach(n=>{const r=map.get(n);if(r)list.appendChild(r)});};
 bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{bar.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));paint(b.dataset.sort)});
}
async function enhanceData(){
 if(typeof state==='undefined'||state.page!=='数据')return;const c=$('#content');if(!c||c.querySelector('.v76-gateway'))return;
 const card=document.createElement('div');card.className='v76-gateway';card.innerHTML='<div class="section-head"><b>Gateway 诊断</b><span>V76</span></div><div data-v76diag>正在读取…</div><div class="provider-actions"><button data-v76ready>检测 /ready</button><button data-v76webull>测试 Webull AAPL</button></div>';c.appendChild(card);const out=card.querySelector('[data-v76diag]');
 const base=String(localStorage.getItem('hw-proxy-endpoint-v1')||'').replace(/\/$/,'');async function get(path){if(!base)throw Error('未配置 Gateway');const r=await fetch(base+path,{cache:'no-store'}),j=await r.json();if(!r.ok)throw Error(j.error||`HTTP ${r.status}`);return j}
 async function ready(){try{const j=await get('/ready');out.innerHTML=`<b>Gateway V${j.version||'—'}</b><span>Schema v${j.schemaVersion||'—'} · ${j.ok?'可用':'异常'}</span>`}catch(e){out.textContent='检测失败 · '+e.message}}
 card.querySelector('[data-v76ready]').onclick=ready;card.querySelector('[data-v76webull]').onclick=async()=>{out.textContent='测试中…';try{const j=await get('/test/webull'),q=j.quote||{};out.innerHTML=`<b>${j.ok?'Webull Sandbox 可用':'测试失败'}</b><span>AAPL ${q.price||'—'} · ${q.isSandbox?'Sandbox 测试':'状态未知'} · ${q.quoteTime?new Date(q.quoteTime).toLocaleString('zh-CN',{hour12:false}):'无行情时间'}</span>`}catch(e){out.textContent='Webull 测试失败 · '+e.message}};ready();
}
function run(){enhanceGroupSheet();enhanceWatchSort();enhanceData()}
const obs=new MutationObserver(()=>setTimeout(run,0));document.addEventListener('DOMContentLoaded',()=>{obs.observe(document.body,{subtree:true,childList:true});setTimeout(run,100)});document.addEventListener('marketdata:updated',()=>setTimeout(run,0));
})();