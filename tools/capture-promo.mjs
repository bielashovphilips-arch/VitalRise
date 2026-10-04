import {mkdir,copyFile,writeFile} from 'node:fs/promises';
import {launchBrowser} from './browser.mjs';
import {startPreview} from './preview-growth.mjs';

const target='video/vitalrise-demo/public';
await mkdir(target,{recursive:true});
for (const file of ['athlete-mobile.jpg','athlete-optimized.jpg','logo-icon.svg']) await copyFile('assets/images/'+file,target+'/'+file);
const {server,url}=await startPreview(0),browser=await launchBrowser();
try {
  const context=await browser.newContext({viewport:{width:430,height:932},deviceScaleFactor:2});
  await context.addInitScript(()=>localStorage.setItem('vitalrise-marketing-consent','essential'));
  await context.route('**/*',route=>{
    const request=new URL(route.request().url());
    // Only public pages and font files. No analytics or production API writes.
    if(request.origin===url||['fonts.googleapis.com','fonts.gstatic.com'].includes(request.hostname)) return route.continue();
    return route.abort();
  });
  const page=await context.newPage();
  await page.goto(url,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const snap=async(selector,name)=>{
    const node=page.locator(selector);
    await node.scrollIntoViewIfNeeded();
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await node.screenshot({path:target+'/'+name+'.png',animations:'disabled'});
  };
  await snap('.hero','hero');
  await snap('.module-grid','modules');
  await snap('.pricing-card:nth-child(2) .pricing-card-front','start-plan');
  await snap('#free-calculator-form','calculator-empty');
  const form=page.locator('#free-calculator-form');
  await form.locator('[name=sex]').selectOption('male');
  await form.locator('[name=age]').fill('30');
  await form.locator('[name=weight]').fill('80');
  await form.locator('[name=height]').fill('180');
  await form.locator('[name=activity]').selectOption('1.2');
  await form.locator('[name=goal]').selectOption('1');
  await page.evaluate(()=>document.activeElement?.blur());
  await snap('#free-calculator-form','calculator-filled');
  await form.locator('button').click();
  await snap('#free-calculator-result','calculator-result');
  // Open the real checkout UI without entering an email or creating an order.
  await page.locator('#free-calculator-result [data-select-plan]').click();
  await page.locator('.payment-modal.open').waitFor();
  await snap('.payment-dialog','start-checkout');
  const manifest={capturedAt:new Date().toISOString(),source:'local VitalRise, existing design',sample:{sex:'male',age:30,weight:80,height:180,activity:1.2,goal:1,calories:2140},notice:'Fictional demonstration inputs, not client data. No order or lead created.'};
  await writeFile(target+'/capture-manifest.json',JSON.stringify(manifest,null,2));
  await context.close();
  process.stdout.write('Captured six real UI screens; no site design changes or external submissions.\n');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
