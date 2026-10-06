import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

function setup(language = 'uk') {
  const storage = new Map();
  const context = vm.createContext({
    window: {VitalRiseSystem: {}, VitalRiseI18n: {getLanguage: () => language, translateText: value => value},
      localStorage: {getItem:key=>storage.get(key) || null,setItem:(key,value)=>storage.set(key,value)}},
    document: {addEventListener() {}, documentElement:{lang:language}},
  });
  for (const module of ['storage','nutrition-custom','nutrition-catalog','nutrition-quality-data','nutrition','nutrition-quality','nutrition-swaps','nutrition-render','nutrition-workspace']) {
    vm.runInContext(readFileSync('assets/js/modules/' + module + '.js','utf8'),context);
  }
  return context.window.VitalRiseSystem;
}
const targets = {calories:2500,protein:160,fat:70,carbs:307,weightMode:'ready',mealsCount:4,goal:'maintain',dietStyle:'standard',waterLiters:2.5,saltGrams:5};
const plain = value => JSON.parse(JSON.stringify(value));

test('quality keeps missing values unknown, scales eggs by edible weight, and uses raw data only for raw portions', () => {
  const {nutrition:n,nutritionQuality:q,nutritionQualityData:data,nutritionCustom:custom}=setup();
  const eggs=q.getValues(n.getFoodById('eggs'),3);
  assert.equal(eggs.sodiumMg,data.eggs.ready.per100.sodiumMg*1.5);
  const incomplete=q.summarize([{items:[{id:'eggs',amount:3},{id:'white_fish',amount:100}]}]);
  assert.equal(incomplete.sodiumMg.complete,false);
  assert.equal(incomplete.sodiumMg.knownTotal,eggs.sodiumMg);
  assert.deepEqual(plain(incomplete.sodiumMg.missingFoods.map(food=>food.id)),['white_fish']);
  const selections=n.buildEmptyMealSelections(targets);selections.lunch.carb={rice:75};
  n.buildSelectedDaySummary({...targets,weightMode:'raw'},selections,n.getDefaultSelection());
  assert.equal(q.getValues(n.getFoodById('rice'),75).fibreG,data.rice.raw.per100.fibreG*0.75);
  const product=custom.addProduct({name:'Quality label',p:10,f:5,c:15,kcal:145,fibreG:'',saturatedFatG:'0',sodiumMg:'100'});
  assert.equal(product.qualityPer100.fibreG,null);
  assert.equal(product.qualityPer100.saturatedFatG,0);
  assert.equal(q.getValues(product,200).sodiumMg,200);
  assert.equal(custom.addProduct({name:'Invalid quality',p:10,f:5,c:15,kcal:145,sodiumMg:-1}),null);
  assert.equal(custom.addProduct({name:'Invalid saturated fat',p:10,f:5,c:15,kcal:145,saturatedFatG:6}),null);
});

test('replacement previews respect selected foods, diets, meal occupancy, portion units and actual macro deltas', () => {
  const {nutrition:n,nutritionSwaps:swaps}=setup();
  const selected=n.getDefaultSelection();
  const options=swaps.getOptions('chicken',200,targets,'lunch',[{id:'chicken',amount:200},{id:'rice',amount:150}],selected);
  assert.ok(options.some(option=>option.food.id==='turkey'));
  for(const option of options) {
    assert.ok(selected.protein.includes(option.food.id));
    assert.equal(option.deltas.kcal,Math.round((n.getFoodMacros(option.food,option.amount).kcal-n.getFoodMacros(n.getFoodById('chicken'),200).kcal)*10)/10);
    assert.ok(Math.abs(option.deltas.kcal)<=option.before.kcal*0.2);
  }
  assert.equal(swaps.getOptions('chicken',200,{...targets,dietStyle:'vegan'},'lunch',[],{protein:['chicken','turkey']}).length,0);
  assert.equal(swaps.getOptions('chicken',200,targets,'lunch',[{id:'turkey',amount:100}],{protein:['chicken','turkey']}).length,0);
  assert.equal(swaps.getOptions('chicken',-1,targets,'lunch',[],selected).length,0);
});

test('quality references carry matching FDC records and recipe nutrients preserve incomplete coverage', () => {
  const {nutrition:n,nutritionQualityData:data,nutritionQuality:q,nutritionCustom:custom,nutritionRender:r}=setup();
  assert.equal(Object.keys(data).length,76);
  for(const item of Object.values(data))for(const reference of Object.values(item)) {
    assert.match(reference.sourceUrl,/^https:\/\/fdc\.nal\.usda\.gov\/food-details\/\d+\/nutrients$/);
    for(const key of q.keys)assert.ok(reference.per100[key]===null || Number.isFinite(reference.per100[key])&&reference.per100[key]>=0);
  }
  const selections=n.buildEmptyMealSelections(targets);selections.lunch.carb={rice:150};selections.lunch.protein={white_fish:100};
  const meal=n.buildSelectedDaySummary(targets,selections,n.getDefaultSelection()).meals.find(item=>item.mealKey==='lunch');
  const recipe=custom.addRecipe('Unknown recipe quality',250,'protein',meal);
  assert.equal(recipe.qualityPer100.sodiumMg,null);
  const markup=r.buildQualityMarkup(targets,{meals:[meal],totals:meal.totals});
  assert.match(markup,/data-quality-status="incomplete"/);
  assert.match(markup,/white_fish|Біла риба/);
});

test('adherence is per local day and exact meal: changed amounts, weight states and next day require a new check', () => {
  const {nutritionWorkspace:w}=setup();
  const meal={mealKey:'lunch',items:[{id:'rice',amount:150},{id:'chicken',amount:100}]};
  const today=new Date(2026,9,4,12), tomorrow=new Date(2026,9,5,12);
  assert.equal(w.dayKey(today),'2026-10-04');
  assert.equal(w.saveAdherence(meal,'ready',true,today),true);
  assert.equal(w.getAdherence(meal,'ready',today),true);
  assert.equal(w.getAdherence(meal,'raw',today),false);
  assert.equal(w.getAdherence(meal,'ready',tomorrow),false);
  assert.equal(w.getAdherence({...meal,items:[{id:'rice',amount:151},{id:'chicken',amount:100}]},'ready',today),false);
  assert.equal(w.saveAdherence(meal,'ready',false,today),true);
  assert.equal(w.getAdherence(meal,'ready',today),false);
});

test('standard ready menus provide at least 400 g produce without duplicate foods; incomplete or macro-mismatched menus are not labelled as target-ready', () => {
  const {nutrition:n,nutritionRender:r}=setup();
  for(const goal of ['cut','maintain','gain','recomp']) {
    const target=n.calculateNutrition({gender:'male',age:28,height:178,weight:80,activity:1.55,goal,'meals-count':4,'diet-style':'standard','weight-mode':'ready'});
    const plan=n.buildAutoMealPlan(target,n.getDefaultSelection());
    assert.ok(n.getProduceAmount(plan.meals)>=400,goal);
    for(const meal of plan.meals) assert.equal(new Set(meal.items.map(i=>i.id)).size,meal.items.length);
    assert.ok(Object.values(plan.totals).every(Number.isFinite));
  }
  const poor={meals:[{mealKey:'lunch',items:[{id:'rice',amount:150}]}],totals:{kcal:100,p:0,f:0,c:20}};
  assert.match(r.buildPlanReviewMarkup(targets,poor),/Потрібна корекція порцій/);
  assert.doesNotMatch(r.buildPlanReviewMarkup(targets,poor),/Відповідає розрахунковій цілі/);
});

test('empty manual menu is truly empty, with no automatic vegetables', () => {
  const {nutrition:n} = setup();
  const summary = n.buildSelectedDaySummary(targets,n.buildEmptyMealSelections(targets),n.getDefaultSelection());
  assert.equal(summary.meals.filter(meal=>meal.items.length).length,0);
  assert.deepEqual(plain(summary.totals),{kcal:0,p:0,f:0,c:0});
});

test('manual portions remain exact; multiple foods and manual vegetables survive summaries', () => {
  const {nutrition:n} = setup();
  const selections = n.buildEmptyMealSelections(targets);
  selections.lunch.carb = {rice:150,buckwheat:42.7};
  selections.lunch.protein = {chicken:70,turkey:30};
  selections.lunch.vegetable = {cucumber:43,tomato:81.5};
  const before = JSON.stringify(selections);
  const lunch = n.buildSelectedDaySummary(targets,selections,n.getDefaultSelection()).meals.find(meal=>meal.mealKey==='lunch');
  assert.equal(lunch.items.length,6);
  assert.equal(lunch.items.find(food=>food.id==='rice').amount,150);
  assert.equal(lunch.items.find(food=>food.id==='buckwheat').amount,42.7);
  assert.equal(lunch.items.find(food=>food.id==='tomato').amount,81.5);
  assert.equal(JSON.stringify(selections),before);
  assert.equal(n.normalizeManualPortion(n.getFoodById('rice'),-1),null);
  assert.equal(n.normalizeManualPortion(n.getFoodById('rice'),NaN),null);
  assert.equal(n.normalizeManualPortion(n.getFoodById('eggs'),2.7),3);
});

test('USDA additions have unique IDs, provenance, multilingual names and valid macronutrients', () => {
  const system = setup(), foods = system.nutrition.getFoods();
  assert.equal(foods.length,113);
  assert.equal(new Set(foods.map(food=>food.id)).size,113);
  assert.equal(system.nutritionCatalog.length,39);
  for (const food of system.nutritionCatalog) {
    assert.match(food.sourceUrl,/^https:\/\/fdc\.nal\.usda\.gov\/food-details\/\d+\/nutrients$/);
    assert.ok(food.names.en && food.names.ru && food.names.uk);
    for (const key of ['p','f','c','kcal']) assert.ok(Number.isFinite(food.macrosPer100[key]) && food.macrosPer100[key]>=0);
  }
  assert.equal(system.nutrition.isFoodAllowedForDiet(system.nutrition.getFoodById('milk_2'),'vegan'),false);
  assert.equal(system.nutrition.isFoodAllowedForDiet(system.nutrition.getFoodById('pear'),'keto'),false);
});

test('raw-weight nutrients and visible weight state agree, including unsupported alternatives', () => {
  const {nutrition:n,nutritionWorkspace:workspace} = setup();
  const selections = n.buildEmptyMealSelections(targets); selections.lunch.carb = {rice:75};
  n.buildSelectedDaySummary({...targets,weightMode:'raw'},selections,n.getDefaultSelection());
  const rice = n.getFoodById('rice');
  assert.equal(rice.weightState,'raw'); assert.equal(rice.macrosPer100.kcal,350);
  assert.equal(workspace.foodState(rice),'Сухий');
  const millet = n.getFoodById('millet'); assert.equal(millet.weightState,'cooked'); assert.match(millet.note,/Сирі/);
});

test('custom product export/import preserves nutrients and dietary metadata; invalid nutrients are rejected', () => {
  const system = setup(), custom = system.nutritionCustom;
  const product = custom.addProduct({name:'Мій йогурт',category:'protein',p:10,f:2,c:4,kcal:74,animal:true});
  const exported = plain(custom.getProducts()); custom.deleteProduct(product.id);
  assert.equal(custom.importProducts({products:exported}),1);
  assert.deepEqual(plain(custom.getProducts()[0].macrosPer100),{p:10,f:2,c:4,kcal:74});
  assert.equal(custom.getProducts()[0].animal,true);
  assert.equal(custom.addProduct({name:'Invalid',p:80,f:80,c:0,kcal:100}),null);
  assert.equal(custom.addProduct({name:'Invalid',p:-1,f:0,c:0,kcal:100}),null);
  custom.saveFavorites(['eggs','rice']); assert.deepEqual(plain(custom.getFavorites()),['eggs','rice']);
});

test('recipe macros are derived from the actual meal and cooked yield and can be reused', () => {
  const system = setup(), n = system.nutrition;
  const selections = n.buildEmptyMealSelections(targets); selections.lunch.protein = {chicken:150}; selections.lunch.carb = {rice:150};
  const meal = n.buildSelectedDaySummary(targets,selections,n.getDefaultSelection()).meals.find(meal=>meal.mealKey==='lunch');
  const recipe = system.nutritionCustom.addRecipe('Курка з рисом',300,'protein',meal);
  assert.ok(recipe); assert.equal(recipe.recipe.ingredients.length,2); assert.equal(recipe.animal,true);
  assert.equal(recipe.macrosPer100.kcal,meal.totals.kcal/3);
  assert.equal(n.getFoodById(recipe.id).recipe.yieldGrams,300);
  assert.equal(system.nutritionCustom.addRecipe('Invalid',1,'protein',meal),null);
  system.nutritionCustom.saveMenuTemplate('Raw menu',{selected:n.getDefaultSelection(),mealSelections:{stable:selections},activeDayView:'stable',weightMode:'raw'});
  assert.equal(system.nutritionCustom.getMenuTemplates()[0].weightMode,'raw');
});

test('all selected vegetable foods are available for breakfast; zero-carb targets still allow adding food', () => {
  const {nutrition:n} = setup();
  assert.ok(n.getBuilderRowsForMeal('vegetable','breakfast',100,n.getDefaultSelection(),'maintain','standard').some(row=>row.id==='cucumber'));
  assert.ok(n.getBuilderRowsForMeal('carb','breakfast',0,n.getDefaultSelection(),'maintain','standard').some(row=>row.id==='rice'));
});

test('rendered menu has editable exact portions, one main summary, escaped names and localized core controls', () => {
  for (const language of ['uk','en','ru']) {
    const {nutrition:n,nutritionRender:r} = setup(language);
    const section = r.buildChoiceSectionMarkup('Protein','protein',[{id:'eggs',name:'Яйця',amount:3}], 'breakfast','stable',{eggs:2});
    assert.match(section,/class="nutrition-portion-input"/); assert.match(section,/value="2"/);
    assert.match(section,/data-action="remove-meal-food"/);
    assert.doesNotMatch(section,/Один вибір/);
    const product = r.buildProductsListMarkup('protein',[{...n.getFoodById('eggs'),name:'<img src=x onerror=alert(1)>'}],['eggs'],['eggs']);
    assert.doesNotMatch(product,/<img/); assert.match(product,/&lt;img/);
    const summary = r.buildMacroTrackerMarkup(targets,{kcal:100,p:20,f:5,c:12},{formatKcal:n=>n+' kcal',formatGrams:n=>n+' g'});
    assert.equal((summary.match(/<progress /g)||[]).length,4);
    assert.match(summary,/aria-live="polite"/);
    assert.match(summary, new RegExp({uk:'Заплановано / ціль',en:'Planned / target',ru:'Запланировано / цель'}[language]));
  }
});
