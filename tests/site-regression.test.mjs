import {test, before, after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {launchBrowser} from '../tools/browser.mjs';
import {startPreview} from '../tools/preview-growth.mjs';

test('newsletter Pages endpoint: bounded body, validation, same origin, storage truth and private errors', async () => {
  const code = await readFile('functions/api/newsletter.js', 'utf8');
  const {onRequest} = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
  const records = new Map(), env = {VITALRISE_ACCESS:{get:async key => records.get(key) || null, put:async (key,value) => records.set(key,JSON.parse(value))}};
  const body = {email:'Example@example.test',language:'uk',source:'first_week_guide',page:'/?email=secret',consent:true,consentVersion:'2026-09-06'};
  const send = (payload = body, options = {}) => onRequest({request:new Request(origin + '/api/newsletter', {method:'POST',headers:{'Content-Type':'application/json',Origin:origin,...options.headers},body:JSON.stringify(payload)}),env:options.env || env,waitUntil:promise => promise});
  assert.equal((await send({...body,consent:false})).status, 400);
  assert.equal((await send({...body,email:'not-email'})).status, 400);
  assert.equal((await send({...body,website:'spam'})).status, 400);
  assert.equal((await send(body,{headers:{Origin:'https://invalid.test'}})).status,403);
  assert.equal((await send({...body,padding:'x'.repeat(20000)})).status,400);
  assert.equal((await send(body,{env:{}})).status,503);
  const response = await send(); assert.deepEqual(await response.json(),{ok:true,stored:true});
  const record = [...records.values()][0]; assert.equal(record.page,'/'); assert.equal(record.email,'example@example.test'); assert.equal(record.delivery,'not_sent'); assert.equal(record.consent.version,'2026-09-06');
  await send(); assert.equal(records.size,1);
  const failed = await send(body,{env:{VITALRISE_ACCESS:{get:async () => {throw new Error('secret binding value');}}}});
  assert.equal(failed.status,500); assert.doesNotMatch(await failed.text(),/secret binding/);
});

const origin = 'https://vitalrise.com.ua';
let browser, preview;
before(async () => { preview = await startPreview(0); browser = await launchBrowser(); await mkdir('.tmp/verified-original', {recursive:true}); });
after(async () => { await browser?.close(); if (preview) await new Promise(resolve => preview.server.close(resolve)); });
async function localPage(options = {}) {
  const context = await browser.newContext({viewport:{width:390,height:844}, ...options});
  await context.route('**/*', route => new URL(route.request().url()).origin === preview.url ? route.continue() : route.abort());
  return {context, page:await context.newPage()};
}

test('protected original photos, CSS, animation files and module frames remain unchanged', async () => {
  const protectedFiles = execFileSync('git', ['ls-tree','-r','--name-only','0f5ae1e','--','assets/css','assets/images'], {encoding:'utf8'}).trim().split('\n');
  protectedFiles.push('functions/_shared/access.js', 'assets/js/modules/founder-access.js', 'assets/js/modules/training-prescription.js', 'assets/js/modules/hero-parallax.js', 'assets/js/modules/pricing-flip.js');
  for (const file of protectedFiles) {
    const expected = execFileSync('git',['show','0f5ae1e:' + file], {maxBuffer:32 * 1024 * 1024});
    const actual = await readFile(file);
    if (/\.(png|jpe?g|webp|gif|ico|woff2?)$/i.test(file)) assert.deepEqual(actual, expected, file);
    else assert.equal(actual.toString().replace(/\r\n/g,'\n'), expected.toString().replace(/\r\n/g,'\n'),file);
  }
  const html = await readFile('index.html','utf8');
  assert.match(html, /class="hero" data-parallax-hero/);
  assert.match(html, /class="hero-light-sweep"/);
  assert.match(html, /class="pricing-card pricing-card-flip"/);
  assert.doesNotMatch(html, /growth\.css|class="growth-page"|src="=?growth/);
  assert.ok(html.indexOf('id="features"') < html.indexOf('id="pricing"'));
  assert.ok(html.indexOf('class="pricing-grid') < html.indexOf('id="free-calculator"'));
  assert.doesNotMatch(await readFile('sitemap.xml','utf8'), /\/en\/|\/ru\/|\/calorie-calculator|\/first-week/);
});

for (const language of ['uk','en','ru']) test(language + ': original homepage, working CTA/calculator, localized checkout and persistent consent refusal', async () => {
  const {context,page} = await localPage(); const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(preview.url + '/?lang=' + language + '&utm_source=test', {waitUntil:'networkidle'});
    assert.equal(await page.locator('html').getAttribute('lang'), language);
    const cta = page.locator('.hero-actions .btn-primary');
    assert.match(await cta.getAttribute('href'), /#free-calculator$/);
    assert.equal(await cta.textContent(), {uk:'Розрахувати калорії',en:'Calculate calories',ru:'Рассчитать калории'}[language]);
    assert.equal(await page.locator('.header-cta').textContent(), await cta.textContent());
    assert.match(await page.locator('.header-cta').getAttribute('href'), /^\/(?:\?lang=(?:uk|en|ru))?#free-calculator$/);
    assert.equal(await page.locator('.hero-media img').evaluate(el => el.naturalWidth > 0), true);
    await page.locator('[data-marketing-consent=essential]').click();
    assert.equal(await page.locator('#vitalrise-ga4, #vitalrise-meta-pixel').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const form = page.locator('#free-calculator-form');
    await form.locator('[name=sex]').selectOption('male');
    await form.locator('[name=age]').fill('30'); await form.locator('[name=weight]').fill('80'); await form.locator('[name=height]').fill('180');
    await form.locator('[name=activity]').selectOption('1.2'); await form.locator('[name=goal]').selectOption('1');
    await form.locator('button').click();
    assert.equal((await page.locator('[data-free-value]').textContent()).replace(/[^0-9]/g,''),'2140');
    assert.equal(await page.evaluate(() => localStorage.getItem('vitalrise:access:activated:v2')),null);
    await page.locator('#free-calculator-result [data-select-plan]').click();
    await page.locator('#payment-modal.open').waitFor();
    assert.match(await page.locator('#payment-title').textContent(),/Start/);
    assert.equal(await page.locator('#payment-renewal-consent').isChecked(),true);
    await page.locator('#payment-close-button').click();
    const expectedCanonical = origin + '/' + (language === 'uk' ? '' : '?lang=' + language);
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),expectedCanonical);
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.locator('[data-vitalrise-marketing-banner]').count(),0);
    if (language === 'uk') {
      for (const [name, width, height] of [['mobile',390,844],['desktop',1440,1000]]) {
        const capture = await context.newPage();
        await capture.setViewportSize({width,height});
        await capture.goto(preview.url,{waitUntil:'networkidle'});
        await capture.locator('.hero-title').waitFor({state:'visible'});
        await capture.waitForFunction(() => scrollY === 0 && document.querySelector('.hero-media img').naturalWidth > 0);
        await capture.screenshot({path:'.tmp/verified-original/' + name + '.png'});
        await capture.close();
      }
    }
    assert.deepEqual(errors,[]);
  } finally {await context.close();}
});

test('existing newsletter form submits explicit consent, retains email on failure, and does not claim success without storage', async () => {
  const {context,page} = await localPage(); let payload, state = 'failed';
  await page.route('**/api/newsletter', async route => {
    payload = route.request().postDataJSON();
    await route.fulfill({status:state === 'failed' ? 503 : 200, contentType:'application/json', body:JSON.stringify(state === 'failed' ? {ok:false} : state === 'not-stored' ? {ok:true} : {ok:true,stored:true})});
  });
  try {
    await page.goto(preview.url,{waitUntil:'networkidle'}); await page.locator('[data-marketing-consent=essential]').click();
    await page.locator('#newsletter-form input').fill('example@example.test');
    await page.locator('#newsletter-form button').click();
    await page.waitForFunction(() => document.querySelector('#newsletter-status').textContent.includes('Не збережено'));
    assert.equal(await page.locator('#newsletter-form input').inputValue(),'example@example.test');
    state = 'not-stored'; await page.locator('#newsletter-form button').click();
    await page.waitForFunction(() => !document.querySelector('#newsletter-form button').disabled);
    assert.match(await page.locator('#newsletter-status').textContent(),/Не збережено/);
    state = 'saved'; await page.locator('#newsletter-form button').click();
    await page.waitForFunction(() => document.querySelector('#newsletter-status').textContent.includes('Готово'));
    assert.equal(await page.locator('#newsletter-form input').inputValue(),'');
    assert.equal(payload.consent,true); assert.equal(payload.consentVersion,'2026-09-06');
    assert.deepEqual(Object.keys(payload).sort(),['email','language','source','page','consent','consentVersion'].sort());
    assert.equal(await page.evaluate(() => localStorage.getItem('vitalrise:access:email:v2')),null);
  } finally {await context.close();}
});

test('analytics requires opt-in, separates calculation/lead events and deduplicates paid purchases', async () => {
  const context = await browser.newContext(); const page = await context.newPage();
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) {await route.fulfill({status:200,contentType:'application/javascript',body:''}); return;}
    const result = await fetch(preview.url + url.pathname + url.search);
    await route.fulfill({status:result.status,contentType:result.headers.get('content-type'),body:Buffer.from(await result.arrayBuffer())});
  });
  try {
    await page.goto(origin + '/?utm_source=instagram&email=private@example.test&token=secret',{waitUntil:'networkidle'});
    assert.equal(await page.evaluate(() => Boolean(window.dataLayer)),false);
    await page.locator('[data-marketing-consent=accepted]').click();
    await page.evaluate(() => {
      const a = window.VitalRiseAnalytics; a.trackFreeCalculation(); a.trackNewsletterSignup(); a.trackCheckoutStart('start');
      a.trackPurchase('start','mock-123'); a.trackPurchase('start','test-order-123'); a.trackPurchase('start','test-order-123');
    });
    const data = await page.evaluate(() => window.dataLayer.map(item => [...item]));
    const events = data.filter(item => item[0] === 'event').map(item => item[1]);
    assert.equal(events.filter(event => event === 'purchase').length,1);
    assert.ok(events.includes('calculator_complete')); assert.ok(events.includes('generate_lead')); assert.ok(events.includes('begin_checkout'));
    assert.doesNotMatch(JSON.stringify(data),/private@example|secret|"weight"|"sex"|"age"|mock-123/);
    assert.equal(await page.locator('#vitalrise-meta-pixel').count(),0);
  } finally {await context.close();}
});

test('existing app pages load with no runtime errors, broken scripts or new missing images', async () => {
  const {context,page} = await localPage({viewport:{width:1366,height:900}}), errors = [], broken = [];
  page.on('pageerror',error => errors.push(error.message));
  page.on('response',response => {if (response.status() >= 400 && /\.(?:js|css|svg|jpg|webp)(?:\?|$)/.test(response.url())) broken.push(response.url());});
  try {
    for (const path of ['/training','/nutrition','/labs?lang=en&utm_source=test']) {
      await page.goto(preview.url + path,{waitUntil:'networkidle'});
      assert.doesNotMatch(await page.locator('link[rel=canonical]').getAttribute('href'),/utm_source/);
    }
    assert.deepEqual(errors,[]);
    assert.deepEqual(broken.filter(url => new URL(url).pathname !== '/assets/images/nutrition-athlete.jpg'),[]);
  } finally {await context.close();}
});

test('original nutrition-athlete.jpg is available', {todo:'Pre-existing local/live 404. Original photo required; substituting photos is not authorized.'}, async () => {
  assert.equal((await fetch(preview.url + '/assets/images/nutrition-athlete.jpg')).status,200);
});
