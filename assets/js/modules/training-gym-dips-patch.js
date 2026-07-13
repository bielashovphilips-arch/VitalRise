(function () {
  const system = window.VitalRiseSystem || {};
  const templates = system.trainingTemplates;
  if (!templates || typeof templates.getGymIntermediateAdvancedBasePlan !== "function") return;

  const originalGetGymPlan = templates.getGymIntermediateAdvancedBasePlan;

  function buildDipsExercise(sets) {
    const training = window.VitalRiseSystem && window.VitalRiseSystem.training;
    const progression = "спочатку вага тіла; коли 3×10 чисто — додавай пояс або гантель +2.5 кг, без провалу плечей";
    return training && typeof training.buildAccessoryExercise === "function"
      ? training.buildAccessoryExercise("Віджимання на брусах", sets, "6-10", progression)
      : {
          name: "Віджимання на брусах",
          sets,
          reps: "6-10",
          weightText: "підбирається індивідуально",
          percentText: progression
        };
  }

  function hasDips(day) {
    return ["basic", "accessory"].some(function (group) {
      return (day[group] || []).some(function (exercise) {
        return String(exercise && exercise.name || "").toLowerCase().indexOf("брус") !== -1;
      });
    });
  }

  function insertAfterHammer(day, exercise) {
    day.accessory = day.accessory || [];
    if (hasDips(day)) return day;

    const hammerIndex = day.accessory.findIndex(function (item) {
      return String(item && item.name || "").toLowerCase().indexOf("хамер") !== -1;
    });

    if (hammerIndex >= 0) {
      day.accessory.splice(hammerIndex + 1, 0, exercise);
    } else {
      day.accessory.unshift(exercise);
    }

    return day;
  }

  templates.getGymIntermediateAdvancedBasePlan = function (goal, days, oneRM, level) {
    const plan = originalGetGymPlan.apply(this, arguments);
    if (level !== "advanced" || !Array.isArray(plan)) return plan;

    plan.forEach(function (day) {
      const title = String(day && day.title || "").toLowerCase();
      if (title.indexOf("груди") !== -1) insertAfterHammer(day, buildDipsExercise("3-4"));
      if (title.indexOf("жим важкий") !== -1) insertAfterHammer(day, buildDipsExercise("3"));
    });

    return plan;
  };

  window.VitalRiseSystem = system;
})();
