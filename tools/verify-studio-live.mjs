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
for (const path of ['training.html','nutrition.html','labs.html','assets/css/calculator-studio.css','assets/js/modules/calculator-studio.js','service-worker.js']) {
  const response = await fetch(origin+'/'+path+'?v=studio-20260912-1');
  assert.equal(response.status,200,path);
  assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(execFileSync('git',['show','HEAD:'+path])),path+' deployed bytes');
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
  await cachePage.waitForFunction(async()=>{
    const registration=await navigator.serviceWorker.getRegistration();
    return registration?.active && (await caches.keys()).includes('vitalrise-studio-20260912-1');
  },null,{timeout:60000});
  const cached=await cachePage.evaluate(async()=>{
    const cache=await caches.open('vitalrise-studio-20260912-1');
    return Boolean(await cache.match('./assets/css/calculator-studio.css?v=studio-20260912-1')) && Boolean(await cache.match('./assets/js/modules/calculator-studio.js?v=studio-20260912-1'));
  });
  assert.equal(cached,true);
  console.log(JSON.stringify({verifiedAssets:6,serviceWorkerActive:true,studioAssetsCached:true}));
  await cacheContext.close();
} finally {await browser.close();}
