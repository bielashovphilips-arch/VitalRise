(function () {
  const system = window.VitalRiseSystem || {};
  const nutrition = system.nutrition;
  const render = system.nutritionRender;
  if (!nutrition || !render) return;
  const escape = render.escapeHtml;
  const originals = Object.assign({}, render);
  const copy = {
    readyPlan: ['Готовий раціон', 'Ready menu', 'Готовый рацион'],
    chooseFoods: ['Обрати продукти', 'Choose foods', 'Выбрать продукты'],
    usePlan: ['Зберегти / редагувати цей раціон', 'Save / edit this menu', 'Сохранить / редактировать этот рацион'],
    discipline: ['Дотримання сьогодні', 'Today’s adherence', 'Соблюдение сегодня'],
    ate: ['З’їв вказані порції', 'Ate the listed portions', 'Съел указанные порции'],
    disciplineHint: ['Зважуй продукти у вказаному стані й дотримуйся порцій. Позначай прийом після їжі. Додаткові перекуси, напої та олію також враховуй у раціоні.', 'Weigh foods in the stated condition and follow the portions. Mark each meal after eating. Include extra snacks, drinks and cooking oil in the menu too.', 'Взвешивай продукты в указанном состоянии и соблюдай порции. Отмечай приём после еды. Дополнительные перекусы, напитки и масло тоже учитывай в рационе.'],
    matches: ['Відповідає розрахунковій цілі', 'Matches the calculated target', 'Соответствует расчётной цели'],
    needsReview: ['Потрібна корекція порцій', 'Portions need adjustment', 'Нужна коррекция порций'],
    produce: ['Овочі та фрукти', 'Vegetables and fruit', 'Овощи и фрукты'],
    goalCheck: ['Відповідність цілі', 'Target check', 'Соответствие цели'],
    reviewHint: ['Зіставлення калорій і БЖВ з розрахунком; повна оцінка вітамінів, клітковини та якості жирів потребує додаткових даних.', 'Compares calories and macros with the calculation; a full assessment of vitamins, fibre and fat quality needs more data.', 'Сопоставление калорий и БЖУ с расчётом; полная оценка витаминов, клетчатки и качества жиров требует дополнительных данных.'],
    category: ['Категорія', 'Category', 'Категория'],
    origin: ['Походження', 'Origin', 'Происхождение'],
    plant: ['Рослинний', 'Plant-based', 'Растительный'],
    animal: ['Тваринний / змішаний', 'Animal / mixed', 'Животный / смешанный'],
    customState: ['Стан продукту', 'Food state', 'Состояние продукта'],
    customPacked: ['Як на упаковці', 'As packaged', 'Как на упаковке'],
    customCooked: ['Готовий', 'Cooked', 'Готовый'],
    customFresh: ['Свіжий', 'Fresh', 'Свежий'],
    customProtein: ['Білки / 100 г', 'Protein / 100 g', 'Белки / 100 г'],
    customFat: ['Жири / 100 г', 'Fat / 100 g', 'Жиры / 100 г'],
    customCarbs: ['Вуглеводи / 100 г', 'Carbs / 100 g', 'Углеводы / 100 г'],
    customCalories: ['Калорії / 100 г', 'Calories / 100 g', 'Калории / 100 г'],
    rawUnavailable: ['Сирі / сухі значення не задано: використай вагу вказаного стану.', 'Raw / dry values are unavailable: use the weight in the stated food condition.', 'Сырые / сухие значения не заданы: используй вес указанного состояния.'],
    storageError: ['Не вдалося зберегти. Перевір доступ до сховища браузера та спробуй ще раз.', 'Could not save. Check browser storage access and try again.', 'Не удалось сохранить. Проверь доступ к хранилищу браузера и попробуй ещё раз.'],
    products: ['Продукти для раціону', 'Foods for your menu', 'Продукты для рациона'],
    search: ['Знайти продукт', 'Search foods', 'Найти продукт'],
    all: ['Усі', 'All', 'Все'], favorite: ['Обрані', 'Favorites', 'Избранные'], mine: ['Мої', 'My foods', 'Мои'],
    star: ['В обране', 'Add to favorites', 'В избранное'], unstar: ['Прибрати з обраного', 'Remove from favorites', 'Убрать из избранного'],
    available: ['Доступні для меню', 'Available for your menu', 'Доступны для меню'],
    selected: ['Вибрані продукти', 'Selected foods', 'Выбранные продукты'],
    empty: ['Продуктів не знайдено. Зміни пошук або фільтр.', 'No foods found. Change your search or filter.', 'Продукты не найдены. Измени поиск или фильтр.'],
    add: ['Додати продукт', 'Add food', 'Добавить продукт'], remove: ['Прибрати', 'Remove', 'Убрать'],
    amount: ['Порція', 'Amount', 'Порция'], decrease: ['Зменшити порцію', 'Decrease amount', 'Уменьшить порцию'], increase: ['Збільшити порцію', 'Increase amount', 'Увеличить порцию'],
    planned: ['Заплановано / ціль', 'Planned / target', 'Запланировано / цель'],
    guidance: ['Пояснення та рекомендації', 'Guidance and recommendations', 'Пояснения и рекомендации'],
    menu: ['Твій раціон', 'Your menu', 'Твой рацион'], ready: ['готовий', 'cooked', 'готовый'], raw: ['сирий / сухий', 'raw / dry', 'сырой / сухой'],
    foodState: ['стан продукту', 'food state', 'состояние продукта'],
    unchanged: ['альтернативний стан не задано', 'alternate state unavailable', 'альтернативное состояние не задано'],
    perPiece: ['{calories} ккал за 1 шт', '{calories} kcal per piece', '{calories} ккал за 1 шт'],
    template: ['Зберегти або завантажити меню', 'Save or load menu', 'Сохранить или загрузить меню'],
    edit: ['Змінити продукти', 'Edit foods', 'Изменить продукты'],
    start: ['Перейти до раціону', 'Build your menu', 'Перейти к рациону'],
    selectNote: ['Залиш продукти, які хочеш використовувати. У прийомі можна поєднувати кілька продуктів.', 'Choose foods you want to use. Each meal can contain several foods.', 'Оставь продукты, которые хочешь использовать. В приёме можно сочетать несколько продуктов.'],
    meals: ['Складено прийомів', 'Meals started', 'Составлено приёмов'],
    water: ['Вода', 'Water', 'Вода'], salt: ['Сіль', 'Salt', 'Соль'],
    emptyMeal: ['Додай перший продукт до цього прийому.', 'Add the first food to this meal.', 'Добавь первый продукт в этот приём.'],
    protein: ['М’ясо, риба та інші білкові', 'Meat, fish and other proteins', 'Мясо, рыба и другие белковые'],
    carb: ['Крупи, гарніри та фрукти', 'Grains, sides and fruit', 'Крупы, гарниры и фрукты'],
    extra_carb: ['Хліб та доповнення', 'Bread and extras', 'Хлеб и дополнения'],
    fat: ['Олії, горіхи та жири', 'Oils, nuts and fats', 'Масла, орехи и жиры'],
    vegetable: ['Овочі', 'Vegetables', 'Овощи'],
    calories: ['Калорії', 'Calories', 'Калории'], proteins: ['Білки', 'Protein', 'Белки'], fats: ['Жири', 'Fat', 'Жиры'], carbs: ['Вуглеводи', 'Carbs', 'Углеводы'],
    details: ['Деталі підсумку', 'Summary details', 'Детали итога'],
    source: ['Джерело', 'Source', 'Источник'],
    approximate: ['усереднені дані; для бренду додай свій продукт', 'generic values; add your own branded food', 'усреднённые данные; для бренда добавь свой продукт'],
    recipe: ['Зберегти як страву', 'Save as recipe', 'Сохранить как блюдо'],
    recipeName: ['Назва страви', 'Recipe name', 'Название блюда'],
    recipeYield: ['Вага всієї готової страви (г)', 'Total cooked recipe weight (g)', 'Вес всего готового блюда (г)'],
    recipeHint: ['Зваж готову страву. БЖВ на 100 г буде розраховано із цих продуктів і порцій.', 'Weigh the finished recipe. Values per 100 g use these ingredients and amounts.', 'Взвесь готовое блюдо. БЖУ на 100 г будет рассчитано из этих продуктов и порций.'],
    shopping: ['Список покупок на цей раціон', 'Shopping list for this menu', 'Список покупок для этого рациона'],
    shoppingHint: ['Кількості відповідають вазі в меню; готову вагу не переведено в сиру.', 'Amounts match the menu weights; cooked weights are not converted to raw.', 'Количество соответствует весу в меню; готовый вес не переведён в сырой.'],
    parameters: ['Параметри', 'Parameters', 'Параметры'],
    advanced: ['Додаткові налаштування', 'Advanced settings', 'Дополнительные настройки'],
    intro: ['Розрахуй ціль і склади зручний раціон зі своїх продуктів.', 'Calculate your target and build a practical menu with your foods.', 'Рассчитай цель и составь удобный рацион из своих продуктов.']
  };
  function language() { return window.VitalRiseI18n ? window.VitalRiseI18n.getLanguage() : 'uk'; }
  function t(key) { const value = copy[key]; return value ? value[{uk:0,en:1,ru:2}[language()] || 0] : key; }
  function name(food) {
    if (food.names && food.names[language()]) return food.names[language()];
    return window.VitalRiseI18n ? window.VitalRiseI18n.translateText(food.name) : food.name;
  }
  function translate(value) { return window.VitalRiseI18n ? window.VitalRiseI18n.translateText(value) : value; }
  function state(food) {
    if (food.weightModeLabel) return translate(food.weightModeLabel);
    if (food.weightState === 'cooked') return t('ready');
    if (food.weightState === 'raw') return t('raw');
    return '';
  }
  function hint(food) {
    const parts = [state(food)];
    if (food.unitType === 'piece' && food.macrosPerUnit) parts.push(t('perPiece').replace('{calories}', format(food.macrosPerUnit.kcal)));
    if (food.note) parts.push(translate(food.note));
    return parts.filter(Boolean).join(' · ');
  }
  function attrs(day, meal, category, id) {
    return ' data-day="' + escape(day) + '" data-meal="' + escape(meal) + '" data-category="' + escape(category) + '"' + (id ? ' data-id="' + escape(id) + '"' : '');
  }
  function disclosure(label, body, key) {
    return '<details class="nw-disclosure" data-nutrition-disclosure="' + key + '"><summary>' + label + '</summary><div class="nw-disclosure-body">' + body + '</div></details>';
  }
  function guidance(targets, body) {
    return disclosure(t('guidance'), '<p>' + escape(t('foodState')) + ': ' + escape(targets.weightMode === 'raw' ? t('raw') : t('ready')) + '. ' + escape(t('approximate')) + '.</p>' + body, 'guidance');
  }
  function format(n) { return Number(n || 0).toLocaleString(language(), {maximumFractionDigits:1}); }
  function dayKey(date) {
    const now = date || new Date();
    return now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
  }
  function mealSignature(meal, mode) {
    return JSON.stringify([mode || 'ready', (meal && meal.items || []).map(function (item) { return [item.id, Number(item.amount)]; }).sort(function (a,b) { return a[0].localeCompare(b[0]); })]);
  }
  function getAdherence(meal, mode, date) {
    const saved = system.storage.getJson('vitalrise:nutrition:adherence', {});
    return !!(meal && meal.items.length && saved.date === dayKey(date) && saved.meals && saved.meals[meal.mealKey] === mealSignature(meal,mode));
  }
  function saveAdherence(meal, mode, checked, date) {
    if (!meal || !meal.items.length) return false;
    const today = dayKey(date), previous = system.storage.getJson('vitalrise:nutrition:adherence', {});
    const saved = previous.date === today ? previous : {date:today, meals:{}};
    if (!saved.meals) saved.meals = {};
    if (checked) saved.meals[meal.mealKey] = mealSignature(meal,mode);
    else delete saved.meals[meal.mealKey];
    return system.storage.setJson('vitalrise:nutrition:adherence', saved);
  }
  render.buildAdherenceMealMarkup = function (meal, mode) {
    if (!meal || !meal.items.length) return '';
    return '<label class="nw-eaten"><input type="checkbox" data-nutrition-eaten="' + escape(meal.mealKey) + '"' + (getAdherence(meal,mode) ? ' checked' : '') + '><span>' + t('ate') + '</span><span class="visually-hidden">: ' + escape(translate(meal.mealName)) + '</span></label>';
  };
  render.buildAdherenceSummaryMarkup = function (meals, mode) {
    const done = meals.filter(function (meal) { return getAdherence(meal,mode); }).length;
    return '<div class="nw-adherence-summary" aria-live="polite"><strong>' + t('discipline') + ': ' + done + ' / ' + meals.length + '</strong><p class="nw-help">' + t('disciplineHint') + '</p></div>';
  };
  render.buildPlanReviewMarkup = function (targets, plan) {
    const totals = plan.totals || {};
    const checks = [{key:'kcal',target:'calories',label:'calories',tolerance:0.07},{key:'p',target:'protein',label:'proteins',tolerance:0.1},{key:'f',target:'fat',label:'fats',tolerance:0.1},{key:'c',target:'carbs',label:'carbs',tolerance:0.1}];
    const differences = checks.filter(function (item) { return Math.abs((totals[item.key] || 0) - targets[item.target]) > Math.max(item.key === 'kcal' ? 0 : 5, targets[item.target] * item.tolerance); });
    const complete = plan.meals.length === Number(targets.mealsCount) && plan.meals.every(function (meal) { return meal.items.length; });
    const produce = nutrition.getProduceAmount(plan.meals);
    return '<section class="nw-plan-review" aria-label="' + t('goalCheck') + '"><strong>' + t(complete && !differences.length && produce >= 400 ? 'matches' : 'needsReview') + '</strong>' + (differences.length ? '<p>' + differences.map(function (item) { return t(item.label); }).join(', ') + '</p>' : '') + '<p>' + t('produce') + ': ' + format(produce) + ' / 400 ' + (language()==='en' ? 'g' : 'г') + ' · <a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet" target="_blank" rel="noopener noreferrer">WHO</a></p>' + disclosure(t('goalCheck'), '<p class="nw-help">' + t('reviewHint') + '</p>', 'review') + '</section>';
  };
  render.buildNutritionConstructorMarkup = function (view) {
    return '<div class="nutrition-builder"><div class="mode-switch"><button type="button" class="mode-btn ' + (view.mode==='auto' ? 'active' : '') + '" data-action="set-mode" data-mode="auto">' + t('readyPlan') + '</button><button type="button" class="mode-btn ' + (view.mode==='manual' ? 'active' : '') + '" data-action="set-mode" data-mode="manual">' + t('chooseFoods') + '</button></div>' + (view.mode==='manual' ? view.manualMarkup : view.autoMarkup) + '</div>';
  };

  render.buildProductsListMarkup = function (category, products, selectedIds, favorites) {
    if (!products.length) return '<p class="nw-empty" role="status">' + t('empty') + '</p>';
    return '<div class="product-list nw-product-list">' + products.map(function (food) {
      const favorite = (favorites || []).includes(food.id);
      const checked = (selectedIds || []).includes(food.id);
      const macros = food.macrosPer100 || food.macrosPerUnit;
      const details = [state(food), food.unitType === 'piece' ? t('perPiece').replace('{calories}', format(macros.kcal)) : format(macros.kcal) + ' ' + (language() === 'en' ? 'kcal / 100 g' : 'ккал / 100 г'), food.note ? translate(food.note) : ''].filter(Boolean).join(' · ');
      return '<div class="nw-product-row"><label class="product-item' + (checked ? ' nw-selected' : '') + '">' +
        '<input type="checkbox" class="nutrition-product-checkbox" data-focus-key="product-' + escape(food.id) + '" data-group="' + food.category + '" data-id="' + escape(food.id) + '"' + (checked ? ' checked' : '') + '>' +
        '<span class="product-item-copy"><span class="product-item-name">' + escape(name(food)) + '</span><small>' + escape(details) + '</small></span></label>' +
        '<button type="button" class="nw-favorite" data-action="toggle-food-favorite" data-id="' + escape(food.id) + '" data-focus-key="favorite-' + escape(food.id) + '" aria-pressed="' + favorite + '" aria-label="' + escape(t(favorite ? 'unstar' : 'star') + ': ' + name(food)) + '">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="' + (favorite ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m12 3 2.8 5.7 6.3.9-4.55 4.44 1.07 6.26L12 17.35l-5.62 2.95 1.07-6.26L2.9 9.6l6.3-.9Z"/></svg></button></div>';
    }).join('') + '</div>';
  };
  render.buildManualBuilderMarkup = function (view) {
    const tabs = view.tabs || [];
    const toolbar = '<div class="nw-search"><label for="nutrition-food-search">' + t('search') + '</label><input id="nutrition-food-search" data-focus-key="food-search" type="search" autocomplete="off" value="' + escape(view.search || '') + '" placeholder="' + t('search') + '"></div>' +
      '<div class="nw-filter" role="group" aria-label="' + escape(t('products')) + '">' + ['all','favorite','mine'].map(function (key) {
        return '<button type="button" data-action="filter-foods" data-filter="' + key + '" data-focus-key="filter-' + key + '" aria-pressed="' + ((view.filter || 'all') === key) + '">' + t(key) + '</button>';
      }).join('') + '</div>';
    const total = Object.values(view.selected || {}).reduce(function (sum, ids) { return sum + ids.length; }, 0);
    return '<div class="builder-grid nw-builder"><p class="nw-help">' + t('selectNote') + '</p>' + toolbar +
      '<div class="macro-tabs" role="group" aria-label="' + escape(t('products')) + '">' + tabs.map(function (tab) {
        const count = (view.selected && view.selected[tab.key] || []).length;
        return '<button type="button" class="macro-tab' + (view.activeGroup === tab.key ? ' active' : '') + '" data-action="open-group" data-group="' + tab.key + '" data-focus-key="group-' + tab.key + '" aria-pressed="' + (view.activeGroup === tab.key) + '">' + t(tab.key) + ' <span>' + count + '</span></button>';
      }).join('') + '</div><div data-nutrition-products>' + view.productsMarkup + '</div>' +
      disclosure(t('selected') + ' · ' + total, view.selectedSummaryMarkup || '', 'selected') +
      (view.customToolsMarkup || '') + (view.errorMarkup || '') +
      '<div class="builder-actions"><button type="button" class="builder-main-btn primary" data-action="build-manual">' + t('start') + '</button></div></div>';
  };
  render.buildChoiceSectionMarkup = function (title, category, rows, mealKey, dayType, selectedAmounts) {
    const amounts = selectedAmounts || {};
    const available = rows.filter(function (row) { return !Object.prototype.hasOwnProperty.call(amounts, row.id); });
    return '<section class="nw-choice-section"><h5>' + t(category) + '</h5>' + Object.keys(amounts).map(function (id) {
      const food = nutrition.getFoodById(id);
      if (!food) return '';
      const row = rows.find(function (item) { return item.id === id; });
      const amount = amounts[id] || (row && row.amount) || food.defaultAmount;
      const a = attrs(dayType, mealKey, category, id);
      const unit = food.unitType === 'piece' ? (language() === 'en' ? 'pcs' : 'шт') : (language() === 'en' ? 'g' : 'г');
      const details = hint(food);
      return '<div class="nw-meal-food"><div class="nw-meal-food-name"><strong>' + escape(name(food)) + '</strong>' + (details ? '<small>' + escape(details) + '</small>' : '') + '</div>' +
        '<div class="nw-portion"><button type="button" data-action="adjust-meal-choice" data-direction="decrease"' + a + ' data-focus-key="decrease-' + mealKey + '-' + id + '" aria-label="' + escape(t('decrease') + ': ' + name(food)) + '">−</button>' +
        '<label><span class="visually-hidden">' + escape(t('amount') + ': ' + name(food)) + '</span><input type="number" class="nutrition-portion-input"' + a + ' data-focus-key="amount-' + mealKey + '-' + id + '" min="' + (food.unitType === 'piece' ? 1 : 0.1) + '" max="' + (food.unitType === 'piece' ? 100 : 3000) + '" step="' + (food.unitType === 'piece' ? 1 : 0.1) + '" inputmode="decimal" value="' + amount + '"></label><span>' + unit + '</span>' +
        '<button type="button" data-action="adjust-meal-choice" data-direction="increase"' + a + ' data-focus-key="increase-' + mealKey + '-' + id + '" aria-label="' + escape(t('increase') + ': ' + name(food)) + '">+</button></div>' +
        '<button type="button" class="nw-remove" data-action="remove-meal-food"' + a + ' aria-label="' + escape(t('remove') + ': ' + name(food)) + '">' + t('remove') + '</button>' +
        (food.sourceUrl ? '<a class="nw-source" href="' + escape(food.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + t('source') + ': USDA</a>' : '') + '</div>';
    }).join('') + (available.length ? '<label class="nw-add-food"><span class="visually-hidden">' + escape(t('add') + ': ' + t(category) + ' — ' + translate(nutrition.getMealNames()[mealKey])) + '</span><select class="meal-choice-select"' + attrs(dayType, mealKey, category) + ' data-focus-key="add-' + mealKey + '-' + category + '"><option value="">' + t('add') + '</option>' + available.map(function (row) {
      const food = nutrition.getFoodById(row.id);
      return '<option value="' + escape(row.id) + '" data-amount="' + row.amount + '">' + escape(food ? name(food) : row.name) + '</option>';
    }).join('') + '</select></label>' : '') + '</section>';
  };
  render.buildMealChoiceCard = function (view, formatters) {
    const totals = view.mealTotals || {kcal:0,p:0,f:0,c:0};
    const recipe = view.hasItems ? disclosure(t('recipe'), '<p class="nw-help">' + t('recipeHint') + '</p><div class="nw-recipe-fields"><label class="nw-field">' + t('recipeName') + '<input class="nw-recipe-name" name="recipe-name-' + view.mealKey + '" type="text" maxlength="64" required></label><label class="nw-field">' + t('recipeYield') + '<input class="nw-recipe-yield" name="recipe-yield-' + view.mealKey + '" type="number" min="1" max="20000" step="0.1" inputmode="decimal" required></label><label class="nw-field">' + t('products') + '<select class="nw-recipe-category" name="recipe-category-' + view.mealKey + '">' + ['protein','carb','fat','vegetable'].map(function (key) { return '<option value="' + key + '">' + t(key) + '</option>'; }).join('') + '</select></label><button type="button" class="builder-main-btn secondary" data-action="save-meal-recipe" data-meal="' + view.mealKey + '">' + t('recipe') + '</button></div>', 'recipe-' + view.mealKey) : '';
    return '<article class="meal-choice-card nw-meal-card"><header class="meal-choice-head"><h4>' + escape(translate(view.mealName)) + '</h4><span>' + formatters.formatKcal(totals.kcal) + '</span></header>' +
      '<p class="nw-meal-macros">' + t('proteins') + ' ' + formatters.formatGrams(totals.p) + ' · ' + t('fats') + ' ' + formatters.formatGrams(totals.f) + ' · ' + t('carbs') + ' ' + formatters.formatGrams(totals.c) + '</p>' +
      view.proteinSectionMarkup + view.carbSectionMarkup + view.vegetableSectionMarkup + view.fatSectionMarkup +
      disclosure(t('extra_carb'), view.extraCarbSectionMarkup || '', 'extras-' + view.mealKey) + recipe + (view.adherenceMarkup || '') + '</article>';
  };
  render.buildMacroTrackerMarkup = function (targets, totals, formatters) {
    const values = [{key:'kcal',target:'calories',label:'calories',format:formatters.formatKcal},{key:'p',target:'protein',label:'proteins',format:formatters.formatGrams},{key:'f',target:'fat',label:'fats',format:formatters.formatGrams},{key:'c',target:'carbs',label:'carbs',format:formatters.formatGrams}];
    return '<section class="macro-live-panel nw-day-summary" aria-live="polite" aria-atomic="true" aria-label="' + t('planned') + '"><h4>' + t('planned') + '</h4><div class="nw-summary-values">' + values.map(function (item) {
      const actual = totals && totals[item.key] || 0, goal = targets[item.target] || 0;
      return '<div><span>' + t(item.label) + '</span><strong>' + item.format(actual) + '</strong><small>/ ' + item.format(goal) + '</small><progress max="' + Math.max(goal,actual,1) + '" value="' + actual + '" aria-label="' + t(item.label) + '"></progress></div>';
    }).join('') + '</div></section>';
  };
  render.buildMealConstructorMarkup = function (view, formatters) {
    const targets = view.activeTargets;
    return '<div class="final-nutrition-result nw-menu"><div class="nw-menu-head"><h3 class="result-title">' + t('menu') + '</h3><button type="button" class="builder-main-btn secondary" data-action="back-constructor">' + t('edit') + '</button></div>' +
      view.macroTrackerMarkup + (view.reviewMarkup || '') + (view.adherenceMarkup || '') + '<p class="nw-meta">' + t('meals') + ': ' + view.filledMealsCount + ' / ' + view.mealsCount + ' · ' + t('water') + ': ' + formatters.formatLiters(targets.waterLiters) + ' · ' + t('salt') + ': ' + formatters.formatGrams(targets.saltGrams) + '</p>' +
      '<div class="meal-constructor-grid compact-meal-grid">' + view.mealCardsMarkup + '</div>' +
      view.menuTemplateToolsMarkup + (view.shoppingMarkup || '') + guidance(targets, (view.accuracyMarkup || '') + (view.electrolyteMarkup || '') + (view.phaseMarkup || '')) +
      disclosure(t('details'), '<div class="auto-meal-grid compact-summary-grid">' + view.selectedMealsMarkup + '</div>', 'summary') + '</div>';
  };
  render.buildMenuTemplateToolsMarkup = function (view) {
    return disclosure(t('template'), originals.buildMenuTemplateToolsMarkup(view), 'menu-template');
  };
  render.buildShoppingListMarkup = function (meals) {
    const amounts = new Map();
    meals.forEach(function (meal) {
      meal.items.forEach(function (item) { amounts.set(item.id, (amounts.get(item.id) || 0) + item.amount); });
    });
    if (!amounts.size) return '';
    return disclosure(t('shopping'), '<p class="nw-help">' + t('shoppingHint') + '</p><ul class="nw-shopping-list">' + Array.from(amounts).map(function (entry) {
      const food = nutrition.getFoodById(entry[0]);
      const foodState = state(food);
      return '<li><span>' + escape(name(food)) + '</span><strong>' + format(entry[1]) + ' ' + (food.unitType === 'piece' ? (language() === 'en' ? 'pcs' : 'шт') : (language() === 'en' ? 'g' : 'г')) + '</strong>' + (foodState ? '<small>' + escape(foodState) + '</small>' : '') + '</li>';
    }).join('') + '</ul>', 'shopping');
  };
  render.buildFinalNutritionMarkup = function (title, targets, plan, formatters) {
    return '<div class="final-nutrition-result nw-menu"><h3 class="result-title">' + escape(translate(title)) + '</h3>' + render.buildMacroTrackerMarkup(targets, plan.totals, formatters) +
      render.buildPlanReviewMarkup(targets,plan) + render.buildAdherenceSummaryMarkup(plan.meals,targets.weightMode) +
      '<p class="nw-meta">' + t('water') + ': ' + formatters.formatLiters(targets.waterLiters) + ' · ' + t('salt') + ': ' + formatters.formatGrams(targets.saltGrams) + '</p><div class="auto-meal-grid compact-summary-grid">' +
      plan.meals.map(function (meal) { return '<div class="nw-ready-meal">' + originals.buildMealCardMarkup(meal, formatters) + render.buildAdherenceMealMarkup(meal,targets.weightMode) + '</div>'; }).join('') + '</div>' +
      render.buildShoppingListMarkup(plan.meals) + guidance(targets, originals.buildElectrolyteNoteMarkup(targets) + originals.buildPhaseRecommendationMarkup(targets,formatters)) +
      '<button type="button" class="builder-main-btn primary" data-action="use-generated-menu">' + t('usePlan') + '</button></div>';
  };
  const initialTranslateText = window.VitalRiseI18n && window.VitalRiseI18n.translateText;
  function translateForLanguage(value, lang) {
    const index = {uk:0,en:1,ru:2}[lang] || 0;
    const perPiece = /^(.+) (?:ккал за 1 шт|kcal per piece)$/.exec(value);
    if (perPiece) return copy.perPiece[index].replace('{calories}', perPiece[1]);
    const match = Object.values(copy).find(function (row) { return row.includes(value); });
    if (match) return match[index];
    const food = (system.nutritionCatalog || []).find(function (item) { return item.names && Object.values(item.names).includes(value); });
    return food ? food.names[lang] : null;
  }
  if (initialTranslateText) window.VitalRiseI18n.translateText = function (value) {
    return translateForLanguage(value, language()) || initialTranslateText(value);
  };
  system.nutritionWorkspace = {t:t, foodName:name, foodState:state, foodHint:hint, translateForLanguage:translateForLanguage, dayKey:dayKey, getAdherence:getAdherence, saveAdherence:saveAdherence};
  document.addEventListener('DOMContentLoaded', function () {
    const panel = document.getElementById('nutrition-panel');
    if (!panel) return;
    const form = document.getElementById('nutrition-form');
    if (!form || !form.querySelector('#age') || !form.querySelector('#weight-mode-toggle')) return;
    panel.classList.add('nutrition-workspace');
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'assets/css/nutrition-workspace.css?v=release-20261004-1';
    document.head.appendChild(css);
    const parameterDetails = document.createElement('details');
    parameterDetails.className = 'nw-parameters'; parameterDetails.open = true;
    parameterDetails.innerHTML = '<summary><span data-nw-text="parameters">' + t('parameters') + '</span><span data-nutrition-parameter-summary></span></summary>';
    form.before(parameterDetails); parameterDetails.appendChild(form);
    const advanced = document.createElement('details'); advanced.className = 'nw-advanced nw-disclosure';
    advanced.innerHTML = '<summary data-nw-text="advanced">' + t('advanced') + '</summary><div class="nw-advanced-grid"></div>';
    const actions = form.querySelector('.form-actions'); actions.before(advanced);
    ['nutrition-profile','program-phase','progress-week','load-context'].forEach(function (id) {
      const field = document.getElementById(id);
      if (field) advanced.querySelector('div').appendChild(field.closest('.form-group'));
    });
    ['activity','goal','weight-mode-toggle'].forEach(function (id) { document.getElementById(id).closest('.form-group').classList.add('nw-wide-field'); });
    const heading = panel.querySelector('.panel-head');
    heading.querySelector('.panel-chip')?.remove();
    heading.querySelector('h3').textContent = translate('Харчування');
    heading.querySelector('p').dataset.nwText = 'intro';
    heading.querySelector('p').textContent = t('intro');
    if (document.querySelector('.module-page-nutrition')) {
      document.querySelector('.calculator-intro')?.remove();
      document.querySelector('.calculator-console')?.remove();
    }
    form.addEventListener('submit', function () {
      if (!form.checkValidity()) return;
      parameterDetails.open = false;
      const weight = document.getElementById('weight').value;
      parameterDetails.querySelector('[data-nutrition-parameter-summary]').textContent = weight + ' ' + (language() === 'en' ? 'kg' : 'кг') + ' · ' + document.getElementById('goal').selectedOptions[0].textContent;
    });
    document.getElementById('nutrition-reset').addEventListener('click', function () { parameterDetails.open = true; parameterDetails.querySelector('[data-nutrition-parameter-summary]').textContent = ''; });
    const result = document.getElementById('nutrition-result');
    result.setAttribute('aria-live','off');
  });
})();
