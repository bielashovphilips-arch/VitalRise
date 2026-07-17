(function () {
  const system = window.VitalRiseSystem || {};

  function deepClone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function roundTo2_5(value) {
    return Math.round(value / 2.5) * 2.5;
  }

  function formatWeight(value) {
    if (!value) return "без ваги";
    return value % 1 === 0 ? value + " кг" : value.toFixed(1) + " кг";
  }

  function getOutdoorProgressionCue(exercise, weekInfo) {
    if (exercise.progressionPlan && exercise.progressionPlan[weekInfo.week - 1]) {
      return exercise.progressionPlan[weekInfo.week - 1];
    }

    if (weekInfo.week === 2) return "Додай 1-2 повтори сумарно або трохи слабшу резину.";
    if (weekInfo.week === 3) return "Додай 1 підхід тільки якщо техніка чиста. Довга ціль: 8-10 підходів.";
    if (weekInfo.week === 4) return "Контрольний тиждень: чиста амплітуда, без відмови в кожному підході.";
    if (weekInfo.week === 5) return "Якщо всі підходи чисті, додай рюкзак 2-5 кг або ще 1 підхід.";
    if (weekInfo.week === 6) return "Полегшення: мінус 20-30% підходів, техніка і відновлення.";

    return exercise.percentText;
  }

  function isOutdoorPullUp(exercise) {
    return exercise.name.indexOf("Підтягування на турніку") !== -1 ||
      exercise.name.indexOf("Підтягування важкі") !== -1;
  }

  function isOutdoorDip(exercise) {
    return exercise.name.indexOf("Віджимання на брусах") !== -1 ||
      exercise.name.indexOf("Бруси важкі") !== -1;
  }

  function isOutdoorPushup(exercise) {
    return exercise.name.indexOf("Віджимання від підлоги") !== -1 ||
      exercise.name.indexOf("Віджимання вузьким хватом") !== -1;
  }

  function getOutdoorStrengthProgression(exercise, weekInfo) {
    const weekIndex = Math.max(0, weekInfo.week - 1);

    if (isOutdoorPullUp(exercise)) {
      const addedWeight = weekIndex * 2.5;
      const repsByWeek = ["6-8", "5-7", "4-6", "3-5", "3-5", "2-4"];
      const weightText = addedWeight > 0 ? "рюкзак +" + addedWeight + " кг" : "власна вага / резина за потреби";

      return {
        reps: repsByWeek[weekIndex] || "3-5",
        weightText: weightText,
        percentText: addedWeight > 0
          ? "Додавай +2.5 кг тільки якщо минулого тижня виконав верх робочого діапазону чисто."
          : "Якщо виконав 6-8 чисто без зриву техніки — наступного тижня +2.5 кг."
      };
    }

    if (isOutdoorDip(exercise)) {
      const addedWeight = weekIndex * 5;
      const repsByWeek = ["15-20", "10-15", "8-12", "6-10", "5-8", "4-6"];
      const weightText = addedWeight > 0 ? "рюкзак +" + addedWeight + " кг" : "власна вага / резина за потреби";

      return {
        reps: repsByWeek[weekIndex] || "5-8",
        weightText: weightText,
        percentText: addedWeight > 0
          ? "Додавай +5 кг тільки якщо минулого тижня виконав верх робочого діапазону чисто."
          : "Якщо виконав 15-20 чисто — наступного тижня +5 кг і нижчий діапазон повторів."
      };
    }

    if (isOutdoorPushup(exercise)) {
      return {
        reps: "15-20",
        weightText: weekInfo.week >= 3 ? "рюкзак 2-5 кг за готовності" : "власна вага",
        percentText: "Не перевищуй 20 повторів у сеті: після верхньої межі ускладнюй кут, паузу або додавай рюкзак."
      };
    }

    return null;
  }

  function getOutdoorFatLossProgression(exercise, weekInfo) {
    if (isOutdoorPullUp(exercise) || isOutdoorDip(exercise)) {
      const cues = [
        "Без додаткової ваги. Працюй з резиною так, щоб повтори були чистими.",
        "Слабша резина або +1-2 чисті повтори сумарно.",
        "Ще слабша резина. За готовності перший підхід без допомоги.",
        "Ціль: виконати більше роботи без знімання навантаження резиною.",
        "Закріпи чисті підходи без резини або з мінімальною допомогою.",
        "Полегшення: мінус 20-30% підходів, але без повернення до зайвої допомоги."
      ];

      return cues[weekInfo.week - 1] || cues[1];
    }

    return "Без додаткової ваги: прогрес через чисті повтори, більше підходів і коротший відпочинок.";
  }

  function getWeekScheme(goal) {
    if (goal === "strength") {
      return [
        { week: 1, label: "Тиждень 1 — вхід у цикл", baseKg: 0, accessoryKg: 0, cardioMinutes: 0 },
        { week: 2, label: "Тиждень 2 — помірна прогресія", baseKg: 2.5, accessoryKg: 2.5, cardioMinutes: 0 },
        { week: 3, label: "Тиждень 3 — робоче посилення", baseKg: 2.5, accessoryKg: 2.5, cardioMinutes: 0 },
        { week: 4, label: "Тиждень 4 — важкий робочий", baseKg: 5, accessoryKg: 2.5, cardioMinutes: 0 },
        { week: 5, label: "Тиждень 5 — майже піковий", baseKg: 2.5, accessoryKg: 2.5, cardioMinutes: 0 },
        { week: 6, label: "Тиждень 6 — контрольний / полегшений", baseKg: -5, accessoryKg: 0, cardioMinutes: 0 }
      ];
    }

    if (goal === "mass") {
      return [
        { week: 1, label: "Тиждень 1 — стартовий об’єм", baseKg: 0, accessoryKg: 0, cardioMinutes: 0 },
        { week: 2, label: "Тиждень 2 — прогресія", baseKg: 2.5, accessoryKg: 2.5, cardioMinutes: 0 },
        { week: 3, label: "Тиждень 3 — підсилення", baseKg: 2.5, accessoryKg: 2.5, cardioMinutes: 0 },
        { week: 4, label: "Тиждень 4 — стабілізація", baseKg: 0, accessoryKg: 0, cardioMinutes: 0 }
      ];
    }

    if (goal === "fatloss") {
      return [
        { week: 1, label: "Тиждень 1 — адаптація", baseKg: 0, accessoryKg: 0, cardioMinutes: 20 },
        { week: 2, label: "Тиждень 2 — більше щільності", baseKg: 0, accessoryKg: 2.5, cardioMinutes: 25 },
        { week: 3, label: "Тиждень 3 — контрольний об’єм", baseKg: 2.5, accessoryKg: 2.5, cardioMinutes: 30 },
        { week: 4, label: "Тиждень 4 — стабільний фініш", baseKg: 0, accessoryKg: 0, cardioMinutes: 35 }
      ];
    }

    if (goal === "endurance") {
      return [
        { week: 1, label: "Тиждень 1 — базовий об'єм", baseKg: 0, accessoryKg: 0, cardioMinutes: 0 },
        { week: 2, label: "Тиждень 2 — більше повторів", baseKg: 0, accessoryKg: 0, cardioMinutes: 0 },
        { week: 3, label: "Тиждень 3 — більше підходів", baseKg: 0, accessoryKg: 0, cardioMinutes: 0 },
        { week: 4, label: "Тиждень 4 — щільність і контроль", baseKg: 0, accessoryKg: 0, cardioMinutes: 0 }
      ];
    }

    return [
      { week: 1, label: "Тиждень 1 — стабільний старт", baseKg: 0, accessoryKg: 0, cardioMinutes: 0 },
      { week: 2, label: "Тиждень 2 — плавна прогресія", baseKg: 2.5, accessoryKg: 2.5, cardioMinutes: 0 },
      { week: 3, label: "Тиждень 3 — робочий", baseKg: 2.5, accessoryKg: 2.5, cardioMinutes: 0 },
      { week: 4, label: "Тиждень 4 — без форсування", baseKg: 0, accessoryKg: 0, cardioMinutes: 0 }
    ];
  }

  function getGymBeginnerStrengthProgression(exercise, weekInfo) {
    const isAccessory = exercise.progressionType === "gymBeginnerStrengthAccessory";
    const cues = isAccessory
      ? [
          "Обери вагу на 10-12 чистих повторів із запасом 2-3 повтори.",
          "Якщо верх діапазону чистий - додай найменший крок ваги або 1 повтор.",
          "Залиш RIR 2: допоміжні вправи не мають забивати базову техніку.",
          "Якщо техніка стабільна, додай невелику вагу; якщо ні - залиш поточну.",
          "Працюй щільно, але без відмови.",
          "Полегшення: мінус 20% об'єму, закріпи техніку."
        ]
      : [
          "Підбір ваги: 2-3 розминкові підходи, потім 8-10 чистих повторів із RIR 2-3.",
          "Якщо всі робочі підходи у верхній межі і техніка чиста - наступного разу +2.5 кг.",
          "Якщо лишається менше 2 повторів у запасі - вагу не додавати.",
          "Робочий тиждень: тримай RIR 1-2, але без відмови.",
          "Додай вагу тільки якщо рух стабільний у всіх підходах.",
          "Контрольний тиждень: мінус 10-20% ваги або об'єму, техніка понад его."
        ];

    return cues[weekInfo.week - 1] || cues[0];
  }

  function updateStrengthPercentExercise(updated, weekInfo, oneRM) {
    let source1RM = 0;
    const name = updated.name.toLowerCase();
    if (name.includes("жим")) source1RM = oneRM.bench;
    else if (name.includes("присідання")) source1RM = oneRM.squat;
    else if (name.includes("тяга")) source1RM = oneRM.deadlift;

    if (!source1RM) return updated;

    const match = updated.percentText.match(/(\d+)%/);
    if (!match) return updated;

    const basePercent = Number(match[1]) / 100;
    const loadFactor = updated.shortLoadFactor || 1;
    const baseWeight = roundTo2_5(source1RM * basePercent * loadFactor);
    const finalWeight = Math.max(0, baseWeight + (updated.shortSession ? 0 : weekInfo.baseKg));
    updated.weightText = formatWeight(finalWeight);
    updated.percentText = Math.round((finalWeight / source1RM) * 100) + "% від 1ПМ";
    return updated;
  }

  function progressExercise(exercise, goal, weekInfo, oneRM, isAccessory) {
    const updated = Object.assign({}, exercise);

    if (updated.shortSession && isAccessory) {
      updated.percentText = "Коротка сесія: залиш поточну знижену вагу, повертай навантаження поступово після адаптації.";
      return updated;
    }

    if (updated.shortSession && !isAccessory && !(updated.percentText && updated.percentText.indexOf("% РІС–Рґ 1РџРњ") !== -1)) {
      updated.percentText = "Коротка сесія: залиш поточну знижену вагу, повернення навантаження — поступово після стабільного RIR.";
      return updated;
    }

    if (updated.progressionType === "gymBeginnerStrength" || updated.progressionType === "gymBeginnerStrengthAccessory") {
      updated.percentText = getGymBeginnerStrengthProgression(updated, weekInfo);
    } else if (updated.progressionType === "prison" || updated.progressionType === "conditioning") {
      if (updated.progressionPlan && updated.progressionPlan[weekInfo.week - 1]) {
        updated.percentText = updated.progressionPlan[weekInfo.week - 1];
      }
    } else if (updated.progressionType === "outdoor") {
      if (goal === "strength") {
        const strengthProgression = getOutdoorStrengthProgression(updated, weekInfo);

        if (strengthProgression) {
          updated.reps = strengthProgression.reps;
          updated.weightText = strengthProgression.weightText;
          updated.percentText = strengthProgression.percentText;
        } else {
          updated.percentText = getOutdoorProgressionCue(updated, weekInfo);
        }
      } else if (goal === "fatloss") {
        if (updated.weightText && updated.weightText.indexOf("рюкзак") !== -1) {
          updated.weightText = "власна вага / резина за потреби";
        }

        updated.percentText = getOutdoorFatLossProgression(updated, weekInfo);
      } else {
        updated.percentText = getOutdoorProgressionCue(updated, weekInfo);
      }
    } else if (!isAccessory && updated.percentText && updated.percentText.indexOf("% від 1ПМ") !== -1) {
      updateStrengthPercentExercise(updated, weekInfo, oneRM);
    } else if (!isAccessory) {
      if (weekInfo.week === 2) updated.percentText = "додай 2.5 кг або 1 повтор";
      if (weekInfo.week === 3) updated.percentText = "ще +2.5 кг за чистої техніки";
      if (weekInfo.week === 4) updated.percentText = goal === "strength" ? "робота щільно, без зриву техніки" : "стабільна робота";
      if (weekInfo.week === 5) updated.percentText = "ще +2.5 кг за готовності";
      if (weekInfo.week === 6) updated.percentText = "полегшений контрольний тиждень";
    } else if (weekInfo.accessoryKg > 0) {
      updated.percentText = updated.percentText + " | +" + weekInfo.accessoryKg + " кг цього тижня";
    } else if (weekInfo.week === 4 && goal === "fatloss") {
      updated.percentText = updated.percentText + " | без форсування, тримай темп";
    } else if (weekInfo.week === 6 && goal === "strength") {
      updated.percentText = updated.percentText + " | без додавання ваги";
    } else {
      updated.percentText = updated.percentText + " | залиш поточну вагу";
    }

    return updated;
  }

  function applyWeekProgression(baseDays, goal, weekInfo, oneRM) {
    const weekDays = deepClone(baseDays);
    const safeOneRM = oneRM || {};
    const isDeload = (goal === "strength" && weekInfo.week === 6) ||
      ((goal === "mass" || goal === "fatloss" || goal === "endurance" || goal === "support") && weekInfo.week === 4);

    function reduceVolume(value) {
      if (value === null || value === undefined || value === "") return value;
      return String(value).replace(/(\d+)(?:-(\d+))?/g, function (match, lowText, highText) {
        const low = Math.max(1, Math.floor(Number(lowText) * 0.7));
        if (!highText) return String(low);
        const high = Math.max(low, Math.floor(Number(highText) * 0.7));
        return low + "-" + high;
      });
    }

    weekDays.forEach(function (day) {
      const isOutdoorDay =
        (day.basic || []).some(function (exercise) { return exercise.progressionType === "outdoor"; }) ||
        (day.accessory || []).some(function (exercise) { return exercise.progressionType === "outdoor"; });

      day.badge = weekInfo.label;

      if (day.basic && day.basic.length) {
        day.basic = day.basic.map(function (exercise) {
          return progressExercise(exercise, goal, weekInfo, safeOneRM, false);
        });
      }

      if (day.accessory && day.accessory.length) {
        day.accessory = day.accessory.map(function (exercise) {
          return progressExercise(exercise, goal, weekInfo, safeOneRM, true);
        });
      }

      if (isDeload) {
        ["basic", "accessory"].forEach(function (group) {
          (day[group] || []).forEach(function (exercise) {
            exercise.sets = reduceVolume(exercise.sets);
            if (exercise.setsLabel) exercise.setsLabel = reduceVolume(exercise.setsLabel);
            exercise.percentText = (exercise.percentText || "") + " | полегшений тиждень: мінус близько 30% обсягу";
          });
        });
        day.cardio = day.cardio || [];
        day.cardio.push("Полегшений тиждень: залиш техніку, ходьбу й відновлення; не додавай вагу.");
      }

      if (goal === "fatloss") {
        if (isOutdoorDay) {
          day.cardio = [
            "Ходьба 40-60 хв у легкому темпі після тренування або в окремий день.",
            "Без додаткової ваги у підтягуваннях і брусах: головна ціль — прибрати резину."
          ];
        } else {
          day.cardio = [
            "Кардіо 2 рази на тиждень по " + weekInfo.cardioMinutes + " хв",
            "Швидкість комфортна, без закислення"
          ];
        }
      }
    });

    return weekDays;
  }

  system.trainingProgression = {
    getWeekScheme: getWeekScheme,
    applyWeekProgression: applyWeekProgression,
    getOutdoorProgressionCue: getOutdoorProgressionCue,
    getOutdoorStrengthProgression: getOutdoorStrengthProgression,
    getOutdoorFatLossProgression: getOutdoorFatLossProgression,
    getGymBeginnerStrengthProgression: getGymBeginnerStrengthProgression
  };

  window.VitalRiseSystem = system;
})();
