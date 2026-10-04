import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import assert from 'node:assert/strict';
import {Miniflare} from 'miniflare';
import {launchBrowser} from './browser.mjs';

const target=process.argv[2]||'.tmp/logo-owner-release-20260911';
const live=target.startsWith('https://');
const root=resolve(live ? '.tmp/logo-owner-release-20260911' : target);
let origin,server,mf;
const login=live?JSON.parse(await readFile('.vitalrise-access/founder-login-20260911.json','utf8')):{email:'owner@example.test',secret:'local-test-secret-only'};
if(live) {
  origin=target.replace(/\/$/,'');
  assert.equal(origin,'https://vitalrise.com.ua','Never send founder credentials to another origin');
} else {
  const source=await readFile(resolve(root,'functions/_shared/access.js'),'utf8');
  mf=new Miniflare({modules:true,script:source+'\nexport default {fetch(request,env){return handleAccessRequest({request,env});}}',compatibilityDate:'2026-07-07',kvNamespaces:['VITALRISE_ACCESS'],bindings:{FOUNDER_EMAIL:login.email,FOUNDER_ACCESS_SECRET:login.secret}});
  server=createServer(async(req,res)=>{
    try {
      const url=new URL(req.url,origin);
      if(url.pathname.startsWith('/api/')){
        const chunks=[];for await(const c of req)chunks.push(c);
        const result=await mf.dispatchFetch(url.href,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})});
        res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));return;
      }
      if(req.method!=='GET'||url.pathname.split('/').some(x=>x.startsWith('.')))throw Error('Blocked');
      let file=resolve(root,'.'+decodeURIComponent(url.pathname));
      if(file!==root&&!file.startsWith(root+sep))throw Error('Blocked');
      const info=await stat(file).catch(()=>null);
      if(info?.isDirectory())file=resolve(file,'index.html');else if(!info&&!extname(file))file+='.html';
      const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.webmanifest':'application/manifest+json'};
      const data=await readFile(file);
      res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
    }catch{res.writeHead(404);res.end();}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));origin='http://127.0.0.1:'+server.address().port;
}
await mkdir('.tmp/logo-review',{recursive:true});
const browser=await launchBrowser();
try {
  for(const width of [390,1440]) {
    const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});
    await context.route('**/*',route=>{
      const req=route.request(),url=new URL(req.url());
      const authPost=req.method()==='POST'&&['/api/access/founder','/api/access/verify'].includes(url.pathname);
      return url.origin===origin&&(req.method()==='GET'||authPost)?route.continue():route.abort();
    });
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/training',{waitUntil:'networkidle'});
    assert.equal(await page.evaluate(()=>VitalRiseSystem.access.getTier()),'free');
    assert.ok(await page.locator('.module-paywall').count()>0);
    await page.evaluate(()=>localStorage.setItem('vitalrise:access:tier:v2','admin'));
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.evaluate(()=>VitalRiseSystem.access.getTier()),'free','Stored role alone must not unlock admin');
    const forged=await page.evaluate(async()=>{
      try {await VitalRiseSystem.access.setAccessPayload({tier:'admin',accessToken:'not-a-valid-token'});} catch {}
      return VitalRiseSystem.access.getTier();
    });
    assert.equal(forged,'free','Public setter must verify tokens server-side');
    await page.goto(origin+'/founder-access',{waitUntil:'networkidle'});
    assert.equal(await page.evaluate(()=>typeof VitalRiseSystem.access.setAccessPayload),'function');
    await page.locator('#founder-email').fill(login.email);
    await page.locator('#founder-secret').fill(login.secret);
    await page.locator('button[type=submit]').click();
    await page.waitForURL(origin+'/',{timeout:20000});
    await page.waitForFunction(()=>window.VitalRiseSystem?.access?.getTier()==='admin');
    const routes=['/','/labs','/nutrition','/training','/supplements','/profile','/recovery','/progress','/blueprint'];
    for(const path of routes){
      await page.goto(origin+path,{waitUntil:'networkidle'});
      await page.waitForFunction(()=>window.VitalRiseSystem?.access?.getTier()==='admin');
      const state=await page.evaluate(()=>({tier:VitalRiseSystem.access.getTier(),premium:VitalRiseSystem.access.hasAccess('premium'),locked:document.querySelectorAll('.is-locked-module,.module-paywall').length,overflow:document.documentElement.scrollWidth>innerWidth,logo:document.querySelector('.brand-icon img')?.complete}));
      assert.equal(state.tier,'admin',path);assert.equal(state.premium,true,path);assert.equal(state.locked,0,path);assert.equal(state.logo,true,path);assert.equal(state.overflow,false,path);
    }
    await page.goto(origin+'/',{waitUntil:'networkidle'});
    const keyStored=await page.evaluate(secret=>Object.values(localStorage).some(v=>v.includes(secret)),login.secret);assert.equal(keyStored,false,'Founder secret must never persist in browser storage');
    const filename='.tmp/logo-review/'+(live?'live':'local')+'-header-'+width+'.png';
    await page.locator('.site-header').screenshot({path:filename});
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({origin,width,guestLocked:true,forgedAdminRejected:true,ownerAllModules:true,routes:routes.length,errors,screenshot:filename}));
    await context.close();
  }
} finally {
  await browser.close();if(server)await new Promise(done=>server.close(done));if(mf)await mf.dispose();
}
