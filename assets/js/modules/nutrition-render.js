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

  function buildNutritionLogicLineMarkup() {
    return (
      '<div class="nutrition-logic-line">' +
        'Логіка VitalRise: білок — база, жири — стабільність, вуглеводи — головний важіль цілі.' +
      '</div>'
    );
  }

  function buildFoodWeightNoteMarkup() {
    return (
      '<div class="builder-note">' +
        'Вага продуктів: рис, гречка, картопля, макарони, м’ясо та риба рахуються у готовому вигляді; вівсянка та інші сухі сипучі продукти — у сухому вигляді.' +
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
        '<h4 class="auto-meal-title">' + meal.mealName + '</h4>' +
        '<div class="auto-meal-foods">' +
          meal.items.map(function (item) {
            return (
              '<div class="auto-food-item">' +
                '<strong>' + escapeHtml(item.name) + '</strong> - ' +
                item.amount + ' ' + item.unitLabel +
              '</div>'
            );
          }).join("") +
        '</div>' +
        '<div class="meal-summary">' +
          'Б: ' + formatGrams(meal.totals.p) + ' | ' +
          'Ж: ' + formatGrams(meal.totals.f) + ' | ' +
          'В: ' + formatGrams(meal.totals.c) + ' | ' +
          formatKcal(meal.totals.kcal) +
        '</div>' +
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
              '<h4 class="selected-title">' + group.title + '</h4>' +
              (
                ids.length
                  ? '<div class="selected-list">' + ids.map(function (id) {
                      const item = getFoodById(id);
                      return '<div class="selected-item"><span class="selected-name">' + escapeHtml(item ? item.name : id) + '</span></div>';
                    }).join("") + '</div>'
                  : '<div class="builder-note">Нічого не вибрано.</div>'
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
                '<span class="product-item-name">' + escapeHtml(product.name) + '</span>' +
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

  function buildChoiceSectionMarkup(title, category, rows, mealKey, dayType, selectedAmounts) {
    if (!rows.length) {
      return (
        '<div class="meal-choice-section">' +
          '<div class="meal-choice-section-title">' + title + '</div>' +
          '<div class="builder-note">Немає обраних продуктів у цій категорії.</div>' +
        '</div>'
      );
    }

    return (
      '<div class="meal-choice-section">' +
        '<div class="meal-choice-section-title">' + title + '</div>' +
        '<div class="meal-choice-chips">' +
          rows.map(function (row) {
            return buildChoiceChipMarkup(dayType, mealKey, category, row, selectedAmounts);
          }).join("") +
        '</div>' +
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
        '<small>' + (tone === "ok" ? "Норма близько" : (diff > 0 ? "Перебір +" : "Недобір ") + diffText) + '</small>' +
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
          '<span>Контроль норми</span>' +
          '<strong>Оновлюється після кожного вибору</strong>' +
        '</div>' +
        '<div class="macro-live-grid">' +
          buildMacroMeter("Калорії", current.kcal || 0, targets.calories || 0, formatKcal) +
          buildMacroMeter("Білки", current.p || 0, targets.protein || 0, formatGrams) +
          buildMacroMeter("Жири", current.f || 0, targets.fat || 0, formatGrams) +
          buildMacroMeter("Вуглеводи", current.c || 0, targets.carbs || 0, formatGrams) +
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
          '<h4>' + view.mealName + '</h4>' +
          '<div class="meal-choice-targets">' +
            '<span>' + formatKcal(targets.kcal) + '</span>' +
            '<span>Б ' + formatGrams(targets.p) + '</span>' +
            '<span>Ж ' + formatGrams(targets.f) + '</span>' +
            '<span>В ' + formatGrams(targets.c) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="meal-mini-tracker">' +
          '<span>' + formatKcal(totals.kcal) + ' / ' + formatKcal(targets.kcal) + '</span>' +
          '<span>Б ' + formatGrams(totals.p) + ' / ' + formatGrams(targets.p) + '</span>' +
          '<span>Ж ' + formatGrams(totals.f) + ' / ' + formatGrams(targets.f) + '</span>' +
          '<span>В ' + formatGrams(totals.c) + ' / ' + formatGrams(targets.c) + '</span>' +
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
        '<h3 class="result-title">Конструктор раціону</h3>' +
        (view.menuTemplateToolsMarkup || "") +
        (view.macroTrackerMarkup || "") +
        '<div class="result-grid compact-top-grid">' +
          '<div class="result-item"><span class="result-item-label">Калорії / день</span><span class="result-item-value">' + formatKcal(activeTargets.calories) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Білки / день</span><span class="result-item-value">' + formatGrams(activeTargets.protein) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Жири / день</span><span class="result-item-value">' + formatGrams(activeTargets.fat) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Вуглеводи / день</span><span class="result-item-value">' + formatGrams(activeTargets.carbs) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Вода</span><span class="result-item-value">' + formatLiters(activeTargets.waterLiters) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Сіль</span><span class="result-item-value">' + formatGrams(activeTargets.saltGrams) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Прийомів з вибором</span><span class="result-item-value">' + view.filledMealsCount + ' / ' + view.mealsCount + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Контекст</span><span class="result-item-value">' + (activeTargets.loadContextLabel || "Стабільний день") + '</span></div>' +
        '</div>' +
        buildNutritionLogicLineMarkup() +
        buildFoodWeightNoteMarkup() +
        buildActiveCorrectionMarkup(activeTargets) +
        (view.accuracyMarkup || "") +
        (view.electrolyteMarkup || "") +
        (view.phaseMarkup || "") +
        '<div class="meal-constructor-grid compact-meal-grid">' +
          (view.mealCardsMarkup || "") +
        '</div>' +
        '<div class="result-title compact-subtitle">Підсумок по прийомах їжі</div>' +
        '<div class="auto-meal-grid compact-summary-grid">' +
          (view.selectedMealsMarkup || "") +
        '</div>' +
        '<div class="builder-actions">' +
          '<button type="button" class="builder-main-btn secondary" data-action="back-constructor">Назад</button>' +
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
        '<h3 class="result-title">' + title + '</h3>' +
        '<div class="result-grid">' +
          '<div class="result-item"><span class="result-item-label">Калорії</span><span class="result-item-value">' + formatKcal(plan.totals.kcal) + ' / ' + formatKcal(targets.calories) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Білки</span><span class="result-item-value">' + formatGrams(plan.totals.p) + ' / ' + formatGrams(targets.protein) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Жири</span><span class="result-item-value">' + formatGrams(plan.totals.f) + ' / ' + formatGrams(targets.fat) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Вуглеводи</span><span class="result-item-value">' + formatGrams(plan.totals.c) + ' / ' + formatGrams(targets.carbs) + '</span></div>' +
        '</div>' +
        buildNutritionLogicLineMarkup() +
        buildFoodWeightNoteMarkup() +
        buildActiveCorrectionMarkup(targets) +
        '<div class="result-grid">' +
          '<div class="result-item"><span class="result-item-label">Вода</span><span class="result-item-value">' + formatLiters(targets.waterLiters) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Сіль</span><span class="result-item-value">' + formatGrams(targets.saltGrams) + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Прийомів їжі</span><span class="result-item-value">' + targets.mealsCount + '</span></div>' +
          '<div class="result-item"><span class="result-item-label">Контекст</span><span class="result-item-value">' + (targets.loadContextLabel || "Стабільний день") + '</span></div>' +
        '</div>' +
        buildElectrolyteNoteMarkup(targets) +
        buildPhaseRecommendationMarkup(targets, formatters) +
        '<div class="auto-meal-grid">' +
          plan.meals.map(function (meal) {
            return buildMealCardMarkup(meal, formatters);
          }).join("") +
        '</div>' +
        '<div class="builder-actions">' +
          '<button type="button" class="builder-main-btn secondary" data-action="back-constructor">Назад</button>' +
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
    const protocolWater = protocol ? protocol.waterLiters + " л" : "";
    const protocolSalt = protocol ? protocol.saltGrams + " г" : "";

    return (
      '<div class="electrolyte-note">' +
        '<h4>' + (protocol ? protocol.title : "Стабільна вода й електроліти") + '</h4>' +
        '<p>' + (protocol ? protocol.text : "Для силової роботи, суглобів, витривалості, пампу, тиску й самопочуття електроліти мають бути стабільними. На схудненні головний важіль - калорії та вуглеводи, а не різке зменшення солі.") + '</p>' +
        (protocol ? '<div class="phase-recommendation-grid"><div class="result-item"><span class="result-item-label">Вода</span><span class="result-item-value">' + protocolWater + '</span></div><div class="result-item"><span class="result-item-label">Сіль</span><span class="result-item-value">' + protocolSalt + '</span></div></div>' : "") +
        (protocol ? '<div class="builder-note">' + protocol.timing + '</div>' : "") +
        (protocol ? '<div class="builder-note">' + protocol.minerals + '</div>' : "") +
        '<div class="builder-note">Якщо є гіпертонія, хвороби нирок, набряки або рекомендації лікаря — орієнтуйся на медичні призначення, а не на спортивний розрахунок.</div>' +
      '</div>'
    );
  }

  function buildSelectedMealMarkup(meal, formatters) {
    const formatKcal = getFormatter(formatters, "formatKcal");
    const formatGrams = getFormatter(formatters, "formatGrams");

    if (!meal.items.length) {
      return (
        '<div class="selected-day-card">' +
          '<h5>' + meal.mealName + '</h5>' +
          '<div class="builder-note">Ще нічого не вибрано.</div>' +
        '</div>'
      );
    }

    return (
      '<div class="selected-day-card">' +
        '<h5>' + meal.mealName + '</h5>' +
        '<div class="selected-day-items">' +
          meal.items.map(function (item) {
            return (
              '<div class="selected-day-item">' +
                '<strong>' + escapeHtml(item.name) + '</strong> - ' +
                item.amount + ' ' + item.unitLabel +
              '</div>'
            );
          }).join("") +
        '</div>' +
        '<div class="meal-summary">' +
          'Б: ' + formatGrams(meal.totals.p) + ' | ' +
          'Ж: ' + formatGrams(meal.totals.f) + ' | ' +
          'В: ' + formatGrams(meal.totals.c) + ' | ' +
          formatKcal(meal.totals.kcal) +
        '</div>' +
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
