const assets=[
{name:'纳斯达克100',code:'NDX',type:'指数',region:'美股',tag:'美国',group:'股票指数',price:'21,580.40',chg:1.42,status:'休市'},
{name:'标普500',code:'SPX',type:'指数',region:'美股',tag:'美国',group:'股票指数',price:'6,128.40',chg:.86,status:'休市'},
{name:'日经225',code:'NIKKEI',type:'指数',region:'日本',tag:'日本',group:'股票指数',price:'43,820',chg:1.18,status:'交易中'},
{name:'TOPIX',code:'TOPIX',type:'指数',region:'日本',tag:'日本',group:'股票指数',price:'3,142.2',chg:.72,status:'交易中'},
{name:'KOSPI',code:'KOSPI',type:'指数',region:'韩国',tag:'韩国',group:'股票指数',price:'3,228.10',chg:.48,status:'交易中'},
{name:'上证指数',code:'000001',type:'指数',region:'中国',tag:'A股',group:'股票指数',price:'3,812.55',chg:.36,status:'交易中'},
{name:'恒生指数',code:'HSI',type:'指数',region:'中国',tag:'港股',group:'股票指数',price:'25,420',chg:-.26,status:'交易中'},
{name:'德国DAX',code:'DAX',type:'指数',region:'欧洲',tag:'德国',group:'股票指数',price:'23,744',chg:-.41,status:'未开盘'},

{name:'英伟达',code:'NVDA',type:'股票',region:'美股',tag:'美国',group:'科技',price:'178.42',chg:2.31,status:'休市'},
{name:'苹果',code:'AAPL',type:'股票',region:'美股',tag:'美国',group:'科技',price:'234.88',chg:.74,status:'休市'},
{name:'微软',code:'MSFT',type:'股票',region:'美股',tag:'美国',group:'科技',price:'512.16',chg:1.08,status:'休市'},
{name:'亚马逊',code:'AMZN',type:'股票',region:'美股',tag:'美国',group:'消费',price:'231.45',chg:.63,status:'休市'},
{name:'谷歌A',code:'GOOGL',type:'股票',region:'美股',tag:'美国',group:'科技',price:'238.12',chg:1.27,status:'休市'},
{name:'Meta',code:'META',type:'股票',region:'美股',tag:'美国',group:'科技',price:'752.30',chg:-.38,status:'休市'},
{name:'特斯拉',code:'TSLA',type:'股票',region:'美股',tag:'美国',group:'汽车',price:'346.20',chg:-1.16,status:'休市'},
{name:'博通',code:'AVGO',type:'股票',region:'美股',tag:'美国',group:'半导体',price:'331.18',chg:1.86,status:'休市'},

{name:'贵州茅台',code:'600519',type:'股票',region:'中国',tag:'A股',group:'消费',price:'1,482.60',chg:.52,status:'已收盘'},
{name:'宁德时代',code:'300750',type:'股票',region:'中国',tag:'A股',group:'新能源',price:'294.36',chg:1.41,status:'已收盘'},
{name:'比亚迪',code:'002594',type:'股票',region:'中国',tag:'A股',group:'汽车',price:'112.84',chg:.93,status:'已收盘'},
{name:'工商银行',code:'601398',type:'股票',region:'中国',tag:'A股',group:'银行',price:'7.62',chg:-.26,status:'已收盘'},
{name:'腾讯控股',code:'0700.HK',type:'股票',region:'中国',tag:'港股',group:'互联网',price:'621.50',chg:1.22,status:'已收盘'},
{name:'阿里巴巴-W',code:'9988.HK',type:'股票',region:'中国',tag:'港股',group:'互联网',price:'118.40',chg:.68,status:'已收盘'},
{name:'小米集团-W',code:'1810.HK',type:'股票',region:'中国',tag:'港股',group:'科技',price:'54.25',chg:-.44,status:'已收盘'},
{name:'美团-W',code:'3690.HK',type:'股票',region:'中国',tag:'港股',group:'互联网',price:'102.70',chg:-.71,status:'已收盘'},

{name:'丰田汽车',code:'7203.T',type:'股票',region:'日本',tag:'日本',group:'汽车',price:'3,184',chg:1.04,status:'交易中'},
{name:'索尼集团',code:'6758.T',type:'股票',region:'日本',tag:'日本',group:'电子',price:'4,126',chg:.72,status:'交易中'},
{name:'三菱日联',code:'8306.T',type:'股票',region:'日本',tag:'日本',group:'银行',price:'2,178',chg:1.31,status:'交易中'},
{name:'爱德万测试',code:'6857.T',type:'股票',region:'日本',tag:'日本',group:'半导体',price:'12,240',chg:2.18,status:'交易中'},

{name:'三星电子',code:'005930.KS',type:'股票',region:'韩国',tag:'韩国',group:'电子',price:'73,600',chg:1.34,status:'交易中'},
{name:'SK海力士',code:'000660.KS',type:'股票',region:'韩国',tag:'韩国',group:'半导体',price:'292,500',chg:2.72,status:'交易中'},
{name:'现代汽车',code:'005380.KS',type:'股票',region:'韩国',tag:'韩国',group:'汽车',price:'227,500',chg:.64,status:'交易中'},
{name:'LG新能源',code:'373220.KS',type:'股票',region:'韩国',tag:'韩国',group:'电池',price:'346,000',chg:-.35,status:'交易中'},

{name:'ASML',code:'ASML',type:'股票',region:'欧洲',tag:'荷兰',group:'半导体',price:'714.20',chg:1.56,status:'未开盘'},
{name:'SAP',code:'SAP',type:'股票',region:'欧洲',tag:'德国',group:'软件',price:'231.80',chg:.62,status:'未开盘'},
{name:'西门子',code:'SIE',type:'股票',region:'欧洲',tag:'德国',group:'工业',price:'229.10',chg:.47,status:'未开盘'},
{name:'路威酩轩',code:'MC',type:'股票',region:'欧洲',tag:'法国',group:'奢侈品',price:'519.60',chg:-.58,status:'未开盘'},

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

const sectorData={
'美股':[{name:'半导体',chg:2.84},{name:'信息科技',chg:1.92},{name:'通信服务',chg:1.36},{name:'金融',chg:.88},{name:'工业',chg:.61},{name:'可选消费',chg:.34},{name:'医疗保健',chg:-.18},{name:'必选消费',chg:-.27},{name:'能源',chg:-.52},{name:'房地产',chg:-.74},{name:'公用事业',chg:-.96}],
'日本':[{name:'电气设备',chg:2.31},{name:'机械',chg:1.84},{name:'银行',chg:1.41},{name:'汽车',chg:1.12},{name:'商社',chg:.88},{name:'精密仪器',chg:.53},{name:'医药',chg:.16},{name:'零售',chg:-.21},{name:'地产',chg:-.48},{name:'运输',chg:-.66},{name:'电力燃气',chg:-.82}],
'韩国':[{name:'半导体',chg:2.67},{name:'电子',chg:1.96},{name:'汽车',chg:1.28},{name:'电池',chg:.92},{name:'金融',chg:.73},{name:'造船',chg:.44},{name:'化工',chg:.18},{name:'医药',chg:-.15},{name:'互联网',chg:-.36},{name:'零售',chg:-.61},{name:'公用事业',chg:-.79}],
'中国':[{name:'电子',chg:2.18},{name:'计算机',chg:1.73},{name:'通信',chg:1.42},{name:'国防军工',chg:1.06},{name:'机械设备',chg:.78},{name:'有色金属',chg:.51},{name:'银行',chg:.19},{name:'医药生物',chg:-.22},{name:'食品饮料',chg:-.39},{name:'房地产',chg:-.68},{name:'煤炭',chg:-.91}],
'欧洲':[{name:'科技',chg:1.72},{name:'工业',chg:1.31},{name:'银行',chg:1.08},{name:'汽车',chg:.76},{name:'奢侈品',chg:.52},{name:'医疗',chg:.21},{name:'保险',chg:.12},{name:'能源',chg:-.19},{name:'公用事业',chg:-.35},{name:'地产',chg:-.57},{name:'电信',chg:-.74}]
};
const conceptData={
'美股':[{name:'人工智能 AI',chg:3.42},{name:'芯片设备',chg:2.76},{name:'机器人',chg:2.18},{name:'量子计算',chg:1.91},{name:'云计算',chg:1.64},{name:'网络安全',chg:1.22},{name:'比特币概念',chg:1.47},{name:'核电',chg:.83},{name:'商业航天',chg:.56},{name:'电动车',chg:-.41},{name:'太阳能',chg:-1.18}],
'日本':[{name:'半导体设备',chg:2.54},{name:'机器人',chg:2.11},{name:'自动化',chg:1.72},{name:'AI服务器',chg:1.43},{name:'动漫游戏',chg:1.08},{name:'精密制造',chg:.84},{name:'氢能源',chg:.41},{name:'防务',chg:.25},{name:'电动车',chg:-.28},{name:'光伏',chg:-.63},{name:'消费电子',chg:-.77}],
'韩国':[{name:'HBM存储',chg:3.08},{name:'AI芯片',chg:2.62},{name:'动力电池',chg:1.71},{name:'造船',chg:1.38},{name:'国防',chg:1.02},{name:'显示面板',chg:.67},{name:'生物科技',chg:.39},{name:'游戏',chg:.21},{name:'互联网平台',chg:-.31},{name:'光伏',chg:-.58},{name:'零售消费',chg:-.76}],
'中国':[{name:'AI算力',chg:3.16},{name:'机器人',chg:2.47},{name:'低空经济',chg:2.09},{name:'商业航天',chg:1.82},{name:'国产芯片',chg:1.55},{name:'数据中心',chg:1.24},{name:'创新药',chg:.76},{name:'核聚变',chg:.58},{name:'新能源汽车',chg:-.22},{name:'光伏',chg:-.69},{name:'房地产链',chg:-.94}],
'欧洲':[{name:'国防军工',chg:2.36},{name:'AI基础设施',chg:1.93},{name:'工业自动化',chg:1.48},{name:'奢侈品',chg:1.04},{name:'风电',chg:.72},{name:'氢能源',chg:.51},{name:'电动车',chg:.34},{name:'医药创新',chg:.19},{name:'光伏',chg:-.26},{name:'地产复苏',chg:-.47},{name:'电信设备',chg:-.65}]
};
function aggregateRegion(map){const names={};Object.values(map).forEach(list=>list.forEach(x=>{if(!names[x.name])names[x.name]=[];names[x.name].push(x.chg)}));return Object.entries(names).map(([name,v])=>({name,chg:v.reduce((a,b)=>a+b,0)/v.length}));}
sectorData['全球']=aggregateRegion(sectorData);conceptData['全球']=aggregateRegion(conceptData);

let state={page:'首页',type:'指数',region:'全球',rank:'涨幅榜',group:'全部'};
const typeOptions=['指数','股票','板块','概念','商品','外汇','债券'];
const regionOptions=['全球','美股','日本','韩国','中国','欧洲'];
const rankOptions=['涨幅榜','跌幅榜','自选'];
const groupOptions=['全部','贵金属','工业金属','能源','股票指数','外汇','债券'];
const favs=new Set(JSON.parse(localStorage.getItem('hqwx-favs')||'["黄金","铜","纳斯达克100"]'));
function el(id){return document.getElementById(id)}
function saveFavs(){localStorage.setItem('hqwx-favs',JSON.stringify([...favs]))}
function normalizeFilters(){
 if(state.type==='商品'||state.type==='外汇')state.region='全球';
 if(state.type==='债券')state.region='美股';
}
function renderTabs(){normalizeFilters();el('typeTabs').innerHTML=typeOptions.map(x=>`<button class="pill ${x===state.type?'active':''}" data-type="${x}">${x}</button>`).join('');el('regionTabs').innerHTML=regionOptions.map(x=>`<button class="subpill ${x===state.region?'active':''}" data-region="${x}">${x}</button>`).join('');el('rankTabs').innerHTML=rankOptions.map(x=>`<button class="${x===state.rank?'active':''}" data-rank="${x}">${x}</button>`).join('');document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{state.type=b.dataset.type;state.group='全部';if(state.rank==='自选'&&state.type==='板块')state.rank='涨幅榜';normalizeFilters();renderAll()});document.querySelectorAll('[data-region]').forEach(b=>b.onclick=()=>{if(state.type==='商品'||state.type==='外汇')state.region='全球';else if(state.type==='债券')state.region='美股';else state.region=b.dataset.region;renderAll()});document.querySelectorAll('[data-rank]').forEach(b=>b.onclick=()=>{if((state.type==='板块'||state.type==='概念')&&b.dataset.rank==='自选')return;state.rank=b.dataset.rank;renderAll()})}
function filtered(){let a=assets.filter(x=>x.type===state.type&&(state.region==='全球'||x.region===state.region)&&(state.group==='全部'||x.group===state.group));if(state.rank==='涨幅榜')a.sort((a,b)=>b.chg-a.chg);else if(state.rank==='跌幅榜')a.sort((a,b)=>a.chg-b.chg);else if(state.rank==='自选')a=a.filter(x=>favs.has(x.name));return a}
function rows(list){return list.map(x=>`<div class="row" data-name="${x.name}"><div><div class="name">${x.name}<span class="tag">${x.tag}</span></div><div class="code">${x.code} · ${x.status}</div></div><div class="price">${x.price}</div><div class="chg ${x.chg>=0?'up':'down'}">${x.chg>=0?'+':''}${x.chg.toFixed(2)}%</div></div>`).join('')}
function heatmap(list,limit){let a=[...list];if(state.rank==='跌幅榜')a.sort((x,y)=>x.chg-y.chg);else a.sort((x,y)=>y.chg-x.chg);if(limit)a=a.slice(0,limit);return `<div class="heat-grid">${a.map(x=>`<div class="heat-card ${x.chg>=0?'heat-up':'heat-down'}"><b>${x.name}</b><strong>${x.chg>=0?'+':''}${x.chg.toFixed(2)}%</strong></div>`).join('')}</div>`}
function bindRows(){document.querySelectorAll('.row[data-name]').forEach(r=>r.onclick=()=>openDetail(r.dataset.name))}
function asset(name){return assets.find(a=>a.name===name)}
function marketStatus(){return `<div class="status-strip"><div><span class="dot open"></span>亚洲交易中</div><div><span class="dot wait"></span>欧洲未开盘</div><div><span class="dot closed"></span>美股休市</div></div>`}
function groupChips(){return `<div class="group-scroll">${groupOptions.map(g=>`<button class="group-chip ${g===state.group?'active':''}" data-group="${g}">${g}</button>`).join('')}</div>`}
function home(){return `${marketStatus()}<div class="mock-note">模拟数据 · 用于界面预览，不代表实时行情</div><div class="hero"><div class="hero-top"><small>全球市场速览</small><span>V4.6</span></div><div class="hero-grid"><div class="hero-item"><small>美股</small><b class="up">+1.14%</b></div><div class="hero-item"><small>亚洲</small><b class="up">+0.81%</b></div><div class="hero-item"><small>商品</small><b class="up">+0.36%</b></div><div class="hero-item"><small>美元</small><b class="down">−0.31%</b></div></div></div><div class="section"><div class="section-head"><b>热门板块</b><span data-jump="板块">全部板块 ›</span></div>${heatmap(sectorData['美股'],6)}</div><div class="section"><div class="section-head"><b>热门概念</b><span data-jump="概念">全部概念 ›</span></div>${heatmap(conceptData['美股'],6)}</div><div class="section"><div class="section-head"><b>代表个股</b><span data-jump="股票">查看更多 ›</span></div><div class="list">${rows([asset('英伟达'),asset('苹果'),asset('腾讯控股'),asset('比亚迪')])}</div></div><div class="section"><div class="section-head"><b>全球股市</b><span>美 · 日 · 韩 · 中</span></div><div class="list">${rows([asset('纳斯达克100'),asset('日经225'),asset('KOSPI'),asset('上证指数')])}</div></div><div class="section"><div class="section-head"><b>贵金属</b><span>黄金 · 白银 · 铂金 · 钯金</span></div><div class="cards">${['黄金','白银','铂金','钯金'].map(n=>{const x=asset(n);return `<div class="card" data-card="${n}"><small>${n}</small><b>${x.price}</b><span class="${x.chg>=0?'up':'down'}">${x.chg>=0?'+':''}${x.chg.toFixed(2)}%</span></div>`}).join('')}</div></div><div class="section"><div class="section-head"><b>工业金属</b><span>LME 六大基础金属</span></div><div class="list">${rows(['铜','铝','锌','镍','铅','锡'].map(asset))}</div></div>`}
function renderContent(){const c=el('content');if(state.page==='首页'){c.innerHTML=home();bindRows();document.querySelectorAll('[data-card]').forEach(x=>x.onclick=()=>openDetail(x.dataset.card));document.querySelectorAll('[data-jump]').forEach(x=>x.onclick=()=>{state.page='行情';state.type=x.dataset.jump;state.region=state.type==='股票'?'全球':'美股';state.rank='涨幅榜';el('pageTitle').textContent='行情';el('pageSubtitle').textContent='股票 · 板块 · 概念 · 全球资产';el('marketControls').style.display='block';renderAll()});return}if(state.page==='数据'){c.innerHTML=`<div class="mock-note">数据页为功能预览</div><div class="section-head"><b>市场数据</b><span>宏观与联动</span></div><div class="cards"><div class="card"><small>宏观</small><b>经济日历</b><span class="mini">CPI · 非农 · 利率决议</span></div><div class="card"><small>利率</small><b>收益率曲线</b><span class="mini">2Y · 10Y · 30Y</span></div></div>`;return}if(state.page==='自选'){let a=assets.filter(x=>favs.has(x.name));c.innerHTML=`<div class="section-head"><b>我的自选</b><span>${a.length} 项</span></div>${a.length?`<div class="list">${rows(a)}</div>`:`<div class="empty"><b>还没有自选</b>在个股或资产详情里添加</div>`}`;bindRows();return}if(state.type==='板块'||state.type==='概念'){if(state.rank==='自选')state.rank='涨幅榜';const map=state.type==='板块'?sectorData:conceptData;const list=map[state.region]||map['全球'];const prefix=state.region==='全球'?'全球':state.region;const rankName=state.rank==='跌幅榜'?'跌幅榜':'涨幅榜';c.innerHTML=`<div class="mock-note">${prefix}${state.type}涨跌幅为模拟数据 · 后续接入真实行情</div><div class="section-head"><b>${prefix}${state.type}${rankName}</b><span>${list.length} 项</span></div>${heatmap(list)}`;return}let a=filtered();const titleRegion=state.region==='全球'?'全球':state.region;const titleRank=state.rank==='跌幅榜'?'跌幅榜':state.rank==='自选'?'自选':'涨幅榜';c.innerHTML=`${state.type==='商品'?groupChips():''}<div class="mock-note">当前行情为模拟数据 · 后续接入真实行情</div><div class="section-head"><b>${titleRegion}${state.type}${titleRank}</b><span>${a.length} 项</span></div>${a.length?`<div class="list">${rows(a)}</div>`:`<div class="empty"><b>暂无匹配行情</b>换一个分类或地区看看</div>`}`;bindRows();document.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>{state.group=b.dataset.group;renderAll()})}
function renderBottom(){const nav=[['⌂','首页'],['↗','行情'],['☆','自选'],['▦','数据']];el('bottomNav').innerHTML=nav.map(x=>`<button class="nav-item ${x[1]===state.page?'active':''}" data-page="${x[1]}"><i>${x[0]}</i>${x[1]}</button>`).join('');document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{state.page=b.dataset.page;el('pageTitle').textContent=state.page;el('pageSubtitle').textContent=state.page==='首页'?'全球市场 · 一屏看懂涨跌':state.page==='行情'?'股票 · 板块 · 概念 · 全球资产':state.page==='自选'?'关注你真正关心的资产':'宏观数据 · 理解市场变化';el('marketControls').style.display=state.page==='行情'?'block':'none';renderAll()})}
function renderAll(){renderTabs();renderContent();renderBottom()}
function openDetail(name){const x=assets.find(a=>a.name===name);if(!x)return;el('detailTitle').textContent=x.name;el('detailCode').textContent=`${x.code} · ${x.status}`;el('detailPrice').textContent=x.price;el('detailChange').textContent=(x.chg>=0?'+':'')+x.chg.toFixed(2)+'%';el('detailChange').className=x.chg>=0?'up':'down';['statOpen','statPrev','statHigh','statLow'].forEach(id=>el(id).textContent=x.price);let old=document.getElementById('favBtn');if(old)old.remove();const btn=document.createElement('button');btn.id='favBtn';btn.className='fav-btn';btn.textContent=favs.has(name)?'★ 已自选':'☆ 加自选';btn.onclick=()=>{favs.has(name)?favs.delete(name):favs.add(name);saveFavs();btn.textContent=favs.has(name)?'★ 已自选':'☆ 加自选';if(state.page==='自选')renderContent()};el('detailSheet').querySelector('.sheet-header').appendChild(btn);el('detailSheet').classList.remove('hidden')}
el('backBtn').onclick=()=>el('detailSheet').classList.add('hidden');el('searchBtn').onclick=()=>{el('searchPanel').classList.remove('hidden');el('searchInput').focus();renderSearch('')};el('searchBack').onclick=()=>el('searchPanel').classList.add('hidden');el('searchInput').oninput=e=>renderSearch(e.target.value);function renderSearch(q){let list=assets.filter(x=>(x.name+x.code+x.tag+x.group).toLowerCase().includes(q.toLowerCase()));el('searchResults').innerHTML=list.length?`<div class="list">${rows(list)}</div>`:`<div class="empty"><b>没有找到</b>换个关键词试试</div>`;bindRows()}if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}el('marketControls').style.display='none';renderAll();