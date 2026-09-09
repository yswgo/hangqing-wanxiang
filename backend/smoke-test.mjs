const base=(process.argv[2]||process.env.GATEWAY_URL||'').replace(/\/$/,'');
if(!base){console.error('Usage: node smoke-test.mjs https://<worker>.workers.dev');process.exit(2)}

async function get(path){
  const r=await fetch(base+path,{headers:{Accept:'application/json'}});
  const body=await r.json().catch(()=>({}));
  return {status:r.status,ok:r.ok,body};
}
function check(cond,msg){if(!cond)throw new Error(msg)}

try{
  const health=await get('/health');
  check(health.ok,'/health failed');
  check(health.body?.schemaVersion===2,'unexpected schemaVersion');
  console.log('✓ /health',health.body.version,health.body.scope||[]);

  const ready=await get('/ready');
  check(ready.ok,'/ready HTTP failed');
  console.log('✓ /ready',ready.body.ok?'provider ready':'no provider configured');

  if(ready.body?.US?.configured){
    const quotes=await get('/quotes?codes=NVDA,AAPL');
    check(quotes.ok,'/quotes failed');
    check(Array.isArray(quotes.body?.data)&&quotes.body.data.length>0,'no quote data');
    const q=quotes.body.data[0];
    check(q.isMock===false,'quote unexpectedly mock');
    check(q.price!=null,'quote missing price');
    check(q.fetchedAt!=null,'quote missing fetchedAt');
    console.log('✓ /quotes',q.code,q.price,q.source,'quoteDate=',q.quoteDate||'unknown');

    const history=await get('/history?code=NVDA&period=1d');
    check(history.ok,'/history failed');
    check(Array.isArray(history.body?.points)&&history.body.points.length>0,'no history data');
    console.log('✓ /history',history.body.points.length,'points');
  }else{
    console.log('! US provider is not configured; quote/history tests skipped.');
  }
  console.log('Gateway smoke test completed.');
}catch(e){
  console.error('Smoke test failed:',e.message);
  process.exit(1);
}
