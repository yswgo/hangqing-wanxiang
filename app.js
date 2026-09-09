const assets=[
{name:'纳斯达克100',code:'NDX',type:'指数',region:'美股',tag:'美国',group:'股票指数',price:'21,580.40',chg:1.42,status:'休市'},
{name:'标普500',code:'SPX',type:'指数',region:'美股',tag:'美国',group:'股票指数',price:'6,128.40',chg:.86,status:'休市'},
{name:'日经225',code:'NIKKEI',type:'指数',region:'日本',tag:'日本',group:'股票指数',price:'43,820',chg:1.18,status:'交易中'},
{name:'TOPIX',code:'TOPIX',type:'指数',region:'日本',tag:'日本',group:'股票指数',price:'3,142.2',chg:.72,status:'交易中'},
{name:'KOSPI',code:'KOSPI',type:'指数',region:'韩国',tag:'韩国',group:'股票指数',price:'3,228.10',chg:.48,status:'交易中'},
{name:'上证指数',code:'000001',type:'指数',region:'中国',tag:'中国',group:'股票指数',price:'3,812.55',chg:.36,status:'交易中'},
{name:'恒生指数',code:'HSI',type:'指数',region:'中国',tag:'香港',group:'股票指数',price:'25,420',chg:-.26,status:'交易中'},
{name:'德国DAX',code:'DAX',type:'指数',region:'欧洲',tag:'德国',group:'股票指数',price:'23,744',chg:-.41,status:'未开盘'},
{name:'黄金',code:'XAU/USD',type:'商品',region:'全球',tag:'贵金属',group:'贵金属',price:'3,641.20',chg:.71,status:'交易中'},
{name:'白银',code:'XAG/USD',type:'商品',region:'全球',tag:'贵金属',group:'贵金属',price:'41.26',chg:1.06,status:'交易中'},
{name:'铂金',code:'XPT/USD',type:'商品',region:'全球',tag:'贵金属',group:'贵金属',price:'1,395.4',chg:.44,status:'交易中'},
{name:'钯金',code:'XPD/USD',type:'商品',region:'全球',tag:'贵金属',group:'贵金属',price:'1,171.2',chg:-.18,status:'交易中'},
{name:'铜',code:'LME COPPER',type:'商品',region:'全球',tag:'工业金属',group:'工业金属',price:'9,985',chg:.96,status:'交易中'},
{name:'铝',code:'LME ALUMINIUM',type:'商品',region:'全球',tag:'工业金属',group:'工业金属',price:'2,615',chg:-.22,status:'交易中'},
{name:'锌',code:'LME ZINC',type:'商品',region:'全球',tag:'工业金属',group:'工业金属',price:'2,982',chg:.27,status:'交易中'},
{name:'镍',code:'LME NICKEL',type:'商品',region:'全球',tag:'工业金属',group:'工业金属',price:'15,480',chg:.34,status:'交易中'},
{name:'铅',code:'LME LEAD',type:'商品',region:'全球',tag:'工业金属',group:'工业金属',price:'2,019',chg:-.15,status:'交易中'},
{name:'锡',code:'LME TIN',type:'商品',region:'全球',tag:'工业金属',group:'工业金属',price:'34,920',chg:.58,status:'交易中'},
{name:'WTI原油',code:'WTI',type:'商品',region:'全球',tag:'能源',group:'能源',price:'68.72',chg:-.84,status:'交易中'},
{name:'布伦特原油',code:'BRENT',type:'商品',region:'全球',tag:'能源',group:'能源',price:'72.18',chg:-.66,status:'交易中'},
{name:'天然气',code:'NATGAS',type:'商品',region:'全球',tag:'能源',group:'能源',price:'3.11',chg:.92,status:'交易中'},
{name:'美元指数',code:'DXY',type:'外汇',region:'全球',tag:'美元',group:'外汇',price:'98.42',chg:-.31,status:'交易中'},
{name:'美元/日元',code:'USD/JPY',type:'外汇',region:'全球',tag:'外汇',group:'外汇',price:'147.62',chg:.24,status:'交易中'},
{name:'欧元/美元',code:'EUR/USD',type:'外汇',region:'全球',tag:'外汇',group:'外汇',price:'1.1724',chg:.18,status:'交易中'},
{name:'美国2年期国债',code:'US2Y · Yield',type:'债券',region:'美股',tag:'美国',group:'债券',price:'3.76%',chg:.18,status:'休市'},
{name:'美国10年期国债',code:'US10Y · Yield',type:'债券',region:'美股',tag:'美国',group:'债券',price:'4.18%',chg:.32,status:'休市'},
{name:'美国30年期国债',code:'US30Y · Yield',type:'债券',region:'美股',tag:'美国',group:'债券',price:'4.82%',chg:.21,status:'休市'}
];
let state={page:'首页',type:'全部',region:'全球',rank:'涨幅榜',group:'全部'};
const typeOptions=['全部','指数','商品','外汇','债券'];
const regionOptions=['全球','美股','日本','韩国','中国','欧洲'];
const rankOptions=['涨幅榜','跌幅榜','活跃','自选'];
const groupOptions=['全部','贵金属','工业金属','能源','股票指数','外汇','债券'];
const favs=new Set(JSON.parse(localStorage.getItem('hqwx-favs')||'["黄金","铜","纳斯达克100"]'));
function el(id){return document.getElementById(id)}
function saveFavs(){localStorage.setItem('hqwx-favs',JSON.stringify([...favs]))}
function renderTabs(){
 el('typeTabs').innerHTML=typeOptions.map(x=>`<button class="pill ${x===state.type?'active':''}" data-type="${x}">${x}</button>`).join('');
 el('regionTabs').innerHTML=regionOptions.map(x=>`<button class="subpill ${x===state.region?'active':''}" data-region="${x}">${x}</button>`).join('');
 el('rankTabs').innerHTML=rankOptions.map(x=>`<button class="${x===state.rank?'active':''}" data-rank="${x}">${x}</button>`).join('');
 document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{state.type=b.dataset.type;renderAll()});
 document.querySelectorAll('[data-region]').forEach(b=>b.onclick=()=>{state.region=b.dataset.region;renderAll()});
 document.querySelectorAll('[data-rank]').forEach(b=>b.onclick=()=>{state.rank=b.dataset.rank;renderAll()});
}
function filtered(){let a=assets.filter(x=>(state.type==='全部'||x.type===state.type)&&(state.region==='全球'||x.region===state.region)&&(state.group==='全部'||x.group===state.group));if(state.rank==='涨幅榜')a.sort((a,b)=>b.chg-a.chg);else if(state.rank==='跌幅榜')a.sort((a,b)=>a.chg-b.chg);else if(state.rank==='自选')a=a.filter(x=>favs.has(x.name));return a}
function rows(list){return list.map(x=>`<div class="row" data-name="${x.name}"><div><div class="name">${x.name}<span class="tag">${x.tag}</span></div><div class="code">${x.code} · ${x.status}</div></div><div class="price">${x.price}</div><div class="chg ${x.chg>=0?'up':'down'}">${x.chg>=0?'+':''}${x.chg.toFixed(2)}%</div></div>`).join('')}
function bindRows(){document.querySelectorAll('.row[data-name]').forEach(r=>r.onclick=()=>openDetail(r.dataset.name))}
function asset(name){return assets.find(a=>a.name===name)}
function marketStatus(){return `<div class="status-strip"><div><span class="dot open"></span>亚洲交易中</div><div><span class="dot wait"></span>欧洲未开盘</div><div><span class="dot closed"></span>美股休市</div></div>`}
function groupChips(){return `<div class="group-scroll">${groupOptions.map(g=>`<button class="group-chip ${g===state.group?'active':''}" data-group="${g}">${g}</button>`).join('')}</div>`}
function home(){return `${marketStatus()}<div class="mock-note">模拟数据 · 用于界面预览，不代表实时行情</div><div class="hero"><div class="hero-top"><small>全球市场速览</small><span>V3</span></div><div class="hero-grid"><div class="hero-item"><small>美股</small><b class="up">+1.14%</b></div><div class="hero-item"><small>亚洲</small><b class="up">+0.81%</b></div><div class="hero-item"><small>商品</small><b class="up">+0.36%</b></div><div class="hero-item"><small>美元</small><b class="down">−0.31%</b></div></div></div><div class="section"><div class="section-head"><b>全球股市</b><span>美 · 日 · 韩 · 中</span></div><div class="list">${rows([asset('纳斯达克100'),asset('日经225'),asset('KOSPI'),asset('上证指数')])}</div></div><div class="section"><div class="section-head"><b>贵金属</b><span>黄金 · 白银 · 铂金 · 钯金</span></div><div class="cards">${['黄金','白银','铂金','钯金'].map(n=>{const x=asset(n);return `<div class="card" data-card="${n}"><small>${n}</small><b>${x.price}</b><span class="${x.chg>=0?'up':'down'}">${x.chg>=0?'+':''}${x.chg.toFixed(2)}%</span></div>`}).join('')}</div></div><div class="section"><div class="section-head"><b>工业金属</b><span>LME 六大基础金属</span></div><div class="list">${rows(['铜','铝','锌','镍','铅','锡'].map(asset))}</div></div><div class="section"><div class="section-head"><b>能源</b><span>原油 · 天然气</span></div><div class="cards">${['WTI原油','布伦特原油','天然气'].map(n=>{const x=asset(n);return `<div class="card" data-card="${n}"><small>${n}</small><b>${x.price}</b><span class="${x.chg>=0?'up':'down'}">${x.chg>=0?'+':''}${x.chg.toFixed(2)}%</span></div>`}).join('')}</div></div><div class="section"><div class="section-head"><b>美元 & 债券</b><span>宏观核心</span></div><div class="list">${rows([asset('美元指数'),asset('美国10年期国债'),asset('美国2年期国债')])}</div></div>`}
function renderContent(){const c=el('content');if(state.page==='首页'){c.innerHTML=home();bindRows();document.querySelectorAll('[data-card]').forEach(x=>x.onclick=()=>openDetail(x.dataset.card));return}if(state.page==='数据'){c.innerHTML=`<div class="mock-note">数据页为功能预览</div><div class="section-head"><b>市场数据</b><span>宏观与联动</span></div><div class="cards"><div class="card"><small>宏观</small><b>经济日历</b><span class="mini">CPI · 非农 · 利率决议</span></div><div class="card"><small>利率</small><b>收益率曲线</b><span class="mini">2Y · 10Y · 30Y</span></div><div class="card"><small>联动</small><b>美元 vs 黄金</b><span class="mini">相关性观察</span></div><div class="card"><small>风险</small><b>VIX</b><span class="mini">市场波动率</span></div></div>`;return}let a=filtered(),title=state.page==='自选'?'我的自选':'今日市场';if(state.page==='自选')a=assets.filter(x=>favs.has(x.name));c.innerHTML=`${state.page==='行情'?groupChips():''}<div class="section-head"><b>${title}</b><span>${a.length} 项</span></div>${a.length?`<div class="list">${rows(a)}</div>`:`<div class="empty"><b>暂无匹配行情</b>换一个分类或地区看看</div>`}`;bindRows();document.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>{state.group=b.dataset.group;renderAll()})}
function renderBottom(){const nav=[['⌂','首页'],['↗','行情'],['☆','自选'],['▦','数据']];el('bottomNav').innerHTML=nav.map(x=>`<button class="nav-item ${x[1]===state.page?'active':''}" data-page="${x[1]}"><i>${x[0]}</i>${x[1]}</button>`).join('');document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{state.page=b.dataset.page;el('pageTitle').textContent=state.page;el('pageSubtitle').textContent=state.page==='首页'?'全球市场 · 一屏看懂涨跌':state.page==='行情'?'全球市场 · 找到正在动的资产':state.page==='自选'?'关注你真正关心的资产':'宏观数据 · 理解市场变化';el('marketControls').style.display=state.page==='行情'?'block':'none';renderAll()})}
function renderAll(){renderTabs();renderContent();renderBottom()}
function openDetail(name){const x=assets.find(a=>a.name===name);if(!x)return;el('detailTitle').textContent=x.name;el('detailCode').textContent=`${x.code} · ${x.status}`;el('detailPrice').textContent=x.price;el('detailChange').textContent=(x.chg>=0?'+':'')+x.chg.toFixed(2)+'%';el('detailChange').className=x.chg>=0?'up':'down';['statOpen','statPrev','statHigh','statLow'].forEach(id=>el(id).textContent=x.price);let old=document.getElementById('favBtn');if(old)old.remove();const btn=document.createElement('button');btn.id='favBtn';btn.className='fav-btn';btn.textContent=favs.has(name)?'★ 已自选':'☆ 加自选';btn.onclick=()=>{favs.has(name)?favs.delete(name):favs.add(name);saveFavs();btn.textContent=favs.has(name)?'★ 已自选':'☆ 加自选';if(state.page==='自选')renderContent()};el('detailSheet').querySelector('.sheet-header').appendChild(btn);el('detailSheet').classList.remove('hidden')}
el('backBtn').onclick=()=>el('detailSheet').classList.add('hidden');
el('searchBtn').onclick=()=>{el('searchPanel').classList.remove('hidden');el('searchInput').focus();renderSearch('')};
el('searchBack').onclick=()=>el('searchPanel').classList.add('hidden');
el('searchInput').oninput=e=>renderSearch(e.target.value);
function renderSearch(q){let list=assets.filter(x=>(x.name+x.code+x.tag+x.group).toLowerCase().includes(q.toLowerCase()));el('searchResults').innerHTML=list.length?`<div class="list">${rows(list)}</div>`:`<div class="empty"><b>没有找到</b>换个关键词试试</div>`;bindRows()}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
el('marketControls').style.display='none';renderAll();