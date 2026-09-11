import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Miniflare} from 'miniflare';

test('owner authentication and lifetime entitlement in Workers runtime', async()=>{
  const source=await readFile(new URL('../functions/_shared/access.js',import.meta.url),'utf8');
  const mf=new Miniflare({modules:true,script:source+'\nexport default {fetch(request,env){return handleAccessRequest({request,env});}}',compatibilityDate:'2026-07-07',kvNamespaces:['VITALRISE_ACCESS'],bindings:{FOUNDER_EMAIL:'owner@example.test',FOUNDER_ACCESS_SECRET:'test-only-secret-not-production'}});
  const call=(path,body,headers={})=>mf.dispatchFetch('https://vitalrise.com.ua/api/access/'+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://vitalrise.com.ua',...headers},body:typeof body==='string'?body:JSON.stringify(body)});
  try {
    const auth={'X-Founder-Secret':'test-only-secret-not-production'};
    assert.equal((await call('founder',{email:'owner@example.test'})).status,403);
    assert.equal((await call('founder',{email:'someone@example.test'},auth)).status,403);
    assert.equal((await call('founder',{email:'owner@example.test'},{...auth,Origin:'https://other.example'})).status,403);
    assert.equal((await call('founder','{bad',auth)).status,400);
    assert.equal((await call('founder',' '.repeat(2100),auth)).status,413);
    const response=await call('founder',{email:'OWNER@example.test'},auth);
    assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');
    const owner=await response.json();assert.equal(owner.tier,'admin');assert.equal(owner.permanent,true);assert.equal(owner.expiresAt,null);
    for(const route of ['verify','activate']) {
      const verified=await call(route,{token:owner.accessToken});
      assert.equal(verified.status,200);
      const data=await verified.json();assert.equal(data.tier,'admin');assert.equal(data.permanent,true);assert.equal(data.expiresAt,null);
    }
    const kv=await mf.getKVNamespace('VITALRISE_ACCESS');
    const {keys}=await kv.list();assert.equal(keys.length,1);
    const record=JSON.parse(await kv.get(keys[0].name));
    assert.equal(record.source,'founder_access');assert.equal(record.email,'owner@example.test');assert.ok(!JSON.stringify(record).includes(owner.accessToken));
    record.revokedAt=new Date().toISOString();await kv.put(keys[0].name,JSON.stringify(record));
    assert.equal((await call('verify',{token:owner.accessToken})).status,401);
    record.revokedAt=null;record.plan='premium';record.expiresAt='2020-01-01T00:00:00.000Z';
    await kv.put(keys[0].name,JSON.stringify(record));
    assert.equal((await call('verify',{token:owner.accessToken})).status,401,'Permanent flag must not bypass paid-plan expiration');
    const checkout=await call('checkout',{plan:'admin',email:'owner@example.test'});
    assert.equal(checkout.status,400);
    assert.equal((await call('verify',{token:'not-a-token'})).status,401);
  } finally {await mf.dispose();}
});
