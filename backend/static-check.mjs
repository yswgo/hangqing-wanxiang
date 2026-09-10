import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const fail = message => { throw new Error(message); };
const worker = read('./cloudflare-worker-v82.js');
const core = read('./cloudflare-worker.js');
const wrangler = read('./wrangler.toml');

for (const [name, source] of [['core', core], ['v82', worker]]) {
  const checkable = source.replace(/^import\s+[^;]+;\s*/m, '').replace(/export\s+default/, 'const __default =');
  try { new vm.Script(checkable, { filename: name + '.js' }); }
  catch (error) { fail(name + ' syntax error: ' + error.message); }
}

if (!wrangler.includes('main = "cloudflare-worker-v82.js"')) fail('wrangler does not target V82');
if (!worker.includes("const WB_MARKETS=['US','HK','CN']")) fail('formal Webull market list is incomplete');
for (const category of ['US_STOCK','HK_STOCK','CN_STOCK']) if (!worker.includes(category)) fail('missing ' + category);
for (const secret of ['WEBULL_APP_KEY','WEBULL_APP_SECRET','WEBULL_ACCESS_TOKEN']) {
  const assignment = new RegExp('(?:const|let|var)\\s+' + secret + '\\s*=');
  if (assignment.test(worker)) fail(secret + ' must not be hard-coded');
}
if (!worker.includes('isMock:false') || !worker.includes('isSandbox:false')) fail('production quote trust flags missing');
if (!worker.includes('delayed:null')) fail('unknown entitlement freshness must remain explicit');
if (!worker.includes('_staleCache=true')) fail('stale real cache fallback missing');
if (!core.includes("https://stocktoday.cn/api/tools")) fail('StockToday official endpoint missing');
if (!core.includes("call('stk_mins'")) fail('StockToday minute-series adapter missing');
if (!core.includes("provider='stocktoday_rt_min'") || !core.includes("provider='stocktoday_stk_mins'")) {
  fail('StockToday minute provider labels missing');
}
if (!core.includes('stockTodayBars(code,period,env)')) fail('StockToday K-line adapter missing');
for (const period of ['intraday','1d','1w','1m']) if (!core.includes("'" + period + "'")) fail('missing CN history period ' + period);

if (/Mock/i.test(worker.replace(/isMock/g,''))) fail('V82 production wrapper must not manufacture Mock data');

console.log('Backend V82 static regression checks passed.');
