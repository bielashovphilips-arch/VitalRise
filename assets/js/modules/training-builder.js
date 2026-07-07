(function () {
  const system = window.VitalRiseSystem || {};
  const $ = system.$ || function (id) { return document.getElementById(id); };

  document.addEventListener("DOMContentLoaded", function () {
    const trainingForm = $("training-form");
    const trainingResult = $("training-result");
    const trainingReset = $("training-reset");

    function parseTrainingNumber(value) {
      if (value === null || value === undefined || value === "") return 0;
      const parsed = Number(String(value).replace(",", "."));
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function roundValue(value) {
      return Math.round(value);
    }

    function formatKcal(value) {
      return roundValue(value) + " ккал";
    }

    function deepClone(data) {
      return JSON.parse(JSON.stringify(data));
    }
  function calculateTrainingCalories(place, goal, weight, duration) {
    return window.VitalRiseSystem && window.VitalRiseSystem.training
      ? window.VitalRiseSystem.training.calculateTrainingCalories(place, goal, weight, duration)
      : 0;
  }

  function buildBasicExercise(name, sets, reps, oneRM, percent) {
    return window.VitalRiseSystem && window.VitalRiseSystem.training
      ? window.VitalRiseSystem.training.buildBasicExercise(name, sets, reps, oneRM, percent)
      : { name: name, sets: sets, reps: reps, weightText: "без ваги", percentText: "без %" };
  }

  function buildAccessoryExercise(name, sets, reps, progression, weightText) {
    return window.VitalRiseSystem && window.VitalRiseSystem.training
      ? window.VitalRiseSystem.training.buildAccessoryExercise(name, sets, reps, progression, weightText)
      : { name: name, sets: sets, reps: reps, weightText: weightText || "підбирається індивідуально", percentText: progression };
  }

  function buildOutdoorExercise(name, sets, reps, weightText, progressionPlan) {
    return window.VitalRiseSystem && window.VitalRiseSystem.training
      ? window.VitalRiseSystem.training.buildOutdoorExercise(name, sets, reps, weightText, progressionPlan)
      : { name: name, sets: sets, reps: reps, weightText: weightText, percentText: progressionPlan[0], progressionType: "outdoor", progressionPlan: progressionPlan };
  }

  function getDefaultRestText(exercise, group, context) {
    const place = context.place;
    const goal = context.goal;
    const level = context.level;
    const text = [
      exercise.name,
      exercise.reps,
      exercise.weightText,
      exercise.percentText
    ].join(" ").toLowerCase();

    if (text.indexOf("робота /") !== -1 || text.indexOf("work /") !== -1) return "за протоколом вправи";
    if (text.indexOf("emom") !== -1 || text.indexOf("щохвилини") !== -1) return "за таймером";
    if (text.indexOf("коло") !== -1 || text.indexOf("раун") !== -1 || text.indexOf("суперсет") !== -1) return "60-90 сек між колами";

    if (place === "gym") {
      if (goal === "strength" && group === "basic") return level === "beginner" ? "120-180 сек" : "180-240 сек";
      if (group === "basic") return goal === "fatloss" || goal === "endurance" ? "60-90 сек" : "90-150 сек";
      return goal === "fatloss" || goal === "endurance" ? "45-75 сек" : "60-90 сек";
    }

    if (place === "outdoor") {
      if (goal === "strength" && group === "basic") return "120-180 сек";
      if (goal === "fatloss" || goal === "endurance") return "60-75 сек";
      if (group === "basic") return "90 сек";
      return "60-90 сек";
    }

    if (goal === "strength" && group === "basic") return "90 сек";
    if (goal === "fatloss" || goal === "endurance") return "60-75 сек";
    return group === "basic" ? "90 сек" : "60-90 сек";
  }

  function annotateRestInDays(days, context) {
    return deepClone(days).map(function (day) {
      ["basic", "accessory"].forEach(function (group) {
        if (!Array.isArray(day[group])) return;
        day[group].forEach(function (exercise) {
          if (!exercise.restText) exercise.restText = getDefaultRestText(exercise, group, context);
        });
      });
      return day;
    });
  }

  const muscleGroupMeta = {
    chest: { label: "Груди", rank: 10 },
    back: { label: "Спина", rank: 20 },
    legs: { label: "Ноги", rank: 30 },
    shoulders: { label: "Плечі", rank: 40 },
    triceps: { label: "Трицепс", rank: 50 },
    biceps: { label: "Біцепс", rank: 60 },
    core: { label: "Корпус / прес", rank: 70 },
    calves: { label: "Литки", rank: 80 },
    conditioning: { label: "Фінішер / кардіо", rank: 90 },
    other: { label: "Додатково", rank: 100 }
  };

  function getExerciseMuscleGroup(exercise) {
    const text = [
      exercise && exercise.name,
      exercise && exercise.percentText
    ].join(" ").toLowerCase();

    if (/зведення стегна|відведення стегна|кроки на підвищення|кроки вбік|розкриття стегон/.test(text)) return "legs";
    if (/зведення|груд|жим лежачи|жим гантелей лежачи|жим гантелей під кутом|жим в хамері|віджимання/.test(text)) return "chest";
    if (/підтяг|тяга верх|тяга ниж|тяга горизонт|тяга т-грифа|тяга штанги|тяга сидячи|тяга до поясу|найширш|спина|пуловер/.test(text)) return "back";
    if (/присі|ног|випад|болгар|румун|станов|згинання ніг|розгинання ніг|хіп-траст|сіднич|стегн|жим ногами/.test(text)) return "legs";
    if (/плеч|дельт|махи|підйоми через сторони|тяга до підборіддя|жим штанги або гантелей сидячи|плечовий жим|жим сидячи/.test(text)) return "shoulders";
    if (/трицепс|розгинання рук|вузький жим|брус/.test(text)) return "triceps";
    if (/біцепс|згинання рук|молот/.test(text)) return "biceps";
    if (/прес|планка|корпус|скручування|підйом.*ніг|hollow|антиобертання/.test(text)) return "core";
    if (/литк|носки/.test(text)) return "calves";
    if (/кардіо|ходьба|велосипед|фінішер|emom|коло|інтервал/.test(text)) return "conditioning";
    return "other";
  }

  function buildGymExerciseSequence(day) {
    const exercises = [];
    ["basic", "accessory"].forEach(function (group) {
      (day[group] || []).forEach(function (exercise, index) {
        const muscleGroup = getExerciseMuscleGroup(exercise);
        const meta = muscleGroupMeta[muscleGroup] || muscleGroupMeta.other;
        exercises.push(Object.assign({}, exercise, {
          sourceGroup: group,
          sourceIndex: index,
          muscleGroup: muscleGroup,
          muscleGroupLabel: meta.label
        }));
      });
    });

    if (!exercises.length) return [];

    const firstGroup = exercises[0].muscleGroup;
    return exercises.sort(function (left, right) {
      const leftPrimary = left.muscleGroup === firstGroup ? 0 : 1;
      const rightPrimary = right.muscleGroup === firstGroup ? 0 : 1;
      if (leftPrimary !== rightPrimary) return leftPrimary - rightPrimary;

      const leftRank = (muscleGroupMeta[left.muscleGroup] || muscleGroupMeta.other).rank;
      const rightRank = (muscleGroupMeta[right.muscleGroup] || muscleGroupMeta.other).rank;
      if (leftRank !== rightRank) return leftRank - rightRank;

      if (left.sourceGroup !== right.sourceGroup) return left.sourceGroup === "basic" ? -1 : 1;
      return left.sourceIndex - right.sourceIndex;
    });
  }

  function applyGymExerciseSequence(days, enabled) {
    if (!enabled) return days;
    return days.map(function (day) {
      const nextDay = Object.assign({}, day);
      nextDay.orderedExercises = buildGymExerciseSequence(day);
      return nextDay;
    });
  }

  const programLabels = {
    neutral: "Універсальна",
    prison_workout: "Вулична сила / драбинки",
    tabata_circuit: "Інтервали 1:1 / кругове",
    ppl_3_1: "PPL 3+1: штовхай / тягни / ноги",
    female_balanced: "Жіноча збалансована",
    female_glutes: "Жіноча: сідниці та ноги",
    female_strength: "Жіноча силова",
    female_fatloss: "Жіноча для зниження жиру"
  };

  function getProgramLabel(mode) {
    return programLabels[mode] || programLabels.neutral;
  }

  function buildProgramRecommendation(data, outdoorMetrics) {
    const place = data["training-place"];
    const level = data["training-level"];
    const goal = data["training-goal"];
    const days = Number(data["training-days"]);
    const duration = Number(data["duration"]);
    const selectedMode = data["training-program-mode"] || "neutral";
    const cyclePhase = data["cycle-phase"] || "none";
    const painStatus = outdoorMetrics.painStatus || "none";
    const hasPainOrFatigue = painStatus !== "none";
    const selectedIsManual = selectedMode !== "neutral";

    let recommendedMode = "neutral";
    let confidence = "стандартна";
    const reasons = [];

    if (cyclePhase !== "none") {
      if (goal === "fatloss") {
        recommendedMode = "female_fatloss";
        reasons.push("врахована фаза циклу і ціль зниження жиру");
      } else if (goal === "strength") {
        recommendedMode = "female_strength";
        reasons.push("врахована фаза циклу і силова ціль");
      } else if (goal === "mass") {
        recommendedMode = "female_glutes";
        reasons.push("врахована фаза циклу і ціль набору/форми нижньої частини");
      } else {
        recommendedMode = "female_balanced";
        reasons.push("врахована фаза циклу, тому потрібен контроль об'єму і самопочуття");
      }
      confidence = "висока";
    } else if (place === "gym" && goal === "mass" && level !== "beginner" && days >= 4 && !hasPainOrFatigue) {
      recommendedMode = "ppl_3_1";
      confidence = "висока";
      reasons.push("зал, набір м'язів, 4 тренувальні дні і достатній рівень підготовки");
      reasons.push("PPL 3+1 краще працює під високий калораж, якщо відновлення не просідає");
    } else if (place === "outdoor" && (goal === "strength" || goal === "endurance")) {
      recommendedMode = "prison_workout";
      confidence = "висока";
      reasons.push("вуличний формат краще розкривається через драбинки, турнік, бруси і контроль об'єму");
    } else if ((goal === "fatloss" || goal === "endurance") && duration <= 50 && !hasPainOrFatigue) {
      recommendedMode = "tabata_circuit";
      confidence = "середня";
      reasons.push("коротка сесія і ціль витрати енергії краще підходять для інтервалів або кругового формату");
    } else if (place === "home" && (goal === "fatloss" || goal === "endurance") && !hasPainOrFatigue) {
      recommendedMode = "tabata_circuit";
      confidence = "середня";
      reasons.push("домашній формат без великого обладнання добре працює через щільність і контроль темпу");
    } else {
      recommendedMode = "neutral";
      confidence = "стабільна";
      reasons.push("універсальна програма краще підходить, коли потрібна базова структура без вузької спеціалізації");
    }

    if (hasPainOrFatigue && recommendedMode === "ppl_3_1") {
      recommendedMode = "neutral";
      confidence = "обережна";
      reasons.push("через біль або сильну втому PPL краще не форсувати");
    }

    if (hasPainOrFatigue) {
      reasons.push("обмеження у формі зменшують пріоритет агресивних схем і збільшують роль корекції навантаження");
    }

    const appliedMode = selectedIsManual ? selectedMode : recommendedMode;
    const summary = selectedIsManual
      ? (selectedMode === recommendedMode
        ? "Обраний вручну тип збігається з рекомендацією."
        : "Ти обрав тип вручну. Нижче показана рекомендація системи для порівняння.")
      : (recommendedMode === "neutral"
        ? "Система залишила універсальну програму як найстабільніший варіант."
        : "Система автоматично застосувала рекомендований тип програми.");

    return {
      selectedMode: selectedMode,
      recommendedMode: recommendedMode,
      appliedMode: appliedMode,
      selectedLabel: getProgramLabel(selectedMode),
      recommendedLabel: getProgramLabel(recommendedMode),
      appliedLabel: getProgramLabel(appliedMode),
      confidence: confidence,
      summary: summary,
      reasons: reasons
    };
  }

  function buildTrainingPlan(data) {
    const place = data["training-place"];
    const level = data["training-level"];
    const goal = data["training-goal"];
    const cyclePhase = data["cycle-phase"] || "none";
    const days = Number(data["training-days"]);
    const bodyWeight = Number(data["body-weight"]);
    const duration = Number(data["duration"]);
    const outdoorMetrics = {
      pullupsMax: parseTrainingNumber(data["pullups-max"]),
      dipsMax: parseTrainingNumber(data["dips-max"]),
      pushupsMax: parseTrainingNumber(data["pushups-max"]),
      equipment: data["training-equipment"] || "bands_backpack",
      painStatus: data["pain-status"] || "none"
    };

    const oneRM = {
      bench: Number(data["bench-1rm"]),
      squat: Number(data["squat-1rm"]),
      deadlift: Number(data["deadlift-1rm"])
    };

    const programRecommendation = buildProgramRecommendation(data, outdoorMetrics);
    const programMode = programRecommendation.appliedMode;
    const isFemaleMode = programMode.indexOf("female_") === 0;
    const isPrisonMode = programMode === "prison_workout";
    const isTabataCircuitMode = programMode === "tabata_circuit";
    const isPplMode = programMode === "ppl_3_1";

    let caloriesBurned = calculateTrainingCalories(isPplMode ? "gym" : place, goal, bodyWeight, duration);
    if (isPrisonMode) caloriesBurned *= 1.08;
    if (isTabataCircuitMode) caloriesBurned *= 1.18;
    if (isPplMode) caloriesBurned *= 1.05;
    const trainingTemplates = window.VitalRiseSystem && window.VitalRiseSystem.trainingTemplates
      ? window.VitalRiseSystem.trainingTemplates
      : null;

    let basePlan = [];

    if (!trainingTemplates) {
      return {
        caloriesBurned: caloriesBurned,
        volumeNote: "Не вдалося завантажити шаблони тренувань. Онови сторінку і спробуй ще раз.",
        tips: [],
        guidance: {
          format: "Тренування",
          goal: "Програма",
          level: "Адаптивний",
          focus: "Контроль техніки",
          rirRules: [],
          progressionRules: [],
          deloadRules: [],
          warnings: ["Модуль шаблонів тренувань не завантажився."]
        },
        programRecommendation: programRecommendation,
        weeks: []
      };
    }

    if (isPplMode) {
      basePlan = trainingTemplates.getGymPushPullLegsPlan(goal, level, oneRM, days);
    } else if (isPrisonMode) {
      basePlan = trainingTemplates.getPrisonWorkoutPlan(level, days, outdoorMetrics);
    } else if (isTabataCircuitMode) {
      basePlan = trainingTemplates.getTabataCircuitPlan(goal, level, days, duration);
    } else if (isFemaleMode) {
      basePlan = trainingTemplates.getFemaleBasePlan(programMode, place, level, days, goal, cyclePhase);
    } else if (place === "gym") {
      if (level === "beginner") {
        basePlan = trainingTemplates.getGymBeginnerBasePlan(days);
        if (goal === "strength") {
          basePlan = trainingTemplates.applyGymBeginnerStrengthWeightCues(basePlan);
        }
      } else {
        basePlan = trainingTemplates.getGymIntermediateAdvancedBasePlan(goal, days, oneRM, level);
      }
    } else if (place === "outdoor") {
      basePlan = trainingTemplates.getOutdoorBasePlan(goal, level, days, outdoorMetrics);
    } else {
      basePlan = trainingTemplates.getHomeBasePlan(goal, level, days, outdoorMetrics);
    }

    basePlan = trainingTemplates.applyTrainingConstraints(basePlan, outdoorMetrics);

    const trainingProgression = window.VitalRiseSystem && window.VitalRiseSystem.trainingProgression
      ? window.VitalRiseSystem.trainingProgression
      : null;
    const weekScheme = trainingProgression
      ? trainingProgression.getWeekScheme(goal)
      : [{ week: 1, label: "Тиждень 1 — стабільний старт", baseKg: 0, accessoryKg: 0, cardioMinutes: 0 }];
    const useGymExerciseSequence = (isPplMode || (!isPrisonMode && !isTabataCircuitMode && place === "gym"));
    const weeks = weekScheme.map(function (weekInfo) {
      const weekDays = trainingProgression
        ? annotateRestInDays(trainingProgression.applyWeekProgression(basePlan, goal, weekInfo, oneRM), { place: isPplMode ? "gym" : place, goal: goal, level: level })
        : annotateRestInDays(basePlan, { place: isPplMode ? "gym" : place, goal: goal, level: level });

      return {
        title: weekInfo.label,
        days: applyGymExerciseSequence(weekDays, useGymExerciseSequence)
      };
    });

    let volumeNote = "";

    if (isPplMode) {
      volumeNote =
        "PPL 3+1 - це один із найкращих форматів для набору м'язів під великий калораж: 3 базові тренування поспіль (штовхай верх, тягни верх, ноги), 1 день відпочинку, потім 3 тренажерні дні з легко-середньою вагою. Тренажерні дні не мають добивати нервову систему: їх задача - об'єм, техніка, памп і відновлювана прогресія. Обов'язкова умова - сон від 8 годин і мінімум масаж як регулярна відновлювальна процедура.";
    } else if (isPrisonMode) {
      volumeNote =
        "Вулична сила / драбинки - це режим без складного обладнання: драбинки, кола, власна вага і контроль об'єму. Він підходить для дисципліни, витривалості і жорсткого, але керованого навантаження.";
    } else if (isTabataCircuitMode) {
      volumeNote =
        "Інтервали 1:1 / кругове тренування дають коротку інтенсивну роботу для пульсу, витрати енергії і щільності. Час відпочинку дорівнює часу роботи, тому навантаження залишається керованим.";
    } else if (isFemaleMode) {
      volumeNote = trainingTemplates.getFemaleVolumeNote(programMode, cyclePhase);
    } else if (place === "outdoor") {
      volumeNote =
        goal === "strength"
          ? "Вулична сила: якщо робочий діапазон виконаний чисто, наступний тиждень уже прописує нижчий діапазон повторів і контрольовану вагу. Понад 20 повторів у сеті не женемо: спочатку тримаємо амплітуду й поступово скорочуємо відпочинок між підходами."
          : goal === "fatloss"
            ? "Вуличне схуднення: додаткова вага не додається. Головна прогресія — прибрати резину, робити чисті повтори без знімання навантаження і додати просту ходьбу 40-60 хв."
            : "Вуличний план побудований навколо силової витривалості: турнік, бруси, резина, власна вага й рюкзак. Прогресія йде через більше чистих повторів, більше підходів, коротший відпочинок, меншу допомогу резини і тільки потім додаткову вагу.";
    } else if (place === "home" && goal === "strength") {
      volumeNote =
        "Домашня сила не будується на легких віджиманнях і присіданнях. План використовує рюкзак, резину, важкі варіації, односторонні ноги, контроль темпу і заданий відпочинок між підходами.";
    } else if (place === "home" && goal === "mass") {
      volumeNote =
        "Домашній набір маси потребує достатнього об'єму: для середнього і просунутого рівня основні рухи мають 5-8 робочих підходів, а прогрес іде через рюкзак, резину, амплітуду і складніші варіації.";
    } else if (place === "home" && goal === "endurance") {
      volumeNote =
        "Домашня силова витривалість будується не на легкій зарядці, а на поступовому виході до 8-10 якісних підходів, з контролем техніки і без відмови в кожному сеті.";
    } else if (place === "gym" && goal === "strength" && level === "beginner") {
      volumeNote =
        "Для новачка в залі силовий план починається не з 1ПМ, а з підбору безпечної робочої ваги: 8-10 чистих повторів із запасом 2-3 повтори. Якщо техніка ламається, вага завелика; якщо легко зробив би ще 5+ повторів, вага замала.";
    } else if (place === "gym" && goal === "strength") {
      volumeNote =
        "Об’єм зміщений у сторону базових вправ, щоб тримати силовий стимул без зайвого сміттєвого навантаження.";
    } else if (place === "gym" && goal === "mass") {
      volumeNote =
        "Об’єм побудований так, щоб вистачало і базового навантаження, і допоміжної роботи для росту м’язів.";
    } else if (goal === "endurance") {
      volumeNote =
        "Цикл силової витривалості: прогресуй через якісні повтори, більшу кількість підходів, коротший відпочинок і стабільну техніку, а не через максимальну вагу.";
    } else if (goal === "fatloss") {
      volumeNote =
        "Об’єм достатній для витрати енергії, але без перевантаження по відновленню.";
    } else {
      volumeNote =
        "Програма орієнтована на стабільну форму, контроль техніки та поступове навантаження.";
    }

    const tips = [
      "План побудований одразу на весь цикл, а не на один день.",
      "Базові вправи відокремлені від допоміжних — допоміжні не прив’язані до 1ПМ.",
      "Для допоміжних вправ використовуй плавну прогресію: +1 повтор, або +1-2 кг, або +2.5-5% за тиждень.",
      "Якщо техніка сиплеться — не додавай вагу, спочатку стабілізуй виконання."
    ];

    if (isFemaleMode) {
      tips.unshift.apply(tips, trainingTemplates.getFemaleTips(programMode, cyclePhase));
    }

    if (isPrisonMode) {
      tips.unshift(
        "У режимі вуличної сили прогрес - це більше чистих кіл або сходинок, а не постійна робота до відмови.",
        "Драбинку зупиняй до зриву техніки: плечі, лікті і поперек важливіші за цифру.",
        "Якщо підтягування ще слабкі, використовуй австралійські підтягування або резину."
      );
    }

    if (isTabataCircuitMode) {
      tips.unshift(
        "Інтервали 1:1 мають бути короткими і чистими: якщо техніка сиплеться, зменш темп або обери легшу вправу.",
        "Кругові тренування не замінюють усю силову базу, але добре додають витрату енергії і витривалість.",
        "При болю в колінах або спині прибирай стрибки, берпі роби через крок назад."
      );
    }

    if (isPplMode) {
      tips.unshift(
        "Це пріоритетний варіант для набору м'язів, коли є високий калораж, достатньо білка і нормальне відновлення.",
        "Сон - від 8 годин. Якщо стабільно спиш менше, не форсуй PPL 3+1: спочатку зменш об'єм або обери універсальну програму.",
        "З відновлювальних процедур мінімум має бути масаж: 1 раз на тиждень або частіше за відчуттями, особливо ноги, спина, грудний відділ і плечовий пояс.",
        "У PPL 3+1 не став важкі рекорди шість разів поспіль: важкі тільки перші 3 базові дні, друга половина циклу - тренажери легко-середньо.",
        "Схема циклу: День 1 штовхай, День 2 тягни, День 3 ноги, День 4 відпочинок, День 5 штовхай тренажери, День 6 тягни тренажери, День 7 ноги тренажери, потім відпочинок або повтор за готовністю.",
        "Якщо сон, апетит або суглоби просідають - прибери 1-2 допоміжні вправи з тренажерних днів, а не чіпай техніку бази."
      );
    }

    if (place === "outdoor") {
      tips.unshift(
        "Головна довга ціль для власної ваги — не тільки важчий рюкзак, а поступовий вихід до 8-10 якісних підходів.",
        "Довга ціль по відпочинку - поступово прийти до 1 хв між підходами, але тільки без втрати амплітуди, темпу і контролю плечей/ліктів.",
        "Якщо в плані є піднята вага або рюкзак, пріоритет - якісна вага і чисті повтори; відпочинок тримай близько 1.5 хв.",
        "Діапазон повторів у брусах і віджиманнях не піднімаємо вище 20: після верхньої межі тримай план і скорочуй відпочинок між підходами на 10-15 сек поступово.",
        "Для підтягувань і брусів головний критерій прогресу: чиста амплітуда без болю в плечі або лікті.",
        "Резина — це інструмент прогресії: з часом переходь на слабшу допомогу, а не просто женись за кількістю.",
        "Не роби всі підходи до відмови. Для великого об'єму залишай 1-3 повтори в запасі."
      );
    }

    if (place === "home") {
      tips.unshift(
        "Для дому легкі варіації швидко стають замалими: після 15-20 чистих повторів переходь на рюкзак, резину, вищі ноги, паузи або односторонній рух.",
        "Середній і просунутий рівень мають тримати достатній об'єм: основні рухи 5-8 підходів, для витривалості поступово до 8-10.",
        "Ноги вдома не замінюються простими присіданнями: використовуй болгарські, випади, пістолет до опори, румунську тягу на одній нозі."
      );
    }

    const guidance = window.VitalRiseSystem && window.VitalRiseSystem.trainingGuidance
      ? window.VitalRiseSystem.trainingGuidance.buildTrainingGuidance({
        place: isPplMode ? "gym" : place,
        level: place === "outdoor" || place === "home" ? trainingTemplates.getOutdoorEffectiveLevel(level, outdoorMetrics) : level,
        goal: goal,
        days: days,
        duration: duration,
        outdoorMetrics: outdoorMetrics,
        oneRM: oneRM
      })
      : {
        format: "Тренування",
        goal: "Програма",
        level: "Адаптивний",
        focus: "Контроль техніки",
        rirRules: [],
        progressionRules: [],
        deloadRules: [],
        warnings: []
      };

    if (isFemaleMode) {
      guidance.format = trainingTemplates.getFemaleProgramLabel(programMode);
      guidance.focus = trainingTemplates.getFemaleProgramLabel(programMode);
      guidance.progressionRules = trainingTemplates.getFemaleProgressionRules(programMode, cyclePhase).concat(guidance.progressionRules || []);
      guidance.deloadRules = trainingTemplates.getFemaleDeloadRules(cyclePhase).concat(guidance.deloadRules || []);
      guidance.warnings = trainingTemplates.getFemaleWarnings(programMode, cyclePhase).concat(guidance.warnings || []);
    }

    if (isPrisonMode) {
      guidance.format = "Вулична сила / драбинки";
      guidance.focus = "драбинки, кола і дисципліна власної ваги";
      guidance.rirRules = [
        "Не роби всі кола до відмови: залишай 1-2 повтори в запасі.",
        "Якщо амплітуда скорочується, раунд зупиняється або спрощується.",
        "Для підтягувань і брусів головний контроль - плечі й лікті без гострого болю."
      ];
      guidance.progressionRules = [
        "Додай одну сходинку в драбинці або одне коло тільки після чистого тижня.",
        "Скорочуй відпочинок поступово: 10-15 секунд за раз.",
        "Якщо повторів вже багато, не гони хаотичний темп: тримай діапазон і скорочуй відпочинок поступово."
      ];
      guidance.deloadRules = [
        "Якщо лікті або плечі забиті - мінус 30% кіл і без відмови.",
        "Після контрольного дня наступне тренування зроби легшим.",
        "При сильній втомі залиш мобільність, ходьбу і легку техніку."
      ];
    }

    if (isTabataCircuitMode) {
      guidance.format = "Інтервали 1:1 / кругове";
      guidance.focus = "пульс, щільність і чиста техніка";
      guidance.rirRules = [
        "Перший блок не має бути максимальним: залиш запас, щоб не розвалити наступні раунди.",
        "Інтенсивність піднімай темпом, а не кривою технікою.",
        "Якщо дихання не відновлюється між блоками, зменш темп або кількість блоків."
      ];
      guidance.progressionRules = [
        "Додай блок, коло або 5 секунд роботи тільки після стабільного виконання.",
        "Скорочуй відпочинок малими кроками, без різкого стрибка інтенсивності.",
        "Для жироспалення важлива регулярність тижня, а не одне героїчне тренування."
      ];
      guidance.deloadRules = [
        "Якщо пульс довго не опускається або сон погіршився - прибери один блок.",
        "При болю у суглобах заміни стрибки на варіанти без ударного навантаження.",
        "Не став Табату важкою щодня: залиш дні відновлення."
      ];
    }

    if (isPplMode) {
      guidance.format = "PPL 3+1: штовхай / тягни / ноги";
      guidance.focus = "3 базові дні + 3 тренажерні дні легко-середньо";
      guidance.rirRules = [
        "Базові дні: тримай RIR 1-2, без відмови у присіданні, жимі й важких тягах.",
        "Тренажерні дні: RIR 2-3, відчуй м'яз, але не добивайся до стану, коли наступний базовий цикл сиплеться.",
        "Якщо після дня ніг потрібен повний день відпочинку - це частина схеми 3+1, а не слабкість."
      ];
      guidance.progressionRules = [
        "Для набору м'язів прогрес має йти на фоні великого калоражу, стабільного білка і сну від 8 годин.",
        "У базових вправах додавай вагу тільки після чистого верхнього діапазону повторів.",
        "У тренажерах прогресуй спочатку повтором і амплітудою, потім малим кроком ваги.",
        "Після трьох важких базових днів не став четверте важке тренування: наступний блок має бути легше-середнім."
      ];
      guidance.deloadRules = [
        "Якщо немає 8 годин сну кілька днів поспіль - не прогресуй вагу, залиш поточний об'єм або зменш допоміжні вправи.",
        "Масаж - мінімальна відновлювальна процедура для цього режиму; якщо м'язи й фасції постійно забиті, прогресія ваги відкладається.",
        "Якщо два цикли поспіль падають повтори у базі - мінус 20-30% допоміжного об'єму.",
        "Біль у плечі, лікті, коліні або попереку - заміни провокуючу вправу тренажером і зменш вагу.",
        "Кожні 4-6 тижнів зроби полегшений цикл: базу на RIR 3, тренажери без прогресії ваги."
      ];
      guidance.warnings = [
        "PPL 3+1 не підходить при сильній втомі, поганому сні або болю в суглобах без корекції об'єму.",
        "Якщо сон менше 8 годин, калораж низький або немає відновлювальних процедур, ця схема може швидше накопичувати втому, ніж давати м'язовий ріст.",
        "Не перетворюй тренажерні дні на другий важкий цикл: тоді схема перестає відновлюватися.",
        "Новачку краще стартувати з універсальної програми; PPL 3+1 логічніший для середнього і просунутого рівня."
      ].concat(guidance.warnings || []);
    }

    return {
      caloriesBurned: caloriesBurned,
      volumeNote: volumeNote,
      tips: tips,
      guidance: guidance,
      programRecommendation: programRecommendation,
      weeks: weeks
    };
  }

  function renderTrainingResult(result) {
    trainingResult.innerHTML =
      window.VitalRiseSystem && window.VitalRiseSystem.trainingRender
        ? window.VitalRiseSystem.trainingRender.renderTrainingResult(result, { formatKcal: formatKcal })
        : '<div class="result-placeholder">Не вдалося сформувати план. Перевір параметри та спробуй ще раз.</div>';
  }

  if (trainingForm) {
    trainingForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(trainingForm);
      const data = Object.fromEntries(formData.entries());
      const result = buildTrainingPlan(data);

      renderTrainingResult(result);
    });
  }

  if (trainingReset) {
    trainingReset.addEventListener("click", function () {
      trainingForm.reset();
      const trainingPlace = document.getElementById("training-place");
      if (trainingPlace) trainingPlace.dispatchEvent(new Event("change", { bubbles: true }));
      trainingResult.innerHTML =
        '<div class="result-placeholder">Обери параметри тренування та натисни «Сформувати план».</div>';
    });
  }

    system.trainingBuilder = {
      buildTrainingPlan: buildTrainingPlan,
      renderTrainingResult: renderTrainingResult
    };
    window.VitalRiseSystem = system;
  });
})();
