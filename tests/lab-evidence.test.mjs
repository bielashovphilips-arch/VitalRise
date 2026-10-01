import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import vm from 'node:vm';
import {launchBrowser} from '../tools/browser.mjs';
import {startPreview} from '../tools/preview-growth.mjs';

function setup() {
  const context=vm.createContext({window:{},document:{getElementById:()=>null},console});
  for(const name of ['labs','lab-evidence','lab-protocols']) vm.runInContext(readFileSync(`assets/js/modules/${name}.js`,'utf8'),context);
  return context.window.VitalRiseSystem;
}
test('preparation covers all nine concerns without universal abstinence or medication withdrawal rules',()=>{
  const e=setup().labEvidence;
  assert.equal(e.preparationItems().length,9);
  const items=Object.fromEntries(e.preparationItems().map(item=>[item.id,item]));
  assert.match(items.injections.text,/не скасовуй/);
  assert.match(items.sex.text,/48 годин/);
  assert.match(items.sex.text,/Загальної вимоги.*немає/);
  assert.match(items.fasting.text,/HbA1c не потребує/);
  assert.match(items.alcohol.text,/не гарантують/);
  assert.match(e.renderPreparation(),/EFLM/);
});
test('fasting and nonfasting glucose get different interpretations; no automatic diagnosis',()=>{
  const s=setup();
  const data={'review-glucose':'7.2','review-sex':'male'};
  const fasting=s.labProtocols.evaluateLabResults({...data,'review-fasting':'fasting'});
  const fed=s.labProtocols.evaluateLabResults({...data,'review-fasting':'not_fasting'});
  assert.equal(fasting.status,'red');
  assert.equal(fed.status,'neutral');
  assert.match(s.labEvidence.renderReview(fed),/Умови натще не підтверджені/);
  assert.match(s.labEvidence.renderReview(fasting),/niddk.nih.gov/);
  const insulin=s.labProtocols.evaluateLabResults({'review-insulin':'16','review-fasting':'fasting'});
  assert.equal(insulin.status,'neutral');
  assert.doesNotMatch(JSON.stringify(insulin),/високий за спортивним/);
});
test('evidence is limited to entered markers and male testosterone guidance is not shown for women',()=>{
  const s=setup();
  assert.equal(s.labEvidence.renderReview(s.labProtocols.evaluateLabResults({})), '');
  const result=s.labProtocols.evaluateLabResults({'review-sex':'female','review-testosterone':'1','review-ferritin':'40'});
  const html=s.labEvidence.renderReview(result);
  assert.match(html,/ferritin-blood-test/);
  assert.doesNotMatch(html,/statement-on-testosterone|kidney.org/);
  assert.equal(result.sex,'female');
});
test('mobile page: preparation, entered results and relevant evidence render without overflow',async()=>{
  const preview=await startPreview(0);
  let browser;
  try {
    browser=await launchBrowser();
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.route('**/*',route=>new URL(route.request().url()).origin===preview.url?route.continue():route.abort());
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(preview.url+'/labs.html?access=admin',{waitUntil:'networkidle'});
    await page.locator('[data-marketing-consent="essential"]').click();
    await page.locator('.lab-preparation-before summary').click();
    assert.equal(await page.locator('.lab-preparation-before [data-preparation]').count(),9);
    await page.locator('button[type=submit][form="lab-form"]').click();
    await page.locator('#lab-review-panel > summary').click();
    await page.locator('#review-fasting').selectOption('not_fasting');
    await page.locator('#review-glucose').fill('7.2');
    await page.locator('#lab-review-form button[type=submit]').click();
    assert.match(await page.locator('.lab-evidence-report').innerText(),/Умови натще не підтверджені/);
    assert.ok(await page.locator('.lab-evidence-report a[href*="niddk.nih.gov"]').count());
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    mkdirSync('.tmp/qa',{recursive:true});
    await page.locator('.lab-evidence-report').screenshot({path:'.tmp/qa/lab-evidence-mobile.png'});
    assert.deepEqual(errors,[]);
  } finally {if(browser)await browser.close();await new Promise(resolve=>preview.server.close(resolve));}
});
