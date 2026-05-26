(function () {
  const system = window.VitalRiseSystem || {};

  const painGuidance = {
    shoulder: [
      "Плече: прибери глибокі бруси, агресивні жими над головою і будь-який рух із гострим болем.",
      "Заміни фокус на контроль лопатки, нейтральний хват, повільну ексцентрику і легші варіанти жиму."
    ],
    elbow: [
      "Лікоть: зменш обсяг підтягувань/брусів, не роби всі сети до відмови і стеж за хватом.",
      "Заміни частину роботи на тяги резиною, нейтральний хват і вправи без різкого розгинання ліктя."
    ],
    knee: [
      "Коліно: не форсуй глибину присіду через біль, тримай контроль стопи й коліна.",
      "Заміни частину навантаження на румунську тягу, містки, контрольовані спліт-присіди без болю."
    ],
    back: [
      "Поперек: обмеж важкі нахили, станову з підлоги і вправи, де втрачається нейтральна спина.",
      "Заміни фокус на стабільний корпус, хіп-хіндж з малою вагою, тяги з опори і роботу без болю."
    ],
    fatigue: [
      "Сильна втома: цього тижня краще зняти 20-30% допоміжного обсягу.",
      "Не додавай нові вправи; тримай базу, сон і легку ходьбу."
    ]
  };

  function getPainGuidance(status) {
    return painGuidance[status] ? painGuidance[status].slice() : [];
  }

  function roundTo2_5(value) {
    return Math.round(value / 2.5) * 2.5;
  }

  function calculateTrainingCalories(place, goal, weight, duration) {
    const safeWeight = weight || 80;
    const safeDuration = duration || 60;
    let met = 5.0;

    if (place === "gym") {
      if (goal === "strength") met = 6.0;
      else if (goal === "mass") met = 5.8;
      else if (goal === "fatloss") met = 7.0;
      else met = 5.0;
    } else if (place === "outdoor") {
      if (goal === "strength") met = 6.2;
      else if (goal === "mass") met = 5.8;
      else if (goal === "fatloss") met = 7.2;
      else met = 5.4;
    } else {
      if (goal === "strength") met = 4.8;
      else if (goal === "mass") met = 5.2;
      else if (goal === "fatloss") met = 6.8;
      else met = 4.5;
    }

    return (met * 3.5 * safeWeight / 200) * safeDuration;
  }

  function buildBasicExercise(name, sets, reps, oneRM, percent) {
    let weightText = "без ваги";
    let percentText = "без %";

    if (oneRM && percent) {
      const workWeight = roundTo2_5(oneRM * percent);
      weightText = workWeight + " кг";
      percentText = Math.round(percent * 100) + "% від 1ПМ";
    }

    return {
      name: name,
      sets: sets,
      reps: reps,
      weightText: weightText,
      percentText: percentText
    };
  }

  function buildAccessoryExercise(name, sets, reps, progression, weightText) {
    return {
      name: name,
      sets: sets,
      reps: reps,
      weightText: weightText || "підбирається індивідуально",
      percentText: progression
    };
  }

  function buildOutdoorExercise(name, sets, reps, weightText, progressionPlan) {
    return {
      name: name,
      sets: sets,
      reps: reps,
      weightText: weightText,
      percentText: progressionPlan[0],
      progressionType: "outdoor",
      progressionPlan: progressionPlan
    };
  }

  function getTrainingGoalLabel(goal) {
    const labels = {
      strength: "Сила",
      mass: "Маса",
      endurance: "Силова витривалість",
      fatloss: "Корекція ваги",
      support: "Підтримка форми"
    };

    return labels[goal] || "Тренувальна ціль";
  }

  function getTrainingPlaceLabel(place) {
    const labels = {
      gym: "Зал",
      home: "Дім",
      outdoor: "Вулиця"
    };

    return labels[place] || "Формат";
  }

  function getTrainingLevelLabel(level) {
    const labels = {
      beginner: "Початковий",
      intermediate: "Середній",
      advanced: "Просунутий"
    };

    return labels[level] || "Рівень";
  }

  function getTrainingFocusLabel(place, goal, level) {
    if (place === "gym" && goal === "strength" && level === "beginner") return "техніка і підбір стартової ваги";
    if (place === "home" && goal === "strength") return "рюкзак, резина, важкі варіації";
    if (place === "home" && goal === "mass") return "домашній об'єм без втрати сили";
    if (place === "home") return level === "advanced" ? "щільність, 6-10 підходів, контроль" : "прогрес через складність і об'єм";
    if (place === "outdoor" && goal === "strength") return "турнік, бруси, поступова вага";
    if (place === "outdoor" && goal === "fatloss") return "чисті повтори, менше резини, ходьба";
    if (place === "outdoor" || goal === "endurance") return "силова витривалість і об'єм";
    if (goal === "mass") return "об'єм, база і допоміжні вправи";
    if (goal === "strength") return level === "beginner" ? "техніка і базова сила" : "базова сила і контроль ваги";
    if (goal === "fatloss") return "витрата енергії без зриву відновлення";
    return "стабільна форма і контроль техніки";
  }

  system.training = {
    getPainGuidance: getPainGuidance,
    calculateTrainingCalories: calculateTrainingCalories,
    buildBasicExercise: buildBasicExercise,
    buildAccessoryExercise: buildAccessoryExercise,
    buildOutdoorExercise: buildOutdoorExercise,
    getTrainingGoalLabel: getTrainingGoalLabel,
    getTrainingPlaceLabel: getTrainingPlaceLabel,
    getTrainingLevelLabel: getTrainingLevelLabel,
    getTrainingFocusLabel: getTrainingFocusLabel
  };

  window.VitalRiseSystem = system;
})();
