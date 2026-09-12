import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {launchBrowser} from './browser.mjs';

const origin = 'https://vitalrise.com.ua';
const hash = value => createHash('sha256').update(value).digest('hex');
const assets = ['assets/js/modules/i18n.js','assets/js/modules/access.js','assets/js/modules/free-calculator.js','assets/js/modules/marketing.js','assets/css/style.css','assets/css/brand-icon.css','assets/images/logo-icon.svg','assets/js/modules/training-prescription.js','service-worker.js'];
await Promise.all(assets.map(async path => {
  const response = await fetch(origin + '/' + path + '?v=growth-20260912-1');
  assert.equal(response.status,200,path);
  assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(execFileSync('git',['show','HEAD:' + path])),path + ': deployed bytes differ');
}));
assert.equal((await fetch(origin + '/api/newsletter')).status,405,'Newsletter route must be deployed');
const browser = await launchBrowser();
try {
  for (const width of [390,1440]) for (const lang of ['uk','en','ru']) {
    const context = await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});
    // Never create leads, charges, access sessions or analytics events in this smoke test.
    await context.route('**/*',route => {
      const req = route.request(), url = new URL(req.url());
      return url.origin === origin && req.method() === 'GET' ? route.continue() : route.abort();
    });
    const page = await context.newPage(), errors = [];
    page.on('pageerror',error => errors.push(error.message));
    await page.goto(origin + '/training?lang=' + lang,{waitUntil:'networkidle'});
    await page.locator('[data-marketing-consent=essential]').click();
    if (width === 390) {
      // Mobile header CTA is intentionally hidden by the existing design.
      await page.goto(new URL(await page.locator('.header-cta').getAttribute('href'),origin).href,{waitUntil:'networkidle'});
    } else await Promise.all([page.waitForURL(url => url.pathname === '/' && url.hash === '#free-calculator'),page.locator('.header-cta').click()]);
    assert.equal(await page.locator('html').getAttribute('lang'),lang);
    assert.equal(new URL(page.url()).pathname,'/');
    assert.equal(await page.locator('.hero-actions .btn-primary').textContent(),{uk:'Розрахувати калорії',en:'Calculate calories',ru:'Рассчитать калории'}[lang]);
    const form = page.locator('#free-calculator-form');
    await form.locator('[name=sex]').selectOption('male');
    for (const [key,value] of Object.entries({age:'30',weight:'80',height:'180'})) await form.locator('[name='+key+']').fill(value);
    await form.locator('[name=activity]').selectOption('1.2');
    await form.locator('[name=goal]').selectOption('1');
    await form.locator('button').click();
    assert.equal((await page.locator('[data-free-value]').textContent()).replace(/\D/g,''),'2140');
    await page.locator('#free-calculator-result [data-select-plan]').click();
    await page.locator('#payment-modal.open').waitFor();
    assert.equal(await page.locator('#payment-renewal-consent').isChecked(),true);
    assert.equal(await page.evaluate(() => localStorage.getItem('vitalrise:access:activated:v2')),null);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
    assert.equal(await page.locator('#vitalrise-ga4,#vitalrise-meta-pixel').count(),0);
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({origin,width,lang,cta:true,calories:2140,checkout:true,errors}));
    await context.close();
  }
} finally { await browser.close(); }
console.log(JSON.stringify({verifiedAssets:assets.length,newsletterRoute:true}));
