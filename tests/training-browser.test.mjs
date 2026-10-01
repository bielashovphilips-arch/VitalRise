import {test} from 'node:test';
import assert from 'node:assert/strict';
import {launchBrowser} from '../tools/browser.mjs';
import {startPreview} from '../tools/preview-growth.mjs';

test('real page: PPL days selectable, new plan renders, journal logs clean reps without parsing RIR as kg', async () => {
  const preview = await startPreview(0), browser = await launchBrowser();
  try {
    const context = await browser.newContext({viewport:{width:390,height:844}});
    await context.route('**/*', route => new URL(route.request().url()).origin === preview.url ? route.continue() : route.abort());
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(preview.url + '/training.html?access=admin', {waitUntil:'networkidle'});
    const result = await page.evaluate(() => {
      const mode = document.getElementById('training-program-mode');
      mode.value = 'ppl_3_1'; mode.dispatchEvent(new Event('change', {bubbles:true}));
      const days = document.getElementById('training-days');
      days.value = '4';
      const data = {'training-place':'gym','training-level':'advanced','training-goal':'mass','training-days':days.value,'training-program-mode':mode.value,duration:'60','body-weight':'80','bench-1rm':'100','squat-1rm':'120','deadlift-1rm':'140'};
      const builder = window.VitalRiseSystem.trainingBuilder;
      const plan = builder.buildTrainingPlan(data);
      builder.renderTrainingResult(plan);
      window.VitalRiseSystem.trainingSession.startSession(0,0);
      return {disabled:days.disabled,days:plan.weeks[0].days.length,first:plan.weeks[0].days[0].orderedExercises[0].name};
    });
    assert.equal(result.disabled,false);
    assert.equal(result.days,4);
    assert.equal(await page.locator('[data-training-session-weight]').inputValue(),'');
    await page.locator('[data-training-session-weight]').fill('10');
    await page.locator('[data-training-session-reps]').fill('20');
    await page.locator('[data-training-session-rir]').fill('3');
    await page.locator('[data-training-session-log]').click();
    const active = await page.evaluate(() => JSON.parse(localStorage.getItem('vitalrise:training:active-session')));
    assert.equal(active.exercises[0].name,result.first);
    assert.equal(active.exercises[0].sets[0].techniqueClean,true);
    assert.equal(active.exercises[0].sets[0].rir,3);
    assert.ok(active.exercises[0].prescriptionKey);
    assert.equal(active.exercises[0].restSeconds,90);
    assert.deepEqual(errors,[]);
    await context.close();
  } finally {await browser.close();await new Promise(resolve => preview.server.close(resolve));}
});

test('outdoor workout: log bodyweight sets, resume after reload, save history and unlock adapted week', async () => {
  const preview = await startPreview(0);
  let browser;
  try {
    browser = await launchBrowser();
    const context = await browser.newContext({viewport:{width:390,height:844}});
    await context.route('**/*', route => new URL(route.request().url()).origin === preview.url ? route.continue() : route.abort());
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(preview.url + '/training.html?access=admin', {waitUntil:'networkidle'});
    await page.evaluate(() => {
      const builder = window.VitalRiseSystem.trainingBuilder;
      builder.renderTrainingResult(builder.buildTrainingPlan({'training-place':'outdoor','training-level':'intermediate','training-goal':'strength','training-days':'2','training-program-mode':'prison_workout',duration:'60','body-weight':'80'}));
    });
    assert.doesNotMatch(await page.locator('#training-result').innerText(), /Prison|драбин|сходин/i);
    for (let dayIndex = 0; dayIndex < 2; dayIndex++) {
      await page.locator(`[data-training-start-day="${dayIndex}"]`).click();
      const exercises = await page.evaluate(() => window.VitalRiseSystem.trainingSession.getState().exercises);
      for (let index=0; index<exercises.length; index++) {
        const ex=exercises[index], target=Number(ex.targetReps.match(/\d+/)[0]);
        for (let set=0; set<ex.targetSets; set++) {
          await page.locator('[data-training-session-reps]').fill(String(target));
          await page.locator('[data-training-session-rir]').fill('3');
          await page.locator('[data-training-session-log]').click();
          if (dayIndex===0 && index===0 && set===0) {
            await page.goto(preview.url + '/training.html?access=admin', {waitUntil:'networkidle'});
            const resumed=await page.evaluate(() => window.VitalRiseSystem.trainingSession.getState());
            assert.equal(resumed.exercises[0].sets.length,1);
            assert.equal(resumed.exercises[0].sets[0].weight,0);
          }
        }
        if (index<exercises.length-1) await page.locator('[data-training-session-next]').click();
      }
      await page.locator('[data-training-session-finish]').click();
    }
    const result=await page.evaluate(() => ({plan:window.VitalRiseTrainingPlan,history:JSON.parse(localStorage.getItem('vitalrise:training:sessions'))}));
    assert.equal(result.history.length,2);
    assert.ok(result.history.every(session => session.sets>0 && session.reps>0 && session.volume===0));
    assert.equal(result.plan.activeWeekIndex,1);
    const next=result.plan.weeks[1].days[0].orderedExercises[0];
    assert.equal(next.adaptation.mode,'progress');
    assert.ok(next.adaptation.repTarget);
    assert.equal(await page.locator('.training-history-session').count(),2);
    assert.deepEqual(errors,[]);
    await context.close();
  } finally {if (browser) await browser.close();await new Promise(resolve => preview.server.close(resolve));}
});

test('embedded calculator can open the session journal and timed exercises store seconds', async () => {
  const preview = await startPreview(0);
  let browser;
  try {
    browser=await launchBrowser();
    const page=await browser.newPage();
    await page.route('**/*', route => new URL(route.request().url()).origin === preview.url ? route.continue() : route.abort());
    await page.goto(preview.url+'/nutrition.html?access=admin',{waitUntil:'networkidle'});
    const result=await page.evaluate(() => {
      const s=window.VitalRiseSystem;
      const plan=s.trainingBuilder.buildTrainingPlan({'training-place':'outdoor','training-level':'intermediate','training-goal':'strength','training-days':'3',duration:'60','body-weight':'80'});
      plan.weeks[0].days[0]={title:'Timed exercise',basic:[{name:'Plank',sets:'1',reps:'30-60 сек'}],accessory:[]};
      s.trainingBuilder.renderTrainingResult(plan);
      document.querySelector('[data-training-start-day="0"]').click();
      const panel=document.querySelector('#training-session-panel');
      document.querySelector('[data-training-session-reps]').value='45';
      document.querySelector('[data-training-session-log]').click();
      const set=s.trainingSession.getState().exercises[0].sets[0];
      return {visible:!panel.hidden,set};
    });
    assert.equal(result.visible,true);
    assert.equal(result.set.seconds,45);
    assert.equal(result.set.reps,0);
  } finally {if(browser) await browser.close();await new Promise(resolve => preview.server.close(resolve));}
});
