import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {launchBrowser} from '../tools/browser.mjs';
import {startPreview} from '../tools/preview-growth.mjs';

test('replacement preview changes only the confirmed food; quality coverage, saved amounts and export stay truthful', async () => {
  const preview=await startPreview(0),browser=await launchBrowser();
  try {
    const context=await browser.newContext({viewport:{width:1440,height:1000}});
    context.setDefaultTimeout(7000);
    await context.route('**/*',route=>new URL(route.request().url()).origin===preview.url?route.continue():route.abort());
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(preview.url+'/nutrition.html?access=admin',{waitUntil:'networkidle'});
    if(await page.locator('[data-marketing-consent="essential"]').count())await page.locator('[data-marketing-consent="essential"]').click();
    for(const [id,value] of Object.entries({age:'28',height:'178',weight:'80'}))await page.locator('#'+id).fill(value);
    await page.locator('#nutrition-form button[type=submit]').click();
    const quality=page.locator('#nutrition-result [data-nutrition-disclosure="quality"]');
    await quality.locator('summary').first().click();
    assert.equal(await quality.locator('[data-quality]').count(),3);
    assert.ok(await quality.locator('[data-quality-status="incomplete"]').count()>0);
    const swap=page.locator('#nutrition-result [data-nutrition-disclosure="swap-lunch-chicken"]');
    const before=await page.locator('#nutrition-result .auto-meal-card').nth(1).locator('.nw-auto-food-label').allTextContents();
    await swap.locator('summary').first().click();
    assert.deepEqual(await page.locator('#nutrition-result .auto-meal-card').nth(1).locator('.nw-auto-food-label').allTextContents(),before,'Opening a preview must not change portions');
    const apply=swap.locator('[data-action="apply-food-swap"]').first();
    assert.ok(await apply.count());
    const id=await apply.getAttribute('data-id');
    assert.equal(id,'turkey');
    for(const key of ['breakfast','lunch'])await page.locator('#nutrition-result [data-nutrition-eaten="'+key+'"]').check();
    if(process.env.NUTRITION_CAPTURE){
      await mkdir('.tmp/nutrition-swaps-quality',{recursive:true});
      for(const width of [1440,390]){
        await page.setViewportSize({width,height:width===1440?1000:844});
        await quality.scrollIntoViewIfNeeded();
        await page.screenshot({path:'.tmp/nutrition-swaps-quality/preview-'+width+'.png'});
        await swap.scrollIntoViewIfNeeded();
        await page.screenshot({path:'.tmp/nutrition-swaps-quality/swap-'+width+'.png'});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      }
    }
    await apply.click();
    assert.equal(await page.locator('#nutrition-result .auto-meal-card').count(),4,'Ready menu remains the main view');
    assert.equal(await page.locator('#nutrition-result [data-nutrition-eaten="breakfast"]').isChecked(),true);
    assert.equal(await page.locator('#nutrition-result [data-nutrition-eaten="lunch"]').isChecked(),false);
    const after=await page.locator('#nutrition-result .auto-meal-card').nth(1).locator('.nw-auto-food-label').allTextContents();
    assert.deepEqual(after.slice(1),before.slice(1),'Other lunch foods stay unchanged');
    await page.locator('#nutrition-result [data-action="use-generated-menu"]').click();
    const portion=page.locator('#nutrition-result .nutrition-portion-input[data-meal="lunch"][data-id="turkey"]');
    const amount=await portion.inputValue();assert.ok(Number(amount)>0);
    assert.equal(await page.locator('#nutrition-result .nutrition-portion-input[data-meal="lunch"][data-id="chicken"]').count(),0);
    const template=page.locator('#nutrition-result [data-nutrition-disclosure="menu-template"]');
    await template.locator('summary').first().click();
    await page.locator('#nutrition-menu-template-name').fill('Swapped plan');
    await page.locator('[data-action="save-nutrition-menu-template"]').click();
    await portion.fill('100');await portion.press('Tab');
    await page.locator('#nutrition-menu-template-select').selectOption('Swapped plan');
    await page.locator('[data-action="load-nutrition-menu-template"]').click();
    assert.equal(await portion.inputValue(),amount);
    await page.setViewportSize({width:1440,height:1000});
    for(const [lang,title] of [['en','Nutritional quality'],['ru','Пищевая ценность'],['uk','Поживна якість']]) {
      await page.locator('[data-lang-switch="'+lang+'"]').first().click();
      assert.match(await page.locator('#nutrition-result [data-nutrition-disclosure="quality"] > summary').innerText(),new RegExp(title));
    }
    await page.locator('[data-print-target="nutrition-result"]').click();
    assert.equal(await page.locator('#mobile-report-phone [data-nutrition-disclosure^="swap-"]').count(),0);
    assert.equal(await page.locator('#mobile-report-phone [data-quality]').count(),3);
    assert.deepEqual(errors,[]);
    await context.close();
  }finally{await browser.close();preview.server.closeAllConnections();await new Promise(resolve=>preview.server.close(resolve));}
});

test('nutrition page: search, exact portions, multiple foods, favorites, recipes, saved menu and report on desktop and mobile', async () => {
  const preview = await startPreview(0), browser = await launchBrowser();
  try {
    const context = await browser.newContext({viewport:{width:1440,height:1000}});
    await context.route('**/*', route => new URL(route.request().url()).origin === preview.url ? route.continue() : route.abort());
    context.setDefaultTimeout(7000);
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(preview.url+'/nutrition.html?access=admin',{waitUntil:'networkidle'});
    if (await page.locator('[data-marketing-consent="essential"]').count()) await page.locator('[data-marketing-consent="essential"]').click();
    assert.equal(await page.locator('.nw-advanced').evaluate(n=>n.open),false);
    for (const [id,value] of Object.entries({age:'28',height:'178',weight:'80'})) await page.locator('#'+id).fill(value);
    await page.locator('#nutrition-form button[type=submit]').click();
    assert.equal(await page.locator('.nw-parameters').evaluate(n=>n.open),false);
    assert.ok(await page.locator('#nutrition-result .auto-meal-card').count());
    await page.locator('#nutrition-result [data-mode="manual"]').click();
    await page.locator('#nutrition-food-search').fill('Груша');
    const pear = page.locator('.nutrition-product-checkbox');
    assert.equal(await pear.count(),1);
    assert.equal(await pear.getAttribute('data-group'),'carb');
    await pear.check();
    const pearId = await pear.getAttribute('data-id');
    await page.locator('[data-action="toggle-food-favorite"]').click();
    assert.deepEqual(await page.evaluate(()=>window.VitalRiseSystem.nutritionCustom.getFavorites()),[pearId]);
    await page.locator('#nutrition-food-search').fill('');
    await page.locator('[data-action="build-manual"]').click();
    assert.equal(await page.locator('#nutrition-result .nutrition-portion-input').count(),0);
    const add = category => page.locator('#nutrition-result .meal-choice-select[data-meal="breakfast"][data-category="'+category+'"]');
    await add('protein').selectOption('chicken');
    await add('protein').selectOption('turkey');
    await add('carb').selectOption('rice');
    await add('vegetable').selectOption('tomato');
    const portion = id => page.locator('#nutrition-result .nutrition-portion-input[data-meal="breakfast"][data-id="'+id+'"]');
    for (const [id,value] of Object.entries({chicken:'100',turkey:'30',rice:'150',tomato:'100'})) {await portion(id).fill(value); await portion(id).press('Tab');}
    assert.equal(await portion('rice').inputValue(),'150');
    assert.equal(await page.locator('#nutrition-result .nutrition-portion-input[data-category="protein"]').count(),2);
    await page.locator('#nutrition-result [data-nutrition-disclosure="summary"] > summary').click();
    assert.match(await page.locator('#nutrition-result [data-nutrition-disclosure="summary"]').innerText(),/Рис.*150/);
    await page.locator('#nutrition-result [data-nutrition-disclosure="summary"] > summary').click();
    await page.locator('#nutrition-result [data-nutrition-disclosure="recipe-breakfast"] > summary').click();
    await page.locator('#nutrition-result .nw-recipe-name').fill('Рис із птицею');
    await page.locator('#nutrition-result .nw-recipe-yield').fill('380');
    await page.locator('#nutrition-result .nw-recipe-category').selectOption('carb');
    await portion('rice').fill('151'); await portion('rice').press('Tab');
    assert.equal(await page.locator('#nutrition-result .nw-recipe-name').inputValue(),'Рис із птицею');
    assert.equal(await page.locator('#nutrition-result .nw-recipe-category').inputValue(),'carb');
    await portion('rice').fill('150'); await portion('rice').press('Tab');
    await page.locator('[data-action="save-meal-recipe"]').click();
    assert.ok(await page.evaluate(()=>window.VitalRiseSystem.nutritionCustom.getProducts().some(p=>p.name==='Рис із птицею'&&p.recipe&&p.category==='carb')));
    const template = page.locator('#nutrition-result [data-nutrition-disclosure="menu-template"]');
    if (!(await template.evaluate(n=>n.open))) await template.locator('summary').first().click();
    await page.locator('#nutrition-menu-template-name').fill('Тестове меню');
    await page.locator('[data-action="save-nutrition-menu-template"]').click();
    await portion('rice').fill('90'); await portion('rice').press('Tab');
    await page.locator('#nutrition-menu-template-select').selectOption('Тестове меню');
    await page.locator('[data-action="load-nutrition-menu-template"]').click();
    assert.equal(await portion('rice').inputValue(),'150');
    await page.locator('#nutrition-result [data-nutrition-disclosure="shopping"] > summary').click();
    assert.match(await page.locator('.nw-shopping-list').innerText(),/Рис.*150/s);
    await page.locator('[data-print-target="nutrition-result"]').click();
    assert.equal(await page.locator('#mobile-report-phone .nutrition-portion-input').count(),0);
    assert.match(await page.locator('#mobile-report-phone').innerText(),/Рис.*150/s);
    await page.locator('#mobile-report-modal .mobile-report-icon-btn[data-report-close]').click();
    for (const lang of ['en','ru','uk']) {
      await page.locator('[data-lang-switch="'+lang+'"]').first().click();
      assert.equal(await page.locator('#nutrition-result .nw-menu-head h3').innerText(),{en:'Your menu',ru:'Твой рацион',uk:'Твій раціон'}[lang]);
    }
    await template.locator('summary').first().click();
    await page.locator('#nutrition-result [data-nutrition-disclosure="recipe-breakfast"] > summary').click();
    await page.locator('#nutrition-result [data-nutrition-disclosure="shopping"] > summary').click();
    await mkdir('.tmp/nutrition-update',{recursive:true});
    for (const width of [1440,390,320]) {
      await page.setViewportSize({width,height:width===1440?1000:844});
      const geometry = await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(geometry.scroll<=geometry.width,JSON.stringify(geometry));
      await page.locator('#nutrition-result .nw-day-summary').scrollIntoViewIfNeeded();
      if(width!==320 && process.env.NUTRITION_CAPTURE) await page.screenshot({path:'.tmp/nutrition-update/'+(width===1440?'desktop-final':'mobile-final')+'.png'});
      assert.equal(await portion('rice').inputValue(),'150');
      assert.ok(await portion('rice').isVisible());
    }
    assert.deepEqual(errors,[]);
    await page.locator('#nutrition-result [data-action="back-constructor"]').click();
    await page.locator('#nutrition-result [data-action="set-mode"][data-mode="auto"]').click();
    assert.ok(await page.locator('#nutrition-result .auto-meal-card').count());
    assert.equal(await page.locator('#nutrition-result .nw-day-summary').count(),1);
    await page.reload({waitUntil:'networkidle'});
    assert.deepEqual(await page.evaluate(()=>window.VitalRiseSystem.nutritionCustom.getFavorites()),[pearId]);
    await page.goto(preview.url+'/nutrition.html?access=admin',{waitUntil:'networkidle'});
    await page.locator('#nutrition-form').evaluate(form=>{
      form.closest('details').open=true;
      for (const [id,value] of Object.entries({age:'28',height:'178',weight:'80'})) form.querySelector('#'+id).value=value;
      form.querySelector('#weight-mode-toggle').checked=true;
      form.querySelector('#weight-mode-toggle').dispatchEvent(new Event('change',{bubbles:true}));
      form.requestSubmit();
    });
    await page.locator('#nutrition-result [data-mode="manual"]').click();
    await page.locator('#nutrition-result [data-action="build-manual"]').click({timeout:5000});
    await add('carb').selectOption('rice');
    assert.match(await page.locator('#nutrition-result .nw-meal-food-name').innerText(),/Сухий/i);
    assert.deepEqual(errors,[]);
    await context.close();
  } finally {await browser.close();preview.server.closeAllConnections();await new Promise(resolve=>preview.server.close(resolve));}
});

test('ready menu is primary; daily meal check survives editing exact generated portions, and changing a portion invalidates that check', async () => {
  const preview = await startPreview(0), browser = await launchBrowser();
  try {
    const context = await browser.newContext({viewport:{width:1440,height:1000}});
    await context.route('**/*', route=>new URL(route.request().url()).origin===preview.url ? route.continue() : route.abort());
    context.setDefaultTimeout(7000);
    const page = await context.newPage(), errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(preview.url+'/nutrition.html?access=admin',{waitUntil:'networkidle'});
    if(await page.locator('[data-marketing-consent="essential"]').count()) await page.locator('[data-marketing-consent="essential"]').click();
    for(const [id,value] of Object.entries({age:'28',height:'178',weight:'80'})) await page.locator('#'+id).fill(value);
    await page.locator('#nutrition-form button[type=submit]').click();
    assert.equal(await page.locator('#nutrition-result [data-mode="auto"]').getAttribute('class'),'mode-btn active');
    const check = page.locator('#nutrition-result [data-nutrition-eaten]').first();
    const mealKey = await check.getAttribute('data-nutrition-eaten');
    await check.check();
    assert.match(await page.locator('#nutrition-result .nw-adherence-summary').innerText(),/1 \/ 4/);
    if(process.env.NUTRITION_CAPTURE) {
      for(const width of [1440,390]) {
        await page.setViewportSize({width,height:width===1440?1000:844});
        await page.locator('#nutrition-result').scrollIntoViewIfNeeded();
        await page.screenshot({path:'.tmp/nutrition-update/ready-'+width+'.png'});
      }
    }
    await page.locator('#nutrition-result [data-action="use-generated-menu"]').click();
    assert.equal(await page.locator('#nutrition-result [data-nutrition-eaten="'+mealKey+'"]').isChecked(),true);
    const amount = page.locator('#nutrition-result .nutrition-portion-input[data-meal="'+mealKey+'"]').first();
    const initial = Number(await amount.inputValue());
    await amount.fill(String(initial+1)); await amount.press('Tab');
    assert.equal(await page.locator('#nutrition-result [data-nutrition-eaten="'+mealKey+'"]').isChecked(),false);
    assert.match(await page.locator('#nutrition-result .nw-adherence-summary').innerText(),/0 \/ 4/);
    assert.deepEqual(errors,[]);
    await context.close();
  } finally {await browser.close();preview.server.closeAllConnections();await new Promise(resolve=>preview.server.close(resolve));}
});
