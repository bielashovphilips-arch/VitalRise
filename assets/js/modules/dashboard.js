(function () {
  const system = window.VitalRiseSystem || {};
  const $ = system.$ || function (id) { return document.getElementById(id); };
  const storage = system.storage;
  const profileKey = storage && storage.keys ? storage.keys.athleteProfile : "vitalrise:athlete-profile";

  function setFieldValue(id, value) {
    const field = $(id);
    if (!field || value === undefined || value === null || value === "") return;
    field.value = value;
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function readProfile() {
    const fields = [
      "profile-gender",
      "profile-age",
      "profile-height",
      "profile-weight",
      "profile-goal",
      "profile-level",
      "profile-days",
      "profile-pain",
      "profile-labs-date"
    ];

    return fields.reduce(function (profile, id) {
      const field = $(id);
      if (!field) return profile;
      profile[id.replace("profile-", "")] = field.value;
      return profile;
    }, {});
  }

  function writeProfile(profile) {
    Object.keys(profile || {}).forEach(function (key) {
      const field = $("profile-" + key);
      if (field) field.value = profile[key];
    });
  }

  function saveProfile() {
    if (storage) {
      return storage.setJson(profileKey, readProfile());
    }

    return false;
  }

  function restoreProfile() {
    if (!storage) return false;
    const saved = storage.getJson(profileKey, null);
    if (!saved) return false;
    writeProfile(saved);
    return true;
  }

  function mapGoalToTraining(goal) {
    if (goal === "gain") return "mass";
    if (goal === "cut") return "fatloss";
    if (goal === "performance") return "strength";
    return "strength";
  }

  function mapGoalToBlueprint(goal) {
    if (goal === "maintain") return "recomp";
    return goal || "recomp";
  }

  function applyProfileToCalculators() {
    const profile = readProfile();

    setFieldValue("gender", profile.gender);
    setFieldValue("age", profile.age);
    setFieldValue("height", profile.height);
    setFieldValue("weight", profile.weight);
    setFieldValue("body-weight", profile.weight);
    setFieldValue("goal", profile.goal);
    setFieldValue("progress-goal", profile.goal);
    setFieldValue("blueprint-goal", mapGoalToBlueprint(profile.goal));
    setFieldValue("training-goal", mapGoalToTraining(profile.goal));
    setFieldValue("training-level", profile.level);
    setFieldValue("blueprint-level", profile.level);
    setFieldValue("training-days", profile.days);
    setFieldValue("pain-status", profile.pain);
  }

  function labelFromSelect(id, fallback) {
    const field = $(id);
    if (!field) return fallback;
    const option = field.options[field.selectedIndex];
    return option ? option.textContent.trim() : fallback;
  }

  function t(value) {
    const text = String(value == null ? "" : value);
    return window.VitalRiseI18n && typeof window.VitalRiseI18n.translateText === "function"
      ? window.VitalRiseI18n.translateText(text)
      : text;
  }

  function formatBodyMetrics(weight, height) {
    const language = window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function"
      ? window.VitalRiseI18n.getLanguage()
      : "uk";
    const weightUnit = language === "en" ? "kg" : "кг";
    const heightUnit = language === "en" ? "cm" : "см";
    return weight + " " + weightUnit + " / " + height + " " + heightUnit;
  }

  function setText(id, value) {
    const node = $(id);
    if (node) node.textContent = t(value);
  }

  function updateDashboard() {
    const profile = readProfile();
    const nutritionResult = $("nutrition-result");
    const blueprintResult = $("blueprint-result");
    const caloriesText = nutritionResult && nutritionResult.textContent.match(/Калорії[^0-9]*(\d+)/);
    const blueprintText = blueprintResult && blueprintResult.querySelector(".blueprint-priority h4");

    setText("dashboard-goal", labelFromSelect("profile-goal", "Рекомпозиція"));
    setText("dashboard-body", profile.weight && profile.height ? formatBodyMetrics(profile.weight, profile.height) : "Профіль не заповнений");
    setText("dashboard-training", labelFromSelect("profile-level", "Рівень") + " / " + labelFromSelect("profile-days", "3 дні"));
    setText("dashboard-labs", profile["labs-date"] ? "Останні: " + profile["labs-date"] : "Дата не вказана");
    setText("dashboard-calories", caloriesText ? caloriesText[1] + " ккал" : "Після розрахунку");
    setText("dashboard-focus", blueprintText ? blueprintText.textContent.trim() : "Створити Blueprint");
  }

  function getText(id, fallback) {
    const node = $(id);
    const value = node ? node.textContent.trim() : "";
    return value || fallback;
  }

  function calculateCommandReadiness() {
    const profile = readProfile();
    let ready = 0;

    if (profile.weight && profile.height && profile.age) ready += 35;
    if (getText("dashboard-calories", "") !== "Після розрахунку") ready += 25;
    if (getText("dashboard-focus", "") !== "Створити Blueprint") ready += 25;
    if (profile["labs-date"]) ready += 15;

    return Math.min(100, ready);
  }

  function updateCommandCenter() {
    setText("command-goal", getText("dashboard-goal", "Рекомпозиція"));
    setText("command-body", getText("dashboard-body", "Профіль не заповнений"));
    setText("command-training", getText("dashboard-training", "Середній / 3 дні"));
    setText("command-calories", getText("dashboard-calories", "Після розрахунку"));
    setText("command-focus", getText("dashboard-focus", "Створити Blueprint"));
    setText("command-labs", "Аналізи: " + getText("dashboard-labs", "дата не вказана"));
    setText("command-readiness", "Готовність " + calculateCommandReadiness() + "%");
  }

  function refreshDashboards() {
    updateDashboard();
    updateCommandCenter();
  }

  function bindDashboardRefresh() {
    document.addEventListener("submit", function () {
      window.setTimeout(refreshDashboards, 0);
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest("button")) return;
      window.setTimeout(refreshDashboards, 0);
    });
  }

  function bindProfile() {
    const profileForm = $("athlete-profile-form");
    const applyButton = $("profile-apply");

    if (!profileForm) return;

    restoreProfile();
    refreshDashboards();

    profileForm.addEventListener("input", function () {
      saveProfile();
      refreshDashboards();
    });

    profileForm.addEventListener("change", function () {
      saveProfile();
      refreshDashboards();
    });

    profileForm.addEventListener("submit", function (event) {
      event.preventDefault();
      saveProfile();
      applyProfileToCalculators();
      refreshDashboards();
    });

    if (applyButton) {
      applyButton.addEventListener("click", function () {
        saveProfile();
        applyProfileToCalculators();
        refreshDashboards();
      });
    }

    document.addEventListener("click", function (event) {
      if (!event.target.closest("#clear-saved-data")) return;
      if (storage) storage.remove(profileKey);
      profileForm.reset();
      refreshDashboards();
    });
  }

  function initDashboard() {
    bindProfile();
    bindDashboardRefresh();
  }

  system.updateDashboard = refreshDashboards;
  system.updateCommandCenter = updateCommandCenter;
  system.applyProfileToCalculators = applyProfileToCalculators;
  system.initDashboard = initDashboard;

  window.VitalRiseSystem = system;

  document.addEventListener("DOMContentLoaded", initDashboard);
})();
