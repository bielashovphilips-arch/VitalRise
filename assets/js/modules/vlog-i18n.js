(function () {
  const PAGE_SELECTOR = ".vlog-page";
  const ROOT_SELECTORS = [".vlog-main", ".site-footer"];
  const supportedLanguages = ["uk", "en", "ru"];
  const originalTextNodes = new WeakMap();

  const editorialTranslations = {
    uk: {
      heroLabel: "Влог VitalRise",
      heroTitle: "Влог VitalRise",
      heroLead: "Харчування. Аналізи. Фармакологія. Досвід.",
      articleLabel: "Харчування",
      articleTitle: "Складні дієти починаються не з меню",
      articleLead: "Я не люблю, коли дієту продають як чарівну назву. Кето, карнівор, веганство, періодичне голодування або OMAD можуть працювати, але не тому, що назва звучить сильно. Працює система: енергія, білок, клітковина, мікронутрієнти, сон, тренування, травлення, аналізи і чесність перед собою.",
      sectionTitle: "Початківець часто шукає заборону, а не причину",
      paragraphs: [
        "Початківець часто хоче знайти одного винного: вуглеводи, жир, м'ясо, сніданок, молочку або фрукти. Це зрозуміло: коли є ворог, здається, що з'явився контроль. Але тіло не читає назви дієт. Воно реагує на калорії, білок, рух, сон, стрес, щитоподібну залозу, печінку, нирки, глюкозу і дефіцити.",
        "Моя позиція проста: складна дієта може бути інструментом, але не повинна ставати релігією. Якщо людина перестає дивитися на талію, тиск, ліпіди, глюкозу, сон, травлення, відновлення і силові, вона вже не керує процесом. Вона просто вірить."
      ],
      labsTitle: "Аналізи перед складною дієтою",
      labsParagraphs: [
        "Я не вважаю нормальним заходити в жорстку дієту всліпу. Мінімальна база: загальний аналіз крові, феритин, B12, фолат, 25(OH)D, ТТГ, вільний T4, глюкоза, HbA1c, інсулін за контекстом, ліпідограма, ALT, AST, GGT, білірубін, креатинін/eGFR, сечова кислота, електроліти, артеріальний тиск і окружність талії. Для жінок окремо дивимося цикл, крововтрати, феритин і симптоми щитоподібної залози; для спортсменів - відновлення, силові, сон і травлення.",
        "Мій критерій простий: дієта має доводити користь цифрами і самопочуттям. Якщо вага падає, але разом із нею падають сила, сон, лібідо, настрій, травлення і аналізи, це не перемога. Це красивий мінус на вагах, за який тіло може виставити рахунок пізніше.",
        "Особлива уважність потрібна при діабеті, хворобах нирок, печінки, жовчного міхура, панкреатиті, подагрі, серцево-судинних хворобах, гіпертонії, гіпотиреозі, анемії, вагітності, грудному вигодовуванні, підлітковому віці та розладах харчової поведінки. У цих ситуаціях жорстка дієта без лікаря - не дисципліна, а ризик."
      ],
      recovery: {
        label: "Відновлення / Харчування",
        headings: [
          "Що тіло потребує після тренування: одразу і протягом першої години",
          "Відразу після тренування",
          "Протягом 1 години",
          "Практичне правило VitalRise"
        ],
        paragraphs: [
          "Після важкого тренування головний ресурс, який тіло часто просить повернути першим, - це вуглеводи. Вони допомагають відновлювати глікоген, повертають відчуття \"наповненості\", підтримують нервову систему і зменшують відчуття порожнього тіла після об'ємної роботи. Але це не означає, що білок можна відсунути вбік: при наборі, рекомпозиції або схудненні білок лишається ключовим матеріалом для відновлення тканин і збереження м'язів.",
          "Правильна логіка така: після тренування ми не вигадуємо хаотичний ритуал, а повертаємося до розробленого раціону, де вже пораховано БЖВ під ціль. Вуглеводи закривають енергетичний борг, білок дає амінокислоти, жири не потрібно насильно прибирати, але одразу після важкої сесії їх краще не робити основою прийому, якщо вони заважають швидко добрати вуглеводи і білок.",
          "Якщо тренування було легким, достатньо води і звичайного прийому їжі за планом. Якщо тренування було важким, пріоритет зміщується до вуглеводів, рідини і натрію, але білок залишається обов'язковою частиною добового БЖВ. Найкраще відновлення - це не одна \"магічна\" страва після залу, а раціон, у якому тренування вже враховане."
        ],
        immediate: [
          ["Вода", "перший крок, особливо якщо була спека, довга сесія або сильне потовиділення."],
          ["Натрій / електроліти", "якщо є головний біль, \"ватність\", судоми, різке падіння пампу або багато поту, часто проблема не тільки у воді, а й у солі."],
          ["Легкі вуглеводи", "після важких ніг, спини, великого об'єму або кардіо тіло може краще прийняти банан, рисові хлібці, фрукти, сік, мед, ізотонік або інше просте джерело вуглеводів."],
          ["Заспокоїти ЦНС", "дихання, пульс, душ, спокійна ходьба. Після важкої роботи не завжди потрібна ще одна стимуляція."],
          ["Оцінити стан", "запаморочення, нудота, тремор, холодний піт, сильний головний біль або біль у грудях - це не \"нормальна втома\"."]
        ],
        hour: [
          ["Вуглеводи", "головний ресурс після важкої сесії для відновлення глікогену і працездатності. Чим більший об'єм, чим більше ніг/спини/кардіо і чим ближче наступне тренування, тим важливіші вуглеводи."],
          ["Білок", "важливий для набору, рекомпозиції і схуднення. Він не обов'язково має бути випитий у перші 20 хвилин, але в межах нормального прийому їжі або шейка після тренування він має бути присутній."],
          ["БЖВ під ціль", "на наборі вуглеводи допомагають тренуватися важче і набирати об'єм; на рекомпозиції білок і контроль калорій тримають якість; на схудненні білок захищає м'язи, а вуглеводи треба вписувати в дефіцит, не прибирати автоматично."],
          ["ШКТ", "якщо після навантаження \"не лізе\" тверда їжа, працює м'якший варіант: ізолят/йогурт/кефір плюс банан, рис, пластівці, ягоди або інше легке джерело вуглеводів."],
          ["Не ламати раціон", "після тренування не треба їсти все підряд тільки тому, що \"заслужив\". Післятренувальний прийом має вписуватися в денні калорії, білки, жири і вуглеводи."]
        ]
      }
    },
    en: {
      heroLabel: "VitalRise Vlog",
      heroTitle: "VitalRise Vlog",
      heroLead: "Nutrition. Labs. Pharmacology. Experience.",
      articleLabel: "Nutrition",
      articleTitle: "Complex diets do not start with a menu",
      articleLead: "I do not like it when a diet is sold as a magic name. Keto, carnivore, veganism, intermittent fasting, or OMAD can work, but not because the name sounds powerful. What works is the system: energy, protein, fiber, micronutrients, sleep, training, digestion, lab work, and honesty with yourself.",
      sectionTitle: "Beginners often look for a ban, not the cause",
      paragraphs: [
        "A beginner often wants to find one guilty thing: carbs, fat, meat, breakfast, dairy, or fruit. That is understandable: when there is an enemy, it feels like control has appeared. But the body does not read diet names. It responds to calories, protein, movement, sleep, stress, thyroid status, liver, kidneys, glucose, and deficiencies.",
        "My position is simple: a complex diet can be a tool, but it should not become a religion. If a person stops looking at waist, blood pressure, lipids, glucose, sleep, digestion, recovery, and strength performance, they are no longer managing the process. They are just believing."
      ],
      labsTitle: "Labs before a complex diet",
      labsParagraphs: [
        "I do not consider it normal to enter a strict diet blindly. The minimum baseline: complete blood count, ferritin, B12, folate, 25(OH)D, TSH, free T4, glucose, HbA1c, insulin when context requires it, lipid panel, ALT, AST, GGT, bilirubin, creatinine/eGFR, uric acid, electrolytes, blood pressure, and waist circumference. For women, cycle, blood loss, ferritin, and thyroid symptoms deserve separate attention; for athletes, recovery, strength performance, sleep, and digestion matter.",
        "My criterion is simple: a diet should prove its value through numbers and well-being. If weight drops while strength, sleep, libido, mood, digestion, and labs also drop, that is not a victory. It is a nice-looking minus on the scale that the body may bill you for later.",
        "Extra caution is needed with diabetes, kidney disease, liver disease, gallbladder disease, pancreatitis, gout, cardiovascular disease, hypertension, hypothyroidism, anemia, pregnancy, breastfeeding, adolescence, and eating disorders. In these situations, a strict diet without a doctor is not discipline. It is risk."
      ],
      recovery: {
        label: "Recovery / Nutrition",
        headings: [
          "What the body needs after training: immediately and within the first hour",
          "Immediately after training",
          "Within 1 hour",
          "VitalRise practical rule"
        ],
        paragraphs: [
          "After hard training, the first resource the body often asks to restore is carbohydrates. They help replenish glycogen, bring back the feeling of muscle fullness, support the nervous system, and reduce the empty-body feeling after high-volume work. But that does not mean protein can be pushed aside: during mass gain, recomposition, or fat loss, protein remains key material for tissue repair and muscle retention.",
          "The right logic is this: after training we do not invent a chaotic ritual; we return to the planned diet where macros are already calculated for the goal. Carbohydrates cover the energy debt, protein provides amino acids, and fats do not need to be forcibly removed, but right after a hard session they should not become the base of the meal if they prevent you from getting enough carbs and protein.",
          "If the session was light, water and a normal planned meal are enough. If the session was hard, priority shifts toward carbohydrates, fluid, and sodium, but protein remains a required part of daily macros. The best recovery is not one \"magic\" post-gym meal; it is a diet where training has already been accounted for."
        ],
        immediate: [
          ["Water", "the first step, especially after heat, a long session, or heavy sweating."],
          ["Sodium / electrolytes", "if there is headache, heavy fatigue, cramps, a sharp drop in pump, or a lot of sweat, the problem is often not only water but also salt."],
          ["Easy carbohydrates", "after heavy legs, back, high volume, or cardio, the body may tolerate a banana, rice cakes, fruit, juice, honey, isotonic drink, or another simple carb source better."],
          ["Calm the CNS", "breathing, pulse, shower, and quiet walking. After hard work, another stimulant is not always what the body needs."],
          ["Check your state", "dizziness, nausea, tremor, cold sweat, severe headache, or chest pain is not \"normal fatigue\"."]
        ],
        hour: [
          ["Carbohydrates", "the main resource after a hard session for glycogen and performance recovery. The more volume, legs/back/cardio, and the closer the next session is, the more important carbs become."],
          ["Protein", "important for mass gain, recomposition, and fat loss. It does not need to be consumed in the first 20 minutes, but it should appear in a normal meal or shake after training."],
          ["Macros for the goal", "during mass gain, carbs help train harder and build volume; during recomposition, protein and calorie control hold quality; during fat loss, protein protects muscle, while carbs should be fitted into the deficit, not automatically removed."],
          ["Digestion", "if solid food does not work after training, use a softer option: isolate/yogurt/kefir plus banana, rice, oats, berries, or another easy carb source."],
          ["Do not break the plan", "after training you do not need to eat everything just because you \"earned it\". The post-workout meal should fit daily calories, protein, fats, and carbs."]
        ]
      }
    },
    ru: {
      heroLabel: "Влог VitalRise",
      heroTitle: "Влог VitalRise",
      heroLead: "Питание. Анализы. Фармакология. Опыт.",
      articleLabel: "Питание",
      articleTitle: "Сложные диеты начинаются не с меню",
      articleLead: "Я не люблю, когда диету продают как магическое название. Кето, карнивор, веганство, интервальное голодание или OMAD могут работать, но не потому, что название звучит сильно. Работает система: энергия, белок, клетчатка, микронутриенты, сон, тренировки, пищеварение, анализы и честность перед собой.",
      sectionTitle: "Новичок часто ищет запрет, а не причину",
      paragraphs: [
        "Новичок часто хочет найти одного виноватого: углеводы, жир, мясо, завтрак, молочку или фрукты. Это понятно: когда есть враг, кажется, что появился контроль. Но тело не читает названия диет. Оно реагирует на калории, белок, движение, сон, стресс, щитовидную железу, печень, почки, глюкозу и дефициты.",
        "Моя позиция простая: сложная диета может быть инструментом, но не должна становиться религией. Если человек перестает смотреть на талию, давление, липиды, глюкозу, сон, пищеварение, восстановление и силовые показатели, он уже не управляет процессом. Он просто верит."
      ],
      labsTitle: "Анализы перед сложной диетой",
      labsParagraphs: [
        "Я не считаю нормальным входить в жесткую диету вслепую. Минимальная база: общий анализ крови, ферритин, B12, фолат, 25(OH)D, ТТГ, свободный T4, глюкоза, HbA1c, инсулин по контексту, липидограмма, ALT, AST, GGT, билирубин, креатинин/eGFR, мочевая кислота, электролиты, артериальное давление и окружность талии. Для женщин отдельно смотрим цикл, кровопотери, ферритин и симптомы щитовидной железы; для спортсменов - восстановление, силовые, сон и пищеварение.",
        "Мой критерий простой: диета должна доказывать пользу цифрами и самочувствием. Если вес падает, но вместе с ним падают сила, сон, либидо, настроение, пищеварение и анализы, это не победа. Это красивый минус на весах, за который тело может выставить счет позже.",
        "Особая осторожность нужна при диабете, заболеваниях почек, печени, желчного пузыря, панкреатите, подагре, сердечно-сосудистых заболеваниях, гипертонии, гипотиреозе, анемии, беременности, грудном вскармливании, подростковом возрасте и расстройствах пищевого поведения. В этих ситуациях жесткая диета без врача - не дисциплина, а риск."
      ],
      recovery: {
        label: "Восстановление / Питание",
        headings: [
          "Что тело требует после тренировки: сразу и в течение первого часа",
          "Сразу после тренировки",
          "В течение 1 часа",
          "Практическое правило VitalRise"
        ],
        paragraphs: [
          "После тяжелой тренировки главный ресурс, который тело часто просит вернуть первым, - это углеводы. Они помогают восстанавливать гликоген, возвращают ощущение \"наполненности\", поддерживают нервную систему и уменьшают ощущение пустого тела после объемной работы. Но это не значит, что белок можно отодвинуть в сторону: при наборе, рекомпозиции или похудении белок остается ключевым материалом для восстановления тканей и сохранения мышц.",
          "Правильная логика такая: после тренировки мы не придумываем хаотичный ритуал, а возвращаемся к разработанному рациону, где уже посчитаны БЖУ под цель. Углеводы закрывают энергетический долг, белок дает аминокислоты, жиры не нужно насильно убирать, но сразу после тяжелой сессии их лучше не делать основой приема, если они мешают быстро добрать углеводы и белок.",
          "Если тренировка была легкой, достаточно воды и обычного приема пищи по плану. Если тренировка была тяжелой, приоритет смещается к углеводам, жидкости и натрию, но белок остается обязательной частью суточного БЖУ. Лучшее восстановление - это не одно \"магическое\" блюдо после зала, а рацион, в котором тренировка уже учтена."
        ],
        immediate: [
          ["Вода", "первый шаг, особенно если была жара, длинная сессия или сильное потоотделение."],
          ["Натрий / электролиты", "если есть головная боль, \"ватность\", судороги, резкое падение пампа или много пота, часто проблема не только в воде, но и в соли."],
          ["Легкие углеводы", "после тяжелых ног, спины, большого объема или кардио тело может лучше принять банан, рисовые хлебцы, фрукты, сок, мед, изотоник или другой простой источник углеводов."],
          ["Успокоить ЦНС", "дыхание, пульс, душ, спокойная ходьба. После тяжелой работы не всегда нужна еще одна стимуляция."],
          ["Оценить состояние", "головокружение, тошнота, тремор, холодный пот, сильная головная боль или боль в груди - это не \"нормальная усталость\"."]
        ],
        hour: [
          ["Углеводы", "главный ресурс после тяжелой сессии для восстановления гликогена и работоспособности. Чем больше объем, чем больше ног/спины/кардио и чем ближе следующая тренировка, тем важнее углеводы."],
          ["Белок", "важен для набора, рекомпозиции и похудения. Его не обязательно выпить в первые 20 минут, но в пределах нормального приема пищи или шейка после тренировки он должен быть."],
          ["БЖУ под цель", "на наборе углеводы помогают тренироваться тяжелее и набирать объем; на рекомпозиции белок и контроль калорий держат качество; на похудении белок защищает мышцы, а углеводы нужно вписывать в дефицит, не убирать автоматически."],
          ["ЖКТ", "если после нагрузки \"не лезет\" твердая еда, работает мягкий вариант: изолят/йогурт/кефир плюс банан, рис, хлопья, ягоды или другой легкий источник углеводов."],
          ["Не ломать рацион", "после тренировки не нужно есть все подряд только потому, что \"заслужил\". Послетренировочный прием должен вписываться в дневные калории, белки, жиры и углеводы."]
        ]
      }
    }
  };

  const dietSections = [
    {
      uk: {
        title: "Кето",
        text: "Кето я бачу як жорсткий інструмент, а не стиль життя для всіх. Воно може швидко прибрати воду, зменшити апетит і дати відчуття контролю. Але там, де контроль тримається тільки на забороні вуглеводів, легко не помітити ліпіди, жовчний міхур, закрепи, мало клітковини, падіння вибухової сили і переїдання жиром.",
        bullets: [
          ["БЖВ", "білки 20-25%, жири 65-75%, вуглеводи 5-10% або приблизно 20-50 г чистих вуглеводів."],
          ["Звідки мінімум вуглеводів", "із зелених овочів, листової зелені, броколі, кабачка, огірка, авокадо, невеликої кількості горіхів/насіння і кисломолочних продуктів без цукру за переносимістю. Не з хліба, круп, солодкого, соків, картоплі, макаронів або \"трохи десерту\"."],
          ["Входження в кетоз", "зазвичай потребує кількох днів суворого обмеження вуглеводів, але повна адаптація до тренувань і самопочуття триває довше. Практичні маркери - стабільніша енергія, менший голод, відсутність різких провалів, але не просто сухість у роті або мінус вода на вагах."],
          ["Адаптація", "2-6 тижнів. Часто падає вода, змінюються електроліти, може бути слабкість, головний біль, закрепи, нижча вибухова сила."],
          ["Уважність", "діабет на інсуліні/цукрознижувальних, хвороби жовчного міхура, панкреатит, хронічна хвороба нирок, подагра, високий ЛПНЩ, аритмії, вагітність, розлади харчової поведінки."]
        ],
        meals: [
          "Яйця, авокадо, листова зелень, оливкова олія, риба або м'ясо, огірок, броколі.",
          "Лосось, салат із зелені, оливки, горіхи невеликою порцією, кисломолочний продукт без цукру за переносимістю.",
          "Курка або індичка, кабачок, гриби, зелень, масло/оливкова олія, електроліти за потребою."
        ]
      },
      en: {
        title: "Keto",
        text: "Keto can quickly reduce appetite and water weight, make a calorie deficit easier, and create a feeling of control. But it has a high cost of error: lipids, gallbladder issues, constipation, low fiber, lower strength performance, and the risk of overeating fat.",
        bullets: [
          ["Macros", "protein 20-25%, fats 65-75%, carbs 5-10%, or about 20-50 g of net carbs."],
          ["Where the minimum carbs come from", "green vegetables, leafy greens, broccoli, zucchini, cucumber, avocado, a small amount of nuts/seeds, and unsweetened fermented dairy if tolerated. Not from bread, grains, sweets, juice, potatoes, pasta, or \"a little dessert\"."],
          ["Entering ketosis", "usually requires several days of strict carb restriction, but full adaptation for training and well-being takes longer. Practical markers are steadier energy, less hunger, and fewer crashes, not just dry mouth or water loss on the scale."],
          ["Adaptation", "2-6 weeks. Water often drops, electrolytes change, and weakness, headaches, constipation, or lower explosive power may appear."],
          ["Caution", "diabetes on insulin/glucose-lowering drugs, gallbladder disease, pancreatitis, chronic kidney disease, gout, high LDL, arrhythmias, pregnancy, and eating disorders."]
        ],
        meals: [
          "Eggs, avocado, leafy greens, olive oil, fish or meat, cucumber, broccoli.",
          "Salmon, green salad, olives, a small portion of nuts, and unsweetened fermented dairy if tolerated.",
          "Chicken or turkey, zucchini, mushrooms, greens, butter/olive oil, and electrolytes if needed."
        ]
      },
      ru: {
        title: "Кето",
        text: "Кето может быстро снизить аппетит и воду, упростить дефицит калорий и дать ощущение контроля. Но у этой диеты высокая цена ошибки: липиды, желчный пузырь, запоры, дефицит клетчатки, падение продуктивности в силовых тренировках и риск переедания жиром.",
        bullets: [
          ["БЖУ", "белки 20-25%, жиры 65-75%, углеводы 5-10% или примерно 20-50 г чистых углеводов."],
          ["Откуда берется минимум углеводов", "из зеленых овощей, листовой зелени, брокколи, кабачка, огурца, авокадо, небольшого количества орехов/семян и кисломолочных продуктов без сахара по переносимости. Не из хлеба, круп, сладкого, соков, картофеля, макарон или \"немного десерта\"."],
          ["Вход в кетоз", "обычно требует нескольких дней строгого ограничения углеводов, но полная адаптация для тренировок и самочувствия длится дольше. Практичные маркеры - более стабильная энергия, меньший голод, отсутствие резких провалов, а не просто сухость во рту или минус вода на весах."],
          ["Адаптация", "2-6 недель. Часто уходит вода, меняются электролиты, возможны слабость, головная боль, запоры, более низкая взрывная сила."],
          ["Осторожность", "диабет на инсулине/сахароснижающих препаратах, болезни желчного пузыря, панкреатит, хроническая болезнь почек, подагра, высокий ЛПНП, аритмии, беременность, расстройства пищевого поведения."]
        ],
        meals: [
          "Яйца, авокадо, листовая зелень, оливковое масло, рыба или мясо, огурец, брокколи.",
          "Лосось, салат из зелени, оливки, небольшая порция орехов, кисломолочный продукт без сахара по переносимости.",
          "Курица или индейка, кабачок, грибы, зелень, сливочное/оливковое масло, электролиты при необходимости."
        ]
      }
    },
    {
      uk: {
        title: "Карнівор",
        text: "Карнівор приваблює тим, що майже не залишає вибору. Для людини, яка втомилася від хаосу в їжі, це може звучати як порятунок. Але коли раціон звужується до кількох продуктів, першими страждають клітковина, мікробіом, електроліти, ліпіди, сечова кислота, травлення і нормальне соціальне життя.",
        bullets: [
          ["БЖВ", "білки 25-35%, жири 65-75%, вуглеводи 0-5%. Занадто пісний варіант часто переноситься гірше."],
          ["Звідки мінімум вуглеводів", "переважно з яєць, печінки, морепродуктів, молочних продуктів без цукру за переносимістю і слідових кількостей у продуктах тваринного походження. Не з фруктів, меду, круп, хліба, солодкого або соусів із цукром."],
          ["Адаптація", "2-4 тижні для апетиту, травлення, води й електролітів; довше для ліпідів, кишківника і тренувальної продуктивності."],
          ["Уважність", "хронічна хвороба нирок, подагра, камені в нирках, високий ЛПНЩ/атеросклероз, хвороби жовчного міхура, закрепи, запальні хвороби кишківника, вагітність, анемія або низький фолат."]
        ],
        meals: [
          "Яловичина, яйця, жирна риба, бульйон, сіль, вода; контроль травлення і електролітів.",
          "Індичка або курка плюс яйця і риба, якщо потрібен м'якший варіант за жирністю.",
          "М'ясо, субпродукти невеликими порціями, риба; без героїчного переїдання печінкою через ризик надлишку вітаміну A."
        ]
      },
      en: {
        title: "Carnivore",
        text: "Carnivore often attracts people because it is simple: fewer foods, fewer decisions, and less craving for sweets. But narrowing the diet this much can affect fiber, the microbiome, electrolytes, lipids, uric acid, digestion, and social sustainability.",
        bullets: [
          ["Macros", "protein 25-35%, fats 65-75%, carbs 0-5%. An overly lean version is often harder to tolerate."],
          ["Where the minimum carbs come from", "mainly eggs, liver, seafood, unsweetened dairy if tolerated, and trace amounts in animal foods. Not from fruit, honey, grains, bread, sweets, or sauces with sugar."],
          ["Adaptation", "2-4 weeks for appetite, digestion, water, and electrolytes; longer for lipids, gut response, and training performance."],
          ["Caution", "chronic kidney disease, gout, kidney stones, high LDL/atherosclerosis, gallbladder disease, constipation, inflammatory bowel disease, pregnancy, anemia, or low folate."]
        ],
        meals: [
          "Beef, eggs, fatty fish, broth, salt, water; monitor digestion and electrolytes.",
          "Turkey or chicken plus eggs and fish if a softer fat profile is needed.",
          "Meat, small portions of organ meats, and fish; avoid excessive liver because of vitamin A risk."
        ]
      },
      ru: {
        title: "Карнивор",
        text: "Карнивор часто привлекает простотой: минимум продуктов, минимум решений, меньше тяги к сладкому. Но такое сужение рациона легко бьет по клетчатке, микробиому, электролитам, липидам, мочевой кислоте, пищеварению и социальной устойчивости.",
        bullets: [
          ["БЖУ", "белки 25-35%, жиры 65-75%, углеводы 0-5%. Слишком постный вариант часто переносится хуже."],
          ["Откуда берется минимум углеводов", "в основном из яиц, печени, морепродуктов, молочных продуктов без сахара по переносимости и следовых количеств в продуктах животного происхождения. Не из фруктов, меда, круп, хлеба, сладкого или соусов с сахаром."],
          ["Адаптация", "2-4 недели для аппетита, пищеварения, воды и электролитов; дольше для липидов, кишечника и тренировочной продуктивности."],
          ["Осторожность", "хроническая болезнь почек, подагра, камни в почках, высокий ЛПНП/атеросклероз, болезни желчного пузыря, запоры, воспалительные заболевания кишечника, беременность, анемия или низкий фолат."]
        ],
        meals: [
          "Говядина, яйца, жирная рыба, бульон, соль, вода; контроль пищеварения и электролитов.",
          "Индейка или курица плюс яйца и рыба, если нужен более мягкий вариант по жирности.",
          "Мясо, субпродукты небольшими порциями, рыба; без чрезмерного употребления печени из-за риска избытка витамина A."
        ]
      }
    },
    {
      uk: {
        title: "Веганська дієта",
        text: "Веганський раціон може бути дуже сильним: багато клітковини, рослинної їжі, контроль калорійності, хороший вплив на ліпіди у частини людей. Але я не купую ідею, що рослинне автоматично означає здорове. Веганство без планування швидко б'є по білку, B12, залізу, йоду, цинку, кальцію, вітаміну D і омега-3.",
        bullets: [
          ["БЖВ", "білки 15-25%, жири 20-30%, вуглеводи 50-65%. Для силових цілей білок часто тримають ближче до верхньої межі."],
          ["Адаптація", "4-8 тижнів. Кишківник звикає до клітковини, треба навчитися збирати білок, лейцин, B12, залізо, йод, цинк, кальцій, вітамін D, омега-3."],
          ["Уважність", "анемія, низький феритин, B12-дефіцит, гіпотиреоз без контролю йоду, вагітність, підлітковий вік, розлади харчової поведінки, синдром подразненого кишківника, целіакія."]
        ],
        meals: [
          "Вівсянка, соєвий йогурт або тофу, ягоди, насіння; далі сочевиця, рис/гречка, овочі, оливкова олія.",
          "Тофу або темпе, картопля/булгур, салат, бобові, фрукти; B12 як обов'язковий контроль, не як опція.",
          "Веганський силовий день: соєвий протеїн, крупа, бобові, овочі, горіхи, джерело омега-3, достатня сіль за потовиділенням."
        ]
      },
      en: {
        title: "Vegan diet",
        text: "A vegan diet can be a strong tool for controlling calories, fiber, lipids, and plant-food variety. But it does not become healthy automatically just because it is plant-based. It needs planning, not heroics.",
        bullets: [
          ["Macros", "protein 15-25%, fats 20-30%, carbs 50-65%. For strength goals, protein often needs to stay closer to the upper range."],
          ["Adaptation", "4-8 weeks. The gut adapts to fiber, and the diet must intentionally cover protein, leucine, B12, iron, iodine, zinc, calcium, vitamin D, and omega-3."],
          ["Caution", "anemia, low ferritin, B12 deficiency, hypothyroidism without iodine control, pregnancy, adolescence, eating disorders, irritable bowel syndrome, and celiac disease."]
        ],
        meals: [
          "Oats, soy yogurt or tofu, berries, seeds; later lentils, rice/buckwheat, vegetables, and olive oil.",
          "Tofu or tempeh, potatoes/bulgur, salad, legumes, fruit; B12 is mandatory control, not an option.",
          "Vegan strength day: soy protein, grains, legumes, vegetables, nuts, an omega-3 source, and enough salt for sweating."
        ]
      },
      ru: {
        title: "Веганская диета",
        text: "Веганский рацион может быть сильным инструментом для контроля калорийности, клетчатки, липидов и разнообразия растительной пищи. Но он не становится автоматически здоровым только потому, что растительный. Здесь нужно планирование, а не героизм.",
        bullets: [
          ["БЖУ", "белки 15-25%, жиры 20-30%, углеводы 50-65%. Для силовых целей белок часто держат ближе к верхней границе."],
          ["Адаптация", "4-8 недель. Кишечник привыкает к клетчатке, нужно научиться собирать белок, лейцин, B12, железо, йод, цинк, кальций, витамин D, омега-3."],
          ["Осторожность", "анемия, низкий ферритин, дефицит B12, гипотиреоз без контроля йода, беременность, подростковый возраст, расстройства пищевого поведения, синдром раздраженного кишечника, целиакия."]
        ],
        meals: [
          "Овсянка, соевый йогурт или тофу, ягоды, семена; далее чечевица, рис/гречка, овощи, оливковое масло.",
          "Тофу или темпе, картофель/булгур, салат, бобовые, фрукты; B12 как обязательный контроль, не как опция.",
          "Веганский силовой день: соевый протеин, крупа, бобовые, овощи, орехи, источник омега-3, достаточно соли при потоотделении."
        ]
      }
    },
    {
      uk: {
        title: "Періодичне голодування",
        text: "Періодичне голодування я сприймаю не як магію, а як інструмент дисципліни. Якщо людині легше не їсти зранку і нормально зібрати денний білок у своє вікно - окей. Якщо ж вона весь день терпить, а ввечері зривається і називає це системою, тоді це не голодування. Це відкладений хаос.",
        bullets: [
          ["БЖВ", "це не окрема дієта, а режим часу. Робочий старт: білки 25-30%, жири 25-35%, вуглеводи 35-50%."],
          ["Адаптація", "2-3 тижні. Голод, концентрація, сон і тренування перебудовуються; якщо білок не влазить у вікно, формат невдалий."],
          ["Уважність", "діабет на ліках, гіпоглікемія, гастрит/рефлюкс із загостреннями, вагітність, ГВ, підлітковий вік, розлади харчової поведінки, важкі тренування вранці."]
        ],
        meals: [
          "Вікно 10:00-18:00: білковий сніданок, обід із крупою, вечеря з овочами і білком.",
          "Вікно 12:00-20:00: два великі прийоми їжі плюс білковий перекус після тренування.",
          "М'якший старт: 12-годинна нічна пауза, потім 14 годин, і тільки після адаптації коротше вікно."
        ]
      },
      en: {
        title: "Intermittent fasting",
        text: "Intermittent fasting works when it helps a person avoid overeating. It has no magic that cancels calories. For some people it is convenient; for others it triggers evening binges, anxiety around food, lower performance, or trouble hitting protein.",
        bullets: [
          ["Macros", "this is not a separate diet, but a timing format. A workable start: protein 25-30%, fats 25-35%, carbs 35-50%."],
          ["Adaptation", "2-3 weeks. Hunger, focus, sleep, and training shift; if protein does not fit into the eating window, the format is not working."],
          ["Caution", "diabetes on medication, hypoglycemia, gastritis/reflux flare-ups, pregnancy, breastfeeding, adolescence, eating disorders, and heavy morning training."]
        ],
        meals: [
          "10:00-18:00 window: protein breakfast, lunch with grains, dinner with vegetables and protein.",
          "12:00-20:00 window: two large meals plus a protein snack after training.",
          "Softer start: 12-hour overnight pause, then 14 hours, and only after adaptation a shorter window."
        ]
      },
      ru: {
        title: "Интервальное голодание",
        text: "Интервальное голодание работает тогда, когда помогает не переедать. В нем нет магии, которая отменяет калории. Для кого-то это удобно, а у кого-то провоцирует вечерние срывы, тревожность вокруг еды, падение продуктивности или проблемы с набором белка.",
        bullets: [
          ["БЖУ", "это не отдельная диета, а режим времени. Рабочий старт: белки 25-30%, жиры 25-35%, углеводы 35-50%."],
          ["Адаптация", "2-3 недели. Голод, концентрация, сон и тренировки перестраиваются; если белок не помещается в окно, формат неудачный."],
          ["Осторожность", "диабет на лекарствах, гипогликемия, гастрит/рефлюкс с обострениями, беременность, ГВ, подростковый возраст, расстройства пищевого поведения, тяжелые тренировки утром."]
        ],
        meals: [
          "Окно 10:00-18:00: белковый завтрак, обед с крупой, ужин с овощами и белком.",
          "Окно 12:00-20:00: два больших приема пищи плюс белковый перекус после тренировки.",
          "Более мягкий старт: 12-часовая ночная пауза, потом 14 часов, и только после адаптации более короткое окно."
        ]
      }
    },
    {
      uk: {
        title: "OMAD / безвуглеводний OMAD",
        text: "OMAD виглядає красиво тільки на папері: один прийом їжі, ніяких перекусів, ніяких зайвих рішень. Але на практиці це дуже вузький коридор. Є звичайний OMAD, де в один прийом ще можна зібрати білки, жири, овочі і вуглеводи. А є безвуглеводний OMAD - по суті, голодування плюс майже кето/карнівор в одному прийомі. Це вже не лайфхак, а високоризиковий формат.",
        bullets: [
          ["OMAD з вуглеводами", "білки 25-35%, жири 25-40%, вуглеводи 25-45%. Головний ризик - не добрати білок, клітковину, калій, магній, кальцій і загальну калорійність."],
          ["Безвуглеводний OMAD", "білки 30-40%, жири 60-70%, вуглеводи 0-5%. Це поєднання дуже вузького вікна їжі і дуже низьких вуглеводів, тому адаптація складніша, ніж у звичайному голодуванні або кето окремо."],
          ["Адаптація", "2-4 тижні для голоду, травлення, електролітів, тренувань і сну. Якщо падає продуктивність, зривається сон або не набирається білок, формат не підходить."],
          ["Побічні дії", "головний біль, слабкість, запаморочення, дратівливість, холод, тремтіння, нудота, рефлюкс, переїдання ввечері, закрепи або діарея, неприємний запах з рота, судоми, погіршення сну, падіння сили і концентрації."],
          ["Ризики", "гіпоглікемія, зневоднення, електролітні зсуви, підвищення ЛПНЩ у частини людей, загострення жовчного міхура або рефлюксу, камені в нирках/подагра у схильних, зриви харчової поведінки, порушення циклу у жінок, погіршення відновлення при важких тренуваннях."],
          ["Кому не стартувати без лікаря", "діабет на інсуліні або цукрознижувальних, епізоди гіпоглікемії, вагітність, ГВ, підлітковий вік, розлади харчової поведінки, хронічна хвороба нирок, хвороби печінки, жовчного міхура, панкреатит, подагра, аритмії, низька вага, важкі щоденні тренування."]
        ],
        meals: [
          "OMAD з вуглеводами: м'ясо або риба, рис/картопля/гречка, великий салат, оливкова олія, ягоди або фрукт, кисломолочний продукт за переносимістю.",
          "OMAD спортивний: нежирний білок, крупа або картопля після тренування, овочі, сіль, вода; білок добирається в межах одного прийому без перевантаження ШКТ.",
          "Безвуглеводний OMAD: яйця, риба або м'ясо, бульйон, сіль, вода, невелика кількість зелені або огірка за переносимістю; без круп, фруктів, меду, соків і солодких соусів."
        ],
        monitor: [
          "Вага, талія, тиск, пульс, сон, сила, кроки, голод, настрій, травлення, менструальний цикл.",
          "Глюкоза, HbA1c, ліпідограма, ALT, AST, GGT, білірубін, креатинін/eGFR, сечова кислота, електроліти, феритин, B12, 25(OH)D за контекстом.",
          "Стоп-сигнали: непритомність, сильне запаморочення, біль у грудях, серцебиття, стійке безсоння, різке падіння сили, симптоми гіпоглікемії, жовчний біль, депресивні думки або зриви харчової поведінки."
        ]
      },
      en: {
        title: "OMAD / zero-carb OMAD",
        text: "OMAD looks clean on paper: one meal, no snacks, no extra decisions. In practice, it is a very narrow lane. Regular OMAD can still include protein, fats, vegetables, and carbs in one meal. Zero-carb OMAD is fasting plus almost keto/carnivore in one meal. That is not a lifehack; it is a high-risk format.",
        bullets: [
          ["OMAD with carbs", "protein 25-35%, fats 25-40%, carbs 25-45%. The main risk is missing protein, fiber, potassium, magnesium, calcium, and total calories."],
          ["Zero-carb OMAD", "protein 30-40%, fats 60-70%, carbs 0-5%. This combines a very narrow eating window with very low carbs, so adaptation is harder than fasting or keto alone."],
          ["Adaptation", "2-4 weeks for hunger, digestion, electrolytes, training, and sleep. If performance drops, sleep breaks, or protein does not fit, the format is not suitable."],
          ["Side effects", "headache, weakness, dizziness, irritability, feeling cold, trembling, nausea, reflux, evening overeating, constipation or diarrhea, bad breath, cramps, worse sleep, lower strength and focus."],
          ["Risks", "hypoglycemia, dehydration, electrolyte shifts, higher LDL in some people, gallbladder or reflux flare-ups, kidney stones/gout in predisposed people, eating-behavior relapse, cycle disruption in women, and worse recovery with hard training."],
          ["Do not start without a doctor", "diabetes on insulin or glucose-lowering medication, hypoglycemia episodes, pregnancy, breastfeeding, adolescence, eating disorders, chronic kidney disease, liver/gallbladder disease, pancreatitis, gout, arrhythmias, low body weight, or heavy daily training."]
        ],
        meals: [
          "OMAD with carbs: meat or fish, rice/potatoes/buckwheat, a large salad, olive oil, berries or fruit, fermented dairy if tolerated.",
          "Sports OMAD: lean protein, grains or potatoes after training, vegetables, salt, water; protein must fit without overloading digestion.",
          "Zero-carb OMAD: eggs, fish or meat, broth, salt, water, a small amount of greens or cucumber if tolerated; no grains, fruit, honey, juice, or sweet sauces."
        ],
        monitor: [
          "Weight, waist, blood pressure, resting pulse, sleep, strength, steps, hunger, mood, digestion, menstrual cycle.",
          "Glucose, HbA1c, lipid panel, ALT, AST, GGT, bilirubin, creatinine/eGFR, uric acid, electrolytes, ferritin, B12, 25(OH)D when relevant.",
          "Stop signals: fainting, strong dizziness, chest pain, palpitations, persistent insomnia, sharp strength drop, hypoglycemia symptoms, gallbladder pain, depressive thoughts, or eating-behavior relapse."
        ]
      },
      ru: {
        title: "OMAD / безуглеводный OMAD",
        text: "OMAD красиво выглядит только на бумаге: один прием пищи, никаких перекусов, никаких лишних решений. На практике это очень узкий коридор. Есть обычный OMAD, где в один прием еще можно собрать белки, жиры, овощи и углеводы. А есть безуглеводный OMAD - по сути, голодание плюс почти кето/карнивор в одном приеме. Это уже не лайфхак, а высокорисковый формат.",
        bullets: [
          ["OMAD с углеводами", "белки 25-35%, жиры 25-40%, углеводы 25-45%. Главный риск - не добрать белок, клетчатку, калий, магний, кальций и общую калорийность."],
          ["Безуглеводный OMAD", "белки 30-40%, жиры 60-70%, углеводы 0-5%. Это сочетание очень узкого окна еды и очень низких углеводов, поэтому адаптация сложнее, чем у обычного голодания или кето отдельно."],
          ["Адаптация", "2-4 недели для голода, пищеварения, электролитов, тренировок и сна. Если падает продуктивность, ломается сон или не набирается белок, формат не подходит."],
          ["Побочные действия", "головная боль, слабость, головокружение, раздражительность, холод, дрожь, тошнота, рефлюкс, вечернее переедание, запор или диарея, неприятный запах изо рта, судороги, ухудшение сна, падение силы и концентрации."],
          ["Риски", "гипогликемия, обезвоживание, электролитные сдвиги, повышение ЛПНП у части людей, обострение желчного пузыря или рефлюкса, камни в почках/подагра у склонных, срывы пищевого поведения, нарушение цикла у женщин, ухудшение восстановления при тяжелых тренировках."],
          ["Кому не стартовать без врача", "диабет на инсулине или сахароснижающих, эпизоды гипогликемии, беременность, ГВ, подростковый возраст, расстройства пищевого поведения, хроническая болезнь почек, болезни печени, желчного пузыря, панкреатит, подагра, аритмии, низкий вес, тяжелые ежедневные тренировки."]
        ],
        meals: [
          "OMAD с углеводами: мясо или рыба, рис/картофель/гречка, большой салат, оливковое масло, ягоды или фрукт, кисломолочный продукт по переносимости.",
          "Спортивный OMAD: нежирный белок, крупа или картофель после тренировки, овощи, соль, вода; белок добирается в одном приеме без перегруза ЖКТ.",
          "Безуглеводный OMAD: яйца, рыба или мясо, бульон, соль, вода, немного зелени или огурца по переносимости; без круп, фруктов, меда, соков и сладких соусов."
        ],
        monitor: [
          "Вес, талия, давление, пульс, сон, сила, шаги, голод, настроение, пищеварение, менструальный цикл.",
          "Глюкоза, HbA1c, липидограмма, ALT, AST, GGT, билирубин, креатинин/eGFR, мочевая кислота, электролиты, ферритин, B12, 25(OH)D по контексту.",
          "Стоп-сигналы: обморок, сильное головокружение, боль в груди, сердцебиение, стойкая бессонница, резкое падение силы, симптомы гипогликемии, желчная боль, депрессивные мысли или срывы пищевого поведения."
        ]
      }
    },
    {
      uk: {
        title: "Середземноморська",
        text: "Якщо мені треба дати людині не ефектну, а довгострокову базу, я часто дивлюся саме в цей бік. Середземноморська модель не воює з вуглеводами. Вона вчить вибирати їх якість і порцію: овочі, фрукти, бобові, цільні крупи, риба, оливкова олія, горіхи, кисломолочні продукти за переносимістю.",
        bullets: [
          ["БЖВ", "білки 20-25%, жири 30-40%, вуглеводи 35-50%."],
          ["Адаптація", "2-4 тижні. Стає легше тримати ситість, клітковину, тиск і ліпіди; організм звикає до більшої частки цільної їжі."],
          ["Уважність", "ожиріння з переїданням горіхів/олії, діабет без контролю порцій, хвороби жовчного міхура, алергія на рибу/горіхи, целіакія при виборі круп."]
        ],
        meals: [
          "Риба, гречка або булгур, великий салат, оливкова олія, фрукти, йогурт за переносимістю.",
          "Курка/індичка, картопля, овочі, бобові, зелень, горіхи невеликою порцією.",
          "Сир кисломолочний або яйця, цільнозерновий хліб, овочі; ввечері риба, рис, салат."
        ]
      },
      en: {
        title: "Mediterranean",
        text: "A strong carbohydrate base for most people: vegetables, fruit, legumes, whole grains, fish, olive oil, nuts, and fermented dairy if tolerated. It does not fight carbs; it teaches quality and portion control.",
        bullets: [
          ["Macros", "protein 20-25%, fats 30-40%, carbs 35-50%."],
          ["Adaptation", "2-4 weeks. Satiety, fiber, blood pressure, and lipids become easier to manage; the body adapts to more whole foods."],
          ["Caution", "obesity with overeating nuts/oil, diabetes without portion control, gallbladder disease, fish/nut allergy, and celiac disease when choosing grains."]
        ],
        meals: [
          "Fish, buckwheat or bulgur, a large salad, olive oil, fruit, and yogurt if tolerated.",
          "Chicken/turkey, potatoes, vegetables, legumes, greens, and a small portion of nuts.",
          "Cottage cheese or eggs, whole-grain bread, vegetables; in the evening fish, rice, salad."
        ]
      },
      ru: {
        title: "Средиземноморская",
        text: "Сильная углеводная база для большинства людей: овощи, фрукты, бобовые, цельные крупы, рыба, оливковое масло, орехи, кисломолочные продукты по переносимости. Она не требует воевать с углеводами, а учит выбирать их качество и порцию.",
        bullets: [
          ["БЖУ", "белки 20-25%, жиры 30-40%, углеводы 35-50%."],
          ["Адаптация", "2-4 недели. Становится легче держать сытость, клетчатку, давление и липиды; организм привыкает к большей доле цельной еды."],
          ["Осторожность", "ожирение с перееданием орехов/масла, диабет без контроля порций, болезни желчного пузыря, аллергия на рыбу/орехи, целиакия при выборе круп."]
        ],
        meals: [
          "Рыба, гречка или булгур, большой салат, оливковое масло, фрукты, йогурт по переносимости.",
          "Курица/индейка, картофель, овощи, бобовые, зелень, небольшая порция орехов.",
          "Кисломолочный творог или яйца, цельнозерновой хлеб, овощи; вечером рыба, рис, салат."
        ]
      }
    },
    {
      uk: {
        title: "DASH",
        text: "DASH - це не модна дієта, а спокійна система для людей, яким важливі тиск, серце, вага і стабільність. Тут немає драми й заборон заради заборон. Є овочі, фрукти, цільні злаки, бобові, нежирні білки, контроль солі, насичених жирів і ультраобробленої їжі.",
        bullets: [
          ["БЖВ", "білки 18-25%, жири 25-30%, вуглеводи 45-55%."],
          ["Адаптація", "2-6 тижнів. Смак адаптується до меншої солі, тиск може реагувати поступово, клітковину краще піднімати не різко."],
          ["Уважність", "хронічна хвороба нирок із обмеженням калію/фосфору, діабет без контролю фруктів і круп, гіпотонія, діуретики або препарати тиску."]
        ],
        meals: [
          "Вівсянка, ягоди, йогурт; обід - курка, гречка, овочі; вечеря - риба, картопля, салат.",
          "Бобові, рис, овочі, нежирний білок, фрукти; сіль контролюється, смак добирається спеціями.",
          "Яйця або кисломолочний білок, цільнозерновий хліб, овочі; далі індичка, крупа, салат."
        ]
      },
      en: {
        title: "DASH",
        text: "DASH fits people who care about blood pressure, heart health, weight, and stability. The base is vegetables, fruit, whole grains, legumes, lean proteins, and control of salt, saturated fats, and ultra-processed foods.",
        bullets: [
          ["Macros", "protein 18-25%, fats 25-30%, carbs 45-55%."],
          ["Adaptation", "2-6 weeks. Taste adapts to less salt, blood pressure may respond gradually, and fiber should be increased smoothly."],
          ["Caution", "chronic kidney disease with potassium/phosphorus restriction, diabetes without fruit/grain control, hypotension, diuretics, or blood-pressure medication."]
        ],
        meals: [
          "Oats, berries, yogurt; lunch - chicken, buckwheat, vegetables; dinner - fish, potatoes, salad.",
          "Legumes, rice, vegetables, lean protein, fruit; salt is controlled and flavor comes from spices.",
          "Eggs or fermented dairy protein, whole-grain bread, vegetables; later turkey, grains, salad."
        ]
      },
      ru: {
        title: "DASH",
        text: "DASH хорошо подходит людям, которым важны давление, сердце, вес и стабильность. Основа - овощи, фрукты, цельные злаки, бобовые, нежирные белки, контроль соли, насыщенных жиров и ультраобработанной еды.",
        bullets: [
          ["БЖУ", "белки 18-25%, жиры 25-30%, углеводы 45-55%."],
          ["Адаптация", "2-6 недель. Вкус адаптируется к меньшему количеству соли, давление может реагировать постепенно, клетчатку лучше повышать не резко."],
          ["Осторожность", "хроническая болезнь почек с ограничением калия/фосфора, диабет без контроля фруктов и круп, гипотония, диуретики или препараты давления."]
        ],
        meals: [
          "Овсянка, ягоды, йогурт; обед - курица, гречка, овощи; ужин - рыба, картофель, салат.",
          "Бобовые, рис, овощи, нежирный белок, фрукты; соль контролируется, вкус добирается специями.",
          "Яйца или кисломолочный белок, цельнозерновой хлеб, овощи; далее индейка, крупа, салат."
        ]
      }
    },
    {
      uk: {
        title: "Спортивна вуглеводна",
        text: "Для людини, яка тренується важко, вуглеводи часто не проблема, а паливо. Я не бачу сенсу різати їх до нуля, якщо мета - сила, продуктивність, памп, глікоген і нормальні тренування. Тут раціон будується навколо білка, круп, картоплі, фруктів, овочів, бобових і грамотного розподілу вуглеводів навколо навантаження.",
        bullets: [
          ["БЖВ", "білки 20-30%, жири 20-30%, вуглеводи 45-60%. Для витривалості вуглеводи можуть бути ще вищими за планом."],
          ["Адаптація", "2-4 тижні. Повертається глікоген, памп, продуктивність і вага води; це не жир, а нормальна частина запасу палива."],
          ["Уважність", "інсулінорезистентність, діабет, високі тригліцериди, жирова хвороба печінки, рефлюкс, синдром подразненого кишківника, неконтрольовані зриви на солодке."]
        ],
        meals: [
          "Перед тренуванням: рис/картопля, нежирний білок, трохи овочів; після - білок, крупа, фрукти.",
          "Для набору: 4 прийоми, у кожному білок; вуглеводи розподілені навколо тренування і першої половини дня.",
          "Для схуднення зі спортом: білок високий, жири помірні, вуглеводи залишаються біля тренувань, а не ріжуться до нуля."
        ]
      },
      en: {
        title: "Sports carb-based diet",
        text: "For strength, endurance, and muscle gain, carbs are often fuel, not the enemy. The diet is built around protein, grains, potatoes, fruit, vegetables, legumes, and smart carb distribution around training.",
        bullets: [
          ["Macros", "protein 20-30%, fats 20-30%, carbs 45-60%. For endurance work, carbs may be even higher by plan."],
          ["Adaptation", "2-4 weeks. Glycogen, pump, performance, and water weight return; this is not fat, but a normal part of fuel storage."],
          ["Caution", "insulin resistance, diabetes, high triglycerides, fatty liver disease, reflux, irritable bowel syndrome, and uncontrolled sweet binges."]
        ],
        meals: [
          "Before training: rice/potatoes, lean protein, a small amount of vegetables; after - protein, grains, fruit.",
          "For gaining: 4 meals, protein in each; carbs are distributed around training and the first half of the day.",
          "For fat loss with sport: high protein, moderate fats, carbs stay near training and are not cut to zero."
        ]
      },
      ru: {
        title: "Спортивная углеводная",
        text: "Для силовых, выносливости и набора мышц углеводы часто не враг, а топливо. Рацион строится вокруг белка, круп, картофеля, фруктов, овощей, бобовых и разумного распределения углеводов вокруг тренировок.",
        bullets: [
          ["БЖУ", "белки 20-30%, жиры 20-30%, углеводы 45-60%. Для выносливости углеводы могут быть еще выше по плану."],
          ["Адаптация", "2-4 недели. Возвращается гликоген, памп, продуктивность и вес воды; это не жир, а нормальная часть запаса топлива."],
          ["Осторожность", "инсулинорезистентность, диабет, высокие триглицериды, жировая болезнь печени, рефлюкс, синдром раздраженного кишечника, неконтролируемые срывы на сладкое."]
        ],
        meals: [
          "Перед тренировкой: рис/картофель, нежирный белок, немного овощей; после - белок, крупа, фрукты.",
          "Для набора: 4 приема, в каждом белок; углеводы распределены вокруг тренировки и первой половины дня.",
          "Для похудения со спортом: белок высокий, жиры умеренные, углеводы остаются возле тренировок, а не режутся до нуля."
        ]
      }
    }
  ];

  const supportGuideTranslations = {
    en: {
      label: "Digestion and organ support",
      title: "GI tract, enzymes, sports nutrition, and tolerance control",
      intro: "This block is not about treatment or \"detox\". It is a practical map: what may help you tolerate nutrition, protein, fiber, water, electrolytes, and training load, and where you should stop and see a doctor.",
      tabsLabel: "Support areas",
      tabs: ["Digestion", "Gut", "Liver / bile", "Kidneys / electrolytes", "Stop signals"],
      cards: [
        {
          label: "Digestion",
          title: "Enzymes and lactase",
          text: "Enzymes can be useful as a short-term tool with large meals, high protein, fatty meals, or a transition to higher calories. Lactase is a separate option when dairy causes bloating, rumbling, or discomfort.",
          items: [
            ["Appropriate", "mass gain, 4-5 meals, heaviness after protein/fats, dairy intolerance issues."],
            ["Caution", "pain, heartburn, gastritis/ulcer, diarrhea, pancreatic or biliary symptoms."],
            ["Does not replace", "diagnosis of the cause if discomfort repeats."]
          ],
          marketTitle: "Pharmacy names in Ukraine",
          marketItems: [
            ["Pancreatin capsules/microgranules", "Creon 10000/25000, Hermital 10000/25000/36000, Mezym capsules 10000/25000."],
            ["Working alternatives", "Panzynorm 10000, Panzynorm forte 20000, Creazym 20000, Festal Neo 10000."],
            ["For dairy products", "Sunlife Laktase 6000, Scitec Nutrition Lactase, Nature's Way Lactase Enzyme, NOW Dairy Digest Complete, Metagenics EnzyDigest Lactose."],
            ["Selection criterion", "look at lipase activity, enteric-coated form, tolerability, and the task, not only the brand."]
          ]
        },
        {
          label: "Gut",
          title: "Psyllium, fiber, prebiotics",
          text: "Fiber is useful only when introduced gradually. Psyllium may help with stool, satiety, and appetite control, but without enough water it can worsen well-being.",
          items: [
            ["Appropriate", "low fiber intake, constipation, fat loss, hunger control."],
            ["Start", "small doses, with water, without a sharp jump in fiber."],
            ["Caution", "bloating, pain, irritable bowel syndrome, chronic diarrhea."]
          ]
        },
        {
          label: "Gut",
          title: "Probiotics and fermented foods",
          text: "Probiotics are not a universal supplement \"for everyone\". It is better to view them for a specific context: after antibiotics, during a diet change, or with unstable digestion.",
          items: [
            ["Appropriate", "limited course, specific task, reaction assessment."],
            ["Caution", "immunodeficiency, severe disease, fever, blood in stool."],
            ["Rule", "if a product worsens symptoms, it is not \"cleansing\"; it is a signal to stop."]
          ]
        },
        {
          label: "Sports nutrition",
          title: "Protein, gainer, and tolerability",
          text: "If protein causes bloating, look at the type: concentrate, isolate, hydrolysate, casein, or plant protein. Gainers are often poorly tolerated because of a large portion, milk, sugars, or maltodextrin.",
          items: [
            ["Appropriate", "isolate when concentrate is poorly tolerated, smaller portions, water instead of milk."],
            ["Caution", "gainers during fat loss, insulin resistance, reflux, or strong bloating."],
            ["Rule", "sports nutrition should make the diet easier, not break the GI tract."]
          ]
        },
        {
          label: "Liver / bile",
          title: "NAC, TUDCA, silymarin, choline",
          text: "This is not \"detox\" and not permission to overload the liver. Liver support only makes sense next to control of ALT, AST, GGT, bilirubin, lipids, alcohol, medications, and pharmacological load.",
          items: [
            ["Appropriate", "educationally, with lab control and a clear reason for the load."],
            ["Caution", "jaundice, dark urine, right upper abdominal pain, itching, high bilirubin."],
            ["Rule", "a supplement does not cancel toxic behavior, alcohol, or dangerous drugs."]
          ]
        },
        {
          label: "Bile / fats",
          title: "Fat digestion",
          text: "Heaviness after fatty food is not always solved by enzymes. It is important to assess dietary fat, the gallbladder, liver markers, stool, and the reaction to large meals.",
          items: [
            ["Appropriate", "smaller fat portions, even distribution across meals, symptom control."],
            ["Caution", "sharp pain, nausea after fat, pale stool, dark urine, jaundice."],
            ["Do not do", "do not try to \"push bile\" with supplements without understanding the cause."]
          ]
        },
        {
          label: "Kidneys / water",
          title: "Electrolytes, magnesium, creatine",
          text: "For kidneys, the main things are not \"special sports supplements\", but water, blood pressure, sodium/potassium, labs, and health context. Creatine can change creatinine as a marker, so it is important to look beyond one number: eGFR, symptoms, kidney history, and medication context.",
          items: [
            ["Appropriate", "water, electrolytes with sweating, magnesium if tolerated, blood pressure control."],
            ["Caution", "chronic kidney disease, edema, high blood pressure, poor creatinine/eGFR."],
            ["Rule", "with kidney disease, supplements only with a doctor."]
          ]
        },
        {
          label: "Stop signals",
          title: "When not to experiment",
          text: "If red flags are present, supplements do not \"support the body\"; they can delay proper diagnosis.",
          plainItems: [
            "Blood in stool, black stool, persistent diarrhea, or sharp abdominal pain.",
            "Jaundice, dark urine, pale stool, itching, pain on the right under the ribs.",
            "Edema, high blood pressure, sharp decrease in urine, poor creatinine/eGFR.",
            "Sharp weight loss, fever, night sweats, severe weakness."
          ]
        }
      ],
      sourcesTitle: "Sources for verification",
      sources: [
        "NIH ODS: Probiotics fact sheet",
        "NCCIH: Probiotics usefulness and safety",
        "NIH ODS: Magnesium fact sheet",
        "National Kidney Foundation: Creatinine",
        "Tabletki.ua: digestive enzymes in Ukrainian pharmacies",
        "Apteka 9-1-1: digestive enzymes"
      ]
    },
    ru: {
      label: "Пищеварение и поддержка органов",
      title: "ЖКТ, ферменты, спортпит и контроль переносимости",
      intro: "Этот блок не о лечении и не о \"детоксе\". Это практическая карта: что может помочь переносить рацион, белок, клетчатку, воду, электролиты и тренировочную нагрузку, а где нужно остановиться и идти к врачу.",
      tabsLabel: "Направления поддержки",
      tabs: ["Пищеварение", "Кишечник", "Печень / желчь", "Почки / электролиты", "Стоп-сигналы"],
      cards: [
        {
          label: "Пищеварение",
          title: "Ферменты и лактаза",
          text: "Ферменты уместны как короткий инструмент при больших приемах пищи, высоком белке, жирных блюдах или переходе на более высокий калораж. Лактаза - отдельная опция, если молочные продукты дают вздутие, бурление или дискомфорт.",
          items: [
            ["Уместно", "набор массы, 4-5 приемов, тяжесть после белка/жиров, проблемы с молочкой."],
            ["Осторожно", "боль, изжога, гастрит/язва, диарея, панкреатические или желчные симптомы."],
            ["Не заменяет", "диагностику причин, если дискомфорт повторяется."]
          ],
          marketTitle: "Аптечные названия в Украине",
          marketItems: [
            ["Капсулы/микрогранулы панкреатина", "Креон 10000/25000, Эрмиталь 10000/25000/36000, Мезим капсулы 10000/25000."],
            ["Рабочие альтернативы", "Панзинорм 10000, Панзинорм форте 20000, Креазим 20000, Фестал Нео 10000."],
            ["Для молочных продуктов", "Sunlife Laktase 6000, Scitec Nutrition Lactase, Nature's Way Lactase Enzyme, NOW Dairy Digest Complete, Metagenics EnzyDigest Lactose."],
            ["Критерий выбора", "смотреть на активность липазы, кишечнорастворимую форму, переносимость и задачу, а не только на бренд."]
          ]
        },
        {
          label: "Кишечник",
          title: "Псиллиум, клетчатка, пребиотики",
          text: "Клетчатка полезна только тогда, когда ее вводят постепенно. Псиллиум может помогать со стулом, сытостью и контролем аппетита, но без достаточной воды может ухудшить самочувствие.",
          items: [
            ["Уместно", "низкая клетчатка, запоры, похудение, контроль голода."],
            ["Старт", "малыми дозами, с водой, без резкого скачка клетчатки."],
            ["Осторожно", "вздутие, боль, синдром раздраженного кишечника, хроническая диарея."]
          ]
        },
        {
          label: "Кишечник",
          title: "Пробиотики и ферментированные продукты",
          text: "Пробиотики не являются универсальной добавкой \"для всех\". Их лучше рассматривать под конкретный контекст: после антибиотиков, при изменении рациона или при нестабильном пищеварении.",
          items: [
            ["Уместно", "ограниченный курс, конкретная задача, оценка реакции."],
            ["Осторожно", "иммунодефицит, тяжелые болезни, температура, кровь в стуле."],
            ["Правило", "если продукт ухудшает симптомы - это не \"очищение\", а сигнал остановиться."]
          ]
        },
        {
          label: "Спортпит",
          title: "Протеин, гейнер и переносимость",
          text: "Если протеин дает вздутие, стоит смотреть на тип: концентрат, изолят, гидролизат, казеин или растительный протеин. Гейнер часто плохо переносится из-за большой порции, молока, сахаров или мальтодекстрина.",
          items: [
            ["Уместно", "изолят при плохой переносимости концентрата, меньшие порции, вода вместо молока."],
            ["Осторожно", "гейнеры при похудении, инсулинорезистентности, рефлюксе или сильном вздутии."],
            ["Правило", "спортпит должен облегчать рацион, а не ломать ЖКТ."]
          ]
        },
        {
          label: "Печень / желчь",
          title: "NAC, TUDCA, силимарин, холин",
          text: "Это не \"детокс\" и не разрешение перегружать печень. Поддержка печени имеет смысл только рядом с контролем ALT, AST, GGT, билирубина, липидов, алкоголя, лекарств и фармакологической нагрузки.",
          items: [
            ["Уместно", "образовательно, при контроле анализов и понятной причине нагрузки."],
            ["Осторожно", "желтуха, темная моча, боль справа под ребрами, зуд, высокий билирубин."],
            ["Правило", "добавка не перекрывает токсичное поведение, алкоголь или опасные препараты."]
          ]
        },
        {
          label: "Желчь / жиры",
          title: "Переваривание жиров",
          text: "Тяжесть после жирной еды не всегда решается ферментами. Важно оценить жиры в рационе, желчный пузырь, печеночные маркеры, стул и реакцию на большие приемы.",
          items: [
            ["Уместно", "меньшие порции жира, равномерное распределение по приемам, контроль симптомов."],
            ["Осторожно", "острая боль, тошнота после жирного, светлый стул, темная моча, желтуха."],
            ["Не делать", "не \"гонять желчь\" добавками без понимания причины."]
          ]
        },
        {
          label: "Почки / вода",
          title: "Электролиты, магний, креатин",
          text: "Для почек главное не \"специальный спортпит\", а вода, давление, натрий/калий, анализы и здоровый контекст. Креатин может менять креатинин как маркер, поэтому важно смотреть не одну цифру, а eGFR, симптомы, историю почек и лекарственный контекст.",
          items: [
            ["Уместно", "вода, электролиты при потоотделении, магний по переносимости, контроль давления."],
            ["Осторожно", "хроническая болезнь почек, отеки, высокое давление, плохие креатинин/eGFR."],
            ["Правило", "при болезнях почек добавки только с врачом."]
          ]
        },
        {
          label: "Стоп-сигналы",
          title: "Когда не экспериментировать",
          text: "Если есть красные флаги, добавки не \"поддерживают организм\", а могут затянуть нормальную диагностику.",
          plainItems: [
            "Кровь в стуле, черный стул, постоянная диарея или резкая боль в животе.",
            "Желтуха, темная моча, светлый стул, зуд, боль справа под ребрами.",
            "Отеки, высокое давление, резкое уменьшение мочи, плохие креатинин/eGFR.",
            "Резкая потеря веса, температура, ночная потливость, сильная слабость."
          ]
        }
      ],
      sourcesTitle: "Источники для сверки",
      sources: [
        "NIH ODS: справка о пробиотиках",
        "NCCIH: польза и безопасность пробиотиков",
        "NIH ODS: справка о магнии",
        "National Kidney Foundation: креатинин",
        "Tabletki.ua: ферменты в аптеках Украины",
        "Аптека 9-1-1: ферменты для пищеварения"
      ]
    }
  };

  const supplementCatalogTranslations = {
    en: {
      groupLabel: "Group 06",
      groupTitle: "Dietary supplements and nutraceuticals",
      intro: "Not sports nutrition and not \"jars for mass\": this section covers nutraceuticals, mushroom extracts, adaptogens, and substances with a separate evidence or toxicology logic. Protein, creatine, gainers, BCAA, and similar sports supplements do not belong in this catalog.",
      warningTitle: "Important",
      warningText: "This section is informational only. VitalRise does not recommend taking dietary supplements, mushroom extracts, adaptogens, or psychoactive substances on your own. Each item describes possible effects, evidence, and risks; it is not advice to use them. Dietary supplements do not go through the same pre-approval for safety and effectiveness as medicines, so any decision should be checked against a doctor, lab work, diagnoses, medications, and personal risks.",
      sectionTitles: ["Effects", "Evidence", "Cautions", "Sources for verification"],
      items: [
        {
          badge: "Supplement 01",
          title: "Lion's Mane: Hericium erinaceus",
          intro: "Lion's Mane is an edible mushroom and popular nootropic supplement promoted for memory, concentration, the nervous system, and mood. Its most interesting mechanisms involve hericenones, erinacines, neurotrophic pathways, and inflammation, but human evidence is still much thinner than the marketing.",
          effects: [
            "Possible effects include support for cognitive function, subjective clarity, attention, and mood, but human data are limited.",
            "Preclinical work discusses neurotrophic mechanisms, nerve regeneration, anti-inflammatory, and antioxidant effects.",
            "Possible adverse effects include allergic reactions, rash, itching, digestive discomfort, and individual worsening of well-being or anxiety."
          ],
          evidence: [
            "There are small clinical studies and preclinical data on cognition, mood, and the nervous system, but large independent RCTs are still insufficient.",
            "NCBI LiverTox notes that small clinical trials did not report clear liver injury, but prospective safety data are limited.",
            "In practice this is a cautiously promising candidate, not a guaranteed brain supplement."
          ],
          cautions: [
            "Do not use with mushroom allergy or unclear allergic reactions.",
            "Use caution with autoimmune conditions, anticoagulants or antiplatelet drugs, psychiatric symptoms, or strong anxiety.",
            "Extract quality matters: fruiting body, mycelium, standardization, contaminants, and certificates can differ substantially."
          ]
        },
        {
          badge: "Supplement 02",
          title: "Ashwagandha: Withania somnifera",
          intro: "Ashwagandha is an adaptogenic plant extract most often discussed for stress, anxiety, sleep, recovery, and male hormonal context. It is not \"natural testosterone\" and should not replace treatment for anxiety, insomnia, or endocrine problems.",
          effects: [
            "Possible effects include reduced subjective stress, anxiety, tension, and improved sleep markers in some studies.",
            "In sport it is studied for recovery, strength, fatigue, and hormonal markers, but these effects are not guaranteed and depend on the extract and the person.",
            "Possible adverse effects include sleepiness, nausea, diarrhea, headache, thyroid profile changes, and rare reports of liver injury."
          ],
          evidence: [
            "NCCIH and NIH ODS describe many clinical studies, but data quality and duration vary.",
            "The most practical areas are stress, anxiety, and sleep; evidence for sport performance and other claims is weaker or mixed.",
            "Long-term safety for many months or years is not well established."
          ],
          cautions: [
            "Not suitable during pregnancy, and should be medically supervised with thyroid disease, autoimmune conditions, liver disease, or sedative medication use.",
            "Gastrointestinal side effects and rare liver injury reports exist.",
            "Do not mix chaotically with other calming supplements, alcohol, or sleep medications."
          ]
        },
        {
          badge: "Supplement 03",
          title: "Rhodiola rosea",
          intro: "Rhodiola is an adaptogen promoted for fatigue, stress tolerance, concentration, and work capacity. It is not a caffeine-level stimulant and not a treatment for depression or anxiety disorders.",
          effects: [
            "Possible effects include reduced fatigue, support for concentration, stress tolerance, and work capacity in some people.",
            "It can have a mildly stimulating profile, so response depends on the nervous system, sleep, caffeine, and anxiety level.",
            "Possible adverse effects include insomnia, palpitations, irritability, anxiety, headache, or digestive discomfort."
          ],
          evidence: [
            "Clinical work exists for fatigue and stress, but the evidence is heterogeneous: different extracts, different standardization, and small samples.",
            "Informational position: effects are possible, but not proven as universal; it is not treatment for burnout, depression, anxiety, or sleep disorders.",
            "Product quality is critical because different species or weakly standardized extracts may be sold under the Rhodiola name."
          ],
          cautions: [
            "Use caution with anxiety, insomnia, bipolar disorder, stimulants, antidepressants, or CNS-active medications.",
            "If sleep, palpitations, or anxiety worsen, that is not \"adaptation\"; it is a signal to stop and reassess.",
            "Avoid stacking it blindly with caffeine or other stimulants."
          ]
        },
        {
          badge: "Supplement 04",
          title: "Leuzea: Rhaponticum carthamoides / maral root",
          intro: "Leuzea, or Rhaponticum carthamoides, is a plant adaptogen historically used in Siberia and Eastern Europe for fatigue, work capacity, and recovery. Sports marketing often links it with ecdysteroids, especially 20-hydroxyecdysone, but that does not make it a \"natural steroid\" or a guaranteed muscle-growth supplement.",
          effects: [
            "Possible effects include subjective support for work capacity, endurance, recovery, tone, and stress tolerance in some people.",
            "The plant contains ecdysteroids, phenolic compounds, flavonoids, and other components, so effects may differ between root, extract, and standardized products.",
            "Possible adverse effects include insomnia, agitation, palpitations, increased anxiety, digestive discomfort, and individual reactions to the extract or contaminants."
          ],
          evidence: [
            "A Phytochemistry review describes the chemistry and broad pharmacological profile of Rhaponticum carthamoides, but much of the data is preclinical or older.",
            "For sport performance, human evidence is limited and is not comparable to the evidence for creatine, caffeine, or adequate protein.",
            "Informational position: leuzea may be interesting as an adaptogen or phytoecdysteroid source, but it is not medical treatment, an anabolic drug, or a required part of sports nutrition."
          ],
          cautions: [
            "VitalRise does not recommend taking leuzea on your own; this is reference information about possible effects, evidence, and risks.",
            "Use caution with high blood pressure, arrhythmias, anxiety, insomnia, bipolar disorder, pregnancy, breastfeeding, liver or kidney disease, stimulants, antidepressants, and cardiovascular medications.",
            "For athletes, product quality matters: extract standardization, real ecdysteroid content, contaminants, and anti-doping risk can differ between brands."
          ]
        },
        {
          badge: "Supplement 05",
          title: "Berberine: metabolic nutraceutical",
          intro: "Berberine is a plant-derived alkaloid most often discussed for glucose, insulin resistance, lipids, and metabolic health. It is not \"natural Ozempic\" and not a replacement for medical care in diabetes.",
          effects: [
            "Possible effects include changes in glucose, HbA1c, insulin resistance, lipid markers, and metabolic profile in some studies.",
            "It may affect the gut, biliary and liver context, drug transport, and enzyme systems, so it has more interactions than many \"mild\" supplements.",
            "Possible adverse effects include nausea, constipation or diarrhea, abdominal pain, and hypoglycemia risk when combined with glucose-lowering drugs."
          ],
          evidence: [
            "NCCIH describes some evidence for benefit in diabetes as an add-on therapy, but studies have limitations and do not give a universal conclusion.",
            "Systematic reviews exist for glucose, lipids, and metabolic markers, but formulations, doses, and populations differ.",
            "Practically, it is one of the more researched nutraceuticals, but with important medication interactions."
          ],
          cautions: [
            "Use caution with glucose-lowering drugs, insulin, low glucose, liver or kidney disease, pregnancy, and breastfeeding.",
            "It can cause digestive side effects and interact with medications through transport proteins and enzyme systems.",
            "With diabetes or prediabetes, decisions should be checked with a doctor and labs, not only appetite or weight changes."
          ]
        },
        {
          badge: "Supplement 06",
          title: "Curcumin / turmeric: anti-inflammatory marketing and real caution",
          intro: "Curcumin is a polyphenol from turmeric often sold for joints, inflammation, liver, lipids, and antioxidant effects. The issue is not only evidence, but also bioavailability, extract form, piperine, and medication interactions.",
          effects: [
            "Possible effects include changes in osteoarthritis symptoms, inflammation markers, lipids, or liver/metabolic markers in some studies.",
            "High-bioavailability forms may act more strongly, but that is also why they may create more drug interactions.",
            "Possible adverse effects include heartburn, nausea, diarrhea, biliary symptoms, and higher interaction risk with anticoagulants or antiplatelet drugs."
          ],
          evidence: [
            "NCCIH notes that turmeric and curcumin have been studied for NAFLD, osteoarthritis, and lipid disorders, but evidence is insufficient for many other claims.",
            "Informational position: it is not treatment for inflammation, liver disease, joint disease, or toxicity from other drugs.",
            "Piperine-containing forms can raise bioavailability, but may also raise interaction risk."
          ],
          cautions: [
            "Use caution with gallstones, anticoagulants or antiplatelets, liver disease, pregnancy, or many concurrent medications.",
            "Do not use high doses as \"liver protection\" with alcohol, AAS, or toxic medications.",
            "Check the form and dose rather than assuming turmeric spice and concentrated extract are the same."
          ]
        },
        {
          badge: "Supplement 07",
          title: "Magnesium: glycinate, citrate, malate, and other forms",
          intro: "Magnesium is a mineral, not sports nutrition. It is often used for sleep, the nervous system, cramps, dietary deficiency, blood pressure, or digestive context. The key is counting elemental magnesium, not the compound weight on the label.",
          effects: [
            "Physiological effects include participation in neuromuscular transmission, energy metabolism, muscle contraction, glucose regulation, and blood pressure.",
            "With deficiency or low intake, it may affect cramps, tension, sleep, constipation, or general load tolerance.",
            "Possible adverse effects include diarrhea, abdominal cramps, nausea; with impaired kidney function, dangerous hypermagnesemia is possible."
          ],
          evidence: [
            "NIH ODS describes magnesium as a cofactor in more than 300 enzyme systems, including neuromuscular function, glucose, and blood pressure.",
            "The best logic is correction of deficiency or inadequate intake, not \"magic sleep\" for everyone.",
            "Form matters for tolerability: citrate more often affects the gut, while glycinate is usually gentler for digestion."
          ],
          cautions: [
            "Use caution with chronic kidney disease, low blood pressure, diarrhea, diuretics, or many concurrent medications.",
            "Magnesium can reduce absorption of some medications, so intervals with medicines matter.",
            "Do not judge the dose by the total compound weight; check elemental magnesium."
          ]
        },
        {
          badge: "Supplement 08",
          title: "Melatonin: sleep, circadian rhythm, and safety limits",
          intro: "Melatonin is a hormonal darkness signal often sold as a \"natural sleeping pill.\" It is better viewed as a tool for circadian rhythm, jet lag, or schedule shift, not a universal treatment for chronic insomnia.",
          effects: [
            "Possible effects include circadian rhythm shifting, shorter sleep-onset time in some contexts, and help with jet lag or shift work.",
            "It may cause sleepiness, vivid dreams, headache, morning grogginess, mood changes, or rhythm worsening when timing is wrong.",
            "The effect depends on evening light, routine, timing, dose, age, medications, and the cause of insomnia."
          ],
          evidence: [
            "NCCIH notes that melatonin may be useful for sleep problems related to shift work or jet lag.",
            "For chronic insomnia, leading guidelines do not give a strong recommendation because efficacy and long-term safety evidence is insufficient.",
            "Timing, evening light, sleep schedule, and the cause of insomnia are key."
          ],
          cautions: [
            "Use caution in children, adolescents, pregnancy, epilepsy, autoimmune conditions, depression, and with sedatives or anticoagulants.",
            "Higher doses are not always better: excess may worsen daytime sleepiness and disrupt rhythm.",
            "It should not be used to mask a broken schedule, sleep apnea, medication side effects, or severe anxiety."
          ]
        },
        {
          badge: "Supplement 09",
          title: "Valerian: sleep and calming without exaggeration",
          intro: "Valerian is a plant product traditionally used for sleep and nervous tension. In the catalog it should be presented calmly: not as a strong sedative drug, but as a supplement with inconsistent evidence.",
          effects: [
            "Possible effects include subjective calming and mild help with falling asleep or tension in some people.",
            "The effect is not consistently proven and may depend heavily on extract, dose, expectations, sleep routine, and parallel substances.",
            "Possible adverse effects include sleepiness, headache, dizziness, digestive discomfort, and slowed reaction when combined with sedative substances."
          ],
          evidence: [
            "NCCIH describes evidence for valerian in sleep problems as inconsistent.",
            "Long-term safety data are limited, so it should not become a daily \"insurance policy\" against a poor routine.",
            "Informational position: valerian does not replace diagnosis of insomnia, anxiety, sleep apnea, or medication side effects."
          ],
          cautions: [
            "Do not combine without a doctor with alcohol, sedatives, sleeping pills, or other calming supplements.",
            "Use caution with pregnancy, breastfeeding, liver disease, driving, or work that requires fast reaction.",
            "If daytime sleepiness appears, the dose or combination may be inappropriate."
          ]
        },
        {
          badge: "Supplement 10",
          title: "Caffeine: strength work, the CNS, and the boundary of stimulation",
          intro: "In strength training, caffeine is not just \"energy before the gym.\" For many athletes it works like a nervous-system switch: it raises readiness for heavy sets, reduces perceived fatigue, and helps enter a focused, aggressive training state. That is exactly why it should be treated as a tool, not as a required condition for every normal workout.",
          effects: [
            "Possible effects include higher subjective readiness for heavy sets, better focus, lower perceived fatigue, and support for strength, power, movement velocity, and muscular endurance.",
            "The key mechanism is adenosine receptor blockade: the fatigue \"brake\" feels weaker and the CNS can enter a mobilized state more easily.",
            "Possible adverse effects include anxiety, tremor, palpitations, higher blood pressure, reflux, nausea, irritability, worse sleep, and a performance drop when high-dose use becomes habitual."
          ],
          evidence: [
            "The ISSN position stand describes caffeine as ergogenic for muscular endurance, strength, movement velocity, sprinting, jumping, and other performance outcomes; the common effective research range is about 3-6 mg/kg.",
            "Meta-analyses in resistance exercise show small but real improvements in strength and power; the effect is individual and depends on sleep, tolerance, timing, genetics, anxiety, and total stress.",
            "If training suddenly does not \"switch on\" without caffeine, that may reflect not only caffeine's benefit, but also poor sleep, accumulated fatigue, low energy intake, or dependence on a stimulant ritual."
          ],
          cautions: [
            "Do not keep raising the dose just to chase the same hit: tolerance can grow faster than training quality.",
            "Use caution with hypertension, arrhythmias, panic attacks, anxiety, reflux, insomnia, high-stimulant pre-workouts, or medications that affect the heart and CNS.",
            "VitalRise rule: caffeine can be a lever for heavy sessions, but baseline performance should come from sleep, food, programming, recovery, and nervous-system freshness."
          ],
          drinksTitle: "How much caffeine is in common drinks",
          drinksNote: "These are reference ranges, not lab precision: bean or tea type, grind, grams used, extraction, cup size, and number of espresso shots can change the number substantially.",
          drinksHeaders: ["Drink", "Typical serving", "Approximate caffeine", "Practical counting"],
          drinksRows: [
            ["Espresso", "1 shot, about 30 ml", "~60-65 mg", "A double espresso is usually counted as ~120-130 mg."],
            ["Americano", "1-2 shots + water", "~60-130 mg", "Water does not add caffeine: the number depends on how many shots are used."],
            ["Latte / cappuccino / flat white", "1-2 shots + milk", "~60-130 mg", "Milk changes taste and volume, but does not reduce the caffeine already in the shots."],
            ["Filter coffee / brewed coffee", "~240 ml", "~90-100 mg", "A large cup or strong brew can easily go above 150 mg."],
            ["Green tea", "~240 ml", "~25-45 mg", "More leaf, hotter water, and longer steeping raise caffeine."],
            ["Pu-erh", "~200-250 ml", "~30-70 mg", "Sheng/shu style, number of infusions, and grams used strongly change the content."]
          ],
          formsTitle: "Tablets, capsules, and sports nutrition",
          formsNote: "Tablet form is convenient because it is easier to count: labels often state 100 or 200 mg of caffeine per serving. But that precision also makes it riskier for impulsive use: it is easy to add a tablet on top of coffee, pre-workout, and an energy drink without noticing the total dose.",
          formsItems: [
            ["Pharmacy forms", "caffeine sodium benzoate may be found as tablets, and there are also injectable solutions. Injectable caffeine is not for sport and not for self-directed CNS \"activation\"; it is a medical drug with indications, risks, and supervision."],
            ["Combination pharmacy medicines", "caffeine may appear in some pain-relief or cold/flu products. If coffee or pre-workout is added on top, the total stimulant dose can become higher than it feels."],
            ["Capsules / tablets as supplements or sports nutrition", "most often 100-200 mg per serving. This is not \"lighter\" than coffee; 200 mg is roughly like 3 espresso shots or 2 regular cups of filter coffee."],
            ["Pre-workout", "often contains 150-350 mg of caffeine plus other stimulants: yohimbine, synephrine, guarana, green tea extract, theacrine, or high-dose tyrosine. Count the whole stimulant load, not caffeine alone."],
            ["Energy drinks, gels, shots", "can duplicate caffeine from coffee. Americano plus pre-workout plus an energy drink is no longer preparation; it is a stimulant stack."],
            ["Fat burners", "often hide stimulants behind \"thermogenic\" marketing. Check caffeine anhydrous, guarana, yerba mate, green tea extract, kola nut, and proprietary blend."],
            ["Powdered or concentrated caffeine", "is the riskiest household form because a measuring error can produce a toxic dose. In VitalRise this is a red flag, not a sports hack."]
          ]
        },
        {
          badge: "Risk 11",
          title: "Amanita muscaria: not a recommended supplement",
          intro: "Amanita muscaria should not be presented as a regular dietary supplement. It is a psychoactive and toxicologically problematic mushroom containing muscimol, ibotenic acid, and other components. In this catalog it belongs in an educational risk block, not a recommendation list.",
          effects: [
            "Psychoactive effects can include altered perception, confusion, sedation, euphoria or dysphoria, impaired coordination, sleepiness, nausea, and vomiting.",
            "Toxic effects can include agitation, delirium, CNS depression, seizures, loss of consciousness, unstable behavior, and hospitalization.",
            "Product composition and strength are unpredictable: batches, extracts, gummies, or tinctures may differ in muscimol, ibotenic acid, contaminants, or undeclared substances."
          ],
          evidence: [
            "FDA states that Amanita muscaria, its extracts, and constituents such as muscimol, ibotenic acid, and muscarine are not approved dietary ingredients for conventional foods in the US.",
            "Reported adverse events include CNS depression, sleepiness, seizures, hospitalization, nausea, vomiting, agitation, confusion, and unpredictable reactions.",
            "Data on \"microdosing\" are not sufficient clinical evidence of safety or benefit."
          ],
          cautions: [
            "VitalRise does not recommend Amanita muscaria as a supplement for sleep, anxiety, mood, testosterone, or performance.",
            "It is especially dangerous with psychiatric disorders, epilepsy, cardiovascular issues, pregnancy, breastfeeding, in children or adolescents, and with alcohol, sedatives, psychotropic drugs, or cannabinoids.",
            "Gummies, candies, \"microdosing,\" and marketed extracts may have unstable composition and contaminants."
          ]
        }
      ]
    },
    ru: {
      groupLabel: "Группа 06",
      groupTitle: "БАДы и нутрицевтики",
      intro: "Не спортпит и не \"баночки для массы\": здесь только нутрицевтики, грибные экстракты, адаптогены и вещества с отдельной доказательной или токсикологической логикой. Протеин, креатин, гейнер, BCAA и похожий спортпит в этот каталог не входят.",
      warningTitle: "Важно",
      warningText: "Этот раздел исключительно информационный. VitalRise не рекомендует самостоятельно принимать БАДы, грибные экстракты, адаптогены или психоактивные вещества. Каждый пункт ниже описывает возможные эффекты, доказательность и риски, а не является советом к использованию. БАДы не проходят такое же предварительное подтверждение безопасности и эффективности, как лекарства; решение нужно сверять с врачом, анализами, диагнозами, препаратами и рисками.",
      sectionTitles: ["Эффекты", "Доказательность", "Предостережения", "Источники для сверки"],
      items: [
        {
          badge: "БАД 01",
          title: "Ежовик гребенчатый: Hericium erinaceus / Lion's Mane",
          intro: "Ежовик гребенчатый - съедобный гриб и популярный ноотропный БАД, который продвигают для памяти, концентрации, нервной системы и настроения. Самые интересные механизмы связаны с гериценонами, эринацинами, нейротрофическими путями и воспалением, но человеческая доказательная база пока заметно скромнее маркетинга.",
          effects: [
            "Возможное влияние на когнитивную функцию, субъективную ясность, внимание и настроение, но данные у людей пока ограничены.",
            "Доклинически обсуждают нейротрофические механизмы, нервную регенерацию, противовоспалительные и антиоксидантные эффекты.",
            "Потенциальные нежелательные эффекты: аллергические реакции, сыпь, зуд, дискомфорт ЖКТ, индивидуальное ухудшение самочувствия или тревожности."
          ],
          evidence: [
            "Есть небольшие клинические исследования и доклинические данные по когнитивной функции, настроению и нервной системе, но крупных независимых RCT пока недостаточно.",
            "NCBI LiverTox описывает, что в небольших клинических испытаниях не было сообщений о явном поражении печени, но проспективных исследований безопасности мало.",
            "Практически это кандидат на \"осторожно перспективный\", а не гарантированное средство для мозга."
          ],
          cautions: [
            "Не использовать при аллергии на грибы или непонятных аллергических реакциях.",
            "Осторожность при аутоиммунных состояниях, антикоагулянтах или антиагрегантах, психических симптомах или сильной тревожности.",
            "Качество экстракта важно: плодовое тело, мицелий, стандартизация, примеси и сертификаты могут сильно отличаться."
          ]
        },
        {
          badge: "БАД 02",
          title: "Ашваганда: Withania somnifera",
          intro: "Ашваганда - адаптогенный растительный экстракт, который чаще всего упоминают для стресса, тревожности, сна, восстановления и мужского гормонального контекста. Она не является \"натуральным тестостероном\" и не должна заменять лечение тревоги, бессонницы или эндокринных проблем.",
          effects: [
            "Возможные эффекты: снижение субъективного стресса, тревожности, напряжения и улучшение отдельных показателей сна в части исследований.",
            "В спортивном контексте изучают восстановление, силу, усталость и гормональные маркеры, но эти эффекты не гарантированы и зависят от экстракта и человека.",
            "Потенциальные нежелательные эффекты: сонливость, тошнота, диарея, головная боль, изменения щитовидного профиля, редкие сообщения о поражении печени."
          ],
          evidence: [
            "NCCIH и NIH ODS описывают много клинических исследований, но качество и длительность данных разные.",
            "Наиболее практичные направления: стресс, тревожность и сон; для спортивной продуктивности и других заявлений доказательность слабее или неоднородна.",
            "Долгосрочная безопасность на месяцы или годы установлена недостаточно хорошо."
          ],
          cautions: [
            "Не подходит при беременности, без медицинского контроля при болезнях щитовидной железы, аутоиммунных состояниях, болезнях печени или приеме седативных препаратов.",
            "Есть сообщения о желудочно-кишечных побочных эффектах и редких случаях поражения печени.",
            "Не смешивать хаотично с другими успокаивающими БАДами, алкоголем или препаратами для сна."
          ]
        },
        {
          badge: "БАД 03",
          title: "Родиола розовая: Rhodiola rosea",
          intro: "Родиола - адаптоген, который продвигают для усталости, стрессоустойчивости, концентрации и работоспособности. Это не стимулятор уровня кофеина и не препарат для лечения депрессии или тревожных расстройств.",
          effects: [
            "Возможные эффекты: уменьшение ощущения усталости, поддержка концентрации, стрессоустойчивости и работоспособности у части людей.",
            "Может иметь легкий стимулирующий профиль, поэтому реакция зависит от нервной системы, сна, кофеина и уровня тревожности.",
            "Потенциальные нежелательные эффекты: бессонница, сердцебиение, раздражительность, тревожность, головная боль или дискомфорт ЖКТ."
          ],
          evidence: [
            "Есть клинические работы по усталости и стрессу, но доказательная база неоднородна: разные экстракты, разная стандартизация, небольшие выборки.",
            "Информационная позиция: эффекты возможны, но не доказаны как универсальные; это не лечение истощения, депрессии, тревоги или нарушений сна.",
            "Качество продукта критично: под названием Rhodiola могут продаваться разные виды или слабо стандартизованные экстракты."
          ],
          cautions: [
            "Осторожность при тревожности, бессоннице, биполярном расстройстве, стимуляторах, антидепрессантах или препаратах, влияющих на ЦНС.",
            "Если на фоне приема ухудшается сон, сердцебиение или тревожность, это не \"адаптация\", а сигнал остановиться и оценить состояние.",
            "Не стоит слепо комбинировать с кофеином или другими стимуляторами."
          ]
        },
        {
          badge: "БАД 04",
          title: "Левзея: Rhaponticum carthamoides / маралий корень",
          intro: "Левзея, или Rhaponticum carthamoides, - растительный адаптоген, который исторически использовали в Сибири и Восточной Европе для усталости, работоспособности и восстановления. В спортивном маркетинге ее часто связывают с экдистероидами, особенно 20-гидроксиэкдизоном, но это не делает левзею \"натуральным стероидом\" или гарантированной добавкой для роста мышц.",
          effects: [
            "Возможные эффекты: субъективная поддержка работоспособности, выносливости, восстановления, тонуса и стрессоустойчивости у части людей.",
            "Фитохимически растение содержит экдистероиды, фенольные соединения, флавоноиды и другие компоненты, поэтому эффекты могут отличаться между корнем, экстрактом и стандартизованным продуктом.",
            "Потенциальные нежелательные эффекты: бессонница, возбуждение, сердцебиение, повышение тревожности, дискомфорт ЖКТ, индивидуальная реакция на экстракт или примеси."
          ],
          evidence: [
            "Обзор Phytochemistry описывает химический состав и широкий спектр фармакологических эффектов Rhaponticum carthamoides, но значительная часть данных доклиническая или старая.",
            "Для спортивной продуктивности человеческая доказательная база ограничена и не равна доказательности креатина, кофеина или достаточного белка.",
            "Информационная позиция: левзея может быть интересна как адаптоген или источник фитоэкдистероидов, но это не лечение, не анаболик и не обязательная часть спортпита."
          ],
          cautions: [
            "VitalRise не рекомендует самостоятельно принимать левзею; это справочная информация о возможных эффектах, доказательности и рисках.",
            "Осторожность при высоком давлении, аритмиях, тревожности, бессоннице, биполярном расстройстве, беременности, ГВ, болезнях печени или почек, приеме стимуляторов, антидепрессантов и сердечно-сосудистых препаратов.",
            "Для спортсменов важно качество продукта: стандартизация экстракта, реальное содержание экдистероидов, примеси и антидопинговый риск могут отличаться между брендами."
          ]
        },
        {
          badge: "БАД 05",
          title: "Берберин: метаболический нутрицевтик",
          intro: "Берберин - алкалоид из растительных источников, который чаще всего обсуждают в контексте глюкозы, инсулинорезистентности, липидов и метаболического здоровья. Это не \"натуральный Ozempic\" и не замена врача при диабете.",
          effects: [
            "Возможные эффекты: влияние на глюкозу, HbA1c, инсулинорезистентность, липидные маркеры и метаболический профиль в части исследований.",
            "Может влиять на кишечник, желчный и печеночный контекст, транспорт лекарств и ферментные системы, поэтому имеет больше взаимодействий, чем многие \"мягкие\" БАДы.",
            "Потенциальные нежелательные эффекты: тошнота, запор или диарея, боль в животе, риск гипогликемии при сочетании с сахароснижающими препаратами."
          ],
          evidence: [
            "NCCIH описывает, что есть некоторые данные о пользе при диабете как дополнительной терапии, но исследования имеют ограничения и не дают универсального вывода.",
            "Есть систематические обзоры по глюкозе, липидам и метаболическим маркерам, но качество формул, доз и популяций различается.",
            "Практически это один из более исследованных нутрицевтиков, но с важными взаимодействиями с лекарствами."
          ],
          cautions: [
            "Осторожность при сахароснижающих препаратах, инсулине, низкой глюкозе, болезнях печени или почек, беременности и ГВ.",
            "Может давать ЖКТ-побочные эффекты и взаимодействовать с лекарствами через транспортные белки и ферментные системы.",
            "При диабете или предиабете решение должно сверяться с врачом и анализами, а не только с ощущением аппетита."
          ]
        },
        {
          badge: "БАД 06",
          title: "Куркумин / куркума: противовоспалительный маркетинг и реальная осторожность",
          intro: "Куркумин - полифенольный компонент куркумы, который часто продают для суставов, воспаления, печени, липидов и антиоксидантного эффекта. Проблема не только в доказательности, но и в биодоступности, форме экстракта, пиперине и взаимодействиях с лекарствами.",
          effects: [
            "Возможные эффекты: влияние на симптомы остеоартрита, маркеры воспаления, липиды или печеночные/metabolic маркеры в отдельных исследованиях.",
            "Формы с повышенной биодоступностью могут действовать сильнее, но именно поэтому могут давать больше взаимодействий с лекарствами.",
            "Потенциальные нежелательные эффекты: изжога, тошнота, диарея, желчные симптомы, повышенный риск взаимодействий с антикоагулянтами или антиагрегантами."
          ],
          evidence: [
            "NCCIH отмечает, что куркума и куркумин активно изучались при NAFLD, остеоартрите и липидных нарушениях, но для многих других заявлений доказательств недостаточно.",
            "Информационная позиция: это не лечение воспаления, печени, суставов или последствий токсичных препаратов.",
            "Формы с пиперином могут повышать биодоступность, но также могут повышать риск взаимодействий."
          ],
          cautions: [
            "Осторожность при желчнокаменной болезни, антикоагулянтах или антиагрегантах, болезнях печени, беременности, большом количестве лекарств.",
            "Не использовать высокие дозы как \"защиту печени\" при алкоголе, AAS или токсичных препаратах.",
            "Важно различать специю куркуму и концентрированный экстракт."
          ]
        },
        {
          badge: "БАД 07",
          title: "Магний: глицинат, цитрат, малат и другие формы",
          intro: "Магний - минерал, а не спортпит. Его часто добавляют для сна, нервной системы, судорог, дефицита в рационе, давления или ЖКТ-контекста. Главное - считать элементарный магний, а не вес соединения на этикетке.",
          effects: [
            "Физиологические эффекты: участие в нервно-мышечной передаче, энергетическом обмене, сокращении мышц, регуляции глюкозы и давления.",
            "При дефиците или низком поступлении возможное влияние на судороги, напряжение, сон, запоры или общую переносимость нагрузки.",
            "Потенциальные нежелательные эффекты: диарея, спазмы живота, тошнота; при нарушенной функции почек - риск накопления и опасной гипермагниемии."
          ],
          evidence: [
            "NIH ODS описывает магний как кофактор более чем 300 ферментных систем, включая нервно-мышечную функцию, глюкозу и давление.",
            "Лучшая логика - коррекция дефицита или недостаточного поступления, а не \"магический сон\" для всех.",
            "Форма важна для переносимости: цитрат чаще влияет на кишечник, глицинат обычно мягче для ЖКТ."
          ],
          cautions: [
            "Осторожность при хронической болезни почек, низком давлении, диарее, приеме диуретиков или большого количества лекарств.",
            "Магний может мешать всасыванию некоторых препаратов, поэтому важны интервалы с лекарствами.",
            "Не оценивай дозу по весу соединения; смотри элементарный магний."
          ]
        },
        {
          badge: "БАД 08",
          title: "Мелатонин: сон, циркадный ритм и пределы безопасности",
          intro: "Мелатонин - гормональный сигнал темноты, который часто продают как \"натуральное снотворное\". Правильнее рассматривать его как инструмент для циркадного ритма, джетлага или сдвига графика, а не как универсальное лечение хронической бессонницы.",
          effects: [
            "Возможные эффекты: сдвиг циркадного ритма, сокращение времени засыпания в отдельных контекстах, помощь при джетлаге или сменной работе.",
            "Может вызывать сонливость, яркие сны, головную боль, утреннюю \"ватность\", изменение настроения или ухудшение ритма при неудачном времени приема.",
            "Эффект зависит от света вечером, режима, времени приема, дозы, возраста, лекарств и причины бессонницы."
          ],
          evidence: [
            "NCCIH отмечает, что мелатонин может быть полезен при нарушениях сна из-за сменной работы или джетлага.",
            "Для хронической бессонницы ведущие рекомендации не дают сильной рекомендации из-за недостаточной доказательности эффективности и долгосрочной безопасности.",
            "Ключевыми являются время приема, свет вечером, режим сна и причина бессонницы."
          ],
          cautions: [
            "Осторожность у детей, подростков, беременных, при эпилепсии, аутоиммунных состояниях, депрессии, приеме седативных или антикоагулянтов.",
            "Более высокие дозы не всегда лучше: избыток может усиливать сонливость днем и сбивать ритм.",
            "Не стоит использовать его, чтобы маскировать сломанный режим, апноэ сна, побочные эффекты лекарств или тяжелую тревогу."
          ]
        },
        {
          badge: "БАД 09",
          title: "Валериана: сон и успокоение без преувеличений",
          intro: "Валериана - растительное средство, которое традиционно используют для сна и нервного напряжения. В каталоге ее стоит подавать спокойно: не как сильный седативный препарат, а как БАД с неоднородной доказательностью.",
          effects: [
            "Возможные эффекты: субъективное успокоение, легкое облегчение засыпания или напряжения у части людей.",
            "Эффект не является стабильно доказанным и может сильно зависеть от экстракта, дозы, ожиданий, режима сна и параллельных веществ.",
            "Потенциальные нежелательные эффекты: сонливость, головная боль, головокружение, дискомфорт ЖКТ, угнетение реакции при сочетании с седативными веществами."
          ],
          evidence: [
            "NCCIH описывает доказательства пользы валерианы при проблемах со сном как непоследовательные.",
            "Данные по долгосрочной безопасности ограничены, поэтому это не должно быть ежедневной \"страховкой\" от плохого режима.",
            "Информационная позиция: валериана не заменяет диагностику бессонницы, тревоги, апноэ сна или побочных эффектов лекарств."
          ],
          cautions: [
            "Не сочетать без врача с алкоголем, седативными препаратами, снотворными или другими успокаивающими БАДами.",
            "Осторожность при беременности, ГВ, болезнях печени, управлении авто или работе, где нужна быстрая реакция.",
            "Если появляется дневная сонливость, доза или сочетание могут быть неподходящими."
          ]
        },
        {
          badge: "БАД 10",
          title: "Кофеин: силовая работа, ЦНС и граница стимуляции",
          intro: "В силовой работе кофеин - это не просто \"энергия перед залом\". Для многих спортсменов он работает как переключатель нервной системы: повышает готовность к тяжелому подходу, снижает ощущение усталости и помогает быстрее войти в состояние боевой концентрации. Именно поэтому его стоит воспринимать как инструмент, а не как обязательное условие каждой нормальной тренировки.",
          effects: [
            "Возможные эффекты: более высокая субъективная готовность к тяжелым подходам, лучший фокус, меньшее ощущение усталости, поддержка силы, мощности, скорости движения и мышечной выносливости.",
            "Ключевой механизм - блокировка аденозиновых рецепторов: \"тормоз\" усталости ощущается слабее, а ЦНС легче входит в режим мобилизации.",
            "Потенциальные нежелательные эффекты: тревожность, тремор, сердцебиение, повышение давления, рефлюкс, тошнота, раздражительность, ухудшение сна и откат работоспособности при привычке к высоким дозам."
          ],
          evidence: [
            "Позиция ISSN описывает кофеин как эргогенное средство для мышечной выносливости, силы, скорости движения, спринта, прыжков и других видов продуктивности; типичное эффективное окно в исследованиях - примерно 3-6 мг/кг.",
            "Метаанализы по силовым упражнениям показывают небольшое, но реальное улучшение силы и мощности; эффект индивидуален и зависит от сна, толерантности, времени приема, генетики, тревожности и общего стресса.",
            "Если без кофеина тренировка резко \"не запускается\", это может быть не только польза кофеина, но и маркер недосыпа, накопленной усталости, дефицита калорий или зависимости от стимулятора как ритуала входа в работу."
          ],
          cautions: [
            "Не стоит постоянно поднимать дозу ради того же ощущения \"удара\": толерантность растет быстрее, чем качество тренировочного процесса.",
            "Осторожность нужна при гипертонии, аритмиях, панических атаках, тревожности, рефлюксе, бессоннице, большом количестве стимуляторов в предтрене или лекарствах, влияющих на сердце и ЦНС.",
            "Правило VitalRise: кофеин может быть рычагом для тяжелых сессий, но базовая работоспособность должна держаться на сне, еде, программе, восстановлении и свежести нервной системы."
          ],
          drinksTitle: "Сколько кофеина в напитках",
          drinksNote: "Это ориентиры, а не лабораторная точность: сорт зерна или чая, помол, граммовка, экстракция, размер чашки и количество шотов могут сильно менять цифру.",
          drinksHeaders: ["Напиток", "Типичная порция", "Ориентировочно кофеина", "Как считать практически"],
          drinksRows: [
            ["Эспрессо", "1 шот, примерно 30 мл", "~60-65 мг", "Двойной эспрессо обычно считаем как ~120-130 мг."],
            ["Американо", "1-2 шота + вода", "~60-130 мг", "Вода не добавляет кофеин: цифра зависит от количества шотов."],
            ["Латте / капучино / флет-уайт", "1-2 шота + молоко", "~60-130 мг", "Молоко меняет вкус и объем, но не уменьшает кофеин, который уже есть в шотах."],
            ["Фильтр-кофе / заварной кофе", "~240 мл", "~90-100 мг", "Большая чашка или крепкая заварка легко выходит за 150 мг."],
            ["Зеленый чай", "~240 мл", "~25-45 мг", "Больше листа, горячее вода и дольше настаивание поднимают кофеин."],
            ["Пуэр", "~200-250 мл", "~30-70 мг", "Шен/шу, количество проливов и граммовка сильно меняют содержание."]
          ],
          formsTitle: "Таблетки, капсулы и спортпит",
          formsNote: "Таблетированная форма удобна тем, что ее легче посчитать: на этикетке часто прямо написано 100 или 200 мг кофеина на порцию. Но именно эта точность делает ее опаснее для импульсивного использования: таблетку легко добавить поверх кофе, предтрена и энергетика, не заметив суммарную дозу.",
          formsItems: [
            ["Аптечные формы", "в аптеке можно встретить кофеин-бензоат натрия в таблетках, а также раствор для инъекций. Инъекционная форма - не для спорта и не для самостоятельного \"разгона\" ЦНС; это медицинский препарат под показания, риски и контроль."],
            ["Комбинированные аптечные препараты", "кофеин может быть в составе некоторых обезболивающих или противопростудных средств. Если добавить кофе или предтрен сверху, суммарная стимуляторная доза легко становится выше, чем кажется."],
            ["Капсулы / таблетки как БАД или спортпит", "чаще всего 100-200 мг на порцию. Это не \"легче\", чем кофе; 200 мг - примерно как 3 шота эспрессо или 2 обычные чашки фильтр-кофе."],
            ["Предтрен", "часто содержит 150-350 мг кофеина плюс другие стимуляторы: йохимбин, синефрин, гуарану, экстракт зеленого чая, теакрин или большие дозы тирозина. Здесь нужно считать не только кофеин, а всю стимуляторную сумму."],
            ["Энергетики, гели, шоты", "могут дублировать кофеин из кофе. Если перед залом есть американо + предтрен + энергетик, это уже не подготовка, а стимуляторный коктейль."],
            ["Жиросжигатели", "часто маскируют стимуляторы под маркетинг \"термогеник\". Проверяй caffeine anhydrous, guarana, yerba mate, green tea extract, kola nut и proprietary blend."],
            ["Порошковый или концентрированный кофеин", "самая рискованная форма для бытового использования, потому что ошибка в мерной ложке может дать токсичную дозу. В VitalRise это красный флаг, а не спортивный лайфхак."]
          ]
        },
        {
          badge: "Риск 11",
          title: "Мухомор красный: Amanita muscaria / не рекомендованный БАД",
          intro: "Мухомор красный не стоит подавать как обычный БАД. Это психоактивный и токсикологически проблемный гриб с мусцимолом, иботеновой кислотой и другими компонентами. В каталоге его место - в образовательном блоке рисков, а не в рекомендательном списке.",
          effects: [
            "Психоактивные эффекты могут включать изменение восприятия, спутанность, седативное состояние, эйфорию или дисфорию, нарушение координации, сонливость, тошноту и рвоту.",
            "Токсические эффекты могут включать возбуждение, делирий, угнетение ЦНС, судороги, потерю сознания, нестабильное поведение и госпитализацию.",
            "Состав и сила продуктов непредсказуемы: разные партии, экстракты, \"гумки\" или настойки могут иметь разный уровень мусцимола, иботеновой кислоты, примесей или незаявленных веществ."
          ],
          evidence: [
            "FDA сообщает, что Amanita muscaria, ее экстракты и составляющие вроде muscimol, ibotenic acid и muscarine не являются одобренными пищевыми добавками для обычных продуктов в США.",
            "Описаны побочные события: угнетение ЦНС, сонливость, судороги, госпитализации, тошнота, рвота, возбуждение, спутанность и риск непредсказуемой реакции.",
            "Данные о \"микродозинге\" не являются достаточной клинической доказательностью безопасности или пользы."
          ],
          cautions: [
            "VitalRise не рекомендует мухомор как БАД для сна, тревоги, настроения, тестостерона или продуктивности.",
            "Особенно опасно при психических расстройствах, эпилепсии, сердечно-сосудистых проблемах, беременности, ГВ, у детей или подростков, с алкоголем, седативными, психотропными препаратами или каннабиноидами.",
            "Гумки, конфеты, \"микродозинг\" и маркетинговые экстракты могут иметь нестабильный состав и примеси."
          ]
        }
      ]
    }
  };

  const exactTranslations = {
    "Ефекти": {
      en: "Effects",
      ru: "Эффекты"
    },
    "Доказовість": {
      en: "Evidence",
      ru: "Доказательность"
    },
    "Застереження": {
      en: "Cautions",
      ru: "Предостережения"
    },
    "Час дії": {
      en: "Duration of action",
      ru: "Время действия"
    },
    "Період напіввиведення": {
      en: "Half-life",
      ru: "Период полувыведения"
    },
    "Практичний висновок": {
      en: "Practical takeaway",
      ru: "Практический вывод"
    },
    "Важливо": {
      en: "Important",
      ru: "Важно"
    },
    "Влог VitalRise": {
      en: "VitalRise Vlog",
      ru: "Влог VitalRise"
    },
    "Харчування. Аналізи. Фармакологія. Досвід.": {
      en: "Nutrition. Labs. Pharmacology. Experience.",
      ru: "Питание. Анализы. Фармакология. Опыт."
    },
    "Харчування": {
      en: "Nutrition",
      ru: "Питание"
    },
    "Каталог": {
      en: "Catalog",
      ru: "Каталог"
    },
    "Препарати": {
      en: "Drugs",
      ru: "Препараты"
    },
    "Препарати і БАДи": {
      en: "Drugs and supplements",
      ru: "Препараты и БАДы"
    },
    "БАДи і нутрицевтики": {
      en: "Dietary supplements and nutraceuticals",
      ru: "БАДы и нутрицевтики"
    },
    "Складні дієти починаються не з меню": {
      en: "Complex diets do not start with a menu",
      ru: "Сложные диеты начинаются не с меню"
    },
    "Кето, карнівор, веганська дієта або періодичне голодування можуть виглядати як готова відповідь: прибрав один продукт, залишив інший, поставив вікно харчування - і все має запрацювати. У реальності працює не назва дієти, а система: енергія, білок, клітковина, мікронутрієнти, сон, тренування, травлення і аналізи.": {
      en: "Keto, carnivore, a vegan diet, or intermittent fasting can look like a ready-made answer: remove one food, keep another, set an eating window, and everything should work. In reality, the name of the diet is not what works. The system works: energy, protein, fiber, micronutrients, sleep, training, digestion, and lab work.",
      ru: "Кето, карнивор, веганская диета или интервальное голодание могут выглядеть как готовый ответ: убрать один продукт, оставить другой, поставить окно питания, и все должно заработать. На практике работает не название диеты, а система: энергия, белок, клетчатка, микронутриенты, сон, тренировки, пищеварение и анализы."
    },
    "Початківець часто шукає заборону, а не причину": {
      en: "A beginner often looks for a ban, not the cause",
      ru: "Новичок часто ищет запрет, а не причину"
    },
    "Найлегше сказати собі: вуглеводи винні, м'ясо винне, жир винен, сніданок винен. Але тіло не мислить назвами дієт. Воно відповідає на дефіцит калорій, достатність білка, якість сну, рівень стресу, обсяг руху, стан щитоподібної залози, печінки, нирок, глюкози і те, чи вистачає йому базових нутрієнтів.": {
      en: "The easiest thing is to tell yourself: carbs are guilty, meat is guilty, fat is guilty, breakfast is guilty. But the body does not think in diet names. It responds to calorie balance, enough protein, sleep quality, stress level, movement volume, thyroid status, liver, kidneys, glucose, and whether basic nutrients are covered.",
      ru: "Проще всего сказать себе: виноваты углеводы, виновато мясо, виноват жир, виноват завтрак. Но тело не думает названиями диет. Оно отвечает на дефицит калорий, достаточность белка, качество сна, уровень стресса, объем движения, состояние щитовидной железы, печени, почек, глюкозы и базовых нутриентов."
    },
    "Складна дієта може бути інструментом. Проблема починається тоді, коли людина робить її своєю релігією і перестає дивитися на факти: талію, самопочуття, кров, ліпіди, глюкозу, тиск, травлення, відновлення і тренувальну продуктивність.": {
      en: "A complex diet can be a tool. The problem starts when a person turns it into a religion and stops looking at facts: waist, well-being, blood work, lipids, glucose, blood pressure, digestion, recovery, and training performance.",
      ru: "Сложная диета может быть инструментом. Проблема начинается тогда, когда человек делает ее своей религией и перестает смотреть на факты: талию, самочувствие, кровь, липиды, глюкозу, давление, пищеварение, восстановление и тренировочную продуктивность."
    },
    "Кето": {
      en: "Keto",
      ru: "Кето"
    },
    "Кето може швидко зменшити апетит і воду, спростити дефіцит калорій і дати відчуття контролю. Але це дієта з високою ціною помилки: ліпіди, жовчний міхур, закрепи, дефіцит клітковини, падіння продуктивності в силових тренуваннях і ризик переїдання жиром.": {
      en: "Keto can quickly reduce appetite and water weight, make a calorie deficit easier, and create a feeling of control. But it has a high cost of error: lipids, gallbladder issues, constipation, low fiber, lower strength performance, and the risk of overeating fat.",
      ru: "Кето может быстро снизить аппетит и воду, упростить дефицит калорий и дать ощущение контроля. Но у этой диеты высокая цена ошибки: липиды, желчный пузырь, запоры, дефицит клетчатки, падение продуктивности в силовых тренировках и риск переедания жиром."
    },
    "БЖВ: білки 20-25%, жири 65-75%, вуглеводи 5-10% або приблизно 20-50 г чистих вуглеводів.": {
      en: "Macros: protein 20-25%, fats 65-75%, carbs 5-10%, or about 20-50 g of net carbs.",
      ru: "БЖУ: белки 20-25%, жиры 65-75%, углеводы 5-10% или примерно 20-50 г чистых углеводов."
    },
    "Звідки мінімум вуглеводів: із зелених овочів, листової зелені, броколі, кабачка, огірка, авокадо, невеликої кількості горіхів/насіння і кисломолочних продуктів без цукру за переносимістю. Не з хліба, круп, солодкого, соків, картоплі, макаронів або \"трохи десерту\".": {
      en: "Where the minimum carbs come from: green vegetables, leafy greens, broccoli, zucchini, cucumber, avocado, a small amount of nuts/seeds, and unsweetened fermented dairy if tolerated. Not from bread, grains, sweets, juice, potatoes, pasta, or \"a little dessert\".",
      ru: "Откуда берется минимум углеводов: из зеленых овощей, листовой зелени, брокколи, кабачка, огурца, авокадо, небольшого количества орехов/семян и кисломолочных продуктов без сахара по переносимости. Не из хлеба, круп, сладкого, соков, картофеля, макарон или \"немного десерта\"."
    },
    "Входження в кетоз: зазвичай потребує кількох днів суворого обмеження вуглеводів, але повна адаптація до тренувань і самопочуття триває довше. Практичні маркери - стабільніша енергія, менший голод, відсутність різких провалів, але не просто сухість у роті або мінус вода на вагах.": {
      en: "Entering ketosis: usually requires several days of strict carb restriction, but full adaptation for training and well-being takes longer. Practical markers are steadier energy, less hunger, and fewer crashes, not just dry mouth or water loss on the scale.",
      ru: "Вход в кетоз: обычно требует нескольких дней строгого ограничения углеводов, но полная адаптация для тренировок и самочувствия длится дольше. Практичные маркеры: более стабильная энергия, меньший голод, отсутствие резких провалов, а не просто сухость во рту или минус вода на весах."
    },
    "Адаптація: 2-6 тижнів. Часто падає вода, змінюються електроліти, може бути слабкість, головний біль, закрепи, нижча вибухова сила.": {
      en: "Adaptation: 2-6 weeks. Water often drops, electrolytes change, and weakness, headaches, constipation, or lower explosive power may appear.",
      ru: "Адаптация: 2-6 недель. Часто уходит вода, меняются электролиты, возможны слабость, головная боль, запоры, более низкая взрывная сила."
    },
    "Уважність: діабет на інсуліні/цукрознижувальних, хвороби жовчного міхура, панкреатит, хронічна хвороба нирок, подагра, високий ЛПНЩ, аритмії, вагітність, розлади харчової поведінки.": {
      en: "Use caution with: diabetes on insulin/glucose-lowering drugs, gallbladder disease, pancreatitis, chronic kidney disease, gout, high LDL, arrhythmias, pregnancy, and eating disorders.",
      ru: "Осторожность: диабет на инсулине/сахароснижающих препаратах, болезни желчного пузыря, панкреатит, хроническая болезнь почек, подагра, высокий ЛПНП, аритмии, беременность, расстройства пищевого поведения."
    },
    "Варіанти раціону": {
      en: "Meal options",
      ru: "Варианты рациона"
    },
    "БЖВ:": {
      en: "Macros:",
      ru: "БЖУ:"
    },
    "Звідки мінімум вуглеводів:": {
      en: "Where the minimum carbs come from:",
      ru: "Откуда берется минимум углеводов:"
    },
    "Входження в кетоз:": {
      en: "Entering ketosis:",
      ru: "Вход в кетоз:"
    },
    "Адаптація:": {
      en: "Adaptation:",
      ru: "Адаптация:"
    },
    "Уважність:": {
      en: "Caution:",
      ru: "Осторожность:"
    },
    "Карнівор": {
      en: "Carnivore",
      ru: "Карнивор"
    },
    "Веганська дієта": {
      en: "Vegan diet",
      ru: "Веганская диета"
    },
    "Періодичне голодування": {
      en: "Intermittent fasting",
      ru: "Интервальное голодание"
    },
    "Середземноморська": {
      en: "Mediterranean",
      ru: "Средиземноморская"
    },
    "Спортивна вуглеводна": {
      en: "Sports carb-based diet",
      ru: "Спортивная углеводная"
    },
    "Аналізи перед складною дієтою": {
      en: "Labs before a complex diet",
      ru: "Анализы перед сложной диетой"
    },
    "Анаболічні андрогенні стероїди": {
      en: "Anabolic androgenic steroids",
      ru: "Анаболические андрогенные стероиды"
    },
    "Гормональна підтримка, естрадіол, пролактин і PCT": {
      en: "Hormonal support, estradiol, prolactin, and PCT",
      ru: "Гормональная поддержка, эстрадиол, пролактин и PCT"
    },
    "Метаболічні препарати, вага і глюкоза": {
      en: "Metabolic drugs, weight, and glucose",
      ru: "Метаболические препараты, вес и глюкоза"
    },
    "Вісь гормону росту та IGF-1": {
      en: "Growth hormone axis and IGF-1",
      ru: "Ось гормона роста и IGF-1"
    },
    "Судинні препарати і сексуальна функція": {
      en: "Vascular drugs and sexual function",
      ru: "Сосудистые препараты и сексуальная функция"
    },
    "Форма": {
      en: "Form",
      ru: "Форма"
    },
    "Період дії": {
      en: "Duration of action",
      ru: "Период действия"
    },
    "Пік роботи": {
      en: "Peak activity",
      ru: "Пик действия"
    },
    "Період виведення / спад": {
      en: "Elimination / decline",
      ru: "Период выведения / спад"
    },
    "Властивості профілю": {
      en: "Profile properties",
      ru: "Свойства профиля"
    },
    "Тип": {
      en: "Type",
      ru: "Тип"
    },
    "Клас": {
      en: "Class",
      ru: "Класс"
    },
    "Основний медичний контекст": {
      en: "Main medical context",
      ru: "Основной медицинский контекст"
    },
    "Вага": {
      en: "Weight",
      ru: "Вес"
    },
    "Що контролювати": {
      en: "What to monitor",
      ru: "Что контролировать"
    },
    "Статус": {
      en: "Status",
      ru: "Статус"
    },
    "Механізм": {
      en: "Mechanism",
      ru: "Механизм"
    },
    "Ключова логіка ефірів": {
      en: "Key logic of esters",
      ru: "Ключевая логика эфиров"
    },
    "Ключова логіка речовини": {
      en: "Key logic of the substance",
      ru: "Ключевая логика вещества"
    },
    "Анаболічний і андрогенний індекс": {
      en: "Anabolic and androgenic index",
      ru: "Анаболический и андрогенный индекс"
    },
    "Анаболічний": {
      en: "Anabolic",
      ru: "Анаболический"
    },
    "Андрогенний": {
      en: "Androgenic",
      ru: "Андрогенный"
    },
    "Властивості тестостерону": {
      en: "Testosterone properties",
      ru: "Свойства тестостерона"
    },
    "Властивості дростанолону": {
      en: "Drostanolone properties",
      ru: "Свойства дростанолона"
    },
    "Властивості метенолону": {
      en: "Methenolone properties",
      ru: "Свойства метенолона"
    },
    "Властивості та ризики": {
      en: "Properties and risks",
      ru: "Свойства и риски"
    },
    "Мета прийому в медицині": {
      en: "Medical purpose",
      ru: "Цель применения в медицине"
    },
    "Мета прийому в спортивному середовищі": {
      en: "Purpose in a sports setting",
      ru: "Цель применения в спортивной среде"
    },
    "Для чого препарат існує в медицині": {
      en: "Why the drug exists in medicine",
      ru: "Для чего препарат существует в медицине"
    },
    "Для чого препарат існував у медицині": {
      en: "Why the drug existed in medicine",
      ru: "Для чего препарат существовал в медицине"
    },
    "Які аналізи контролювати": {
      en: "Which labs to monitor",
      ru: "Какие анализы контролировать"
    },
    "З якими симптомами до лікаря": {
      en: "Symptoms that require a doctor",
      ru: "С какими симптомами к врачу"
    },
    "Джерела для звірки": {
      en: "Sources for verification",
      ru: "Источники для сверки"
    },
    "Правило VitalRise": {
      en: "VitalRise rule",
      ru: "Правило VitalRise"
    },
    "Важливо": {
      en: "Important",
      ru: "Важно"
    },
    "Головна": {
      en: "Home",
      ru: "Главная"
    },
    "Аналізи": {
      en: "Labs",
      ru: "Анализы"
    },
    "Спортпіт": {
      en: "Supplements",
      ru: "Спортпит"
    },
    "Тарифи": {
      en: "Pricing",
      ru: "Тарифы"
    },
    "Фармакологічна база знань доповнює основну систему VitalRise і не замінює лікаря.": {
      en: "The pharmacology knowledge base supports the main VitalRise system and does not replace a doctor.",
      ru: "Фармакологическая база знаний дополняет основную систему VitalRise и не заменяет врача."
    },
    "VitalRise не призначає фармакологію, не ставить діагнози і не дає схеми самолікування. Матеріали потрібні для освіти, оцінки ризиків і підготовки правильних питань до фахівця.": {
      en: "VitalRise does not prescribe pharmacology, diagnose conditions, or provide self-treatment protocols. The materials are for education, risk assessment, and preparing the right questions for a specialist.",
      ru: "VitalRise не назначает фармакологию, не ставит диагнозы и не дает схемы самолечения. Материалы нужны для образования, оценки рисков и подготовки правильных вопросов к специалисту."
    },
    "Освітній влог про препарати, ризики і контроль здоров'я.": {
      en: "Educational vlog about drugs, risks, and health monitoring.",
      ru: "Образовательный влог о препаратах, рисках и контроле здоровья."
    }
  };

  const titleTranslations = {
    "Тестостерон: суспензія, пропіонат, енантат, ципіонат, деканоат, сустанон": {
      en: "Testosterone: suspension, propionate, enanthate, cypionate, decanoate, Sustanon",
      ru: "Тестостерон: суспензия, пропионат, энантат, ципионат, деканоат, сустанон"
    },
    "Мастерон: дростанолон пропіонат і дростанолон енантат": {
      en: "Masteron: drostanolone propionate and drostanolone enanthate",
      ru: "Мастерон: дростанолон пропионат и дростанолон энантат"
    },
    "Примоболан: метенолон ацетат і метенолон енантат": {
      en: "Primobolan: methenolone acetate and methenolone enanthate",
      ru: "Примоболан: метенолон ацетат и метенолон энантат"
    },
    "Болденон: ундесиленат та інші форми": {
      en: "Boldenone: undecylenate and other forms",
      ru: "Болденон: ундециленат и другие формы"
    },
    "Болденон: boldenone undecylenate / Equipoise": {
      en: "Boldenone: boldenone undecylenate / Equipoise",
      ru: "Болденон: boldenone undecylenate / Equipoise"
    },
    "Вінстрол: станозолол пероральний та ін'єкційний": {
      en: "Winstrol: oral and injectable stanozolol",
      ru: "Винстрол: станозолол пероральный и инъекционный"
    },
    "Вінстрол: станозолол, таблетки і водна ін'єкційна суспензія": {
      en: "Winstrol: stanozolol tablets and aqueous injectable suspension",
      ru: "Винстрол: станозолол, таблетки и водная инъекционная суспензия"
    },
    "Нандролон: деканоат, фенілпропіонат": {
      en: "Nandrolone: decanoate, phenylpropionate",
      ru: "Нандролон: деканоат, фенилпропионат"
    },
    "Нандролон: Deca-Durabolin, нандролон деканоат і фенілпропіонат": {
      en: "Nandrolone: Deca-Durabolin, nandrolone decanoate and phenylpropionate",
      ru: "Нандролон: Deca-Durabolin, нандролон деканоат и фенилпропионат"
    },
    "Тренболон: ацетат, енантат, гексагідробензилкарбонат": {
      en: "Trenbolone: acetate, enanthate, hexahydrobenzylcarbonate",
      ru: "Тренболон: ацетат, энантат, гексагидробензилкарбонат"
    },
    "Тренболон: ацетат, енантат і гексагідробензилкарбонат": {
      en: "Trenbolone: acetate, enanthate and hexahydrobenzylcarbonate",
      ru: "Тренболон: ацетат, энантат и гексагидробензилкарбонат"
    },
    "Оксандролон: пероральний AAS": {
      en: "Oxandrolone: oral AAS",
      ru: "Оксандролон: пероральный AAS"
    },
    "Оксандролон: Anavar / Oxandrin": {
      en: "Oxandrolone: Anavar / Oxandrin",
      ru: "Оксандролон: Anavar / Oxandrin"
    },
    "Оксіметалон: Анаполон / Anadrol": {
      en: "Oxymetholone: Anapolon / Anadrol",
      ru: "Оксиметолон: Анаполон / Anadrol"
    },
    "Турінабол: хлородегідрометилтестостерон": {
      en: "Turinabol: chlorodehydromethyltestosterone",
      ru: "Туринабол: хлордегидрометилтестостерон"
    },
    "Турінабол: 4-хлордегідрометилтестостерон": {
      en: "Turinabol: 4-chlorodehydromethyltestosterone",
      ru: "Туринабол: 4-хлордегидрометилтестостерон"
    },
    "Метандростенолон: метан / Dianabol": {
      en: "Methandrostenolone: Methan / Dianabol",
      ru: "Метандростенолон: метан / Dianabol"
    },
    "Метандростенолон: Метан / Dianabol": {
      en: "Methandrostenolone: Methan / Dianabol",
      ru: "Метандростенолон: Метан / Dianabol"
    },
    "Метилдростенолон: Superdrol / дизайнерський оральний AAS": {
      en: "Methyldrostanolone: Superdrol / designer oral AAS",
      ru: "Метилдростенолон: Superdrol / дизайнерский оральный AAS"
    },
    "Метилдростенолон: Methasterone / Superdrol": {
      en: "Methyldrostanolone: Methasterone / Superdrol",
      ru: "Метилдростенолон: Methasterone / Superdrol"
    },
    "Халотестин: флуоксиместерон": {
      en: "Halotestin: fluoxymesterone",
      ru: "Халотестин: флуоксиместерон"
    },
    "ХГЧ: хоріонічний гонадотропін / гонадотропін": {
      en: "hCG: chorionic gonadotropin / gonadotropin",
      ru: "ХГЧ: хорионический гонадотропин / гонадотропин"
    },
    "Анастрозол: інгібітор ароматази": {
      en: "Anastrozole: aromatase inhibitor",
      ru: "Анастрозол: ингибитор ароматазы"
    },
    "Каберголін: агоніст дофаміну для пролактину": {
      en: "Cabergoline: dopamine agonist for prolactin",
      ru: "Каберголин: агонист дофамина для пролактина"
    },
    "Кломід: кломіфену цитрат / Clomiphene citrate": {
      en: "Clomid: clomiphene citrate",
      ru: "Кломид: кломифена цитрат / Clomiphene citrate"
    },
    "Провірон: местеролон": {
      en: "Proviron: mesterolone",
      ru: "Провирон: местеролон"
    },
    "Тамоксифен: SERM": {
      en: "Tamoxifen: SERM",
      ru: "Тамоксифен: SERM"
    },
    "Тамоксифен: SERM / tamoxifen citrate": {
      en: "Tamoxifen: SERM / tamoxifen citrate",
      ru: "Тамоксифен: SERM / tamoxifen citrate"
    },
    "Кленбутерол: бета-2 агоніст": {
      en: "Clenbuterol: beta-2 agonist",
      ru: "Кленбутерол: бета-2 агонист"
    },
    "Кленбутерол: бета-2-агоніст / симпатоміметик": {
      en: "Clenbuterol: beta-2 agonist / sympathomimetic",
      ru: "Кленбутерол: бета-2-агонист / симпатомиметик"
    },
    "Трийодтиронін T3: ліотиронін": {
      en: "Triiodothyronine T3: liothyronine",
      ru: "Трийодтиронин T3: лиотиронин"
    },
    "Трийодтиронін (T3): ліотиронін натрію": {
      en: "Triiodothyronine (T3): liothyronine sodium",
      ru: "Трийодтиронин (T3): лиотиронин натрия"
    },
    "Ozempic / Wegovy: семаглутид і GLP-1": {
      en: "Ozempic / Wegovy: semaglutide and GLP-1",
      ru: "Ozempic / Wegovy: семаглутид и GLP-1"
    },
    "Ozempic: семаглутид / агоніст рецептора GLP-1": {
      en: "Ozempic: semaglutide / GLP-1 receptor agonist",
      ru: "Ozempic: семаглутид / агонист рецептора GLP-1"
    },
    "Mounjaro / Zepbound: тирзепатид GIP/GLP-1": {
      en: "Mounjaro / Zepbound: tirzepatide GIP/GLP-1",
      ru: "Mounjaro / Zepbound: тирзепатид GIP/GLP-1"
    },
    "Mounjaro: тирзепатид / подвійний агоніст GIP і GLP-1": {
      en: "Mounjaro: tirzepatide / dual GIP and GLP-1 agonist",
      ru: "Mounjaro: тирзепатид / двойной агонист GIP и GLP-1"
    },
    "Retatrutide: потрійний агоніст GIP/GLP-1/глюкагон": {
      en: "Retatrutide: triple GIP/GLP-1/glucagon agonist",
      ru: "Retatrutide: тройной агонист GIP/GLP-1/глюкагон"
    },
    "Retatrutide: потрійний агоніст GIP, GLP-1 і глюкагонових рецепторів": {
      en: "Retatrutide: triple agonist of GIP, GLP-1, and glucagon receptors",
      ru: "Retatrutide: тройной агонист GIP, GLP-1 и глюкагоновых рецепторов"
    },
    "Гормон росту: природний GH, соматропін і синтетичні форми": {
      en: "Growth hormone: natural GH, somatropin, and synthetic forms",
      ru: "Гормон роста: природный GH, соматропин и синтетические формы"
    },
    "Гормон росту: природний GH, соматропін і синтетичні аналоги": {
      en: "Growth hormone: natural GH, somatropin, and synthetic analogs",
      ru: "Гормон роста: природный GH, соматропин и синтетические аналоги"
    },
    "IGF-1: інсуліноподібний фактор росту-1": {
      en: "IGF-1: insulin-like growth factor 1",
      ru: "IGF-1: инсулиноподобный фактор роста-1"
    },
    "IGF-1: інсуліноподібний фактор росту-1 / мекасермін": {
      en: "IGF-1: insulin-like growth factor 1 / mecasermin",
      ru: "IGF-1: инсулиноподобный фактор роста-1 / мекасермин"
    },
    "Тадалафіл: інгібітор ФДЕ-5 / тривалий профіль дії": {
      en: "Tadalafil: PDE-5 inhibitor / long action profile",
      ru: "Тадалафил: ингибитор ФДЕ-5 / длительный профиль действия"
    },
    "Сілденафіл: інгібітор ФДЕ-5 / коротший профіль дії": {
      en: "Sildenafil: PDE-5 inhibitor / shorter action profile",
      ru: "Силденафил: ингибитор ФДЕ-5 / более короткий профиль действия"
    }
  };

  const prefixTranslations = {
    en: [
      [/^Група (\d+)$/, "Group $1"],
      [/^Препарат (\d+)$/, "Drug $1"]
    ],
    ru: [
      [/^Група (\d+)$/, "Группа $1"],
      [/^Препарат (\d+)$/, "Препарат $1"]
    ]
  };

  const fragmentTranslations = {
    en: [
      ["Тестостерон", "Testosterone"],
      ["похідні DHT", "DHT derivatives"],
      ["нандролонова група", "nandrolone group"],
      ["оральні AAS", "oral AAS"],
      ["дизайнерські стероїди", "designer steroids"],
      ["високим ризиком", "high risk"],
      ["печінки", "liver"],
      ["ліпідів", "lipids"],
      ["тиску", "blood pressure"],
      ["гормональної осі", "hormonal axis"],
      ["Препарати, які часто згадують навколо AAS", "Drugs often discussed around AAS"],
      ["інгібітори ароматази", "aromatase inhibitors"],
      ["препарати пролактину", "prolactin drugs"],
      ["окремих гормональних контекстів", "specific hormonal contexts"],
      ["Інкретинові та метаболічні препарати", "Incretin and metabolic drugs"],
      ["контролю ваги", "weight control"],
      ["глюкози", "glucose"],
      ["апетиту", "appetite"],
      ["м'язової маси", "muscle mass"],
      ["Гормон росту", "Growth hormone"],
      ["природні та синтетичні форми", "natural and synthetic forms"],
      ["ризики росту тканин", "tissue growth risks"],
      ["Інгібітори ФДЕ-5", "PDE-5 inhibitors"],
      ["судинну відповідь", "vascular response"],
      ["еректильну функцію", "erectile function"],
      ["серця", "heart"],
      ["гормонів", "hormones"],
      ["метаболізму", "metabolism"]
    ],
    ru: [
      ["похідні DHT", "производные DHT"],
      ["нандролонова група", "нандролоновая группа"],
      ["оральні AAS", "оральные AAS"],
      ["дизайнерські стероїди", "дизайнерские стероиды"],
      ["високим ризиком", "высоким риском"],
      ["печінки", "печени"],
      ["ліпідів", "липидов"],
      ["тиску", "давления"],
      ["гормональної осі", "гормональной оси"],
      ["Препарати, які часто згадують навколо AAS", "Препараты, которые часто упоминают вокруг AAS"],
      ["інгібітори ароматази", "ингибиторы ароматазы"],
      ["препарати пролактину", "препараты пролактина"],
      ["окремих гормональних контекстів", "отдельных гормональных контекстов"],
      ["Інкретинові та метаболічні препарати", "Инкретиновые и метаболические препараты"],
      ["контролю ваги", "контроля веса"],
      ["глюкози", "глюкозы"],
      ["апетиту", "аппетита"],
      ["м'язової маси", "мышечной массы"],
      ["Гормон росту", "Гормон роста"],
      ["природні та синтетичні форми", "природные и синтетические формы"],
      ["ризики росту тканин", "риски роста тканей"],
      ["Інгібітори ФДЕ-5", "Ингибиторы ФДЕ-5"],
      ["судинну відповідь", "сосудистый ответ"],
      ["еректильну функцію", "эректильную функцию"],
      ["серця", "сердца"],
      ["гормонів", "гормонов"],
      ["метаболізму", "метаболизма"]
    ]
  };

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function preserveWhitespace(original, value) {
    const leading = String(original || "").match(/^\s*/)[0];
    const trailing = String(original || "").match(/\s*$/)[0];
    return leading + value + trailing;
  }

  function hasUkrainianLetters(value) {
    return /[іїєґІЇЄҐ]/.test(value);
  }

  function getCurrentLanguage() {
    if (window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function") {
      return window.VitalRiseI18n.getLanguage();
    }

    const language = document.body.dataset.language || document.documentElement.lang || "uk";
    return supportedLanguages.includes(language) ? language : "uk";
  }

  function translateByPrefix(value, language) {
    const rules = prefixTranslations[language] || [];
    for (const rule of rules) {
      if (rule[0].test(value)) return value.replace(rule[0], rule[1]);
    }
    return "";
  }

  function translateByFragments(value, language) {
    if (!hasUkrainianLetters(value)) return "";

    let translated = value;
    (fragmentTranslations[language] || []).forEach(function (pair) {
      translated = translated.split(pair[0]).join(pair[1]);
    });

    return translated !== value ? translated : "";
  }

  function translateText(value, language) {
    if (language === "uk") return value;

    const normalized = normalize(value);
    if (!normalized) return value;

    const exact = exactTranslations[normalized] || titleTranslations[normalized];
    if (exact && exact[language]) return exact[language];

    const prefix = translateByPrefix(normalized, language);
    if (prefix) return prefix;

    const fragment = translateByFragments(normalized, language);
    if (fragment) return fragment;

    return value;
  }

  function shouldSkipTextNode(textNode) {
    const parent = textNode.parentElement;
    if (!parent) return true;
    if (parent.closest("script, style, noscript, svg")) return true;
    if (parent.closest("[data-vlog-static]")) return true;
    if (parent.closest("[data-i18n]")) return true;
    if (parent.closest("[data-lang-switch]")) return true;
    if (parent.closest(".brand-mark")) return true;
    return false;
  }

  function translateRoot(root, language) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node = walker.nextNode();

    while (node) {
      nodes.push(node);
      node = walker.nextNode();
    }

    nodes.forEach(function (textNode) {
      if (shouldSkipTextNode(textNode)) return;
      if (!originalTextNodes.has(textNode)) originalTextNodes.set(textNode, textNode.textContent);

      const original = originalTextNodes.get(textNode);
      const translated = translateText(original, language);
      textNode.textContent = preserveWhitespace(original, translated);
    });
  }

  function setDietBullets(list, bullets) {
    if (!list) return;
    const items = Array.from(list.children).filter(function (item) {
      return item.tagName === "LI";
    });

    bullets.forEach(function (bullet, index) {
      if (!items[index]) return;
      items[index].innerHTML = "<strong>" + bullet[0] + ":</strong> " + bullet[1];
    });
  }

  function setDietDetails(details, itemsText, language, kind) {
    if (!details) return;
    const summary = details.querySelector("summary");
    const list = details.querySelector("ul");
    const items = list ? Array.from(list.children).filter(function (item) {
      return item.tagName === "LI";
    }) : [];

    if (summary) {
      if (kind === "monitor") {
        summary.textContent = language === "en" ? "What to monitor" : language === "ru" ? "Что контролировать" : "Що контролювати";
      } else {
        summary.textContent = language === "en" ? "Meal options" : language === "ru" ? "Варианты рациона" : "Варіанти раціону";
      }
    }

    itemsText.forEach(function (text, index) {
      if (items[index]) items[index].textContent = text;
    });
  }

  function enhanceDietToggles() {
    const sections = document.querySelectorAll(".vlog-diet-grid > section");

    sections.forEach(function (section, index) {
      if (section.dataset.dietToggleReady === "true") return;

      const heading = section.querySelector(":scope > h3");
      if (!heading) return;

      const titleText = heading.textContent.trim();
      const panel = document.createElement("div");
      const button = document.createElement("button");
      const title = document.createElement("span");
      const icon = document.createElement("span");
      const panelId = "vlog-diet-panel-" + (index + 1);

      panel.className = "vlog-diet-body";
      panel.id = panelId;
      panel.hidden = true;

      while (heading.nextSibling) {
        panel.appendChild(heading.nextSibling);
      }

      title.className = "vlog-diet-title";
      title.textContent = titleText;

      icon.className = "vlog-diet-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "+";

      button.type = "button";
      button.className = "vlog-diet-toggle";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", panelId);
      button.appendChild(title);
      button.appendChild(icon);

      heading.classList.add("vlog-diet-heading");
      heading.textContent = "";
      heading.appendChild(button);
      section.appendChild(panel);
      section.dataset.dietToggleReady = "true";
    });
  }

  function bindDietToggles() {
    document.addEventListener("click", function (event) {
      const button = event.target.closest(".vlog-diet-toggle");
      if (!button) return;

      const section = button.closest(".vlog-diet-grid > section");
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const icon = button.querySelector(".vlog-diet-icon");
      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
      if (section) section.classList.toggle("is-open", !isOpen);
      if (icon) icon.textContent = isOpen ? "+" : "-";
    });
  }

  function applyDietTranslations(language) {
    const currentLanguage = supportedLanguages.includes(language) ? language : "uk";
    const sections = document.querySelectorAll(".vlog-diet-grid > section");

    sections.forEach(function (section, index) {
      const source = dietSections[index];
      const content = source && (source[currentLanguage] || source.uk);
      if (!content) return;

      const title = section.querySelector(".vlog-diet-title") || section.querySelector("h3");
      const text = section.querySelector(".vlog-diet-body > p") || section.querySelector(":scope > p");
      const list = section.querySelector(".vlog-diet-body > ul") || section.querySelector(":scope > ul");
      const details = section.querySelectorAll(".vlog-diet-plan");

      if (title) title.textContent = content.title;
      if (text) text.textContent = content.text;
      setDietBullets(list, content.bullets);
      setDietDetails(details[0], content.meals || [], currentLanguage, "meals");
      if (content.monitor) setDietDetails(details[1], content.monitor, currentLanguage, "monitor");
    });
  }

  function translateAttributes(language) {
    const pageMeta = {
      uk: {
        title: "VitalRise - фармакологічна база знань",
        description: "Фармакологічна база знань VitalRise: освітня інформація про препарати, медичний контекст, ризики, аналізи та симптоми для звернення до лікаря."
      },
      en: {
        title: "VitalRise - pharmacology knowledge base",
        description: "VitalRise pharmacology knowledge base: educational information about drugs, medical context, risks, labs, and symptoms that require a doctor."
      },
      ru: {
        title: "VitalRise - фармакологическая база знаний",
        description: "Фармакологическая база знаний VitalRise: образовательная информация о препаратах, медицинском контексте, рисках, анализах и симптомах для обращения к врачу."
      }
    };
    const labels = [
      {
        selector: ".site-nav",
        attr: "aria-label",
        uk: "Головна навігація",
        en: "Main navigation",
        ru: "Главная навигация"
      },
      {
        selector: ".language-switcher",
        attr: "aria-label",
        uk: "Мова сайту",
        en: "Site language",
        ru: "Язык сайта"
      },
      {
        selector: ".brand-mark",
        attr: "aria-label",
        uk: "VitalRise головна",
        en: "VitalRise home",
        ru: "VitalRise главная"
      },
      {
        selector: ".vlog-catalog-panel",
        attr: "aria-label",
        uk: "Каталог препаратів і БАДів",
        en: "Drug and supplement catalog",
        ru: "Каталог препаратов и БАДов"
      },
      {
        selector: ".vlog-topic-list",
        attr: "aria-label",
        uk: "Структура тем про препарати",
        en: "Drug topic structure",
        ru: "Структура тем о препаратах"
      },
      {
        selector: ".footer-links",
        attr: "aria-label",
        uk: "Швидкі посилання",
        en: "Quick links",
        ru: "Быстрые ссылки"
      }
    ];

    labels.forEach(function (item) {
      document.querySelectorAll(item.selector).forEach(function (node) {
        node.setAttribute(item.attr, item[language] || item.uk);
      });
    });

    const meta = pageMeta[language] || pageMeta.uk;
    const descriptionNode = document.querySelector('meta[name="description"]');
    document.title = meta.title;
    if (descriptionNode) descriptionNode.setAttribute("content", meta.description);
  }

  function setListText(list, values) {
    if (!list || !values) return;
    const items = Array.from(list.children).filter(function (item) {
      return item.tagName === "LI";
    });

    values.forEach(function (value, index) {
      if (items[index]) items[index].textContent = value;
    });
  }

  function setRichListText(list, values) {
    if (!list || !values) return;
    const items = Array.from(list.children).filter(function (item) {
      return item.tagName === "LI";
    });

    values.forEach(function (value, index) {
      const item = items[index];
      if (!item) return;

      item.innerHTML = "<strong>" + escapeHtml(value[0]) + ":</strong> " + escapeHtml(value[1]);
    });
  }

  function setCaffeineDrinkGuide(cardBody, item) {
    const guide = cardBody ? cardBody.querySelector("[data-caffeine-drinks]") : null;
    if (!guide || !item || !item.drinksRows) return;

    const title = guide.querySelector("h3");
    const note = guide.querySelector("p");
    const headers = Array.from(guide.querySelectorAll("thead th"));
    const rows = Array.from(guide.querySelectorAll("tbody tr"));

    if (title) title.textContent = item.drinksTitle || title.textContent;
    if (note) note.textContent = item.drinksNote || note.textContent;
    if (item.drinksHeaders) {
      item.drinksHeaders.forEach(function (value, index) {
        if (headers[index]) headers[index].textContent = value;
      });
    }

    item.drinksRows.forEach(function (row, rowIndex) {
      const cells = rows[rowIndex] ? Array.from(rows[rowIndex].children) : [];
      row.forEach(function (value, cellIndex) {
        if (cells[cellIndex]) cells[cellIndex].textContent = value;
      });
    });
  }

  function setCaffeineFormsGuide(cardBody, item) {
    const guide = cardBody ? cardBody.querySelector("[data-caffeine-forms]") : null;
    if (!guide || !item || !item.formsItems) return;

    const title = guide.querySelector("h3");
    const note = guide.querySelector("p");
    const items = Array.from(guide.querySelectorAll("li"));

    if (title) title.textContent = item.formsTitle || title.textContent;
    if (note) note.textContent = item.formsNote || note.textContent;

    item.formsItems.forEach(function (row, index) {
      const listItem = items[index];
      if (!listItem) return;

      const label = listItem.querySelector("strong");
      if (label) {
        label.textContent = row[0] + ":";
        const textNode = Array.from(listItem.childNodes).find(function (node) {
          return node.nodeType === Node.TEXT_NODE;
        });
        if (textNode) textNode.nodeValue = " " + row[1];
      } else {
        listItem.textContent = row[0] + ": " + row[1];
      }
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function rememberText(node) {
    if (node && !node.dataset.vlogOriginalText) node.dataset.vlogOriginalText = node.textContent;
  }

  function rememberHtml(node) {
    if (node && !node.dataset.vlogOriginalHtml) node.dataset.vlogOriginalHtml = node.innerHTML;
  }

  function setTranslatedAttribute(node, name, value) {
    if (!node || !name) return;
    if (name === "aria-label" && !node.dataset.vlogOriginalAriaLabel) {
      node.dataset.vlogOriginalAriaLabel = node.getAttribute(name) || "";
    }
    node.setAttribute(name, value);
  }

  function setTranslatedText(node, value) {
    if (!node) return;
    rememberText(node);
    node.textContent = value;
  }

  function setTranslatedListItem(node, item) {
    if (!node || !item) return;
    rememberHtml(node);
    if (Array.isArray(item)) {
      node.innerHTML = "<strong>" + escapeHtml(item[0]) + ":</strong> " + escapeHtml(item[1]);
      return;
    }
    node.textContent = item;
  }

  function restoreTranslatedSupportGuide(root) {
    if (!root) return;

    root.querySelectorAll("[data-vlog-original-text]").forEach(function (node) {
      node.textContent = node.dataset.vlogOriginalText;
    });

    root.querySelectorAll("[data-vlog-original-html]").forEach(function (node) {
      node.innerHTML = node.dataset.vlogOriginalHtml;
    });

    root.querySelectorAll("[data-vlog-original-aria-label]").forEach(function (node) {
      node.setAttribute("aria-label", node.dataset.vlogOriginalAriaLabel);
    });
  }

  function applyEditorialTranslations(language) {
    const content = editorialTranslations[language] || editorialTranslations.uk;
    const hero = document.querySelector(".vlog-library-hero");
    const editorial = document.querySelector(".vlog-editorial");
    const sections = editorial ? Array.from(editorial.querySelectorAll(".vlog-editorial-section")) : [];
    const section = sections[0] || null;
    const labsSection = sections[1] || null;
    const recoverySection = editorial ? editorial.querySelector(".vlog-post-recovery") : null;
    const paragraphs = section ? Array.from(section.querySelectorAll(":scope > p")) : [];
    const labsParagraphs = labsSection ? Array.from(labsSection.querySelectorAll(":scope > p")) : [];

    setTranslatedText(hero && hero.querySelector(".section-label"), content.heroLabel);
    setTranslatedText(hero && hero.querySelector(".vlog-library-title"), content.heroTitle);
    setTranslatedText(hero && hero.querySelector(".vlog-library-lead"), content.heroLead);
    setTranslatedText(editorial && editorial.querySelector(":scope > .section-label"), content.articleLabel);
    setTranslatedText(editorial && editorial.querySelector("#nutrition-diets-title"), content.articleTitle);
    setTranslatedText(editorial && editorial.querySelector(":scope > .vlog-editorial-lead"), content.articleLead);
    setTranslatedText(section && section.querySelector(":scope > h3"), content.sectionTitle);

    content.paragraphs.forEach(function (text, index) {
      setTranslatedText(paragraphs[index], text);
    });

    setTranslatedText(labsSection && labsSection.querySelector(":scope > h3"), content.labsTitle);
    content.labsParagraphs.forEach(function (text, index) {
      setTranslatedText(labsParagraphs[index], text);
    });

    if (recoverySection && content.recovery) {
      const recoveryLabel = recoverySection.querySelector(":scope > .vlog-post-label");
      const recoveryHeadings = Array.from(recoverySection.querySelectorAll("h3"));
      const recoveryParagraphs = Array.from(recoverySection.querySelectorAll("p"));
      const recoveryLists = Array.from(recoverySection.querySelectorAll(".vlog-recovery-timing-grid ul"));

      setTranslatedText(recoveryLabel, content.recovery.label);
      content.recovery.headings.forEach(function (text, index) {
        setTranslatedText(recoveryHeadings[index], text);
      });
      content.recovery.paragraphs.forEach(function (text, index) {
        setTranslatedText(recoveryParagraphs[index], text);
      });
      setRichListText(recoveryLists[0], content.recovery.immediate);
      setRichListText(recoveryLists[1], content.recovery.hour);
    }
  }

  function applySupportGuideTranslations(language) {
    const guide = document.querySelector(".vlog-support-guide");
    if (!guide) return;

    if (language === "uk") {
      restoreTranslatedSupportGuide(guide);
      return;
    }

    const content = supportGuideTranslations[language];
    if (!content) return;

    const head = guide.querySelector(".vlog-support-head");
    const tabs = guide.querySelector(".vlog-support-tabs");
    const cards = Array.from(guide.querySelectorAll(".vlog-support-card"));
    const sources = guide.querySelector(".vlog-support-sources");

    setTranslatedText(head && head.querySelector(".section-label"), content.label);
    setTranslatedText(head && head.querySelector("h2"), content.title);
    setTranslatedText(head && head.querySelector("p"), content.intro);

    if (tabs) {
      setTranslatedAttribute(tabs, "aria-label", content.tabsLabel);
      Array.from(tabs.querySelectorAll("span")).forEach(function (tab, index) {
        if (content.tabs[index]) setTranslatedText(tab, content.tabs[index]);
      });
    }

    cards.forEach(function (card, index) {
      const item = content.cards[index];
      if (!item) return;

      const summary = card.querySelector(":scope > summary");
      const body = card.querySelector(":scope > div");
      const listItems = body ? Array.from(body.querySelectorAll(":scope > ul > li")) : [];
      const marketNote = body ? body.querySelector(".vlog-market-note") : null;

      setTranslatedText(summary && summary.querySelector("span"), item.label);
      setTranslatedText(summary && summary.querySelector("strong"), item.title);
      setTranslatedText(body && body.querySelector(":scope > p"), item.text);

      (item.plainItems || item.items || []).forEach(function (listItem, itemIndex) {
        setTranslatedListItem(listItems[itemIndex], listItem);
      });

      if (marketNote && item.marketItems) {
        setTranslatedText(marketNote.querySelector("h4"), item.marketTitle);
        Array.from(marketNote.querySelectorAll("li")).forEach(function (marketItem, marketIndex) {
          setTranslatedListItem(marketItem, item.marketItems[marketIndex]);
        });
      }
    });

    if (sources) {
      setTranslatedText(sources.querySelector("h3"), content.sourcesTitle);
      Array.from(sources.querySelectorAll("a")).forEach(function (link, index) {
        if (content.sources[index]) setTranslatedText(link, content.sources[index]);
      });
    }
  }

  function applySupplementCatalogTranslations(language) {
    if (language === "uk") return;

    const content = supplementCatalogTranslations[language];
    if (!content) return;

    const group = Array.from(document.querySelectorAll(".vlog-topic-group")).find(function (item) {
      const label = normalize(item.querySelector(":scope > summary span") ? item.querySelector(":scope > summary span").textContent : "");
      return /06$/.test(label);
    });
    if (!group) return;

    const summaryLabel = group.querySelector(":scope > summary span");
    const summaryTitle = group.querySelector(":scope > summary h3");
    const body = group.querySelector(":scope > .vlog-topic-group-body");
    const intro = body ? body.querySelector(":scope > p") : null;
    const warning = body ? body.querySelector(":scope > .vlog-topic-warning") : null;

    if (summaryLabel) summaryLabel.textContent = content.groupLabel;
    if (summaryTitle) summaryTitle.textContent = content.groupTitle;
    if (intro) intro.textContent = content.intro;
    if (warning) {
      const warningTitle = warning.querySelector("strong");
      const warningText = warning.querySelector("p");
      if (warningTitle) warningTitle.textContent = content.warningTitle;
      if (warningText) warningText.textContent = content.warningText;
    }

    const cards = body ? Array.from(body.querySelectorAll(":scope > .vlog-topic-item")) : [];
    cards.forEach(function (card, index) {
      const item = content.items[index];
      if (!item) return;

      const badge = card.querySelector(":scope > summary span");
      const title = card.querySelector(":scope > summary strong");
      const cardBody = card.querySelector(":scope > .vlog-topic-body");
      const introText = cardBody ? cardBody.querySelector(":scope > p") : null;
      const headings = cardBody ? Array.from(cardBody.querySelectorAll(":scope > h3")) : [];
      const lists = cardBody ? Array.from(cardBody.querySelectorAll(":scope > ul:not(.vlog-source-list)")) : [];
      const sourceHeading = headings[headings.length - 1];

      if (badge) badge.textContent = item.badge;
      if (title) title.textContent = item.title;
      if (introText) introText.textContent = item.intro;

      headings.slice(0, 3).forEach(function (heading, headingIndex) {
        heading.textContent = content.sectionTitles[headingIndex];
      });
      if (sourceHeading) sourceHeading.textContent = content.sectionTitles[3];

      setListText(lists[0], item.effects);
      setListText(lists[1], item.evidence);
      setListText(lists[2], item.cautions);
      setCaffeineDrinkGuide(cardBody, item);
      setCaffeineFormsGuide(cardBody, item);
    });
  }

  function applyVlogTranslations() {
    if (!document.querySelector(PAGE_SELECTOR)) return;

    const language = getCurrentLanguage();
    ROOT_SELECTORS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (root) {
        translateRoot(root, language);
      });
    });
    applyEditorialTranslations(language);
    applyDietTranslations(language);
    applySupportGuideTranslations(language);
    applySupplementCatalogTranslations(language);
    translateAttributes(language);
  }

  function init() {
    enhanceDietToggles();
    applyVlogTranslations();
    bindDietToggles();

    document.addEventListener("click", function (event) {
      if (!event.target.closest("[data-lang-switch]")) return;
      window.setTimeout(applyVlogTranslations, 0);
      window.setTimeout(applyVlogTranslations, 120);
    });

    const observer = new MutationObserver(function (mutations) {
      const languageChanged = mutations.some(function (mutation) {
        return mutation.type === "attributes" && mutation.attributeName === "data-language";
      });
      if (languageChanged) applyVlogTranslations();
    });

    observer.observe(document.body, { attributes: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
