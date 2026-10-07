import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('advertised prices, checkout prices and program terms agree; micronutrient review stays in Start', () => {
  const backend=readFileSync('functions/_shared/access.js','utf8');
  const plans=vm.runInNewContext(backend.slice(0,backend.indexOf('function json('))+'\nPLANS;',{});
  const frontend=readFileSync('assets/js/modules/access.js','utf8');
  const translations=readFileSync('assets/js/modules/i18n.js','utf8');
  const pricing=readFileSync('partials/index/pricing.html','utf8');
  for(const [tier,amount,label] of [['start',499,'499 грн'],['pro',1499,'1 499 грн'],['premium',3500,'3 500 грн']]) {
    assert.equal(plans[tier].price,amount);
    assert.equal(plans[tier].startWindowDays,45);
    assert.equal(plans[tier].activeDays,30);
    assert.ok(frontend.includes('price: "'+label+'"'));
    assert.ok(pricing.includes('data-i18n="pricing.'+tier+'Price">'+label));
    const values=[...translations.matchAll(new RegExp('"pricing\\.'+tier+'Price": "([^"]+)"','g'))].map(m=>m[1].replace(/[^\d]/g,''));
    assert.equal(values.length,3);
    assert.ok(values.every(v=>Number(v)===amount));
  }
  assert.match(pricing,/Перевірка вітамінів і мінералів \+ гідратація/);
  assert.match(readFileSync('partials/index/calculator.html','utf8'),/id="nutrition-panel" data-plan-required="start"/);
});
