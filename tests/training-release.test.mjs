import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';

function setup() {
  const callbacks = [];
  const context = vm.createContext({window:{},document:{getElementById:()=>null,addEventListener:(name,fn)=>{if(name==='DOMContentLoaded')callbacks.push(fn);}},console});
  for(const name of ['training','training-prescription','training-templates','training-gym-dips-patch','training-guidance','training-progression','training-render','training-builder']) {
    vm.runInContext(readFileSync(`assets/js/modules/${name}.js`,'utf8'),context,{filename:name});
  }
  callbacks.forEach(fn=>fn());
  return context.window.VitalRiseSystem;
}
const input = overrides=>({'training-place':'gym','training-level':'intermediate','training-goal':'mass','training-days':'3',duration:'60','body-weight':'80','bench-1rm':'100','squat-1rm':'120','deadlift-1rm':'140',...overrides});

test('existing isolation is moved before main work without duplicates; strength stays first',()=>{
  const p=setup().trainingPrescription;
  const day={basic:[{name:'Жим лежачи',sets:'3',reps:'8-12',weightText:'70 кг'}],accessory:[{name:'Розгинання рук на блоці',sets:'3',reps:'10-15'}]};
  const config={goal:'mass',level:'intermediate',duration:60,days:3};
  const before=JSON.stringify(day),next=p.prepareDay(day,config);
  assert.equal(JSON.stringify(day),before);
  assert.equal(next.orderedExercises[0].phase,'preparation');
  assert.equal(next.orderedExercises[0].sets,'2');
  assert.equal(next.orderedExercises[0].targetRir,3);
  assert.equal(next.orderedExercises.length,2);
  assert.equal(p.prepareDay(day,{...config,goal:'strength'}).orderedExercises[0].name,'Жим лежачи');
});

test('matrix: exact selected session counts and synchronized progression/order',()=>{
  const s=setup();
  for(const place of ['gym','home','outdoor'])for(const level of ['beginner','intermediate','advanced'])for(const goal of ['mass','strength','support'])for(const days of [2,3,4,5,6]) {
    const plan=s.trainingBuilder.buildTrainingPlan(input({'training-place':place,'training-level':level,'training-goal':goal,'training-days':String(days)}));
    assert.equal(plan.prescriptionVersion,1);
    for(const week of plan.weeks) {
      assert.equal(week.days.filter(day=>!day.restDay).length,days,`${place}/${level}/${goal}/${days}`);
      for(const day of week.days)for(const ex of day.orderedExercises||[]) {
        const actual=day[ex.sourceGroup].find(item=>item.sourceIndex===ex.sourceIndex);
        assert.equal(ex.sets,actual.sets);
        assert.equal(ex.weightText,actual.weightText);
      }
    }
  }
});

test('short sessions reduce volume, never rest, and PPL spans weeks',()=>{
  const s=setup();
  for(const place of ['gym','home','outdoor'])for(const goal of ['mass','strength','support'])for(const duration of [30,45,60]) {
    const plan=s.trainingBuilder.buildTrainingPlan(input({'training-place':place,'training-goal':goal,duration:String(duration)}));
    for(const day of plan.weeks[0].days)if(day.estimatedMinutes) {
      assert.ok(day.estimatedMinutes<=duration,`${place}/${goal}/${duration}: ${day.estimatedMinutes}`);
      assert.ok(day.orderedExercises.every(ex=>!ex.shortLoadFactor));
    }
  }
  const plan=s.trainingBuilder.buildTrainingPlan(input({'training-level':'advanced','training-days':'4'}));
  assert.equal(plan.weeks[0].days.length,4);
  const titles=plan.weeks.slice(0,3).flatMap(week=>week.days.map(day=>day.title.replace(/^Заняття \d+/,'')));
  assert.equal(new Set(titles).size,6);
});

test('calendar never adds kilograms; renders actual reduced deload sets',()=>{
  const s=setup();
  const plan=s.trainingBuilder.buildTrainingPlan(input({'training-goal':'strength'}));
  const weights=plan.weeks.map(week=>week.days[0].basic[0].weightText);
  assert.ok(weights.every(weight=>weight===weights[0]));
  const last=plan.weeks.at(-1).days[0];
  assert.equal(last.orderedExercises[0].sets,last.basic[0].sets);
  assert.equal(last.basic[0].deload,true);
  assert.match(plan.guidance.progressionRules[0],/всіх підходах.*RIR.*технікою.*без болю/);
});

test('production design outside approved logo, nutrition, analytics and training render remain unchanged',()=>{
  // Logo and owner authentication were separately approved on 2026-09-11.
  const paths=['assets/css/style.css','assets/js/modules/nutrition.js','assets/js/modules/nutrition-render.js','assets/js/modules/marketing.js','assets/js/modules/training-render.js','assets/js/modules/hero-parallax.js','assets/js/modules/pricing-flip.js','wrangler.toml'];
  for(const path of paths) {
    const before=execFileSync('git',['show','9b88909:'+path],{encoding:'utf8'}).replace(/\r\n/g,'\n');
    assert.equal(readFileSync(path,'utf8').replace(/\r\n/g,'\n'),before,path);
  }
});
