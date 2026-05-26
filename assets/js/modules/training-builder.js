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

  function buildTrainingPlan(data) {
    const place = data["training-place"];
    const level = data["training-level"];
    const goal = data["training-goal"];
    const programMode = data["training-program-mode"] || "neutral";
    const cyclePhase = data["cycle-phase"] || "none";
    const isFemaleMode = programMode.indexOf("female_") === 0;
    const isPrisonMode = programMode === "prison_workout";
    const isTabataCircuitMode = programMode === "tabata_circuit";
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

    let caloriesBurned = calculateTrainingCalories(place, goal, bodyWeight, duration);
    if (isPrisonMode) caloriesBurned *= 1.08;
    if (isTabataCircuitMode) caloriesBurned *= 1.18;
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
        weeks: []
      };
    }

    if (isPrisonMode) {
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
    const weeks = weekScheme.map(function (weekInfo) {
      return {
        title: weekInfo.label,
        days: trainingProgression
          ? trainingProgression.applyWeekProgression(basePlan, goal, weekInfo, oneRM)
          : deepClone(basePlan)
      };
    });

    let volumeNote = "";

    if (isPrisonMode) {
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
          ? "Вулична сила: якщо виконав робочий діапазон чисто, наступного тижня підтягування +2.5 кг, бруси +5 кг, а діапазон повторів зменшується. Понад 20 повторів у сеті не женемо: після верхньої межі додаємо складність або вагу."
          : goal === "fatloss"
            ? "Вуличне схуднення: додаткова вага не додається. Головна прогресія — прибрати резину, робити чисті повтори без знімання навантаження і додати просту ходьбу 40-60 хв."
            : "Вуличний план побудований навколо силової витривалості: турнік, бруси, резина, власна вага й рюкзак. Прогресія йде через більше чистих повторів, більше підходів, коротший відпочинок, меншу допомогу резини і тільки потім додаткову вагу.";
    } else if (place === "home" && goal === "strength") {
      volumeNote =
        "Домашня сила не будується на легких віджиманнях і присіданнях. План використовує рюкзак, резину, важкі варіації, односторонні ноги і діапазон до 20 повторів, після якого треба додавати складність або вагу.";
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

    if (place === "outdoor") {
      tips.unshift(
        "Головна довга ціль для власної ваги — не тільки важчий рюкзак, а поступовий вихід до 8-10 якісних підходів.",
        "Діапазон повторів у брусах і віджиманнях не піднімаємо вище 20: після верхньої межі додається складність або вага.",
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
        place: place,
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
        "Якщо повторів вже багато, ускладнюй варіацію або додавай рюкзак, а не гони хаотичний темп."
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

    return {
      caloriesBurned: caloriesBurned,
      volumeNote: volumeNote,
      tips: tips,
      guidance: guidance,
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
