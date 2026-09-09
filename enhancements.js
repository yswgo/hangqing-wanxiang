// V49 detail experience: period switching, deterministic mock chart, richer stats and related assets.
(function(){
  const periodShapes={
    '1日':[108,96,101,83,88,74,66,71,54,48,39],
    '1周':[112,103,107,91,96,82,73,78,61,49,43],
    '1月':[118,110,98,103,92,78,82,66,58,47,35],
    '1年':[126,118,113,104,98,90,79,70,62,48,34]
  };
  function seedFor(x){return [...(x.code||x.name)].reduce((a,c)=>a+c.charCodeAt(0),0)}
  function chartPoints(x,period){
    const base=periodShapes[period]||periodShapes['1周'];
    const seed=seedFor(x);
    const rising=x.chg>=0;
    return base.map((y,i)=>{
      const wiggle=((seed+i*13)%9)-4;
      const yy=rising?y+wiggle:150-(y+wiggle);
      return `${i*36},${Math.max(12,Math.min(138,yy))}`;
    }).join(' ')
  }
  function fmtPct(v){return `${v>=0?'+':''}${v.toFixed(2)}%`}
  function numericPrice(x){const n=parseFloat(String(x.price).replace(/,/g,'').replace('%',''));return Number.isFinite(n)?n:0}
  function relatedAssets(x){
    let list=assets.filter(a=>a.name!==x.name && a.type===x.type);
    if(x.type==='股票') list=list.filter(a=>a.region===x.region).sort((a,b)=>Math.abs(b.chg)-Math.abs(a.chg));
    else if(x.type==='商品') list=list.filter(a=>a.group===x.group);
    else if(x.type==='指数') list=list.filter(a=>a.region===x.region || x.region==='全球');
    else list=list.filter(a=>a.region===x.region || a.region==='全球');
    return list.slice(0,4)
  }
  function makeDetail(x){
    const p=numericPrice(x), abs=Math.abs(x.chg)/100;
    const open=p*(1-(x.chg/100)*.35), prev=p/(1+x.chg/100||1), high=p*(1+abs*.55+.002), low=p*(1-abs*.45-.002);
    const priceFmt=v=> String(x.price).includes('%')?`${v.toFixed(2)}%`:v.toLocaleString('zh-CN',{maximumFractionDigits:2});
    const related=relatedAssets(x);
    return `<div class="detail-card detail-pro">
      <div class="detail-price-row"><div><div class="detail-price">${x.price}</div><div class="detail-change ${x.chg>=0?'up':'down'}">${fmtPct(x.chg)}</div></div><span class="detail-status">${x.status}</span></div>
      <div class="periods" id="detailPeriods">${['1日','1周','1月','1年'].map(p=>`<button data-period="${p}" class="${p==='1周'?'active':''}">${p}</button>`).join('')}</div>
      <div class="chart-wrap"><svg class="chart ${x.chg>=0?'up':'down'}" id="detailChart" viewBox="0 0 360 150" preserveAspectRatio="none"><polyline id="detailLine" points="${chartPoints(x,'1周')}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="chart-caption">模拟走势 · 仅用于界面预览</div></div>
      <div class="stats stats-six"><div><small>今开</small><b>${priceFmt(open)}</b></div><div><small>昨收</small><b>${priceFmt(prev)}</b></div><div><small>最高</small><b>${priceFmt(high)}</b></div><div><small>最低</small><b>${priceFmt(low)}</b></div><div><small>市场</small><b>${x.region}</b></div><div><small>分类</small><b>${x.group||x.type}</b></div></div>
      ${x.type==='股票'?`<div class="info-strip"><span>${x.tag}</span><span>${x.group}</span><span>${x.code}</span></div>`:''}
    </div>
    ${related.length?`<div class="detail-related"><div class="section-head"><b>相关资产</b><span>${related.length} 项</span></div><div class="list">${rows(related)}</div></div>`:''}`
  }
  const originalOpenDetail=openDetail;
  openDetail=function(name){
    const x=assets.find(a=>a.name===name);
    if(!x){originalOpenDetail(name);return}
    el('detailTitle').textContent=x.name;
    el('detailCode').textContent=`${x.code} · ${x.region}`;
    const card=el('detailSheet').querySelector('.detail-card');
    if(card){
      const parent=card.parentElement;
      parent.querySelectorAll('.detail-card,.detail-related').forEach(n=>n.remove());
      parent.insertAdjacentHTML('beforeend',makeDetail(x));
    }
    let old=document.getElementById('favBtn');if(old)old.remove();
    const btn=document.createElement('button');btn.id='favBtn';btn.className='fav-btn';btn.textContent=favs.has(name)?'★ 已自选':'☆ 加自选';
    btn.onclick=()=>{favs.has(name)?favs.delete(name):favs.add(name);saveFavs();btn.textContent=favs.has(name)?'★ 已自选':'☆ 加自选'};
    el('detailSheet').querySelector('.sheet-header').appendChild(btn);
    el('detailSheet').classList.remove('hidden');
    document.querySelectorAll('#detailPeriods button').forEach(b=>b.onclick=()=>{
      document.querySelectorAll('#detailPeriods button').forEach(z=>z.classList.remove('active'));
      b.classList.add('active');
      const line=document.getElementById('detailLine');if(line)line.setAttribute('points',chartPoints(x,b.dataset.period));
    });
    document.querySelectorAll('.detail-related .row[data-name]').forEach(r=>r.onclick=()=>openDetail(r.dataset.name));
  };
})();