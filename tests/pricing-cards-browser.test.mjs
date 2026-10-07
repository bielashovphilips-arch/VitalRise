import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {launchBrowser} from '../tools/browser.mjs';
import {startPreview} from '../tools/preview-growth.mjs';

test('tariff cards align, fit all languages and keep checkout accessible on both faces', async () => {
  const preview = await startPreview(0), browser = await launchBrowser();
  try {
    const context = await browser.newContext({reducedMotion:'reduce', serviceWorkers:'block'});
    context.setDefaultTimeout(7000);
    await context.route('**/*', route => new URL(route.request().url()).origin === preview.url && ['GET','HEAD'].includes(route.request().method()) ? route.continue() : route.abort());
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const language of ['uk','en','ru']) {
      for (const width of [1440,1024,390,320]) {
        await page.setViewportSize({width,height:1000});
        await page.goto(preview.url + '/?lang=' + language, {waitUntil:'networkidle'});
        const consent = page.locator('[data-marketing-consent="essential"]');
        if (await consent.count()) await consent.click();
        const grid = page.locator('#pricing .pricing-grid');
        await grid.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector('#pricing .pricing-grid').classList.contains('active'));
        assert.equal(await page.locator('html').getAttribute('lang'), language);
        const layout = await page.locator('#pricing .pricing-card').evaluateAll(cards => cards.map(card => {
          const front = card.querySelector('.pricing-card-front');
          const box = front.getBoundingClientRect();
          return {
            x:box.x,y:box.y,height:box.height,
            rows:Array.from(front.children).map(el => el.getBoundingClientRect().y),
            clipped:front.scrollHeight > front.clientHeight + 1 || front.scrollWidth > front.clientWidth + 1,
            backInert:card.querySelector('.pricing-card-back').inert
          };
        }));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, language + ' ' + width + ' page overflow');
        assert.ok(layout.every(card => !card.clipped && card.backInert), language + ' ' + width + ' clipped card or active hidden face');
        if (width > 640) {
          for (let i = 1; i < layout.length; i++) {
            if (Math.abs(layout[i].y - layout[i-1].y) > 1) continue;
            layout[i].rows.forEach((y,row) => assert.ok(Math.abs(y-layout[i-1].rows[row]) < 1, language + ' ' + width + ' row ' + row + ' alignment'));
          }
        }
        if (process.env.PRICING_CAPTURE && language === 'uk' && [1440,390].includes(width)) {
          await mkdir('.tmp/pricing-cards',{recursive:true});
          await grid.screenshot({path:'.tmp/pricing-cards/cards-' + width + '.png',style:'.site-header { opacity: 0 !important; }'});
          console.log(JSON.stringify({width,cards:layout}));
        }
        const card = page.locator('#pricing .pricing-card').nth(1);
        const front = card.locator('.pricing-card-front'), back = card.locator('.pricing-card-back');
        await front.locator('a').hover();
        assert.equal(await card.locator('.pricing-card-inner').evaluate(el => getComputedStyle(el).transform), 'none', 'CTA hover must keep the front visible');
        await front.locator('a').click();
        await page.locator('#payment-modal.open').waitFor();
        assert.match(await page.locator('#payment-title').innerText(), /Start/);
        assert.equal(await card.evaluate(el => el.classList.contains('is-flipped')), false);
        await page.locator('#payment-close-button').click();
        await card.focus();
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => document.querySelector('#pricing .pricing-card-accent .pricing-card-front').inert);
        assert.equal(await back.evaluate(el => el.inert), false);
        assert.equal(await back.evaluate(el => el.scrollHeight > el.clientHeight + 1), false, 'Back face should fit without clipping');
        await page.keyboard.press('Tab');
        assert.equal(await back.locator('a').evaluate(el => el === document.activeElement), true, 'Tab skips hidden front link');
        await page.keyboard.press('Enter');
        await page.locator('#payment-modal.open').waitFor();
        await page.locator('#payment-close-button').click();
        await card.focus();
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => document.querySelector('#pricing .pricing-card-accent .pricing-card-back').inert);
        await front.locator('h3').click();
        await page.waitForFunction(() => document.querySelector('#pricing .pricing-card-accent .pricing-card-front').inert);
        await card.focus();
        await page.keyboard.press('Space');
        await page.waitForFunction(() => document.querySelector('#pricing .pricing-card-accent .pricing-card-back').inert);
      }
    }
    assert.deepEqual(errors, []);
    await context.close();
  } finally {
    await browser.close();
    preview.server.closeAllConnections();
    await new Promise(resolve => preview.server.close(resolve));
  }
});
