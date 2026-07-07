(function () {
  const system = window.VitalRiseSystem || {};
  const nutrition = system.nutrition || {};

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getFormatter(formatters, key) {
    return formatters && typeof formatters[key] === "function"
      ? formatters[key]
      : function (value) {
          return String(value);
        };
  }

  const nutritionUiText = {
    uk: {
      autoMealPlan: "Автоматично сформований раціон",
      calories: "Калорії",
      protein: "Білки",
      fats: "Жири",
      carbs: "Вуглеводи",
      water: "Вода",
      salt: "Сіль",
      meals: "Прийомів їжі",
      context: "Контекст",
      back: "Назад",
      noneSelected: "Нічого не вибрано.",
      nothingMeal: "Ще нічого не вибрано.",
      stableDay: "Стабільний день",
      proteinShort: "Б:",
      fatsShort: "Ж:",
      carbsShort: "В:",
      logicLine: "Логіка VitalRise: білок — база, жири — стабільність, вуглеводи — головний важіль цілі.",
      foodWeightNote: "Вага продуктів: рис, гречка, картопля, макарони, м’ясо та риба рахуються у готовому вигляді; вівсянка та інші сухі сипучі продукти — у сухому вигляді.",
      mealVolumeTitle: "Обсяг прийомів їжі",
      mealVolumeTitleHigh: "Високий калораж і обсяг їжі",
      mealVolumeText: "Не роби прийоми їжі надто великими без потреби. Менша порція частіше легше проходить по ШКТ: менше важкості, рефлюксу, здуття і більше шансів стабільно добрати білок, овочі та вуглеводи без дискомфорту.",
      mealVolumeTextHigh: "Якщо добовий калораж великий, не намагайся втиснути його весь у 2-3 дуже великі прийоми. Краще розподілити енергію на 4-5 прийомів або додати легкий перекус: менший за обсягом прийом зазвичай легше перетравлюється і краще переноситься, ніж дуже великий.",
      mealVolumeHint: "Орієнтир: якщо один прийом регулярно виходить дуже важким по обсягу або калоріях, збільш кількість прийомів їжі замість того, щоб “запихати” денний план силою.",
      electrolyteDefaultTitle: "Стабільна вода й електроліти",
      electrolyteDefaultText: "Для силової роботи, суглобів, витривалості, пампу, тиску й самопочуття електроліти мають бути стабільними. На схудненні головний важіль - калорії та вуглеводи, а не різке зменшення солі.",
      electrolyteMedicalNote: "Якщо є гіпертонія, хвороби нирок, набряки або рекомендації лікаря — орієнтуйся на медичні призначення, а не на спортивний розрахунок.",
      selectedProtein: "Обрані білкові продукти",
      selectedCarbs: "Обрані гарніри та вуглеводи",
      selectedExtraCarbs: "Додаткові вуглеводи",
      selectedFats: "Обрані додаткові жири",
      selectedVegetables: "Обрані овочі",
      normControl: "Контроль норми",
      updatesAfterChoice: "Оновлюється після кожного вибору",
      closeToTarget: "Норма близько",
      over: "Перебір +",
      under: "Недобір ",
      mealConstructor: "Конструктор раціону",
      daySuffix: " / день",
      mealsWithChoices: "Прийомів з вибором",
      mealSummaryTitle: "Підсумок по прийомах їжі"
    },
    en: {
      autoMealPlan: "Automatically built meal plan",
      calories: "Calories",
      protein: "Protein",
      fats: "Fats",
      carbs: "Carbs",
      water: "Water",
      salt: "Salt",
      meals: "Meals",
      context: "Context",
      back: "Back",
      noneSelected: "Nothing selected.",
      nothingMeal: "Nothing selected yet.",
      stableDay: "Stable day",
      proteinShort: "P:",
      fatsShort: "F:",
      carbsShort: "C:",
      logicLine: "VitalRise logic: protein is the base, fats provide stability, carbs are the main goal lever.",
      foodWeightNote: "Food weight: rice, buckwheat, potatoes, pasta, meat, and fish are counted cooked; oats and other dry grains are counted dry.",
      mealVolumeTitle: "Meal volume",
      mealVolumeTitleHigh: "High calories and food volume",
      mealVolumeText: "Do not make meals unnecessarily large. A smaller portion is often easier on digestion: less heaviness, reflux, bloating, and a better chance to hit protein, vegetables, and carbs without discomfort.",
      mealVolumeTextHigh: "If daily calories are high, do not force them into 2-3 very large meals. Spread energy across 4-5 meals or add a light snack: a smaller meal is usually easier to digest and tolerate than a very large one.",
      mealVolumeHint: "Guide: if one meal regularly feels too heavy by volume or calories, increase the number of meals instead of forcing the daily plan.",
      electrolyteDefaultTitle: "Stable water and electrolytes",
      electrolyteDefaultText: "For strength work, joints, endurance, pump, blood pressure, and well-being, electrolytes should stay stable. When cutting, the main lever is calories and carbs, not sharply reducing salt.",
      electrolyteMedicalNote: "If you have hypertension, kidney disease, edema, or medical instructions, follow your doctor’s guidance rather than a sports calculation.",
      selectedProtein: "Selected protein foods",
      selectedCarbs: "Selected sides and carbs",
      selectedExtraCarbs: "Extra carbs",
      selectedFats: "Selected extra fats",
      selectedVegetables: "Selected vegetables",
      normControl: "Target control",
      updatesAfterChoice: "Updates after each choice",
      closeToTarget: "Close to target",
      over: "Over +",
      under: "Under ",
      mealConstructor: "Meal constructor",
      daySuffix: " / day",
      mealsWithChoices: "Meals with choices",
      mealSummaryTitle: "Meal summary"
    },
    ru: {
      autoMealPlan: "Автоматически сформированный рацион",
      calories: "Калории",
      protein: "Белки",
      fats: "Жиры",
      carbs: "Углеводы",
      water: "Вода",
      salt: "Соль",
      meals: "Приемов пищи",
      context: "Контекст",
      back: "Назад",
      noneSelected: "Ничего не выбрано.",
      nothingMeal: "Пока ничего не выбрано.",
      stableDay: "Стабильный день",
      proteinShort: "Б:",
      fatsShort: "Ж:",
      carbsShort: "У:",
      logicLine: "Логика VitalRise: белок — база, жиры — стабильность, углеводы — главный рычаг цели.",
      foodWeightNote: "Вес продуктов: рис, гречка, картофель, макароны, мясо и рыба считаются в готовом виде; овсянка и другие сухие крупы — в сухом виде.",
      mealVolumeTitle: "Объем приемов пищи",
      mealVolumeTitleHigh: "Высокий калораж и объем еды",
      mealVolumeText: "Не делай приемы пищи слишком большими без необходимости. Меньшая порция чаще легче проходит по ЖКТ: меньше тяжести, рефлюкса, вздутия и больше шансов стабильно добрать белок, овощи и углеводы без дискомфорта.",
      mealVolumeTextHigh: "Если дневной калораж большой, не пытайся вместить его весь в 2-3 очень больших приема. Лучше распределить энергию на 4-5 приемов или добавить легкий перекус: меньший по объему прием обычно легче переваривается и переносится.",
      mealVolumeHint: "Ориентир: если один прием регулярно получается слишком тяжелым по объему или калориям, увеличь количество приемов пищи вместо того, чтобы силой закрывать дневной план.",
      electrolyteDefaultTitle: "Стабильная вода и электролиты",
      electrolyteDefaultText: "Для силовой работы, суставов, выносливости, пампа, давления и самочувствия электролиты должны быть стабильными. На снижении веса главный рычаг - калории и углеводы, а не резкое уменьшение соли.",
      electrolyteMedicalNote: "Если есть гипертония, болезни почек, отеки или рекомендации врача — ориентируйся на медицинские назначения, а не на спортивный расчет.",
      selectedProtein: "Выбранные белковые продукты",
      selectedCarbs: "Выбранные гарниры и углеводы",
      selectedExtraCarbs: "Дополнительные углеводы",
      selectedFats: "Выбранные дополнительные жиры",
      selectedVegetables: "Выбранные овощи",
      normControl: "Контроль нормы",
      updatesAfterChoice: "Обновляется после каждого выбора",
      closeToTarget: "Близко к норме",
      over: "Перебор +",
      under: "Недобор ",
      mealConstructor: "Конструктор рациона",
      daySuffix: " / день",
      mealsWithChoices: "Приемов с выбором",
      mealSummaryTitle: "Итог по приемам пищи"
    }
  };

  const sourceTextKeys = {
    "Автоматично сформований раціон": "autoMealPlan",
    "Стабільний день": "stableDay",
    "Обрані білкові продукти": "selectedProtein",
    "Обрані гарніри та вуглеводи": "selectedCarbs",
    "Додаткові вуглеводи": "selectedExtraCarbs",
    "Обрані додаткові жири": "selectedFats",
    "Обрані овочі": "selectedVegetables"
  };

  const fallbackText = {
    "Сніданок": { en: "Breakfast", ru: "Завтрак" },
    "Другий сніданок": { en: "Second breakfast", ru: "Второй завтрак" },
    "Обід": { en: "Lunch", ru: "Обед" },
    "Перекус": { en: "Snack", ru: "Перекус" },
    "Вечеря": { en: "Dinner", ru: "Ужин" },
    "Вечірній перекус": { en: "Evening snack", ru: "Вечерний перекус" },
    "Підвищене потовиділення": { en: "Increased sweating", ru: "Повышенное потоотделение" },
    "Перед важкою сесією": { en: "Before a hard session", ru: "Перед тяжелой сессией" },
    "Калорії та вуглеводи залишаються стабільними. Додається контроль рідини й електролітів, бо сильне потовиділення може просаджувати самопочуття, тиск і якість роботи.": {
      en: "Calories and carbs stay stable. Fluid and electrolyte control is added because heavy sweating can reduce well-being, blood pressure stability, and work quality.",
      ru: "Калории и углеводы остаются стабильными. Добавляется контроль жидкости и электролитов, потому что сильное потоотделение может просаживать самочувствие, давление и качество работы."
    },
    "Пий частіше невеликими порціями, особливо до і після навантаження або сауни.": {
      en: "Drink more often in small portions, especially before and after training or sauna.",
      ru: "Пей чаще небольшими порциями, особенно до и после нагрузки или сауны."
    },
    "Сіль і вода коригуються по потовиділенню, але без різких крайнощів. Якщо є тиск, набряки чи ниркові обмеження - орієнтир тільки через лікаря.": {
      en: "Salt and water are adjusted for sweating, but without sharp extremes. If there is blood pressure, edema, or kidney limitations, use medical guidance only.",
      ru: "Соль и вода корректируются по потоотделению, но без резких крайностей. Если есть давление, отеки или ограничения по почкам, ориентир только через врача."
    },
    "Раціон не зменшується. За 2-4 години до важкого навантаження тримай нормальну воду, сіль і вуглеводи; додатковий акцент робиться на електролітах, щоб тренування проходило комфортніше.": {
      en: "The diet is not reduced. Two to four hours before hard training, keep normal water, salt, and carbs; electrolytes get extra attention so the session feels better.",
      ru: "Рацион не уменьшается. За 2-4 часа до тяжелой нагрузки держи нормальную воду, соль и углеводы; дополнительный акцент делается на электролитах, чтобы тренировка проходила комфортнее."
    },
    "За 2-4 години: 500-700 мл води з їжею. За 30-60 хвилин: 250-400 мл води невеликими ковтками.": {
      en: "2-4 hours before: 500-700 ml water with food. 30-60 minutes before: 250-400 ml water in small sips.",
      ru: "За 2-4 часа: 500-700 мл воды с едой. За 30-60 минут: 250-400 мл воды небольшими глотками."
    },
    "Орієнтир: натрій із солі в межах добової норми, калій із продуктів, магній без перевищення індивідуальної переносимості.": {
      en: "Guide: sodium from salt within the daily target, potassium from foods, magnesium without exceeding individual tolerance.",
      ru: "Ориентир: натрий из соли в пределах суточной нормы, калий из продуктов, магний без превышения индивидуальной переносимости."
    },
    "Калорії, білки, жири й вуглеводи не стрибають від дня до дня. Для набору це допомагає адаптувати травлення до більшого об'єму їжі, для схуднення - тримати прогнозований дефіцит.": {
      en: "Calories, protein, fats, and carbs do not jump from day to day. For gaining, this helps digestion adapt to more food volume; for cutting, it keeps the deficit predictable.",
      ru: "Калории, белки, жиры и углеводы не скачут изо дня в день. Для набора это помогает пищеварению адаптироваться к большему объему еды, для снижения веса - держать прогнозируемый дефицит."
    },
    "Воду розподіляй рівно протягом дня, без різкого заливання перед навантаженням.": {
      en: "Spread water evenly through the day, without suddenly overloading before training.",
      ru: "Воду распределяй ровно в течение дня, без резкого заливания перед нагрузкой."
    },
    "Сіль не урізається під ціль. Головні зміни в раціоні робляться поступово через калорії та вуглеводи.": {
      en: "Salt is not cut for the goal. The main diet changes are made gradually through calories and carbs.",
      ru: "Соль не урезается под цель. Главные изменения в рационе делаются постепенно через калории и углеводы."
    },
    "Яйця": { en: "Eggs", ru: "Яйца" },
    "Вівсянка": { en: "Oatmeal", ru: "Овсянка" },
    "Авокадо": { en: "Avocado", ru: "Авокадо" },
    "Куряче філе": { en: "Chicken breast", ru: "Куриное филе" },
    "Рис": { en: "Rice", ru: "Рис" },
    "Шпинат": { en: "Spinach", ru: "Шпинат" },
    "Томат": { en: "Tomato", ru: "Томат" },
    "Оливкова олія": { en: "Olive oil", ru: "Оливковое масло" },
    "Картопля": { en: "Potato", ru: "Картофель" },
    "Біла риба (хек / мінтай / тріска / морський окунь)": { en: "White fish (hake / pollock / cod / sea bass)", ru: "Белая рыба (хек / минтай / треска / морской окунь)" },
    "Броколі": { en: "Broccoli", ru: "Брокколи" },
    "Огірок": { en: "Cucumber", ru: "Огурец" }
  };

  function getLanguage() {
    if (window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function") {
      return window.VitalRiseI18n.getLanguage();
    }
    return (document.documentElement.lang || "uk").toLowerCase();
  }

  function uiText(key) {
    const language = getLanguage();
    const dictionary = nutritionUiText[language] || nutritionUiText.uk;
    return dictionary[key] || nutritionUiText.uk[key] || key;
  }

  function translateText(value) {
    const text = String(value || "");
    const language = getLanguage();
    const key = sourceTextKeys[text];
    if (key) return uiText(key);
    if (language !== "uk" && fallbackText[text] && fallbackText[text][language]) {
      return fallbackText[text][language];
    }
    if (window.VitalRiseI18n && typeof window.VitalRiseI18n.translateText === "function") {
      return window.VitalRiseI18n.translateText(text) || text;
    }
    return text;
  }

  function unitLabel(label) {
    const language = getLanguage();
    if (language === "en") {
      if (label === "г") return "g";
      if (label === "л") return "L";
      if (label === "ккал") return "kcal";
      if (label === "шт") return "pcs";
    }
    return label;
  }

  function foodLineMarkup(item) {
    return escapeHtml(translateText(item.name)) + " - " + item.amount + " " + unitLabel(item.unitLabel);
  }

  function mealSummaryMarkup(totals, formatKcal, formatGrams) {
    return (
      uiText("proteinShort") + " " + formatGrams(totals.p) + " | " +
      uiText("fatsShort") + " " + formatGrams(totals.f) + " | " +
      uiText("carbsShort") + " " + formatGrams(totals.c) + " | " +
      formatKcal(totals.kcal)
    );
  }

  function buildNutritionLogicLineMarkup() {
    return (
      '<div class="nutrition-logic-line">' +
        uiText("logicLine") +
      '</div>'
    );
  }

  function buildFoodWeightNoteMarkup() {
    return (
      '<div class="builder-note">' +
        uiText("foodWeightNote") +
      '</div>'
    );
  }

  function buildMealVolumeNoteMarkup(targets) {
    if (!targets) return "";

    const calories = Number(targets.calories) || 0;
    const mealsCount = Number(targets.mealsCount) || 4;
    const kcalPerMeal = mealsCount > 0 ? Math.round(calories / mealsCount) : 0;
    const isHighLoad = calories >= 2800 || kcalPerMeal >= 750;
    const title = isHighLoad ? uiText("mealVolumeTitleHigh") : uiText("mealVolumeTitle");
    const text = isHighLoad ? uiText("mealVolumeTextHigh") : uiText("mealVolumeText");

    return (
      '<div class="phase-recommendation-card meal-volume-note">' +
        '<h4>' + title + '</h4>' +
        '<p>' + text + '</p>' +
        '<div class="builder-note">' + uiText("mealVolumeHint") + '</div>' +
      '</div>'
    );
  }

  function buildActiveCorrectionMarkup(targets) {
    const correction = targets && targets.activeCorrection ? targets.activeCorrection : null;
    if (!correction) return "";

    const value = Math.round(Number(correction.calorieAdjustment) || 0);
    const label = (value > 0 ? "+" : "") + value + " ккал";

    return (
      '<div class="nutrition-correction-card">' +
        '<span class="section-label">Активна корекція після замірів</span>' +
        '<h4>' + label + '</h4>' +
        '<p>' + escapeHtml(correction.reason || "Поправка збережена після 4-тижневого контролю.") + '</p>' +
        '<small>Білок залишено стабільним, нові калорії перераховані переважно через вуглеводи.</small>' +
      '</div>'
    );
  }

  function buildMealCardMarkup(meal, formatters) {
    const formatKcal = getFormatter(formatters, "formatKcal");
    const formatGrams = getFormatter(formatters, "formatGrams");

    return (
      '<div class="auto-meal-card">' +
        '<h4 class="auto-meal-title">' + escapeHtml(translateText(meal.mealName)) + '</h4>' +
        '<div class="auto-meal-foods">' +
          meal.items.map(function (item) {
            return (
              '<div class="auto-food-item">' +
                '<strong>' + escapeHtml(translateText(item.name)) + '</strong> - ' +
                item.amount + ' ' + unitLabel(item.unitLabel) +
              '</div>'
            );
          }).join("") +
        '</div>' +
        '<div class="meal-summary">' + mealSummaryMarkup(meal.totals, formatKcal, formatGrams) + '</div>' +
      '</div>'
    );
  }

  function buildSelectedSummaryMarkup(groups, selected, getFoodById) {
    return (
      '<div class="selected-groups">' +
        groups.map(function (group) {
          const ids = selected[group.key] || [];
          return (
            '<div class="selected-group">' +
              '<h4 class="selected-title">' + escapeHtml(translateText(group.title)) + '</h4>' +
              (
                ids.length
                  ? '<div class="selected-list">' + ids.map(function (id) {
                      const item = getFoodById(id);
                      return '<div class="selected-item"><span class="selected-name">' + escapeHtml(item ? translateText(item.name) : id) + '</span></div>';
                    }).join("") + '</div>'
                  : '<div class="builder-note">' + uiText("noneSelected") + '</div>'
              ) +
            '</div>'
          );
        }).join("") +
      '</div>'
    );
  }

  function buildProductsListMarkup(category, products, selectedIds) {
    const ids = selectedIds || [];

    return (
      '<div class="product-list">' +
        products.map(function (product) {
          const checked = ids.includes(product.id);

          return (
            '<label class="product-item">' +
              '<span class="product-item-left">' +
                '<input type="checkbox" class="nutrition-product-checkbox" data-group="' + category + '" data-id="' + product.id + '"' + (checked ? " checked" : "") + '>' +
                '<span class="product-item-copy">' +
                  '<span class="product-item-name">' + escapeHtml(translateText(product.name)) + '</span>' +
                  (product.note ? '<small>' + escapeHtml(translateText(product.note)) + '</small>' : '') +
                '</span>' +
              '</span>' +
            '</label>'
          );
        }).join("") +
      '</div>'
    );
  }

  function buildCustomProductToolsMarkup(view) {
    const exportValue = escapeHtml(JSON.stringify({ products: view.customProducts || [] }, null, 2));
    const templates = view.templates || [];
    const productList = (view.customProducts || []).map(function (product) {
      return (
        '<div class="custom-product-row">' +
          '<span>' + escapeHtml(product.name) + '</span>' +
          '<small>' + escapeHtml(product.category) + '</small>' +
          '<button type="button" data-action="delete-custom-product" data-id="' + escapeHtml(product.id) + '">Видалити</button>' +
        '</div>'
      );
    }).join("");

    return (
      '<details class="nutrition-custom-tools">' +
        '<summary class="custom-tools-head">' +
          '<strong>Власні продукти і шаблони</strong>' +
          '<span>' + (view.customProducts || []).length + ' продуктів</span>' +
        '</summary>' +
        '<div class="nutrition-custom-tools-body">' +
        '<form id="nutrition-custom-product-form" class="custom-product-form">' +
          '<input name="name" maxlength="64" placeholder="Назва продукту">' +
          '<select name="category">' +
            '<option value="protein">Білок</option>' +
            '<option value="carb">Вуглеводи</option>' +
            '<option value="extra_carb">Дод. вуглеводи</option>' +
            '<option value="fat">Жири</option>' +
            '<option value="vegetable">Овочі</option>' +
          '</select>' +
          '<input type="number" name="p" min="0" max="100" step="0.1" placeholder="Б/100">' +
          '<input type="number" name="f" min="0" max="100" step="0.1" placeholder="Ж/100">' +
          '<input type="number" name="c" min="0" max="100" step="0.1" placeholder="В/100">' +
          '<input type="number" name="kcal" min="0" max="900" step="1" placeholder="ккал/100">' +
          '<button type="submit" class="builder-main-btn secondary">Додати</button>' +
        '</form>' +
        '<div class="custom-product-list">' +
          (productList || '<div class="builder-note">Власних продуктів ще немає.</div>') +
        '</div>' +
        '<div class="nutrition-template-row">' +
          '<input id="nutrition-template-name" maxlength="48" placeholder="Назва шаблону меню">' +
          '<button type="button" class="builder-main-btn secondary" data-action="save-nutrition-template">Зберегти вибір</button>' +
          '<select id="nutrition-template-select">' +
            '<option value="">Обрати шаблон</option>' +
            templates.map(function (template) {
              return '<option value="' + escapeHtml(template.name) + '">' + escapeHtml(template.name) + '</option>';
            }).join("") +
          '</select>' +
          '<button type="button" class="builder-main-btn secondary" data-action="load-nutrition-template">Завантажити</button>' +
        '</div>' +
        '<details class="nutrition-import-box">' +
          '<summary>Імпорт / експорт продуктів JSON</summary>' +
          '<textarea id="nutrition-products-json" rows="5">' + exportValue + '</textarea>' +
          '<button type="button" class="builder-main-btn secondary" data-action="import-nutrition-products">Імпорт продуктів</button>' +
        '</details>' +
        (view.message ? '<div class="builder-note">' + escapeHtml(view.message) + '</div>' : '') +
        '</div>' +
      '</details>'
    );
  }

  function buildMenuTemplateToolsMarkup(view) {
    const templates = view.templates || [];

    return (
      '<div class="nutrition-menu-template-tools">' +
        '<div class="custom-tools-head">' +
          '<strong>Шаблони готового меню</strong>' +
          '<span>' + templates.length + ' шаблонів</span>' +
        '</div>' +
        '<div class="nutrition-template-row">' +
          '<input id="nutrition-menu-template-name" maxlength="48" placeholder="Назва готового меню">' +
          '<button type="button" class="builder-main-btn secondary" data-action="save-nutrition-menu-template">Зберегти меню</button>' +
          '<select id="nutrition-menu-template-select">' +
            '<option value="">Обрати меню</option>' +
            templates.map(function (template) {
              return '<option value="' + escapeHtml(template.name) + '">' + escapeHtml(template.name) + '</option>';
            }).join("") +
          '</select>' +
          '<button type="button" class="builder-main-btn secondary" data-action="load-nutrition-menu-template">Завантажити меню</button>' +
        '</div>' +
        (view.message ? '<div class="builder-note">' + escapeHtml(view.message) + '</div>' : '') +
      '</div>'
    );
  }

  function buildBuilderErrorMarkup(error) {
    if (!error) return "";

    return (
      '<div class="builder-error" role="alert">' +
        escapeHtml(error) +
      '</div>'
    );
  }

  function buildChoiceChipMarkup(dayType, mealKey, category, row, selectedAmounts) {
    const amounts = selectedAmounts || {};
    const isActive = Object.prototype.hasOwnProperty.call(amounts, row.id);
    const activeAmount = Number(amounts[row.id]) || row.amount;

    return (
      '<div class="meal-choice-option ' + (isActive ? "active" : "") + '">' +
        '<button type="button" class="meal-choice-chip ' + (isActive ? "active" : "") + '" ' +
          'data-action="toggle-meal-choice" ' +
          'data-day="' + dayType + '" ' +
          'data-meal="' + mealKey + '" ' +
          'data-category="' + category + '" ' +
          'data-id="' + row.id + '" ' +
          'data-amount="' + activeAmount + '">' +
            '<span class="meal-choice-name">' + escapeHtml(row.name) + '</span>' +
            '<span class="meal-choice-amount">' + activeAmount + ' ' + row.unitLabel + '</span>' +
        '</button>' +
        (isActive
          ? '<div class="meal-choice-controls">' +
              '<button type="button" aria-label="Зменшити" data-action="adjust-meal-choice" data-direction="decrease" data-day="' + dayType + '" data-meal="' + mealKey + '" data-category="' + category + '" data-id="' + row.id + '">-</button>' +
              '<strong>' + activeAmount + ' ' + row.unitLabel + '</strong>' +
              '<button type="button" aria-label="Збільшити" data-action="adjust-meal-choice" data-direction="increase" data-day="' + dayType + '" data-meal="' + mealKey + '" data-category="' + category + '" data-id="' + row.id + '">+</button>' +
            '</div>'
          : '') +
      '</div>'
    );
  }

  function getSelectedChoiceId(selectedAmounts) {
    const amounts = selectedAmounts || {};
    const ids = Object.keys(amounts);
    return ids.length ? ids[0] : "";
  }

  function buildChoiceSectionMarkup(title, category, rows, mealKey, dayType, selectedAmounts) {
    if (!rows.length) {
      return (
        '<div class="meal-choice-section">' +
          '<div class="meal-choice-section-title">' + title + '</div>' +
          '<div class="builder-note">Немає обраних продуктів у цій категорії.</div>' +
        '</div>'
      );
    }

    const selectedId = getSelectedChoiceId(selectedAmounts);
    const selectedRow = rows.find(function (row) {
      return row.id === selectedId;
    });
    const activeAmount = selectedRow
      ? Number((selectedAmounts || {})[selectedRow.id]) || selectedRow.amount
      : 0;

    return (
      '<div class="meal-choice-section">' +
        '<div class="meal-choice-section-head">' +
          '<div class="meal-choice-section-title">' + title + '</div>' +
          '<div class="meal-choice-section-hint">Один вибір на прийом: новий продукт замінить поточний.</div>' +
        '</div>' +
        '<div class="meal-choice-select-wrap">' +
          '<select class="meal-choice-select" ' +
            'data-day="' + dayType + '" ' +
            'data-meal="' + mealKey + '" ' +
            'data-category="' + category + '">' +
            '<option value="">Обрати продукт</option>' +
            rows.map(function (row) {
              const rowAmount = selectedRow && selectedRow.id === row.id
                ? activeAmount
                : row.amount;
              return (
                '<option value="' + escapeHtml(row.id) + '" data-amount="' + rowAmount + '"' + (row.id === selectedId ? " selected" : "") + '>' +
                  escapeHtml(row.name) + ' - ' + rowAmount + ' ' + escapeHtml(row.unitLabel) +
                '</option>'
              );
            }).join("") +
          '</select>' +
          '<span class="meal-choice-select-arrow">⌄</span>' +
        '</div>' +
        (selectedRow
          ? '<div class="meal-choice-controls meal-choice-select-controls">' +
              '<button type="button" aria-label="Зменшити" data-action="adjust-meal-choice" data-direction="decrease" data-day="' + dayType + '" data-meal="' + mealKey + '" data-category="' + category + '" data-id="' + selectedRow.id + '">-</button>' +
              '<strong>' + activeAmount + ' ' + escapeHtml(selectedRow.unitLabel) + '</strong>' +
              '<button type="button" aria-label="Збільшити" data-action="adjust-meal-choice" data-direction="increase" data-day="' + dayType + '" data-meal="' + mealKey + '" data-category="' + category + '" data-id="' + selectedRow.id + '">+</button>' +
            '</div>'
          : '') +
      '</div>'
    );
  }

  function buildManualBuilderMarkup(view) {
    const tabs = view.tabs || [];
    const isConfirmed = !!view.productsConfirmed;
    const productSelectionMarkup = isConfirmed
      ? '<div class="builder-confirmed-note">Вибір продуктів підтверджено. Список запропонованих продуктів сховано, щоб не перевантажувати сторінку.</div>'
      : (
          '<div class="macro-tabs">' +
            tabs.map(function (tab) {
              return (
                '<button type="button" class="macro-tab ' + (view.activeGroup === tab.key ? "active" : "") + '" data-action="open-group" data-group="' + tab.key + '">' +
                  tab.title +
                '</button>'
              );
            }).join("") +
          '</div>' +
          (view.customToolsMarkup || "") +
          (view.productsMarkup || "")
        );

    return (
      '<div class="builder-grid">' +
        productSelectionMarkup +
        (view.selectedSummaryMarkup || "") +
        '<div class="builder-note">Додаткові вуглеводи — це не база раціону, а рідкісний інструмент. Мед, джем, фініки, родзинки, лаваш/тортилью та сік краще використовувати мінімально, переважно на наборі маси або легкій рекомпозиції; при зниженні ваги вони не пропонуються в прийомах їжі.</div>' +
        '<div class="builder-note">Яйця рахуються тільки в штуках. Жовтків окремо немає. Автоматичні прийоми їжі будуються за шаблонами: сніданок, обід, перекус, вечеря.</div>' +
        (view.errorMarkup || "") +
        '<div class="builder-actions">' +
          (isConfirmed
            ? '<button type="button" class="builder-main-btn secondary" data-action="edit-products">Редагувати вибір</button>'
            : '<button type="button" class="builder-main-btn secondary" data-action="confirm-products">Підтвердити вибір</button>') +
          '<button type="button" class="builder-main-btn primary" data-action="build-manual">Сформувати раціон</button>' +
        '</div>' +
      '</div>'
    );
  }

  function buildNutritionConstructorMarkup(view) {
    return (
      '<div class="nutrition-builder">' +
        '<h3 class="result-title">Формування раціону</h3>' +
        '<div class="mode-switch">' +
          '<button type="button" class="mode-btn ' + (view.mode === "manual" ? "active" : "") + '" data-action="set-mode" data-mode="manual">Конструктор</button>' +
          '<button type="button" class="mode-btn ' + (view.mode === "auto" ? "active" : "") + '" data-action="set-mode" data-mode="auto">Автоматично</button>' +
        '</div>' +
        (view.mode === "manual" ? view.manualMarkup : view.autoMarkup) +
      '</div>'
    );
  }

  function buildMacroMeter(label, current, target, formatter) {
    const diff = current - target;
    const percent = target ? Math.min(140, Math.max(0, (current / target) * 100)) : 0;
    const diffAbs = Math.abs(diff);
    const tone = target && Math.abs(diff / target) <= 0.05
      ? "ok"
      : diff > 0 ? "over" : "under";
    const diffText = formatter(diffAbs);

    return (
      '<div class="macro-meter macro-meter-' + tone + '">' +
        '<div class="macro-meter-top">' +
          '<span>' + label + '</span>' +
          '<strong>' + formatter(current) + ' / ' + formatter(target) + '</strong>' +
        '</div>' +
        '<div class="macro-meter-bar"><i style="width: ' + percent.toFixed(0) + '%"></i></div>' +
        '<small>' + (tone === "ok" ? uiText("closeToTarget") : (diff > 0 ? uiText("over") : uiText("under")) + diffText) + '</small>' +
      '</div>'
    );
  }

  function buildMacroTrackerMarkup(targets, totals, formatters) {
    const formatKcal = getFormatter(formatters, "formatKcal");
    const formatGrams = getFormatter(formatters, "formatGrams");
    const current = totals || { kcal: 0, p: 0, f: 0, c: 0 };

    return (
      '<div class="macro-live-panel">' +
        '<div class="macro-live-head">' +
          '<span>' + uiText("normControl") + '</span>' +
          '<strong>' + uiText("updatesAfterChoice") + '</strong>' +
        '</div>' +
        '<div class="macro-live-grid">' +
          buildMacroMeter(uiText("calories"), current.kcal || 0, targets.calories || 0, formatKcal) +
          buildMacroMeter(uiText("protein"), current.p || 0, targets.protein || 0, formatGrams) +
          buildMacroMeter(uiText("fats"), current.f || 0, targets.fat || 0, formatGrams) +
          buildMacroMeter(uiText("carbs"), current.c || 0, targets.carbs || 0, formatGrams) +
        '</div>' +
      '</div>'
    );
  }

  function buildMealChoiceCard(view, formatters) {
    const formatKcal = getFormatter(formatters, "formatKcal");
    const formatGrams = getFormatter(formatters, "formatGrams");
    const targets = view.macroTargets;
    const totals = view.mealTotals || { kcal: 0, p: 0, f: 0, c: 0 };

    return (
      '<div class="meal-choice-card">' +
        '<div class="meal-choice-head">' +
          '<h4>' + escapeHtml(translateText(view.mealName)) + '</h4>' +
          '<div class="meal-choice-targets">' +
            '<span>' + formatKcal(targets.kcal) + '</span>' +
            '<span>' + uiText("proteinShort") + ' ' + formatGrams(targets.p) + '</span>' +
            '<span>' + uiText("fatsShort") + ' ' + formatGrams(targets.f) + '</span>' +
            '<span>' + uiText("carbsShort") + ' ' + formatGrams(targets.c) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="meal-mini-tracker">' +
          '<span>' + formatKcal(totals.kcal) + ' / ' + formatKcal(targets.kcal) + '</span>' +
          '<span>' + uiText("proteinShort") + ' ' + formatGrams(totals.p) + ' / ' + formatGrams(targets.p) + '</span>' +
          '<span>' + uiText("fatsShort") + ' ' + formatGrams(totals.f) + ' / ' + formatGrams(targets.f) + '</span>' +
          '<span>' + uiText("carbsShort") + ' ' + formatGrams(totals.c) + ' / ' + formatGrams(targets.c) + '</span>' +
        '</div>' +
        (view.proteinSectionMarkup || "") +
        (view.carbSectionMarkup || "") +
        (view.extraCarbSectionMarkup || "") +
        (view.fatSectionMarkup || "") +
      '</div>'
    );
  }

  function buildMealConstructorMarkup(view, formatters) {
    const formatKcal = getFormatter(formatters, "formatKcal");
    const formatGrams = getFormatter(formatters, "formatGrams");
    const formatLiters = getFormatter(formatters, "formatLiters");
    const activeTargets = view.activeTargets;
    const activeDay = view.activeDay;

    return (
      '<div class="final-nutrition-result">' +
        '<h3 class="result-title">' + uiText("mealConstructor") + '</h3>' +
        (view.menuTemplateToolsMarkup || "") +
        (view.macroTrackerMarkup || "") +
        '<div class="result-grid compact-top-grid">' +
          '<div class="result-item"><span class="result-item-label">' + uiText("calories") + uiText("daySuffix") + '</span><span class="result-item-value">' + formatKcal(activeTargets.calories) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("protein") + uiText("daySuffix") + '</span><span class="result-item-value">' + formatGrams(activeTargets.protein) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("fats") + uiText("daySuffix") + '</span><span class="result-item-value">' + formatGrams(activeTargets.fat) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("carbs") + uiText("daySuffix") + '</span><span class="result-item-value">' + formatGrams(activeTargets.carbs) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("water") + '</span><span class="result-item-value">' + formatLiters(activeTargets.waterLiters) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("salt") + '</span><span class="result-item-value">' + formatGrams(activeTargets.saltGrams) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("mealsWithChoices") + '</span><span class="result-item-value">' + view.filledMealsCount + ' / ' + view.mealsCount + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("context") + '</span><span class="result-item-value">' + escapeHtml(translateText(activeTargets.loadContextLabel || "Стабільний день")) + '</span></div>' +
        '</div>' +
        buildNutritionLogicLineMarkup() +
        buildFoodWeightNoteMarkup() +
        buildMealVolumeNoteMarkup(activeTargets) +
        buildActiveCorrectionMarkup(activeTargets) +
        (view.accuracyMarkup || "") +
        (view.electrolyteMarkup || "") +
        (view.phaseMarkup || "") +
        '<div class="meal-constructor-grid compact-meal-grid">' +
          (view.mealCardsMarkup || "") +
        '</div>' +
        '<div class="result-title compact-subtitle">' + uiText("mealSummaryTitle") + '</div>' +
        '<div class="auto-meal-grid compact-summary-grid">' +
          (view.selectedMealsMarkup || "") +
        '</div>' +
        '<div class="builder-actions">' +
          '<button type="button" class="builder-main-btn secondary" data-action="back-constructor">' + uiText("back") + '</button>' +
        '</div>' +
      '</div>'
    );
  }

  function buildPhaseRecommendationMarkup(targets, formatters) {
    const formatKcal = getFormatter(formatters, "formatKcal");
    const formatGrams = getFormatter(formatters, "formatGrams");

    if (!targets || targets.programPhase !== "progression") {
      return (
        '<div class="phase-recommendation-card">' +
          '<h4>Етап адаптації</h4>' +
          '<p>Перші 4 тижні не змінюйте розрахований раціон. Організму потрібен час, щоб адаптуватися до навантаження, режиму харчування та відновлення.</p>' +
        '</div>'
      );
    }

    let nextCalories = targets.calories;
    const nextProtein = targets.protein;
    let nextFat = targets.fat;
    let nextCarbs = targets.carbs;
    const title = "Рекомендація після адаптації";
    let text = "";

    if (targets.goal === "cut") {
      nextCarbs = Math.max(0, +(targets.carbs - 15).toFixed(1));
      nextFat = +(targets.fat + 5).toFixed(1);
      nextCalories = Math.round(nextProtein * 4 + nextFat * 9 + nextCarbs * 4);

      const kcalDiff =
        (nextCarbs - targets.carbs) * 4 +
        (nextFat - targets.fat) * 9;

      if (kcalDiff > 0) {
        nextFat = +(targets.fat + 4).toFixed(1);
      }

      text = "Після 4 тижнів можна поступово зменшити вуглеводи та частково додати жири. Це допомагає краще контролювати апетит і зробити раціон комфортнішим без різких змін.";
    } else if (targets.goal === "gain") {
      const week = targets.progressWeek || 1;
      const mealAdd = week * 10;
      const totalAdd = mealAdd * 3;

      return (
        '<div class="phase-recommendation-card">' +
          '<h4>Тиждень прогресії: ' + week + '</h4>' +
          '<p>Після адаптації вуглеводи додаються поступово. Кожен новий тиждень додає ще +10 г до кожного основного прийому їжі.</p>' +
          '<div class="phase-recommendation-grid">' +
            '<div class="result-item"><span class="result-item-label">Додано за день</span><span class="result-item-value">+' + totalAdd + ' г</span></div>' +
            '<div class="result-item"><span class="result-item-label">Сніданок</span><span class="result-item-value">+' + mealAdd + ' г</span></div>' +
            '<div class="result-item"><span class="result-item-label">Обід</span><span class="result-item-value">+' + mealAdd + ' г</span></div>' +
            '<div class="result-item"><span class="result-item-label">Вечеря</span><span class="result-item-value">+' + mealAdd + ' г</span></div>' +
            '<div class="result-item"><span class="result-item-label">Поточні калорії</span><span class="result-item-value">' + formatKcal(targets.calories) + '</span></div>' +
            '<div class="result-item"><span class="result-item-label">Поточні вуглеводи</span><span class="result-item-value">' + formatGrams(targets.carbs) + '</span></div>' +
          '</div>' +
          '<div class="builder-note">1 тиждень: +10 / +10 / +10. 2 тиждень: +20 / +20 / +20. 3 тиждень: +30 / +30 / +30. 4 тиждень: +40 / +40 / +40.</div>' +
        '</div>'
      );
    } else {
      nextCarbs = Math.max(0, +(targets.carbs - 10).toFixed(1));
      nextFat = +(targets.fat + 5).toFixed(1);
      nextCalories = Math.round(nextProtein * 4 + nextFat * 9 + nextCarbs * 4);
      text = "Після адаптації можна трохи змістити акцент із вуглеводів у сторону жирів, якщо так легше тримати ситість, самопочуття та стабільний режим.";
    }

    return (
      '<div class="phase-recommendation-card">' +
        '<h4>' + title + '</h4>' +
        '<p>' + text + '</p>' +
        '<div class="phase-recommendation-grid">' +
          '<div class="result-item"><span class="result-item-label">Зараз калорії</span><span class="result-item-value">' + formatKcal(targets.calories) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Наступний крок</span><span class="result-item-value">' + formatKcal(nextCalories) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Зараз вуглеводи</span><span class="result-item-value">' + formatGrams(targets.carbs) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Наступний крок</span><span class="result-item-value">' + formatGrams(nextCarbs) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Зараз жири</span><span class="result-item-value">' + formatGrams(targets.fat) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Наступний крок</span><span class="result-item-value">' + formatGrams(nextFat) + '</span></div>' +
        '</div>' +
        '<div class="builder-note">Корекцію варто робити не частіше ніж раз на 7-10 днів, якщо вага, самопочуття та тренування йдуть у потрібному напрямку.</div>' +
      '</div>'
    );
  }

  function buildFinalNutritionMarkup(title, targets, plan, formatters) {
    const formatKcal = getFormatter(formatters, "formatKcal");
    const formatGrams = getFormatter(formatters, "formatGrams");
    const formatLiters = getFormatter(formatters, "formatLiters");

    return (
      '<div class="final-nutrition-result">' +
        '<h3 class="result-title">' + escapeHtml(translateText(title)) + '</h3>' +
        '<div class="result-grid">' +
          '<div class="result-item"><span class="result-item-label">' + uiText("calories") + '</span><span class="result-item-value">' + formatKcal(plan.totals.kcal) + ' / ' + formatKcal(targets.calories) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("protein") + '</span><span class="result-item-value">' + formatGrams(plan.totals.p) + ' / ' + formatGrams(targets.protein) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("fats") + '</span><span class="result-item-value">' + formatGrams(plan.totals.f) + ' / ' + formatGrams(targets.fat) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("carbs") + '</span><span class="result-item-value">' + formatGrams(plan.totals.c) + ' / ' + formatGrams(targets.carbs) + '</span></div>' +
        '</div>' +
        buildNutritionLogicLineMarkup() +
        buildFoodWeightNoteMarkup() +
        buildMealVolumeNoteMarkup(targets) +
        buildActiveCorrectionMarkup(targets) +
        '<div class="result-grid">' +
          '<div class="result-item"><span class="result-item-label">' + uiText("water") + '</span><span class="result-item-value">' + formatLiters(targets.waterLiters) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("salt") + '</span><span class="result-item-value">' + formatGrams(targets.saltGrams) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("meals") + '</span><span class="result-item-value">' + targets.mealsCount + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">' + uiText("context") + '</span><span class="result-item-value">' + escapeHtml(translateText(targets.loadContextLabel || "Стабільний день")) + '</span></div>' +
        '</div>' +
        buildElectrolyteNoteMarkup(targets) +
        buildPhaseRecommendationMarkup(targets, formatters) +
        '<div class="auto-meal-grid">' +
          plan.meals.map(function (meal) {
            return buildMealCardMarkup(meal, formatters);
          }).join("") +
        '</div>' +
        '<div class="builder-actions">' +
          '<button type="button" class="builder-main-btn secondary" data-action="back-constructor">' + uiText("back") + '</button>' +
        '</div>' +
      '</div>'
    );
  }

  function buildNutritionAccuracyMarkup(targets, totals, formatters) {
    const formatKcal = getFormatter(formatters, "formatKcal");
    const formatGrams = getFormatter(formatters, "formatGrams");
    const status = nutrition.getNutritionAccuracyStatus
      ? nutrition.getNutritionAccuracyStatus(targets, totals)
      : { tone: "alert", title: "Потрібна перевірка", text: "Модуль харчування не завантажений." };
    const signed = nutrition.formatSignedNutritionValue || function (value, formatter) {
      const rounded = Math.round(value);
      if (rounded === 0) return formatter(0);
      return (rounded > 0 ? "+" : "") + formatter(rounded);
    };
    const kcalDiff = totals.kcal - targets.calories;
    const proteinDiff = totals.p - targets.protein;
    const fatDiff = totals.f - targets.fat;
    const carbsDiff = totals.c - targets.carbs;
    const adjustment = kcalDiff > 0
      ? "Щоб зменшити перебір: прибери 10-15 г олії/горіхів або 30-50 г готового гарніру."
      : "Щоб закрити недобір: додай 100-150 г готового гарніру, фрукт або 20-30 г протеїну за потреби.";

    return (
      '<div class="nutrition-accuracy-card nutrition-accuracy-' + status.tone + '">' +
        '<div class="nutrition-accuracy-head">' +
          '<div>' +
            '<span class="section-label">Точність ручного раціону</span>' +
            '<h4>' + status.title + '</h4>' +
            '<p>' + status.text + '</p>' +
          '</div>' +
          '<strong>' + signed(kcalDiff, formatKcal) + '</strong>' +
        '</div>' +
        '<div class="nutrition-delta-grid">' +
          '<div class="nutrition-delta-item"><span>Калорії</span><strong>' + formatKcal(totals.kcal) + ' / ' + formatKcal(targets.calories) + '</strong><small>' + signed(kcalDiff, formatKcal) + '</small></div>' +
          '<div class="nutrition-delta-item"><span>Білки</span><strong>' + formatGrams(totals.p) + ' / ' + formatGrams(targets.protein) + '</strong><small>' + signed(proteinDiff, formatGrams) + '</small></div>' +
          '<div class="nutrition-delta-item"><span>Жири</span><strong>' + formatGrams(totals.f) + ' / ' + formatGrams(targets.fat) + '</strong><small>' + signed(fatDiff, formatGrams) + '</small></div>' +
          '<div class="nutrition-delta-item"><span>Вуглеводи</span><strong>' + formatGrams(totals.c) + ' / ' + formatGrams(targets.carbs) + '</strong><small>' + signed(carbsDiff, formatGrams) + '</small></div>' +
        '</div>' +
        '<div class="builder-note">' + adjustment + '</div>' +
      '</div>'
    );
  }

  function buildElectrolyteNoteMarkup(targets) {
    const protocol = targets && targets.hydrationProtocol ? targets.hydrationProtocol : null;
    const protocolWater = protocol ? protocol.waterLiters + " " + unitLabel("л") : "";
    const protocolSalt = protocol ? protocol.saltGrams + " " + unitLabel("г") : "";

    return (
      '<div class="electrolyte-note">' +
        '<h4>' + escapeHtml(protocol ? translateText(protocol.title) : uiText("electrolyteDefaultTitle")) + '</h4>' +
        '<p>' + escapeHtml(protocol ? translateText(protocol.text) : uiText("electrolyteDefaultText")) + '</p>' +
        (protocol ? '<div class="phase-recommendation-grid"><div class="result-item"><span class="result-item-label">' + uiText("water") + '</span><span class="result-item-value">' + protocolWater + '</span></div><div class="result-item"><span class="result-item-label">' + uiText("salt") + '</span><span class="result-item-value">' + protocolSalt + '</span></div></div>' : "") +
        (protocol ? '<div class="builder-note">' + escapeHtml(translateText(protocol.timing)) + '</div>' : "") +
        (protocol ? '<div class="builder-note">' + escapeHtml(translateText(protocol.minerals)) + '</div>' : "") +
        '<div class="builder-note">' + uiText("electrolyteMedicalNote") + '</div>' +
      '</div>'
    );
  }

  function buildSelectedMealMarkup(meal, formatters) {
    const formatKcal = getFormatter(formatters, "formatKcal");
    const formatGrams = getFormatter(formatters, "formatGrams");

    if (!meal.items.length) {
      return (
        '<div class="selected-day-card">' +
          '<h5>' + escapeHtml(translateText(meal.mealName)) + '</h5>' +
          '<div class="builder-note">' + uiText("nothingMeal") + '</div>' +
        '</div>'
      );
    }

    return (
      '<div class="selected-day-card">' +
        '<h5>' + escapeHtml(translateText(meal.mealName)) + '</h5>' +
        '<div class="selected-day-items">' +
          meal.items.map(function (item) {
            return (
              '<div class="selected-day-item">' +
                '<strong>' + escapeHtml(translateText(item.name)) + '</strong> - ' +
                item.amount + ' ' + unitLabel(item.unitLabel) +
              '</div>'
            );
          }).join("") +
        '</div>' +
        '<div class="meal-summary">' + mealSummaryMarkup(meal.totals, formatKcal, formatGrams) + '</div>' +
      '</div>'
    );
  }

  system.nutritionRender = {
    escapeHtml: escapeHtml,
    buildMealCardMarkup: buildMealCardMarkup,
    buildSelectedSummaryMarkup: buildSelectedSummaryMarkup,
    buildProductsListMarkup: buildProductsListMarkup,
    buildCustomProductToolsMarkup: buildCustomProductToolsMarkup,
    buildMenuTemplateToolsMarkup: buildMenuTemplateToolsMarkup,
    buildBuilderErrorMarkup: buildBuilderErrorMarkup,
    buildChoiceChipMarkup: buildChoiceChipMarkup,
    buildChoiceSectionMarkup: buildChoiceSectionMarkup,
    buildManualBuilderMarkup: buildManualBuilderMarkup,
    buildNutritionConstructorMarkup: buildNutritionConstructorMarkup,
    buildMacroTrackerMarkup: buildMacroTrackerMarkup,
    buildMealChoiceCard: buildMealChoiceCard,
    buildMealConstructorMarkup: buildMealConstructorMarkup,
    buildFinalNutritionMarkup: buildFinalNutritionMarkup,
    buildNutritionAccuracyMarkup: buildNutritionAccuracyMarkup,
    buildElectrolyteNoteMarkup: buildElectrolyteNoteMarkup,
    buildPhaseRecommendationMarkup: buildPhaseRecommendationMarkup,
    buildSelectedMealMarkup: buildSelectedMealMarkup
  };

  window.VitalRiseSystem = system;
})();
