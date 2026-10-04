import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import assert from 'node:assert/strict';
import {launchBrowser} from './browser.mjs';

const target=process.argv[2]||'.tmp/training-release-20260911';
let server,origin;
if(/^https:\/\//.test(target)) origin=target.replace(/\/$/,'');
else {
  const root=resolve(target);
  server=createServer(async(req,res)=>{
    try {
      const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(!['GET','HEAD'].includes(req.method)||pathname.startsWith('/api/')||pathname.split('/').some(x=>x.startsWith('.'))) {res.writeHead(403);res.end();return;}
      let file=resolve(root,'.'+pathname);
      if(!file.startsWith(root+sep)&&file!==root)throw Error('Invalid path');
      const info=await stat(file).catch(()=>null);
      if(info?.isDirectory())file=resolve(file,'index.html');
      else if(!info&&!extname(file))file+='.html';
      const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.webmanifest':'application/manifest+json'};
      const data=await readFile(file);
      res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
    }catch{res.writeHead(404);res.end();}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  origin='http://127.0.0.1:'+server.address().port;
}
const browser=await launchBrowser();
try {
  for(const width of [390,1440]) {
    const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});
    await context.route('**/*',route=>{
      const req=route.request(),url=new URL(req.url());
      // No production payments, sessions, analytics or other external writes during verification.
      return url.origin===origin&&req.method()==='GET'&&!url.pathname.startsWith('/api/')?route.continue():route.abort();
    });
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    for(const path of ['/','/nutrition.html','/training.html'])await page.goto(origin+path,{waitUntil:'networkidle'});
    const result=await page.evaluate(()=>{
      const mode=document.getElementById('training-program-mode');mode.value='ppl_3_1';mode.dispatchEvent(new Event('change',{bubbles:true}));
      const days=document.getElementById('training-days');days.value='4';
      const data={'training-place':'gym','training-level':'advanced','training-goal':'mass','training-days':days.value,'training-program-mode':mode.value,duration:'60','body-weight':'80','bench-1rm':'100','squat-1rm':'120','deadlift-1rm':'140'};
      const builder=window.VitalRiseSystem.trainingBuilder,plan=builder.buildTrainingPlan(data);builder.renderTrainingResult(plan);
      return {version:plan.prescriptionVersion,days:plan.weeks[0].days.length,disabled:days.disabled,first:plan.weeks[0].days[0].orderedExercises[0],renderedFirst:document.querySelector('#training-result .exercise-item strong')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.equal(result.version,1);assert.equal(result.days,4);assert.equal(result.disabled,false);
    assert.equal(result.first.phase,'preparation');assert.equal(result.first.sets,'2');assert.equal(result.first.targetRir,3);
    assert.equal(result.renderedFirst,result.first.name);assert.equal(result.overflow,false);
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({origin,width,verified:true,first:result.first.name,days:result.days,errors}));
    await context.close();
  }
}finally{await browser.close();if(server)await new Promise(done=>server.close(done));}
