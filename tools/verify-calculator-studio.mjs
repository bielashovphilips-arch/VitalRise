import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {launchBrowser} from './browser.mjs';
import {startPreview} from './preview-growth.mjs';
const preview = await startPreview(0);
const browser = await launchBrowser();
const dir = '.impeccable/review';
await mkdir(dir,{recursive:true});
const failures=[];
const luminance = hex => {
  const channels=hex.match(/.{2}/g).map(value=>parseInt(value,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);
  return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
};
try {
  for (const width of [390,1440,320,768]) for (const kind of ['training','nutrition','lab']) {
    const context = await browser.newContext({viewport:{width,height:width===1440?1000:844},serviceWorkers:'block'});
    await context.route('**/*',route => new URL(route.request().url()).origin === preview.url ? route.continue() : route.abort());
    const page = await context.newPage(), errors=[];
    page.on('pageerror',error => errors.push(error.message));
    await page.goto(preview.url+'/'+(kind==='lab'?'labs':kind)+'?access=admin',{waitUntil:'networkidle'});
    await page.locator('.studio-ready').waitFor();
    await page.locator('[data-marketing-consent=essential]').click();
    const form = page.locator('#'+kind+'-form');
    const data = kind==='training'?{'body-weight':'92',duration:'90'}:kind==='nutrition'?{age:'30',height:'180',weight:'80'}:{'lab-age':'35'};
    for (const [id,value] of Object.entries(data)) await page.locator('#'+id).fill(value);
    if(kind==='training') {
      await page.locator('#training-level').selectOption('advanced');
      await page.locator('#training-goal').selectOption('fatloss');
      await page.locator('[data-value="home"]').click();
      assert.equal(await page.locator('#training-place').inputValue(),'home');
      await page.locator('[data-value="gym"]').click();
      await page.locator('[data-value="4"]').click();
      assert.equal(await page.locator('#training-days').inputValue(),'4');
      await page.locator('[data-value="3"]').click();
    }
    await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
    if([390,1440].includes(width)) await page.screenshot({path:dir+'/'+kind+'-'+width+'.png',fullPage:false});
    const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,button:(()=>{const r=document.querySelector('.studio-actions').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};})(),summary:getComputedStyle(document.querySelector('.studio-sidebar')).position,inputs:[...document.querySelectorAll('.studio-form input:not(.studio-native-select),.studio-form select:not(.studio-native-select)')].filter(x=>x.getBoundingClientRect().height).map(x=>({id:x.id,h:x.getBoundingClientRect().height,font:getComputedStyle(x).fontSize}))}));
    if(metrics.overflow) failures.push(kind+'/'+width+': overflow');
    if(width<1024 && metrics.button.y+metrics.button.h>845) failures.push(kind+'/'+width+': dock outside viewport');
    if(metrics.inputs.some(x=>x.h<44 || parseFloat(x.font)<16)) failures.push(kind+'/'+width+': input sizing');
    const border=await page.locator('body').evaluate(el=>getComputedStyle(el).getPropertyValue('--studio-control-line').trim().slice(1));
    for(const surface of ['1c1d1d','222b33','34414b','393c3f']) assert.ok((luminance(border)+.05)/(luminance(surface)+.05)>=3,'Control boundary contrast');
    {
      const photo=kind==='lab'?'labs-bloodwork-bg.webp':kind==='training'?'training-gym-vitalrise.webp':'nutrition-food-bg.webp';
      const background=await page.locator('main').evaluate(el=>getComputedStyle(el).backgroundImage);
      assert.ok(background.includes(photo),'Original route photograph remains the background');
      assert.equal(await page.locator(kind==='lab'?'#labs':'#calculator').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)','Opaque section must not hide photograph');
      assert.equal(await page.evaluate(src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=src;}),'/assets/images/'+photo),true,'Original background loads');
      assert.ok((luminance('b7c3cf')+.05)/(luminance('393c3f')+.05)>=4.5,'Secondary text on brightest possible photograph');
    }
    const valuesBefore = await form.evaluate(el=>Object.fromEntries(new FormData(el)));
    await page.locator('.studio-actions [type=submit]').click();
    assert.equal(await page.locator('#'+kind+'-result .result-placeholder').count(),0,kind+' calculation should render');
    assert.equal(await page.locator('.studio-edit').isVisible(),true);
    await page.locator('#'+kind+'-reset').click();
    assert.equal(await page.locator('#'+Object.keys(data)[0]).inputValue(),kind==='lab'?'30':'');
    assert.equal(await page.locator('#'+kind+'-result .result-placeholder').count(),1);
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({kind,width,metrics,formFields:Object.keys(valuesBefore).length,calculation:true,reset:true,errors}));
    await context.close();
  }
  // Fields/constraints and the immutable calculation/auth modules remain intact.
  for(const path of ['assets/js/modules/training-builder.js','assets/js/modules/training-prescription.js','assets/js/modules/nutrition.js','assets/js/modules/access.js','functions/_shared/access.js','assets/css/style.css','assets/images/logo-icon.svg','index.html','partials/index/calculator.html','partials/index/labs.html','assets/js/modules/lab-protocols.js']) {
    const expected=execFileSync('git',['show','e672e4a:'+path],{encoding:'utf8'}).replace(/\r\n/g,'\n');
    assert.equal((await readFile(path,'utf8')).replace(/\r\n/g,'\n'),expected,path);
  }
  for(const path of ['assets/images/labs-bloodwork-bg.webp','assets/images/nutrition-food-bg.webp']) assert.deepEqual(await readFile(path),execFileSync('git',['show','a302deb:'+path]),'Preserve original photograph bytes');
  assert.deepEqual(failures,[]);
} finally {await browser.close();await new Promise(done=>preview.server.close(done));}
