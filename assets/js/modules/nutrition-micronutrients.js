(function () {
  const system = window.VitalRiseSystem || {};
  const data = system.nutritionMicronutrientData;
  if (!data) return;
  const definitions = [
    ['vitaminA','µg RAE','A','A','A'], ['vitaminC','mg','C','C','C'], ['vitaminD','µg','D','D','D'],
    ['vitaminE','mg α-T','E','E','E'], ['vitaminK','µg','K (K1)','K (K1)','K (K1)'],
    ['b1','mg','B1 · тіамін','B1 · thiamin','B1 · тиамин'], ['b2','mg','B2 · рибофлавін','B2 · riboflavin','B2 · рибофлавин'],
    ['b3','mg NE','B3 · ніацин','B3 · niacin','B3 · ниацин'], ['b5','mg','B5 · пантотенова кислота','B5 · pantothenic acid','B5 · пантотеновая кислота'],
    ['b6','mg','B6','B6','B6'], ['b7','µg','B7 · біотин','B7 · biotin','B7 · биотин'], ['b9','µg DFE','B9 · фолати','B9 · folate','B9 · фолаты'], ['b12','µg','B12','B12','B12'],
    ['calcium','mg','Кальцій','Calcium','Кальций'], ['chloride','mg','Хлорид','Chloride','Хлорид'], ['chromium','µg','Хром','Chromium','Хром'],
    ['copper','µg','Мідь','Copper','Медь'], ['fluoride','mg','Фторид','Fluoride','Фторид'], ['iodine','µg','Йод','Iodine','Йод'],
    ['iron','mg','Залізо','Iron','Железо'], ['magnesium','mg','Магній','Magnesium','Магний'], ['manganese','mg','Марганець','Manganese','Марганец'],
    ['molybdenum','µg','Молібден','Molybdenum','Молибден'], ['phosphorus','mg','Фосфор','Phosphorus','Фосфор'], ['potassium','mg','Калій','Potassium','Калий'],
    ['selenium','µg','Селен','Selenium','Селен'], ['sodium','mg','Натрій','Sodium','Натрий'], ['zinc','mg','Цинк','Zinc','Цинк'],
    ['choline','mg','Холін','Choline','Холин']
  ].map(function (d,i) { return {key:d[0],unit:d[1],names:d.slice(2),group:i<13?'vitamins':i<28?'minerals':'other'}; });
  const keys = definitions.map(function (d) { return d.key; });
  const upperKeys = ['retinol','folicAcid','addedVitaminE','addedNiacin'];
  const restricted = {vitaminA:'retinol',b9:'folicAcid',vitaminE:'addedVitaminE',b3:'addedNiacin'};
  const copy = {
    title:['Вітаміни та мінерали','Vitamins and minerals','Витамины и минералы'],
    vitamins:['Вітаміни · 13','Vitamins · 13','Витамины · 13'], minerals:['Мінерали · 15','Minerals · 15','Минералы · 15'], other:['Інші необхідні речовини','Other essential nutrients','Другие необходимые вещества'],
    below:['Нижче орієнтира','Below reference','Ниже ориентира'], meets:['Досягнуто орієнтира','Reference reached','Ориентир достигнут'], incomplete:['Неповні дані','Incomplete data','Неполные данные'], unknown:['Немає даних','No data','Нет данных'], over:['Вище верхньої межі','Above upper limit','Выше верхнего предела'], profile:['Потрібні вік і стать','Age and sex required','Нужны возраст и пол'], reference:['Орієнтир','Reference','Ориентир'], upper:['Верхня межа · UL','Upper limit · UL','Верхний предел · UL'], source:['Джерела та методика','Sources and method','Источники и методика'], missing:['Не враховано повністю','Not fully accounted for','Учтено не полностью'], foods:['Продукти для перегляду раціону','Foods to consider for your menu','Продукты для пересмотра рациона'], optionsHint:['Це варіанти для заміни. Обери продукт і перерахуй раціон; не додавай ці порції поверх плану.','These are replacement ideas. Choose a food and recalculate; do not add these portions on top of the plan.','Это варианты для замены. Выбери продукт и пересчитай рацион; не добавляй эти порции поверх плана.'],
    basis:['Норми NASEM DRI для здорових людей за віком і статтю, поза вагітністю та лактацією. RDA — рекомендована кількість, AI — адекватне споживання. Менше AI не доводить недостатність. Один день раціону не визначає дефіцит в організмі.','NASEM DRI references for healthy people by age and sex, excluding pregnancy and lactation. RDA is a recommended allowance; AI is an adequate intake. Below AI does not establish inadequacy. One day of food does not diagnose a deficiency.','Нормы NASEM DRI для здоровых людей по возрасту и полу, вне беременности и лактации. RDA — рекомендуемое количество, AI — адекватное потребление. Меньше AI не доказывает недостаточность. Один день рациона не определяет дефицит в организме.'],
    known:['Знак ≥ показує лише відому частину. Невідоме значення не дорівнює нулю; відсоток — частка добового орієнтира, а не засвоєння.','≥ indicates the known portion only. Unknown is not zero; percentages compare with the daily reference, not absorption.','Знак ≥ показывает только известную часть. Неизвестное значение не равно нулю; процент — доля суточного ориентира, а не усвоение.'],
    limitations:['Дані довідкові: сорт, виробник, країна та приготування змінюють склад. K враховано за K1; інші форми можуть не входити. Біотин, йод, хром, молібден і хлорид мають прогалини. Воду, додану сіль і добавки враховано лише якщо внесені як продукти. Для сірки, кобальту та інших елементів без окремої DRI добову норму не вигадуємо.','Reference values vary with variety, manufacturer, country and preparation. K uses K1; other forms may be missing. Biotin, iodine, chromium, molybdenum and chloride have data gaps. Water, added salt and supplements count only when entered as foods. No separate daily target is invented for sulfur, cobalt or elements without a DRI.','Справочные данные зависят от сорта, производителя, страны и приготовления. K учитывается по K1; другие формы могут отсутствовать. Для биотина, йода, хрома, молибдена и хлорида есть пробелы. Вода, добавленная соль и добавки учитываются только если внесены как продукты. Для серы, кобальта и элементов без отдельной DRI суточную норму не придумываем.'],
    ulNote:['UL стосується ретинолу для A; фолієвої кислоти для B9; доданих форм для B3 та E. Межа магнію з добавок не застосовується до їжі. Відсутність UL не означає необмежену безпеку. Загальне надходження з добавками тут не перевірено.','UL uses retinol for A, folic acid for B9, and added forms for B3 and E. The supplement magnesium limit does not apply to food. No established UL does not mean unlimited safety. Total intake including supplements is not assessed here.','UL относится к ретинолу для A, фолиевой кислоте для B9, добавленным формам для B3 и E. Предел магния из добавок не применяется к пище. Отсутствие UL не означает неограниченную безопасность. Общее потребление с добавками здесь не проверено.'],
    foodMg:['Для магнію з їжі UL не встановлено','No food magnesium UL established','Для магния из пищи UL не установлен'], noUL:['UL не встановлено','No UL established','UL не установлен'], unassessed:['Даних для перевірки UL недостатньо','Insufficient data to assess UL','Недостаточно данных для проверки UL'],
    sodiumNote:['AI натрію не є ціллю додавання солі. Верхній орієнтир WHO показано у перевірці якості.','Sodium AI is not a target for adding salt. The WHO upper guideline appears in the quality check.','AI натрия не является целью добавления соли. Верхний ориентир WHO показан в проверке качества.'],
    input:['Вітаміни та мінерали з етикетки · необов’язково','Label vitamins and minerals · optional','Витамины и минералы с этикетки · необязательно'],
    recipeNote:['Мікронутрієнти готового домашнього рецепта невідомі без уточненого складу: втрати від нагрівання й зливання води не розраховуються.','Final homemade recipe micronutrients are unknown without verified composition: heating and discarded-liquid losses are not calculated.','Микронутриенты готового домашнего рецепта неизвестны без уточнённого состава: потери от нагревания и сливания воды не рассчитываются.'],
    inputHint:['На 100 г. Залиш невідоме порожнім. Для A потрібні мкг RAE, для B3 — мг NE, для B9 — мкг DFE; відсотки з упаковки без перерахунку не підходять.','Per 100 g. Leave unknown values blank. A requires µg RAE, B3 requires mg NE, and B9 requires µg DFE; label percentages need conversion first.','На 100 г. Оставь неизвестное пустым. Для A нужны мкг RAE, для B3 — мг NE, для B9 — мкг DFE; проценты с упаковки требуют пересчёта.'],
    retinol:['Ретинол · µg','Retinol · µg','Ретинол · µg'], folicAcid:['Фолієва кислота · µg','Folic acid · µg','Фолиевая кислота · µg'], addedVitaminE:['Доданий вітамін E · mg','Added vitamin E · mg','Добавленный витамин E · mg'], addedNiacin:['Доданий ніацин · mg','Added niacin · mg','Добавленный ниацин · mg']
  };
  function language() { return window.VitalRiseI18n ? window.VitalRiseI18n.getLanguage() : 'uk'; }
  function index(lang) { return {uk:0,en:1,ru:2}[lang || language()] || 0; }
  function t(key) { return copy[key][index()]; }
  function valid(v) { return typeof v === 'number' && Number.isFinite(v) && v >= 0; }
  function getReference(profile) {
    if (!profile || !['male','female'].includes(profile.sex) || !Number.isFinite(Number(profile.age))) return null;
    const age = Number(profile.age);
    if (profile.lifeStage && profile.lifeStage !== 'standard') return null;
    return data.profiles[profile.sex].find(function (p) { return age >= p.minAge && age <= p.maxAge; }) || null;
  }
  function getValues(food, amount) {
    const result = {values:{}, upper:{}, partialKeys:[], sources:[]};
    if (!food || !(amount > 0) || !Number.isFinite(amount)) return result;
    const mode = food.weightState === 'raw' ? 'raw' : 'ready';
    const reference = data.foods[food.id] && data.foods[food.id][mode];
    const quality = system.nutritionQualityData[food.id] && system.nutritionQualityData[food.id][mode];
    const own = food.unitType === 'piece' ? food.micronutrientsPerUnit : food.micronutrientsPer100;
    const upper = food.unitType === 'piece' ? food.micronutrientUpperPerUnit : food.micronutrientUpperPer100;
    const factor = own ? (food.unitType === 'piece' ? amount : amount/100) : food.unitType === 'piece' ? (quality && quality.unitGrams ? amount*quality.unitGrams/100 : NaN) : amount/100;
    keys.forEach(function (key) { const value = own ? own[key] : reference && reference.per100[key]; result.values[key] = valid(value) && Number.isFinite(factor) ? value*factor : null; });
    upperKeys.forEach(function (key) { const value = own ? upper && upper[key] : reference && reference.upperPer100[key]; result.upper[key] = valid(value) && Number.isFinite(factor) ? value*factor : null; });
    result.partialKeys = reference && !own ? reference.partialKeys : [];
    if (quality && !own) result.sources.push({url:quality.sourceUrl,description:quality.description});
    if (reference && !own) Object.keys(reference.extraSources).forEach(function (key) { result.sources.push({url:reference.extraSources[key].url,description:reference.extraSources[key].description,key:key,rangePer100:reference.extraSources[key].rangePer100}); });
    return result;
  }
  function summarize(meals, profile) {
    const reference = getReference(profile), rows = {}, upper = {}, sources = new Map(); let count = 0;
    keys.concat(upperKeys).forEach(function (key) { (keys.includes(key)?rows:upper)[key] = {knownTotal:0,knownCount:0,missingFoods:[],complete:false}; });
    (meals || []).forEach(function (meal) { (meal.items || []).forEach(function (item) {
      const amount = Number(item.amount); if (!(amount > 0) || !Number.isFinite(amount)) return; count++;
      const food = system.nutrition.getFoodById(item.id), values = getValues(food,amount);
      values.sources.forEach(function (s) { sources.set(item.id+'|'+s.url+'|'+(s.key||''),Object.assign({id:item.id,name:food.name},s)); });
      keys.concat(upperKeys).forEach(function (key) {
        const row = rows[key] || upper[key], v = (rows[key] ? values.values : values.upper)[key];
        if (valid(v)) { row.knownTotal += v; row.knownCount++; }
        if (!valid(v) || values.partialKeys.includes(key)) {
          if (!row.missingFoods.some(function (f) { return f.id === item.id; })) row.missingFoods.push({id:item.id,name:food?food.name:item.name});
        }
      });
    }); });
    keys.concat(upperKeys).forEach(function (key) { const row = rows[key] || upper[key]; row.complete = count > 0 && !row.missingFoods.length; });
    definitions.forEach(function (d) {
      const row = rows[d.key], ulKey = restricted[d.key] || d.key;
      row.reference = reference && reference.references[d.key];
      row.percent = row.reference ? row.knownTotal / row.reference.value * 100 : null;
      row.upperLimit = reference && reference.upper[ulKey];
      row.upperValue = restricted[d.key] ? upper[ulKey] : row;
      row.over = valid(row.upperLimit) && row.upperValue.knownCount > 0 && row.upperValue.knownTotal > row.upperLimit;
      row.status = row.over ? 'over' : !reference ? 'profile' : !row.knownCount ? 'unknown' : !row.complete ? 'incomplete' : d.key === 'sodium' ? 'reference' : row.knownTotal < row.reference.value ? 'below' : 'meets';
    });
    return {rows:rows,itemCount:count,reference:reference,profile:profile,sources:Array.from(sources.values())};
  }
  function getFoodIdeas(key, targets) {
    if (['sodium','chloride','fluoride'].includes(key)) return [];
    return system.nutrition.getFoods().filter(function (food) { return !!data.foods[food.id] && system.nutrition.isFoodAllowedForDiet(food,targets.dietStyle) && system.nutrition.isFoodAllowedForGoal(food,targets.goal); }).map(function (food) {
      const amount = food.unitType === 'piece' ? 1 : food.category==='fat' ? (food.id.includes('oil')?10:30) : /^milk_|^yogurt_|^greek_yogurt/.test(food.id) ? 200 : food.category==='protein' ? 150 : 100;
      const values = getValues(food,amount);
      return {food:food,amount:amount,value:values.values[key],kcal:system.nutrition.getFoodMacros(food,amount).kcal,complete:!values.partialKeys.includes(key)};
    }).filter(function (idea) { return idea.complete && valid(idea.value) && idea.value > 0; }).sort(function (a,b) { return b.value-a.value; }).slice(0,3);
  }
  function format(value) { return Number(value).toLocaleString(language(),{maximumFractionDigits:value>100?0:2}); }
  function unit(value) { return language()==='en' ? value : value.replace('µg','мкг').replace('mg','мг'); }
  function renderAudit(targets, plan) {
    const render = system.nutritionRender, escape = render.escapeHtml;
    const audit = summarize(plan.meals,targets.referenceProfile); if (!audit.itemCount) return '';
    const labelFood = function (f) { const food = system.nutrition.getFoodById(f.id); return system.nutritionWorkspace ? system.nutritionWorkspace.foodName(food||f) : f.name; };
    const counts = ['over','below','incomplete','unknown','meets','profile'].map(function (status) { return {status:status,count:keys.filter(function (key) { return audit.rows[key].status===status; }).length}; }).filter(function (v) { return v.count; });
    const summary = counts.map(function (v) { return '<span>'+t(v.status)+': '+v.count+'</span>'; }).join(' · ');
    const groups = ['vitamins','minerals','other'].map(function (group) {
      return '<h4 class="nw-micro-heading">'+t(group)+'</h4>'+definitions.filter(function (d) { return d.group===group; }).map(function (d) {
        const row = audit.rows[d.key];
        const amount = row.knownCount ? (row.complete?'':'≥ ')+format(row.knownTotal)+' '+unit(d.unit) : '—';
        const ref = row.reference ? format(row.reference.value)+' '+unit(d.unit)+' · '+row.reference.type : t('profile');
        const ulUnit = d.key==='b3'?'mg':d.key==='b9'||d.key==='vitaminA'?'µg':d.key==='vitaminE'?'mg':d.unit;
        const ul = valid(row.upperLimit) ? t('upper')+': '+format(row.upperLimit)+' '+unit(ulUnit)+(row.upperValue.complete?' · '+format(row.upperValue.knownTotal)+' '+unit(ulUnit):' · '+t('unassessed')) : t(d.key==='magnesium'?'foodMg':'noUL');
        const ideas = row.status==='below' ? getFoodIdeas(d.key,targets) : [];
        const missing = row.missingFoods.length ? '<p><span>'+t('missing')+'</span>: '+row.missingFoods.map(function (food) { return '<span>'+escape(labelFood(food))+'</span>'; }).join(', ')+'</p>' : '';
        return '<details class="nw-micro-row" data-micronutrient="'+d.key+'" data-micro-status="'+row.status+'"><summary><strong>'+escape(d.names[index()])+'</strong><span class="nw-micro-amount">'+amount+'</span><span class="nw-micro-status">'+t(row.status)+(row.knownCount&&row.percent!==null?' · '+(row.complete?'':'≥ ')+format(row.percent)+'%':'')+'</span></summary><div class="nw-micro-detail"><p>'+t('reference')+': '+ref+'</p><p>'+ul+'</p>'+missing+(d.key==='sodium'?'<p>'+t('sodiumNote')+'</p>':'')+(ideas.length?'<p>'+t('foods')+':</p><ul>'+ideas.map(function (idea) { return '<li><span>'+escape(labelFood(idea.food))+'</span> · <span>'+format(idea.amount)+' '+(idea.food.unitType==='piece'?(language()==='en'?'pcs':'шт'):(language()==='en'?'g':'г'))+'</span> → <span>'+format(idea.value)+' '+unit(d.unit)+'</span> · <span>'+format(idea.kcal)+' '+(language()==='en'?'kcal':'ккал')+'</span></li>'; }).join('')+'</ul><p>'+t('optionsHint')+'</p>':'')+'</div></details>';
      }).join('');
    }).join('');
    const sources = audit.sources.map(function (s) { return '<li><a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer">'+escape(labelFood(s))+'</a>: '+escape(s.description)+(s.rangePer100?' · I: '+format(s.rangePer100[0])+'–'+format(s.rangePer100[1])+' µg/100 g':'')+'</li>'; }).join('');
    const profile = audit.reference ? '<p class="nw-help">'+escape(String(targets.referenceProfile.age))+' · <span>'+escape(targets.referenceProfile.sex==='male'?['Чоловік','Male','Мужчина'][index()]:['Жінка','Female','Женщина'][index()])+'</span> · NASEM DRI</p>' : '<p class="nw-help">'+t('profile')+'</p>';
    const recipe = plan.meals.some(function (meal) { return meal.items.some(function (item) { const food = system.nutrition.getFoodById(item.id); return food && food.recipe; }); });
    return '<details class="nw-disclosure nw-micronutrients" data-nutrition-disclosure="micronutrients"><summary>'+t('title')+'</summary><div class="nw-disclosure-body"><p class="nw-micro-overview">'+summary+'</p>'+profile+'<p class="nw-help">'+t('known')+'</p>'+(recipe?'<p class="nw-help">'+t('recipeNote')+'</p>':'')+groups+'<details class="nw-disclosure" data-nutrition-disclosure="micronutrient-sources"><summary>'+t('source')+'</summary><div class="nw-disclosure-body"><p>'+t('basis')+' <a href="'+data.sourceUrl+'" target="_blank" rel="noopener noreferrer">NASEM DRI</a></p><p>'+t('ulNote')+'</p><p>'+t('limitations')+'</p><ul class="nw-quality-sources">'+sources+'</ul></div></details></div></details>';
  }
  function renderInputs() {
    const escape = system.nutritionRender.escapeHtml;
    return '<details class="nw-disclosure" data-nutrition-disclosure="custom-micronutrients"><summary>'+t('input')+'</summary><div class="nw-disclosure-body"><p class="nw-help">'+t('inputHint')+'</p><div class="nw-micro-inputs">'+definitions.map(function (d) { return '<label class="nw-field"><span>'+escape(d.names[index()])+' ('+unit(d.unit)+')</span><input type="number" name="micro-'+d.key+'" min="0" max="1000000" step="any" inputmode="decimal"></label>'; }).join('')+upperKeys.map(function (key) { return '<label class="nw-field"><span>'+t(key)+'</span><input type="number" name="micro-upper-'+key+'" min="0" max="1000000" step="any" inputmode="decimal"></label>'; }).join('')+'</div></div></details>';
  }
  function translate(value, lang) {
    const localUnits = function (text) { return text.replace(/(^|[\s\d(])(µg|мкг|mg|мг)(?=\s|$)/g,function (_,prefix,v) { const micro = v==='µg'||v==='мкг'; return prefix+(lang==='en'?(micro?'µg':'mg'):(micro?'мкг':'мг')); }); };
    const rows = Object.values(copy).concat(definitions.map(function (d) { return d.names; }), [['Чоловік','Male','Мужчина'],['Жінка','Female','Женщина']]);
    const exact = rows.find(function (r) { return r.includes(value); });
    if (exact) return exact[index(lang)];
    for (const row of rows) { const prefix = row.find(function (v) { return value.startsWith(v+':') || value.startsWith(v+' (') || value.startsWith(v+' · '); }); if (prefix) {
      let suffix = value.slice(prefix.length);
      rows.forEach(function (r) { r.forEach(function (v) { if (v.length > 5) suffix = suffix.replace(v,r[index(lang)]); }); });
      return localUnits(row[index(lang)]+suffix);
    } }
    const withUnits = localUnits(value);
    if (withUnits !== value) return withUnits;
    return null;
  }
  system.nutritionMicronutrients = {definitions:definitions,keys:keys,upperKeys:upperKeys,getValues:getValues,getReference:getReference,summarize:summarize,getFoodIdeas:getFoodIdeas,renderAudit:renderAudit,renderInputs:renderInputs,translate:translate};
  window.VitalRiseSystem = system;
})();
