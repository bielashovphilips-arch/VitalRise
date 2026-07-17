document.addEventListener("DOMContentLoaded", function () {
  const nutritionForm = document.getElementById("nutrition-form");
  const nutritionResult = document.getElementById("nutrition-result");
  const nutritionReset = document.getElementById("nutrition-reset");

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
    if (pplFixedDaysOption) pplFixedDaysOption.hidden = !isPpl;
    if (isPpl) {
      trainingDaysField.value = "8";
      trainingDaysField.disabled = true;
      if (trainingDaysHint) {
        trainingDaysHint.textContent = "PPL: 3 важкі дні, день відпочинку, 3 середні дні, день відпочинку. Цикл триває 8 днів і не прив’язаний до понеділка-неділі.";
      }
    } else {
      if (trainingDaysField.value === "8") trainingDaysField.value = "3";
      trainingDaysField.disabled = false;
      if (trainingDaysHint) {
        trainingDaysHint.textContent = "Для PPL використовується фіксований цикл, а не календарний тиждень.";
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
  nutritionState.mode = "manual";
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
    const products = getFoodsByCategory(category);
    return nutritionRender
      ? nutritionRender.buildProductsListMarkup(category, products, nutritionState.selected[category])
      : "";
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
          productsConfirmed: nutritionState.productsConfirmed
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
  nutritionState.mode = "manual";
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

  nutritionResult.innerHTML = buildNutritionConstructorMarkup();
}

  function rerenderNutritionConstructor() {
    if (!nutritionState.targets) return;
    nutritionResult.innerHTML = buildNutritionConstructorMarkup();
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
        activeTargets ? activeTargets.goal : null
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
      fat: {}
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
  const isAlreadySelected = Object.prototype.hasOwnProperty.call(categorySelections, foodId);

  Object.keys(categorySelections).forEach(function (id) {
    delete categorySelections[id];
  });

  if (!isAlreadySelected) {
    categorySelections[foodId] = Number(amount) || null;
  }
}

function replaceMealSelectionValue(dayType, mealKey, category, foodId, amount) {
  const categorySelections = ensureMealSelectionCategory(dayType, mealKey, category);

  Object.keys(categorySelections).forEach(function (id) {
    delete categorySelections[id];
  });

  if (foodId) {
    categorySelections[foodId] = Number(amount) || null;
  }
}

function adjustMealSelectionAmount(dayType, mealKey, category, foodId, direction) {
  const categorySelections = ensureMealSelectionCategory(dayType, mealKey, category);
  const food = getNutritionFoodById(foodId);
  if (!food) return;

  const currentAmount = Number(categorySelections[foodId]) || Number(food.defaultAmount) || Number(food.min) || 100;
  const step = Number(food.portionStep) || 10;
  const nextAmount = currentAmount + (direction === "decrease" ? -step : step);
  const normalizedAmount = nutritionModule && nutritionModule.normalizePortion
    ? nutritionModule.normalizePortion(food, nextAmount)
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
        macroTrackerMarkup: nutritionRender.buildMacroTrackerMarkup
          ? nutritionRender.buildMacroTrackerMarkup(activeTargets, summary.totals, getNutritionFormatters())
          : "",
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

  if ((nutritionState.selected.protein || []).length < 1) {
    nutritionState.builderError = "Обери мінімум 1 білковий продукт.";
    nutritionState.activeGroup = "protein";
    rerenderNutritionConstructor();
    return;
  }

  if ((nutritionState.selected.carb || []).length < 1) {
    nutritionState.builderError = "Обери мінімум 1 джерело вуглеводів.";
    nutritionState.activeGroup = "carb";
    rerenderNutritionConstructor();
    return;
  }

  if ((nutritionState.selected.fat || []).length < 1) {
    nutritionState.builderError = "Обери мінімум 1 джерело жиру.";
    nutritionState.activeGroup = "fat";
    rerenderNutritionConstructor();
    return;
  }

  nutritionState.builderError = "";
  nutritionResult.innerHTML = buildMealConstructorMarkup(targets);
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
    nutritionState.customMessage = "Шаблон збережено: " + label;
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
      activeDayView: nutritionState.activeDayView
    });

    nutritionState.customMessage = "Меню збережено: " + label;
    nutritionResult.innerHTML = buildMealConstructorMarkup(getCurrentDayTargets());
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
      nutritionResult.innerHTML = buildMealConstructorMarkup(getCurrentDayTargets());
      return;
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
    nutritionResult.innerHTML = buildMealConstructorMarkup(getCurrentDayTargets());
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
      resetNutritionState();

      nutritionResult.innerHTML =
        '<div class="result-placeholder">Заповни поля та натисни «Розрахувати», щоб перейти до формування раціону.</div>';
    });
  }

 if (nutritionResult) {
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
      nutritionResult.innerHTML = buildMealConstructorMarkup(getCurrentDayTargets());
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
      nutritionResult.innerHTML = buildMealConstructorMarkup(getCurrentDayTargets());
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
      nutritionResult.innerHTML = buildMealConstructorMarkup(getCurrentDayTargets());
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

        nutritionResult.innerHTML = buildMealConstructorMarkup(getCurrentDayTargets());
      }
    });
  }

  /* =========================================================
     КІНЕЦЬ НОВОГО БЛОКУ ХАРЧУВАННЯ
  ========================================================= */


});



