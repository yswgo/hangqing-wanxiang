// Interaction rules: keep type/region/rank state consistent.
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

  document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{
    state.type=b.dataset.type;
    state.group='全部';
    const nextRegions=regionOptionsByType[state.type]||['全球'];
    const nextRanks=rankOptionsByType[state.type]||['涨幅榜','跌幅榜'];
    if(!nextRegions.includes(state.region)) state.region=nextRegions[0];
    if(!nextRanks.includes(state.rank)) state.rank=nextRanks[0];
    renderAll();
  });
  document.querySelectorAll('[data-region]').forEach(b=>b.onclick=()=>{state.region=b.dataset.region;renderAll()});
  document.querySelectorAll('[data-rank]').forEach(b=>b.onclick=()=>{state.rank=b.dataset.rank;renderAll()});
};

const baseRenderAll=renderAll;
renderAll=function(){
  baseRenderAll();
  if(state.page==='行情' && state.type!=='板块' && state.type!=='概念'){
    const head=document.querySelector('#content .section-head b');
    if(head){
      const prefix=state.region==='全球'?'全球':state.region;
      const rank=state.rank==='跌幅榜'?'跌幅榜':state.rank==='自选'?'自选':'涨幅榜';
      head.textContent=`${prefix}${state.type}${rank}`;
    }
  }
};
renderAll();
