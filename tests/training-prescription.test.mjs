import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

function setup() {
  const callbacks = [], storage = new Map();
  const context = vm.createContext({window: {localStorage: {
    getItem: key => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key)
  }}, document: {getElementById: () => null, addEventListener: (name, fn) => {if (name === 'DOMContentLoaded') callbacks.push(fn);}}, console});
  for (const name of ['training', 'training-prescription', 'training-templates', 'training-gym-dips-patch', 'training-guidance', 'training-progression', 'training-adaptation', 'training-render', 'training-builder']) {
    vm.runInContext(readFileSync(`assets/js/modules/${name}.js`, 'utf8'), context, {filename:name});
  }
  callbacks.forEach(fn => fn());
  return context.window.VitalRiseSystem;
}
const input = overrides => ({'training-place':'gym', 'training-level':'intermediate', 'training-goal':'mass', 'training-days':'3', duration:'60', 'body-weight':'80', 'bench-1rm':'100', 'squat-1rm':'120', 'deadlift-1rm':'140', ...overrides});
const context = {goal:'mass', level:'intermediate', duration:60, days:3};
const fixture = {basic:[{name:'Жим лежачи', sets:'3', reps:'8-12', weightText:'70 кг'}], accessory:[{name:'Розгинання рук на блоці', sets:'3', reps:'10-15', weightText:'20 кг'}, {name:'Жим гантелей під кутом', sets:'3', reps:'10-12'}]};

test('preparation is existing isolation, not a duplicate or a compound; strength stays first', () => {
  const p = setup().trainingPrescription;
  const original = JSON.stringify(fixture), day = p.prepareDay(fixture, context);
  assert.equal(JSON.stringify(fixture), original);
  assert.equal(day.orderedExercises[0].phase, 'preparation');
  assert.equal(day.orderedExercises[0].sets, '2');
  assert.equal(day.orderedExercises[0].reps, '12-20');
  assert.equal(day.orderedExercises[0].targetRir, 3);
  assert.equal(day.orderedExercises.filter(x => x.name === 'Розгинання рук на блоці').length, 1);
  assert.equal(day.orderedExercises.find(x => x.name.includes('під кутом')).restSeconds, 150);
  assert.equal(p.prepareDay(fixture, {...context, goal:'strength'}).orderedExercises[0].name, 'Жим лежачи');
});

test('short sessions reduce volume, preserve rests, and never invent a load from RIR', () => {
  const s = setup(), plan = s.trainingBuilder.buildTrainingPlan(input({duration:'30'}));
  for (const day of plan.weeks[0].days) {
    assert.ok(day.estimatedMinutes <= 30, `${day.title}: ${day.estimatedMinutes}`);
    assert.ok(day.basic.every(ex => ex.restSeconds >= 120));
    assert.ok(day.basic.concat(day.accessory).reduce((sum, ex) => sum + Number(ex.sets), 0) <= 10);
    assert.ok(day.orderedExercises.every(ex => !ex.shortLoadFactor));
  }
});

test('matrix: generated resistance plans have exact session counts and synchronized order in all weeks', () => {
  const s = setup();
  for (const place of ['gym','home','outdoor']) for (const goal of ['mass','strength','support']) for (const days of [2,3,4,5,6]) {
    const plan = s.trainingBuilder.buildTrainingPlan(input({'training-place':place,'training-goal':goal,'training-days':String(days),'training-level':'advanced'}));
    for (const week of plan.weeks) {
      assert.equal(week.days.filter(day => !day.restDay).length, days, `${place}/${goal}/${days}`);
      for (const day of week.days) {
        if (!day.orderedExercises) continue; // Preserve ladder/circuit protocols.
        for (const ex of day.orderedExercises) {
          const source = day[ex.sourceGroup].find(item => item.sourceIndex === ex.sourceIndex);
          assert.equal(ex.sets, source.sets);
          assert.equal(ex.weightText, source.weightText);
        }
      }
    }
  }
});

test('PPL rotates all six sessions across selected weekly days, not a hidden 8-day cycle', () => {
  const s = setup();
  const plan = s.trainingBuilder.buildTrainingPlan(input({'training-level':'advanced', 'training-days':'4'}));
  assert.equal(plan.weeks[0].days.length, 4);
  const names = plan.weeks.slice(0,3).flatMap(week => week.days.map(day => day.title.replace(/^Заняття \d+/, '')));
  assert.equal(new Set(names).size, 6);
  assert.doesNotMatch(plan.volumeNote, /масаж|найкращ/);
});

test('calendar does not increase weights; deload order matches actual reduced sets', () => {
  const s = setup();
  const day = s.trainingPrescription.prepareDay(fixture, {...context,goal:'strength'});
  const weights = [1,2,3,4,5,6].map(week => s.trainingProgression.applyWeekProgression([day], 'strength', {week,label:'test',baseKg:100,accessoryKg:100}, {bench:100})[0]);
  assert.ok(weights.every(day => day.basic[0].weightText === '70 кг'));
  assert.equal(weights[5].orderedExercises[0].sets, weights[5].basic[0].sets);
  assert.equal(weights[5].basic[0].deload, true);
});

test('progress requires all sets AND upper reps AND RIR AND clean technique; no blind +2.5kg', () => {
  const a = setup().trainingAdaptation;
  const ex = {name:'Жим лежачи',sets:'3',reps:'8-12',targetRir:2};
  const history = (reps=12,rir=2,techniqueClean=true,extra={}) => [{finishedAt:1,exercises:[{name:ex.name,sets:Array.from({length:3},()=>({weight:20,reps,rir,techniqueClean,...extra}))}]}];
  assert.equal(a.analyzeExercise(ex,history(6,3)).mode,'hold');
  assert.equal(a.analyzeExercise(ex,history(12,0)).mode,'hold');
  assert.equal(a.analyzeExercise(ex,history(12,null)).mode,'hold');
  assert.equal(a.analyzeExercise(ex,history(12,2,false)).mode,'hold');
  assert.equal(a.analyzeExercise(ex,history(12,2,true,{pain:true})).mode,'pain');
  assert.equal(a.analyzeExercise(ex,history()).mode,'progress');
  assert.equal(a.analyzeExercise(ex,history()).delta,0);
  assert.equal(a.analyzeExercise({...ex,deload:true},history()).mode,'hold');
  assert.equal(a.analyzeExercise({...ex,reps:'30-60 сек'},history(60)).mode,'hold');
  assert.equal(a.analyzeExercise({...ex,targetRir:3},history()).mode,'hold');
  assert.equal(a.analyzeExercise({...ex,prescriptionKey:'new-order'},history()).mode,'baseline');
  const incomplete = history(); incomplete[0].exercises[0].sets.pop();
  assert.equal(a.analyzeExercise(ex,incomplete).mode,'hold');
});

test('initial circuit week remains a circuit, subsequent weeks adopt the policy', () => {
  const plan = setup().trainingBuilder.buildTrainingPlan(input({'training-level':'beginner'}));
  assert.equal(plan.weeks.length,4);
  assert.ok(plan.weeks[0].days.every(day => !day.orderedExercises));
  assert.ok(plan.weeks[1].days.every(day => day.orderedExercises.length));
});

test('duration estimates are bounded across standard short-session variants', () => {
  const s = setup();
  for (const place of ['gym','home','outdoor']) for (const goal of ['mass','strength','support']) for (const duration of [30,45,60]) {
    const plan = s.trainingBuilder.buildTrainingPlan(input({'training-place':place,'training-goal':goal,duration:String(duration)}));
    for (const day of plan.weeks[0].days) {
      if (day.estimatedMinutes) assert.ok(day.estimatedMinutes <= duration, `${place}/${goal}/${duration}: ${day.title} = ${day.estimatedMinutes}`);
    }
  }
});

test('old completed sessions cannot unlock a newly generated plan', () => {
  const a = setup().trainingAdaptation;
  const plan = {planId:'new',weeks:[{days:[{basic:[]}]}]};
  const session = {planId:'old',weekIndex:0,dayIndex:0,sets:1,exercises:[{targetSets:1,sets:[{reps:12}]}]};
  assert.equal(a.isWeekComplete(plan,0,[session]),false);
  assert.equal(a.isWeekComplete(plan,0,[{...session,planId:'new'}]),true);
});

test('street strength uses individual exercises with numeric sets and trackable targets', () => {
  const s = setup();
  for (const mode of ['neutral', 'prison_workout']) for (const goal of ['strength', 'endurance', 'mass']) {
    const plan = s.trainingBuilder.buildTrainingPlan(input({'training-place':'outdoor','training-program-mode':mode,'training-goal':goal}));
    assert.doesNotMatch(s.trainingRender.renderTrainingResult(plan), /Prison|драбин|сходин/i);
    for (const week of plan.weeks) for (const day of week.days) {
      assert.ok(day.orderedExercises.length);
      for (const ex of day.orderedExercises) {
        assert.match(ex.sets, /^\d+$/);
        assert.ok(ex.prescriptionKey);
        assert.notEqual(ex.progressionType, 'prison');
        assert.doesNotMatch(ex.reps, /\.\.\.|\//);
      }
    }
  }
});

test('bodyweight progression uses completed clean sets and respects pain, RIR and target range', () => {
  const a = setup().trainingAdaptation;
  const ex = {name:'Віджимання',sets:'3',reps:'8-12',targetRir:2};
  const history = [{finishedAt:1,exercises:[{name:ex.name,targetSets:3,sets:Array.from({length:3},()=>({weight:0,reps:9,rir:2,techniqueClean:true}))}]}];
  assert.equal(a.analyzeExercise(ex,history).repTarget,10);
  assert.equal(a.adaptWeek({days:[{basic:[ex]}]},history).days[0].basic[0].reps,'10-12');
  history[0].exercises[0].sets.forEach(set => {set.reps=12;});
  assert.equal(a.analyzeExercise(ex,history).mode,'progress');
  assert.equal(a.analyzeExercise(ex,history).repTarget,null);
  history[0].exercises[0].sets[0].rir=null;
  assert.equal(a.analyzeExercise(ex,history).mode,'hold');
  history[0].exercises[0].sets[0].pain=true;
  assert.equal(a.analyzeExercise(ex,history).mode,'pain');
  history[0].exercises[0].sets[0].pain=false;
  history[0].exercises[0].sets.pop();
  assert.equal(a.analyzeExercise(ex,history).mode,'hold');
});

test('every program continues after the final week, and partial sessions never advance it', () => {
  for (const place of ['gym','home','outdoor']) for (const mode of ['neutral','prison_workout','tabata_circuit','ppl_3_1','female_balanced']) {
    const s=setup(), a=s.trainingAdaptation;
    const plan=s.trainingBuilder.buildTrainingPlan(input({'training-place':place,'training-program-mode':mode,'training-level':'advanced',gender:'female'}));
    const index=plan.weeks.length-1;
    a.setActiveWeekIndex(index);
    const history=plan.weeks[index].days.map((day,dayIndex)=>({
      planId:plan.planId,weekIndex:index,dayIndex,finishedAt:1,sets:100,
      exercises:(day.orderedExercises || day.basic.concat(day.accessory)).map(ex=>({
        name:ex.name,prescriptionKey:ex.prescriptionKey,targetSets:parseInt(ex.sets),
        sets:Array.from({length:parseInt(ex.sets)},()=>({weight:0,reps:8,rir:2,techniqueClean:true}))
      }))
    }));
    assert.equal(a.advanceIfComplete(plan,[]),null);
    assert.ok(a.advanceIfComplete(plan,history));
    assert.equal(plan.activeWeekIndex,index+1);
    assert.equal(plan.weeks.length,index+2);
    assert.ok(plan.weeks[index+1].adaptationApplied);
  }
});
