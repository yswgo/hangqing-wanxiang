// Interaction rules + representative stocks + richer detail views.
const representativeStocks=[
  {name:'英伟达',code:'NVDA',type:'股票',region:'美股',tag:'美国',group:'代表个股',price:'167.52',chg:2.18,status:'休市'},
  {name:'苹果',code:'AAPL',type:'股票',region:'美股',tag:'美国',group:'代表个股',price:'236.84',chg:.74,status:'休市'},
  {name:'微软',code:'MSFT',type:'股票',region:'美股',tag:'美国',group:'代表个股',price:'507.21',chg:1.06,status:'休市'},
  {name:'亚马逊',code:'AMZN',type:'股票',region:'美股',tag:'美国',group:'代表个股',price:'231.45',chg:.63,status:'休市'},
  {name:'谷歌A',code:'GOOGL',type:'股票',region:'美股',tag:'美国',group:'代表个股',price:'224.18',chg:1.32,status:'休市'},
  {name:'Meta',code:'META',type:'股票',region:'美股',tag:'美国',group:'代表个股',price:'742.60',chg:.91,status:'休市'},
  {name:'特斯拉',code:'TSLA',type:'股票',region:'美股',tag:'美国',group:'代表个股',price:'348.26',chg:-1.14,status:'休市'},
  {name:'博通',code:'AVGO',type:'股票',region:'美股',tag:'美国',group:'代表个股',price:'357.90',chg:1.86,status:'休市'},
  {name:'贵州茅台',code:'600519',type:'股票',region:'中国',tag:'A股',group:'代表个股',price:'1,486.20',chg:.58,status:'交易中'},
  {name:'宁德时代',code:'300750',type:'股票',region:'中国',tag:'A股',group:'代表个股',price:'286.40',chg:1.27,status:'交易中'},
  {name:'比亚迪',code:'002594',type:'股票',region:'中国',tag:'A股',group:'代表个股',price:'112.68',chg:.84,status:'交易中'},
  {name:'工商银行',code:'601398',type:'股票',region:'中国',tag:'A股',group:'代表个股',price:'7.91',chg:-.25,status:'交易中'},
  {name:'腾讯控股',code:'0700.HK',type:'股票',region:'中国',tag:'港股',group:'代表个股',price:'628.50',chg:1.15,status:'交易中'},
  {name:'阿里巴巴-W',code:'9988.HK',type:'股票',region:'中国',tag:'港股',group:'代表个股',price:'145.20',chg:.72,status:'交易中'},
  {name:'小米集团-W',code:'1810.HK',type:'股票',region:'中国',tag:'港股',group:'代表个股',price:'54.80',chg:1.44,status:'交易中'},
  {name:'美团-W',code:'3690.HK',type:'股票',region:'中国',tag:'港股',group:'代表个股',price:'121.60',chg:-.38,status:'交易中'},
  {name:'丰田汽车',code:'7203.T',type:'股票',region:'日本',tag:'日本',group:'代表个股',price:'2,948',chg:.66,status:'交易中'},
  {name:'索尼集团',code:'6758.T',type:'股票',region:'日本',tag:'日本',group:'代表个股',price:'4,102',chg:1.08,status:'交易中'},
  {name:'三菱日联',code:'8306.T',type:'股票',region:'日本',tag:'日本',group:'代表个股',price:'2,104',chg:.92,status:'交易中'},
  {name:'爱德万测试',code:'6857.T',type:'股票',region:'日本',tag:'日本',group:'代表个股',price:'12,845',chg:2.26,status:'交易中'},
  {name:'三星电子',code:'005930.KS',type:'股票',region:'韩国',tag:'韩国',group:'代表个股',price:'76,500',chg:1.18,status:'交易中'},
  {name:'SK海力士',code:'000660.KS',type:'股票',region:'韩国',tag:'韩国',group:'代表个股',price:'289,000',chg:2.04,status:'交易中'},
  {name:'现代汽车',code:'005380.KS',type:'股票',region:'韩国',tag:'韩国',group:'代表个股',price:'226,500',chg:.54,status:'交易中'},
  {name:'LG新能源',code:'373220.KS',type:'股票',region:'韩国',tag:'韩国',group:'代表个股',price:'348,000',chg:-.42,status:'交易中'},
  {name:'ASML',code:'ASML.AS',type:'股票',region:'欧洲',tag:'荷兰',group:'代表个股',price:'846.20',chg:1.56,status:'未开盘'},
  {name:'SAP',code:'SAP.DE',type:'股票',region:'欧洲',tag:'德国',group:'代表个股',price:'229.40',chg:.78,status:'未开盘'},
  {name:'西门子',code:'SIE.DE',type:'股票',region:'欧洲',tag:'德国',group:'代表个股',price:'238.15',chg:.61,status:'未开盘'},
  {name:'LVMH',code:'MC.PA',type:'股票',region:'欧洲',tag:'法国',group:'代表个股',price:'546.30',chg:-.35,status:'未开盘'}
];
representativeStocks.forEach(s=>{if(!assets.some(a=>a.code===s.code))assets.push(s)});
if(!typeOptions.includes('股票')) typeOptions.splice(1,0,'股票');

const regionOptionsByType={
  '指数':['全球','美股','日本','韩国','中国','欧洲'],
  '股票':['全球','美股','日本','韩国','中国','欧洲'],
  '板块':['全球','美股','日本','韩国','中国','欧洲'],
  '概念':['全球','美股','日本','韩国','中国','欧洲'],
  '商品':['全球'],
  '外汇':['全球'],
  '债券':['美股']
};
const rankOptionsByType={
  '指数':['涨幅榜','跌幅榜','自选'],
  '股票':['涨幅榜','跌幅榜','自选'],
  '板块':['涨幅榜','跌幅榜'],
  '概念':['涨幅榜','跌幅榜'],
  '商品':['涨幅榜','跌幅榜','自选'],
  '外汇':['涨幅榜','跌幅榜','自选'],
  '债券':['涨幅榜','跌幅榜','自选']
};

renderTabs=function(){
  const regions=regionOptionsByType[state.type]||['全球'];
  const ranks=rankOptionsByType[state.type]||['涨幅榜','跌幅榜'];
  if(!regions.includes(state.region)) state.region=regions[0];
  if(!ranks.includes(state.rank)) state.rank=ranks[0];
  el('typeTabs').innerHTML=typeOptions.map(x=>`<button class="pill ${x===state.type?'active':''}" data-type="${x}">${x}</button>`).join('');
  el('regionTabs').innerHTML=regions.map(x=>`<button class="subpill ${x===state.region?'active':''}" data-region="${x}">${x}</button>`).join('');
  el('rankTabs').innerHTML=ranks.map(x=>`<button class="${x===state.rank?'active':''}" data-rank="${x}">${x}</button>`).join('');
  document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{state.type=b.dataset.type;state.group='全部';const r=regionOptionsByType[state.type]||['全球'];const k=rankOptionsByType[state.type]||['涨幅榜','跌幅榜'];if(!r.includes(state.region))state.region=r[0];if(!k.includes(state.rank))state.rank=k[0];renderAll()});
  document.querySelectorAll('[data-region]').forEach(b=>b.onclick=()=>{state.region=b.dataset.region;renderAll()});
  document.querySelectorAll('[data-rank]').forEach(b=>b.onclick=()=>{state.rank=b.dataset.rank;renderAll()});
};

// Make sector/concept cards clickable.
heatmap=function(list,limit){
  let a=[...list];
  if(state.rank==='跌幅榜')a.sort((x,y)=>x.chg-y.chg);else a.sort((x,y)=>y.chg-x.chg);
  if(limit)a=a.slice(0,limit);
  return `<div class="heat-grid">${a.map(x=>`<button class="heat-card ${x.chg>=0?'heat-up':'heat-down'}" data-theme-name="${x.name}" data-theme-chg="${x.chg}"><b>${x.name}</b><strong>${x.chg>=0?'+':''}${x.chg.toFixed(2)}%</strong></button>`).join('')}</div>`;
};

const originalHome=home;
home=function(){
  const base=originalHome();
  const featured=representativeStocks.filter(x=>['英伟达','苹果','腾讯控股','比亚迪'].includes(x.name));
  return base + `<div class="section"><div class="section-head"><b>代表个股</b><span data-jump-stock="1">更多 ›</span></div><div class="list">${rows(featured)}</div></div>`;
};

function parseNum(v){const n=parseFloat(String(v).replace(/,/g,'').replace('%',''));return Number.isFinite(n)?n:null}
function fmtLike(base,n){if(String(base).includes('%'))return n.toFixed(2)+'%';if(String(base).includes(','))return n.toLocaleString(undefined,{maximumFractionDigits:2});return n.toFixed(n>=100?2:2)}
function detailStats(x){const p=parseNum(x.price);if(p===null)return {open:'—',prev:'—',high:'—',low:'—'};const d=Math.max(Math.abs(x.chg)/100,.004);return {open:fmtLike(x.price,p*(1-d*.35)),prev:fmtLike(x.price,p/(1+x.chg/100)),high:fmtLike(x.price,p*(1+d*.45)),low:fmtLike(x.price,p*(1-d*.52))}}

openDetail=function(name){
  const x=assets.find(a=>a.name===name);if(!x)return;
  const stats=detailStats(x);
  el('detailTitle').textContent=x.name;
  el('detailCode').textContent=`${x.code} · ${x.region} · ${x.status}`;
  const card=el('detailSheet').querySelector('.detail-card');
  card.innerHTML=`<div class="detail-kicker">${x.type} · ${x.group||x.tag}</div><div class="detail-price">${x.price}</div><div class="detail-change ${x.chg>=0?'up':'down'}">${x.chg>=0?'+':''}${x.chg.toFixed(2)}%</div><div class="mock-inline">模拟数据 · 详情结构预览</div><div class="periods"><button class="active">1日</button><button>1周</button><button>1月</button><button>1年</button></div><svg class="chart ${x.chg>=0?'up':'down'}" viewBox="0 0 360 150" preserveAspectRatio="none"><polyline points="0,112 35,102 70,109 105,84 140,91 175,65 210,70 245,44 280,51 315,29 360,36" fill="none" stroke="currentColor" stroke-width="3"/></svg><div class="stats"><div><small>今开</small><b>${stats.open}</b></div><div><small>昨收</small><b>${stats.prev}</b></div><div><small>最高</small><b>${stats.high}</b></div><div><small>最低</small><b>${stats.low}</b></div></div><div class="detail-info"><div><span>市场</span><b>${x.region}</b></div><div><span>分类</span><b>${x.group||x.tag}</b></div><div><span>状态</span><b>${x.status}</b></div></div>`;
  let old=document.getElementById('favBtn');if(old)old.remove();
  const btn=document.createElement('button');btn.id='favBtn';btn.className='fav-btn';btn.textContent=favs.has(name)?'★ 已自选':'☆ 加自选';btn.onclick=()=>{favs.has(name)?favs.delete(name):favs.add(name);saveFavs();btn.textContent=favs.has(name)?'★ 已自选':'☆ 加自选'};el('detailSheet').querySelector('.sheet-header').appendChild(btn);
  el('detailSheet').classList.remove('hidden');
};

function representativeForTheme(region){
  let r=region==='全球'?representativeStocks:representativeStocks.filter(x=>x.region===region);
  return [...r].sort((a,b)=>Math.abs(b.chg)-Math.abs(a.chg)).slice(0,4);
}
function openThemeDetail(name,chg){
  const region=state.region==='全球'?'全球':state.region;
  const kind=state.type==='概念'?'概念':'板块';
  el('detailTitle').textContent=name;
  el('detailCode').textContent=`${region}${kind} · 模拟行情`;
  const reps=representativeForTheme(region);
  const card=el('detailSheet').querySelector('.detail-card');
  card.innerHTML=`<div class="detail-kicker">${region}${kind}</div><div class="theme-big ${chg>=0?'up':'down'}">${chg>=0?'+':''}${chg.toFixed(2)}%</div><div class="mock-inline">模拟数据 · 后续接入真实板块/概念成分数据</div><div class="theme-summary"><div><small>方向</small><b>${chg>=0?'上涨':'下跌'}</b></div><div><small>强弱</small><b>${Math.abs(chg)>=2?'强':'一般'}</b></div><div><small>市场</small><b>${region}</b></div></div><div class="section-head inner"><b>代表个股</b><span>${reps.length} 项</span></div><div class="list mini-list">${rows(reps)}</div>`;
  const old=document.getElementById('favBtn');if(old)old.remove();
  el('detailSheet').classList.remove('hidden');
  card.querySelectorAll('.row[data-name]').forEach(r=>r.onclick=()=>openDetail(r.dataset.name));
}

const baseRenderAll=renderAll;
renderAll=function(){
  baseRenderAll();
  if(state.page==='首页'){
    document.querySelectorAll('[data-jump-stock]').forEach(x=>x.onclick=()=>{state.page='行情';state.type='股票';state.region='全球';el('pageTitle').textContent='行情';el('pageSubtitle').textContent='板块 · 概念 · 全球资产';el('marketControls').style.display='block';renderAll()});
  }
  document.querySelectorAll('[data-theme-name]').forEach(x=>x.onclick=()=>openThemeDetail(x.dataset.themeName,Number(x.dataset.themeChg)));
  if(state.page==='行情' && state.type!=='板块' && state.type!=='概念'){
    const head=document.querySelector('#content .section-head b');if(head){const prefix=state.region==='全球'?'全球':state.region;const rank=state.rank==='跌幅榜'?'跌幅榜':state.rank==='自选'?'自选':'涨幅榜';head.textContent=`${prefix}${state.type}${rank}`;}
  }
};
renderAll();
