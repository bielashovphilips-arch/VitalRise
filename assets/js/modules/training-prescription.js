(function () {
  const system = window.VitalRiseSystem || {};
  const VERSION = 1;
  const progressionCue = "Додай найменший доступний крок ваги лише після верхньої межі повторів у всіх підходах із заданим RIR, стабільною технікою та без болю. Без цих умов залиш вагу; календар сам по собі не є підставою для прогресії.";

  function count(value) {
    const match = String(value || "").match(/^\s*(\d+)/);
    return match ? Number(match[1]) : 1;
  }

  // Explicit isolation patterns: an accessory label alone does not imply isolation.
  function isolationRegion(exercise) {
    const name = String(exercise.name || "").toLowerCase();
    if (/розгинання ніг|згинання ніг|відведення стегна|зведення стегна/.test(name)) return "legs";
    if (/розгинання рук|трицепс/.test(name) && !/жим|віджим/.test(name)) return "push";
    if (/згинання рук|біцепс|молот/.test(name)) return "pull";
    if (/зведення.*(рук|кросовер)|розведення гантелей лежачи/.test(name)) return "push";
    if (/махи.*(сторон|бік)|підйоми через сторони/.test(name)) return "push";
    if (/задн.*дельт|розведення.*нахил/.test(name)) return "pull";
    return null;
  }

  function mainRegions(day) {
    const names = (day.basic || []).map(function (ex) { return ex.name; }).join(" ").toLowerCase();
    return {
      legs: /присі|випад|ног|румун|станов|хіп|сіднич/.test(names),
      push: /жим|віджим|брус/.test(names),
      pull: /підтяг|тяга верх|тяга.*пояс|тяга штанги|тяга гантел|тяга горизонт|тяга ниж/.test(names)
    };
  }

  function structured(exercise) {
    return /^(\d+)(\s*[-–]\s*\d+)?$/.test(String(exercise.sets || "")) &&
      /^\d+(\s*[-–]\s*\d+)?(\s*(на ногу|на руку|на сторону))?$/.test(String(exercise.reps || "")) &&
      !/conditioning|prison/.test(exercise.progressionType || "");
  }

  function estimateMinutes(day) {
    // Reserve includes general warm-up, ramp-up sets and equipment transitions.
    return 10 + (day.orderedExercises || []).reduce(function (sum, ex) {
      const rest = ex.restSeconds || 120;
      const unilateral = /на ногу|на руку|на сторону|болгар|одній|одною/.test(ex.reps + " " + ex.name);
      const values = String(ex.reps).match(/\d+/g) || [12];
      const seconds = /сек|хв/.test(ex.reps)
        ? Number(values[values.length - 1]) * (/хв/.test(ex.reps) ? 60 : 1)
        : Number(values[values.length - 1]) * 3 * (unilateral ? 2 : 1);
      return sum + (count(ex.sets) * (seconds + rest) + 45) / 60;
    }, 0);
  }

  function prepareDay(source, context) {
    const day = JSON.parse(JSON.stringify(source));
    if (day.restDay || context.protocol) return day;
    const regions = mainRegions(day);
    const allowPreparation = context.goal !== "strength" && context.goal !== "endurance";
    const preparationLimit = context.level === "beginner" || context.duration <= 45 ? 1 : 2;
    const setCap = context.level === "beginner" ? 2 : context.level === "advanced" ? 4 : 3;
    const weeklyFactor = Math.min(1, 3 / Math.max(3, context.days));
    const preparation = [];
    const main = [];
    const accessory = [];

    ["basic", "accessory"].forEach(function (group) {
      (day[group] || []).forEach(function (ex, index) {
        ex.sourceGroup = group;
        ex.sourceIndex = index;
        ex.prescriptionVersion = VERSION;
        const region = isolationRegion(ex);
        const prep = allowPreparation && group === "accessory" && region && regions[region] &&
          structured(ex) && preparation.length < preparationLimit;
        ex.phase = prep ? "preparation" : group === "basic" ? "main" : "accessory";
        ex.prescriptionKey = [VERSION, context.goal, ex.phase, ex.name].join(":");
        ex.targetRir = prep ? 3 : 2;
        const compound = !region && /жим|віджим|брус|тяга|підтяг|присі|випад|хіп|міст/.test(ex.name.toLowerCase());
        ex.restSeconds = compound ? (context.goal === "strength" ? 180 : 150) : 90;
        ex.restText = compound ? (context.goal === "strength" ? "180-240 сек" : "120-180 сек") : "60-120 сек";
        ex.muscleGroupLabel = prep ? "Допоміжний блок перед базою" : group === "basic" ? "Базові вправи" : "Допоміжні вправи";
        ex.sets = String(Math.max(1, Math.min(count(ex.sets), prep ? 2 : Math.max(2, Math.floor(setCap * weeklyFactor)))));
        delete ex.setsLabel;
        if (prep) {
          ex.reps = "12-20";
          ex.weightText = "Підбери вагу із запасом 3-4 повторення";
        } else if (group === "basic" && allowPreparation) {
          // A fresh 1RM cannot prescribe a fixed load after a new preparation block.
          ex.weightText = "Підбери вагу сьогодні: RIR 2-3";
        }
        ex.percentText = (prep ? "Після загальної розминки; RIR 3-4, без відмови. " :
          group === "basic" ? "Спочатку підвідні підходи; робочі підходи з RIR 2-3. " : "RIR 2-3. ") + progressionCue;
        (prep ? preparation : group === "basic" ? main : accessory).push(ex);
      });
    });

    day.orderedExercises = preparation.concat(main, accessory);
    const duration = Number(context.duration) || 60;
    // Remove excess sets first, then low-priority movements. Never shorten rest to fit.
    while (estimateMinutes(day) > duration) {
      const reducible = day.orderedExercises.slice().reverse().find(function (ex) { return count(ex.sets) > 2; });
      if (reducible) { reducible.sets = String(count(reducible.sets) - 1); continue; }
      const removable = day.orderedExercises.slice().reverse().find(function (ex) { return ex.phase === "accessory"; }) ||
        (main.filter(function (ex) { return day.orderedExercises.includes(ex); }).length > 2
          ? day.orderedExercises.slice().reverse().find(function (ex) { return ex.phase === "main"; }) : null) ||
        day.orderedExercises.find(function (ex) { return ex.phase === "preparation"; });
      if (!removable) {
        const finalReduction = day.orderedExercises.slice().reverse().find(function (ex) { return count(ex.sets) > 1; });
        if (finalReduction) { finalReduction.sets = String(count(finalReduction.sets) - 1); continue; }
        break;
      }
      day.orderedExercises = day.orderedExercises.filter(function (ex) { return ex !== removable; });
    }
    // One authoritative set of objects; no duplicate preparation work at the end.
    day.basic = day.orderedExercises.filter(function (ex) { return ex.sourceGroup === "basic"; });
    day.accessory = day.orderedExercises.filter(function (ex) { return ex.sourceGroup === "accessory"; });
    day.estimatedMinutes = Math.ceil(estimateMinutes(day));
    day.durationLimited = day.estimatedMinutes > duration;
    day.cardio = day.cardio || [];
    day.cardio.push("Спочатку загальна розминка; перед кожним базовим рухом — підвідні підходи. Паузи можна подовжити до відновлення техніки й дихання.");
    day.cardio.push("Орієнтовна тривалість силової частини з розминкою: " + day.estimatedMinutes + " хв. Кардіо — окремо; за нестачі часу скороти допоміжну роботу, не відпочинок.");
    if (day.durationLimited) day.cardio.push("Для збереження розминки й відпочинку цьому заняттю потрібно більше часу, ніж обрано. Не прискорюй техніку заради таймера.");
    if (!preparation.some(function (ex) { return day.orderedExercises.includes(ex); }) && allowPreparation) {
      day.cardio.push("У цьому занятті немає відповідної ізоляції або бракує часу: не додавай нових вправ лише заради передвтомлення.");
    }
    return day;
  }

  function schedulePpl(days, requestedDays, weekIndex) {
    const source = days.filter(function (day) { return !day.restDay; });
    return Array.from({ length: requestedDays }, function (_, index) {
      const day = JSON.parse(JSON.stringify(source[(weekIndex * requestedDays + index) % source.length]));
      day.title = day.title.replace(/^День\s+\d+/, "Заняття " + (index + 1));
      day.cardio = (day.cardio || []).filter(function (text) { return !/дня|день|День|наступн|масаж|8 год/.test(text); });
      return day;
    });
  }

  system.trainingPrescription = {
    version: VERSION, progressionCue: progressionCue, prepareDay: prepareDay,
    schedulePpl: schedulePpl, estimateMinutes: estimateMinutes, structured: structured
  };
  window.VitalRiseSystem = system;
})();
