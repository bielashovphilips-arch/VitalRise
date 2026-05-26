(function () {
  const system = window.VitalRiseSystem || {};

  function getTrainingModule() {
    return window.VitalRiseSystem && window.VitalRiseSystem.training
      ? window.VitalRiseSystem.training
      : null;
  }

  function getTrainingGoalLabel(goal) {
    const training = getTrainingModule();
    return training ? training.getTrainingGoalLabel(goal) : "Тренувальна ціль";
  }

  function getTrainingPlaceLabel(place) {
    const training = getTrainingModule();
    return training ? training.getTrainingPlaceLabel(place) : "Формат";
  }

  function getTrainingLevelLabel(level) {
    const training = getTrainingModule();
    return training ? training.getTrainingLevelLabel(level) : "Рівень";
  }

  function getTrainingFocusLabel(place, goal, level) {
    const training = getTrainingModule();
    return training ? training.getTrainingFocusLabel(place, goal, level) : "стабільна форма і контроль техніки";
  }

  function getTrainingRirRules(goal, place) {
    if (goal === "strength") {
      return [
        "Базові вправи: RIR 1-2, без відмови у важких підходах.",
        "Якщо техніка пливе, вага не додається навіть при потрібних повторах.",
        place === "outdoor"
          ? "Підтягування і бруси з вагою виконуються тільки з повною амплітудою."
          : "Допоміжні вправи тримай у RIR 2-3, щоб не забивати відновлення."
      ];
    }

    if (goal === "mass") {
      return [
        "Основні вправи: RIR 1-3.",
        "Допоміжні вправи: RIR 0-2, ближче до відмови тільки в останньому підході.",
        "Не піднімай вагу, якщо через це скорочується амплітуда."
      ];
    }

    if (goal === "endurance") {
      return [
        "Перші підходи тримай із запасом 2-4 повтори.",
        "Не всі підходи до відмови: головна ціль - витримати об'єм.",
        "Прогрес іде через підходи, повтори, щільність і коротший відпочинок."
      ];
    }

    if (goal === "fatloss") {
      return [
        "Працюй у RIR 2-3, без гонитви за рекордами.",
        "Залишай силу в базових рухах, але не форсуй додаткову вагу.",
        place === "outdoor"
          ? "Головний прогрес - прибрати резину і додати ходьбу 40-60 хв."
          : "Кардіо додається так, щоб не ламати силові тренування."
      ];
    }

    return [
      "Тримай RIR 2-4 у більшості підходів.",
      "Працюй технічно, без постійної відмови.",
      "Підвищуй навантаження тільки коли рух стабільний."
    ];
  }

  function getTrainingProgressionRules(goal, place) {
    if (place === "home" && goal === "strength") {
      return [
        "Якщо верх діапазону виконано чисто - додай 2.5-5 кг у рюкзак або ускладни варіацію.",
        "Для ніг пріоритет: болгарські, пістолет до опори, румунська тяга на одній нозі.",
        "Не гони повтори вище 20: після цього потрібна вага, повільніший темп або складніша механіка."
      ];
    }

    if (place === "home" && goal === "mass") {
      return [
        "Тримай 5-8 робочих підходів на основні рухи для середнього/просунутого рівня.",
        "Спочатку добери 15-20 повторів, потім додавай рюкзак, резину або важчу варіацію.",
        "Баланс жим/тяга обов'язковий, інакше верх швидко почне просідати по плечах і спині."
      ];
    }

    if (place === "home") {
      return [
        "Прогресуй через вагу рюкзака, сильнішу резину, складнішу варіацію або додатковий підхід.",
        "Для силової витривалості поступово виходь до 8-10 підходів, але без падіння техніки.",
        "Якщо вправа стала легкою на 20 повторів, вона вже не основна - її треба ускладнити."
      ];
    }

    if (place === "outdoor" && goal === "strength") {
      return [
        "Підтягування: якщо виконав верх діапазону чисто - наступного тижня +2.5 кг.",
        "Бруси: якщо виконав верх діапазону чисто - наступного тижня +5 кг.",
        "Після додавання ваги діапазон повторів зменшується, а максимум у сеті не женеться вище 20."
      ];
    }

    if (place === "outdoor" && goal === "fatloss") {
      return [
        "Додаткова вага не додається.",
        "Спочатку переходь на слабшу резину, потім прибирай резину повністю.",
        "Ходьба 40-60 хв - базове кардіо без зайвого стресу."
      ];
    }

    if (place === "outdoor" || goal === "endurance") {
      return [
        "Коли верх діапазону дається чисто, додай 1 підхід або скороти відпочинок.",
        "Роби до 8-10 підходів поступово, без різкого стрибка об'єму.",
        "Додаткова вага з'являється тільки після стабільних 15-20 якісних повторів."
      ];
    }

    if (goal === "strength") {
      return [
        "Якщо виконав верх діапазону з потрібним RIR - додай 2.5-5 кг наступного тижня.",
        "Якщо не виконав нижню межу - залиш вагу або зменш об'єм.",
        "Допоміжні вправи прогресують повільніше: +1 повтор або невелика вага."
      ];
    }

    if (goal === "mass") {
      return [
        "Спочатку добери верх діапазону повторів, потім додавай вагу.",
        "Для ізоляції достатньо +1-2 повтори або найменший крок ваги.",
        "Об'єм росте тільки якщо сон і відновлення не просідають."
      ];
    }

    return [
      "Підвищуй навантаження малими кроками.",
      "Не додавай вагу, якщо техніка або самопочуття стали гіршими.",
      "Краще стабільний прогрес 4 тижні, ніж різкий стрибок на одному тренуванні."
    ];
  }

  function getTrainingDeloadRules(goal, place) {
    const rules = [
      "2 тренування поспіль нижче нижньої межі повторів - мінус 20-30% об'єму на тиждень.",
      "Біль у плечі, лікті, коліні або спині - прибрати відмову і спростити рух.",
      "Сон, пульс і відчуття втоми важливіші за план на папері."
    ];

    if (goal === "strength") {
      rules.push("Якщо верх діапазону не виконано - вагу не додавати.");
    }

    if (goal === "endurance" || place === "outdoor") {
      rules.push("Якщо темп і техніка падають, не додавай новий підхід цього тижня.");
    }

    if (goal === "fatloss") {
      rules.push("При сильній втомі зменш силовий об'єм, але залиш легку ходьбу.");
    }

    return rules;
  }

  function getTrainingAdaptationRules(goal, place, level) {
    const rules = [
      "Перші 2 тижні не женись за максимумом: головний тест - стабільна техніка, однакова амплітуда і прогнозований RIR.",
      "Починай із нижньої межі підходів у плані. Додатковий підхід з'являється тільки якщо сон, суглоби і робочі повтори не просіли.",
      "Крепатура не є ціллю. Якщо біль у м'язах заважає руху 48+ годин, наступне тренування роби без збільшення об'єму."
    ];

    if (level === "beginner") {
      rules.unshift("Новачку перші тижні потрібна не агресія, а навчання рухам: вага має дозволяти повторити техніку від підходу до підходу.");
    }

    if (goal === "strength") {
      rules.push("Для сили адаптація йде через якість важких повторів: RIR 2-3 на старті циклу, без тесту максимуму.");
    } else if (goal === "mass") {
      rules.push("Для набору не збільшуй об'єм різко: спершу добери верх діапазону повторів, потім додавай вагу або підхід.");
    } else if (goal === "fatloss") {
      rules.push("Для зниження ваги силові тримають м'язи: не перетворюй кожне тренування на кардіо і не працюй до відмови в кожному сеті.");
    }

    if (place === "outdoor" || place === "home") {
      rules.push("У власній вазі складність піднімай поступово: слабша резина, більша амплітуда, пауза, рюкзак - тільки по одному важелю за раз.");
    }

    return rules;
  }

  function getTrainingQualityRules(goal, place) {
    const rules = [
      "Робочий підхід зараховується тільки якщо амплітуда не скоротилась і темп не перетворився на ривок.",
      "RIR має бути чесним: якщо планував RIR 2, але ледве закрив повтор - це не прогрес, а сигнал залишити навантаження.",
      "Біль у суглобі, оніміння або різкий дискомфорт - причина змінити вправу, амплітуду або об'єм, а не терпіти."
    ];

    if (goal === "strength") {
      rules.push("Для сили якість важливіша за сумарну втому: довгі паузи і чистий повтор кращі за поспішну щільність.");
    } else if (goal === "mass") {
      rules.push("Для гіпертрофії контролюй цільовий м'яз і стабільну траєкторію; допоміжні вправи можна вести ближче до відмови, але не ціною техніки.");
    } else if (goal === "fatloss") {
      rules.push("Для схуднення якість - це збереження сили. Якщо силові різко падають, дефіцит або об'єм тренувань завеликі.");
    }

    if (place === "outdoor") {
      rules.push("На турніку і брусах не зараховуй повтори з провалом плеча, неповною амплітудою або болем у лікті.");
    }

    return rules;
  }

  function getTrainingNextStepRules(goal, place, level) {
    const rules = [
      "Через 14 днів звір: робочі повтори, RIR, біль, сон і бажання тренуватись. Якщо 3 з 5 пунктів стабільні - можна прогресувати.",
      "Через 4 тижні обери один шлях: додати вагу, додати 1 підхід, ускладнити варіацію або зробити полегшений тиждень.",
      "Не збільшуй одночасно вагу, підходи і щільність. Один важіль прогресії за раз дає результат без зайвого ризику."
    ];

    if (goal === "strength") {
      rules.push("Якщо верх діапазону виконано з потрібним RIR у всіх робочих підходах - наступний цикл починай з +2.5-5 кг або нижчого діапазону повторів.");
    } else if (goal === "mass") {
      rules.push("Якщо памп, сила і відновлення стабільні - додай 1-2 робочі підходи на слабку групу або найменший крок ваги.");
    } else if (goal === "fatloss") {
      rules.push("Якщо вага знижується, а силові тримаються - тренування не посилюй; краще тримати кроки і сон стабільними.");
    } else if (goal === "endurance") {
      rules.push("Якщо техніка не падає - додай один підхід або трохи скороти відпочинок, але не обидва разом.");
    }

    if (level === "advanced") {
      rules.push("Просунутий рівень коригує план частіше, але малими кроками: приріст має бути помітний у журналі, а не тільки у відчуттях.");
    }

    if (place === "home" || place === "outdoor") {
      rules.push("Якщо повторів у сеті вже 20+ чисто, наступний крок - складніша механіка або додаткова вага, а не нескінченні повтори.");
    }

    return rules;
  }

  function getTrainingCorrectionRules(goal, place, metrics) {
    const painStatus = metrics && metrics.painStatus ? metrics.painStatus : "none";
    const rules = [
      "Якщо 2 тренування поспіль нижче плану по повтореннях - не додавай навантаження, зменш об'єм на 20-30% на 1 тиждень.",
      "Якщо сон погіршився, мотивація впала і пульс/втома вищі звичного - прибери відмовні підходи й залиш технічну роботу.",
      "Якщо прогрес легкий і відновлення нормальне - додавай мінімальний крок: +1 повтор, +1 підхід або +2.5-5 кг залежно від вправи."
    ];

    if (painStatus !== "none") {
      rules.unshift("Через біль корекція перша: заміни провокуючу вправу, зменш амплітуду або прибери 1-2 підходи до стабілізації.");
    }

    if (goal === "fatloss") {
      rules.push("При схудненні не карай себе додатковим об'ємом, якщо силові падають: кроки й харчування коригуються раніше, ніж важкі підходи.");
    } else if (goal === "mass") {
      rules.push("При наборі, якщо силові стоять і апетит/сон нормальні, спершу додай повтори або калорії, а не нескінченний об'єм.");
    } else if (goal === "strength") {
      rules.push("При силовій цілі невдалий день не переписує цикл: корекція потрібна після повторного провалу або падіння швидкості/техніки.");
    }

    if (place === "outdoor") {
      rules.push("Для брусів і підтягувань перша корекція - менше відмови і чистіша амплітуда; додаткова вага повертається останньою.");
    }

    return rules;
  }

  function buildTrainingGuidance(config) {
    const safeConfig = config || {};
    const place = safeConfig.place;
    const goal = safeConfig.goal;
    const level = safeConfig.level;
    const days = safeConfig.days || 0;
    const duration = safeConfig.duration || 0;
    const metrics = safeConfig.outdoorMetrics || {};
    const oneRM = safeConfig.oneRM || {};
    const warnings = [];
    const training = getTrainingModule();

    if (metrics.painStatus && metrics.painStatus !== "none") {
      warnings.push("Є обмеження або біль: програма зменшує ризик, але гострий біль треба вирішувати з фахівцем.");

      if (training) {
        warnings.push.apply(warnings, training.getPainGuidance(metrics.painStatus));
      }
    }

    if (place === "outdoor" && !metrics.pullupsMax && !metrics.dipsMax && !metrics.pushupsMax) {
      warnings.push("Для точнішого вуличного плану введи максимум підтягувань, брусів і віджимань.");
    }

    if (place === "gym" && goal === "strength" && level !== "beginner" && (!oneRM.bench || !oneRM.squat || !oneRM.deadlift)) {
      warnings.push("Для силового залу без 1ПМ ваги будуть орієнтовними, а не персональними.");
    }

    if (place === "gym" && goal === "strength" && level === "beginner") {
      warnings.push("Новачку не потрібно тестувати 1ПМ: стартова вага підбирається через чисті повтори і запас RIR 2-3.");
    }

    if (duration && duration < 45) {
      warnings.push("До 45 хв краще залишити базові вправи і скоротити частину допоміжних.");
    }

    if (place === "outdoor" && days >= 5 && (goal === "strength" || goal === "endurance")) {
      warnings.push("5+ вуличних тренувань вимагають контролю ліктів і плечей: не роби всі дні важкими.");
    }

    let rirRules = getTrainingRirRules(goal, place);
    let progressionRules = getTrainingProgressionRules(goal, place);

    if (place === "gym" && goal === "strength" && level === "beginner") {
      rirRules = [
        "Робоча вага для новачка: 8-10 чистих повторів і ще 2-3 повтори в запасі.",
        "Якщо останні повтори ламають техніку - вага завелика, зменш на 5-10%.",
        "Не тестуй максимум 1ПМ: перші тижні сила росте через техніку і стабільність."
      ];

      progressionRules = [
        "Підхід 1: дуже легко 10 повторів, просто відчути рух.",
        "Підхід 2: додай трохи ваги і зроби 6-8 повторів без втоми.",
        "Робоча вага: та, з якою 8-10 повторів чисті і лишається RIR 2-3.",
        "Якщо всі 3 підходи зроблені по верхній межі - наступного разу +2.5 кг у верхніх вправах або +5 кг у ногах/тренажерах."
      ];
    }

    return {
      format: getTrainingPlaceLabel(place),
      goal: getTrainingGoalLabel(goal),
      level: getTrainingLevelLabel(level),
      focus: getTrainingFocusLabel(place, goal, level),
      rirRules: rirRules,
      progressionRules: progressionRules,
      deloadRules: getTrainingDeloadRules(goal, place),
      coachBlocks: [
        {
          label: "Адаптація",
          title: "Перші 2-4 тижні",
          items: getTrainingAdaptationRules(goal, place, level)
        },
        {
          label: "Якість",
          title: "Що контролювати",
          items: getTrainingQualityRules(goal, place)
        },
        {
          label: "Наступний крок",
          title: "Після контрольного блоку",
          items: getTrainingNextStepRules(goal, place, level)
        },
        {
          label: "Корекція",
          title: "Як змінювати план",
          items: getTrainingCorrectionRules(goal, place, metrics)
        }
      ],
      warnings: warnings
    };
  }

  system.trainingGuidance = {
    getTrainingRirRules: getTrainingRirRules,
    getTrainingProgressionRules: getTrainingProgressionRules,
    getTrainingDeloadRules: getTrainingDeloadRules,
    buildTrainingGuidance: buildTrainingGuidance
  };

  window.VitalRiseSystem = system;
})();
