document.addEventListener("DOMContentLoaded", function () {
  const nutritionForm = document.getElementById("nutrition-form");
  const nutritionResult = document.getElementById("nutrition-result");
  const nutritionReset = document.getElementById("nutrition-reset");
  const weightModeToggle = document.getElementById("weight-mode-toggle");
  const weightModeField = document.getElementById("weight-mode");
  const weightModeLabel = document.getElementById("weight-mode-label");

  function syncWeightMode() {
    if (!weightModeToggle || !weightModeField || !weightModeLabel) return;

    const rawMode = weightModeToggle.checked;
    weightModeField.value = rawMode ? "raw" : "ready";
    weightModeLabel.textContent = rawMode ? "Сирий / сухий продукт" : "Готовий продукт";
  }

  if (weightModeToggle) {
    weightModeToggle.addEventListener("change", syncWeightMode);
    syncWeightMode();
  }

  const goalField = document.getElementById("goal");
  const programPhaseField = document.getElementById("program-phase");
  const progressWeekField = document.getElementById("progress-week");
  const progressWeekGroup = document.getElementById("progress-week-group");

  const trainingForm = document.getElementById("training-form");
  const trainingResult = document.getElementById("training-result");
  const trainingReset = document.getElementById("training-reset");
  const trainingPlaceSelector = document.getElementById("training-place");
  const trainingProgramModeField = document.getElementById("training-program-mode");
  const trainingDaysField = document.getElementById("training-days");
  const pplFixedDaysOption = document.getElementById("ppl-fixed-days-option");
  const trainingDaysHint = document.getElementById("training-days-hint");
  const trainingOneRmFields = ["bench-1rm", "squat-1rm", "deadlift-1rm"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  const trainingDiagnosticFields = ["pullups-max", "dips-max", "pushups-max"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  const supplementForm = document.getElementById("supplement-form");
  const supplementResult = document.getElementById("supplement-result");
  const supplementReset = document.getElementById("supplement-reset");

  const labForm = document.getElementById("lab-form");
  const labResult = document.getElementById("lab-result");
  const labReset = document.getElementById("lab-reset");
  const labSexField = document.getElementById("lab-sex");
  const labCycleField = document.getElementById("lab-cycle");
  const labCycleGroup = document.getElementById("lab-cycle-group");
  const labProstateRiskField = document.getElementById("lab-prostate-risk");
  const labProstateRiskGroup = document.getElementById("lab-prostate-risk-group");
  const labReviewForm = document.getElementById("lab-review-form");
  const labReviewResult = document.getElementById("lab-review-result");
  const labReviewReset = document.getElementById("lab-review-reset");
  const reviewSexField = document.getElementById("review-sex");
  const reviewCycleField = document.getElementById("review-cycle");
  const reviewFemaleFields = document.querySelectorAll(".review-female-field");
  const reviewMaleFields = document.querySelectorAll(".review-male-field");

  const progressForm = document.getElementById("progress-form");
  const progressResult = document.getElementById("progress-result");
  const progressReset = document.getElementById("progress-reset");

  const blueprintForm = document.getElementById("blueprint-form");
  const blueprintResult = document.getElementById("blueprint-result");
  const blueprintReset = document.getElementById("blueprint-reset");
  const blueprintPrint = document.getElementById("blueprint-print");
  const clearSavedData = document.getElementById("clear-saved-data");

  function syncProgressWeekVisibility() {
    if (!programPhaseField || !progressWeekGroup) return;

    const isGain = goalField ? goalField.value === "gain" : true;
    const shouldShow = programPhaseField.value === "progression" && isGain;

    progressWeekGroup.style.display = shouldShow ? "flex" : "none";

    if (!shouldShow && progressWeekField) {
      progressWeekField.value = "1";
    }
  }

  if (programPhaseField) {
    programPhaseField.addEventListener("change", syncProgressWeekVisibility);
  }

  if (goalField) {
    goalField.addEventListener("change", syncProgressWeekVisibility);
  }

  syncProgressWeekVisibility();

  function syncLabCycleVisibility() {
    if (!labSexField) return;

    const isFemale = labSexField.value === "female";
    if (labCycleGroup) labCycleGroup.style.display = isFemale ? "flex" : "none";
    if (labProstateRiskGroup) labProstateRiskGroup.style.display = isFemale ? "none" : "flex";

    if (!isFemale && labCycleField) {
      labCycleField.value = "not_applicable";
    }
    if (isFemale && labProstateRiskField) {
      labProstateRiskField.value = "average";
    }
  }

  if (labSexField) {
    labSexField.addEventListener("change", syncLabCycleVisibility);
  }

  syncLabCycleVisibility();

  function syncReviewFemaleFields() {
    if (!reviewSexField) return;

    const isFemale = reviewSexField.value === "female";

    if (reviewCycleField) {
      const cycleGroup = reviewCycleField.closest(".form-group");
      const cycleAllowed = !cycleGroup || cycleGroup.dataset.labReviewVisible !== "false";
      if (cycleGroup) cycleGroup.style.display = isFemale && cycleAllowed ? "flex" : "none";
      if (!isFemale) reviewCycleField.value = "not_applicable";
    }

    reviewFemaleFields.forEach(function (field) {
      const isAllowed = field.dataset.labReviewVisible !== "false";
      field.style.display = isFemale && isAllowed ? "flex" : "none";
      if (!isFemale) {
        const input = field.querySelector("input, select");
        if (input) input.value = "";
      }
    });
  }

  if (reviewSexField) {
    reviewSexField.addEventListener("change", syncReviewFemaleFields);
  }

  syncReviewFemaleFields();

  function syncTrainingOneRmVisibility() {
    if (!trainingPlaceSelector || !trainingOneRmFields.length) return;

    const shouldShow = trainingPlaceSelector.value === "gym";
    const shouldShowDiagnostics = trainingPlaceSelector.value === "outdoor" || trainingPlaceSelector.value === "home";

    trainingOneRmFields.forEach(function (field) {
      const group = field.closest(".form-group");
      if (group) group.style.display = shouldShow ? "flex" : "none";
      if (!shouldShow) field.value = "";
    });

    trainingDiagnosticFields.forEach(function (field) {
      const group = field.closest(".form-group");
      if (group) group.style.display = shouldShowDiagnostics ? "flex" : "none";
      if (!shouldShowDiagnostics) field.value = "";
    });
  }

  if (trainingPlaceSelector) {
    trainingPlaceSelector.addEventListener("change", syncTrainingOneRmVisibility);
  }

  syncTrainingOneRmVisibility();

  function syncTrainingProgramMode() {
    if (!trainingProgramModeField || !trainingDaysField) return;

    const isPpl = trainingProgramModeField.value === "ppl_3_1";
    if (pplFixedDaysOption) { pplFixedDaysOption.hidden = true; pplFixedDaysOption.disabled = true; }
    if (trainingDaysField.value === "8") trainingDaysField.value = "4";
    trainingDaysField.disabled = false;
    if (isPpl) {
      if (trainingDaysHint) {
        trainingDaysHint.textContent = "PPL виконується за обраною кількістю занять на тиждень; черга штовхай / тягни / ноги продовжується між тижнями.";
      }
    } else {
      if (trainingDaysField.value === "8") trainingDaysField.value = "3";
      trainingDaysField.disabled = false;
      if (trainingDaysHint) {
        trainingDaysHint.textContent = "Обери кількість тренувань на тиждень; дні відпочинку плануй між заняттями.";
      }
    }
  }

  if (trainingProgramModeField) {
    trainingProgramModeField.addEventListener("change", syncTrainingProgramMode);
  }

  const persistentForms = [
    nutritionForm,
    trainingForm,
    supplementForm,
    labForm,
    labReviewForm,
    progressForm,
    blueprintForm
  ].filter(Boolean);

  const formResetButtons = [
    { form: nutritionForm, button: nutritionReset },
    { form: trainingForm, button: trainingReset },
    { form: supplementForm, button: supplementReset },
    { form: labForm, button: labReset },
    { form: labReviewForm, button: labReviewReset },
    { form: progressForm, button: progressReset },
    { form: blueprintForm, button: blueprintReset }
  ];

  function getFormStorageKey(form) {
    return "vitalrise:" + form.id + ":values";
  }

  function readFormValues(form) {
    const values = {};

    Array.from(form.elements).forEach(function (field) {
      if (!field.name || field.type === "button" || field.type === "submit") return;

      if (field.type === "checkbox") {
        values[field.name] = field.checked;
        return;
      }

      values[field.name] = field.value;
    });

    return values;
  }

  function writeFormValues(form, values) {
    Array.from(form.elements).forEach(function (field) {
      if (!field.name || !Object.prototype.hasOwnProperty.call(values, field.name)) return;

      if (field.type === "checkbox") {
        field.checked = Boolean(values[field.name]);
        return;
      }

      field.value = values[field.name];
    });
  }

  function saveFormState(form) {
    try {
      window.localStorage.setItem(getFormStorageKey(form), JSON.stringify(readFormValues(form)));
    } catch (error) {
      return false;
    }

    return true;
  }

  function restoreFormState(form) {
    try {
      const saved = window.localStorage.getItem(getFormStorageKey(form));
      if (!saved) return false;

      writeFormValues(form, JSON.parse(saved));
      return true;
    } catch (error) {
      return false;
    }
  }

  function clearFormState(form) {
    try {
      window.localStorage.removeItem(getFormStorageKey(form));
    } catch (error) {
      return false;
    }

    return true;
  }

  function clearAllSavedFormState() {
    persistentForms.forEach(function (form) {
      clearFormState(form);
      form.reset();
    });

    [
      "vitalrise:nutrition:active-correction",
      "vitalrise:nutrition:last-targets",
      "vitalrise:progress:history"
    ].forEach(function (key) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        // Ignore storage failures.
      }
    });

    reviewMaleFields.forEach(function (field) {
      const isAllowed = field.dataset.labReviewVisible !== "false";
      field.style.display = !isFemale && isAllowed ? "flex" : "none";
      if (isFemale) {
        const input = field.querySelector("input, select");
        if (input) input.value = "";
      }
    });

    resetNutritionState();

    if (nutritionResult) {
      nutritionResult.innerHTML =
        '<div class="result-placeholder">Заповни поля та натисни «Розрахувати», щоб перейти до формування раціону.</div>';
    }

    if (trainingResult) {
      trainingResult.innerHTML =
        '<div class="result-placeholder">Обери параметри тренування та натисни «Сформувати план».</div>';
    }

    if (supplementResult) {
      supplementResult.innerHTML =
        '<div class="result-placeholder">Обери параметри, щоб отримати базовий протокол спортпіту.</div>';
    }

    if (labResult) {
      labResult.innerHTML =
        '<div class="result-placeholder">Обери параметри, щоб отримати лабораторну панель для рекомпозиції.</div>';
    }

    if (labReviewResult) {
      labReviewResult.innerHTML =
        '<div class="result-placeholder">Введи показники з бланку, щоб отримати спортивну оцінку ризиків.</div>';
    }

    if (progressResult) {
      progressResult.innerHTML =
        '<div class="result-placeholder">Заповни контрольні дані за 4 тижні, щоб отримати рішення і активну корекцію раціону.</div>';
    }

    if (blueprintResult) {
      blueprintResult.innerHTML =
        '<div class="result-placeholder">Обери стан системи, щоб отримати паспорт пріоритетів.</div>';
    }

    if (blueprintPrint) blueprintPrint.disabled = true;
    syncControlsAfterRestore();
  }

  function updateCalculatorShell() {
    if (window.VitalRiseSystem && window.VitalRiseSystem.calculatorShell) {
      window.VitalRiseSystem.calculatorShell.updateConsole();
    }
  }

  function syncControlsAfterRestore() {
    syncProgressWeekVisibility();
    syncLabCycleVisibility();
    syncReviewFemaleFields();
    syncTrainingOneRmVisibility();
    syncTrainingProgramMode();
    updateCalculatorShell();
  }

  persistentForms.forEach(function (form) {
    restoreFormState(form);

    form.addEventListener("input", function () {
      saveFormState(form);
      updateCalculatorShell();
    });

    form.addEventListener("change", function () {
      saveFormState(form);
      updateCalculatorShell();
    });

    form.addEventListener("submit", function () {
      saveFormState(form);
    });
  });

  formResetButtons.forEach(function (item) {
    if (!item.form || !item.button) return;

    item.button.addEventListener("click", function () {
      clearFormState(item.form);
      window.setTimeout(syncControlsAfterRestore, 0);
    });
  });

  if (clearSavedData) {
    clearSavedData.addEventListener("click", clearAllSavedFormState);
  }

  syncControlsAfterRestore();

  function roundValue(value) {
    return Math.round(value);
  }

  function roundTo2_5(value) {
    return Math.round(value / 2.5) * 2.5;
  }

  function getCurrentLanguage() {
    if (window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function") {
      return window.VitalRiseI18n.getLanguage();
    }
    return (document.documentElement.lang || "uk").toLowerCase();
  }

  function translateInlineText(value) {
    if (window.VitalRiseI18n && typeof window.VitalRiseI18n.translateText === "function") {
      return window.VitalRiseI18n.translateText(value) || value;
    }
    return value;
  }

  function formatKcal(value) {
    return roundValue(value) + (getCurrentLanguage() === "en" ? " kcal" : " ккал");
  }

  function formatGrams(value) {
    return roundValue(value) + (getCurrentLanguage() === "en" ? " g" : " г");
  }

  function formatLiters(value) {
    return Number(value).toFixed(1) + (getCurrentLanguage() === "en" ? " L" : " л");
  }

  function formatWeight(value) {
    const language = getCurrentLanguage();
    if (!value || value <= 0) {
      if (language === "en") return "bodyweight";
      if (language === "ru") return "без веса";
      return "без ваги";
    }
    return roundTo2_5(value) + (language === "en" ? " kg" : " кг");
  }

  function deepClone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  const nutritionModule = window.VitalRiseSystem && window.VitalRiseSystem.nutrition
    ? window.VitalRiseSystem.nutrition
    : null;
  const nutritionRender = window.VitalRiseSystem && window.VitalRiseSystem.nutritionRender
    ? window.VitalRiseSystem.nutritionRender
    : null;
  const nutritionCustom = window.VitalRiseSystem && window.VitalRiseSystem.nutritionCustom
    ? window.VitalRiseSystem.nutritionCustom
    : null;

  function getNutritionFormatters() {
    return {
      formatKcal: formatKcal,
      formatGrams: formatGrams,
      formatLiters: formatLiters
    };
  }

  function getDefaultNutritionSelection() {
    if (nutritionModule) {
      return nutritionModule.getDefaultSelection();
    }

    return {
      protein: ["eggs", "cottage_cheese", "hard_cheese", "chicken", "turkey", "white_fish", "mackerel", "salmon", "tuna", "greek_yogurt", "whey_protein", "skyr", "shrimp", "tofu"],
      carb: ["oatmeal", "banana", "rice", "buckwheat", "potato", "sweet_potato", "bulgur", "quinoa", "berries", "apple", "lentils", "beans"],
      extra_carb: ["whole_bread", "rice_cakes"],
      fat: ["olive_oil", "avocado", "nuts", "peanut_butter", "pumpkin_seeds", "dark_chocolate"],
      vegetable: ["spinach", "broccoli", "cucumber", "tomato", "zucchini", "bell_pepper", "asparagus"]
    };
  }

  /* =========================================================
     НОВИЙ БЛОК ХАРЧУВАННЯ — PROJECT 12.2
     ВСТАВИТИ ЗАМІСТЬ СТАРОГО БЛОКУ ХАРЧУВАННЯ
  ========================================================= */

  const nutritionState = {
  targets: null,
  mode: "manual",
  activeGroup: "protein",
  baseFormData: null,
  activeDayView: "stable",
  builderError: "",
  customMessage: "",
  productsConfirmed: false,
  dayTargets: {
    stable: null
  },
  mealSelections: {
    stable: {}
  },
  foodSearch: "",
  foodFilter: "all",
  favorites: (nutritionCustom && nutritionCustom.getFavorites ? nutritionCustom.getFavorites() : []),
  selected: getDefaultNutritionSelection()
};

  const MEAL_NAMES = nutritionModule
    ? nutritionModule.getMealNames()
    : {};

  function cloneNutrition(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function getNutritionFoodById(id) {
    if (nutritionModule) {
      return nutritionModule.getFoodById(id);
    }

    return null;
  }

  function calculateNutrition(data) {
    if (nutritionModule) {
      return nutritionModule.calculateNutrition(data);
    }

    return null;
  }

  function saveNutritionSnapshot(targets, formData) {
    try {
      window.localStorage.setItem("vitalrise:nutrition:last-targets", JSON.stringify({
        savedAt: new Date().toISOString(),
        formData: formData || {},
        targets: targets || null
      }));
    } catch (error) {
      // Local storage may be unavailable in private or locked-down browsers.
    }
  }

 function resetNutritionState() {
  nutritionState.targets = null;
  nutritionState.mode = "auto";
  nutritionState.activeGroup = "protein";
  nutritionState.baseFormData = null;
  nutritionState.activeDayView = "stable";
  nutritionState.builderError = "";
  nutritionState.customMessage = "";
  nutritionState.productsConfirmed = false;
  nutritionState.dayTargets = {
    stable: null
  };
  nutritionState.mealSelections = {
    stable: {}
  };
 nutritionState.selected = getDefaultNutritionSelection();
}

  function getFoodsByCategory(category) {
    if (nutritionModule) {
      return nutritionModule.getFoodsByCategory(category);
    }

    return [];
  }

  function buildAutoMealPlan(targets) {
  return nutritionModule
    ? nutritionModule.buildAutoMealPlan(targets, nutritionState.selected)
    : { meals: [], totals: { kcal: 0, p: 0, f: 0, c: 0 } };
}

  function buildSelectedSummaryMarkup() {
    const groups = [
  { key: "protein", title: "Обрані білкові продукти" },
  { key: "carb", title: "Обрані гарніри та вуглеводи" },
  { key: "extra_carb", title: "Додаткові вуглеводи" },
  { key: "fat", title: "Обрані додаткові жири" },
  { key: "vegetable", title: "Обрані овочі" }
];

    return nutritionRender
      ? nutritionRender.buildSelectedSummaryMarkup(groups, nutritionState.selected, getNutritionFoodById)
      : "";
  }

  function buildProductsListMarkup(category) {
    const query = nutritionState.foodSearch.trim().toLocaleLowerCase();
    const pool = query ? nutritionModule.getFoods().map(function (food) { return getNutritionFoodById(food.id); }) : getFoodsByCategory(category);
    const products = pool.filter(function (food) {
      const title = window.VitalRiseSystem.nutritionWorkspace ? window.VitalRiseSystem.nutritionWorkspace.foodName(food) : food.name;
      return (!query || [food.name, title, ...(food.aliases || [])].join(" ").toLocaleLowerCase().includes(query)) &&
        (nutritionState.foodFilter !== "favorite" || nutritionState.favorites.includes(food.id)) &&
        (nutritionState.foodFilter !== "mine" || food.id.startsWith("custom_")) &&
        nutritionModule.isFoodAllowedForDiet(food, nutritionState.targets && nutritionState.targets.dietStyle);
    });
    return nutritionRender
      ? nutritionRender.buildProductsListMarkup(category, products, query ? Object.values(nutritionState.selected).flat() : nutritionState.selected[category], nutritionState.favorites)
      : "";
  }

  function updateNutritionMarkup(markup) {
    const active = document.activeElement;
    const focusKey = active && active.dataset ? active.dataset.focusKey : null;
    const selectionStart = active && typeof active.selectionStart === "number" ? active.selectionStart : null;
    const selectionEnd = active && typeof active.selectionEnd === "number" ? active.selectionEnd : null;
    const open = Array.from(nutritionResult.querySelectorAll("details")).map(function (node) {
      return {key:node.dataset.nutritionDisclosure || node.className, open:node.open};
    });
    const drafts = Array.from(nutritionResult.querySelectorAll("input:not(.nutrition-portion-input):not(.nutrition-product-checkbox), textarea, select:not(.meal-choice-select)")).map(function (node) {
      return {id:node.id, name:node.name, value:node.value};
    });
    nutritionResult.innerHTML = markup;
    open.forEach(function (saved) {
      const node = Array.from(nutritionResult.querySelectorAll("details")).find(function (item) { return (item.dataset.nutritionDisclosure || item.className) === saved.key; });
      if (node) node.open = saved.open;
    });
    drafts.forEach(function (draft) {
      const node = Array.from(nutritionResult.querySelectorAll("input, textarea, select")).find(function (item) { return draft.id ? item.id === draft.id : draft.name && item.name === draft.name; });
      if (node) node.value = draft.value;
    });
    if (focusKey) {
      const node = Array.from(nutritionResult.querySelectorAll("[data-focus-key]")).find(function (item) { return item.dataset.focusKey === focusKey; });
      if (node) {
        node.focus({preventScroll:true});
        if (selectionStart !== null && typeof node.setSelectionRange === "function" && ["search","text"].includes(node.type)) node.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  }

  function buildMealCardMarkup(meal) {
    return nutritionRender
      ? nutritionRender.buildMealCardMarkup(meal, getNutritionFormatters())
      : "";
  }

  function buildFinalNutritionMarkup(title, targets, plan) {
    return nutritionRender
      ? nutritionRender.buildFinalNutritionMarkup(title, targets, plan, getNutritionFormatters())
      : "";
  }

  function buildNutritionBuilderErrorMarkup() {
    return nutritionRender ? nutritionRender.buildBuilderErrorMarkup(nutritionState.builderError) : "";
  }

  function buildNutritionCustomToolsMarkup() {
    return nutritionRender && nutritionCustom
      ? nutritionRender.buildCustomProductToolsMarkup({
          customProducts: nutritionCustom.getProducts(),
          templates: nutritionCustom.getTemplates(),
          message: nutritionState.customMessage
        })
      : "";
  }

  function buildNutritionMenuTemplateToolsMarkup() {
    return nutritionRender && nutritionRender.buildMenuTemplateToolsMarkup && nutritionCustom
      ? nutritionRender.buildMenuTemplateToolsMarkup({
          templates: nutritionCustom.getMenuTemplates(),
          message: nutritionState.customMessage
        })
      : "";
  }

function buildManualBuilderMarkup() {
const tabs = [
  { key: "protein", title: "Білки" },
  { key: "carb", title: "Гарніри / вуглеводи" },
  { key: "extra_carb", title: "Додаткові вуглеводи" },
  { key: "fat", title: "Жири" },
  { key: "vegetable", title: "Овочі" }
];

    return nutritionRender
      ? nutritionRender.buildManualBuilderMarkup({
          tabs: tabs,
          activeGroup: nutritionState.activeGroup,
          customToolsMarkup: buildNutritionCustomToolsMarkup(),
          productsMarkup: buildProductsListMarkup(nutritionState.activeGroup),
          selectedSummaryMarkup: buildSelectedSummaryMarkup(),
          errorMarkup: buildNutritionBuilderErrorMarkup(),
          productsConfirmed: nutritionState.productsConfirmed,
          search: nutritionState.foodSearch,
          filter: nutritionState.foodFilter,
          selected: nutritionState.selected
        })
      : "";
  }

  function buildAutoBuilderMarkup() {
    if (!nutritionState.targets) return "";

    const plan = buildAutoMealPlan(nutritionState.targets);
    return buildFinalNutritionMarkup("Автоматично сформований раціон", nutritionState.targets, plan);
  }

  function buildNutritionConstructorMarkup() {
    return nutritionRender
      ? nutritionRender.buildNutritionConstructorMarkup({
          mode: nutritionState.mode,
          manualMarkup: buildManualBuilderMarkup(),
          autoMarkup: buildAutoBuilderMarkup()
        })
      : "";
  }

  function renderNutritionConstructor(targets, baseFormData) {
  nutritionState.targets = cloneNutrition(targets);
  nutritionState.baseFormData = cloneNutrition(baseFormData || {});
  if (nutritionModule && typeof nutritionModule.filterSelectionForDiet === "function") {
    nutritionState.selected = nutritionModule.filterSelectionForDiet(
      nutritionState.selected,
  nutritionState.targets.dietStyle
    );
  }
  nutritionState.mode = "auto";
  nutritionState.activeGroup = "protein";
  nutritionState.builderError = "";
  nutritionState.productsConfirmed = false;
  nutritionState.activeDayView = "stable";

  nutritionState.dayTargets = {
    stable: calculateNutrition(nutritionState.baseFormData)
  };

  nutritionState.mealSelections = {
    stable: buildEmptyMealSelections(nutritionState.dayTargets.stable)
  };

  updateNutritionMarkup(buildNutritionConstructorMarkup());
}

  function rerenderNutritionConstructor() {
    if (!nutritionState.targets) return;
    updateNutritionMarkup(buildNutritionConstructorMarkup());
    nutritionState.customMessage = "";
  }

  function toggleNutritionProduct(groupName, productId, checked) {
    if (!nutritionState.selected[groupName]) return;

    let list = nutritionState.selected[groupName];

  if (checked) {
    if (!list.includes(productId)) list.push(productId);
  } else {
      list = list.filter(function (id) {
        return id !== productId;
      });
    }

  nutritionState.selected[groupName] = list;
  if (!checked) Object.keys(nutritionState.mealSelections).forEach(function (day) {
    Object.keys(nutritionState.mealSelections[day] || {}).forEach(function (meal) { delete ensureMealSelectionCategory(day, meal, groupName)[productId]; });
  });
  nutritionState.builderError = "";
  nutritionState.productsConfirmed = false;
  rerenderNutritionConstructor();
}


function getMealKeysForTargets(targets) {
  return nutritionModule ? nutritionModule.getMealKeysForTargets(targets) : [];
}

function buildEmptyMealSelections(targets) {
  return nutritionModule ? nutritionModule.buildEmptyMealSelections(targets) : {};
}

function getCurrentDayTargets() {
  return nutritionState.dayTargets[nutritionState.activeDayView] || nutritionState.targets;
}

function getMealMacroTargets(targets, mealKey) {
  return nutritionModule ? nutritionModule.getMealMacroTargets(targets, mealKey) : { kcal: 0, p: 0, f: 0, c: 0 };
}

function getBuilderRowsForMeal(category, mealKey, targetValue) {
  const activeTargets = getCurrentDayTargets();
  return nutritionModule
    ? nutritionModule.getBuilderRowsForMeal(
        category,
        mealKey,
        targetValue,
        nutritionState.selected,
        activeTargets ? activeTargets.goal : null,
        activeTargets ? activeTargets.dietStyle : null
      )
    : [];
}

function getMealSelectionValue(dayType, mealKey, category) {
  const daySelections = nutritionState.mealSelections[dayType] || {};
  const mealSelections = daySelections[mealKey] || {};
  const value = mealSelections[category] || {};

  if (typeof value === "string") {
    return { [value]: null };
  }

  if (Array.isArray(value)) {
    return value.reduce(function (result, item) {
      if (typeof item === "string") {
        result[item] = null;
      } else if (item && item.id) {
        result[item.id] = Number(item.amount) || null;
      }
      return result;
    }, {});
  }

  return value && typeof value === "object" ? value : {};
}

function ensureMealSelectionCategory(dayType, mealKey, category) {
  if (!nutritionState.mealSelections[dayType]) {
    nutritionState.mealSelections[dayType] = {};
  }

  if (!nutritionState.mealSelections[dayType][mealKey]) {
    nutritionState.mealSelections[dayType][mealKey] = {
      protein: {},
      carb: {},
      extra_carb: {},
      fat: {},
      vegetable: {}
    };
  }

  const currentValue = nutritionState.mealSelections[dayType][mealKey][category];
  const normalizedValue = getMealSelectionValue(dayType, mealKey, category);

  if (currentValue !== normalizedValue) {
    nutritionState.mealSelections[dayType][mealKey][category] = normalizedValue;
  }

  return nutritionState.mealSelections[dayType][mealKey][category];
}

function setMealSelectionValue(dayType, mealKey, category, foodId, amount) {
  const categorySelections = ensureMealSelectionCategory(dayType, mealKey, category);
  if (Object.prototype.hasOwnProperty.call(categorySelections, foodId)) delete categorySelections[foodId];
  else categorySelections[foodId] = Number(amount) || null;
}

function replaceMealSelectionValue(dayType, mealKey, category, foodId, amount) {
  if (!foodId) return;
  const categorySelections = ensureMealSelectionCategory(dayType, mealKey, category);
  if (!Object.prototype.hasOwnProperty.call(categorySelections, foodId)) categorySelections[foodId] = Number(amount) || null;
}

function adjustMealSelectionAmount(dayType, mealKey, category, foodId, direction) {
  const categorySelections = ensureMealSelectionCategory(dayType, mealKey, category);
  const food = getNutritionFoodById(foodId);
  if (!food) return;

  const currentAmount = Number(categorySelections[foodId]) || Number(food.defaultAmount) || Number(food.min) || 100;
  const step = Number(food.portionStep) || 10;
  const nextAmount = currentAmount + (direction === "decrease" ? -step : step);
  const normalizedAmount = nutritionModule && nutritionModule.normalizeManualPortion
    ? nutritionModule.normalizeManualPortion(food, Math.max(food.unitType === "piece" ? 1 : 0.1, nextAmount))
    : nextAmount;

  categorySelections[foodId] = normalizedAmount;
}

function buildChoiceSectionMarkup(title, category, rows, mealKey, dayType) {
  const selectedAmounts = getMealSelectionValue(dayType, mealKey, category);
  return nutritionRender
    ? nutritionRender.buildChoiceSectionMarkup(title, category, rows, mealKey, dayType, selectedAmounts)
    : "";
}

function buildMealChoiceCard(mealKey, targets, dayType, mealSummary) {
  const macroTargets = getMealMacroTargets(targets, mealKey);
  return nutritionRender
    ? nutritionRender.buildMealChoiceCard({
        mealName: MEAL_NAMES[mealKey],
        mealKey: mealKey,
        hasItems: !!(mealSummary && mealSummary.items.length),
        adherenceMarkup: nutritionRender.buildAdherenceMealMarkup ? nutritionRender.buildAdherenceMealMarkup(mealSummary, targets.weightMode) : "",
        macroTargets: macroTargets,
        mealTotals: mealSummary ? mealSummary.totals : { kcal: 0, p: 0, f: 0, c: 0 },
        proteinSectionMarkup: buildChoiceSectionMarkup(
          "Білки",
          "protein",
          getBuilderRowsForMeal("protein", mealKey, macroTargets.p),
          mealKey,
          dayType
        ),
        carbSectionMarkup: buildChoiceSectionMarkup(
          "Вуглеводи",
          "carb",
          getBuilderRowsForMeal("carb", mealKey, macroTargets.c),
          mealKey,
          dayType
        ),
        extraCarbSectionMarkup: buildChoiceSectionMarkup(
          "Додаткові вуглеводи",
          "extra_carb",
          getBuilderRowsForMeal("extra_carb", mealKey, Math.max(12, macroTargets.c * 0.35)),
          mealKey,
          dayType
        ),
        vegetableSectionMarkup: buildChoiceSectionMarkup(
          "Овочі", "vegetable", getBuilderRowsForMeal("vegetable", mealKey, 100), mealKey, dayType
        ),
        fatSectionMarkup: buildChoiceSectionMarkup(
          "Жири",
          "fat",
          getBuilderRowsForMeal("fat", mealKey, macroTargets.f),
          mealKey,
          dayType
        )
      }, getNutritionFormatters())
    : "";
}

function rebalanceSelectedMealsToTargets(meals, targets) {
  return nutritionModule ? nutritionModule.rebalanceSelectedMealsToTargets(meals, targets) : meals;
}

function buildSelectedDaySummary(targets, dayType) {
  const selections = nutritionState.mealSelections[dayType] || {};
  return nutritionModule
    ? nutritionModule.buildSelectedDaySummary(targets, selections, nutritionState.selected)
    : { meals: [], totals: { kcal: 0, p: 0, f: 0, c: 0 } };
}

function buildNutritionAccuracyMarkup(targets, totals) {
  return nutritionRender
    ? nutritionRender.buildNutritionAccuracyMarkup(targets, totals, getNutritionFormatters())
    : "";
}

function buildElectrolyteNoteMarkup(targets) {
  return nutritionRender ? nutritionRender.buildElectrolyteNoteMarkup(targets) : "";
}

function buildPhaseRecommendationMarkup(targets) {
  return nutritionRender
    ? nutritionRender.buildPhaseRecommendationMarkup(targets, getNutritionFormatters())
    : "";
}

function buildSelectedMealMarkup(meal) {
  return nutritionRender
    ? nutritionRender.buildSelectedMealMarkup(meal, getNutritionFormatters())
    : "";
}

function buildMealConstructorMarkup(targets) {
  const activeDay = nutritionState.activeDayView;
  const activeTargets = nutritionState.dayTargets[activeDay] || targets;
  const mealKeys = getMealKeysForTargets(activeTargets);
  const summary = buildSelectedDaySummary(activeTargets, activeDay);

  const filledMealsCount = summary.meals.filter(function (meal) {
    return meal.items.length > 0;
  }).length;
  const mealSummaryByKey = summary.meals.reduce(function (result, meal) {
    result[meal.mealKey] = meal;
    return result;
  }, {});

  return nutritionRender
    ? nutritionRender.buildMealConstructorMarkup({
        activeDay: activeDay,
        activeTargets: activeTargets,
        filledMealsCount: filledMealsCount,
        mealsCount: mealKeys.length,
        menuTemplateToolsMarkup: buildNutritionMenuTemplateToolsMarkup(),
        shoppingMarkup: nutritionRender.buildShoppingListMarkup ? nutritionRender.buildShoppingListMarkup(summary.meals) : "",
        macroTrackerMarkup: nutritionRender.buildMacroTrackerMarkup
          ? nutritionRender.buildMacroTrackerMarkup(activeTargets, summary.totals, getNutritionFormatters())
          : "",
        reviewMarkup: nutritionRender.buildPlanReviewMarkup ? nutritionRender.buildPlanReviewMarkup(activeTargets, summary) : "",
        adherenceMarkup: nutritionRender.buildAdherenceSummaryMarkup ? nutritionRender.buildAdherenceSummaryMarkup(summary.meals, activeTargets.weightMode) : "",
        accuracyMarkup: buildNutritionAccuracyMarkup(activeTargets, summary.totals),
        electrolyteMarkup: buildElectrolyteNoteMarkup(activeTargets),
        phaseMarkup: buildPhaseRecommendationMarkup(activeTargets),
        mealCardsMarkup: mealKeys.map(function (mealKey) {
          return buildMealChoiceCard(mealKey, activeTargets, activeDay, mealSummaryByKey[mealKey]);
        }).join(""),
        selectedMealsMarkup: summary.meals.map(function (meal) {
          return buildSelectedMealMarkup(meal);
        }).join("")
      }, getNutritionFormatters())
    : "";
}

 function buildManualNutritionPlan() {
  const targets = nutritionState.targets;
  if (!targets) return;

  if (!Object.values(nutritionState.selected).some(function (ids) { return ids.length; })) {
    nutritionState.builderError = "Обери хоча б один продукт для раціону.";
    rerenderNutritionConstructor();
    return;
  }

  nutritionState.builderError = "";
  updateNutritionMarkup(buildMealConstructorMarkup(targets));
}

  function backToNutritionConstructor() {
    rerenderNutritionConstructor();
  }

  function addNutritionCustomProduct(form) {
    if (!nutritionCustom || !form) return;

    const data = Object.fromEntries(new FormData(form).entries());
    const product = nutritionCustom.addProduct(data);

    if (!product) {
      nutritionState.customMessage = "Вкажи назву продукту та макроси на 100 г.";
      rerenderNutritionConstructor();
      return;
    }

    if (!nutritionState.selected[product.category]) nutritionState.selected[product.category] = [];
    if (!nutritionState.selected[product.category].includes(product.id)) {
      nutritionState.selected[product.category].push(product.id);
    }

    nutritionState.activeGroup = product.category;
    nutritionState.customMessage = "Додано: " + product.name;
    rerenderNutritionConstructor();
  }

  function importNutritionProducts() {
    if (!nutritionCustom) return;

    const field = nutritionResult ? nutritionResult.querySelector("#nutrition-products-json") : null;
    if (!field) return;

    try {
      const count = nutritionCustom.importProducts(JSON.parse(field.value || "{}"));
      nutritionState.customMessage = count ? "Імпортовано продуктів: " + count : "У JSON не знайдено продуктів.";
    } catch (error) {
      nutritionState.customMessage = "JSON імпорту має бути валідним.";
    }

    rerenderNutritionConstructor();
  }

  function deleteNutritionCustomProduct(id) {
    if (!nutritionCustom || !id) return;

    const product = getNutritionFoodById(id);
    nutritionCustom.deleteProduct(id);

    Object.keys(nutritionState.selected).forEach(function (group) {
      nutritionState.selected[group] = (nutritionState.selected[group] || []).filter(function (itemId) {
        return itemId !== id;
      });
    });

    Object.keys(nutritionState.mealSelections).forEach(function (dayType) {
      Object.keys(nutritionState.mealSelections[dayType] || {}).forEach(function (mealKey) {
        Object.keys(nutritionState.mealSelections[dayType][mealKey] || {}).forEach(function (category) {
          const categorySelections = getMealSelectionValue(dayType, mealKey, category);
          if (Object.prototype.hasOwnProperty.call(categorySelections, id)) {
            delete categorySelections[id];
            nutritionState.mealSelections[dayType][mealKey][category] = categorySelections;
          }
        });
      });
    });

    nutritionState.customMessage = "Видалено: " + (product ? product.name : id);
    rerenderNutritionConstructor();
  }

  function saveNutritionTemplate() {
    if (!nutritionCustom) return;

    const field = nutritionResult ? nutritionResult.querySelector("#nutrition-template-name") : null;
    const name = field ? field.value : "";
    const label = nutritionCustom.saveTemplate(name, cloneNutrition(nutritionState.selected));
    nutritionState.customMessage = label ? "Шаблон збережено: " + label : window.VitalRiseSystem.nutritionWorkspace.t("storageError");
    rerenderNutritionConstructor();
  }

  function loadNutritionTemplate() {
    if (!nutritionCustom) return;

    const field = nutritionResult ? nutritionResult.querySelector("#nutrition-template-select") : null;
    const name = field ? field.value : "";
    const template = nutritionCustom.getTemplates().find(function (item) {
      return item.name === name;
    });

    if (!template) {
      nutritionState.customMessage = "Обери шаблон для завантаження.";
      rerenderNutritionConstructor();
      return;
    }

    nutritionState.selected = cloneNutrition(template.selected);
    nutritionState.customMessage = "Завантажено шаблон: " + template.name;
    rerenderNutritionConstructor();
  }

  function saveNutritionMenuTemplate() {
    if (!nutritionCustom) return;

    const field = nutritionResult ? nutritionResult.querySelector("#nutrition-menu-template-name") : null;
    const name = field ? field.value : "";
    const label = nutritionCustom.saveMenuTemplate(name, {
      selected: cloneNutrition(nutritionState.selected),
      mealSelections: cloneNutrition(nutritionState.mealSelections),
      activeDayView: nutritionState.activeDayView,
      weightMode: getCurrentDayTargets().weightMode
    });

    nutritionState.customMessage = label ? "Меню збережено: " + label : window.VitalRiseSystem.nutritionWorkspace.t("storageError");
    updateNutritionMarkup(buildMealConstructorMarkup(getCurrentDayTargets()));
  }

  function loadNutritionMenuTemplate() {
    if (!nutritionCustom) return;

    const field = nutritionResult ? nutritionResult.querySelector("#nutrition-menu-template-select") : null;
    const name = field ? field.value : "";
    const template = nutritionCustom.getMenuTemplates().find(function (item) {
      return item.name === name;
    });

    if (!template) {
      nutritionState.customMessage = "Обери готове меню для завантаження.";
      updateNutritionMarkup(buildMealConstructorMarkup(getCurrentDayTargets()));
      return;
    }

    if (template.weightMode && template.weightMode !== getCurrentDayTargets().weightMode) {
      nutritionState.baseFormData["weight-mode"] = template.weightMode;
      nutritionState.dayTargets.stable = calculateNutrition(nutritionState.baseFormData);
      nutritionState.targets = nutritionState.dayTargets.stable;
      if (weightModeToggle) weightModeToggle.checked = template.weightMode === "raw";
      syncWeightMode();
    }
    nutritionState.selected = cloneNutrition(template.selected || nutritionState.selected);
    nutritionState.mealSelections = cloneNutrition(template.mealSelections || nutritionState.mealSelections);
    if (!nutritionState.mealSelections.stable) {
      nutritionState.mealSelections.stable =
        nutritionState.mealSelections[template.activeDayView] ||
        nutritionState.mealSelections.training ||
        nutritionState.mealSelections.rest ||
        buildEmptyMealSelections(getCurrentDayTargets());
    }
    nutritionState.activeDayView = "stable";
    nutritionState.customMessage = "Завантажено меню: " + template.name;
    updateNutritionMarkup(buildMealConstructorMarkup(getCurrentDayTargets()));
  }

  if (nutritionForm) {
    nutritionForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(nutritionForm);
      const data = Object.fromEntries(formData.entries());
      const result = calculateNutrition(data);

      if (!result) {
        nutritionResult.innerHTML =
          '<div class="result-placeholder">Щоб отримати точний розрахунок, заповни всі основні поля.</div>';
        return;
      }

     saveNutritionSnapshot(result, data);
     renderNutritionConstructor(result, data);
    });
  }

  if (nutritionReset) {
    nutritionReset.addEventListener("click", function () {
      nutritionForm.reset();
      syncWeightMode();
      resetNutritionState();

      nutritionResult.innerHTML =
        '<div class="result-placeholder">Заповни поля та натисни «Розрахувати», щоб перейти до формування раціону.</div>';
    });
  }

 if (nutritionResult) {
  nutritionResult.addEventListener("input", function (event) {
    if (event.target.id === "nutrition-food-search") {
      nutritionState.foodSearch = event.target.value;
      const list = nutritionResult.querySelector("[data-nutrition-products]");
      if (list) list.innerHTML = buildProductsListMarkup(nutritionState.activeGroup);
    }
  });
  nutritionResult.addEventListener("change", function (event) {
    const field = event.target.closest('[data-nutrition-eaten]');
    if (!field) return;
    const targets = getCurrentDayTargets();
    const editing = !!nutritionResult.querySelector('.meal-constructor-grid');
    const plan = editing ? buildSelectedDaySummary(targets, nutritionState.activeDayView) : buildAutoMealPlan(targets);
    const meal = plan.meals.find(function (item) { return item.mealKey === field.dataset.nutritionEaten; });
    const saved = window.VitalRiseSystem.nutritionWorkspace.saveAdherence(meal, targets.weightMode, field.checked);
    if (!saved) { field.checked = !field.checked; field.closest('label').title = window.VitalRiseSystem.nutritionWorkspace.t('storageError'); return; }
    const node = nutritionResult.querySelector('.nw-adherence-summary');
    if (node) node.outerHTML = nutritionRender.buildAdherenceSummaryMarkup(plan.meals, targets.weightMode);
  });
  nutritionResult.addEventListener("submit", function (event) {
    if (event.target && event.target.id === "nutrition-custom-product-form") {
      event.preventDefault();
      addNutritionCustomProduct(event.target);
    }
  });

  nutritionResult.addEventListener("click", function (event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;

    if (action === 'use-generated-menu') {
      const targets = getCurrentDayTargets();
      const plan = buildAutoMealPlan(targets);
      const selections = buildEmptyMealSelections(targets);
      plan.meals.forEach(function (meal) {
        meal.items.forEach(function (item) {
          const food = getNutritionFoodById(item.id);
          if (!food || !selections[meal.mealKey]) return;
          selections[meal.mealKey][food.category][food.id] = item.amount;
          if (!nutritionState.selected[food.category].includes(food.id)) nutritionState.selected[food.category].push(food.id);
        });
      });
      nutritionState.mealSelections.stable = selections;
      nutritionState.activeDayView = 'stable';
      updateNutritionMarkup(buildMealConstructorMarkup(targets));
      return;
    }

    if (action === "filter-foods") {
      nutritionState.foodFilter = target.dataset.filter || "all";
      rerenderNutritionConstructor();
      return;
    }
    if (action === "toggle-food-favorite") {
      const id = target.dataset.id;
      nutritionState.favorites = nutritionState.favorites.includes(id) ? nutritionState.favorites.filter(function (item) { return item !== id; }) : nutritionState.favorites.concat(id);
      if (nutritionCustom && nutritionCustom.saveFavorites) nutritionCustom.saveFavorites(nutritionState.favorites);
      rerenderNutritionConstructor();
      return;
    }
    if (action === "save-meal-recipe") {
      const card = target.closest(".nw-meal-card");
      const nameField = card.querySelector(".nw-recipe-name");
      const yieldField = card.querySelector(".nw-recipe-yield");
      if (!nameField.reportValidity() || !yieldField.reportValidity()) return;
      const meal = buildSelectedDaySummary(getCurrentDayTargets(), nutritionState.activeDayView).meals.find(function (item) { return item.mealKey === target.dataset.meal; });
      const product = nutritionCustom.addRecipe(nameField.value.trim(), yieldField.value, card.querySelector(".nw-recipe-category").value, meal);
      nutritionState.customMessage = product ? "Страву збережено: " + product.name : "Не вдалося зберегти страву. Перевір назву та вагу готової страви.";
      if (product) {
        if (!nutritionState.selected[product.category]) nutritionState.selected[product.category] = [];
        if (!nutritionState.selected[product.category].includes(product.id)) nutritionState.selected[product.category].push(product.id);
      }
      updateNutritionMarkup(buildMealConstructorMarkup(getCurrentDayTargets()));
      const notice = nutritionResult.querySelector(".nutrition-menu-template-tools .builder-note");
      if (notice) notice.closest("details").open = true;
      return;
    }
    if (action === "remove-meal-food") {
      const category = ensureMealSelectionCategory(target.dataset.day, target.dataset.meal, target.dataset.category);
      delete category[target.dataset.id];
      updateNutritionMarkup(buildMealConstructorMarkup(getCurrentDayTargets()));
      const card = Array.from(nutritionResult.querySelectorAll("select[data-meal]")).find(function (item) { return item.dataset.meal === target.dataset.meal && item.dataset.category === target.dataset.category; });
      if (card) card.focus({preventScroll:true});
      return;
    }

    if (action === "set-mode") {
      nutritionState.mode = target.dataset.mode || "manual";
      nutritionState.builderError = "";
      rerenderNutritionConstructor();
      return;
    }

    if (action === "open-group") {
      nutritionState.activeGroup = target.dataset.group || "protein";
      nutritionState.builderError = "";
      rerenderNutritionConstructor();
      return;
    }

    if (action === "build-manual") {
      buildManualNutritionPlan();
      return;
    }

    if (action === "confirm-products") {
      nutritionState.productsConfirmed = true;
      nutritionState.builderError = "";
      rerenderNutritionConstructor();
      return;
    }

    if (action === "edit-products") {
      nutritionState.productsConfirmed = false;
      nutritionState.builderError = "";
      rerenderNutritionConstructor();
      return;
    }

    if (action === "set-day-view") {
      nutritionState.activeDayView = target.dataset.day || "stable";
      updateNutritionMarkup(buildMealConstructorMarkup(getCurrentDayTargets()));
      return;
    }

    if (action === "toggle-meal-choice") {
      setMealSelectionValue(
        target.dataset.day,
        target.dataset.meal,
        target.dataset.category,
        target.dataset.id,
        target.dataset.amount
      );
      updateNutritionMarkup(buildMealConstructorMarkup(getCurrentDayTargets()));
      return;
    }

    if (action === "adjust-meal-choice") {
      adjustMealSelectionAmount(
        target.dataset.day,
        target.dataset.meal,
        target.dataset.category,
        target.dataset.id,
        target.dataset.direction
      );
      updateNutritionMarkup(buildMealConstructorMarkup(getCurrentDayTargets()));
      return;
    }

    if (action === "back-constructor") {
      backToNutritionConstructor();
      return;
    }

    if (action === "import-nutrition-products") {
      importNutritionProducts();
      return;
    }

    if (action === "save-nutrition-template") {
      saveNutritionTemplate();
      return;
    }

    if (action === "load-nutrition-template") {
      loadNutritionTemplate();
      return;
    }

    if (action === "delete-custom-product") {
      deleteNutritionCustomProduct(target.dataset.id);
      return;
    }

    if (action === "save-nutrition-menu-template") {
      saveNutritionMenuTemplate();
      return;
    }

    if (action === "load-nutrition-menu-template") {
      loadNutritionMenuTemplate();
    }
  });

    nutritionResult.addEventListener("change", function (event) {
      const target = event.target;

      if (target.classList.contains("nutrition-product-checkbox")) {
        toggleNutritionProduct(
          target.dataset.group,
          target.dataset.id,
          target.checked
        );
        return;
      }

      if (target.classList.contains("nutrition-portion-input")) {
        const food = getNutritionFoodById(target.dataset.id);
        const amount = nutritionModule.normalizeManualPortion(food, target.value);
        if (!amount || !target.checkValidity()) { target.reportValidity(); return; }
        ensureMealSelectionCategory(target.dataset.day, target.dataset.meal, target.dataset.category)[target.dataset.id] = amount;
        updateNutritionMarkup(buildMealConstructorMarkup(getCurrentDayTargets()));
        return;
      }

      if (target.classList.contains("meal-choice-select")) {
        const option = target.selectedOptions && target.selectedOptions.length
          ? target.selectedOptions[0]
          : null;

        replaceMealSelectionValue(
          target.dataset.day,
          target.dataset.meal,
          target.dataset.category,
          target.value,
          option ? option.dataset.amount : null
        );

        updateNutritionMarkup(buildMealConstructorMarkup(getCurrentDayTargets()));
      }
    });
  }

  /* =========================================================
     КІНЕЦЬ НОВОГО БЛОКУ ХАРЧУВАННЯ
  ========================================================= */


});



