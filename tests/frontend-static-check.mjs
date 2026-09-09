import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const fail = message => { throw new Error(message); };
const count = (text, pattern) => (text.match(pattern) || []).length;

const files = {
  html: read('index.html'),
  app: read('app.js'),
  fixes: read('fixes.js'),
  enhancements: read('enhancements.js'),
  runtime: read('product-runtime.js'),
  baseCss: read('styles.css'),
  enhancementsCss: read('enhancements.css'),
  runtimeCss: read('product-runtime.css')
};

for (const [name, source] of Object.entries({
  app: files.app,
  fixes: files.fixes,
  enhancements: files.enhancements,
  runtime: files.runtime
})) {
  try { new vm.Script(source, { filename: name + '.js' }); }
  catch (error) { fail(name + ' syntax error: ' + error.message); }
}

const versionMatch = files.html.match(/localStorage\.setItem\('hw-product-version','(\d+)'\)/);
if (!versionMatch) fail('product version marker is missing');
const version = versionMatch[1];
const assets = ['styles.css','enhancements.css','product-runtime.css','app.js','fixes.js','enhancements.js','product-runtime.js'];
for (const asset of assets) {
  const hits = count(files.html, new RegExp(asset.replace('.', '\\.') + '\\?v=' + version, 'g'));
  if (hits !== 1) fail(asset + ' must be referenced exactly once with ?v=' + version + '; got ' + hits);
}

if (/data-integrity\.js|ux-runtime\.js/.test(files.html)) fail('deleted temporary runtimes are still referenced');
for (const [name, css] of Object.entries({base:files.baseCss,enhancements:files.enhancementsCss,runtime:files.runtimeCss})) {
  if (/\@import\s+(?:url\()?['"]?https?:/i.test(css)) fail(name + ' CSS contains a remote @import');
}

const selectors = ['.runtime-detail-blocks','.runtime-live','.runtime-history','.alert-editor','.v76-sort','.v76-gateway','.v78-provider-grid'];
for (const selector of selectors) if (!files.runtimeCss.includes(selector)) fail('missing critical selector ' + selector);

if (count(files.runtime, /renderAll\s*=\s*function/g) !== 1) fail('product runtime renderAll wrapper count changed');
if (count(files.runtime, /openDetail\s*=\s*function/g) !== 1) fail('product runtime openDetail wrapper count changed');
if (count(files.fixes, /renderAll\s*=\s*function/g) !== 1) fail('fixes renderAll wrapper count changed');
if (count(files.fixes, /openDetail\s*=\s*function/g) !== 1) fail('fixes openDetail wrapper count changed');
if (count(files.enhancements, /openDetail\s*=\s*function/g) !== 1) fail('enhancements openDetail wrapper count changed');
if (!files.runtime.includes('__HW_PRODUCT_RUNTIME_V' + version + '__')) fail('runtime duplicate-init guard/version mismatch');
const ids = [...files.html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) fail('duplicate static HTML ids: ' + [...new Set(duplicateIds)].join(', '));

console.log('Frontend static regression checks passed for V' + version + '.');
