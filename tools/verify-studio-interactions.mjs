import assert from 'node:assert/strict';
import {launchBrowser} from './browser.mjs';
import {startPreview} from './preview-growth.mjs';
const preview=await startPreview(0), browser=await launchBrowser(), failures=[];
const check=(value,message)=>{if(!value) failures.push(message);};
try {
  for(const lang of ['uk','en','ru']) for(const kind of ['training','nutrition','lab']) {
    const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
    await context.route('**/*',r=>new URL(r.request().url()).origin===preview.url?r.continue():r.abort());
    const page=await context.newPage(),errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${preview.url}/${kind==='lab'?'labs':kind}?access=admin&lang=${lang}`,{waitUntil:'networkidle'});
    await page.locator('[data-marketing-consent=essential]').click();
    const original=await page.locator('#'+kind+'-form').evaluate(e=>Object.fromEntries(new FormData(e)));
    for(const next of ['en','ru',lang]) await page.evaluate(lang=>window.VitalRiseI18n.setLanguage(lang),next);
    await page.waitForFunction(lang=>document.documentElement.lang===lang,lang);
    check(JSON.stringify(await page.locator('#'+kind+'-form').evaluate(e=>Object.fromEntries(new FormData(e))))===JSON.stringify(original),`${kind}/${lang} language changed form values`);
    check(await page.locator('.studio-actions button').innerText() === ({uk:{training:'Створити програму',nutrition:'Розрахувати раціон',lab:'Сформувати панель'},en:{training:'Create training plan',nutrition:'Calculate meal plan',lab:'Build test panel'},ru:{training:'Создать программу',nutrition:'Рассчитать рацион',lab:'Сформировать панель'}})[lang][kind],`${kind}/${lang} action translation`);
    if(kind==='training') {
      await page.locator('[data-value=gym]').focus();await page.keyboard.press('ArrowRight');
      check(await page.locator('#training-place').inputValue()==='home',`${lang}: arrow key segments`);
      await page.locator('[data-value=gym]').click();
      await page.locator('#body-weight').fill('80');await page.locator('#duration').fill('60');
      await page.locator('.studio-advanced > summary').click();await page.locator('#bench-1rm').fill('10');await page.locator('.studio-advanced > summary').click();
      await page.locator('.studio-actions button').click();
      check(await page.locator('.studio-advanced').getAttribute('open')!==null,`${lang}: invalid optional field not revealed`);
      check(await page.locator('#bench-1rm').evaluate(e=>document.activeElement===e),`${lang}: invalid focus lost`);
      await page.locator('#bench-1rm').fill('80');
      await page.locator('#exercise-atlas-open').click();
      check(await page.locator('.studio-actions').evaluate(e=>getComputedStyle(e).visibility==='hidden'),`${lang}: dock not hidden in atlas`);
    }
    if(kind==='lab') {
      check(!await page.locator('#lab-review-form').isVisible(),`${lang}: review gate initially open`);
      await page.locator('#lab-sex').selectOption('female');
      check(await page.locator('#lab-cycle').isVisible(),`${lang}: female context hidden`);
      check(!await page.locator('#lab-prostate-risk').isVisible(),`${lang}: male-only context shown`);
      await page.locator('.studio-actions button').click();
      await page.locator('#lab-review-panel > summary').click();
      check(await page.locator('#lab-review-form').isVisible(),`${lang}: generated review not visible`);
      check(!await page.locator('.studio-actions').isVisible(),`${lang}: panel dock visible in review`);
      await page.locator('#review-ferritin').fill('42');
      await page.locator('#lab-review-form [type=submit]').click();
      check(await page.locator('#lab-review-result .result-placeholder').count()===0,`${lang}: lab review failed`);
      check(await page.locator('#lab-review-export-actions').isVisible(),`${lang}: lab export hidden`);
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${lang}: lab review overflow`);
      if(lang==='uk') await page.screenshot({path:'.impeccable/review/lab-review-390.png'});
      await page.locator('#lab-review-panel > summary').click();
      check(await page.locator('.studio-actions').isVisible(),`${lang}: dock not restored after review`);
    }
    check(errors.length===0,`${kind}/${lang}: ${errors.join(';')}`);
    console.log(JSON.stringify({kind,lang,errors}));await context.close();
  }
  const desktop=await browser.newPage({viewport:{width:1440,height:600}});
  await desktop.goto(preview.url+'/nutrition?access=admin',{waitUntil:'networkidle'});
  await desktop.locator('[data-marketing-consent=essential]').click();
  for(const y of [0,350]) {
    await desktop.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);
    await desktop.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const box=await desktop.locator('.studio-actions').boundingBox();
    check(box.y>=76&&box.y+box.height<=600,'short desktop action outside viewport at scroll '+y);
  }
  await desktop.close();
  console.log(JSON.stringify({failures})); assert.deepEqual(failures,[]);
} finally {await browser.close();await new Promise(r=>preview.server.close(r));}
