(function () {
  const system = window.VitalRiseSystem || {};

  function deepClone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function getTrainingModule() {
    return window.VitalRiseSystem && window.VitalRiseSystem.training
      ? window.VitalRiseSystem.training
      : null;
  }

  function buildBasicExercise(name, sets, reps, oneRM, percent) {
    const training = getTrainingModule();
    return training
      ? training.buildBasicExercise(name, sets, reps, oneRM, percent)
      : { name: name, sets: sets, reps: reps, weightText: "без ваги", percentText: "без %" };
  }

  function buildAccessoryExercise(name, sets, reps, progression, weightText) {
    const training = getTrainingModule();
    return training
      ? training.buildAccessoryExercise(name, sets, reps, progression, weightText)
      : { name: name, sets: sets, reps: reps, weightText: weightText || "підбирається індивідуально", percentText: progression };
  }

  function buildOutdoorExercise(name, sets, reps, weightText, progressionPlan) {
    const training = getTrainingModule();
    return training
      ? training.buildOutdoorExercise(name, sets, reps, weightText, progressionPlan)
      : { name: name, sets: sets, reps: reps, weightText: weightText, percentText: progressionPlan[0], progressionType: "outdoor", progressionPlan: progressionPlan };
  }
  function applyTrainingConstraints(basePlan, constraints) {
    const painStatus = constraints && constraints.painStatus ? constraints.painStatus : "none";
    if (painStatus === "none") return basePlan;

    const plan = deepClone(basePlan);
    const painNotes = {
      shoulder: "Плече: не йди глибоко в брусах, прибери біль, залиш 2-3 повтори в запасі.",
      elbow: "Лікоть: без ривків, зменш об'єм брусів/підтягувань на 20%, додай розминку передпліч.",
      knee: "Коліно: випади й присідання тільки в безболісній амплітуді, без стрибків.",
      back: "Поперек: без різкого прогину, контроль корпуса, менше вправ із рюкзаком.",
      fatigue: "Сильна втома: мінус 20-30% підходів цього тижня, без роботи до відмови."
    };

    plan.forEach(function (day) {
      day.cardio = day.cardio || [];
      day.cardio.push(painNotes[painStatus] || painNotes.fatigue);
    });

    return plan;
  }

  function getGymBeginnerBasePlan(days) {
    const templates = [
      {
        title: "День 1 — все тіло",
        badge: "базова адаптація",
        basic: [
          { name: "Присідання з власною вагою / гоблет-присід", sets: "3", reps: "10-12", weightText: "контроль техніки", percentText: "базова вправа" },
          { name: "Жим у тренажері або віджимання", sets: "3", reps: "8-12", weightText: "контроль техніки", percentText: "базова вправа" }
        ],
        accessory: [
          buildAccessoryExercise("Тяга верхнього блоку", "3", "10-12", "плавна прогресія щотижня"),
          buildAccessoryExercise("Гіперекстензія", "2-3", "12-15", "додавай повторення"),
          buildAccessoryExercise("Планка", "3", "30-45 сек", "збільшуй час")
        ]
      },
      {
        title: "День 2 — все тіло",
        badge: "контроль техніки",
        basic: [
          { name: "Жим гантелей лежачи", sets: "3", reps: "8-12", weightText: "контроль техніки", percentText: "базова вправа" },
          { name: "Румунська тяга з гантелями", sets: "3", reps: "8-10", weightText: "контроль техніки", percentText: "базова вправа" }
        ],
        accessory: [
          buildAccessoryExercise("Тяга горизонтального блоку", "3", "10-12", "плавна прогресія щотижня"),
          buildAccessoryExercise("Випади", "2-3", "10 на ногу", "додавай повторення"),
          buildAccessoryExercise("Скручування", "3", "12-15", "додавай повторення")
        ]
      },
      {
        title: "День 3 — все тіло",
        badge: "поступове навантаження",
        basic: [
          { name: "Жим ногами", sets: "3", reps: "10-12", weightText: "контроль техніки", percentText: "базова вправа" },
          { name: "Жим сидячи в тренажері", sets: "3", reps: "8-10", weightText: "контроль техніки", percentText: "базова вправа" }
        ],
        accessory: [
          buildAccessoryExercise("Тяга верхнього блоку вузьким хватом", "3", "10-12", "плавна прогресія щотижня"),
          buildAccessoryExercise("Згинання ніг", "3", "12-15", "плавна прогресія щотижня"),
          buildAccessoryExercise("Підйом колін", "3", "12-15", "додавай повторення")
        ]
      }
    ];

    if (days === 2) return templates.slice(0, 2);
    if (days === 4) return [templates[0], templates[1], templates[2], deepClone(templates[0])];
    return templates;
  }

  function applyGymBeginnerStrengthWeightCues(basePlan) {
    const plan = deepClone(basePlan);
    const basicCue = "підбір: RIR 2-3";
    const accessoryCue = "легко-середньо: RIR 2-3";
    const basicProgression = "Старт: 2-3 розминкові підходи, потім робоча вага на 8-10 чистих повторів із запасом 2-3 повтори.";
    const accessoryProgression = "Обери вагу, з якою верх діапазону дається без ривків і залишається 2-3 повтори в запасі.";

    plan.forEach(function (day) {
      (day.basic || []).forEach(function (exercise) {
        exercise.weightText = basicCue;
        exercise.percentText = basicProgression;
        exercise.progressionType = "gymBeginnerStrength";
      });

      (day.accessory || []).forEach(function (exercise) {
        exercise.weightText = accessoryCue;
        exercise.percentText = accessoryProgression;
        exercise.progressionType = "gymBeginnerStrengthAccessory";
      });
    });

    return plan;
  }

  function getGymIntermediateAdvancedBasePlan(goal, days, oneRM, level) {
    const isStrength = goal === "strength";
    const isMass = goal === "mass";
    const isAdvanced = level === "advanced";

    const benchPercent = isStrength ? 0.80 : isMass ? 0.72 : 0.65;
    const squatPercent = isStrength ? 0.80 : isMass ? 0.75 : 0.67;
    const deadliftPercent = isStrength ? 0.78 : isMass ? 0.72 : 0.65;

    const mainReps = isStrength ? "4-6" : isMass ? "6-10" : "8-12";
    const mainSets = isStrength ? "5" : "4";

    if (!isAdvanced) {
      if (days === 2) {
        return [
          {
            title: "День 1 — верх",
            badge: "середній рівень",
            basic: [
              buildBasicExercise("Жим лежачи", mainSets, mainReps, oneRM.bench, benchPercent)
            ],
            accessory: [
              buildAccessoryExercise("Жим гантелей під кутом", "3-4", "8-12", "щотижня +2.5 кг"),
              buildAccessoryExercise("Тяга верхнього блоку", "3-4", "8-12", "щотижня +2.5 кг"),
              buildAccessoryExercise("Махи через сторони", "3-4", "12-15", "щотижня +1-2 кг"),
              buildAccessoryExercise("Біцепс стоячи з гантелями", "3", "10-12", "щотижня +1-2 кг"),
              buildAccessoryExercise("Розгинання в кросовері на трицепс", "3", "10-12", "щотижня +1-2 кг")
            ]
          },
          {
            title: "День 2 — низ",
            badge: "середній рівень",
            basic: [
              buildBasicExercise("Присідання", mainSets, mainReps, oneRM.squat, squatPercent)
            ],
            accessory: [
              buildAccessoryExercise("Розгинання ніг", "3-4", "12-15", "щотижня +2.5 кг"),
              buildAccessoryExercise("Згинання ніг", "3-4", "12-15", "щотижня +2.5 кг"),
              buildAccessoryExercise("Жим ногами", "3-4", "10-12", "щотижня +5-10 кг"),
              buildAccessoryExercise("Прес", "3-4", "12-20", "додавай повторення"),
              buildAccessoryExercise("Гіперекстензія", "3", "12-15", "додавай повторення або +2.5 кг")
            ]
          }
        ];
      }

      if (days === 3) {
        return [
          {
            title: "День 1 — груди + руки",
            badge: "середній рівень",
            basic: [
              buildBasicExercise("Жим лежачи", mainSets, mainReps, oneRM.bench, benchPercent)
            ],
            accessory: [
              buildAccessoryExercise("Жим гантелей під кутом", "3-4", "8-12", "щотижня +2.5 кг"),
              buildAccessoryExercise("Розведення в тренажері / кросовері", "3-4", "10-15", "щотижня +2.5 кг"),
              buildAccessoryExercise("Згинання рук з EZ-штангою", "3-4", "8-12", "щотижня +2.5 кг"),
              buildAccessoryExercise("Розгинання рук на блоці", "3-4", "10-12", "щотижня +2.5 кг")
            ]
          },
          {
            title: "День 2 — ноги",
            badge: "середній рівень",
            basic: [
              buildBasicExercise("Присідання", mainSets, mainReps, oneRM.squat, squatPercent)
            ],
            accessory: [
              buildAccessoryExercise("Розгинання ніг", "3-4", "12-15", "щотижня +2.5 кг"),
              buildAccessoryExercise("Згинання ніг", "3-4", "12-15", "щотижня +2.5 кг"),
              buildAccessoryExercise("Жим ногами", "3-4", "10-12", "щотижня +5-10 кг"),
              buildAccessoryExercise("Прес", "3-4", "12-20", "додавай повторення"),
              buildAccessoryExercise("Гіперекстензія", "3", "12-15", "додавай повторення або +2.5 кг")
            ]
          },
          {
            title: "День 3 — спина + плечі",
            badge: "середній рівень",
            basic: [
              buildBasicExercise("Станова тяга", "4", isStrength ? "3-5" : "5-8", oneRM.deadlift, deadliftPercent)
            ],
            accessory: [
              buildAccessoryExercise("Тяга верхнього блоку", "3-4", "8-12", "щотижня +2.5 кг"),
              buildAccessoryExercise("Тяга нижнього блоку", "3-4", "8-12", "щотижня +2.5 кг"),
              buildAccessoryExercise("Махи гантелями в сторони", "3-4", "12-15", "щотижня +1-2 кг"),
              buildAccessoryExercise("Тяга до підборіддя", "3", "10-12", "щотижня +2.5 кг")
            ]
          }
        ];
      }

      return [
        {
          title: "День 1 — груди",
          badge: "середній рівень",
          basic: [
            buildBasicExercise("Жим лежачи", mainSets, mainReps, oneRM.bench, benchPercent)
          ],
          accessory: [
            buildAccessoryExercise("Жим в хамері під кутом", "3-4", "8-12", "щотижня +2.5-5 кг"),
            buildAccessoryExercise("Пуловер з гантеллю", "3", "10-12", "щотижня +2.5 кг"),
            buildAccessoryExercise("Зведення рук в кросовері", "3-4", "10-15", "щотижня +2.5 кг")
          ]
        },
        {
          title: "День 2 — ноги",
          badge: "середній рівень",
          basic: [
            buildBasicExercise("Присідання", mainSets, mainReps, oneRM.squat, squatPercent)
          ],
          accessory: [
            buildAccessoryExercise("Розгинання ніг", "3-4", "12-15", "щотижня +2.5 кг"),
            buildAccessoryExercise("Згинання ніг", "3-4", "12-15", "щотижня +2.5 кг"),
            buildAccessoryExercise("Жим ногами", "3-4", "10-12", "щотижня +5-10 кг"),
            buildAccessoryExercise("Прес", "3-4", "12-20", "додавай повторення"),
            buildAccessoryExercise("Гіперекстензія", "3", "12-15", "додавай повторення або +2.5 кг")
          ]
        },
        {
          title: "День 3 — плечі + руки",
          badge: "середній рівень",
          basic: [
            buildBasicExercise("Жим лежачи вузьким хватом", "4", "6-8", oneRM.bench, 0.67)
          ],
          accessory: [
            buildAccessoryExercise("Підйоми через сторони", "3-4", "12-15", "щотижня +1-2 кг"),
            buildAccessoryExercise("Тяга до підборіддя", "3-4", "10-12", "щотижня +2.5 кг"),
            buildAccessoryExercise("Біцепс стоячи з гантелями", "3-4", "10-12", "щотижня +1-2 кг"),
            buildAccessoryExercise("Розгинання в кросовері на трицепс з косичкою", "3-4", "10-12", "щотижня +2.5 кг"),
            buildAccessoryExercise("Підйом на біцепс молот", "3-4", "10-12", "щотижня +1-2 кг")
          ]
        },
        {
          title: "День 4 — спина",
          badge: "середній рівень",
          basic: [
            buildBasicExercise("Станова тяга", "4", isStrength ? "3-5" : "5-8", oneRM.deadlift, deadliftPercent)
          ],
          accessory: [
            buildAccessoryExercise("Тяга Т-грифа", "3-4", "8-12", "щотижня +2.5-5 кг"),
            buildAccessoryExercise("Тяга верхнього блоку", "3-4", "8-12", "щотижня +2.5 кг"),
            buildAccessoryExercise("Тяга нижнього блоку", "3-4", "8-12", "щотижня +2.5 кг")
          ]
        }
      ];
    }

    if (days === 2) {
      return [
        {
          title: "День 1 — силовий верх",
          badge: "просунутий рівень",
          basic: [
            buildBasicExercise("Жим лежачи", "5", "3-5", oneRM.bench, 0.82)
          ],
          accessory: [
            buildAccessoryExercise("Жим гантелей під кутом", "3-4", "8-10", "щотижня +2.5 кг"),
            buildAccessoryExercise("Тяга верхнього блоку", "3-4", "8-10", "щотижня +2.5 кг"),
            buildAccessoryExercise("Біцепс", "3", "8-12", "щотижня +1-2 кг"),
            buildAccessoryExercise("Трицепс", "3", "8-12", "щотижня +1-2 кг")
          ]
        },
        {
          title: "День 2 — силовий низ",
          badge: "просунутий рівень",
          basic: [
            buildBasicExercise("Присідання", "5", "3-5", oneRM.squat, 0.82),
            buildBasicExercise("Станова тяга", "4", "3-5", oneRM.deadlift, 0.78)
          ],
          accessory: [
            buildAccessoryExercise("Жим ногами", "3-4", "10-12", "щотижня +5-10 кг"),
            buildAccessoryExercise("Згинання ніг", "3-4", "10-12", "щотижня +2.5 кг"),
            buildAccessoryExercise("Прес", "3", "12-20", "додавай повторення")
          ]
        }
      ];
    }

    if (days === 3) {
      return [
        {
          title: "День 1 — груди + руки",
          badge: "просунутий рівень",
          basic: [
            buildBasicExercise("Жим лежачи", "5", isStrength ? "3-5" : "4-6", oneRM.bench, 0.80)
          ],
          accessory: [
            buildAccessoryExercise("Жим в хамері під кутом", "3-4", "8-12", "щотижня +2.5-5 кг"),
            buildAccessoryExercise("Згинання рук з EZ-штангою", "3-4", "8-12", "щотижня +2.5 кг"),
            buildAccessoryExercise("Розгинання рук на блоці", "3-4", "10-12", "щотижня +2.5 кг")
          ]
        },
        {
          title: "День 2 — ноги",
          badge: "просунутий рівень",
          basic: [
            buildBasicExercise("Присідання", "5", isStrength ? "3-5" : "4-6", oneRM.squat, 0.80)
          ],
          accessory: [
            buildAccessoryExercise("Розгинання ніг", "3-4", "12-15", "щотижня +2.5 кг"),
            buildAccessoryExercise("Згинання ніг", "3-4", "12-15", "щотижня +2.5 кг"),
            buildAccessoryExercise("Жим ногами", "3-4", "10-12", "щотижня +5-10 кг")
          ]
        },
        {
          title: "День 3 — спина + плечі",
          badge: "просунутий рівень",
          basic: [
            buildBasicExercise("Станова тяга", "4", isStrength ? "3-5" : "4-6", oneRM.deadlift, 0.78)
          ],
          accessory: [
            buildAccessoryExercise("Тяга Т-грифа", "3-4", "8-12", "щотижня +2.5-5 кг"),
            buildAccessoryExercise("Тяга верхнього блоку", "3-4", "8-12", "щотижня +2.5 кг"),
            buildAccessoryExercise("Тяга нижнього блоку", "3-4", "8-12", "щотижня +2.5 кг"),
            buildAccessoryExercise("Махи через сторони", "3-4", "12-15", "щотижня +1-2 кг")
          ]
        }
      ];
    }

    return [
      {
        title: "День 1 — жим важкий + присід легкий",
        badge: "просунутий силовий",
        basic: [
          buildBasicExercise("Жим лежачи", "5", "3-5", oneRM.bench, 0.82),
          buildBasicExercise("Присідання (легкий день)", "4", "6-8", oneRM.squat, 0.65)
        ],
        accessory: [
          buildAccessoryExercise("Жим в хамері під кутом", "3", "8-10", "щотижня +2.5 кг"),
          buildAccessoryExercise("Трицепс", "3", "10-12", "щотижня +1-2 кг")
        ]
      },
      {
        title: "День 2 — тяга",
        badge: "просунутий силовий",
        basic: [
          buildBasicExercise("Станова тяга", "4", "3-5", oneRM.deadlift, 0.80)
        ],
        accessory: [
          buildAccessoryExercise("Тяга Т-грифа", "3-4", "8-10", "щотижня +2.5-5 кг"),
          buildAccessoryExercise("Тяга верхнього блоку", "3-4", "8-12", "щотижня +2.5 кг"),
          buildAccessoryExercise("Тяга нижнього блоку", "3-4", "8-12", "щотижня +2.5 кг")
        ]
      },
      {
        title: "День 3 — жим легкий + присід важкий",
        badge: "просунутий силовий",
        basic: [
          buildBasicExercise("Жим лежачи (легкий день)", "4", "6-8", oneRM.bench, 0.67),
          buildBasicExercise("Присідання", "5", "3-5", oneRM.squat, 0.82)
        ],
        accessory: [
          buildAccessoryExercise("Плечі", "3-4", "10-15", "щотижня +1-2 кг"),
          buildAccessoryExercise("Прес", "3", "12-20", "додавай повторення")
        ]
      },
      {
        title: "День 4 — допоміжний день",
        badge: "просунутий силовий",
        basic: [],
        accessory: [
          buildAccessoryExercise("Підйоми через сторони", "3-4", "12-15", "щотижня +1-2 кг"),
          buildAccessoryExercise("Біцепс стоячи з гантелями", "3-4", "10-12", "щотижня +1-2 кг"),
          buildAccessoryExercise("Розгинання на трицепс", "3-4", "10-12", "щотижня +2.5 кг"),
          buildAccessoryExercise("Підйом на біцепс молот", "3-4", "10-12", "щотижня +1-2 кг")
        ]
      }
    ];
  }

  function getHomeBasePlan(goal, level, days) {
    const plans = [
      {
        title: "День 1 — верх тіла",
        badge: "домашній формат",
        basic: [
          { name: "Віджимання", sets: level === "beginner" ? "3" : "4", reps: goal === "strength" ? "6-10" : "10-15", weightText: "власна вага", percentText: "контроль техніки" }
        ],
        accessory: [
          buildAccessoryExercise("Тяга рюкзака / гантелі в нахилі", "3-4", "10-15", "щотижня +1-2 кг або +1 повтор", "довільно"),
          buildAccessoryExercise("Плечовий жим гантелей", "3", "10-12", "щотижня +1 кг", "довільно"),
          buildAccessoryExercise("Планка", "3", "30-60 сек", "збільшуй час", "-")
        ]
      },
      {
        title: "День 2 — ноги + корпус",
        badge: "стабільність",
        basic: [
          { name: "Присідання / присідання з рюкзаком", sets: level === "beginner" ? "3" : "4", reps: goal === "strength" ? "8-10" : "12-20", weightText: "довільно", percentText: "контроль техніки" }
        ],
        accessory: [
          buildAccessoryExercise("Випади", "3", "10-12 на ногу", "щотижня +1 повтор", "довільно"),
          buildAccessoryExercise("Румунська тяга з гантелями", "3", "10-12", "щотижня +1-2 кг", "довільно"),
          buildAccessoryExercise("Скручування", "3", "15-20", "додавай повторення", "-")
        ]
      },
      {
        title: "День 3 — змішаний день",
        badge: "загальний об’єм",
        basic: [
          { name: "Віджимання вузьким хватом", sets: "3-4", reps: "8-12", weightText: "власна вага", percentText: "контроль техніки" }
        ],
        accessory: [
          buildAccessoryExercise("Тяга до поясу", "3", "10-15", "щотижня +1 повтор", "довільно"),
          buildAccessoryExercise("Присідання з паузою", "3", "12-15", "щотижня +1 повтор", "довільно"),
          buildAccessoryExercise("Бокова планка", "3", "20-40 сек", "збільшуй час", "-")
        ]
      }
    ];

    if (days === 2) return plans.slice(0, 2);
    if (days === 4) return [plans[0], plans[1], plans[2], deepClone(plans[0])];
    return plans;
  }

  function getHomeBasePlan(goal, level, days, metrics) {
    const homeMetrics = metrics || {};
    const equipment = getEquipmentFeatures(homeMetrics.equipment || "bands_backpack");
    const effectiveLevel = getOutdoorEffectiveLevel(level, homeMetrics);
    const isBeginner = effectiveLevel === "beginner";
    const isAdvanced = effectiveLevel === "advanced";
    const isStrength = goal === "strength";
    const isEndurance = goal === "endurance";
    const isFatLoss = goal === "fatloss";
    const loadText = equipment.backpack
      ? "рюкзак / додаткова вага"
      : equipment.dumbbells
        ? "гантелі / доступна вага"
        : equipment.bands
          ? "резина + власна вага"
          : "власна вага, повільний темп";
    const pullText = equipment.bands
      ? "резина / рушник / тяга до опори"
      : equipment.dumbbells || equipment.backpack
        ? "рюкзак або гантелі"
        : "тяга під столом / рушник";
    const heavySets = isBeginner ? "3-4" : isAdvanced ? "5-8" : "5-6";
    const volumeSets = isBeginner ? "4" : isAdvanced ? "6-10" : "5-8";
    const strengthReps = isBeginner ? "6-10" : isAdvanced ? "5-8" : "6-10";
    const massReps = isBeginner ? "10-15" : isAdvanced ? "10-20" : "10-18";
    const enduranceReps = isBeginner ? "12-20" : "15-20";
    const mainReps = isStrength ? strengthReps : (isEndurance || isFatLoss ? enduranceReps : massReps);
    const progression = isStrength
      ? "якщо верх діапазону чистий - +2.5-5 кг у рюкзак або складніша варіація"
      : isEndurance
        ? "додавай підхід до 8-10, потім скорочуй відпочинок"
        : isFatLoss
          ? "вагу не форсуй, тримай темп і чисту амплітуду"
          : "спочатку добери верх повторів, потім додай вагу або складність";

    const pushMain = isBeginner
      ? "Віджимання з паузою"
      : isAdvanced
        ? "Віджимання з рюкзаком / псевдо-планш"
        : "Віджимання з рюкзаком або ноги на підвищенні";
    const shoulderMain = isAdvanced
      ? "Стійка біля стіни / важкі pike-віджимання"
      : "Pike-віджимання / жим рюкзака над головою";
    const legMain = isBeginner
      ? "Болгарські присідання з опорою"
      : isAdvanced
        ? "Болгарські присідання з рюкзаком / пістолет до опори"
        : "Болгарські присідання з рюкзаком";
    const hingeMain = isAdvanced
      ? "Румунська тяга на одній нозі з рюкзаком"
      : "Румунська тяга з рюкзаком";

    const plans = [
      {
        title: "День 1 - верх: жим + тяга",
        badge: isAdvanced ? "важкий домашній верх" : "домашній силовий верх",
        basic: [
          { name: pushMain, sets: heavySets, reps: mainReps, weightText: loadText, percentText: progression },
          { name: "Тяга в нахилі / горизонтальна тяга", sets: heavySets, reps: isStrength ? "6-10" : "10-20", weightText: pullText, percentText: "тягни до корпусу, щотижня +1 повтор або більше ваги" }
        ],
        accessory: [
          buildAccessoryExercise(shoulderMain, isAdvanced ? "4-6" : "4-5", isStrength ? "5-10" : "8-15", progression, loadText),
          buildAccessoryExercise("Віджимання вузьким хватом / на трицепс від опори", isAdvanced ? "4-6" : "3-5", "10-20", "після 20 повторів ускладнюй варіацію", "власна вага"),
          buildAccessoryExercise("Підйом на біцепс рюкзаком / резиною", "4-5", "10-20", "додавай натяг або вагу", loadText)
        ]
      },
      {
        title: "День 2 - ноги + задня лінія",
        badge: isAdvanced ? "важкі односторонні ноги" : "ноги без легкого режиму",
        basic: [
          { name: legMain, sets: heavySets, reps: isStrength ? "6-10 на ногу" : "10-20 на ногу", weightText: loadText, percentText: progression },
          { name: hingeMain, sets: heavySets, reps: isStrength ? "6-10 на ногу" : "10-18", weightText: loadText, percentText: "пауза внизу, контроль спини, щотижня +1 повтор або вага" }
        ],
        accessory: [
          buildAccessoryExercise("Випади назад з рюкзаком", isAdvanced ? "5-6" : "4-5", "10-20 на ногу", "доведи до 20, потім додай вагу", loadText),
          buildAccessoryExercise("Сідничний міст / hip thrust на одній нозі", "4-6", "12-20", "пауза 1-2 сек у верхній точці", loadText),
          buildAccessoryExercise("Підйоми на носки однією ногою", "5-8", "15-20", "після 20 додавай рюкзак", loadText)
        ]
      },
      {
        title: "День 3 - об'єм верху + корпус",
        badge: isEndurance ? "силова витривалість" : "накопичення об'єму",
        basic: [
          { name: "Віджимання: важка варіація + звичайна добивка", sets: volumeSets, reps: "12-20", weightText: loadText, percentText: "не вище 20 у сеті: далі рюкзак, ноги вище або повільніший темп" },
          { name: "Тяга резини / тяга рюкзака до поясу", sets: volumeSets, reps: "12-20", weightText: pullText, percentText: "тримай баланс жим/тяга, не залишай спину без об'єму" }
        ],
        accessory: [
          buildAccessoryExercise("Розведення на задню дельту резиною / нахил", "4-6", "15-20", "контроль лопаток", pullText),
          buildAccessoryExercise("Французьке розгинання резиною / рюкзаком", "4-6", "10-20", "додавай натяг або вагу", loadText),
          buildAccessoryExercise("Прес: підйом ніг лежачи / hollow body", isAdvanced ? "5-6" : "4-5", "12-20", "додавай підхід або складність", "-")
        ]
      },
      {
        title: "День 4 - силова щільність",
        badge: isAdvanced ? "просунутий домашній об'єм" : "додатковий силовий день",
        basic: [
          { name: "Болгарські присідання + віджимання суперсетом", sets: isAdvanced ? "6-8" : "5-6", reps: "10-20", weightText: loadText, percentText: "працюй у RIR 1-3, без провалу техніки" },
          { name: "Тяга + pike-віджимання суперсетом", sets: isAdvanced ? "5-7" : "4-6", reps: "8-15", weightText: pullText, percentText: "скорочуй відпочинок тільки якщо повтори стабільні" }
        ],
        accessory: [
          buildAccessoryExercise("Присідання з паузою / пістолет до опори", "4-6", "8-15 на ногу", "додавай амплітуду, потім вагу", loadText),
          buildAccessoryExercise("Планка з вагою / бічна планка", "4-5", "30-60 сек", "додавай вагу або час", loadText),
          buildAccessoryExercise("Фінішер: віджимання або присідання EMOM", "6-10", "6-12 щохвилини", "тільки якщо техніка не падає", "власна вага")
        ]
      }
    ];

    if (days === 2) return [plans[0], plans[1]];
    if (days === 3) return [plans[0], plans[1], plans[2]];
    return plans;
  }

  function parseTrainingNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function getEquipmentFeatures(value) {
    return {
      bands: value === "bands" || value === "bands_backpack",
      backpack: value === "backpack" || value === "bands_backpack",
      dumbbells: value === "dumbbells"
    };
  }

  function getOutdoorEffectiveLevel(level, metrics) {
    const hasTests = metrics.pullupsMax || metrics.dipsMax || metrics.pushupsMax;
    if (!hasTests) return level;

    const advancedSignals = [
      metrics.pullupsMax >= 10,
      metrics.dipsMax >= 20,
      metrics.pushupsMax >= 35
    ].filter(Boolean).length;

    if (advancedSignals >= 2) return "advanced";
    if (metrics.pullupsMax >= 4 || metrics.dipsMax >= 10 || metrics.pushupsMax >= 18) return "intermediate";
    return "beginner";
  }

  function getRepRangeByMax(maxValue, beginnerRange, intermediateRange, advancedRange) {
    if (!maxValue) return intermediateRange;
    if (maxValue < 8) return beginnerRange;
    if (maxValue < 20) return intermediateRange;
    return advancedRange;
  }

  function getOutdoorBasePlan(goal, level, days, metrics) {
    const outdoorMetrics = metrics || {};
    const equipment = getEquipmentFeatures(outdoorMetrics.equipment || "bands_backpack");
    const effectiveLevel = getOutdoorEffectiveLevel(level, outdoorMetrics);
    const isBeginner = effectiveLevel === "beginner";
    const isAdvanced = effectiveLevel === "advanced";
    const enduranceMode = goal !== "strength";
    const strengthReps = getRepRangeByMax(outdoorMetrics.pullupsMax, "3-6", "4-8", "5-8");
    const dipSets = isBeginner ? "4-5" : isAdvanced ? "5-8" : "5-6";
    const dipReps = getRepRangeByMax(outdoorMetrics.dipsMax, "8-12", "12-18", "15-20");
    const pushupSets = isBeginner ? "4" : isAdvanced ? "5-8" : "5-6";
    const pushupReps = getRepRangeByMax(outdoorMetrics.pushupsMax, "10-15", "15-20", "15-20");
    const secondaryPushupSets = isBeginner ? "4" : isAdvanced ? "5-8" : "4-6";
    const secondaryPushupReps = getRepRangeByMax(outdoorMetrics.pushupsMax, "8-12", "12-18", "15-20");
    const mainSets = isBeginner
      ? (enduranceMode ? "4-5" : "3-4")
      : isAdvanced
        ? (enduranceMode ? "6-8" : "5-6")
        : (enduranceMode ? "5-6" : "4-5");
    const assistText = isBeginner
      ? (equipment.bands ? "резина з відчутною допомогою" : "негативи / австралійські")
      : isAdvanced
        ? (equipment.backpack ? "власна вага / рюкзак" : "власна вага")
        : (equipment.bands ? "легка резина або власна вага" : "власна вага");

    const pullProgression = isBeginner
      ? [
          "Підтягування з резиною: обери допомогу, щоб лишалось 2 повтори в запасі.",
          "Додай 1-2 повтори сумарно або трохи слабшу резину.",
          "Додай 1 підхід, якщо техніка стабільна. Не йди у відмову в кожному сеті.",
          "Спробуй 1-2 чисті повтори без резини перед робочими підходами."
        ]
      : isAdvanced
        ? [
            "Підтягування чисто: 6-8 підходів, 1-2 повтори в запасі.",
            "Додай повтори сумарно або скороти відпочинок на 10-15 сек.",
            "Додай 1 підхід. Довга ціль: 8-10 якісних підходів.",
            "Контроль: без болю в лікті/плечі, не всі сети до відмови.",
            "Якщо 8-10 підходів стабільні — рюкзак 2-5 кг.",
            "Полегшення: мінус 20-30% об'єму, техніка і мобільність."
          ]
        : [
            "Підтягування: слабка резина або власна вага, 1-2 повтори в запасі.",
            "Додай 1-2 повтори сумарно або прибери частину допомоги резини.",
            "Додай 1 підхід. Орієнтир: поступово вийти на 6-8 підходів.",
            "Якщо 6-8 підходів чисті — перший підхід без резини або легкий рюкзак."
          ];

    const dipProgression = isBeginner
      ? [
          "Бруси з резиною або негативи 3-4 сек вниз.",
          "Додай 1-2 повтори сумарно або зроби слабшу допомогу резини.",
          "Додай 1 підхід, якщо плече стабільне.",
          "Спробуй 1 чистий підхід без резини, решта з допомогою."
        ]
      : isAdvanced
        ? [
            "Бруси чисто: 5-8 підходів по 20-25 повторів, без відмови в кожному сеті.",
            "Додай повтори сумарно або скороти відпочинок на 10-15 сек.",
            "Додай 1 підхід. Довга ціль: 8-10 підходів по 20+ повторів.",
            "Контрольний тиждень без гонитви за вагою.",
            "Якщо 8-10 підходів по 20+ стабільні — рюкзак 2-5 кг.",
            "Полегшення: мінус 20-30% об'єму."
          ]
        : [
            "Бруси: 5-6 підходів, робочий орієнтир 12-20 повторів.",
            "Додай 2-4 повтори сумарно за тренування.",
            "Додай 1 підхід. Орієнтир: поступово 6-8 підходів по 15-20.",
            "Якщо 6-8 підходів по 20 чисті — перший підхід з рюкзаком 2-3 кг."
          ];

    const plans = [
      {
        title: "День 1 — турнік + жим",
        badge: "вулиця / верх тіла",
        basic: [
          buildOutdoorExercise("Підтягування на турніку", mainSets, strengthReps, assistText, pullProgression),
          buildOutdoorExercise("Віджимання на брусах", dipSets, dipReps, assistText, dipProgression)
        ],
        accessory: [
          buildOutdoorExercise("Віджимання від підлоги", pushupSets, pushupReps, "власна вага / рюкзак", [
            "Почни з чистої лінії корпусу, 2 повтори в запасі.",
            "Додай 3-5 повторів сумарно за тренування.",
            "Додай 1 підхід або підніми ноги. Верхня межа сету — 20 повторів, далі ускладнюй вправу.",
            "Контрольний тиждень: повна амплітуда, без провалу таза."
          ]),
          buildOutdoorExercise("Тяга резини до поясу", "3-4", "12-15", "резина", [
            "Обери натяг, де лопатки працюють без ривка.",
            "Додай 2 повтори або сильнішу резину.",
            "Пауза 1 сек у скороченні.",
            "Тримай той самий натяг, чисті повтори."
          ]),
          !isBeginner ? buildOutdoorExercise("Розгинання на трицепс від низької перекладини", isAdvanced ? "4-6" : "3-4", isAdvanced ? "12-20" : "10-15", "власна вага", [
            "Лікті стабільні, корпус прямий, рух як французький жим власною вагою.",
            "Додай 2-3 повтори сумарно за тренування.",
            "Зроби кут корпусу нижчим або додай 1 підхід.",
            "Не провалюй плечі, тримай контроль ліктів."
          ]) : null,
          buildOutdoorExercise("Підйом колін у висі", "3", "8-15", "власна вага", [
            "Коліна до паралелі, без розгойдування.",
            "Додай 1-2 повтори.",
            "Підіймай ноги вище або повільніше опускай.",
            "Контроль корпусу, без інерції."
          ])
        ]
      },
      {
        title: "День 2 — ноги + кор",
        badge: "вулиця / база",
        basic: [
          buildOutdoorExercise("Присідання з власною вагою або рюкзаком", mainSets, goal === "strength" ? "8-10" : "12-20", isAdvanced ? "рюкзак" : "власна вага", [
            "Повна стопа, контроль колін і глибини.",
            "Додай 2 повтори або рюкзак 2-5 кг.",
            "Пауза 1 сек внизу.",
            "Контрольний тиждень: стабільна техніка."
          ]),
          buildOutdoorExercise("Випади або болгарські спліт-присідання", "3-4", "8-12 на ногу", isAdvanced ? "рюкзак" : "власна вага", [
            "Почни з рівного темпу і стабільного коліна.",
            "Додай 1 повтор на ногу.",
            "Додай рюкзак або повільніше опускання.",
            "Не форсуй, якщо падає баланс."
          ])
        ],
        accessory: [
          buildOutdoorExercise("Сідничний міст / хіп-траст від лавки", "3-4", "12-20", "власна вага / рюкзак", [
            "Контроль таза, пауза у верхній точці.",
            "Додай 2 повтори.",
            "Додай рюкзак або паузу 2 сек.",
            "Тримай амплітуду без прогину попереку."
          ]),
          buildOutdoorExercise("Підйом ніг або колін на турніку", "3", "8-15", "власна вага", [
            "До паралелі, без розгойдування.",
            "Додай 1 повтор.",
            "Повільне опускання 2-3 сек.",
            "Якість вище кількості."
          ]),
          buildOutdoorExercise("Планка / бокова планка", "3", "30-60 сек", "власна вага", [
            "Тримай корпус без провалу попереку.",
            "Додай 5-10 сек.",
            "Додай бокову планку.",
            "Контроль дихання і позиції."
          ])
        ]
      },
      {
        title: "День 3 — резина + об'єм",
        badge: "вулиця / відновлюваний об'єм",
        basic: [
          buildOutdoorExercise("Підтягування австралійські або тяга резини", "4", "10-15", "низький турнік / резина", [
            "Контроль лопаток і повна амплітуда.",
            "Додай 2 повтори.",
            "Складніший кут корпусу або сильніша резина.",
            "Не добивай до відмови, залиш 2 повтори."
          ]),
          buildOutdoorExercise("Віджимання вузьким хватом або на брусах", secondaryPushupSets, secondaryPushupReps, "власна вага", [
            "Чиста амплітуда без болю в плечі.",
            "Додай 3-5 повторів сумарно.",
            "Додай 1 підхід, рюкзак або паузу.",
            "Контрольний тиждень без відмови."
          ])
        ],
        accessory: [
          buildOutdoorExercise("Жим резини над головою", "3", "10-15", "резина", [
            "Стабільний корпус, без прогину.",
            "Додай 2 повтори.",
            "Сильніша резина або повільніший темп.",
            "Тримай плечі без дискомфорту."
          ]),
          buildOutdoorExercise("Згинання рук з резиною", "3", "12-18", "резина", [
            "Лікті стабільні, без ривка.",
            "Додай 2 повтори.",
            "Сильніша резина.",
            "Контроль темпу."
          ]),
          !isBeginner ? buildOutdoorExercise("Розгинання на трицепс від низької перекладини", isAdvanced ? "4-6" : "3-4", isAdvanced ? "12-20" : "10-15", "власна вага", [
            "Імітація французького жиму: згинання в лікті, корпус рівний.",
            "Додай 2-3 повтори сумарно або зроби нижчий кут корпусу.",
            "Додай 1 підхід, якщо лікті без дискомфорту.",
            "Контрольний тиждень: без ривка і без провалу плечей."
          ]) : buildOutdoorExercise("Розгинання рук з резиною", "3", "12-18", "резина", [
            "Плече стабільне, працює трицепс.",
            "Додай 2 повтори.",
            "Сильніша резина.",
            "Без болю в лікті."
          ])
        ]
      },
      {
        title: "День 4 — силова практика",
        badge: "вулиця / просунутий контроль",
        basic: [
          buildOutdoorExercise("Підтягування важкі", "5", "3-6", isAdvanced ? "рюкзак 2-10 кг" : "легка резина", pullProgression),
          buildOutdoorExercise("Бруси важкі", "5", "4-8", isAdvanced ? "рюкзак 2-10 кг" : "легка резина", dipProgression)
        ],
        accessory: [
          buildOutdoorExercise("Пістолетик до опори / болгарські присідання", "3-4", "6-10 на ногу", "власна вага / рюкзак", [
            "Контроль коліна і балансу.",
            "Додай 1 повтор.",
            "Додай рюкзак або нижчу опору.",
            "Не жертвуй амплітудою."
          ]),
          buildOutdoorExercise("Підйом прямих ніг у висі", "3", "6-12", "власна вага", [
            "Без розгойдування.",
            "Додай 1 повтор.",
            "Повільне опускання.",
            "Контроль лопаток у висі."
          ])
        ]
      }
    ];

    if (days === 2) return [plans[0], plans[1]];
    const selectedPlans = days === 4 ? plans : plans.slice(0, 3);

    selectedPlans.forEach(function (day) {
      day.basic = (day.basic || []).filter(Boolean);
      day.accessory = (day.accessory || []).filter(Boolean);
    });

    return selectedPlans;
  }

  function buildProgramExercise(name, setsLabel, reps, weightText, percentText, progressionType, progressionPlan) {
    return {
      name: name,
      sets: "1",
      setsLabel: setsLabel,
      reps: reps,
      weightText: weightText,
      percentText: percentText,
      progressionType: progressionType,
      progressionPlan: progressionPlan || []
    };
  }

  function getPrisonWorkoutPlan(level, days, metrics) {
    const data = metrics || {};
    const effectiveLevel = getOutdoorEffectiveLevel(level, data);
    const isBeginner = effectiveLevel === "beginner";
    const isAdvanced = effectiveLevel === "advanced";
    const ladderTop = isBeginner ? "5 сходинок" : isAdvanced ? "10-12 сходинок" : "7-9 сходинок";
    const rounds = isBeginner ? "3-4 кола" : isAdvanced ? "6-8 кіл" : "4-6 кіл";
    const rest = isBeginner ? "90-120 сек відпочинку" : isAdvanced ? "45-75 сек відпочинку" : "60-90 сек відпочинку";
    const prisonPlan = [
      {
        title: "День 1 - Prison драбинка: верх тіла",
        badge: "вулична сила / драбинки",
        basic: [
          buildProgramExercise("Підтягування або австралійські підтягування", ladderTop, "1-2-3... по сходинках", "власна вага / резина", "Зупинись за 1-2 сходинки до зриву техніки.", "prison", [
            "Вхід: знайди верхню чисту сходинку без відмови.",
            "Додай 1 сходинку або 1 повтор у перших сходинках.",
            "Повтори верхню сходинку двічі тільки якщо техніка чиста.",
            "Контроль: залиш 1-2 повтори в запасі, не ламай плечі."
          ]),
          buildProgramExercise("Віджимання", ladderTop, "2-4-6... по сходинках", "власна вага", "Корпус рівний, груди нижче ліктя тільки без болю.", "prison", [
            "Вхід: чисті повтори без провалу таза.",
            "Додай 1 сходинку або підніми ноги на опору.",
            "Скороти відпочинок на 10-15 сек, якщо техніка стабільна.",
            "Контроль: без постійної відмови."
          ])
        ],
        accessory: [
          buildProgramExercise("Присідання з власною вагою", rounds, "15-25", "власна вага", rest, "prison", [
            "Тримай рівний темп і повну стопу.",
            "Додай 5 повторів сумарно.",
            "Додай 1 коло, якщо коліна стабільні.",
            "Контроль: без поспіху і втрати глибини."
          ]),
          buildProgramExercise("Планка", rounds, "30-60 сек", "власна вага", "Корпус жорсткий, дихання рівне.", "prison")
        ]
      },
      {
        title: "День 2 - Prison ноги + корпус",
        badge: "власна вага і контроль",
        basic: [
          buildProgramExercise("Випади назад", rounds, "10-16 на ногу", "власна вага / рюкзак", "Працюй без болю в коліні, не поспішай.", "prison"),
          buildProgramExercise("Берпі без стрибка або класичні берпі", isBeginner ? "4 раунди" : "6-8 раундів", "6-12", "власна вага", "Ціль - рівний темп, а не хаос.", "prison", [
            "Почни з нижньої межі повторів.",
            "Додай 1-2 повтори за раунд.",
            "Додай 1 раунд або скороти відпочинок.",
            "Контроль: прибери стрибок, якщо падає техніка."
          ])
        ],
        accessory: [
          buildProgramExercise("Підйом ніг лежачи або у висі", rounds, "10-20", "власна вага", "Без розгойдування, поперек під контролем.", "prison"),
          buildProgramExercise("Стілець біля стіни", "3-5 раундів", "30-60 сек", "власна вага", "Стегна горять, але коліна без гострого болю.", "prison")
        ]
      },
      {
        title: "День 3 - Prison кола на все тіло",
        badge: "щільність",
        basic: [
          buildProgramExercise("Коло: підтягування / віджимання / присідання", rounds, "5 / 10 / 20", "власна вага", "Виконай кола рівно, залишаючи 1-2 повтори в запасі.", "prison", [
            "Вхід: 3-4 рівні кола без провалу техніки.",
            "Додай 1 коло або 2 повтори у присіданнях.",
            "Скороти відпочинок на 10-15 сек.",
            "Контроль: якість руху важливіша за час."
          ]),
          buildProgramExercise("Фінішер: віджимання щохвилини", "6-10 хв", "5-12 щохвилини", "власна вага", "Обери повтори, які не зламають техніку до кінця.", "prison")
        ],
        accessory: [
          buildProgramExercise("Бічна планка", "3-4 раунди", "20-45 сек на бік", "власна вага", "Таз не провалюється.", "prison"),
          buildProgramExercise("Легка ходьба після тренування", "1 блок", "20-40 хв", "без ваги", "Відновлення без додаткового стресу.", "prison")
        ]
      },
      {
        title: "День 4 - Prison контрольний день",
        badge: "виклик без его",
        basic: [
          buildProgramExercise("Контроль: максимум чистих кіл за 20 хв", "20 хв", "3 підтягування / 6 віджимань / 12 присідань", "власна вага", "Зупиняй сет до зламу техніки, записуй кількість кіл.", "prison"),
          buildProgramExercise("Корпус: hollow body або планка", "4-6 раундів", "20-45 сек", "власна вага", "Тримай ребра вниз і поперек стабільним.", "prison")
        ],
        accessory: [
          buildProgramExercise("Мобільність плечей і стегон", "1 блок", "8-12 хв", "без ваги", "Це частина програми, а не пропуск тренування.", "prison")
        ]
      }
    ];

    if (days === 2) return [prisonPlan[0], prisonPlan[1]];
    if (days === 3) return [prisonPlan[0], prisonPlan[1], prisonPlan[2]];
    return prisonPlan;
  }

  function getTabataCircuitPlan(goal, level, days, duration) {
    const isBeginner = level === "beginner";
    const isAdvanced = level === "advanced";
    const tabataBlocks = isBeginner ? "2 блоки" : isAdvanced ? "4 блоки" : "3 блоки";
    const circuitRounds = isBeginner ? "3 кола" : isAdvanced ? "5-6 кіл" : "4-5 кіл";
    const workRest = isBeginner ? "30 сек робота / 30 сек відпочинок" : isAdvanced ? "45 сек робота / 45 сек відпочинок" : "40 сек робота / 40 сек відпочинок";
    const shortWorkRest = "20 сек робота / 20 сек відпочинок";
    const needsFatLoss = goal === "fatloss" || goal === "endurance";
    const plan = [
      {
        title: "День 1 - Інтервали 1:1: все тіло",
        badge: "коротка інтенсивність",
        basic: [
          buildProgramExercise("Інтервали 1:1: присідання + віджимання", tabataBlocks, shortWorkRest, "власна вага", "8 раундів у блоці. Між блоками 90-120 сек.", "conditioning", [
            "Вхід: 2 блоки без падіння техніки.",
            "Додай 1 блок або 1-2 повтори за робочий інтервал.",
            "Скороти паузу між блоками на 15-20 сек.",
            "Контроль: краще чисто, ніж швидко."
          ]),
          buildProgramExercise("Альпініст або біг на місці", "8 раундів", shortWorkRest, "власна вага", "Темп середній, корпус під контролем.", "conditioning")
        ],
        accessory: [
          buildProgramExercise("Заминка і дихання", "1 блок", "5-8 хв", "без ваги", "Пульс має спокійно опуститися.", "conditioning")
        ]
      },
      {
        title: "День 2 - Кругове тренування",
        badge: needsFatLoss ? "витрата енергії" : "силова щільність",
        basic: [
          buildProgramExercise("Коло: випади / тяга рюкзака / планка", circuitRounds, workRest, "власна вага / рюкзак", "Виконуй по колу, відпочинок між колами 90 сек.", "conditioning", [
            "Вхід: рівні кола без поспіху.",
            "Додай 1 коло або 5 сек роботи в кожній вправі.",
            "Скороти відпочинок між колами на 15 сек.",
            "Контроль: не перетворюй силові рухи на хаос."
          ]),
          buildProgramExercise("Фінішер: берпі або крок назад у планку", isBeginner ? "4 раунди" : "6-8 раундів", shortWorkRest, "власна вага", "Варіант без стрибка, якщо коліна або спина втомлені.", "conditioning")
        ],
        accessory: [
          buildProgramExercise("Ходьба після тренування", "1 блок", needsFatLoss ? "25-45 хв" : "15-25 хв", "без ваги", "Легкий темп для відновлення.", "conditioning")
        ]
      },
      {
        title: "День 3 - Інтервали 1:1: верх + корпус",
        badge: "пульс і контроль",
        basic: [
          buildProgramExercise("Інтервали 1:1: віджимання / планка", tabataBlocks, shortWorkRest, "власна вага", "Чергуй вправи, не йди у відмову на першому блоці.", "conditioning"),
          buildProgramExercise("Тяга резини або рюкзака", circuitRounds, "12-15 повторів", "резина / рюкзак", "Після кожного підходу 30-45 сек відпочинку.", "conditioning")
        ],
        accessory: [
          buildProgramExercise("Корпус: мертва комаха або hollow body", "3-5 раундів", "8-12 на бік / 20-30 сек", "власна вага", "Повільний контроль.", "conditioning")
        ]
      },
      {
        title: "День 4 - Кругове тренування: ноги + витривалість",
        badge: "щільність без перевантаження",
        basic: [
          buildProgramExercise("Коло: присідання / сідничний міст / випади", circuitRounds, workRest, "власна вага / рюкзак", "Тримай коліна стабільними, не женись за швидкістю.", "conditioning"),
          buildProgramExercise("Фінішер: стілець біля стіни", "4-6 раундів", "30-60 сек", "власна вага", "Печіння нормально, гострий біль - ні.", "conditioning")
        ],
        accessory: [
          buildProgramExercise("Мобільність стегон", "1 блок", "8-10 хв", "без ваги", "Віднови рух після інтенсивності.", "conditioning")
        ]
      }
    ];

    if (duration && duration <= 30) {
      plan.forEach(function (day) {
        day.accessory = (day.accessory || []).slice(0, 1);
      });
    }

    if (days === 2) return [plan[0], plan[1]];
    if (days === 3) return [plan[0], plan[1], plan[2]];
    return plan;
  }

  function getFemaleProgramLabel(mode) {
    const labels = {
      female_balanced: "Жіноча збалансована",
      female_glutes: "Жіноча: сідниці та ноги",
      female_strength: "Жіноча силова",
      female_fatloss: "Жіноча для зниження жиру"
    };

    return labels[mode] || "Жіноча програма";
  }

  function getCyclePhaseLabel(phase) {
    const labels = {
      menstruation: "менструація",
      follicular: "після менструації",
      ovulation: "середина циклу",
      luteal: "передменструальний період"
    };

    return labels[phase] || "без урахування циклу";
  }

  function getFemaleLoadText(place) {
    if (place === "gym") return "штанга, гантелі або тренажер";
    if (place === "outdoor") return "власна вага, резина або рюкзак";
    return "власна вага, резина, рюкзак або гантелі";
  }

  function getFemalePullText(place) {
    if (place === "gym") return "блок, тренажер або гантелі";
    if (place === "outdoor") return "турнік, резина або низька перекладина";
    return "резина, рюкзак або опора";
  }

  function getFemaleCycleCue(phase) {
    if (phase === "menstruation") {
      return "Фаза циклу: зменш робочу вагу на 10-20%, прибери стрибки і залиш більше повторів у запасі.";
    }

    if (phase === "follicular") {
      return "Фаза циклу: добре вікно для прогресії, додавай вагу тільки за чистої техніки.";
    }

    if (phase === "ovulation") {
      return "Фаза циклу: не форсуй рекорди, особливо у присіданнях, випадах і стрибкових рухах.";
    }

    if (phase === "luteal") {
      return "Фаза циклу: тримай помірну щільність, більше ходьби, менше роботи до відмови.";
    }

    return "";
  }

  function femaleExercise(name, sets, reps, progression, weightText) {
    const exercise = buildAccessoryExercise(name, sets, reps, progression, weightText);
    exercise.progressionType = "female";
    return exercise;
  }

  function addFemaleDayCue(day, cyclePhase, extraCue) {
    day.cardio = day.cardio || [];

    if (extraCue) {
      day.cardio.push(extraCue);
    }

    const cycleCue = getFemaleCycleCue(cyclePhase);
    if (cycleCue) {
      day.cardio.push(cycleCue);
    }

    return day;
  }

  function getFemaleBasePlan(mode, place, level, days, goal, cyclePhase) {
    const isBeginner = level === "beginner";
    const isAdvanced = level === "advanced";
    const loadText = getFemaleLoadText(place);
    const pullText = getFemalePullText(place);
    const baseSets = isBeginner ? "3" : isAdvanced ? "4-5" : "4";
    const supportSets = isBeginner ? "2-3" : isAdvanced ? "4" : "3";
    const strengthSets = isBeginner ? "3" : isAdvanced ? "5" : "4";
    const steadyCue = "залишай 2-3 повтори в запасі";
    const strongCue = "додавай вагу малими кроками, без зриву техніки";
    const denseCue = "скорочуй відпочинок поступово, техніка важливіша за темп";

    const balanced = [
      addFemaleDayCue({
        title: "День 1 - сідниці та задня поверхня",
        badge: "нижня частина",
        basic: [
          femaleExercise("Підйом таза", baseSets, "8-12", strongCue, loadText),
          femaleExercise("Румунська тяга", baseSets, "8-12", steadyCue, loadText)
        ],
        accessory: [
          femaleExercise("Відведення стегна", supportSets, "12-20", "пауза у верхній точці", loadText),
          femaleExercise("Згинання ніг або ковзання п'ятами", supportSets, "10-15", "додавай повтори", loadText),
          femaleExercise("Бічна планка", supportSets, "25-45 сек", "додавай час", "власна вага")
        ]
      }, cyclePhase),
      addFemaleDayCue({
        title: "День 2 - верх тіла та постава",
        badge: "спина і плечі",
        basic: [
          femaleExercise("Тяга до пояса", baseSets, "8-12", steadyCue, pullText),
          femaleExercise("Жим гантелей або віджимання від опори", baseSets, "8-12", steadyCue, loadText)
        ],
        accessory: [
          femaleExercise("Тяга верхнього блоку або підтягування з допомогою", supportSets, "8-12", "додавай повтори без ривків", pullText),
          femaleExercise("Підйоми через сторони", supportSets, "12-18", "легка вага, контроль плечей", loadText),
          femaleExercise("Вправа для корпуса з протидією обертанню", supportSets, "10-14 на бік", "повільний контроль", "резина або блок")
        ]
      }, cyclePhase),
      addFemaleDayCue({
        title: "День 3 - ноги та корпус",
        badge: "контроль руху",
        basic: [
          femaleExercise("Присідання або жим ногами", baseSets, "8-12", steadyCue, loadText),
          femaleExercise("Випади назад", baseSets, "8-12 на ногу", "додавай повтори перед вагою", loadText)
        ],
        accessory: [
          femaleExercise("Розгинання ніг", supportSets, "12-15", "контроль коліна", loadText),
          femaleExercise("Підйом на носки", supportSets, "12-20", "пауза вгорі", loadText),
          femaleExercise("Мертва комаха", supportSets, "8-12 на бік", "поперек стабільний", "власна вага")
        ]
      }, cyclePhase),
      addFemaleDayCue({
        title: "День 4 - помірна щільність",
        badge: "витривалість",
        basic: [
          femaleExercise("Кроки на підвищення", baseSets, "10-14 на ногу", denseCue, loadText),
          femaleExercise("Тяга резини або блоку до грудей", baseSets, "12-15", denseCue, pullText)
        ],
        accessory: [
          femaleExercise("Сідничний міст з паузою", supportSets, "15-20", "пауза 2 сек", loadText),
          femaleExercise("Фермерська хода або перенесення ваги", supportSets, "30-45 сек", "рівний корпус", loadText),
          femaleExercise("Ходьба після тренування", "1", "20-35 хв", "спокійний темп", "без ваги")
        ]
      }, cyclePhase, "Кардіо: спокійна ходьба або велосипед без задишки.")
    ];

    const glutes = [
      balanced[0],
      balanced[1],
      addFemaleDayCue({
        title: "День 3 - сідничний акцент",
        badge: "форма і сила",
        basic: [
          femaleExercise("Підйом таза з паузою", isAdvanced ? "5" : "4", "6-10", strongCue, loadText),
          femaleExercise("Болгарські присідання", baseSets, "8-12 на ногу", "додавай вагу після стабільної амплітуди", loadText)
        ],
        accessory: [
          femaleExercise("Відведення стегна назад", supportSets, "12-20", "без розгойдування", loadText),
          femaleExercise("Румунська тяга на одній нозі", supportSets, "8-12 на ногу", "контроль таза", loadText),
          femaleExercise("Розкриття стегон з резиною", supportSets, "15-25", "постійний натяг", "резина")
        ]
      }, cyclePhase),
      addFemaleDayCue({
        title: "День 4 - ноги без перевантаження",
        badge: "об'єм",
        basic: [
          femaleExercise("Жим ногами або присідання до опори", baseSets, "10-14", steadyCue, loadText),
          femaleExercise("Згинання ніг", baseSets, "10-15", "додавай повтори", loadText)
        ],
        accessory: [
          femaleExercise("Кроки вбік з резиною", supportSets, "12-20 на бік", "коліна стабільні", "резина"),
          femaleExercise("Підйом таза однією ногою", supportSets, "10-15 на ногу", "пауза вгорі", "власна вага або вага"),
          femaleExercise("Ходьба під нахилом", "1", "20-30 хв", "без бігу", "без ваги")
        ]
      }, cyclePhase)
    ];

    const strength = [
      addFemaleDayCue({
        title: "День 1 - присідання та тяга",
        badge: "сила ніг",
        basic: [
          femaleExercise("Присідання", strengthSets, "4-6", "вага з запасом 2 повтори", loadText),
          femaleExercise("Румунська тяга", strengthSets, "5-8", strongCue, loadText)
        ],
        accessory: [
          femaleExercise("Підйом таза", supportSets, "8-10", strongCue, loadText),
          femaleExercise("Випади назад", supportSets, "8-10 на ногу", steadyCue, loadText),
          femaleExercise("Планка", supportSets, "30-50 сек", "додавай час", "власна вага")
        ]
      }, cyclePhase),
      addFemaleDayCue({
        title: "День 2 - верх тіла",
        badge: "силовий контроль",
        basic: [
          femaleExercise("Жим лежачи або жим гантелей", strengthSets, "4-6", "вага з запасом 2 повтори", loadText),
          femaleExercise("Тяга до пояса", strengthSets, "6-8", strongCue, pullText)
        ],
        accessory: [
          femaleExercise("Жим над головою", supportSets, "6-10", steadyCue, loadText),
          femaleExercise("Тяга верхнього блоку", supportSets, "8-10", "чисті лопатки", pullText),
          femaleExercise("Перенесення ваги", supportSets, "30-45 сек", "рівний корпус", loadText)
        ]
      }, cyclePhase),
      addFemaleDayCue({
        title: "День 3 - задня поверхня та корпус",
        badge: "міцна база",
        basic: [
          femaleExercise("Тяга з підлоги або тяга з підставок", strengthSets, "3-5", "без максимальних спроб", loadText),
          femaleExercise("Болгарські присідання", baseSets, "6-10 на ногу", strongCue, loadText)
        ],
        accessory: [
          femaleExercise("Згинання ніг", supportSets, "8-12", "контроль темпу", loadText),
          femaleExercise("Відведення стегна", supportSets, "12-18", "пауза вгорі", loadText),
          femaleExercise("Вправа для корпуса з протидією обертанню", supportSets, "10-12 на бік", "повільно", "резина або блок")
        ]
      }, cyclePhase),
      balanced[3]
    ];

    const fatloss = [
      addFemaleDayCue({
        title: "День 1 - нижня частина і щільність",
        badge: "витрата енергії",
        basic: [
          femaleExercise("Присідання до опори або жим ногами", baseSets, "10-15", denseCue, loadText),
          femaleExercise("Підйом таза", baseSets, "10-15", denseCue, loadText)
        ],
        accessory: [
          femaleExercise("Випади назад", supportSets, "10-14 на ногу", "коротший відпочинок поступово", loadText),
          femaleExercise("Тяга резини до пояса", supportSets, "12-18", "рівний темп", pullText),
          femaleExercise("Ходьба після тренування", "1", "25-40 хв", "спокійний темп", "без ваги")
        ]
      }, cyclePhase),
      addFemaleDayCue({
        title: "День 2 - верх тіла і корпус",
        badge: "тонізація",
        basic: [
          femaleExercise("Віджимання від опори або жим гантелей", baseSets, "8-14", denseCue, loadText),
          femaleExercise("Тяга верхнього блоку або резини", baseSets, "10-15", denseCue, pullText)
        ],
        accessory: [
          femaleExercise("Підйоми через сторони", supportSets, "12-18", "легка вага", loadText),
          femaleExercise("Мертва комаха", supportSets, "8-12 на бік", "контроль попереку", "власна вага"),
          femaleExercise("Ходьба або велосипед", "1", "25-45 хв", "помірний темп", "без ваги")
        ]
      }, cyclePhase),
      addFemaleDayCue({
        title: "День 3 - все тіло",
        badge: "пульс і техніка",
        basic: [
          femaleExercise("Кроки на підвищення", baseSets, "10-14 на ногу", denseCue, loadText),
          femaleExercise("Тяга рюкзака, блоку або гантелі", baseSets, "10-14", denseCue, pullText)
        ],
        accessory: [
          femaleExercise("Сідничний міст", supportSets, "15-20", "пауза вгорі", loadText),
          femaleExercise("Фермерська хода", supportSets, "30-45 сек", "рівний корпус", loadText),
          femaleExercise("Розтягнення стегон і грудного відділу", "1", "6-8 хв", "без болю", "без ваги")
        ]
      }, cyclePhase),
      balanced[3]
    ];

    const planMap = {
      female_glutes: glutes,
      female_strength: strength,
      female_fatloss: fatloss,
      female_balanced: balanced
    };

    const selected = planMap[mode] || balanced;

    if (days <= 2) return [selected[0], selected[1]];
    if (days === 3) return [selected[0], selected[1], selected[2]];
    return [selected[0], selected[1], selected[2], selected[3]];
  }

  function getFemaleVolumeNote(mode, cyclePhase) {
    const cycleText = cyclePhase && cyclePhase !== "none"
      ? " Фаза циклу врахована: " + getCyclePhaseLabel(cyclePhase) + "."
      : "";

    if (mode === "female_glutes") {
      return "Жіноча програма зміщує об'єм у сідниці, задню поверхню стегна і стабільність таза, але залишає верх тіла, щоб постава і плечі не відставали." + cycleText;
    }

    if (mode === "female_strength") {
      return "Жіноча силова програма тримає базові рухи без максимальних спроб: сила росте через техніку, повторюваність і малий крок навантаження." + cycleText;
    }

    if (mode === "female_fatloss") {
      return "Жіноча програма для зниження жиру поєднує силову роботу, помірну щільність і ходьбу, щоб витрата енергії не ламала відновлення." + cycleText;
    }

    return "Жіноча збалансована програма дає акцент на сідниці, ноги, спину, поставу і корпус без перекосу в один руховий шаблон." + cycleText;
  }

  function getFemaleTips(mode, cyclePhase) {
    const tips = [
      "Не тренуй ноги тільки присіданнями: для форми потрібні тягові рухи, підйом таза, випади і відведення стегна.",
      "Для сідниць важлива пауза у верхній точці, повна амплітуда і контроль таза, а не просто більша вага.",
      "Верх тіла лишається в плані, бо спина, плечі й постава сильно впливають на загальний вигляд."
    ];

    if (mode === "female_fatloss") {
      tips.unshift("Для зниження жиру головний союзник - регулярна ходьба і стабільний дефіцит, а не виснажливі тренування щодня.");
    }

    if (mode === "female_strength") {
      tips.unshift("У силовому режимі не тестуй максимум щотижня: краще 4-6 якісних повторів із запасом і поступовим додаванням ваги.");
    }

    if (mode === "female_glutes") {
      tips.unshift("Сідничний акцент працює краще, коли є два важчі дні і один помірний день без постійної відмови.");
    }

    if (cyclePhase && cyclePhase !== "none") {
      tips.push("Якщо фаза циклу не збігається з самопочуттям, орієнтуйся на сон, біль, набряклість і готовність до навантаження.");
    }

    return tips;
  }

  function getFemaleProgressionRules(mode, cyclePhase) {
    const rules = [
      "Спочатку добери верхню межу повторів у всіх підходах, потім додавай найменший крок ваги.",
      "У вправах на сідниці прогрес зараховується тільки з паузою, стабільним тазом і без переносу навантаження у поперек.",
      "Якщо сон або самопочуття просіли, залиш вагу і зроби на 1 підхід менше."
    ];

    if (mode === "female_fatloss") {
      rules.unshift("Прогресуй через стабільність тижня: виконані тренування, ходьба і помірна щільність важливіші за рекорди.");
    }

    if (mode === "female_strength") {
      rules.unshift("Додавай вагу тільки після двох тренувань поспіль із чистою технікою і запасом 1-2 повтори.");
    }

    if (cyclePhase === "menstruation" || cyclePhase === "luteal") {
      rules.push("У цю фазу циклу прогрес може бути утриманням ваги, а не її збільшенням.");
    }

    return rules;
  }

  function getFemaleDeloadRules(cyclePhase) {
    const rules = [
      "Якщо два тренування поспіль важкість відчутно вища за норму - зменш підходи на 20-30%.",
      "Біль у тазостегновому, коліні або попереку - прибрати глибину, вагу або вправу, яка провокує біль.",
      "Набряклість, поганий сон і сильна втома - причина залишити тільки технічну роботу і ходьбу."
    ];

    if (cyclePhase === "menstruation") {
      rules.unshift("Під час менструації полегшення є нормальною частиною плану, а не відкатом.");
    }

    return rules;
  }

  function getFemaleWarnings(mode, cyclePhase) {
    const warnings = [
      "Після вагітності, операцій, при діастазі або болю тазового дна потрібна індивідуальна корекція з фахівцем.",
      "Гострий біль, запаморочення або різке погіршення самопочуття - привід зупинити тренування."
    ];

    if (mode === "female_glutes") {
      warnings.push("Сідничний акцент не має перетворюватися на біль у попереку: тримай ребра і таз під контролем.");
    }

    if (cyclePhase === "ovulation") {
      warnings.push("У середині циклу не варто робити різкі стрибки навантаження, якщо суглоби відчуваються менш стабільно.");
    }

    return warnings;
  }


  system.trainingTemplates = {
    applyTrainingConstraints: applyTrainingConstraints,
    getGymBeginnerBasePlan: getGymBeginnerBasePlan,
    applyGymBeginnerStrengthWeightCues: applyGymBeginnerStrengthWeightCues,
    getGymIntermediateAdvancedBasePlan: getGymIntermediateAdvancedBasePlan,
    getHomeBasePlan: getHomeBasePlan,
    getOutdoorEffectiveLevel: getOutdoorEffectiveLevel,
    getOutdoorBasePlan: getOutdoorBasePlan,
    getPrisonWorkoutPlan: getPrisonWorkoutPlan,
    getTabataCircuitPlan: getTabataCircuitPlan,
    getFemaleProgramLabel: getFemaleProgramLabel,
    getFemaleBasePlan: getFemaleBasePlan,
    getFemaleVolumeNote: getFemaleVolumeNote,
    getFemaleTips: getFemaleTips,
    getFemaleProgressionRules: getFemaleProgressionRules,
    getFemaleDeloadRules: getFemaleDeloadRules,
    getFemaleWarnings: getFemaleWarnings
  };

  window.VitalRiseSystem = system;
})();
