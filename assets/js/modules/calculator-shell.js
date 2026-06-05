(function () {
  const system = window.VitalRiseSystem || {};

  document.addEventListener("DOMContentLoaded", function () {  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const calculatorBg = document.querySelector(".calculator-bg");
  const calculatorModeLabel = document.getElementById("calculator-mode-label");
  const calculatorFocusValue = document.getElementById("calculator-focus-value");
  const calculatorContextValue = document.getElementById("calculator-context-value");
  const calculatorReadinessValue = document.getElementById("calculator-readiness-value");
  const calculatorReadinessScore = document.getElementById("calculator-readiness-score");
  const calculatorCoachNote = document.getElementById("calculator-coach-note");
  const calculatorTrackItems = document.querySelectorAll(".console-track span");
  const calculatorSection = document.querySelector(".calculator-section");

  const bgImages = {
    nutrition:
      'linear-gradient(90deg, rgba(5, 6, 8, 0.94) 0%, rgba(5, 6, 8, 0.72) 42%, rgba(5, 6, 8, 0.56) 100%)',
    training:
      'linear-gradient(90deg, rgba(5, 6, 8, 0.94) 0%, rgba(5, 6, 8, 0.72) 42%, rgba(5, 6, 8, 0.56) 100%)'
  };

  function setCalculatorBackground(tabName) {
    if (calculatorBg && bgImages[tabName]) {
      calculatorBg.style.background = bgImages[tabName];
    }
  }

  function activateTab(tabName) {
    tabButtons.forEach(function (button) {
      button.classList.toggle("active", button.dataset.tab === tabName);
    });

    tabPanels.forEach(function (panel) {
      const isActive =
        (tabName === "nutrition" && panel.id === "nutrition-panel") ||
        (tabName === "training" && panel.id === "training-panel");

      panel.classList.toggle("active", isActive);
    });

    setCalculatorBackground(tabName);
    updateCalculatorConsole(tabName);
  }

  function applySingleModuleCopy() {
    if (!calculatorSection || !calculatorSection.dataset.singleModule) return;

    const title = calculatorSection.querySelector(".calculator-intro h2");
    const text = calculatorSection.querySelector(".calculator-intro p");

    if (calculatorSection.dataset.singleModule === "training") {
      if (title) title.textContent = "Отримай окремий тренувальний протокол";
      if (text) {
        text.textContent = "Модуль тренувань формує структуру навантаження, програму, прогресію і контроль відновлення без перемикання на харчування.";
      }
      return;
    }

    if (title) title.textContent = "Отримай окремий протокол харчування";
    if (text) {
      text.textContent = "Модуль харчування рахує калорії, БЖВ, воду, сіль і прийоми їжі без перемикання на тренувальний калькулятор.";
    }
  }

  function getFieldText(id, fallback) {
    const field = document.getElementById(id);
    if (!field) return fallback;

    if (field.tagName === "SELECT") {
      const option = field.options[field.selectedIndex];
      return option ? option.textContent.trim() : fallback;
    }

    return field.value ? field.value.trim() : fallback;
  }

  function t(value) {
    const text = String(value == null ? "" : value);
    return window.VitalRiseI18n && typeof window.VitalRiseI18n.translateText === "function"
      ? window.VitalRiseI18n.translateText(text)
      : text;
  }

  function getCompactGoalLabel(value) {
    const labels = {
      recomp: "Рекомпозиція",
      cut: "Схуднення",
      maintain: "Підтримка",
      gain: "Набір",
      strength: "Сила",
      mass: "Маса",
      endurance: "Витривалість",
      fatloss: "Жироспалення",
      support: "Підтримка"
    };

    return t(labels[value] || "Рекомпозиція");
  }

  function getCompactLoadLabel(value) {
    if (value === "heavy") return t("Важка сесія");
    if (value === "heat") return t("Підвищене потовиділення");
    return t("Стабільний день");
  }

  function getCompactPlaceLabel(value) {
    if (value === "outdoor") return t("Вулиця");
    return value === "home" ? t("Дім") : t("Зал");
  }

  function countFilledFields(ids) {
    return ids.reduce(function (total, id) {
      const field = document.getElementById(id);
      return total + (field && field.value ? 1 : 0);
    }, 0);
  }

  function updateConsoleTrack(readyCount, maxCount) {
    if (!calculatorTrackItems.length) return;

    const activeCount = readyCount > 0
      ? Math.ceil((readyCount / maxCount) * calculatorTrackItems.length)
      : 0;

    calculatorTrackItems.forEach(function (item, index) {
      item.classList.toggle("active", index < activeCount);
    });
  }

  function setConsoleReadiness(readyCount, maxCount, text) {
    const percent = Math.round((readyCount / maxCount) * 100);
    const calculatorCard = document.querySelector(".calculator-card");

    if (calculatorCard) {
      calculatorCard.style.setProperty("--readiness-angle", Math.round((percent / 100) * 360) + "deg");
    }

    if (calculatorReadinessScore) {
      calculatorReadinessScore.textContent = percent + "%";
    }

    if (calculatorReadinessValue) {
      calculatorReadinessValue.textContent = t(readyCount + "/" + maxCount + " дані");
    }

    if (calculatorCoachNote) {
      calculatorCoachNote.textContent = t(text);
    }

    updateConsoleTrack(readyCount, maxCount);
  }

  function updateCalculatorConsole(tabName) {
    if (!calculatorModeLabel || !calculatorFocusValue || !calculatorContextValue || !calculatorReadinessValue) {
      return;
    }

    const activeTab = tabName || (document.querySelector(".tab-btn.active") || {}).dataset.tab || "nutrition";

    if (activeTab === "training") {
      const ready = countFilledFields(["body-weight", "duration"]);
      const trainingGoalField = document.getElementById("training-goal");
      const trainingPlaceField = document.getElementById("training-place");
      calculatorModeLabel.textContent = t("Тренування");
      calculatorFocusValue.textContent = getCompactGoalLabel(trainingGoalField ? trainingGoalField.value : "strength");
      calculatorContextValue.textContent =
        getCompactPlaceLabel(trainingPlaceField ? trainingPlaceField.value : "gym") + " / " + t(getFieldText("training-days", "3 дні"));
      setConsoleReadiness(
        ready,
        2,
        ready >= 2
          ? "Базові тренувальні дані готові. Можна формувати силовий протокол."
          : "Додай вагу тіла і тривалість тренування, щоб оцінити навантаження."
      );
      return;
    }

    const ready = countFilledFields(["age", "height", "weight"]);
    const goalValueField = document.getElementById("goal");
    const loadContextField = document.getElementById("load-context");
    calculatorModeLabel.textContent = t("Харчування");
    calculatorFocusValue.textContent = getCompactGoalLabel(goalValueField ? goalValueField.value : "recomp");
    calculatorContextValue.textContent =
      getCompactLoadLabel(loadContextField ? loadContextField.value : "standard") + " / " + t(getFieldText("meals-count", "4 прийоми"));
    setConsoleReadiness(
      ready,
      3,
      ready >= 3
        ? "Дані тіла готові. VitalRise може зібрати раціон і добові цілі."
        : "Заповни вік, зріст і вагу, щоб активувати точний харчовий протокол."
    );
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activateTab(button.dataset.tab);
    });
  });

  [
    "age",
    "height",
    "weight",
    "goal",
    "load-context",
    "meals-count",
    "training-place",
    "training-goal",
    "training-program-mode",
    "cycle-phase",
    "training-days",
    "body-weight",
    "duration",
    "pullups-max",
    "dips-max",
    "pushups-max",
    "training-equipment",
    "pain-status"
  ].forEach(function (id) {
    const field = document.getElementById(id);
    if (!field) return;

    field.addEventListener("input", function () {
      updateCalculatorConsole();
    });

    field.addEventListener("change", function () {
      updateCalculatorConsole();
    });
  });


  system.calculatorShell = {
    activateTab: activateTab,
    updateConsole: updateCalculatorConsole,
    updateCalculatorConsole: updateCalculatorConsole
  };
  window.VitalRiseSystem = system;

  const defaultTab = calculatorSection && calculatorSection.dataset.defaultTab === "training"
    ? "training"
    : "nutrition";

  applySingleModuleCopy();
  activateTab(defaultTab);
  });
})();
