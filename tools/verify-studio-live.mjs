import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {launchBrowser} from './browser.mjs';

// Canonical origin only. Never log credentials or persist browser state.
const origin = 'https://vitalrise.com.ua';
const ownerFile = process.env.VITALRISE_OWNER_FILE;
assert.ok(ownerFile, 'Supply VITALRISE_OWNER_FILE pointing to the private owner credentials');
const login = JSON.parse(await readFile(ownerFile,'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
// Cloudflare removes email_off comments and appends its managed JS challenge.
// Normalize only these observed edge transforms, not application markup.
const edgeHtml = value => value.toString('utf8')
  .replace(/<!--\/?email_off-->/g,'')
  .replace(/<script>\(function\(\)\{function c\(\)\{var b=a\.contentDocument[\s\S]*?<\/script>/g,'');
for (const path of ['training.html','nutrition.html','labs.html','assets/css/calculator-studio.css','assets/js/modules/calculator-studio.js','service-worker.js','assets/images/training-gym-vitalrise.webp']) {
  const response = await fetch(origin+'/'+path+'?v=studio-20260912-3');
  assert.equal(response.status,200,path);
  const actual=Buffer.from(await response.arrayBuffer()), expected=execFileSync('git',['show','HEAD:'+path]);
  assert.equal(hash(path.endsWith('.html')?edgeHtml(actual):actual),hash(path.endsWith('.html')?edgeHtml(expected):expected),path+' deployed bytes');
}
const browser = await launchBrowser();
try {
  for (const width of [390,1440]) {
    const context = await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});
    await context.route('**/*',route => {
      const req=route.request(), url=new URL(req.url());
      const font = ['fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname) && req.method()==='GET';
      const auth = ['/api/access/founder','/api/access/verify'].includes(url.pathname) && req.method()==='POST';
      return font || (url.origin===origin && (req.method()==='GET'||auth)) ? route.continue() : route.abort();
    });
    const page=await context.newPage(), errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/founder-access',{waitUntil:'networkidle'});
    await page.locator('#founder-email').fill(login.email);
    await page.locator('#founder-secret').fill(login.secret);
    await page.locator('button[type=submit]').click();
    await page.waitForURL(origin+'/',{timeout:20000});
    await page.locator('[data-marketing-consent=essential]').click();
    for (const kind of ['training','nutrition','lab']) {
      await page.goto(origin+'/'+(kind==='lab'?'labs':kind),{waitUntil:'networkidle'});
      await page.waitForFunction(()=>window.VitalRiseSystem?.access?.getTier()==='admin' && document.body.classList.contains('studio-ready'));
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('.is-locked-module,.module-paywall').count(),0);
      const data = kind==='training'?{'body-weight':'80',duration:'60'}:kind==='nutrition'?{age:'30',height:'180',weight:'80'}:{'lab-age':'35'};
      for (const [id,value] of Object.entries(data)) await page.locator('#'+id).fill(value);
      if (kind==='training') {
        await page.locator('[data-value=home]').click();
        assert.equal(await page.locator('#training-place').inputValue(),'home');
      }
      await page.locator('.studio-actions [type=submit]').click();
      assert.equal(await page.locator('#'+kind+'-result .result-placeholder').count(),0);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      console.log(JSON.stringify({kind,width,owner:true,calculation:true,overflow:false,interLoaded:await page.evaluate(()=>document.fonts.check('16px Inter'))}));
    }
    assert.deepEqual(errors,[]);
    await context.close();
  }
  // A separate anonymous context exercises the real new service-worker install.
  // No account data is used in this cache check.
  const cacheContext=await browser.newContext();
  const cachePage=await cacheContext.newPage();
  await cachePage.goto(origin+'/training',{waitUntil:'networkidle'});
  const cached=await cachePage.evaluate(async()=>{
    // Await the actual activation, not merely the cache created during install.
    await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Service worker activation timed out')),55000))]);
    const cache=await caches.open('vitalrise-studio-20260912-3');
    return Boolean(await cache.match(new URL('/assets/css/calculator-studio.css?v=studio-20260912-3',location.origin))) && Boolean(await cache.match(new URL('/assets/js/modules/calculator-studio.js?v=studio-20260912-1',location.origin))) && Boolean(await cache.match(new URL('/assets/images/training-gym-vitalrise.webp',location.origin)));
  });
  assert.equal(cached,true);
  console.log(JSON.stringify({verifiedAssets:7,serviceWorkerActive:true,studioAssetsCached:true}));
  await cacheContext.close();
} finally {await browser.close();}
