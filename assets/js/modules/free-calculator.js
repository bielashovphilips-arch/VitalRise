(function () {
  const copy = {
    uk: {
      eyebrow: "FREE · персональний старт", title: "Дізнайся свій орієнтир калорійності", text: "Кілька даних — і ти отримаєш базовий персональний орієнтир на день. Без раціону, макросів і програми тренувань.",
      sex: "Стать", female: "Жінка", male: "Чоловік", age: "Вік", weight: "Вага, кг", height: "Зріст, см", activity: "Активність", goal: "Ціль",
      activityLow: "Мало руху", activityLight: "1–3 тренування на тиждень", activityMedium: "3–5 тренувань на тиждень", activityHigh: "6+ тренувань на тиждень",
      goalLose: "Зниження ваги", goalKeep: "Підтримка ваги", goalGain: "Набір маси", submit: "Отримати орієнтир", resultKicker: "Твій базовий орієнтир", kcal: "ккал/день",
      resultCopy: "Це оцінка добової енергії для обраної цілі. Наступний крок — перетворити її на реальні дії.",
      upsellTitle: "Цифра — це старт, не готовий план", upsellText: "Start перетворює її на 7 днів харчування, тренування та PDF. Pro додає 4-тижневу систему, check-in і супровід.", upsellCta: "Отримати повний план у Start",
      note: "Орієнтир не є медичною рекомендацією. За станів здоров’я або різких змін самопочуття звернись до лікаря."
    },
    en: {
      eyebrow: "FREE · personal starting point", title: "Find your calorie target", text: "Enter a few details and get a personal daily calorie estimate. No meal plan, macros, or training program included.",
      sex: "Sex", female: "Female", male: "Male", age: "Age", weight: "Weight, kg", height: "Height, cm", activity: "Activity", goal: "Goal",
      activityLow: "Mostly sedentary", activityLight: "1–3 workouts per week", activityMedium: "3–5 workouts per week", activityHigh: "6+ workouts per week",
      goalLose: "Fat loss", goalKeep: "Maintain weight", goalGain: "Gain mass", submit: "Get my estimate", resultKicker: "Your basic target", kcal: "kcal/day",
      resultCopy: "This is a daily energy estimate for the selected goal. The next step is turning it into real actions.",
      upsellTitle: "A number is a starting point, not a complete plan", upsellText: "Start turns it into 7 days of nutrition, training, and a PDF. Pro adds a 4-week system, check-ins, and support.", upsellCta: "Get the full Start plan",
      note: "This estimate is not medical advice. Consult a doctor for health conditions or sudden changes in how you feel."
    },
    ru: {
      eyebrow: "FREE · персональный старт", title: "Узнайте свой ориентир по калорийности", text: "Несколько данных — и вы получите базовый персональный ориентир на день. Без рациона, макросов и программы тренировок.",
      sex: "Пол", female: "Женщина", male: "Мужчина", age: "Возраст", weight: "Вес, кг", height: "Рост, см", activity: "Активность", goal: "Цель",
      activityLow: "Мало движения", activityLight: "1–3 тренировки в неделю", activityMedium: "3–5 тренировок в неделю", activityHigh: "6+ тренировок в неделю",
      goalLose: "Снижение веса", goalKeep: "Поддержание веса", goalGain: "Набор массы", submit: "Получить ориентир", resultKicker: "Ваш базовый ориентир", kcal: "ккал/день",
      resultCopy: "Это оценка суточной энергии для выбранной цели. Следующий шаг — превратить её в реальные действия.",
      upsellTitle: "Цифра — это старт, а не готовый план", upsellText: "Start превращает её в 7 дней питания, тренировок и PDF. Pro добавляет 4-недельную систему, check-in и сопровождение.", upsellCta: "Получить полный план Start",
      note: "Ориентир не является медицинской рекомендацией. При заболеваниях или резком изменении самочувствия обратитесь к врачу."
    }
  };

  function language() {
    return window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function"
      ? window.VitalRiseI18n.getLanguage()
      : "uk";
  }

  function t(key) {
    return (copy[language()] || copy.uk)[key] || copy.uk[key] || key;
  }

  function localize() {
    document.querySelectorAll("[data-free-i18n]").forEach(function (node) {
      const value = t(node.dataset.freeI18n);
      if (node.tagName === "INPUT") node.value = value;
      else node.textContent = value;
    });
    const resultCopy = document.querySelector("[data-free-result-copy]");
    if (resultCopy && !document.getElementById("free-calculator-result").hidden) resultCopy.textContent = t("resultCopy");
  }

  function validNumber(value, min, max) {
    const number = Number(value);
    return Number.isFinite(number) && number >= min && number <= max ? number : null;
  }

  function calculate(form) {
    const sex = form.elements.sex.value;
    const age = validNumber(form.elements.age.value, 16, 85);
    const weight = validNumber(form.elements.weight.value, 35, 250);
    const height = validNumber(form.elements.height.value, 130, 230);
    const activity = Number(form.elements.activity.value);
    const goal = Number(form.elements.goal.value);
    if (!age || !weight || !height || !Number.isFinite(activity) || !Number.isFinite(goal)) return null;

    const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === "male" ? 5 : -161);
    return Math.round((bmr * activity * goal) / 10) * 10;
  }

  function init() {
    const form = document.getElementById("free-calculator-form");
    const result = document.getElementById("free-calculator-result");
    if (!form || !result) return;

    localize();
    new MutationObserver(localize).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const calories = calculate(form);
      if (!calories) return;

      result.hidden = false;
      result.querySelector("[data-free-value]").textContent = calories.toLocaleString(language() === "uk" ? "uk-UA" : language() === "ru" ? "ru-RU" : "en-US");
      result.querySelector("[data-free-result-copy]").textContent = t("resultCopy");
      if (window.VitalRiseAnalytics && typeof window.VitalRiseAnalytics.trackFreeCalculation === "function") {
        window.VitalRiseAnalytics.trackFreeCalculation();
      }
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
