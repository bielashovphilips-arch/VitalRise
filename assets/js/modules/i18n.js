(function () {
  const STORAGE_KEY = "vitalrise:language";
  const DEFAULT_LANGUAGE = "uk";
  const supportedLanguages = ["uk", "en", "ru"];

  const translations = {
    uk: {
      metaTitle: "VitalRise — план харчування, тренувань і аналізів для спортсменів",
      metaDescription: "VitalRise допомагає зібрати план харчування, програму тренувань, спортпіт, прогрес і лабораторні маркери в одному кабінеті спортсмена.",
      "nav.profile": "Профіль",
      "nav.labs": "Аналізи",
      "nav.calculator": "Харчування",
      "nav.nutrition": "Харчування",
      "nav.training": "Тренування",
      "nav.supplements": "Спортпіт",
      "nav.vlog": "Влог",
      "nav.recovery": "Відновлення",
      "nav.progress": "Прогрес",
      "cta.access": "Доступ",
      "cta.startLabs": "Почати з аналізів",
      "cta.controlSystem": "Система контролю",
      "hero.title": "Система побудови тіла атлета",
      "hero.text": "Харчування, тренування, спортпіт, відновлення і лабораторні маркери в одному маршруті до тіла, що виглядає витесаним з граніту.",
      "hero.metricLabs": "Аналізи",
      "hero.metricMacros": "Макроси",
      "hero.metricStrength": "Сила",
      "hero.metricRecovery": "Відновлення",
      "features.label": "Система контролю",
      "features.title": "Спочатку стан здоров’я, потім план навантаження",
      "features.text": "VitalRise починає не з випадкової дієти, а з моніторингу стану: аналізи показують ресурс, дефіцити й ризики, а вже після цього підбираються харчування, тренування, спортпіт і методи відновлення.",
      "features.healthTitle": "Моніторинг здоров’я",
      "features.healthText": "Феритин, вітамін D, глюкоза, ліпіди, печінка, нирки й гормональні маркери допомагають не працювати наосліп і не маскувати дефіцити.",
      "features.nutritionTitle": "Харчування",
      "features.nutritionText": "Калорії, білки, жири, вуглеводи, вода, сіль і конструктор прийомів їжі зі стабільним раціоном та протоколом гідратації.",
      "features.trainingTitle": "Тренування",
      "features.trainingText": "Програма на 4 тижні для залу або дому: базові вправи, допоміжна робота, прогресія ваг і контроль об’єму.",
      "features.supplementsTitle": "Спортпіт",
      "features.supplementsText": "Протеїн, креатин, омега-3, вітамін D, магній та електроліти підбираються під ціль, раціон, аналізи, сон і переносимість.",
      "features.recoveryTitle": "Відновлення",
      "features.recoveryText": "Масаж, сауна, банки, сон і вода подаються як частина плану: коли доречно, коли варто відкласти і що контролювати після.",
      "features.blueprintText": "Фінальна ціль: персональний паспорт тіла з харчуванням, тренуваннями, добавками, відновленням, ризиками й наступним кроком.",
      "brands.title": "Партнерський блок",
      "brands.text": "Тут може бути ваш логотип: спортпіт, лабораторії, харчування, екіпірування або оздоровчі сервіси",
      "brands.slot1": "Ваш логотип",
      "brands.slot2": "Місце партнера",
      "brands.slot3": "Спортпіт",
      "brands.slot4": "Лабораторія",
      "brands.slot5": "Харчування",
      "brands.slot6": "Оздоровлення",
      "brands.slot7": "Екіпірування",
      "brands.slot8": "Ваш бренд",
      "recovery.label": "Відновлення",
      "recovery.title": "Методи відновлення, які доповнюють план, а не замінюють його",
      "recovery.text": "Відновлення потрібне новачку так само, як харчування і тренування: воно впливає на сон, біль, тонус м’язів, готовність до навантаження і ризик перевтоми. VitalRise пояснює, коли метод доречний, а коли краще спочатку знизити навантаження або порадитись із фахівцем.",
      "recovery.massageTitle": "Масаж",
      "recovery.massageText": "Підходить після важких циклів, при відчутті “забитості”, стресі і порушенні розслаблення. Не варто робити глибокий масаж одразу перед силовим тренуванням або при гострому болю.",
      "recovery.massageMeta": "Види: спортивний, міофасціальний, лімфодренажний, релакс. Частота: 1 раз на 1-2 тижні або точково після пікових навантажень.",
      "recovery.saunaTitle": "Сауна",
      "recovery.saunaText": "Починай поступово: перший захід 50-60°C приблизно 5 хв, далі підвищуй температуру і час за самопочуттям. Це дає тілу адаптуватися до тепла, розігріває шкіру, відкриває пори, посилює потовиділення і знижує різкий стрес для серця та тиску.",
      "recovery.saunaMeta": "Орієнтир: 1-3 заходи, без гонитви за максимальною температурою. Вода: 500-1000 мл, при сильному потовиділенні електроліти.",
      "recovery.cupsTitle": "Банки",
      "recovery.cupsText": "Можуть використовуватись для локального тонусу і відчуття розслаблення тканин, але це не лікування травм і не заміна діагностики. Після процедури не плануй рекордні навантаження.",
      "recovery.cupsMeta": "Коли: локальна скутість, відчуття перенапруги. Обережно: синці, варикоз, проблеми зі згортанням крові, подразнення шкіри.",
      "recovery.readinessTitle": "Контроль готовності",
      "recovery.readinessText": "Якщо сон погіршився, пульс у спокої зріс, мотивація впала, а біль тримається кілька днів, відновлення починається не з процедури, а з корекції навантаження, калорій, води і сну.",
      "recovery.readinessMeta": "Правило: метод відновлення має покращувати наступний тиждень тренувань, а не приховувати перевтому."
    },
    en: {
      metaTitle: "VitalRise — nutrition, training, and lab tracking for athletes",
      metaDescription: "VitalRise brings nutrition planning, training programs, supplements, progress, recovery, and lab markers into one athlete dashboard.",
      "nav.profile": "Profile",
      "nav.labs": "Labs",
      "nav.calculator": "Nutrition",
      "nav.nutrition": "Nutrition",
      "nav.training": "Training",
      "nav.supplements": "Supplements",
      "nav.vlog": "Vlog",
      "nav.recovery": "Recovery",
      "nav.progress": "Progress",
      "cta.access": "Access",
      "cta.startLabs": "Start with labs",
      "cta.controlSystem": "Control system",
      "hero.title": "Athlete body-building system",
      "hero.text": "Nutrition, training, supplements, recovery, and lab markers in one route toward a body that looks carved from stone.",
      "hero.metricLabs": "Labs",
      "hero.metricMacros": "Macros",
      "hero.metricStrength": "Strength",
      "hero.metricRecovery": "Recovery",
      "features.label": "Control system",
      "features.title": "Health status first, training load second",
      "features.text": "VitalRise starts not with a random diet, but with health monitoring: labs reveal resources, deficiencies, and risks before nutrition, training, supplements, and recovery methods are selected.",
      "features.healthTitle": "Health monitoring",
      "features.healthText": "Ferritin, vitamin D, glucose, lipids, liver, kidney, and hormone markers help you avoid working blindly or masking deficiencies.",
      "features.nutritionTitle": "Nutrition",
      "features.nutritionText": "Calories, protein, fats, carbs, water, salt, and a meal builder with stable nutrition and hydration context.",
      "features.trainingTitle": "Training",
      "features.trainingText": "A 4-week gym or home program with compound lifts, accessory work, load progression, and volume control.",
      "features.supplementsTitle": "Supplements",
      "features.supplementsText": "Protein, creatine, omega-3, vitamin D, magnesium, and electrolytes are selected by goal, diet, labs, sleep, and tolerance.",
      "features.recoveryTitle": "Recovery",
      "features.recoveryText": "Massage, sauna, cupping, sleep, and hydration become part of the plan: when to use them, when to wait, and what to monitor afterwards.",
      "features.blueprintText": "The final goal: a personal body passport with nutrition, training, supplements, recovery, risks, and the next step.",
      "brands.title": "Partner block",
      "brands.text": "Your logo can be here: supplements, labs, nutrition, equipment, or wellness services",
      "brands.slot1": "Your logo",
      "brands.slot2": "Partner slot",
      "brands.slot3": "Supplements",
      "brands.slot4": "Laboratory",
      "brands.slot5": "Nutrition",
      "brands.slot6": "Wellness",
      "brands.slot7": "Equipment",
      "brands.slot8": "Your brand",
      "recovery.label": "Recovery",
      "recovery.title": "Recovery methods that support the plan instead of replacing it",
      "recovery.text": "Recovery matters for beginners as much as nutrition and training: it affects sleep, pain, muscle tone, readiness for load, and fatigue risk. VitalRise explains when a method fits and when it is better to reduce load first or consult a specialist.",
      "recovery.massageTitle": "Massage",
      "recovery.massageText": "Useful after hard cycles, when muscles feel tight, during stress, or when relaxation is poor. Deep massage is not ideal right before strength training or with acute pain.",
      "recovery.massageMeta": "Types: sports, myofascial, lymphatic drainage, relaxation. Frequency: once every 1-2 weeks or targeted after peak loads.",
      "recovery.saunaTitle": "Sauna",
      "recovery.saunaText": "Start gradually: first round at 50-60°C for about 5 min, then raise temperature and time by how you feel. This lets the body adapt to heat, warms the skin, opens pores, increases sweating, and reduces sudden stress on the heart and blood pressure.",
      "recovery.saunaMeta": "Guide: 1-3 rounds, without chasing maximum temperature. Water: 500-1000 ml; add electrolytes if sweating is heavy.",
      "recovery.cupsTitle": "Cupping",
      "recovery.cupsText": "Can be used for local tone and tissue relaxation, but it is not injury treatment or a replacement for diagnosis. Do not plan record loads right after.",
      "recovery.cupsMeta": "When: local stiffness and tension. Be careful with bruising, varicose veins, clotting issues, and skin irritation.",
      "recovery.readinessTitle": "Readiness control",
      "recovery.readinessText": "If sleep worsens, resting pulse rises, motivation drops, and pain lasts for days, recovery starts with adjusting load, calories, water, and sleep.",
      "recovery.readinessMeta": "Rule: a recovery method should improve the next training week, not hide fatigue."
    },
    ru: {
      metaTitle: "VitalRise — питание, тренировки и анализы для спортсменов",
      metaDescription: "VitalRise собирает план питания, программу тренировок, спортпит, прогресс, восстановление и лабораторные маркеры в одном кабинете спортсмена.",
      "nav.profile": "Профиль",
      "nav.labs": "Анализы",
      "nav.calculator": "Питание",
      "nav.nutrition": "Питание",
      "nav.training": "Тренировки",
      "nav.supplements": "Спортпит",
      "nav.vlog": "Влог",
      "nav.recovery": "Восстановление",
      "nav.progress": "Прогресс",
      "cta.access": "Доступ",
      "cta.startLabs": "Начать с анализов",
      "cta.controlSystem": "Система контроля",
      "hero.title": "Система построения тела атлета",
      "hero.text": "Питание, тренировки, спортпит, восстановление и лабораторные маркеры в одном маршруте к телу, которое выглядит высеченным из камня.",
      "hero.metricLabs": "Анализы",
      "hero.metricMacros": "Макросы",
      "hero.metricStrength": "Сила",
      "hero.metricRecovery": "Восстановление",
      "features.label": "Система контроля",
      "features.title": "Сначала состояние здоровья, потом план нагрузки",
      "features.text": "VitalRise начинает не со случайной диеты, а с мониторинга состояния: анализы показывают ресурс, дефициты и риски, а уже после этого подбираются питание, тренировки, спортпит и методы восстановления.",
      "features.healthTitle": "Мониторинг здоровья",
      "features.healthText": "Ферритин, витамин D, глюкоза, липиды, печень, почки и гормональные маркеры помогают не работать вслепую и не маскировать дефициты.",
      "features.nutritionTitle": "Питание",
      "features.nutritionText": "Калории, белки, жиры, углеводы, вода, соль и конструктор приемов пищи со стабильным рационом и протоколом гидратации.",
      "features.trainingTitle": "Тренировки",
      "features.trainingText": "Программа на 4 недели для зала или дома: базовые упражнения, вспомогательная работа, прогрессия весов и контроль объема.",
      "features.supplementsTitle": "Спортпит",
      "features.supplementsText": "Протеин, креатин, омега-3, витамин D, магний и электролиты подбираются под цель, рацион, анализы, сон и переносимость.",
      "features.recoveryTitle": "Восстановление",
      "features.recoveryText": "Массаж, сауна, банки, сон и вода становятся частью плана: когда уместно, когда стоит отложить и что контролировать после.",
      "features.blueprintText": "Финальная цель: персональный паспорт тела с питанием, тренировками, добавками, восстановлением, рисками и следующим шагом.",
      "brands.title": "Партнерский блок",
      "brands.text": "Здесь может быть ваш логотип: спортпит, лаборатории, питание, экипировка или сервисы оздоровления",
      "brands.slot1": "Ваш логотип",
      "brands.slot2": "Место партнера",
      "brands.slot3": "Спортпит",
      "brands.slot4": "Лаборатория",
      "brands.slot5": "Питание",
      "brands.slot6": "Оздоровление",
      "brands.slot7": "Экипировка",
      "brands.slot8": "Ваш бренд",
      "recovery.label": "Восстановление",
      "recovery.title": "Методы восстановления, которые дополняют план, а не заменяют его",
      "recovery.text": "Восстановление нужно новичку так же, как питание и тренировки: оно влияет на сон, боль, тонус мышц, готовность к нагрузке и риск переутомления. VitalRise объясняет, когда метод уместен, а когда лучше сначала снизить нагрузку или обратиться к специалисту.",
      "recovery.massageTitle": "Массаж",
      "recovery.massageText": "Подходит после тяжелых циклов, при ощущении забитости, стрессе и плохом расслаблении. Глубокий массаж не стоит делать прямо перед силовой тренировкой или при острой боли.",
      "recovery.massageMeta": "Виды: спортивный, миофасциальный, лимфодренажный, релакс. Частота: 1 раз в 1-2 недели или точечно после пиковых нагрузок.",
      "recovery.saunaTitle": "Сауна",
      "recovery.saunaText": "Начинай постепенно: первый заход 50-60°C примерно 5 мин, дальше повышай температуру и время по самочувствию. Это дает телу адаптироваться к теплу, разогревает кожу, открывает поры, усиливает потоотделение и снижает резкий стресс для сердца и давления.",
      "recovery.saunaMeta": "Ориентир: 1-3 захода, без гонки за максимальной температурой. Вода: 500-1000 мл, при сильном потоотделении электролиты.",
      "recovery.cupsTitle": "Банки",
      "recovery.cupsText": "Могут использоваться для локального тонуса и ощущения расслабления тканей, но это не лечение травм и не замена диагностики. После процедуры не планируй рекордные нагрузки.",
      "recovery.cupsMeta": "Когда: локальная скованность, ощущение перенапряжения. Осторожно: синяки, варикоз, проблемы со свертываемостью крови, раздражение кожи.",
      "recovery.readinessTitle": "Контроль готовности",
      "recovery.readinessText": "Если сон ухудшился, пульс в покое вырос, мотивация упала, а боль держится несколько дней, восстановление начинается не с процедуры, а с коррекции нагрузки, калорий, воды и сна.",
      "recovery.readinessMeta": "Правило: метод восстановления должен улучшать следующую неделю тренировок, а не скрывать переутомление."
    }
  };

  const scopedTextTranslations = {
    "#calculator": {
      introTitle: {
        uk: "Обери напрям і отримай протокол дій",
        en: "Choose a direction and get an action protocol",
        ru: "Выбери направление и получи протокол действий"
      },
      introText: {
        uk: "Після базового моніторингу здоров’я калькулятор переводить дані в практику: формує харчування і тренування, а далі підключає спортпіт, відновлення, прогрес і фінальний Blueprint.",
        en: "After basic health monitoring, the calculator turns data into practice: it builds nutrition and training, then connects supplements, recovery, progress, and the final Blueprint.",
        ru: "После базового мониторинга здоровья калькулятор переводит данные в практику: формирует питание и тренировки, а дальше подключает спортпит, восстановление, прогресс и финальный Blueprint."
      },
      body: { uk: "Тіло", en: "Body", ru: "Тело" },
      bodySmall: { uk: "вага, ціль, активність", en: "weight, goal, activity", ru: "вес, цель, активность" },
      ration: { uk: "Раціон", en: "Nutrition", ru: "Рацион" },
      rationSmall: { uk: "калорії, БЖВ, вода", en: "calories, macros, water", ru: "калории, БЖУ, вода" },
      load: { uk: "Навантаження", en: "Load", ru: "Нагрузка" },
      loadSmall: { uk: "план, прогресія, об’єм", en: "plan, progression, volume", ru: "план, прогрессия, объем" },
      control: { uk: "Контроль", en: "Control", ru: "Контроль" },
      controlSmall: { uk: "спортпіт, аналізи, прогрес", en: "supplements, labs, progress", ru: "спортпит, анализы, прогресс" },
      readiness: { uk: "Protocol readiness", en: "Protocol readiness", ru: "Готовность протокола" },
      athleteCenter: { uk: "Командний центр атлета", en: "Athlete command center", ru: "Командный центр атлета" },
      coachNote: { uk: "Заповни ключові дані, щоб активувати персональний протокол.", en: "Fill in the key data to activate your personal protocol.", ru: "Заполни ключевые данные, чтобы активировать персональный протокол." },
      module: { uk: "Модуль", en: "Module", ru: "Модуль" },
      focus: { uk: "Фокус", en: "Focus", ru: "Фокус" },
      context: { uk: "Контекст", en: "Context", ru: "Контекст" },
      nutrition: { uk: "Харчування", en: "Nutrition", ru: "Питание" },
      training: { uk: "Тренування", en: "Training", ru: "Тренировки" },
      recompShort: { uk: "Рекомпозиція", en: "Recomposition", ru: "Рекомпозиция" },
      mealsContext: { uk: "4 прийоми", en: "4 meals", ru: "4 приема" },
      dataCount: { uk: "0/3 дані", en: "0/3 data", ru: "0/3 данных" },
      nutritionCalc: { uk: "Розрахунок харчування", en: "Nutrition calculation", ru: "Расчет питания" },
      nutritionPanelText: { uk: "Розрахуй добову калорійність, макронутрієнти, воду та сіль відповідно до своєї цілі.", en: "Calculate daily calories, macros, water, and salt according to your goal.", ru: "Рассчитай суточные калории, макронутриенты, воду и соль под свою цель." },
      gender: { uk: "Стать", en: "Sex", ru: "Пол" },
      male: { uk: "Чоловік", en: "Male", ru: "Мужчина" },
      female: { uk: "Жінка", en: "Female", ru: "Женщина" },
      age: { uk: "Вік", en: "Age", ru: "Возраст" },
      height: { uk: "Зріст (см)", en: "Height (cm)", ru: "Рост (см)" },
      weight: { uk: "Вага (кг)", en: "Weight (kg)", ru: "Вес (кг)" },
      activity: { uk: "Рівень активності", en: "Activity level", ru: "Уровень активности" },
      lowActivity: { uk: "Низька: до 5 000 кроків/день, без тренувань", en: "Low: up to 5,000 steps/day, no training", ru: "Низкая: до 5 000 шагов/день, без тренировок" },
      moderateActivity: { uk: "Помірна: 5 000-8 000 кроків або 2-3 легкі тренування/тиждень", en: "Moderate: 5,000-8,000 steps or 2-3 light workouts/week", ru: "Умеренная: 5 000-8 000 шагов или 2-3 легкие тренировки/неделю" },
      mediumActivity: { uk: "Середня: 8 000-12 000 кроків і 3-4 тренування/тиждень", en: "Medium: 8,000-12,000 steps and 3-4 workouts/week", ru: "Средняя: 8 000-12 000 шагов и 3-4 тренировки/неделю" },
      highActivity: { uk: "Висока: 12 000+ кроків або 4-5 інтенсивних тренувань/тиждень", en: "High: 12,000+ steps or 4-5 intense workouts/week", ru: "Высокая: 12 000+ шагов или 4-5 интенсивных тренировок/неделю" },
      veryHighActivity: { uk: "Дуже висока: фізична робота і 5+ важких тренувань/тиждень", en: "Very high: physical job and 5+ hard workouts/week", ru: "Очень высокая: физическая работа и 5+ тяжелых тренировок/неделю" },
      activityHint: { uk: "Якщо сумніваєшся між двома рівнями, для схуднення обирай нижчий.", en: "If you are between two levels, choose the lower one for fat loss.", ru: "Если сомневаешься между двумя уровнями, для похудения выбирай нижний." },
      goal: { uk: "Ціль", en: "Goal", ru: "Цель" },
      recomp: { uk: "Рекомпозиція тіла", en: "Body recomposition", ru: "Рекомпозиция тела" },
      weightLoss: { uk: "Зниження ваги", en: "Weight loss", ru: "Снижение веса" },
      maintain: { uk: "Підтримка форми", en: "Maintain shape", ru: "Поддержание формы" },
      massGain: { uk: "Набір маси", en: "Mass gain", ru: "Набор массы" },
      goalHint: {
        uk: "Рекомпозиція: вага може змінюватися повільно, мета — менше жиру і збереження/набір м’язів. Зниження ваги: головна мета — мінус на вагах через дефіцит калорій із контролем сили й самопочуття.",
        en: "Recomposition: scale weight may change slowly; the goal is less fat and preserved/gained muscle. Weight loss: the main goal is a lower scale number through a calorie deficit while monitoring strength and well-being.",
        ru: "Рекомпозиция: вес может меняться медленно, цель — меньше жира и сохранение/набор мышц. Снижение веса: главная цель — минус на весах через дефицит калорий с контролем силы и самочувствия."
      },
      level: { uk: "Рівень підготовки", en: "Training level", ru: "Уровень подготовки" },
      start: { uk: "Починаю", en: "Starting out", ru: "Начинаю" },
      regular: { uk: "Регулярно", en: "Regularly", ru: "Регулярно" },
      athlete: { uk: "Атлет", en: "Athlete", ru: "Атлет" },
      advanced: { uk: "Просунутий", en: "Advanced", ru: "Продвинутый" },
      phase: { uk: "Етап програми", en: "Program phase", ru: "Этап программы" },
      adaptation: { uk: "Перші 4 тижні (адаптація)", en: "First 4 weeks (adaptation)", ru: "Первые 4 недели (адаптация)" },
      progression: { uk: "Після 4 тижнів (продовження)", en: "After 4 weeks (continuation)", ru: "После 4 недель (продолжение)" },
      progressWeek: { uk: "Тиждень прогресії", en: "Progression week", ru: "Неделя прогрессии" },
      week1: { uk: "1 тиждень", en: "Week 1", ru: "1 неделя" },
      week2: { uk: "2 тиждень", en: "Week 2", ru: "2 неделя" },
      week3: { uk: "3 тиждень", en: "Week 3", ru: "3 неделя" },
      week4: { uk: "4 тиждень", en: "Week 4", ru: "4 неделя" },
      dayType: { uk: "Контекст навантаження", en: "Load context", ru: "Контекст нагрузки" },
      trainingDay: { uk: "Перед важкою сесією", en: "Before a heavy session", ru: "Перед тяжелой сессией" },
      restDay: { uk: "Стабільний день", en: "Stable day", ru: "Стабильный день" },
      meals: { uk: "Прийомів їжі", en: "Meals", ru: "Приемов пищи" },
      meals3: { uk: "3 прийоми", en: "3 meals", ru: "3 приема" },
      meals4: { uk: "4 прийоми", en: "4 meals", ru: "4 приема" },
      meals5: { uk: "5 прийомів", en: "5 meals", ru: "5 приемов" },
      dietStyle: { uk: "Стиль харчування", en: "Diet style", ru: "Стиль питания" },
      standard: { uk: "Звичайний", en: "Standard", ru: "Обычный" },
      simple: { uk: "Простий", en: "Simple", ru: "Простой" },
      sport: { uk: "Спортивний", en: "Sport", ru: "Спортивный" },
      calculate: { uk: "Розрахувати", en: "Calculate", ru: "Рассчитать" },
      clear: { uk: "Очистити", en: "Clear", ru: "Очистить" },
      nutritionPlaceholder: { uk: "Заповни поля та натисни «Розрахувати», щоб перейти до формування раціону.", en: "Fill in the fields and press “Calculate” to continue to meal plan creation.", ru: "Заполни поля и нажми «Рассчитать», чтобы перейти к формированию рациона." },
      saveNutritionPdf: { uk: "Зберегти раціон PDF", en: "Save nutrition PDF", ru: "Сохранить рацион PDF" },
      trainingCalc: { uk: "Розрахунок тренувань", en: "Training calculation", ru: "Расчет тренировок" },
      trainingPanelText: { uk: "Обери формат тренувань, ціль та рівень підготовки. Калькулятор сформує структуру плану і покаже орієнтовну витрату калорій.", en: "Choose training format, goal, and level. The calculator will build the plan structure and estimate calorie burn.", ru: "Выбери формат тренировок, цель и уровень подготовки. Калькулятор сформирует структуру плана и покажет ориентировочный расход калорий." },
      atlas: { uk: "Атлас вправ", en: "Exercise atlas", ru: "Атлас упражнений" },
      format: { uk: "Формат", en: "Format", ru: "Формат" },
      gym: { uk: "Зал", en: "Gym", ru: "Зал" },
      home: { uk: "Дім", en: "Home", ru: "Дом" },
      outdoor: { uk: "Вулиця", en: "Outdoor", ru: "Улица" },
      levelShort: { uk: "Рівень", en: "Level", ru: "Уровень" },
      beginner: { uk: "Новачок", en: "Beginner", ru: "Новичок" },
      intermediate: { uk: "Середній", en: "Intermediate", ru: "Средний" },
      strength: { uk: "Сила", en: "Strength", ru: "Сила" },
      mass: { uk: "Маса", en: "Mass", ru: "Масса" },
      endurance: { uk: "Силова витривалість", en: "Strength endurance", ru: "Силовая выносливость" },
      fatloss: { uk: "Жироспалення", en: "Fat loss", ru: "Жиросжигание" },
      programType: { uk: "Тип програми", en: "Program type", ru: "Тип программы" },
      universal: { uk: "Універсальна", en: "Universal", ru: "Универсальная" },
      femaleBalanced: { uk: "Жіноча збалансована", en: "Female balanced", ru: "Женская сбалансированная" },
      femaleGlutes: { uk: "Жіноча: сідниці та ноги", en: "Female: glutes and legs", ru: "Женская: ягодицы и ноги" },
      femaleStrength: { uk: "Жіноча силова", en: "Female strength", ru: "Женская силовая" },
      femaleFatloss: { uk: "Жіноча для зниження жиру", en: "Female fat loss", ru: "Женская для снижения жира" },
      cyclePhase: { uk: "Фаза циклу", en: "Cycle phase", ru: "Фаза цикла" },
      ignore: { uk: "Не враховувати", en: "Ignore", ru: "Не учитывать" },
      menstruation: { uk: "Менструація", en: "Menstruation", ru: "Менструация" },
      follicular: { uk: "Після менструації", en: "After menstruation", ru: "После менструации" },
      ovulation: { uk: "Середина циклу", en: "Mid-cycle", ru: "Середина цикла" },
      luteal: { uk: "Передменструальний період", en: "Premenstrual phase", ru: "Предменструальный период" },
      daysWeek: { uk: "Днів на тиждень", en: "Days per week", ru: "Дней в неделю" },
      days2: { uk: "2 дні", en: "2 days", ru: "2 дня" },
      days3: { uk: "3 дні", en: "3 days", ru: "3 дня" },
      days4: { uk: "4 дні", en: "4 days", ru: "4 дня" },
      bodyWeight: { uk: "Вага тіла (кг)", en: "Body weight (kg)", ru: "Вес тела (кг)" },
      duration: { uk: "Тривалість (хв)", en: "Duration (min)", ru: "Длительность (мин)" },
      pullups: { uk: "Макс. підтягувань", en: "Max pull-ups", ru: "Макс. подтягиваний" },
      dips: { uk: "Макс. брусів", en: "Max dips", ru: "Макс. брусьев" },
      pushups: { uk: "Макс. віджимань", en: "Max push-ups", ru: "Макс. отжиманий" },
      equipment: { uk: "Інвентар", en: "Equipment", ru: "Инвентарь" },
      baseOnly: { uk: "Тільки база", en: "Basics only", ru: "Только база" },
      bands: { uk: "Резина", en: "Bands", ru: "Резина" },
      backpack: { uk: "Рюкзак", en: "Backpack", ru: "Рюкзак" },
      bandsBackpack: { uk: "Резина + рюкзак", en: "Bands + backpack", ru: "Резина + рюкзак" },
      dumbbells: { uk: "Гантелі / інше", en: "Dumbbells / other", ru: "Гантели / другое" },
      limits: { uk: "Обмеження", en: "Limitations", ru: "Ограничения" },
      noPain: { uk: "Немає болю", en: "No pain", ru: "Нет боли" },
      shoulder: { uk: "Плече", en: "Shoulder", ru: "Плечо" },
      elbow: { uk: "Лікоть", en: "Elbow", ru: "Локоть" },
      knee: { uk: "Коліно", en: "Knee", ru: "Колено" },
      lowerBack: { uk: "Поперек", en: "Lower back", ru: "Поясница" },
      fatigue: { uk: "Сильна втома", en: "Severe fatigue", ru: "Сильная усталость" },
      bench: { uk: "1ПМ жим (кг)", en: "Bench 1RM (kg)", ru: "1ПМ жим (кг)" },
      squat: { uk: "1ПМ присід (кг)", en: "Squat 1RM (kg)", ru: "1ПМ присед (кг)" },
      deadlift: { uk: "1ПМ тяга (кг)", en: "Deadlift 1RM (kg)", ru: "1ПМ тяга (кг)" },
      buildPlan: { uk: "Сформувати план", en: "Build plan", ru: "Сформировать план" },
      saveTrainingPdf: { uk: "Зберегти тренування PDF", en: "Save training PDF", ru: "Сохранить тренировки PDF" }
    }
  };

  const placeholderTranslations = {
    example28: { uk: "Наприклад: 28", en: "Example: 28", ru: "Например: 28" },
    example178: { uk: "Наприклад: 178", en: "Example: 178", ru: "Например: 178" },
    example86: { uk: "Наприклад: 86", en: "Example: 86", ru: "Например: 86" },
    example90: { uk: "Наприклад: 90", en: "Example: 90", ru: "Например: 90" },
    example75: { uk: "Наприклад: 75", en: "Example: 75", ru: "Например: 75" },
    example8: { uk: "Наприклад: 8", en: "Example: 8", ru: "Например: 8" },
    example25: { uk: "Наприклад: 25", en: "Example: 25", ru: "Например: 25" },
    example40: { uk: "Наприклад: 40", en: "Example: 40", ru: "Например: 40" },
    optional: { uk: "Необов’язково", en: "Optional", ru: "Необязательно" },
    plain28: { uk: "28", en: "28", ru: "28" },
    plain178: { uk: "178", en: "178", ru: "178" },
    plain86: { uk: "86", en: "86", ru: "86" },
    example42: { uk: "Наприклад: 42", en: "Example: 42", ru: "Например: 42" },
    example420: { uk: "Наприклад: 420", en: "Example: 420", ru: "Например: 420" },
    example51: { uk: "Наприклад: 5.1", en: "Example: 5.1", ru: "Например: 5.1" },
    example54: { uk: "Наприклад: 5.4", en: "Example: 5.4", ru: "Например: 5.4" },
    example21: { uk: "Наприклад: 2.1", en: "Example: 2.1", ru: "Например: 2.1" },
    example29: { uk: "Наприклад: 29", en: "Example: 29", ru: "Например: 29" },
    example96: { uk: "Наприклад: 96", en: "Example: 96", ru: "Например: 96" },
    example14: { uk: "Наприклад: 14", en: "Example: 14", ru: "Например: 14" },
    example520: { uk: "Наприклад: 520", en: "Example: 520", ru: "Например: 520" },
    example32: { uk: "Наприклад: 32", en: "Example: 32", ru: "Например: 32" },
    cycleDependent: { uk: "Залежить від фази циклу", en: "Depends on cycle phase", ru: "Зависит от фазы цикла" },
    exampleMinus04: { uk: "Наприклад: -0.4", en: "Example: -0.4", ru: "Например: -0.4" },
    exampleMinus10: { uk: "Наприклад: -1.0", en: "Example: -1.0", ru: "Например: -1.0" },
    example72: { uk: "Наприклад: 7.2", en: "Example: 7.2", ru: "Например: 7.2" },
    example8500: { uk: "Наприклад: 8500", en: "Example: 8500", ru: "Например: 8500" },
    example85: { uk: "Наприклад: 85", en: "Example: 85", ru: "Например: 85" },
    benchPress: { uk: "Жим лежачи", en: "Bench press", ru: "Жим лежа" }
  };

  const monthTranslations = {
    uk: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
  };

  const dateSelectPlaceholders = {
    day: { uk: "День", en: "Day", ru: "День" },
    month: { uk: "Місяць", en: "Month", ru: "Месяц" },
    year: { uk: "Рік", en: "Year", ru: "Год" }
  };

  const automaticTextTranslations = {
    // Command center and dashboard
    commandCenter: { uk: "Command Center", en: "Command Center", ru: "Командный центр" },
    readiness0: { uk: "Готовність 0%", en: "Readiness 0%", ru: "Готовность 0%" },
    goal: { uk: "Ціль", en: "Goal", ru: "Цель" },
    body: { uk: "Тіло", en: "Body", ru: "Тело" },
    training: { uk: "Тренування", en: "Training", ru: "Тренировки" },
    nutritionShort: { uk: "Раціон", en: "Nutrition", ru: "Рацион" },
    nutritionTrainingNav: { uk: "Харчування / тренування", en: "Nutrition / training", ru: "Питание / тренировки" },
    weightBare: { uk: "Вага", en: "Weight", ru: "Вес" },
    waistBare: { uk: "Талія", en: "Waist", ru: "Талия" },
    mediumNeuter: { uk: "Середнє", en: "Medium", ru: "Среднее" },
    mainFocus: { uk: "Головний фокус", en: "Main focus", ru: "Главный фокус" },
    updateProfile: { uk: "Оновити профіль", en: "Update profile", ru: "Обновить профиль" },
    openCoach: { uk: "Відкрити Coach", en: "Open Coach", ru: "Открыть Coach" },
    profileNotFilled: { uk: "Профіль не заповнений", en: "Profile not filled", ru: "Профиль не заполнен" },
    afterCalculation: { uk: "Після розрахунку", en: "After calculation", ru: "После расчета" },
    createBlueprint: { uk: "Створити Blueprint", en: "Create Blueprint", ru: "Создать Blueprint" },
    labsNoDate: { uk: "Аналізи: дата не вказана", en: "Labs: date not set", ru: "Анализы: дата не указана" },
    medium3Days: { uk: "Середній / 3 дні", en: "Intermediate / 3 days", ru: "Средний / 3 дня" },
    recompShort: { uk: "Рекомпозиція", en: "Recomposition", ru: "Рекомпозиция" },
    nutritionReadyNote: { uk: "Дані тіла готові. VitalRise може зібрати раціон і добові цілі.", en: "Body data is ready. VitalRise can build nutrition and daily targets.", ru: "Данные тела готовы. VitalRise может собрать рацион и дневные цели." },
    nutritionNeedDataNote: { uk: "Заповни вік, зріст і вагу, щоб активувати точний харчовий протокол.", en: "Fill in age, height, and weight to activate the precise nutrition protocol.", ru: "Заполни возраст, рост и вес, чтобы активировать точный протокол питания." },
    trainingReadyNote: { uk: "Базові тренувальні дані готові. Можна формувати силовий протокол.", en: "Base training data is ready. You can build the strength protocol.", ru: "Базовые тренировочные данные готовы. Можно формировать силовой протокол." },
    trainingNeedDataNote: { uk: "Додай вагу тіла і тривалість тренування, щоб оцінити навантаження.", en: "Add body weight and workout duration to estimate the load.", ru: "Добавь вес тела и длительность тренировки, чтобы оценить нагрузку." },
    athleteProfile: { uk: "Athlete Profile", en: "Athlete Profile", ru: "Профиль атлета" },
    profileDashboardTitle: { uk: "Профіль атлета і живий dashboard", en: "Athlete profile and live dashboard", ru: "Профиль атлета и живой dashboard" },
    profileDashboardText: { uk: "Заповни базовий профіль один раз. VitalRise підставить ці дані в калькулятори й покаже короткий стан системи: ціль, тіло, тренування, лабораторний контекст і головний фокус.", en: "Fill in the base profile once. VitalRise will reuse it in calculators and show the system state: goal, body, training, lab context, and main focus.", ru: "Заполни базовый профиль один раз. VitalRise подставит эти данные в калькуляторы и покажет состояние системы: цель, тело, тренировки, лабораторный контекст и главный фокус." },
    applyProfile: { uk: "Застосувати профіль", en: "Apply profile", ru: "Применить профиль" },
    lastLabsDate: { uk: "Дата останніх аналізів", en: "Last lab date", ru: "Дата последних анализов" },
    labsDateMissing: { uk: "Дата не вказана", en: "Date not set", ru: "Дата не указана" },
    labs: { uk: "Аналізи", en: "Labs", ru: "Анализы" },
    focus: { uk: "Фокус", en: "Focus", ru: "Фокус" },
    bodyRecomposition: { uk: "Рекомпозиція тіла", en: "Body recomposition", ru: "Рекомпозиция тела" },
    weightLoss: { uk: "Зниження ваги", en: "Weight loss", ru: "Снижение веса" },
    cutShort: { uk: "Схуднення", en: "Fat loss", ru: "Снижение веса" },
    fatLossGoal: { uk: "Зниження жиру", en: "Fat loss", ru: "Снижение жира" },
    muscleGain: { uk: "Набір м’язів", en: "Muscle gain", ru: "Набор мышц" },
    muscleGainAlt: { uk: "Набір м'язів", en: "Muscle gain", ru: "Набор мышц" },
    gainShort: { uk: "Набір", en: "Gain", ru: "Набор" },
    massGain: { uk: "Набір маси", en: "Mass gain", ru: "Набор массы" },
    strengthPerformance: { uk: "Сила / продуктивність", en: "Strength / performance", ru: "Сила / продуктивность" },
    trainingPerWeek: { uk: "Тренувань/тиждень", en: "Workouts/week", ru: "Тренировок/неделю" },

    // Shared form options
    sex: { uk: "Стать", en: "Sex", ru: "Пол" },
    male: { uk: "Чоловік", en: "Male", ru: "Мужчина" },
    female: { uk: "Жінка", en: "Female", ru: "Женщина" },
    age: { uk: "Вік", en: "Age", ru: "Возраст" },
    height: { uk: "Зріст (см)", en: "Height (cm)", ru: "Рост (см)" },
    weight: { uk: "Вага (кг)", en: "Weight (kg)", ru: "Вес (кг)" },
    level: { uk: "Рівень", en: "Level", ru: "Уровень" },
    startingLevel: { uk: "Початковий", en: "Beginner", ru: "Начальный" },
    beginner: { uk: "Новачок", en: "Beginner", ru: "Новичок" },
    intermediate: { uk: "Середній", en: "Intermediate", ru: "Средний" },
    advanced: { uk: "Просунутий", en: "Advanced", ru: "Продвинутый" },
    noPain: { uk: "Немає болю", en: "No pain", ru: "Нет боли" },
    noLower: { uk: "немає", en: "no", ru: "нет" },
    yesLower: { uk: "є", en: "yes", ru: "есть" },
    shoulder: { uk: "Плече", en: "Shoulder", ru: "Плечо" },
    elbow: { uk: "Лікоть", en: "Elbow", ru: "Локоть" },
    knee: { uk: "Коліно", en: "Knee", ru: "Колено" },
    back: { uk: "Поперек", en: "Lower back", ru: "Поясница" },
    fatigue: { uk: "Сильна втома", en: "Severe fatigue", ru: "Сильная усталость" },
    clear: { uk: "Очистити", en: "Clear", ru: "Очистить" },
    calculate: { uk: "Розрахувати", en: "Calculate", ru: "Рассчитать" },
    savePdf: { uk: "Зберегти PDF", en: "Save PDF", ru: "Сохранить PDF" },
    openReport: { uk: "Відкрити звіт", en: "Open report", ru: "Открыть отчет" },

    // Nutrition and training calculators
    nutritionEngine: { uk: "Nutrition Engine", en: "Nutrition Engine", ru: "Движок питания" },
    trainingEngine: { uk: "Training Engine", en: "Training Engine", ru: "Движок тренировок" },
    exerciseAtlas: { uk: "Атлас вправ", en: "Exercise atlas", ru: "Атлас упражнений" },
    exerciseAtlasTitle: { uk: "Exercise Atlas", en: "Exercise Atlas", ru: "Атлас упражнений" },
    close: { uk: "Закрити", en: "Close", ru: "Закрыть" },
    all: { uk: "Усі", en: "All", ru: "Все" },
    front: { uk: "Перед", en: "Front", ru: "Перед" },
    backView: { uk: "Спина", en: "Back", ru: "Спина" },
    frontLower: { uk: "перед", en: "front", ru: "перед" },
    backLower: { uk: "спина", en: "back", ru: "спина" },
    muscleMap: { uk: "Анатомічна карта м’язів", en: "Anatomical muscle map", ru: "Анатомическая карта мышц" },
    replacements: { uk: "Заміни", en: "Substitutions", ru: "Замены" },
    mainMuscles: { uk: "Основні", en: "Main", ru: "Основные" },
    secondaryMuscles: { uk: "Допоміжні", en: "Secondary", ru: "Вспомогательные" },
    stabilizers: { uk: "Стабілізатори", en: "Stabilizers", ru: "Стабилизаторы" },
    photosConnected: { uk: "Фото підключені", en: "Photos connected", ru: "Фото подключены" },
    photosConnectedText: { uk: "Усі пріоритетні фото з README вже доступні для вправ через атлас або кнопку \"Техніка\".", en: "All priority photos from README are already available through the atlas or the “Technique” button.", ru: "Все приоритетные фото из README уже доступны через атлас или кнопку «Техника»." },
    photosToAdd: { uk: "Фото для додавання", en: "Photos to add", ru: "Фото для добавления" },
    positions: { uk: "позицій", en: "items", ru: "позиций" },
    muscleChest: { uk: "груди", en: "chest", ru: "грудь" },
    muscleTriceps: { uk: "трицепс", en: "triceps", ru: "трицепс" },
    muscleBiceps: { uk: "біцепс", en: "biceps", ru: "бицепс" },
    muscleFrontDelts: { uk: "передня дельта", en: "front delt", ru: "передняя дельта" },
    muscleRearDelts: { uk: "задня дельта", en: "rear delt", ru: "задняя дельта" },
    muscleLats: { uk: "широчайші", en: "lats", ru: "широчайшие" },
    muscleMidBack: { uk: "середина спини", en: "mid back", ru: "середина спины" },
    muscleTraps: { uk: "трапеції", en: "traps", ru: "трапеции" },
    muscleCore: { uk: "корпус", en: "core", ru: "корпус" },
    muscleAbs: { uk: "прес", en: "abs", ru: "пресс" },
    muscleLowerBack: { uk: "поперек", en: "lower back", ru: "поясница" },
    muscleGlutes: { uk: "сідниці", en: "glutes", ru: "ягодицы" },
    muscleQuads: { uk: "квадрицепс", en: "quads", ru: "квадрицепс" },
    muscleHamstrings: { uk: "біцепс стегна", en: "hamstrings", ru: "бицепс бедра" },
    muscleHipFlexors: { uk: "згиначі стегна", en: "hip flexors", ru: "сгибатели бедра" },
    muscleForearms: { uk: "передпліччя", en: "forearms", ru: "предплечья" },
    muscleUpperChest: { uk: "верх грудей", en: "upper chest", ru: "верх груди" },
    exPullups: { uk: "Підтягування", en: "Pull-ups", ru: "Подтягивания" },
    exDips: { uk: "Бруси", en: "Dips", ru: "Брусья" },
    exPushups: { uk: "Віджимання", en: "Push-ups", ru: "Отжимания" },
    exBench: { uk: "Жим лежачи", en: "Bench press", ru: "Жим лежа" },
    exRow: { uk: "Тяга блоку / горизонтальна тяга", en: "Cable row / horizontal row", ru: "Тяга блока / горизонтальная тяга" },
    exBulgarian: { uk: "Болгарські присідання", en: "Bulgarian split squats", ru: "Болгарские приседания" },
    exRdl: { uk: "Румунська тяга", en: "Romanian deadlift", ru: "Румынская тяга" },
    exSquat: { uk: "Присідання", en: "Squat", ru: "Приседания" },
    exDeadlift: { uk: "Станова тяга", en: "Deadlift", ru: "Становая тяга" },
    exPike: { uk: "Pike-віджимання", en: "Pike push-up", ru: "Pike-отжимания" },
    exTricepsLowBar: { uk: "Розгинання на трицепс від низької перекладини", en: "Low-bar bodyweight triceps extension", ru: "Разгибание на трицепс от низкой перекладины" },
    exHangingLegRaise: { uk: "Підйом ніг / прес у висі", en: "Hanging leg raise / abs", ru: "Подъем ног / пресс в висе" },
    exLatPulldown: { uk: "Тяга верхнього блоку", en: "Lat pulldown", ru: "Тяга верхнего блока" },
    exLatPulldownClose: { uk: "Тяга верхнього блоку вузьким хватом", en: "Close-grip lat pulldown", ru: "Тяга верхнего блока узким хватом" },
    exCableRow: { uk: "Тяга горизонтального блоку", en: "Seated cable row", ru: "Тяга горизонтального блока" },
    exLowerCableRow: { uk: "Тяга нижнього блоку", en: "Low cable row", ru: "Тяга нижнего блока" },
    exTBar: { uk: "Тяга Т-грифа", en: "T-bar row", ru: "Тяга Т-грифа" },
    exBentRow: { uk: "Тяга до поясу", en: "Bent-over row", ru: "Тяга к поясу" },
    exBandRow: { uk: "Тяга резини до поясу", en: "Band row to waist", ru: "Тяга резины к поясу" },
    exBackpackRow: { uk: "Тяга рюкзака / гантелі в нахилі", en: "Backpack / dumbbell bent-over row", ru: "Тяга рюкзака / гантели в наклоне" },
    exDumbbellBench: { uk: "Жим гантелей лежачи", en: "Dumbbell bench press", ru: "Жим гантелей лежа" },
    exInclineDb: { uk: "Жим гантелей під кутом", en: "Incline dumbbell press", ru: "Жим гантелей под углом" },
    exCloseGripBench: { uk: "Жим лежачи вузьким хватом", en: "Close-grip bench press", ru: "Жим лежа узким хватом" },
    exHammerIncline: { uk: "Жим в хамері під кутом", en: "Incline hammer press", ru: "Жим в хаммере под углом" },
    exMachineShoulder: { uk: "Жим сидячи в тренажері", en: "Seated machine press", ru: "Жим сидя в тренажере" },
    exLegPress: { uk: "Жим ногами", en: "Leg press", ru: "Жим ногами" },
    exBandOverhead: { uk: "Жим резини над головою", en: "Band overhead press", ru: "Жим резины над головой" },
    exDbShoulder: { uk: "Плечовий жим гантелей", en: "Dumbbell shoulder press", ru: "Плечевой жим гантелей" },
    exLateralRaise: { uk: "Махи через сторони", en: "Lateral raises", ru: "Махи через стороны" },
    exDbLateralRaise: { uk: "Махи гантелями в сторони", en: "Dumbbell lateral raises", ru: "Махи гантелями в стороны" },
    exSideRaises: { uk: "Підйоми через сторони", en: "Lateral raises", ru: "Подъемы через стороны" },
    exUprightRow: { uk: "Тяга до підборіддя", en: "Upright row", ru: "Тяга к подбородку" },
    exDbCurl: { uk: "Біцепс стоячи з гантелями", en: "Standing dumbbell curl", ru: "Бицепс стоя с гантелями" },
    exEzCurl: { uk: "Згинання рук з EZ-штангою", en: "EZ-bar curl", ru: "Сгибание рук с EZ-штангой" },
    exBandCurl: { uk: "Згинання рук з резиною", en: "Band curl", ru: "Сгибание рук с резиной" },
    exHammerCurl: { uk: "Підйом на біцепс молот", en: "Hammer curl", ru: "Подъем на бицепс молот" },
    exTricepsPushdown: { uk: "Розгинання в кросовері на трицепс", en: "Cable triceps pushdown", ru: "Разгибание на трицепс в кроссовере" },
    exCableTricepsExtension: { uk: "Розгинання рук на блоці", en: "Cable triceps extension", ru: "Разгибание рук на блоке" },
    exLegExtension: { uk: "Розгинання ніг", en: "Leg extension", ru: "Разгибание ног" },
    exLegCurl: { uk: "Згинання ніг", en: "Leg curl", ru: "Сгибание ног" },
    exHyperextension: { uk: "Гіперекстензія", en: "Hyperextension", ru: "Гиперэкстензия" },
    exLunges: { uk: "Випади", en: "Lunges", ru: "Выпады" },
    exReverseLungesBackpack: { uk: "Випади назад з рюкзаком", en: "Reverse lunges with backpack", ru: "Выпады назад с рюкзаком" },
    exPauseSquat: { uk: "Присідання з паузою", en: "Pause squats", ru: "Приседания с паузой" },
    exGluteBridge: { uk: "Сідничний міст / hip thrust на одній нозі", en: "Single-leg glute bridge / hip thrust", ru: "Ягодичный мост / hip thrust на одной ноге" },
    exCalfRaise: { uk: "Підйоми на носки однією ногою", en: "Single-leg calf raise", ru: "Подъем на носки одной ногой" },
    exPlank: { uk: "Планка", en: "Plank", ru: "Планка" },
    exSidePlank: { uk: "Бокова планка", en: "Side plank", ru: "Боковая планка" },
    exCrunch: { uk: "Скручування", en: "Crunches", ru: "Скручивания" },
    exKneeRaise: { uk: "Підйом колін", en: "Knee raise", ru: "Подъем коленей" },
    exHangingKneeRaise: { uk: "Підйом колін у висі", en: "Hanging knee raise", ru: "Подъем коленей в висе" },
    exBodyweightGobletSquat: { uk: "Присідання з власною вагою / гоблет-присід", en: "Bodyweight squat / goblet squat", ru: "Приседания с собственным весом / гоблет-присед" },
    exMachinePressPushup: { uk: "Жим у тренажері або віджимання", en: "Machine press or push-ups", ru: "Жим в тренажере или отжимания" },
    exDbRomanianDeadlift: { uk: "Румунська тяга з гантелями", en: "Dumbbell Romanian deadlift", ru: "Румынская тяга с гантелями" },
    exAbs: { uk: "Прес", en: "Abs", ru: "Пресс" },
    exChestFlyMachineCable: { uk: "Зведення рук у тренажері / кросовері", en: "Machine / cable chest fly", ru: "Сведение рук в тренажере / кроссовере" },
    exCableFly: { uk: "Зведення рук у кросовері", en: "Cable chest fly", ru: "Сведение рук в кроссовере" },
    exMachineCableFly: { uk: "Зведення рук у тренажері / кросовері", en: "Machine / cable chest fly", ru: "Сведение рук в тренажере / кроссовере" },
    exBiceps: { uk: "Біцепс", en: "Biceps", ru: "Бицепс" },
    exTriceps: { uk: "Трицепс", en: "Triceps", ru: "Трицепс" },
    exShoulders: { uk: "Плечі", en: "Shoulders", ru: "Плечи" },
    exCloseGripPushups: { uk: "Віджимання вузьким хватом", en: "Close-grip push-ups", ru: "Отжимания узким хватом" },
    exBackpackDumbbellRow: { uk: "Тяга рюкзака / гантелі в нахилі", en: "Backpack / dumbbell bent-over row", ru: "Тяга рюкзака / гантели в наклоне" },
    exPushupsPause: { uk: "Віджимання з паузою", en: "Paused push-ups", ru: "Отжимания с паузой" },
    exBackpackPushups: { uk: "Віджимання з рюкзаком або ноги на підвищенні", en: "Backpack push-ups or feet-elevated push-ups", ru: "Отжимания с рюкзаком или ноги на возвышении" },
    exPikeBackpackPress: { uk: "Pike-віджимання / жим рюкзака над головою", en: "Pike push-ups / backpack overhead press", ru: "Pike-отжимания / жим рюкзака над головой" },
    exBulgarianSupport: { uk: "Болгарські присідання з опорою", en: "Supported Bulgarian split squats", ru: "Болгарские приседания с опорой" },
    exSingleLegRdlBackpack: { uk: "Румунська тяга на одній нозі з рюкзаком", en: "Single-leg backpack Romanian deadlift", ru: "Румынская тяга на одной ноге с рюкзаком" },
    exBackpackRdl: { uk: "Румунська тяга з рюкзаком", en: "Backpack Romanian deadlift", ru: "Румынская тяга с рюкзаком" },
    exOutdoorPullups: { uk: "Підтягування на турніку", en: "Pull-ups on bar", ru: "Подтягивания на турнике" },
    exBarDips: { uk: "Віджимання на брусах", en: "Dips on parallel bars", ru: "Отжимания на брусьях" },
    exFloorPushups: { uk: "Віджимання від підлоги", en: "Floor push-ups", ru: "Отжимания от пола" },
    exAustralianPullupsBandRow: { uk: "Підтягування австралійські або тяга резини", en: "Australian pull-ups or band row", ru: "Австралийские подтягивания или тяга резины" },
    exAustralianPullups: { uk: "Австралійські підтягування", en: "Australian pull-ups", ru: "Австралийские подтягивания" },
    band: { uk: "Резина", en: "Band", ru: "Резина" },
    elevatedFeet: { uk: "Ноги на підвищенні", en: "Feet elevated", ru: "Ноги на возвышении" },
    backpack: { uk: "Рюкзак", en: "Backpack", ru: "Рюкзак" },
    pseudoPlanche: { uk: "Псевдо-планш", en: "Pseudo planche", ru: "Псевдо-планш" },
    dumbbellBenchShort: { uk: "Жим гантелей", en: "Dumbbell press", ru: "Жим гантелей" },
    hammerMachine: { uk: "Хамер", en: "Hammer machine", ru: "Хаммер" },
    weightedPushups: { uk: "Віджимання з вагою", en: "Weighted push-ups", ru: "Отжимания с весом" },
    backpackRowShort: { uk: "Тяга рюкзака", en: "Backpack row", ru: "Тяга рюкзака" },
    bandRowShort: { uk: "Тяга резини", en: "Band row", ru: "Тяга резины" },
    tableRow: { uk: "Тяга під столом", en: "Table row", ru: "Тяга под столом" },
    reverseLunges: { uk: "Випади назад", en: "Reverse lunges", ru: "Выпады назад" },
    pistolSupport: { uk: "Пістолет до опори", en: "Supported pistol squat", ru: "Пистолетик к опоре" },
    singleLegRow: { uk: "Тяга на одній нозі", en: "Single-leg hinge", ru: "Тяга на одной ноге" },
    hipThrust: { uk: "Хіп-траст", en: "Hip thrust", ru: "Хип-траст" },
    gobletSquat: { uk: "Гоблет-присід", en: "Goblet squat", ru: "Гоблет-присед" },
    bulgarianShort: { uk: "Болгарські", en: "Bulgarian split squats", ru: "Болгарские" },
    blockPull: { uk: "Тяга з блоків", en: "Block pull", ru: "Тяга с блоков" },
    backpackPress: { uk: "Жим рюкзака", en: "Backpack press", ru: "Жим рюкзака" },
    wallHandstand: { uk: "Стійка біля стіни", en: "Wall handstand", ru: "Стойка у стены" },
    frenchPress: { uk: "Французький жим", en: "French press", ru: "Французский жим" },
    tricepsBand: { uk: "Резина на трицепс", en: "Triceps band extension", ru: "Резина на трицепс" },
    closePushups: { uk: "Вузькі віджимання", en: "Close-grip push-ups", ru: "Узкие отжимания" },
    hollowBody: { uk: "Hollow body", en: "Hollow body", ru: "Hollow body" },
    exHeavyPullups: { uk: "Підтягування важкі", en: "Heavy pull-ups", ru: "Тяжелые подтягивания" },
    exHeavyDips: { uk: "Бруси важкі", en: "Heavy dips", ru: "Тяжелые брусья" },
    exHangingStraightLegRaise: { uk: "Підйом прямих ніг у висі", en: "Hanging straight-leg raise", ru: "Подъем прямых ног в висе" },
    placeStreetGym: { uk: "Вулиця / зал", en: "Outdoor / gym", ru: "Улица / зал" },
    placeHomeStreet: { uk: "Дім / вулиця", en: "Home / outdoor", ru: "Дом / улица" },
    placeGymHome: { uk: "Зал / дім", en: "Gym / home", ru: "Зал / дом" },
    placeHomeStreetGym: { uk: "Дім / вулиця / зал", en: "Home / outdoor / gym", ru: "Дом / улица / зал" },
    placeHomeGym: { uk: "Дім / зал", en: "Home / gym", ru: "Дом / зал" },
    levelAll: { uk: "усі", en: "all", ru: "все" },
    levelIntermediatePlus: { uk: "середній+", en: "intermediate+", ru: "средний+" },
    cueScapulaDown: { uk: "Лопатки вниз", en: "Shoulder blades down", ru: "Лопатки вниз" },
    cueChestToBar: { uk: "Груди до перекладини", en: "Chest to bar", ru: "Грудь к перекладине" },
    cueNoSwing: { uk: "Без розгойдування", en: "No swinging", ru: "Без раскачки" },
    cueShoulderStable: { uk: "Плече стабільне", en: "Shoulder stable", ru: "Плечо стабильно" },
    cueDepthControl: { uk: "Контроль глибини", en: "Depth control", ru: "Контроль глубины" },
    cueNoDrop: { uk: "Не падати вниз", en: "Do not drop down", ru: "Не проваливаться вниз" },
    closeGripBench: { uk: "Жим вузьким хватом", en: "Close-grip bench press", ru: "Жим узким хватом" },
    supportPushups: { uk: "Віджимання на опорах", en: "Support push-ups", ru: "Отжимания на опорах" },
    cueBodyLine: { uk: "Корпус однією лінією", en: "Body in one line", ru: "Корпус одной линией" },
    cueElbowsControl: { uk: "Лікті під контролем", en: "Elbows under control", ru: "Локти под контролем" },
    cueAfter20: { uk: "Після 20 повторів скорочуй відпочинок", en: "After 20 reps, shorten rest", ru: "После 20 повторов сокращай отдых" },
    cueScapulaSet: { uk: "Лопатки зведені", en: "Shoulder blades retracted", ru: "Лопатки сведены" },
    cueFeetStable: { uk: "Стопи стабільні", en: "Feet stable", ru: "Стопы стабильны" },
    cueBarControl: { uk: "Гриф під контролем", en: "Bar under control", ru: "Гриф под контролем" },
    cuePullElbow: { uk: "Тягни ліктем", en: "Pull with the elbow", ru: "Тяни локтем" },
    cueNoShrug: { uk: "Не задирай плечі", en: "Do not shrug", ru: "Не задирай плечи" },
    cuePauseTorso: { uk: "Пауза біля корпусу", en: "Pause near the torso", ru: "Пауза у корпуса" },
    cueKneeStable: { uk: "Коліно стабільне", en: "Knee stable", ru: "Колено стабильно" },
    cueTorsoControl: { uk: "Корпус під контролем", en: "Torso under control", ru: "Корпус под контролем" },
    cueFullRomNoPain: { uk: "Повна амплітуда без болю", en: "Full range without pain", ru: "Полная амплитуда без боли" },
    cueHipsBack: { uk: "Таз назад", en: "Hips back", ru: "Таз назад" },
    cueNeutralBack: { uk: "Спина нейтральна", en: "Neutral back", ru: "Спина нейтральная" },
    cueWeightClose: { uk: "Вага близько до тіла", en: "Load close to body", ru: "Вес близко к телу" },
    cueFootFull: { uk: "Стопа повністю на підлозі", en: "Full foot on the floor", ru: "Стопа полностью на полу" },
    cueKneesTrack: { uk: "Коліна за носками по лінії стопи", en: "Knees track over toes", ru: "Колени по линии стопы" },
    cueDepthBack: { uk: "Глибина без втрати спини", en: "Depth without losing back position", ru: "Глубина без потери спины" },
    cueBarClose: { uk: "Гриф близько", en: "Bar close", ru: "Гриф близко" },
    cueBackTension: { uk: "Напруга спини до старту", en: "Back tension before the start", ru: "Напряжение спины до старта" },
    cueNoYank: { uk: "Не смикати з підлоги", en: "Do not yank from the floor", ru: "Не дергать с пола" },
    cueHeadBetweenHands: { uk: "Голова між руками", en: "Head between hands", ru: "Голова между руками" },
    cueHipsHigh: { uk: "Таз високо", en: "Hips high", ru: "Таз высоко" },
    cueRigidBody: { uk: "Тіло жорстке", en: "Body rigid", ru: "Тело жесткое" },
    cueElbowMove: { uk: "Рух у лікті", en: "Movement at the elbow", ru: "Движение в локте" },
    cueNoLowBackDrop: { uk: "Не провалюй поперек", en: "Do not sag the lower back", ru: "Не проваливай поясницу" },
    cuePelvisTuck: { uk: "Таз підкручується", en: "Pelvis tucks", ru: "Таз подкручивается" },
    cueScapulaActive: { uk: "Лопатки активні", en: "Shoulder blades active", ru: "Лопатки активны" },
    trainingPlaceholder: { uk: "Обери параметри тренування та натисни «Сформувати план».", en: "Choose training parameters and press “Build plan.”", ru: "Выбери параметры тренировки и нажми «Сформировать план»." },
    nutritionPlaceholder: { uk: "Заповни поля та натисни «Розрахувати», щоб перейти до формування раціону.", en: "Fill in the fields and press “Calculate” to continue to meal plan creation.", ru: "Заполни поля и нажми «Рассчитать», чтобы перейти к формированию рациона." },
    exactNutritionNeeded: { uk: "Щоб отримати точний розрахунок, заповни всі основні поля.", en: "Fill in all main fields to get an accurate calculation.", ru: "Чтобы получить точный расчет, заполни все основные поля." },
    confirmProductSelection: { uk: "Підтвердити вибір", en: "Confirm selection", ru: "Подтвердить выбор" },
    editProductSelection: { uk: "Редагувати вибір", en: "Edit selection", ru: "Редактировать выбор" },
    productSelectionConfirmed: { uk: "Вибір продуктів підтверджено. Список запропонованих продуктів сховано, щоб не перевантажувати сторінку.", en: "Product selection confirmed. Suggested products are hidden so the page stays lighter.", ru: "Выбор продуктов подтвержден. Список предложенных продуктов скрыт, чтобы не перегружать страницу." },
    saveNutritionPdf: { uk: "Зберегти раціон PDF", en: "Save nutrition PDF", ru: "Сохранить рацион PDF" },
    saveTrainingPdf: { uk: "Зберегти тренування PDF", en: "Save training PDF", ru: "Сохранить тренировки PDF" },
    bodyWeight: { uk: "Вага тіла (кг)", en: "Body weight (kg)", ru: "Вес тела (кг)" },
    duration: { uk: "Тривалість (хв)", en: "Duration (min)", ru: "Длительность (мин)" },
    buildPlan: { uk: "Сформувати план", en: "Build plan", ru: "Сформировать план" },
    format: { uk: "Формат", en: "Format", ru: "Формат" },
    gym: { uk: "Зал", en: "Gym", ru: "Зал" },
    home: { uk: "Дім", en: "Home", ru: "Дом" },
    outdoor: { uk: "Вулиця", en: "Outdoor", ru: "Улица" },
    strength: { uk: "Сила", en: "Strength", ru: "Сила" },
    mass: { uk: "Маса", en: "Mass", ru: "Масса" },
    endurance: { uk: "Силова витривалість", en: "Strength endurance", ru: "Силовая выносливость" },
    fatloss: { uk: "Жироспалення", en: "Fat loss", ru: "Жиросжигание" },
    supportShape: { uk: "Підтримка форми", en: "Maintain shape", ru: "Поддержание формы" },
    supportShort: { uk: "Підтримка", en: "Maintenance", ru: "Поддержка" },
    rawRecomp: { uk: "рекомпозиція", en: "recomposition", ru: "рекомпозиция" },
    rawCut: { uk: "схуднення", en: "fat loss", ru: "снижение веса" },
    rawGain: { uk: "набір", en: "gain", ru: "набор" },
    rawNo: { uk: "ні", en: "no", ru: "нет" },
    rawYes: { uk: "так", en: "yes", ru: "да" },
    trainingGoal: { uk: "Тренувальна ціль", en: "Training goal", ru: "Тренировочная цель" },
    programType: { uk: "Тип програми", en: "Program type", ru: "Тип программы" },
    universal: { uk: "Універсальна", en: "Universal", ru: "Универсальная" },
    cyclePhase: { uk: "Фаза циклу", en: "Cycle phase", ru: "Фаза цикла" },
    ignore: { uk: "Не враховувати", en: "Ignore", ru: "Не учитывать" },
    daysWeek: { uk: "Днів на тиждень", en: "Days per week", ru: "Дней в неделю" },
    days2: { uk: "2 дні", en: "2 days", ru: "2 дня" },
    days3: { uk: "3 дні", en: "3 days", ru: "3 дня" },
    days4: { uk: "4 дні", en: "4 days", ru: "4 дня" },
    equipment: { uk: "Інвентар", en: "Equipment", ru: "Инвентарь" },
    limits: { uk: "Обмеження", en: "Limitations", ru: "Ограничения" },
    kcalDay: { uk: "Калорії / день", en: "Calories / day", ru: "Калории / день" },
    proteinsDay: { uk: "Білки / день", en: "Protein / day", ru: "Белки / день" },
    fatsDay: { uk: "Жири / день", en: "Fats / day", ru: "Жиры / день" },
    carbsDay: { uk: "Вуглеводи / день", en: "Carbs / day", ru: "Углеводы / день" },
    calories: { uk: "Калорії", en: "Calories", ru: "Калории" },
    proteins: { uk: "Білки", en: "Protein", ru: "Белки" },
    fats: { uk: "Жири", en: "Fats", ru: "Жиры" },
    carbs: { uk: "Вуглеводи", en: "Carbs", ru: "Углеводы" },
    water: { uk: "Вода", en: "Water", ru: "Вода" },
    salt: { uk: "Сіль", en: "Salt", ru: "Соль" },
    dayType: { uk: "Контекст навантаження", en: "Load context", ru: "Контекст нагрузки" },
    trainingDay: { uk: "Перед важкою сесією", en: "Before a heavy session", ru: "Перед тяжелой сессией" },
    restDay: { uk: "Стабільний день", en: "Stable day", ru: "Стабильный день" },
    backBtn: { uk: "Назад", en: "Back", ru: "Назад" },
    nutritionBuilder: { uk: "Формування раціону", en: "Meal plan setup", ru: "Формирование рациона" },
    nutritionLogicLine: { uk: "Логіка VitalRise: білок — база, жири — стабільність, вуглеводи — головний важіль цілі.", en: "VitalRise logic: protein is the base, fats are stability, carbs are the main goal lever.", ru: "Логика VitalRise: белок — база, жиры — стабильность, углеводы — главный рычаг цели." },
    constructor: { uk: "Конструктор", en: "Builder", ru: "Конструктор" },
    automatic: { uk: "Автоматично", en: "Automatic", ru: "Автоматически" },
    mealConstructor: { uk: "Конструктор раціону", en: "Meal builder", ru: "Конструктор рациона" },
    manualAccuracy: { uk: "Точність ручного раціону", en: "Manual meal accuracy", ru: "Точность ручного рациона" },
    mealSummary: { uk: "Підсумок по прийомах їжі", en: "Meal summary", ru: "Итог по приемам пищи" },
    workingTips: { uk: "Робочі підказки", en: "Working tips", ru: "Рабочие подсказки" },
    basicExercises: { uk: "Базові вправи", en: "Main exercises", ru: "Базовые упражнения" },
    accessoryExercises: { uk: "Допоміжні вправи", en: "Accessory exercises", ru: "Вспомогательные упражнения" },
    technique: { uk: "Техніка", en: "Technique", ru: "Техника" },
    basicExercise: { uk: "базова вправа", en: "main exercise", ru: "базовое упражнение" },
    techniqueControlLower: { uk: "контроль техніки", en: "technique control", ru: "контроль техники" },
    weeklySmoothProgression: { uk: "плавна прогресія щотижня", en: "smooth weekly progression", ru: "плавная прогрессия каждую неделю" },
    addReps: { uk: "додавай повторення", en: "add reps", ru: "добавляй повторения" },
    increaseTime: { uk: "збільшуй час", en: "increase time", ru: "увеличивай время" },
    customLoad: { uk: "довільно", en: "free choice", ru: "произвольно" },
    bodyweight: { uk: "власна вага", en: "bodyweight", ru: "собственный вес" },
    backpackLoad: { uk: "рюкзак / додаткова вага", en: "backpack / extra load", ru: "рюкзак / дополнительный вес" },
    dumbbellLoad: { uk: "гантелі / доступна вага", en: "dumbbells / available load", ru: "гантели / доступный вес" },
    bandBodyweight: { uk: "резина + власна вага", en: "band + bodyweight", ru: "резина + собственный вес" },
    bandLoad: { uk: "резина", en: "band", ru: "резина" },
    individualLoad: { uk: "підбирається індивідуально", en: "selected individually", ru: "подбирается индивидуально" },
    weeklyOneKg: { uk: "щотижня +1 кг", en: "weekly +1 kg", ru: "каждую неделю +1 кг" },
    weeklyOneRep: { uk: "щотижня +1 повтор", en: "weekly +1 rep", ru: "каждую неделю +1 повтор" },
    weeklyOneTwoKg: { uk: "щотижня +1-2 кг", en: "weekly +1-2 kg", ru: "каждую неделю +1-2 кг" },
    weeklyOneTwoKgOrRep: { uk: "щотижня +1-2 кг або +1 повтор", en: "weekly +1-2 kg or +1 rep", ru: "каждую неделю +1-2 кг или +1 повтор" },
    keepCurrentWeight: { uk: "залиш поточну вагу", en: "keep the current load", ru: "оставь текущий вес" },
    noAddedWeight: { uk: "без додавання ваги", en: "no added load", ru: "без добавления веса" },
    noForcingKeepTempo: { uk: "без форсування, тримай темп", en: "no forcing, keep the tempo", ru: "без форсирования, держи темп" },
    addTensionOrLoad: { uk: "додавай натяг або вагу", en: "add tension or load", ru: "добавляй натяжение или вес" },
    harderAfter20: { uk: "після 20 повторів скорочуй відпочинок", en: "after 20 reps, shorten rest", ru: "после 20 повторов сокращай отдых" },
    addSetOrDifficulty: { uk: "додавай підхід або час під напругою", en: "add a set or time under tension", ru: "добавляй подход или время под нагрузкой" },
    scapulaControl: { uk: "контроль лопаток", en: "shoulder blade control", ru: "контроль лопаток" },
    riskControl: { uk: "Контроль ризику", en: "Risk control", ru: "Контроль риска" },
    payAttention: { uk: "Зверни увагу", en: "Pay attention", ru: "Обрати внимание" },
    intensity: { uk: "Інтенсивність", en: "Intensity", ru: "Интенсивность" },
    progression: { uk: "Прогресія", en: "Progression", ru: "Прогрессия" },
    progressionHow: { uk: "Як додавати навантаження", en: "How to add load", ru: "Как добавлять нагрузку" },
    rirReserve: { uk: "RIR / запас повторів", en: "RIR / reps in reserve", ru: "RIR / запас повторов" },
    whenBrake: { uk: "Коли пригальмувати", en: "When to slow down", ru: "Когда притормозить" },
    formatFallback: { uk: "Формат", en: "Format", ru: "Формат" },
    programFallback: { uk: "Програма", en: "Program", ru: "Программа" },
    adaptive: { uk: "Адаптивний", en: "Adaptive", ru: "Адаптивный" },
    techniqueControl: { uk: "Контроль техніки", en: "Technique control", ru: "Контроль техники" },
    stableTechnique: { uk: "стабільна форма і контроль техніки", en: "stable form and technique control", ru: "стабильная форма и контроль техники" },
    baseStrengthLoad: { uk: "базова сила і контроль ваги", en: "base strength and load control", ru: "базовая сила и контроль веса" },
    techniqueStartWeight: { uk: "техніка і підбір стартової ваги", en: "technique and starting load selection", ru: "техника и подбор стартового веса" },
    massVolumeBase: { uk: "об'єм, база і допоміжні вправи", en: "volume, main work, and accessories", ru: "объем, база и вспомогательные упражнения" },
    energyBurnRecovery: { uk: "Витрата енергії без зриву відновлення", en: "Energy burn without breaking recovery", ru: "Расход энергии без срыва восстановления" },
    controlOpenTechnique: { uk: "Контроль: відкрий «Техніка», звір амплітуду, темп і робочі м’язи перед прогресією.", en: "Control: open “Technique”, check range, tempo, and working muscles before progression.", ru: "Контроль: открой «Техника», проверь амплитуду, темп и рабочие мышцы перед прогрессией." },
    setsShort: { uk: "підх.", en: "sets", ru: "подх." },
    rirNote: { uk: "RIR - це скільки повторів лишилось у запасі. RIR 2 означає: міг би зробити ще 2 чисті повтори.", en: "RIR means reps in reserve. RIR 2 means you could still do 2 clean reps.", ru: "RIR — это сколько повторов осталось в запасе. RIR 2 значит: мог бы сделать еще 2 чистых повтора." },
    strengthRir1: { uk: "Базові вправи: RIR 1-2, без відмови у важких підходах.", en: "Main lifts: RIR 1-2, no failure on heavy sets.", ru: "Базовые упражнения: RIR 1-2, без отказа в тяжелых подходах." },
    strengthRir2: { uk: "Якщо техніка пливе, вага не додається навіть при потрібних повторах.", en: "If technique breaks, do not add load even if reps are completed.", ru: "Если техника плывет, вес не добавляется даже при нужных повторах." },
    strengthRir3: { uk: "Допоміжні вправи тримай у RIR 2-3, щоб не забивати відновлення.", en: "Keep accessory work at RIR 2-3 so recovery is not overloaded.", ru: "Вспомогательные упражнения держи в RIR 2-3, чтобы не забивать восстановление." },
    progressionStrength1: { uk: "Якщо виконав верх діапазону з потрібним RIR - додай 2.5-5 кг наступного тижня.", en: "If you hit the top of the rep range with the target RIR, add 2.5-5 kg next week.", ru: "Если выполнил верх диапазона с нужным RIR — добавь 2.5-5 кг на следующей неделе." },
    progressionStrength2: { uk: "Якщо не виконав нижню межу - залиш вагу або зменш об'єм.", en: "If you missed the lower rep bound, keep the load or reduce volume.", ru: "Если не выполнил нижнюю границу — оставь вес или уменьши объем." },
    progressionStrength3: { uk: "Допоміжні вправи прогресують повільніше: +1 повтор або невелика вага.", en: "Accessories progress slower: +1 rep or a small load increase.", ru: "Вспомогательные упражнения прогрессируют медленнее: +1 повтор или небольшой вес." },
    deload1: { uk: "2 тренування поспіль нижче нижньої межі повторів - мінус 20-30% об'єму на тиждень.", en: "2 workouts in a row below the lower rep bound: reduce weekly volume by 20-30%.", ru: "2 тренировки подряд ниже нижней границы повторов — минус 20-30% объема на неделю." },
    deload2: { uk: "Біль у плечі, лікті, коліні або спині - прибрати відмову і спростити рух.", en: "Shoulder, elbow, knee, or back pain: remove failure work and simplify the movement.", ru: "Боль в плече, локте, колене или спине — убрать отказ и упростить движение." },
    deload3: { uk: "Сон, пульс і відчуття втоми важливіші за план на папері.", en: "Sleep, pulse, and fatigue are more important than the plan on paper.", ru: "Сон, пульс и ощущение усталости важнее плана на бумаге." },
    trainingTipCycle: { uk: "План побудований одразу на весь цикл, а не на один день.", en: "The plan is built for the whole cycle, not just one day.", ru: "План построен сразу на весь цикл, а не на один день." },
    trainingTipBasicAccessory: { uk: "Базові вправи відокремлені від допоміжних — допоміжні не прив’язані до 1ПМ.", en: "Main lifts are separated from accessory work — accessories are not tied to 1RM.", ru: "Базовые упражнения отделены от вспомогательных — вспомогательные не привязаны к 1ПМ." },
    trainingTipAccessoryProgress: { uk: "Для допоміжних вправ використовуй плавну прогресію: +1 повтор, або +1-2 кг, або +2.5-5% за тиждень.", en: "For accessory work use smooth progression: +1 rep, +1-2 kg, or +2.5-5% per week.", ru: "Для вспомогательных упражнений используй плавную прогрессию: +1 повтор, +1-2 кг или +2.5-5% за неделю." },
    trainingTipTechniqueFirst: { uk: "Якщо техніка сиплеться — не додавай вагу, спочатку стабілізуй виконання.", en: "If technique breaks down, do not add weight; stabilize execution first.", ru: "Если техника сыпется — не добавляй вес, сначала стабилизируй выполнение." },
    trainingTipHomeHarder: { uk: "Для дому легкі варіації швидко стають замалими: після 15-20 чистих повторів переходь на рюкзак, резину, вищі ноги, паузи або односторонній рух.", en: "At home, easy variations become too light quickly: after 15-20 clean reps, move to a backpack, bands, elevated feet, pauses, or unilateral work.", ru: "Дома легкие вариации быстро становятся слишком легкими: после 15-20 чистых повторов переходи на рюкзак, резину, поднятые ноги, паузы или одностороннее движение." },
    trainingTipHomeVolume: { uk: "Середній і просунутий рівень мають тримати достатній об'єм: основні рухи 5-8 підходів, для витривалості поступово до 8-10.", en: "Intermediate and advanced levels need enough volume: 5-8 sets for main movements, gradually up to 8-10 for endurance.", ru: "Средний и продвинутый уровни должны держать достаточный объем: основные движения 5-8 подходов, для выносливости постепенно до 8-10." },
    trainingTipHomeLegs: { uk: "Ноги вдома не замінюються простими присіданнями: використовуй болгарські, випади, пістолет до опори, румунську тягу на одній нозі.", en: "Home leg training is not just simple squats: use Bulgarian split squats, lunges, supported pistols, and single-leg Romanian deadlifts.", ru: "Ноги дома не заменяются простыми приседаниями: используй болгарские, выпады, пистолет к опоре, румынскую тягу на одной ноге." },
    volumeShiftedStrength: { uk: "Об’єм зміщений у сторону базових вправ, щоб тримати силовий стимул без зайвого сміттєвого навантаження.", en: "Volume is shifted toward main lifts to keep the strength stimulus without extra junk volume.", ru: "Объем смещен в сторону базовых упражнений, чтобы удержать силовой стимул без лишнего мусорного объема." },
    deload4: { uk: "Якщо верх діапазону не виконано - вагу не додавати.", en: "If the top of the range was not completed, do not add load.", ru: "Если верх диапазона не выполнен — вес не добавлять." },
    prisonWorkout: { uk: "Вулична сила / драбинки", en: "Street strength / ladders", ru: "Уличная сила / лесенки" },
    tabataCircuit: { uk: "Інтервали 1:1 / кругове", en: "1:1 intervals / circuit", ru: "Интервалы 1:1 / круговая" },
    prisonModeNote: { uk: "Вулична сила / драбинки - це режим без складного обладнання: драбинки, кола, власна вага і контроль об'єму. Він підходить для дисципліни, витривалості і жорсткого, але керованого навантаження.", en: "Street strength / ladders uses no complex equipment: ladders, circuits, bodyweight, and volume control. It fits discipline, endurance, and hard but controlled loading.", ru: "Уличная сила / лесенки — это режим без сложного оборудования: лесенки, круги, собственный вес и контроль объема. Он подходит для дисциплины, выносливости и жесткой, но управляемой нагрузки." },
    tabataModeNote: { uk: "Інтервали 1:1 / кругове тренування дають коротку інтенсивну роботу для пульсу, витрати енергії і щільності. Час відпочинку дорівнює часу роботи, тому навантаження залишається керованим.", en: "1:1 intervals / circuit training gives short intense work for heart rate, energy burn, and density. Rest time equals work time, so the load stays manageable.", ru: "Интервалы 1:1 / круговая тренировка дают короткую интенсивную работу для пульса, расхода энергии и плотности. Время отдыха равно времени работы, поэтому нагрузка остается управляемой." },
    prisonFocus: { uk: "драбинки, кола і дисципліна власної ваги", en: "ladders, circuits, and bodyweight discipline", ru: "лесенки, круги и дисциплина собственного веса" },
    tabataFocus: { uk: "пульс, щільність і чиста техніка", en: "heart rate, density, and clean technique", ru: "пульс, плотность и чистая техника" },
    prisonTip1: { uk: "У режимі вуличної сили прогрес - це більше чистих кіл або сходинок, а не постійна робота до відмови.", en: "In street strength mode, progress means more clean rounds or ladder steps, not constant failure work.", ru: "В режиме уличной силы прогресс — это больше чистых кругов или ступенек, а не постоянная работа до отказа." },
    prisonTip2: { uk: "Драбинку зупиняй до зриву техніки: плечі, лікті і поперек важливіші за цифру.", en: "Stop the ladder before technique breaks: shoulders, elbows, and lower back matter more than the number.", ru: "Останавливай лесенку до срыва техники: плечи, локти и поясница важнее цифры." },
    prisonTip3: { uk: "Якщо підтягування ще слабкі, використовуй австралійські підтягування або резину.", en: "If pull-ups are still weak, use inverted rows or a band.", ru: "Если подтягивания пока слабые, используй австралийские подтягивания или резину." },
    tabataTip1: { uk: "Інтервали 1:1 мають бути короткими і чистими: якщо техніка сиплеться, зменш темп або обери легшу вправу.", en: "1:1 intervals should be short and clean: if technique breaks, slow down or choose an easier movement.", ru: "Интервалы 1:1 должны быть короткими и чистыми: если техника сыпется, снизь темп или выбери упражнение легче." },
    tabataTip2: { uk: "Кругові тренування не замінюють усю силову базу, але добре додають витрату енергії і витривалість.", en: "Circuit training does not replace the whole strength base, but it adds energy burn and endurance well.", ru: "Круговые тренировки не заменяют всю силовую базу, но хорошо добавляют расход энергии и выносливость." },
    tabataTip3: { uk: "При болю в колінах або спині прибирай стрибки, берпі роби через крок назад.", en: "With knee or back pain, remove jumps and do burpees by stepping back.", ru: "При боли в коленях или спине убирай прыжки, берпи делай через шаг назад." },
    ladderUpperDay: { uk: "День 1 - Драбинка: верх тіла", en: "Day 1 - Ladder: upper body", ru: "День 1 - Лесенка: верх тела" },
    prisonLegsDay: { uk: "День 2 - Вулична сила: ноги + корпус", en: "Day 2 - Street strength: legs + core", ru: "День 2 - Уличная сила: ноги + корпус" },
    prisonCircuitDay: { uk: "День 3 - Кола на все тіло", en: "Day 3 - Full-body circuits", ru: "День 3 - Круги на все тело" },
    prisonControlDay: { uk: "День 4 - Контрольний день", en: "Day 4 - Control day", ru: "День 4 - Контрольный день" },
    tabataFullBodyDay: { uk: "День 1 - Інтервали 1:1: все тіло", en: "Day 1 - 1:1 intervals: full body", ru: "День 1 - Интервалы 1:1: все тело" },
    circuitTrainingDay: { uk: "День 2 - Кругове тренування", en: "Day 2 - Circuit training", ru: "День 2 - Круговая тренировка" },
    tabataUpperCoreDay: { uk: "День 3 - Інтервали 1:1: верх + корпус", en: "Day 3 - 1:1 intervals: upper body + core", ru: "День 3 - Интервалы 1:1: верх + корпус" },
    circuitLegsDay: { uk: "День 4 - Кругове тренування: ноги + витривалість", en: "Day 4 - Circuit training: legs + endurance", ru: "День 4 - Круговая тренировка: ноги + выносливость" },
    laddersRounds: { uk: "драбинки, кола і дисципліна власної ваги", en: "ladders, circuits, and bodyweight discipline", ru: "лесенки, круги и дисциплина собственного веса" },
    shortIntensity: { uk: "коротка інтенсивність", en: "short intensity", ru: "короткая интенсивность" },
    density: { uk: "щільність", en: "density", ru: "плотность" },
    bodyweightControl: { uk: "власна вага і контроль", en: "bodyweight and control", ru: "собственный вес и контроль" },
    energyExpense: { uk: "витрата енергії", en: "energy burn", ru: "расход энергии" },
    strengthDensity: { uk: "силова щільність", en: "strength density", ru: "силовая плотность" },
    cleanTechnique: { uk: "чиста техніка", en: "clean technique", ru: "чистая техника" },
    rounds3to4: { uk: "3-4 кола", en: "3-4 rounds", ru: "3-4 круга" },
    rounds4to6: { uk: "4-6 кіл", en: "4-6 rounds", ru: "4-6 кругов" },
    rounds6to8: { uk: "6-8 кіл", en: "6-8 rounds", ru: "6-8 кругов" },
    rounds4: { uk: "4 раунди", en: "4 rounds", ru: "4 раунда" },
    rounds6to8Simple: { uk: "6-8 раундів", en: "6-8 rounds", ru: "6-8 раундов" },
    blocks2: { uk: "2 блоки", en: "2 blocks", ru: "2 блока" },
    blocks3: { uk: "3 блоки", en: "3 blocks", ru: "3 блока" },
    blocks4: { uk: "4 блоки", en: "4 blocks", ru: "4 блока" },
    oneBlock: { uk: "1 блок", en: "1 block", ru: "1 блок" },
    eightRounds: { uk: "8 раундів", en: "8 rounds", ru: "8 раундов" },
    twentyMinutes: { uk: "20 хв", en: "20 min", ru: "20 мин" },
    pullOrRows: { uk: "Підтягування або австралійські підтягування", en: "Pull-ups or inverted rows", ru: "Подтягивания или австралийские подтягивания" },
    pushups: { uk: "Віджимання", en: "Push-ups", ru: "Отжимания" },
    bodyweightSquats: { uk: "Присідання з власною вагою", en: "Bodyweight squats", ru: "Приседания с собственным весом" },
    plank: { uk: "Планка", en: "Plank", ru: "Планка" },
    reverseLunges: { uk: "Випади назад", en: "Reverse lunges", ru: "Выпады назад" },
    burpees: { uk: "Берпі без стрибка або класичні берпі", en: "Step-back burpees or classic burpees", ru: "Берпи без прыжка или классические берпи" },
    wallSit: { uk: "Стілець біля стіни", en: "Wall sit", ru: "Стульчик у стены" },
    breathingCooldown: { uk: "Заминка і дихання", en: "Cool-down and breathing", ru: "Заминка и дыхание" },
    mountainClimber: { uk: "Альпініст або біг на місці", en: "Mountain climber or running in place", ru: "Альпинист или бег на месте" },
    walkingAfter: { uk: "Ходьба після тренування", en: "Walking after training", ru: "Ходьба после тренировки" },
    bodyweightBand: { uk: "власна вага / резина", en: "bodyweight / band", ru: "собственный вес / резина" },
    bodyweightBackpack: { uk: "власна вага / рюкзак", en: "bodyweight / backpack", ru: "собственный вес / рюкзак" },
    noWeight: { uk: "без ваги", en: "no load", ru: "без веса" },
    workRest2010: { uk: "20 сек робота / 20 сек відпочинок", en: "20 sec work / 20 sec rest", ru: "20 сек работа / 20 сек отдых" },
    workRest4040: { uk: "40 сек робота / 40 сек відпочинок", en: "40 sec work / 40 sec rest", ru: "40 сек работа / 40 сек отдых" },
    workRest4545: { uk: "45 сек робота / 45 сек відпочинок", en: "45 sec work / 45 sec rest", ru: "45 сек работа / 45 сек отдых" },
    cleanOverFast: { uk: "Контроль: краще чисто, ніж швидко.", en: "Control: clean beats fast.", ru: "Контроль: лучше чисто, чем быстро." },
    stopBeforeBreak: { uk: "Зупинись за 1-2 сходинки до зриву техніки.", en: "Stop 1-2 ladder steps before technique breaks.", ru: "Остановись за 1-2 ступеньки до срыва техники." },

    // Nutrition builder internals
    protein: { uk: "Білок", en: "Protein", ru: "Белок" },
    garnishCarbs: { uk: "Гарніри / вуглеводи", en: "Sides / carbs", ru: "Гарниры / углеводы" },
    extraCarbs: { uk: "Додаткові вуглеводи", en: "Extra carbs", ru: "Дополнительные углеводы" },
    vegetables: { uk: "Овочі", en: "Vegetables", ru: "Овощи" },
    selectedProtein: { uk: "Обрані білкові продукти", en: "Selected protein foods", ru: "Выбранные белковые продукты" },
    selectedCarbs: { uk: "Обрані гарніри та вуглеводи", en: "Selected sides and carbs", ru: "Выбранные гарниры и углеводы" },
    selectedFats: { uk: "Обрані додаткові жири", en: "Selected extra fats", ru: "Выбранные дополнительные жиры" },
    selectedVegetables: { uk: "Обрані овочі", en: "Selected vegetables", ru: "Выбранные овощи" },
    nothingSelected: { uk: "Нічого не вибрано.", en: "Nothing selected.", ru: "Ничего не выбрано." },
    noProductsCategory: { uk: "Немає обраних продуктів у цій категорії.", en: "No selected products in this category.", ru: "Нет выбранных продуктов в этой категории." },
    ownProducts: { uk: "Власні продукти і шаблони", en: "Custom foods and templates", ru: "Свои продукты и шаблоны" },
    ownProductsEmpty: { uk: "Власних продуктів ще немає.", en: "No custom foods yet.", ru: "Своих продуктов пока нет." },
    productName: { uk: "Назва продукту", en: "Food name", ru: "Название продукта" },
    add: { uk: "Додати", en: "Add", ru: "Добавить" },
    delete: { uk: "Видалити", en: "Delete", ru: "Удалить" },
    menuTemplateName: { uk: "Назва шаблону меню", en: "Menu template name", ru: "Название шаблона меню" },
    readyMenuName: { uk: "Назва готового меню", en: "Ready menu name", ru: "Название готового меню" },
    saveChoice: { uk: "Зберегти вибір", en: "Save selection", ru: "Сохранить выбор" },
    chooseTemplate: { uk: "Обрати шаблон", en: "Choose template", ru: "Выбрать шаблон" },
    loadTemplate: { uk: "Завантажити", en: "Load", ru: "Загрузить" },
    saveMenu: { uk: "Зберегти меню", en: "Save menu", ru: "Сохранить меню" },
    chooseMenu: { uk: "Обрати меню", en: "Choose menu", ru: "Выбрать меню" },
    loadMenu: { uk: "Завантажити меню", en: "Load menu", ru: "Загрузить меню" },
    importExportProducts: { uk: "Імпорт / експорт продуктів JSON", en: "Import / export foods JSON", ru: "Импорт / экспорт продуктов JSON" },
    importProducts: { uk: "Імпорт продуктів", en: "Import foods", ru: "Импорт продуктов" },
    readyMenuTemplates: { uk: "Шаблони готового меню", en: "Ready menu templates", ru: "Шаблоны готового меню" },
    buildMealPlan: { uk: "Сформувати раціон", en: "Build meal plan", ru: "Сформировать рацион" },
    autoMealPlan: { uk: "Автоматично сформований раціон", en: "Automatically built meal plan", ru: "Автоматически сформированный рацион" },
    eggsNote: { uk: "Яйця рахуються тільки в штуках. Жовтків окремо немає. Автоматичні прийоми їжі будуються за шаблонами: сніданок, обід, перекус, вечеря.", en: "Eggs are counted only as pieces. Yolks are not separated. Automatic meals are built by templates: breakfast, lunch, snack, dinner.", ru: "Яйца считаются только в штуках. Желтки отдельно не считаются. Автоматические приемы пищи строятся по шаблонам: завтрак, обед, перекус, ужин." },
    foodEggs: { uk: "Яйця", en: "Eggs", ru: "Яйца" },
    foodCottageCheese: { uk: "Сир кисломолочний 5%", en: "Cottage cheese 5%", ru: "Творог 5%" },
    foodChicken: { uk: "Куряче філе", en: "Chicken breast", ru: "Куриное филе" },
    foodTurkey: { uk: "Індичка", en: "Turkey", ru: "Индейка" },
    foodBeef: { uk: "Яловичина", en: "Beef", ru: "Говядина" },
    foodTuna: { uk: "Тунець", en: "Tuna", ru: "Тунец" },
    foodWhiteFish: { uk: "Біла риба", en: "White fish", ru: "Белая рыба" },
    foodSalmon: { uk: "Лосось", en: "Salmon", ru: "Лосось" },
    foodOatmeal: { uk: "Вівсянка", en: "Oatmeal", ru: "Овсянка" },
    foodBanana: { uk: "Банан", en: "Banana", ru: "Банан" },
    foodRice: { uk: "Рис", en: "Rice", ru: "Рис" },
    foodBuckwheat: { uk: "Гречка", en: "Buckwheat", ru: "Гречка" },
    foodPotato: { uk: "Картопля", en: "Potato", ru: "Картофель" },
    foodPasta: { uk: "Макарони", en: "Pasta", ru: "Макароны" },
    foodOliveOil: { uk: "Оливкова олія", en: "Olive oil", ru: "Оливковое масло" },
    foodAvocado: { uk: "Авокадо", en: "Avocado", ru: "Авокадо" },
    foodNuts: { uk: "Горіхи", en: "Nuts", ru: "Орехи" },
    foodChickenThigh: { uk: "Куряче стегно", en: "Chicken thigh", ru: "Куриное бедро" },
    foodGreekYogurt: { uk: "Грецький йогурт", en: "Greek yogurt", ru: "Греческий йогурт" },
    foodWhey: { uk: "Протеїн (сироватковий)", en: "Whey protein", ru: "Протеин (сывороточный)" },
    foodSweetPotato: { uk: "Батат", en: "Sweet potato", ru: "Батат" },
    foodBulgur: { uk: "Булгур", en: "Bulgur", ru: "Булгур" },
    foodCouscous: { uk: "Кус-кус", en: "Couscous", ru: "Кус-кус" },
    foodWholeBread: { uk: "Цільнозерновий хліб", en: "Whole-grain bread", ru: "Цельнозерновой хлеб" },
    foodButter: { uk: "Вершкове масло", en: "Butter", ru: "Сливочное масло" },
    foodPeanutButter: { uk: "Арахісова паста", en: "Peanut butter", ru: "Арахисовая паста" },
    foodSeeds: { uk: "Насіння", en: "Seeds", ru: "Семена" },
    foodSkyr: { uk: "Скір", en: "Skyr", ru: "Скир" },
    foodTofu: { uk: "Тофу", en: "Tofu", ru: "Тофу" },
    foodShrimp: { uk: "Креветки", en: "Shrimp", ru: "Креветки" },
    foodPork: { uk: "Свиняча вирізка", en: "Pork tenderloin", ru: "Свиная вырезка" },
    foodQuinoa: { uk: "Кіноа", en: "Quinoa", ru: "Киноа" },
    foodLentils: { uk: "Сочевиця", en: "Lentils", ru: "Чечевица" },
    foodBeans: { uk: "Квасоля", en: "Beans", ru: "Фасоль" },
    foodBerries: { uk: "Ягоди", en: "Berries", ru: "Ягоды" },
    foodApple: { uk: "Яблуко", en: "Apple", ru: "Яблоко" },
    foodRiceCakes: { uk: "Рисові хлібці", en: "Rice cakes", ru: "Рисовые хлебцы" },
    foodPumpkinSeeds: { uk: "Гарбузове насіння", en: "Pumpkin seeds", ru: "Тыквенные семечки" },
    foodChocolate: { uk: "Чорний шоколад 85%", en: "Dark chocolate 85%", ru: "Черный шоколад 85%" },
    foodVegetables: { uk: "Овочі", en: "Vegetables", ru: "Овощи" },
    foodAsparagus: { uk: "Спаржа", en: "Asparagus", ru: "Спаржа" },

    // Supplement Protocol
    supplementLabel: { uk: "Спортпіт", en: "Supplements", ru: "Спортпит" },
    supplementsTitle: { uk: "Добавки тільки там, де вони мають сенс", en: "Supplements only where they make sense", ru: "Добавки только там, где они имеют смысл" },
    supplementsText: { uk: "Модуль спортпіту не продає баночки. Він пояснює, що може бути доречним для спортсмена, що контролювати і коли краще не експериментувати без консультації фахівця.", en: "The supplement module does not sell jars. It explains what may fit an athlete, what to monitor, and when not to experiment without a specialist.", ru: "Модуль спортпита не продает баночки. Он объясняет, что может быть уместно спортсмену, что контролировать и когда лучше не экспериментировать без специалиста." },
    supplementProtocol: { uk: "Протокол спортпіту", en: "Supplement Protocol", ru: "Протокол спортпита" },
    buildBaseStack: { uk: "Зібрати базовий стек", en: "Build a base stack", ru: "Собрать базовый стек" },
    supplementProtocolText: { uk: "Це не медичне призначення, а спортивна навігація: що може бути доречним, що краще перевірити аналізами і що не варто додавати поверх слабкої бази.", en: "This is sports navigation, not a medical prescription: what may fit, what is better checked with labs, and what should not be added on top of a weak base.", ru: "Это спортивная навигация, а не медицинское назначение: что может быть уместно, что лучше проверить анализами и что не стоит добавлять поверх слабой базы." },
    buildStack: { uk: "Сформувати стек", en: "Build stack", ru: "Сформировать стек" },
    supplementPlaceholder: { uk: "Обери параметри, щоб отримати базовий протокол спортпіту.", en: "Choose parameters to get a base supplement protocol.", ru: "Выбери параметры, чтобы получить базовый протокол спортпита." },
    saveSuppPdf: { uk: "Зберегти спортпіт PDF", en: "Save supplements PDF", ru: "Сохранить спортпит PDF" },
    proteinType: { uk: "Протеїн за типом", en: "Protein by type", ru: "Протеин по типу" },
    proteinTypeText: { uk: "Яловичий, казеїн або гідролізат підбираються за переносимістю, часом прийому і бюджетом.", en: "Beef protein, casein, or hydrolysate are selected by tolerance, timing, and budget.", ru: "Говяжий протеин, казеин или гидролизат подбираются по переносимости, времени приема и бюджету." },
    creatine: { uk: "Креатин", en: "Creatine", ru: "Креатин" },
    creatineText: { uk: "Базова добавка для силової роботи, об’єму тренувань і повторюваної потужності.", en: "A base supplement for strength work, training volume, and repeat power.", ru: "Базовая добавка для силовой работы, объема тренировок и повторяемой мощности." },
    omega3: { uk: "Омега-3", en: "Omega-3", ru: "Омега-3" },
    omegaText: { uk: "Має сенс, якщо в раціоні мало жирної риби та якісних джерел жирів.", en: "Makes sense if the diet is low in fatty fish and quality fat sources.", ru: "Имеет смысл, если в рационе мало жирной рыбы и качественных источников жиров." },
    vitaminD: { uk: "Вітамін D", en: "Vitamin D", ru: "Витамин D" },
    vitaminDText: { uk: "Не вгадується “на око”: найкраще працює через лабораторний контроль.", en: "Not guessed by eye: it works best through lab control.", ru: "Не угадывается «на глаз»: лучше всего работает через лабораторный контроль." },
    magnesiumForms: { uk: "Форми магнію", en: "Magnesium forms", ru: "Формы магния" },
    magnesiumText: { uk: "Гліцинат, цитрат, малат або треонат мають різні задачі: сон, травлення, втома або фокус.", en: "Glycinate, citrate, malate, and threonate have different jobs: sleep, digestion, fatigue, or focus.", ru: "Глицинат, цитрат, малат и треонат имеют разные задачи: сон, пищеварение, усталость или фокус." },
    testosteroneSupport: { uk: "Підтримка тестостерону", en: "Testosterone support", ru: "Поддержка тестостерона" },
    testosteroneSupportText: { uk: "Для чоловіків: цинк, вітамін D3, магній, ашваганда і тонгкат Алі мають сенс тільки під дефіцити, стрес, сон і аналізи.", en: "For men: zinc, vitamin D3, magnesium, ashwagandha, and tongkat ali make sense only for deficiencies, stress, sleep, and lab context.", ru: "Для мужчин: цинк, витамин D3, магний, ашваганда и тонгкат Али имеют смысл только под дефициты, стресс, сон и анализы." },
    testosteroneFactors: { uk: "Спортпіт і тестостерон", en: "Sports supplements and testosterone", ru: "Спортпит и тестостерон" },
    testosteroneFactorsText: { uk: "Трибулус, пажитник, D-аспарагінова кислота, бор, тонгкат Алі й ашваганда часто продаються як “тест-бустери”, але ефект різний. Екдистерон не є стимулятором вироблення тестостерону, але може розглядатися як потенційний ергогенік для працездатності й силових адаптацій; доказовість неоднорідна.", en: "Tribulus, fenugreek, D-aspartic acid, boron, tongkat ali, and ashwagandha are often sold as testosterone boosters, but their effects differ. Ecdysterone is not a testosterone-production stimulant, but it may be considered a potential ergogenic aid for work capacity and strength adaptations; the evidence is mixed.", ru: "Трибулус, пажитник, D-аспарагиновая кислота, бор, тонгкат Али и ашваганда часто продаются как тест-бустеры, но эффект разный. Экдистерон не является стимулятором выработки тестостерона, но может рассматриваться как потенциальный эргогеник для работоспособности и силовых адаптаций; доказательность неоднородная." },
    ecdysterone: { uk: "Екдистерон", en: "Ecdysterone", ru: "Экдистерон" },
    ecdysteroneText: { uk: "Ергогенна добавка з неоднорідною доказовістю: можливий вплив на м’язову масу і силу, але це не аналог стероїдів і не база рівня креатину.", en: "An ergogenic supplement with mixed evidence: it may affect muscle mass and strength, but it is not a steroid analogue or a creatine-level base.", ru: "Эргогенная добавка с неоднородной доказательностью: возможное влияние на мышечную массу и силу, но это не аналог стероидов и не база уровня креатина." },
    maleHormoneSupport: { uk: "Чоловіча гормональна підтримка", en: "Male hormone support", ru: "Мужская гормональная поддержка" },
    hormoneNotPriority: { uk: "Не пріоритет", en: "Not a priority", ru: "Не приоритет" },
    hormoneStress: { uk: "Стрес / сон / відновлення", en: "Stress / sleep / recovery", ru: "Стресс / сон / восстановление" },
    hormonePerformance: { uk: "Сила / набір м'язів", en: "Strength / muscle gain", ru: "Сила / набор мышц" },
    hormoneLowLabs: { uk: "Є низькі ранкові аналізи", en: "Low morning labs present", ru: "Есть низкие утренние анализы" },
    excessFilter: { uk: "Фільтр зайвого", en: "Excess filter", ru: "Фильтр лишнего" },
    excessText: { uk: "Гейнери, жироспалювачі й предтрени мають проходити перевірку ціллю, тиском, сном і раціоном.", en: "Gainers, fat burners, and pre-workouts must pass a goal, blood pressure, sleep, and diet check.", ru: "Гейнеры, жиросжигатели и предтрены должны проходить проверку целью, давлением, сном и рационом." },
    supplementMetaProtein: { uk: "Контроль: білок, ШКТ, молочні продукти", en: "Control: protein, GI tract, dairy", ru: "Контроль: белок, ЖКТ, молочные продукты" },
    supplementMetaCreatine: { uk: "Контроль: вода, вага, ниркові маркери за потреби", en: "Control: water, weight, kidney markers if needed", ru: "Контроль: вода, вес, почечные маркеры при необходимости" },
    supplementMetaOmega: { uk: "Контроль: раціон, ліпідограма", en: "Control: diet, lipid panel", ru: "Контроль: рацион, липидограмма" },
    supplementMetaD: { uk: "Контроль: 25(OH)D, рекомендація лікаря", en: "Control: 25(OH)D, doctor guidance", ru: "Контроль: 25(OH)D, рекомендация врача" },
    supplementMetaMg: { uk: "Контроль: ШКТ, сон, нирки, ліки", en: "Control: GI tract, sleep, kidneys, medications", ru: "Контроль: ЖКТ, сон, почки, лекарства" },
    supplementMetaTestosterone: { uk: "Контроль: сон, стрес, 25(OH)D, цинк, ранковий тестостерон", en: "Control: sleep, stress, 25(OH)D, zinc, morning testosterone", ru: "Контроль: сон, стресс, 25(OH)D, цинк, утренний тестостерон" },
    supplementMetaTestosteroneFactors: { uk: "Контроль: ранковий тестостерон, SHBG, ЛГ/ФСГ, пролактин, естрадіол, 25(OH)D", en: "Control: morning testosterone, SHBG, LH/FSH, prolactin, estradiol, 25(OH)D", ru: "Контроль: утренний тестостерон, SHBG, ЛГ/ФСГ, пролактин, эстрадиол, 25(OH)D" },
    supplementMetaEcdysterone: { uk: "Контроль: якість продукту, WADA monitoring, ШКТ, печінка", en: "Control: product quality, WADA monitoring, GI tract, liver", ru: "Контроль: качество продукта, WADA monitoring, ЖКТ, печень" },
    supplementMetaPrinciple: { uk: "Принцип: спочатку база, потім добавки", en: "Principle: base first, supplements second", ru: "Принцип: сначала база, потом добавки" },
    healthRecovery: { uk: "Здоров’я / відновлення", en: "Health / recovery", ru: "Здоровье / восстановление" },
    healthRecoveryAlt: { uk: "Здоров'я / відновлення", en: "Health / recovery", ru: "Здоровье / восстановление" },
    healthWord: { uk: "Здоров’я", en: "Health", ru: "Здоровье" },
    healthWordAlt: { uk: "Здоров'я", en: "Health", ru: "Здоровье" },
    recoveryLower: { uk: "відновлення", en: "recovery", ru: "восстановление" },
    proteinFood: { uk: "Білок з їжі", en: "Protein from food", ru: "Белок из еды" },
    fattyFish: { uk: "Жирна риба", en: "Fatty fish", ru: "Жирная рыба" },
    vitaminDByLab: { uk: "Вітамін D за аналізом", en: "Vitamin D by lab", ru: "Витамин D по анализу" },
    sleepRecovery: { uk: "Сон / відновлення", en: "Sleep / recovery", ru: "Сон / восстановление" },
    brainFocus: { uk: "Мозок / фокус", en: "Brain / focus", ru: "Мозг / фокус" },
    caffeinePreworkout: { uk: "Кофеїн / предтрен", en: "Caffeine / pre-workout", ru: "Кофеин / предтрен" },
    oftenLowProtein: { uk: "Часто не добираю", en: "Often under target", ru: "Часто не добираю" },
    almostEnough: { uk: "Майже добираю", en: "Almost enough", ru: "Почти добираю" },
    stableEnough: { uk: "Добираю стабільно", en: "Consistently enough", ru: "Добираю стабильно" },
    rarely: { uk: "Рідко", en: "Rarely", ru: "Редко" },
    weeklyFish: { uk: "1-2 рази на тиждень", en: "1-2 times a week", ru: "1-2 раза в неделю" },
    oftenFish: { uk: "3+ рази на тиждень", en: "3+ times a week", ru: "3+ раза в неделю" },
    unknown: { uk: "Не знаю", en: "I do not know", ru: "Не знаю" },
    low: { uk: "Низький", en: "Low", ru: "Низкий" },
    normalRange: { uk: "У нормі", en: "Normal", ru: "В норме" },
    oftenPoor: { uk: "Часто погано", en: "Often poor", ru: "Часто плохо" },
    unstable: { uk: "Нестабільно", en: "Unstable", ru: "Нестабильно" },
    noPriority: { uk: "Не пріоритет", en: "Not a priority", ru: "Не приоритет" },
    focusConcentration: { uk: "Фокус і концентрація", en: "Focus and concentration", ru: "Фокус и концентрация" },
    memoryLearning: { uk: "Пам’ять / навчання", en: "Memory / learning", ru: "Память / обучение" },
    stressTension: { uk: "Стрес / напруга", en: "Stress / tension", ru: "Стресс / напряжение" },
    mentalFatigue: { uk: "Ментальна втома", en: "Mental fatigue", ru: "Ментальная усталость" },
    sensitive: { uk: "Погано переношу", en: "Poor tolerance", ru: "Плохо переношу" },
    normalTolerance: { uk: "Переношу нормально", en: "Normal tolerance", ru: "Переношу нормально" },
    avoidStims: { uk: "Не хочу стимулятори", en: "Avoid stimulants", ru: "Не хочу стимуляторы" },
    how: { uk: "Як", en: "How", ru: "Как" },
    control: { uk: "Контроль", en: "Control", ru: "Контроль" },
    high: { uk: "високий", en: "high", ru: "высокий" },
    medium: { uk: "середній", en: "medium", ru: "средний" },
    careful: { uk: "обережний", en: "cautious", ru: "осторожный" },
    situational: { uk: "ситуативний", en: "situational", ru: "ситуативный" },

    // Labs
    laboratory: { uk: "Лабораторія", en: "Laboratory", ru: "Лаборатория" },
    labsTitle: { uk: "Перший крок: зрозуміти стан організму", en: "First step: understand the body state", ru: "Первый шаг: понять состояние организма" },
    labsText: { uk: "Рекомпозиція тіла залежить не тільки від калорій і тренувань. Якщо вага, сила, сон, цикл, лібідо або відновлення “стоять”, лабораторні маркери допомагають побачити, що варто обговорити з лікарем або спортивним фахівцем. Тому аналізи стоять на початку: вони допомагають не будувати план поверх дефіцитів, перевтоми або прихованих обмежень.", en: "Body recomposition depends on more than calories and training. If weight, strength, sleep, cycle, libido, or recovery are stuck, lab markers help reveal what to discuss with a doctor or sports specialist. Labs come first so the plan is not built over deficiencies, fatigue, or hidden limits.", ru: "Рекомпозиция тела зависит не только от калорий и тренировок. Если вес, сила, сон, цикл, либидо или восстановление стоят, лабораторные маркеры помогают понять, что обсудить с врачом или спортивным специалистом. Поэтому анализы стоят в начале: они помогают не строить план поверх дефицитов, переутомления или скрытых ограничений." },
    athleteBase: { uk: "База атлета", en: "Athlete baseline", ru: "База атлета" },
    athleteBaseText: { uk: "ЗАК, феритин, B12, фолат, вітамін D, CRP і електроліти дають картину ресурсу та відновлення.", en: "CBC, ferritin, B12, folate, vitamin D, CRP, and electrolytes show resource and recovery status.", ru: "ОАК, ферритин, B12, фолат, витамин D, CRP и электролиты дают картину ресурса и восстановления." },
    metabolism: { uk: "Метаболізм", en: "Metabolism", ru: "Метаболизм" },
    metabolismText: { uk: "Глюкоза, інсулін, HbA1c і ліпідограма важливі для енергії, апетиту та довгої роботи на форму.", en: "Glucose, insulin, HbA1c, and lipids matter for energy, appetite, and long-term body composition work.", ru: "Глюкоза, инсулин, HbA1c и липидограмма важны для энергии, аппетита и долгой работы над формой." },
    liverKidneys: { uk: "Печінка і нирки", en: "Liver and kidneys", ru: "Печень и почки" },
    liverKidneysText: { uk: "ALT, AST, GGT, білірубін, креатинін, сечовина й eGFR особливо важливі при високому білку та добавках.", en: "ALT, AST, GGT, bilirubin, creatinine, urea, and eGFR are especially important with high protein and supplements.", ru: "ALT, AST, GGT, билирубин, креатинин, мочевина и eGFR особенно важны при высоком белке и добавках." },
    hormones: { uk: "Гормони", en: "Hormones", ru: "Гормоны" },
    hormonesText: { uk: "Тестостерон, естрадіол, SHBG, LH, FSH, пролактин і щитоподібна залоза оцінюються окремо для чоловіків і жінок.", en: "Testosterone, estradiol, SHBG, LH, FSH, prolactin, and thyroid markers are assessed separately for men and women.", ru: "Тестостерон, эстрадиол, SHBG, LH, FSH, пролактин и щитовидная железа оцениваются отдельно для мужчин и женщин." },
    bloodworkProtocol: { uk: "Bloodwork Protocol", en: "Bloodwork Protocol", ru: "Протокол анализов" },
    chooseLabPanel: { uk: "Підібрати панель аналізів", en: "Choose a lab panel", ru: "Подобрать панель анализов" },
    labPanelText: { uk: "Обери стать і контекст. VitalRise сформує список маркерів, які корисно обговорити з лікарем для рекомпозиції тіла, продуктивності й відновлення.", en: "Choose sex and context. VitalRise will build a list of markers worth discussing with a doctor for recomposition, performance, and recovery.", ru: "Выбери пол и контекст. VitalRise сформирует список маркеров, которые полезно обсудить с врачом для рекомпозиции, продуктивности и восстановления." },
    formLabPanel: { uk: "Сформувати панель", en: "Build panel", ru: "Сформировать панель" },
    labPlaceholder: { uk: "Обери параметри, щоб отримати лабораторну панель для рекомпозиції.", en: "Choose parameters to get a recomposition lab panel.", ru: "Выбери параметры, чтобы получить лабораторную панель для рекомпозиции." },
    savePanelPdf: { uk: "Зберегти панель PDF", en: "Save panel PDF", ru: "Сохранить панель PDF" },
    context: { uk: "Контекст", en: "Context", ru: "Контекст" },
    load: { uk: "Навантаження", en: "Load", ru: "Нагрузка" },
    femaleCycleContext: { uk: "Жіночий цикл / гормональний контекст", en: "Female cycle / hormone context", ru: "Женский цикл / гормональный контекст" },
    symptoms: { uk: "Симптоми", en: "Symptoms", ru: "Симптомы" },
    lastCheck: { uk: "Коли здавались аналізи", en: "When labs were done", ru: "Когда сдавались анализы" },
    prostateRiskLabel: { uk: "Ризик захворювань простати", en: "Prostate health risk", ru: "Риск заболеваний простаты" },
    prostateRiskAverage: { uk: "Без відомих факторів високого ризику", en: "No known high-risk factors", ru: "Без известных факторов высокого риска" },
    prostateRiskElevated: { uk: "Сімейний анамнез / BRCA2 / підвищений ризик", en: "Family history / BRCA2 / increased risk", ru: "Семейный анамнез / BRCA2 / повышенный риск" },
    psaTotalLabel: { uk: "ПСА загальний (нг/мл)", en: "Total PSA (ng/mL)", ru: "ПСА общий (нг/мл)" },
    plateauWeightStrength: { uk: "Плато у вазі / силі", en: "Weight / strength plateau", ru: "Плато в весе / силе" },
    fatigueRecovery: { uk: "Втома / погане відновлення", en: "Fatigue / poor recovery", ru: "Усталость / плохое восстановление" },
    hormoneSuspicion: { uk: "Підозра на гормональний дисбаланс", en: "Suspected hormone imbalance", ru: "Подозрение на гормональный дисбаланс" },
    moderateTraining: { uk: "3-4 тренування на тиждень", en: "3-4 workouts per week", ru: "3-4 тренировки в неделю" },
    highTraining: { uk: "5+ тренувань або висока інтенсивність", en: "5+ workouts or high intensity", ru: "5+ тренировок или высокая интенсивность" },
    calorieDeficit: { uk: "Дефіцит калорій / сушка", en: "Calorie deficit / cut", ru: "Дефицит калорий / сушка" },
    notRelevant: { uk: "Не актуально", en: "Not relevant", ru: "Не актуально" },
    regularCycle: { uk: "Регулярний цикл", en: "Regular cycle", ru: "Регулярный цикл" },
    irregularCycle: { uk: "Нерегулярний цикл", en: "Irregular cycle", ru: "Нерегулярный цикл" },
    contraception: { uk: "Гормональна контрацепція", en: "Hormonal contraception", ru: "Гормональная контрацепция" },
    postpartum: { uk: "Після пологів / лактація", en: "Postpartum / lactation", ru: "После родов / лактация" },
    noSymptoms: { uk: "Без явних симптомів", en: "No obvious symptoms", ru: "Без явных симптомов" },
    libidoCycle: { uk: "Лібідо / еректильна функція / цикл", en: "Libido / erectile function / cycle", ru: "Либидо / эректильная функция / цикл" },
    sleepFatigueRecovery: { uk: "Сон, втома, слабке відновлення", en: "Sleep, fatigue, poor recovery", ru: "Сон, усталость, слабое восстановление" },
    hairSkin: { uk: "Волосся, шкіра, акне, набряки", en: "Hair, skin, acne, swelling", ru: "Волосы, кожа, акне, отеки" },
    neverChecked: { uk: "Не здавались / не пам’ятаю", en: "Never / do not remember", ru: "Не сдавались / не помню" },
    olderSix: { uk: "Більше 6 місяців тому", en: "More than 6 months ago", ru: "Больше 6 месяцев назад" },
    recentSix: { uk: "До 6 місяців тому", en: "Within 6 months", ru: "До 6 месяцев назад" },
    labReview: { uk: "Lab Result Review", en: "Lab Result Review", ru: "Оценка анализов" },
    reviewTitle: { uk: "Оцінити отримані результати", en: "Review lab results", ru: "Оценить полученные результаты" },
    reviewText: { uk: "Введи тільки ті показники, які вже є в бланку. Система не ставить діагноз, а підсвічує спортивні ризики: дефіцити, метаболічні маркери, щитоподібну залозу, печінку, нирки та гормони з урахуванням статі.", en: "Enter only markers you already have. The system does not diagnose; it highlights sports risks: deficiencies, metabolic markers, thyroid, liver, kidneys, and hormones with sex context.", ru: "Введи только те показатели, которые уже есть в бланке. Система не ставит диагноз, а подсвечивает спортивные риски: дефициты, метаболические маркеры, щитовидную железу, печень, почки и гормоны с учетом пола." },
    reviewPlaceholder: { uk: "Введи показники з бланку, щоб отримати спортивну оцінку ризиків.", en: "Enter values from the lab sheet to get a sports risk review.", ru: "Введи показатели из бланка, чтобы получить спортивную оценку рисков." },
    reviewResults: { uk: "Оцінити результати", en: "Review results", ru: "Оценить результаты" },
    saveReviewPdf: { uk: "Зберегти оцінку PDF", en: "Save review PDF", ru: "Сохранить оценку PDF" },
    femaleContext: { uk: "Жіночий контекст", en: "Female context", ru: "Женский контекст" },
    labDate: { uk: "Дата аналізів", en: "Lab date", ru: "Дата анализов" },
    fastingConditions: { uk: "Умови здачі", en: "Sampling conditions", ru: "Условия сдачи" },
    notSpecified: { uk: "Не вказано", en: "Not specified", ru: "Не указано" },
    fasting: { uk: "Натще", en: "Fasting", ru: "Натощак" },
    notFasting: { uk: "Не натще", en: "Not fasting", ru: "Не натощак" },
    afterHardTraining: { uk: "Після важкого тренування", en: "After hard training", ru: "После тяжелой тренировки" },
    follicularPhase: { uk: "Фолікулярна фаза", en: "Follicular phase", ru: "Фолликулярная фаза" },
    lutealPhase: { uk: "Лютеїнова фаза", en: "Luteal phase", ru: "Лютеиновая фаза" },
    glucoseFasting: { uk: "Глюкоза натще (ммоль/л)", en: "Fasting glucose (mmol/L)", ru: "Глюкоза натощак (ммоль/л)" },
    totalTestosterone: { uk: "Тестостерон загальний (нмоль/л)", en: "Total testosterone (nmol/L)", ru: "Тестостерон общий (нмоль/л)" },
    cbc: { uk: "Загальний аналіз крові", en: "Complete blood count", ru: "Общий анализ крови" },
    ferritin: { uk: "Феритин", en: "Ferritin", ru: "Ферритин" },
    ferritinUnit: { uk: "Феритин (нг/мл)", en: "Ferritin (ng/mL)", ru: "Ферритин (нг/мл)" },
    serumIron: { uk: "Сироваткове залізо", en: "Serum iron", ru: "Сывороточное железо" },
    folate: { uk: "Фолат", en: "Folate", ru: "Фолат" },
    fastingGlucoseMarker: { uk: "Глюкоза натще", en: "Fasting glucose", ru: "Глюкоза натощак" },
    fastingInsulin: { uk: "Інсулін натще", en: "Fasting insulin", ru: "Инсулин натощак" },
    lipidPanel: { uk: "Ліпідограма", en: "Lipid panel", ru: "Липидограмма" },
    bilirubin: { uk: "Білірубін", en: "Bilirubin", ru: "Билирубин" },
    creatinine: { uk: "Креатинін", en: "Creatinine", ru: "Креатинин" },
    urea: { uk: "Сечовина", en: "Urea", ru: "Мочевина" },
    sodium: { uk: "Натрій", en: "Sodium", ru: "Натрий" },
    potassium: { uk: "Калій", en: "Potassium", ru: "Калий" },
    magnesium: { uk: "Магній", en: "Magnesium", ru: "Магний" },
    thyroid: { uk: "Щитоподібна залоза", en: "Thyroid", ru: "Щитовидная железа" },
    freeT4: { uk: "Вільний T4", en: "Free T4", ru: "Свободный T4" },
    freeT3: { uk: "Вільний T3", en: "Free T3", ru: "Свободный T3" },
    antiTpo: { uk: "Anti-TPO за показами", en: "Anti-TPO if indicated", ru: "Anti-TPO по показаниям" },
    maleHormonePanel: { uk: "Чоловіча гормональна панель", en: "Male hormone panel", ru: "Мужская гормональная панель" },
    femaleHormonePanel: { uk: "Жіноча гормональна панель", en: "Female hormone panel", ru: "Женская гормональная панель" },
    prostateHealth30: { uk: "Здоров’я простати 30+", en: "Prostate health 30+", ru: "Здоровье простаты 30+" },
    screeningTag: { uk: "скринінг", en: "screening", ru: "скрининг" },
    prostateScreening: { uk: "Скринінг простати", en: "Prostate screening", ru: "Скрининг простаты" },
    prostateHealth: { uk: "Здоров’я простати", en: "Prostate health", ru: "Здоровье простаты" },
    urinarySymptomsReview: { uk: "Оцінка симптомів сечовипускання", en: "Urinary symptom review", ru: "Оценка симптомов мочеиспускания" },
    prostateFamilyHistory: { uk: "Сімейний анамнез раку простати", en: "Family history of prostate cancer", ru: "Семейный анамнез рака простаты" },
    totalPsaMarker: { uk: "ПСА загальний", en: "Total PSA", ru: "ПСА общий" },
    individualPsaDecision: { uk: "Індивідуальне рішення щодо ПСА", en: "Individual PSA decision", ru: "Индивидуальное решение по ПСА" },
    prostate30Note: { uk: "У 30-39 років рутинний ПСА без симптомів або високого ризику зазвичай не потрібен. Важливі сімейний анамнез, симптоми та своєчасна консультація уролога.", en: "At ages 30-39, routine PSA testing is generally not needed without symptoms or high risk. Family history, symptoms, and timely urology review matter.", ru: "В 30-39 лет рутинный ПСА без симптомов или высокого риска обычно не нужен. Важны семейный анамнез, симптомы и своевременная консультация уролога." },
    prostate40RiskNote: { uk: "У 40-49 років ПСА обговорюють раніше при підвищеному ризику. Рішення приймають разом з урологом після розмови про користь, хибнопозитивні результати й надмірну діагностику.", en: "At ages 40-49, PSA screening may be discussed earlier for increased-risk patients. The decision should be shared with a urologist after discussing benefits, false positives, and overdiagnosis.", ru: "В 40-49 лет ПСА обсуждают раньше при повышенном риске. Решение принимают вместе с урологом после обсуждения пользы, ложноположительных результатов и гипердиагностики." },
    prostate50Note: { uk: "У 50-69 років ПСА можна обговорити з лікарем як індивідуальний скринінг. Одне значення не встановлює діагноз: важливі вік, динаміка, симптоми, запалення та стан простати.", en: "At ages 50-69, PSA can be discussed with a doctor as individualized screening. One value does not establish a diagnosis: age, trend, symptoms, inflammation, and prostate status matter.", ru: "В 50-69 лет ПСА можно обсудить с врачом как индивидуальный скрининг. Одно значение не устанавливает диагноз: важны возраст, динамика, симптомы, воспаление и состояние простаты." },
    prostate70Note: { uk: "Після 70 років користь рутинного ПСА залежить від загального здоров’я та очікуваної тривалості життя. Скринінг не повинен призначатися автоматично.", en: "After age 70, the benefit of routine PSA depends on overall health and life expectancy. Screening should not be automatic.", ru: "После 70 лет польза рутинного ПСА зависит от общего здоровья и ожидаемой продолжительности жизни. Скрининг не должен назначаться автоматически." },
    prostateAverageRiskNote: { uk: "Для чоловіків 40-49 років без підвищеного ризику рутинний ПСА не додається автоматично; ранній скринінг варто обговорити з лікарем за симптомів або зміни ризику.", en: "For average-risk men aged 40-49, routine PSA is not added automatically; discuss earlier screening with a doctor if symptoms appear or risk changes.", ru: "Для мужчин 40-49 лет без повышенного риска рутинный ПСА не добавляется автоматически; ранний скрининг стоит обсудить с врачом при симптомах или изменении риска." },
    cervicalScreening: { uk: "Скринінг шийки матки", en: "Cervical cancer screening", ru: "Скрининг шейки матки" },
    papCytology: { uk: "ПАП-тест / цитологія шийки матки", en: "Pap test / cervical cytology", ru: "ПАП-тест / цитология шейки матки" },
    hrHpvTest: { uk: "hrHPV-тест", en: "hrHPV test", ru: "hrHPV-тест" },
    cervicalHistoryReview: { uk: "Перевірка історії ПАП / hrHPV-тестів", en: "Review of Pap / hrHPV test history", ru: "Проверка истории ПАП / hrHPV-тестов" },
    cervical21Note: { uk: "У 21-29 років для середнього ризику орієнтиром є ПАП-тест раз на 3 роки. Попередні аномальні результати, імунодефіцит або ВІЛ потребують окремого графіка з гінекологом.", en: "At ages 21-29 and average risk, the guide is a Pap test every 3 years. Previous abnormal results, immunodeficiency, or HIV require an individual schedule with a gynecologist.", ru: "В 21-29 лет при среднем риске ориентиром является ПАП-тест раз в 3 года. Предыдущие аномальные результаты, иммунодефицит или ВИЧ требуют отдельного графика с гинекологом." },
    cervical30Note: { uk: "У 30-65 років перевагу надають первинному hrHPV-тесту кожні 5 років; ко-тест ПАП + hrHPV кожні 5 років є прийнятною альтернативою, а ПАП окремо кожні 3 роки — варіантом, коли HPV-тест недоступний або обраний після консультації.", en: "At ages 30-65, primary hrHPV testing every 5 years is preferred; Pap + hrHPV co-testing every 5 years is an acceptable alternative, while Pap alone every 3 years is an option when HPV testing is unavailable or chosen after counseling.", ru: "В 30-65 лет предпочтителен первичный hrHPV-тест каждые 5 лет; ко-тест ПАП + hrHPV каждые 5 лет является приемлемой альтернативой, а ПАП отдельно каждые 3 года — вариантом, когда HPV-тест недоступен или выбран после консультации." },
    cervical65Note: { uk: "Після 65 років скринінг можна завершити лише за достатньої серії попередніх негативних тестів і без високого ризику. Якщо історія неповна або були передракові зміни, графік визначає гінеколог.", en: "After age 65, screening may stop only after an adequate series of prior negative tests and in the absence of high risk. If history is incomplete or precancerous changes occurred, a gynecologist should set the schedule.", ru: "После 65 лет скрининг можно завершить только при достаточной серии предыдущих отрицательных тестов и отсутствии высокого риска. Если история неполная или были предраковые изменения, график определяет гинеколог." },
    cervicalScreeningNote: { uk: "ПАП-тест і hrHPV-тест — це профілактичний скринінг, а не аналіз статевих гормонів. Вакцинація проти HPV не скасовує плановий скринінг.", en: "Pap and hrHPV tests are preventive screening, not sex-hormone tests. HPV vaccination does not replace scheduled screening.", ru: "ПАП-тест и hrHPV-тест — это профилактический скрининг, а не анализ половых гормонов. Вакцинация против HPV не отменяет плановый скрининг." },
    psaFindingTitle: { uk: "ПСА потребує вікового та клінічного контексту", en: "PSA requires age and clinical context", ru: "ПСА требует возрастного и клинического контекста" },
    psaFindingText: { uk: "ПСА не є специфічним лише для раку: показник може змінюватися при доброякісному збільшенні простати, запаленні, інфекції або після маніпуляцій.", en: "PSA is not specific to cancer: it may change with benign prostate enlargement, inflammation, infection, or after urinary tract procedures.", ru: "ПСА не специфичен только для рака: показатель может изменяться при доброкачественном увеличении простаты, воспалении, инфекции или после манипуляций." },
    psaFindingContext: { uk: "Вік: {age}. Важливі референс лабораторії та динаміка.", en: "Age: {age}. The laboratory range and trend over time are important.", ru: "Возраст: {age}. Важны референс лаборатории и динамика." },
    psaFindingAction: { uk: "Не робити висновок за одним значенням. Якщо ПСА вище референсу, зростає в динаміці або є симптоми сечовипускання, обговорити повторний тест і консультацію уролога.", en: "Do not draw conclusions from one value. If PSA is above the laboratory range, rises over time, or urinary symptoms are present, discuss repeat testing and a urology consultation.", ru: "Не делать вывод по одному значению. Если ПСА выше референса, растет в динамике или есть симптомы мочеиспускания, обсудить повторный тест и консультацию уролога." },
    labNormalTitle: { uk: "Без явного відхилення за базовим орієнтиром", en: "No obvious deviation by the basic screening guide", ru: "Без явного отклонения по базовому ориентиру" },
    labNormalText: { uk: "Показник не створив окремого сигналу ризику в поточній скринінговій логіці. Це не означає, що його слід оцінювати ізольовано.", en: "The marker did not trigger a separate risk signal in the current screening logic. This does not mean it should be interpreted in isolation.", ru: "Показатель не создал отдельного сигнала риска в текущей скрининговой логике. Это не означает, что его следует оценивать изолированно." },
    labNormalAction: { uk: "Звірити з референсним діапазоном саме вашої лабораторії, симптомами та попередніми результатами.", en: "Compare it with your laboratory's own reference range, symptoms, and previous results.", ru: "Сверить с референсным диапазоном именно вашей лаборатории, симптомами и предыдущими результатами." },
    labSystemBlood: { uk: "Кровотворення та дефіцити", en: "Blood formation and deficiencies", ru: "Кроветворение и дефициты" },
    labSystemMetabolic: { uk: "Метаболізм і ліпіди", en: "Metabolism and lipids", ru: "Метаболизм и липиды" },
    labSystemThyroid: { uk: "Щитоподібна залоза", en: "Thyroid", ru: "Щитовидная железа" },
    labSystemLiver: { uk: "Печінковий контекст", en: "Liver context", ru: "Печеночный контекст" },
    labSystemKidney: { uk: "Нирки та електроліти", en: "Kidneys and electrolytes", ru: "Почки и электролиты" },
    labSystemHormonal: { uk: "Гормональний контекст", en: "Hormonal context", ru: "Гормональный контекст" },
    labSystemRecovery: { uk: "Відновлення та білковий статус", en: "Recovery and protein status", ru: "Восстановление и белковый статус" },
    labSystemCritical: { uk: "Є маркер, який потребує пріоритетної медичної оцінки.", en: "A marker requires priority medical evaluation.", ru: "Есть маркер, требующий приоритетной медицинской оценки." },
    labSystemAttention: { uk: "Є відхилення, яке варто оцінити разом з іншими показниками та симптомами.", en: "A deviation should be assessed together with related markers and symptoms.", ru: "Есть отклонение, которое следует оценить вместе с другими показателями и симптомами." },
    labSystemContext: { uk: "Показники потребують контексту референсів, підготовки або пов’язаних маркерів.", en: "The markers require laboratory-range, preparation, or related-marker context.", ru: "Показателям нужен контекст референсов, подготовки или связанных маркеров." },
    labSystemStable: { uk: "За базовими правилами явних сигналів не виявлено; важливими залишаються референси лабораторії та динаміка.", en: "No obvious signals were found by the basic rules; laboratory ranges and trends remain important.", ru: "По базовым правилам явных сигналов не выявлено; важны референсы лаборатории и динамика." },
    labEnteredCount: { uk: "Введено показників", en: "Markers entered", ru: "Введено показателей" },
    labSystemsTitle: { uk: "Підсумок за системами", en: "System-level summary", ru: "Итог по системам" },
    labMarkersTitle: { uk: "Детальна оцінка кожного введеного показника", en: "Detailed review of every entered marker", ru: "Детальная оценка каждого введенного показателя" },
    labLifestyleLabel: { uk: "Динаміка показників", en: "Marker trends", ru: "Динамика показателей" },
    labLifestyleTitle: { uk: "Харчування й активність можуть суттєво покращити частину аналізів", en: "Nutrition and activity can significantly improve some lab markers", ru: "Питание и активность могут существенно улучшить часть анализов" },
    labLifestyleLead: { uk: "Стабільні зміни раціону, щоденної рухливості, тренувань, сну та маси тіла можуть через певний час помітно змінити частину показників у кращу сторону. Результат оцінюють у динаміці, а не за одним днем.", en: "Consistent changes in diet, daily movement, training, sleep, and body weight can noticeably improve some markers over time. Progress should be assessed as a trend, not from a single day.", ru: "Стабильные изменения рациона, ежедневной подвижности, тренировок, сна и массы тела могут со временем заметно улучшить часть показателей. Результат оценивают в динамике, а не по одному дню." },
    labLifestyleNutritionTitle: { uk: "Харчування", en: "Nutrition", ru: "Питание" },
    labLifestyleNutritionText: { uk: "Контроль калорій, достатній білок і клітковина, менше надлишку цукру, алкоголю, трансжирів і насичених жирів можуть покращувати глюкозу, тригліцериди, частину ліпідного та печінкового профілю.", en: "Calorie control, adequate protein and fiber, and less excess sugar, alcohol, trans fat, and saturated fat can improve glucose, triglycerides, and parts of the lipid and liver profile.", ru: "Контроль калорий, достаточный белок и клетчатка, уменьшение избытка сахара, алкоголя, трансжиров и насыщенных жиров могут улучшать глюкозу, триглицериды и часть липидного и печеночного профиля." },
    labLifestyleActivityTitle: { uk: "Активність", en: "Activity", ru: "Активность" },
    labLifestyleActivityText: { uk: "Регулярна ходьба, аеробне навантаження та силові тренування можуть покращувати чутливість до інсуліну, контроль глюкози, ліпіди, тиск і загальну метаболічну картину.", en: "Regular walking, aerobic activity, and strength training can improve insulin sensitivity, glucose control, lipids, blood pressure, and the overall metabolic picture.", ru: "Регулярная ходьба, аэробная нагрузка и силовые тренировки могут улучшать чувствительность к инсулину, контроль глюкозы, липиды, давление и общую метаболическую картину." },
    labLifestyleTimeTitle: { uk: "Потрібен час", en: "Change takes time", ru: "Нужно время" },
    labLifestyleTimeText: { uk: "Частина маркерів реагує протягом кількох тижнів, іншим потрібні місяці. HbA1c відображає середню глюкозу приблизно за попередні 2-3 місяці, тому швидка перездача може не показати повний ефект.", en: "Some markers respond within weeks, while others need months. HbA1c reflects average glucose over roughly the previous 2-3 months, so an early repeat test may not show the full effect.", ru: "Часть маркеров реагирует в течение нескольких недель, другим нужны месяцы. HbA1c отражает среднюю глюкозу примерно за предыдущие 2-3 месяца, поэтому ранняя пересдача может не показать полный эффект." },
    labLifestyleLimitsTitle: { uk: "Не все вирішується способом життя", en: "Lifestyle cannot resolve everything", ru: "Не все решается образом жизни" },
    labLifestyleLimitsText: { uk: "Виражені дефіцити, значні гормональні, ниркові, запальні або інші небезпечні відхилення не можна просто чекати або виправляти дієтою. Для них потрібні лікар, уточнення причини й контрольний план.", en: "Marked deficiencies and significant hormonal, kidney, inflammatory, or other dangerous abnormalities should not simply be watched or treated with diet alone. They require medical review, clarification of the cause, and a follow-up plan.", ru: "Выраженные дефициты, значительные гормональные, почечные, воспалительные или другие опасные отклонения нельзя просто ждать или исправлять одной диетой. Нужны врач, уточнение причины и план контроля." },
    labLifestyleFollowup: { uk: "Практичний крок: зафіксувати вихідні результати, узгодити зміни харчування й активності, дотримуватися плану та повторити вибрані аналізи у термін, який визначить лікар. Порівнювати потрібно однакові одиниці, схожі умови здачі й бажано ту саму лабораторію.", en: "Practical next step: record the baseline, agree on nutrition and activity changes, follow the plan, and repeat selected tests when advised by a doctor. Compare the same units, similar collection conditions, and preferably the same laboratory.", ru: "Практический шаг: зафиксировать исходные результаты, согласовать изменения питания и активности, соблюдать план и повторить выбранные анализы в срок, который определит врач. Сравнивать нужно одинаковые единицы, похожие условия сдачи и желательно ту же лабораторию." },
    totalT: { uk: "Загальний тестостерон", en: "Total testosterone", ru: "Общий тестостерон" },
    freeT: { uk: "Вільний тестостерон або розрахунок", en: "Free testosterone or calculation", ru: "Свободный тестостерон или расчет" },
    freeTIndex: { uk: "Вільний тестостерон або індекс", en: "Free testosterone or index", ru: "Свободный тестостерон или индекс" },
    estradiol: { uk: "Естрадіол", en: "Estradiol", ru: "Эстрадиол" },
    estradiolUnit: { uk: "Естрадіол (пг/мл)", en: "Estradiol (pg/mL)", ru: "Эстрадиол (пг/мл)" },
    prolactin: { uk: "Пролактин", en: "Prolactin", ru: "Пролактин" },
    prolactinUnit: { uk: "Пролактин (нг/мл)", en: "Prolactin (ng/mL)", ru: "Пролактин (нг/мл)" },
    progesterone: { uk: "Прогестерон", en: "Progesterone", ru: "Прогестерон" },
    highLoad: { uk: "Високе навантаження", en: "High training load", ru: "Высокая нагрузка" },
    creatineKinase: { uk: "Креатинкіназа за показами", en: "Creatine kinase if indicated", ru: "Креатинкиназа по показаниям" },
    cortisol: { uk: "Кортизол за показами", en: "Cortisol if indicated", ru: "Кортизол по показаниям" },
    totalProtein: { uk: "Загальний білок", en: "Total protein", ru: "Общий белок" },
    albumin: { uk: "Альбумін", en: "Albumin", ru: "Альбумин" },
    whyRecomp: { uk: "Чому це важливо для рекомпозиції", en: "Why this matters for recomposition", ru: "Почему это важно для рекомпозиции" },
    malePanel: { uk: "Чоловіча лабораторна панель", en: "Male lab panel", ru: "Мужская лабораторная панель" },
    femalePanel: { uk: "Жіноча лабораторна панель", en: "Female lab panel", ru: "Женская лабораторная панель" },
    optimalMarkers: { uk: "Оптимально за введеними маркерами", en: "Optimal by entered markers", ru: "Оптимально по введенным маркерам" },
    noEnteredMarkers: { uk: "Немає введених показників", en: "No entered markers", ru: "Нет введенных показателей" },
    noLabStops: { uk: "За введеними значеннями немає явних лабораторних стоп-сигналів. Це не скасовує референси лабораторії, симптоми і консультацію лікаря.", en: "The entered values show no obvious lab stop signals. This does not replace lab references, symptoms, or medical consultation.", ru: "По введенным значениям нет явных лабораторных стоп-сигналов. Это не отменяет референсы лаборатории, симптомы и консультацию врача." },
    statusGreen: { uk: "зелений статус", en: "green status", ru: "зеленый статус" },
    statusYellow: { uk: "жовтий статус", en: "yellow status", ru: "желтый статус" },
    statusRed: { uk: "червоний статус", en: "red status", ru: "красный статус" },
    statusNeutral: { uk: "нейтральний статус", en: "neutral status", ru: "нейтральный статус" },

    // Coach / Athlete Timeline
    coachCommand: { uk: "Coach Command Center", en: "Coach Command Center", ru: "Командный центр Coach" },
    coachTitle: { uk: "Персональний контроль циклу", en: "Personal cycle control", ru: "Персональный контроль цикла" },
    coachText: { uk: "Timeline, план-факт, check-in, календар, графіки, попередження, presets і Blueprint 2.0 працюють як один кабінет спортсмена.", en: "Timeline, plan vs fact, check-in, calendar, charts, warnings, presets, and Blueprint 2.0 work as one athlete dashboard.", ru: "Timeline, план-факт, check-in, календарь, графики, предупреждения, presets и Blueprint 2.0 работают как единый кабинет спортсмена." },
    athleteTimeline: { uk: "Athlete Timeline", en: "Athlete Timeline", ru: "Таймлайн атлета" },
    date: { uk: "Дата", en: "Date", ru: "Дата" },
    weightKg: { uk: "Вага, кг", en: "Weight, kg", ru: "Вес, кг" },
    waistCm: { uk: "Талія, см", en: "Waist, cm", ru: "Талия, см" },
    sleepHours: { uk: "Сон, год", en: "Sleep, h", ru: "Сон, ч" },
    energy: { uk: "Енергія", en: "Energy", ru: "Энергия" },
    note: { uk: "Нотатка", en: "Note", ru: "Заметка" },
    addEntry: { uk: "Додати запис", en: "Add entry", ru: "Добавить запись" },
    addEntryAlt: { uk: "Додати", en: "Add", ru: "Добавить" },
    planFact: { uk: "План / факт", en: "Plan / fact", ru: "План / факт" },
    caloriesPlan: { uk: "Ккал план", en: "Kcal plan", ru: "Ккал план" },
    caloriesFact: { uk: "Ккал факт", en: "Kcal actual", ru: "Ккал факт" },
    saveFact: { uk: "Зберегти факт", en: "Save fact", ru: "Сохранить факт" },
    proteinPlan: { uk: "Білок план", en: "Protein plan", ru: "Белок план" },
    proteinFact: { uk: "Білок факт", en: "Protein actual", ru: "Белок факт" },
    trainingDone: { uk: "Тренування", en: "Training", ru: "Тренировка" },
    trainingLower: { uk: "тренування", en: "training", ru: "тренировка" },
    sleep: { uk: "Сон", en: "Sleep", ru: "Сон" },
    done: { uk: "виконано", en: "done", ru: "выполнено" },
    partial: { uk: "частково", en: "partial", ru: "частично" },
    missed: { uk: "пропущено", en: "missed", ru: "пропущено" },
    weeklyCheckin: { uk: "Weekly Check-in", en: "Weekly Check-in", ru: "Недельный check-in" },
    weightChangePercent: { uk: "Зміна ваги, %", en: "Weight change, %", ru: "Изменение веса, %" },
    adherencePercent: { uk: "Дотримання, %", en: "Adherence, %", ru: "Соблюдение, %" },
    makeConclusion: { uk: "Зробити висновок", en: "Make decision", ru: "Сделать вывод" },
    lastDecision: { uk: "Останнє рішення", en: "Last decision", ru: "Последнее решение" },
    noCheckinYet: { uk: "Поки немає check-in.", en: "No check-in yet.", ru: "Пока нет check-in." },
    trainingCalendar: { uk: "Календар тренувань", en: "Training calendar", ru: "Календарь тренировок" },
    saveWeek: { uk: "Зберегти тиждень", en: "Save week", ru: "Сохранить неделю" },
    monday: { uk: "Пн", en: "Mon", ru: "Пн" },
    tuesday: { uk: "Вт", en: "Tue", ru: "Вт" },
    wednesday: { uk: "Ср", en: "Wed", ru: "Ср" },
    thursday: { uk: "Чт", en: "Thu", ru: "Чт" },
    friday: { uk: "Пт", en: "Fri", ru: "Пт" },
    saturday: { uk: "Сб", en: "Sat", ru: "Сб" },
    sunday: { uk: "Нд", en: "Sun", ru: "Вс" },
    recoveryDay: { uk: "відновлення", en: "recovery", ru: "восстановление" },
    steps: { uk: "кроки", en: "steps", ru: "шаги" },
    trainingExecutionLog: { uk: "Training execution log", en: "Training execution log", ru: "Журнал выполнения тренировок" },
    exercise: { uk: "Вправа", en: "Exercise", ru: "Упражнение" },
    sets: { uk: "Підходи", en: "Sets", ru: "Подходы" },
    setsAlt: { uk: "Сети", en: "Sets", ru: "Сеты" },
    reps: { uk: "Повтори", en: "Reps", ru: "Повторы" },
    loadKg: { uk: "Вага, кг", en: "Load, kg", ru: "Вес, кг" },
    pain: { uk: "Біль", en: "Pain", ru: "Боль" },
    no: { uk: "немає", en: "no", ru: "нет" },
    yes: { uk: "є", en: "yes", ru: "есть" },
    addTraining: { uk: "Додати тренування", en: "Add training", ru: "Добавить тренировку" },
    progressionAdvisor: { uk: "Progression advisor", en: "Progression advisor", ru: "Советник прогрессии" },
    needTwoWeight: { uk: "Потрібно мінімум 2 записи для графіка Вага.", en: "At least 2 entries are needed for the Weight chart.", ru: "Нужно минимум 2 записи для графика Вес." },
    needTwoWaist: { uk: "Потрібно мінімум 2 записи для графіка Талія.", en: "At least 2 entries are needed for the Waist chart.", ru: "Нужно минимум 2 записи для графика Талия." },
    noTimelineRows: { uk: "Записів ще немає.", en: "No entries yet.", ru: "Записей пока нет." },
    noTrainingRows: { uk: "Записів тренування ще немає.", en: "No training entries yet.", ru: "Записей тренировок пока нет." },
    records: { uk: "Записів", en: "Entries", ru: "Записей" },
    avgRpe: { uk: "Середній RPE", en: "Average RPE", ru: "Средний RPE" },
    volume6: { uk: "Обсяг 6 записів", en: "Volume of 6 entries", ru: "Объем 6 записей" },
    noProgressionAdvice: { uk: "Додай хоча б один запис у Training execution log, щоб отримати пораду прогресії.", en: "Add at least one entry to Training execution log to get progression advice.", ru: "Добавь хотя бы одну запись в Training execution log, чтобы получить совет по прогрессии." },
    planAdherence: { uk: "Дотримання плану", en: "Plan adherence", ru: "Соблюдение плана" },
    lastCheckin: { uk: "Останній check-in", en: "Last check-in", ru: "Последний check-in" },
    risks: { uk: "Ризики", en: "Risks", ru: "Риски" },
    noCriticalRisks: { uk: "Критичних ризиків не видно. Тримай план і збирай дані ще 7 днів.", en: "No critical risks are visible. Hold the plan and collect data for another 7 days.", ru: "Критических рисков не видно. Держи план и собирай данные еще 7 дней." },
    presetProfiles: { uk: "Швидкі налаштування цілі", en: "Quick goal setup", ru: "Быстрая настройка цели" },
    presetRecomp: { uk: "Рекомпозиція", en: "Recomp", ru: "Рекомпозиция" },
    presetCut: { uk: "Сушка", en: "Cut", ru: "Сушка" },
    presetLeanGain: { uk: "Сухий набір", en: "Lean Gain", ru: "Сухой набор" },
    presetStreetStrength: { uk: "Сила на турніку", en: "Street Strength", ru: "Сила на турнике" },
    presetRecompNote: { uk: "Баланс сили, стабільного білка і контрольованого дефіциту/підтримки.", en: "Balance strength, steady protein, and a controlled deficit/maintenance phase.", ru: "Баланс силы, стабильного белка и контролируемого дефицита/поддержки." },
    presetCutNote: { uk: "Зберегти силу, тримати кроки і не робити дефіцит агресивним.", en: "Keep strength, hold steps, and avoid an aggressive deficit.", ru: "Сохранить силу, держать шаги и не делать дефицит агрессивным." },
    presetLeanGainNote: { uk: "Повільний набір, прогресія навантажень і контроль талії.", en: "Slow gain, load progression, and waist control.", ru: "Медленный набор, прогрессия нагрузок и контроль талии." },
    presetStreetStrengthNote: { uk: "Турнік, бруси, обсяг без втрати амплітуди.", en: "Pull-up bar, dips, and volume without losing range of motion.", ru: "Турник, брусья, объем без потери амплитуды." },

    // Progress Command
    progressCommand: { uk: "Progress Command", en: "Progress Command", ru: "Командный центр прогресса" },
    progressTitle: { uk: "Контроль прогресу без хаотичних правок", en: "Progress control without chaotic edits", ru: "Контроль прогресса без хаотичных правок" },
    progressText: { uk: "Щотижневий check-in допомагає бачити рух без паніки. Корекція калорій робиться після контрольних 14 днів, якщо план реально виконувався.", en: "A weekly check-in helps you see movement without panic. Calorie correction happens after a 14-day control period if the plan was actually followed.", ru: "Недельный check-in помогает видеть движение без паники. Коррекция калорий выполняется после контрольных 14 дней, если план реально соблюдался." },
    weeklyCheckIn: { uk: "Weekly Check-In", en: "Weekly Check-In", ru: "Недельный check-in" },
    assessWeek: { uk: "Оцінити прогрес", en: "Assess progress", ru: "Оценить прогресс" },
    progressPanelText: { uk: "Обери щотижневий контроль для підтримки курсу або контроль 14 днів для реальної корекції раціону.", en: "Choose weekly control to hold course or 14-day control for real nutrition correction.", ru: "Выбери недельный контроль для удержания курса или контроль 14 дней для реальной коррекции рациона." },
    progressPlaceholder: { uk: "Заповни тижневі дані, щоб отримати рішення на наступний тиждень.", en: "Fill weekly data to get a decision for the next week.", ru: "Заполни недельные данные, чтобы получить решение на следующую неделю." },
    getDecision: { uk: "Отримати рішення", en: "Get decision", ru: "Получить решение" },
    saveCheckinPdf: { uk: "Зберегти check-in PDF", en: "Save check-in PDF", ru: "Сохранить check-in PDF" },
    weightChangeWeek: { uk: "Зміна середньої ваги за тиждень (%)", en: "Average weekly weight change (%)", ru: "Изменение среднего веса за неделю (%)" },
    cycleWaterProgressNote: { uk: "Для жінок ПМС, менструація і фаза циклу можуть тимчасово піднімати воду, вагу і об’єми. Для рекомпозиції порівнюй заміри в однаковій фазі циклу або роби позначку в check-in.", en: "For women, PMS, menstruation, and cycle phase can temporarily increase water, scale weight, and measurements. For recomposition, compare measurements in the same cycle phase or mark it in the check-in.", ru: "У женщин ПМС, менструация и фаза цикла могут временно повышать воду, вес и объемы. Для рекомпозиции сравнивай замеры в одной фазе цикла или отмечай это в check-in." },
    cycleWaterAction: { uk: "Якщо це жіночий цикл, познач ПМС/менструацію: у цей період гормональні зміни можуть тимчасово піднімати воду, вагу і об’єми. Не роби висновок по одному заміру; краще порівнювати однакову фазу циклу.", en: "If this is a female cycle context, mark PMS/menstruation: hormonal changes during this period can temporarily increase water, scale weight, and measurements. Do not judge by one measurement; compare the same cycle phase instead.", ru: "Если это женский цикл, отметь ПМС/менструацию: в этот период гормональные изменения могут временно повышать воду, вес и объемы. Не делай вывод по одному замеру; лучше сравнивать одну и ту же фазу цикла." },
    cycleWaterBiweeklyAction: { uk: "Для жінок окремо позначати ПМС/менструацію: через гормональні зміни вода, вага і об’єми можуть тимчасово зростати, тому рекомпозицію краще оцінювати по середніх значеннях і однаковій фазі циклу.", en: "For women, mark PMS/menstruation separately: hormonal changes can temporarily increase water, weight, and measurements, so recomposition is better judged by averages and the same cycle phase.", ru: "Женщинам отдельно отмечать ПМС/менструацию: из-за гормональных изменений вода, вес и объемы могут временно расти, поэтому рекомпозицию лучше оценивать по средним значениям и одной фазе цикла." },
    waistChange: { uk: "Зміна талії (см)", en: "Waist change (cm)", ru: "Изменение талии (см)" },
    strengthTrend: { uk: "Силові показники", en: "Strength metrics", ru: "Силовые показатели" },
    sleepNight: { uk: "Сон, год/ніч", en: "Sleep, h/night", ru: "Сон, ч/ночь" },
    stepsAverage: { uk: "Кроки в середньому/день", en: "Average steps/day", ru: "Шаги в среднем/день" },
    nutritionAdherence: { uk: "Дотримання раціону (%)", en: "Nutrition adherence (%)", ru: "Соблюдение рациона (%)" },
    hungerCravings: { uk: "Голод / тяга до їжі", en: "Hunger / cravings", ru: "Голод / тяга к еде" },
    strengthUp: { uk: "Ростуть", en: "Increasing", ru: "Растут" },
    strengthStable: { uk: "Стабільні", en: "Stable", ru: "Стабильные" },
    strengthDown: { uk: "Падають", en: "Decreasing", ru: "Падают" },
    goodEnergy: { uk: "Добра", en: "Good", ru: "Хорошая" },
    mediumEnergy: { uk: "Середня", en: "Medium", ru: "Средняя" },
    lowEnergy: { uk: "Низька", en: "Low", ru: "Низкая" },
    goodEnergyLower: { uk: "добра", en: "good", ru: "хорошая" },
    mediumEnergyLower: { uk: "середня", en: "medium", ru: "средняя" },
    lowEnergyLower: { uk: "низька", en: "low", ru: "низкая" },
    rawGood: { uk: "добра", en: "Good", ru: "хорошая" },
    rawMedium: { uk: "середня", en: "Medium", ru: "средняя" },
    rawLow: { uk: "низька", en: "Low", ru: "низкая" },
    controlled: { uk: "Контрольований", en: "Controlled", ru: "Контролируемый" },
    noticeable: { uk: "Помітний", en: "Noticeable", ru: "Заметный" },
    highHunger: { uk: "Високий", en: "High", ru: "Высокий" },
    strongSignals: { uk: "Сильні сигнали", en: "Strong signals", ru: "Сильные сигналы" },
    risks: { uk: "Ризики", en: "Risks", ru: "Риски" },
    decision7: { uk: "Рішення на 7 днів", en: "7-day decision", ru: "Решение на 7 дней" },
    holdCourse: { uk: "Тримай курс", en: "Hold course", ru: "Держи курс" },
    needMetrics: { uk: "Потрібні фактичні метрики", en: "Actual metrics needed", ru: "Нужны фактические метрики" },

    // Athlete Blueprint
    blueprintTitle: { uk: "Паспорт тіла і головний пріоритет", en: "Body passport and main priority", ru: "Паспорт тела и главный приоритет" },
    blueprintText: { uk: "Коли дані зібрані, найважливіше — не робити все одразу. Blueprint зводить ціль, рівень, лабораторний статус, прогрес і відновлення в один порядок дій.", en: "Once data is collected, the key is not doing everything at once. Blueprint turns goal, level, lab status, progress, and recovery into one order of action.", ru: "Когда данные собраны, главное — не делать все сразу. Blueprint сводит цель, уровень, лабораторный статус, прогресс и восстановление в единый порядок действий." },
    finalProtocol: { uk: "Зібрати фінальний протокол", en: "Build final protocol", ru: "Собрать финальный протокол" },
    blueprintPanelText: { uk: "Обери поточну ситуацію після калькуляторів. VitalRise покаже, що має бути першим, другим і третім фокусом на найближчі 4 тижні.", en: "Choose the current situation after the calculators. VitalRise will show the first, second, and third focus for the next 4 weeks.", ru: "Выбери текущую ситуацию после калькуляторов. VitalRise покажет первый, второй и третий фокус на ближайшие 4 недели." },
    mainGoal: { uk: "Головна ціль", en: "Main goal", ru: "Главная цель" },
    labStatus: { uk: "Лабораторний статус", en: "Lab status", ru: "Лабораторный статус" },
    progress: { uk: "Прогрес", en: "Progress", ru: "Прогресс" },
    recovery: { uk: "Відновлення", en: "Recovery", ru: "Восстановление" },
    stable: { uk: "Стабільне", en: "Stable", ru: "Стабильное" },
    chaotic: { uk: "Нестабільне", en: "Unstable", ru: "Нестабильное" },
    notTracking: { uk: "Не рахую", en: "Not tracking", ru: "Не считаю" },
    progressing: { uk: "Є прогресія", en: "Progressing", ru: "Есть прогрессия" },
    flat: { uk: "Стоїть на місці", en: "Stalled", ru: "Стоит на месте" },
    tooMuchFatigue: { uk: "Забагато втоми", en: "Too much fatigue", ru: "Слишком много усталости" },
    noStopSignals: { uk: "Без явних стоп-сигналів", en: "No obvious stop signals", ru: "Без явных стоп-сигналов" },
    attentionMarkers: { uk: "Є маркери уваги", en: "Attention markers present", ru: "Есть маркеры внимания" },
    redMarkers: { uk: "Є червоні маркери", en: "Red markers present", ru: "Есть красные маркеры" },
    notTestedYet: { uk: "Ще не здавав/ла", en: "Not tested yet", ru: "Еще не сдавал/а" },
    moving: { uk: "Рухається", en: "Moving", ru: "Двигается" },
    plateau: { uk: "Плато", en: "Plateau", ru: "Плато" },
    regression: { uk: "Регрес", en: "Regression", ru: "Регресс" },
    noTracking: { uk: "Немає трекінгу", en: "No tracking", ru: "Нет трекинга" },
    good: { uk: "Добре", en: "Good", ru: "Хорошо" },
    poor: { uk: "Погане", en: "Poor", ru: "Плохое" },
    minimalOnly: { uk: "Тільки база", en: "Basics only", ru: "Только база" },
    random: { uk: "Хаотично", en: "Chaotic", ru: "Хаотично" },
    noneUsed: { uk: "Не використовую", en: "Not using", ru: "Не использую" },
    blueprintPlaceholder: { uk: "Обери стан системи, щоб отримати паспорт пріоритетів.", en: "Choose system state to get a priority passport.", ru: "Выбери состояние системы, чтобы получить паспорт приоритетов." },
    mainPriorities: { uk: "Головні пріоритети", en: "Main priorities", ru: "Главные приоритеты" },
    decisionProtocol: { uk: "Протокол рішень", en: "Decision protocol", ru: "Протокол решений" },
    fourWeekFocus: { uk: "4-тижневий фокус", en: "4-week focus", ru: "4-недельный фокус" },
    blueprintActivated: { uk: "Athlete Blueprint активовано", en: "Athlete Blueprint activated", ru: "Athlete Blueprint активирован" },

    // Footer
    footerText: { uk: "Атлетична система для харчування, тренувань, спортпіту, лабораторного контролю, прогресу і фінального Blueprint.", en: "An athletic system for nutrition, training, supplements, lab control, progress, and the final Blueprint.", ru: "Атлетическая система для питания, тренировок, спортпита, лабораторного контроля, прогресса и финального Blueprint." },
    footerSellerTitle: { uk: "Продавець і контакти", en: "Seller and contacts", ru: "Продавец и контакты" },
    footerSellerInfo: { uk: "ФОП Бєлашова Маріанна Ігорівна, РНОКПП 3283103940. Юридична та фактична адреса: м. Київ, вул. Харківське шосе, 168Д, кв. 51. Телефон: +38 (093) 581-06-28. Email: info@vitalrise.com.ua.", en: "Sole proprietor Bielashova Marianna Ihorivna, taxpayer ID 3283103940. Registered and actual address: Kyiv, Kharkivske Shose Street, 168D, apt. 51. Phone: +38 (093) 581-06-28. Email: info@vitalrise.com.ua.", ru: "ФЛП Белашова Марианна Игоревна, РНУКПН 3283103940. Регистрационный и фактический адрес: г. Киев, ул. Харьковское шоссе, 168Д, кв. 51. Телефон: +38 (093) 581-06-28. Email: info@vitalrise.com.ua." },
    footerPrivacy: { uk: "Політика конфіденційності", en: "Privacy Policy", ru: "Политика конфиденциальности" },
    footerTerms: { uk: "Умови використання", en: "Terms of Use", ru: "Условия использования" },
    footerDisclaimer: { uk: "Медичний / АС/ААС дисклеймер", en: "Medical / AS/AAS Disclaimer", ru: "Медицинский / АС/ААС дисклеймер" },
    footerCopyright: { uk: "© 2026 VitalRise. Усі права захищені.", en: "© 2026 VitalRise. All rights reserved.", ru: "© 2026 VitalRise. Все права защищены." },
    footerDataActionsAria: { uk: "Експорт та імпорт даних VitalRise", en: "Export and import VitalRise data", ru: "Экспорт и импорт данных VitalRise" },
    footerBackupFile: { uk: "Файл резервної копії VitalRise", en: "VitalRise backup file", ru: "Файл резервной копии VitalRise" },
    footerBrandAria: { uk: "VitalRise головна", en: "VitalRise home", ru: "Главная VitalRise" },
    system: { uk: "Система", en: "System", ru: "Система" },
    important: { uk: "Важливо", en: "Important", ru: "Важно" },
    footerNote: { uk: "VitalRise не ставить діагнози й не призначає лікування. Лабораторні показники, гормони, пролактин, щитоподібну залозу, печінкові й ниркові маркери потрібно трактувати з лікарем.", en: "VitalRise does not diagnose or prescribe treatment. Lab values, hormones, prolactin, thyroid, liver, and kidney markers should be interpreted with a doctor.", ru: "VitalRise не ставит диагнозы и не назначает лечение. Лабораторные показатели, гормоны, пролактин, щитовидную железу, печеночные и почечные маркеры нужно трактовать с врачом." },
    clearSaved: { uk: "Очистити збережені дані", en: "Clear saved data", ru: "Очистить сохраненные данные" },
    exportJson: { uk: "Експорт JSON", en: "Export JSON", ru: "Экспорт JSON" },
    importJson: { uk: "Імпорт JSON", en: "Import JSON", ru: "Импорт JSON" },
    footerBottom: { uk: "High-level control for athletic recomposition.", en: "High-level control for athletic recomposition.", ru: "Контроль высокого уровня для атлетической рекомпозиции." }
  };

  Object.assign(translations.uk, {
    "labs.heroTitle": "Аналізи перед різкими рішеннями",
    labLabel: "Лабораторія",
    gender: "Стать",
    "labs.heroText": "Аналізи показують, чи є в організму ресурс для навантажень, дефіциту або набору, і допомагають вчасно помітити фактори, які можуть гальмувати результат.",
    "labs.heroPanelTitle": "Не діагноз, а карта для розмови з лікарем",
    "labs.heroPanelText": "VitalRise показує, що варто перевірити й коли не потрібно експериментувати самостійно.",
    labReviewSummaryNote: "Спочатку сформуй Bloodwork Protocol, потім відкрий цей блок.",
    labReviewGate: "Сформуй панель у Bloodwork Protocol вище. Після цього тут з'являться тільки ті поля, які входять у рекомендований список аналізів.",
    femaleContext: "Жіночий контекст",
    notApplicable: "Не актуально",
    follicularPhase: "Фолікулярна фаза",
    lutealPhase: "Лютеїнова фаза",
    irregularCycle: "Нерегулярний цикл",
    hormonalContraception: "Гормональна контрацепція",
    postpartumLactation: "Після пологів / лактація",
    reviewDate: "Дата аналізів",
    fastingCondition: "Умови здачі",
    unknown: "Не вказано",
    fasting: "Натще",
    notFasting: "Не натще",
    afterHeavyTraining: "Після важкого тренування",
    "supplements.heroLabel": "Supplement Command",
    "supplements.heroTitle": "Добавки тільки там, де є сенс",
    "supplements.heroText": "Спортпіт, ферменти, електроліти й підтримка травлення підбираються під ціль, раціон, переносимість і лабораторний контекст.",
    "supplements.heroPanelTitle": "Спочатку база, потім добавки",
    "supplements.heroPanelText": "Додаткові вуглеводи та гейнери доречні переважно на наборі маси або легкій рекомпозиції, не на зниженні ваги.",
    buildBaseStack: "Зібрати базовий стек",
    buildStack: "Сформувати стек",
    proteinFromFood: "Білок з їжі",
    proteinByType: "Протеїн за типом",
    proteinByTypeText: "Яловичий, казеїн або гідролізат підбираються за переносимістю, часом прийому і бюджетом.",
    oftenLowProtein: "Часто не добираю",
    almostEnoughProtein: "Майже добираю",
    stableEnoughProtein: "Добираю стабільно",
    fattyFish: "Жирна риба",
    rarely: "Рідко",
    weekly1to2: "1-2 рази на тиждень",
    weekly3plus: "3+ рази на тиждень",
    vitaminDByLabs: "Вітамін D за аналізом",
    low: "Низький",
    normalRange: "У нормі",
    fatBurning: "Жироспалення",
    sleepRecovery: "Сон / відновлення",
    oftenPoor: "Часто погано",
    unstable: "Нестабільно",
    brainFocus: "Мозок / фокус",
    notPriority: "Не пріоритет",
    focusConcentration: "Фокус і концентрація",
    memoryLearning: "Пам’ять / навчання",
    stressTension: "Стрес / напруга",
    mentalFatigue: "Ментальна втома",
    caffeinePreworkout: "Кофеїн / предтрен",
    stimulantSensitive: "Погано переношу",
    stimulantNormal: "Переношу нормально",
    avoidStimulants: "Не хочу стимулятори",
    stressSleepRecovery: "Стрес / сон / відновлення",
    strengthMuscleGain: "Сила / набір м'язів",
    openReport: "Відкрити звіт",
    excessFilterText: "Гейнери, жироспалювачі й предтрени мають проходити перевірку ціллю, тиском, сном і раціоном.",
    "features.platformLabel": "VitalRise Platform",
    "features.platformTitle": "Що дає VitalRise",
    "features.modulesAria": "Модулі VitalRise",
    "features.openNutrition": "Відкрити модуль Харчування",
    "features.openTraining": "Відкрити модуль Тренування",
    "features.openProgress": "Відкрити модуль Прогрес",
    "features.openLabs": "Відкрити модуль Аналізи",
    "features.openSupplements": "Відкрити модуль Добавки",
    "features.openRecovery": "Відкрити модуль Відновлення",
    "features.nutritionMeta": "Меню / БЖВ / заміни",
    "features.trainingMeta": "PPL / сила / об’єм",
    "features.progressMeta": "Check-in / 14 днів",
    "features.labsMeta": "Маркери / ризики",
    "features.supplementsCardTitle": "Добавки",
    "features.supplementsMeta": "Спортпіт / ШКТ",
    "features.recoveryMeta": "Сон / масаж / вода",
    footerText: "Атлетична система для харчування, тренувань, спортпіту, лабораторного контролю, прогресу і фінального Blueprint.",
    footerSellerTitle: "Продавець і контакти",
    footerSellerInfo: "ФОП Бєлашова Маріанна Ігорівна, РНОКПП 3283103940. Юридична та фактична адреса: м. Київ, вул. Харківське шосе, 168Д, кв. 51. Телефон: +38 (093) 581-06-28. Email: info@vitalrise.com.ua.",
    system: "Система",
    important: "Важливо",
    footerNote: "VitalRise не ставить діагнози й не призначає лікування. Лабораторні показники, гормони, пролактин, щитоподібну залозу, печінкові й ниркові маркери потрібно трактувати з лікарем.",
    footerBottom: "High-level control for athletic recomposition.",
    footerLinksAria: "Швидкі посилання",
    "nav.home": "Головна",
    "vlog.footerText": "Фармакологічна база знань доповнює основну систему VitalRise і не замінює лікаря.",
    "vlog.footerNote": "VitalRise не призначає фармакологію, не ставить діагнози і не дає схеми самолікування. Матеріали потрібні для освіти, оцінки ризиків і підготовки правильних питань до фахівця.",
    "vlog.footerBottom": "Освітній влог про препарати, ризики і контроль здоров'я.",
    "nav.knowledge": "База знань",
    "nav.pricing": "Тарифи",
    "knowledge.label": "База знань",
    "knowledge.title": "Короткі пояснення, які допомагають клієнту довіряти плану",
    "knowledge.text": "Цей блок закриває типові питання перед покупкою: як працює схуднення, чому для набору потрібен контроль талії, навіщо рахувати БЖВ і коли варто дивитися на здоров’я ширше, ніж тільки на вагу.",
    "knowledge.cutTitle": "Схуднення без зривів",
    "knowledge.cutText": "Стійкий дефіцит калорій має бути помірним. Якщо занадто різко урізати їжу, падає енергія, тренування стають гіршими, а дотримання плану ламається.",
    "knowledge.cutCta": "Розрахувати дефіцит",
    "knowledge.gainTitle": "Набір ваги без зайвого жиру",
    "knowledge.gainText": "Для набору потрібен профіцит, достатній білок і прогресія навантажень. Контроль талії показує, чи росте м’язова маса, чи калорій уже забагато.",
    "knowledge.gainCta": "Підібрати профіцит",
    "knowledge.nutritionTitle": "Раціон, який реально виконувати",
    "knowledge.nutritionText": "Хороший план харчування не повинен бути ідеальним на папері. Він має збігатися з графіком, бюджетом, кількістю прийомів їжі і продуктами, які людина готова їсти.",
    "knowledge.nutritionCta": "Зібрати раціон",
    "knowledge.healthTitle": "Здоров’я і стоп-сигнали",
    "knowledge.healthText": "Сон, втома, цикл, лібідо, тиск, травлення і аналізи можуть пояснити, чому вага або сила стоять. VitalRise не ставить діагноз, але допомагає зрозуміти, що обговорити з фахівцем.",
    "knowledge.healthCta": "Перевірити маркери",
    "pricing.label": "Тарифи",
    "newsletter.title": "Отримати оновлення про запуск",
    "newsletter.text": "Email для повідомлень про запуск, нові модулі та відкриття оплати.",
    "newsletter.placeholder": "Твій email",
    "newsletter.cta": "Підписатися",
    "pricing.freeCopy": "Для людини, яка хоче без оплати зробити перший розрахунок: 1 день харчування і 1 тренування. Повний тижневий план відкривається у Start.",
    "pricing.startCopy": "Перший платний крок: готовий тиждень харчування, тренувань і звіту без ручного складання з нуля.",
    "pricing.proCopy": "Основний формат для результату: план, контроль, check-in і корекція курсу після накопичення даних.",
    "pricing.premiumCopy": "Для тих, кому потрібна ручна увага, розбір складних ситуацій і підтримка під час виконання плану.",
    "pricing.freeBackLabel": "Для старту",
    "pricing.freeBackTitle": "Що відкриває",
    "pricing.freeBackText": "Дає один безкоштовний розрахунок харчування і один розрахунок тренування. Після цього повторні розрахунки, 7-денний план, PDF і Blueprint відкриває Start.",
    "pricing.startBackLabel": "Перша покупка",
    "pricing.startBackTitle": "Коли обрати Start",
    "pricing.startBackText": "Коли потрібен не просто розрахунок, а готовий тиждень дій: що їсти, як тренуватись і що отримати у PDF.",
    "pricing.proBackLabel": "Основний продукт",
    "pricing.proBackTitle": "Чому Pro",
    "pricing.proBackText": "Pro тримає клієнта в системі 4 тижні: раціон, тренування, check-in, корекція після 14 днів, графіки і Blueprint.",
    "pricing.premiumBackLabel": "Ручна участь",
    "pricing.premiumBackTitle": "Для складних задач",
    "pricing.premiumBackText": "Premium потрібен, коли важлива не тільки система, а й ручний розбір: аналізи, корекція плану і супровід у процесі.",
    "pricing.backPointCalculator": "Калькулятор",
    "pricing.backPointSample": "Приклад раціону",
    "pricing.backPointBase": "База системи",
    "pricing.backPointSevenDays": "7 днів",
    "pricing.backPointHydration": "Гідратація",
    "pricing.backPointPdf": "PDF-звіт",
    "pricing.backPointThirtyDays": "45 днів на старт",
    "pricing.backPointCheckin": "Check-in",
    "pricing.backPointBlueprint": "Blueprint",
    "pricing.backPointSupport": "Супровід",
    "pricing.backPointLabs": "Аналізи",
    "pricing.backPointManual": "Ручна корекція",
    "proof.label": "Кейси",
    "proof.title": "Що має відчути клієнт",
    "proof.case1Title": "Зниження ваги",
    "proof.case1Text": "Помірний дефіцит, кроки, контроль талії і раціон без різких провалів по енергії.",
    "proof.case2Title": "Набір маси",
    "proof.case2Text": "Профіцит, стабільні прийоми їжі, прогресія в залі і контроль, щоб вага не йшла тільки в талію.",
    "proof.case3Title": "Рекомпозиція",
    "proof.case3Text": "Спокійна динаміка: сила, заміри, фото і харчування коригуються після 14-денного контролю.",
    "faq.label": "FAQ",
    "faq.title": "Питання перед стартом",
    "faq.q1": "Як працює ранній доступ?",
    "faq.a1": "Залиш email у формі вище. Ми збережемо його в базі раннього доступу і повідомимо про запуск, нові модулі та відкриття оплати.",
    "faq.q2": "Що можна подивитися безкоштовно?",
    "faq.a2": "Безкоштовно можна один раз зробити розрахунок харчування на день і один раз сформувати тренування. Повний тиждень харчування, тренувань і PDF-звіт — у Start.",
    "faq.q3": "Коли буде доступна оплата?",
    "faq.a3": "Після оплати є 45 днів, щоб почати програму. Коли користувач вводить дані й запускає перший розрахунок, активується 30 днів програми. Автопродовження увімкнене за замовчуванням, але його можна вимкнути перед оплатою.",
    "faq.q4": "Що робити, якщо план не підходить?",
    "faq.a4": "План не повинен бути статичним. Корекція робиться через check-in, 14-денний контроль прогресу, талію, вагу, самопочуття і тренувальну продуктивність.",
    "faq.q5": "Чи потрібні аналізи всім?",
    "faq.a5": "Ні, але якщо є симптоми, фармакологічний контекст, гормональні питання, проблеми з тиском або різкі зміни самопочуття, аналізи допомагають не діяти наосліп.",
    "faq.q6": "VitalRise замінює лікаря?",
    "faq.a6": "Ні. Сайт не ставить діагнози і не призначає лікування. Лабораторні маркери, препарати, гормони й АС/ААС потрібно обговорювати з лікарем.",
    "faq.q7": "Що буде з моїм email?",
    "faq.a7": "Email використовується для раннього доступу, повідомлень про запуск і майбутнього доступу до покупки. Деталі описані в Privacy Policy.",
    "faq.q8": "Чи можна буде повернути оплату?",
    "faq.a8": "Повернення можливе до активації програми, при дубль-оплаті або якщо після успішної оплати доступ не відкрився і технічну проблему не вдалося вирішити. Після активації 30-денної програми повернення не застосовується, але можна скасувати наступне продовження.",
    "policy.label": "Гарантія",
    "policy.title": "Прозорі умови",
    "policy.text": "Якщо доступ не відкрився після успішної оплати, покупка перевіряється вручну і доступ видається повторно на той самий email.",
    "policy.refund": "Повернення коштів можливе до активації 30-денної програми, при помилковій дубль-оплаті або якщо технічна помилка доступу не була вирішена.",
    "payment.stepEmail": "Email",
    "payment.stepPay": "Оплата",
    "payment.stepAccess": "Доступ",
    "pricing.title": "Що залишити безкоштовним, а за що брати оплату",
    "pricing.text": "Рекомендована модель: безкоштовно дати швидку користь і довіру, а платними зробити персоналізацію, довгі плани, контроль прогресу, звіти та експертний супровід.",
    "pricing.freePrice": "0 грн",
    "pricing.freeTitle": "Швидкий старт",
    "pricing.freeItem1": "Калькулятор калорій і БЖВ",
    "pricing.freeItem2": "1 розрахунок денного раціону",
    "pricing.freeItem3": "1 розрахунок тренування",
    "pricing.freeItem4": "Частковий атлас вправ",
    "pricing.freeItem5": "Базовий модуль спортпіту",
    "pricing.freeCta": "Зробити free-розрахунок",
    "pricing.badge": "Оптимально",
    "pricing.startPrice": "499 грн",
    "pricing.startTitle": "План на 7 днів",
    "pricing.startItem1": "7-денний раціон під ціль",
    "pricing.startItem2": "Стабільний раціон + протокол гідратації",
    "nutrition.loadContext": "Контекст навантаження",
    "nutrition.loadStandard": "Стабільний день",
    "nutrition.loadHeavy": "Перед важкою сесією",
    "nutrition.loadHeat": "Підвищене потовиділення",
    "pricing.startItem3": "Базова програма тренувань",
    "pricing.startItem4": "PDF-звіт з планом",
    "pricing.startCta": "Обрати Start",
    "pricing.proPrice": "1 499 грн",
    "pricing.proTitle": "Система на 4 тижні",
    "pricing.proItem1": "30-денний раціон і заміни продуктів",
    "pricing.proItem2": "4-тижнева програма тренувань",
    "pricing.proItem3": "Coach, weekly check-in, графіки",
    "pricing.proItem4": "Розширений Blueprint і аналізи",
    "pricing.proCta": "Обрати Pro",
    "pricing.premiumPrice": "3 500 грн",
    "pricing.premiumTitle": "Персональний супровід",
    "pricing.premiumItem1": "Все з Pro",
    "pricing.premiumItem2": "Ручна корекція плану",
    "pricing.premiumItem3": "Розбір аналізів з рекомендаціями до лікаря",
    "pricing.premiumItem4": "Підтримка в Telegram або узгодженому месенджері протягом місяця",
    "pricing.premiumCta": "Подати заявку"
  });

  Object.assign(translations.uk, {
    activity: "Рівень активності",
    lowActivity: "Низька: до 5 000 кроків/день, без тренувань",
    moderateActivity: "Помірна: 5 000-8 000 кроків або 2-3 легкі тренування/тиждень",
    mediumActivity: "Середня: 8 000-12 000 кроків і 3-4 тренування/тиждень",
    highActivity: "Висока: 12 000+ кроків або 4-5 інтенсивних тренувань/тиждень",
    veryHighActivity: "Дуже висока: фізична робота і 5+ важких тренувань/тиждень",
    activityHint: "Якщо сумніваєшся між двома рівнями, для схуднення обирай нижчий.",
    goal: "Ціль",
    recomp: "Рекомпозиція тіла",
    weightLoss: "Зниження ваги",
    maintain: "Підтримка форми",
    massGain: "Набір маси",
    goalHint: "Рекомпозиція: вага може змінюватися повільно, мета - менше жиру і збереження/набір м'язів. Зниження ваги: головна мета - мінус на вагах через дефіцит калорій із контролем сили й самопочуття."
  });

  Object.assign(translations.en, {
    "labs.heroTitle": "Labs before sharp decisions",
    labLabel: "Laboratory",
    gender: "Sex",
    "labs.heroText": "Labs show whether the body has enough resources for training load, a deficit, or a mass-gain phase, and help catch factors that may slow progress.",
    "labs.heroPanelTitle": "Not a diagnosis, but a map for a doctor conversation",
    "labs.heroPanelText": "VitalRise shows what is worth checking and when not to experiment on your own.",
    labReviewSummaryNote: "Build the Bloodwork Protocol first, then open this block.",
    labReviewGate: "Build the panel in Bloodwork Protocol above. After that, only fields included in the recommended lab list will appear here.",
    femaleContext: "Female context",
    notApplicable: "Not applicable",
    follicularPhase: "Follicular phase",
    lutealPhase: "Luteal phase",
    irregularCycle: "Irregular cycle",
    hormonalContraception: "Hormonal contraception",
    postpartumLactation: "Postpartum / lactation",
    reviewDate: "Lab date",
    fastingCondition: "Collection conditions",
    unknown: "Not specified",
    fasting: "Fasting",
    notFasting: "Not fasting",
    afterHeavyTraining: "After heavy training",
    "supplements.heroLabel": "Supplement Command",
    "supplements.heroTitle": "Supplements only where they make sense",
    "supplements.heroText": "Supplements, enzymes, electrolytes, and digestion support are selected by goal, diet, tolerance, and lab context.",
    "supplements.heroPanelTitle": "Base first, supplements second",
    "supplements.heroPanelText": "Extra carbs and gainers are mostly relevant for mass gain or mild recomposition, not for weight loss.",
    buildBaseStack: "Build a base stack",
    buildStack: "Build stack",
    proteinFromFood: "Protein from food",
    proteinByType: "Protein by type",
    proteinByTypeText: "Beef protein, casein, or hydrolysate are selected by tolerance, timing, and budget.",
    oftenLowProtein: "Often under target",
    almostEnoughProtein: "Almost enough",
    stableEnoughProtein: "Consistently enough",
    fattyFish: "Fatty fish",
    rarely: "Rarely",
    weekly1to2: "1-2 times per week",
    weekly3plus: "3+ times per week",
    vitaminDByLabs: "Vitamin D by labs",
    low: "Low",
    normalRange: "In range",
    fatBurning: "Fat burning",
    sleepRecovery: "Sleep / recovery",
    oftenPoor: "Often poor",
    unstable: "Unstable",
    brainFocus: "Brain / focus",
    notPriority: "Not a priority",
    focusConcentration: "Focus and concentration",
    memoryLearning: "Memory / learning",
    stressTension: "Stress / tension",
    mentalFatigue: "Mental fatigue",
    caffeinePreworkout: "Caffeine / pre-workout",
    stimulantSensitive: "Poor tolerance",
    stimulantNormal: "Normal tolerance",
    avoidStimulants: "Avoid stimulants",
    stressSleepRecovery: "Stress / sleep / recovery",
    strengthMuscleGain: "Strength / muscle gain",
    openReport: "Open report",
    excessFilterText: "Gainers, fat burners, and pre-workouts should be filtered by goal, blood pressure, sleep, and diet.",
    "features.platformLabel": "VitalRise Platform",
    "features.platformTitle": "What VitalRise gives you",
    "features.modulesAria": "VitalRise modules",
    "features.openNutrition": "Open Nutrition module",
    "features.openTraining": "Open Training module",
    "features.openProgress": "Open Progress module",
    "features.openLabs": "Open Labs module",
    "features.openSupplements": "Open Supplements module",
    "features.openRecovery": "Open Recovery module",
    "features.nutritionMeta": "Menu / macros / swaps",
    "features.trainingMeta": "PPL / strength / volume",
    "features.progressMeta": "Check-in / 14 days",
    "features.labsMeta": "Markers / risks",
    "features.supplementsCardTitle": "Supplements",
    "features.supplementsMeta": "Supplements / GI tract",
    "features.recoveryMeta": "Sleep / massage / water",
    footerText: "An athletic system for nutrition, training, supplements, lab control, progress, and the final Blueprint.",
    footerSellerTitle: "Seller and contacts",
    footerSellerInfo: "Sole proprietor Bielashova Marianna Ihorivna, taxpayer ID 3283103940. Registered and actual address: Kyiv, Kharkivske Shose Street, 168D, apt. 51. Phone: +38 (093) 581-06-28. Email: info@vitalrise.com.ua.",
    system: "System",
    important: "Important",
    footerNote: "VitalRise does not diagnose or prescribe treatment. Lab values, hormones, prolactin, thyroid, liver, and kidney markers should be interpreted with a doctor.",
    footerBottom: "High-level control for athletic recomposition.",
    footerLinksAria: "Quick links",
    "nav.home": "Home",
    "vlog.footerText": "The pharmacology knowledge base complements the main VitalRise system and does not replace a doctor.",
    "vlog.footerNote": "VitalRise does not prescribe pharmacology, diagnose, or provide self-treatment protocols. The materials are for education, risk assessment, and preparing the right questions for a specialist.",
    "vlog.footerBottom": "Educational vlog about compounds, risks, and health monitoring.",
    activity: "Activity level",
    lowActivity: "Low: up to 5,000 steps/day, no training",
    moderateActivity: "Moderate: 5,000-8,000 steps or 2-3 light workouts/week",
    mediumActivity: "Medium: 8,000-12,000 steps and 3-4 workouts/week",
    highActivity: "High: 12,000+ steps or 4-5 intense workouts/week",
    veryHighActivity: "Very high: physical job and 5+ hard workouts/week",
    activityHint: "If you are between two levels, choose the lower one for fat loss.",
    goal: "Goal",
    recomp: "Body recomposition",
    weightLoss: "Weight loss",
    maintain: "Maintain shape",
    massGain: "Mass gain",
    goalHint: "Recomposition: scale weight may change slowly; the goal is less fat and preserved or gained muscle. Weight loss: the main goal is a lower scale number through a calorie deficit while monitoring strength and well-being.",
    "nav.knowledge": "Knowledge",
    "nav.pricing": "Pricing",
    "knowledge.label": "Knowledge",
    "knowledge.title": "Short explanations that help clients trust the plan",
    "knowledge.text": "This section answers the common questions before purchase: how fat loss works, why gaining requires waist control, why macros matter, and when health should be viewed beyond body weight.",
    "knowledge.cutTitle": "Fat loss without crashes",
    "knowledge.cutText": "A sustainable calorie deficit should be moderate. Cutting food too aggressively lowers energy, worsens training, and makes adherence fall apart.",
    "knowledge.cutCta": "Calculate deficit",
    "knowledge.gainTitle": "Weight gain without excess fat",
    "knowledge.gainText": "Gaining requires a calorie surplus, enough protein, and load progression. Waist tracking shows whether muscle mass is growing or calories are already too high.",
    "knowledge.gainCta": "Set surplus",
    "knowledge.nutritionTitle": "A diet you can actually follow",
    "knowledge.nutritionText": "A good nutrition plan should not be perfect only on paper. It has to match schedule, budget, meal frequency, and foods the person is willing to eat.",
    "knowledge.nutritionCta": "Build nutrition",
    "knowledge.healthTitle": "Health and stop signals",
    "knowledge.healthText": "Sleep, fatigue, cycle, libido, blood pressure, digestion, and labs can explain why body weight or strength stalls. VitalRise does not diagnose, but helps clarify what to discuss with a specialist.",
    "knowledge.healthCta": "Check markers",
    "pricing.label": "Pricing",
    "newsletter.title": "Get launch updates",
    "newsletter.text": "Email for launch updates, new modules, and payment opening.",
    "newsletter.placeholder": "Your email",
    "newsletter.cta": "Subscribe",
    "pricing.freeCopy": "For someone who wants a first calculation without payment: one nutrition day and one training session. The full weekly plan starts with Start.",
    "pricing.startCopy": "The first paid step: a ready week of nutrition, training, and reporting without building from scratch.",
    "pricing.proCopy": "The main result format: plan, control, check-in, and course correction after enough data is collected.",
    "pricing.premiumCopy": "For those who need manual attention, complex-case review, and support while following the plan.",
    "pricing.freeBackLabel": "For the start",
    "pricing.freeBackTitle": "What it unlocks",
    "pricing.freeBackText": "Includes one free nutrition calculation and one training calculation. Repeat calculations, the 7-day plan, PDF, and Blueprint unlock in Start.",
    "pricing.startBackLabel": "First purchase",
    "pricing.startBackTitle": "When to choose Start",
    "pricing.startBackText": "When you need more than a calculation: a ready week of actions, meals, training, and a PDF report.",
    "pricing.proBackLabel": "Core product",
    "pricing.proBackTitle": "Why Pro",
    "pricing.proBackText": "Pro keeps the client inside the system for 4 weeks: nutrition, training, check-in, correction after 14 days, charts, and Blueprint.",
    "pricing.premiumBackLabel": "Manual support",
    "pricing.premiumBackTitle": "For complex cases",
    "pricing.premiumBackText": "Premium is for situations where the system is not enough: lab review, manual plan correction, and support during execution.",
    "pricing.backPointCalculator": "Calculator",
    "pricing.backPointSample": "Sample meal day",
    "pricing.backPointBase": "System base",
    "pricing.backPointSevenDays": "7 days",
    "pricing.backPointHydration": "Hydration",
    "pricing.backPointPdf": "PDF report",
    "pricing.backPointThirtyDays": "45 days to start",
    "pricing.backPointCheckin": "Check-in",
    "pricing.backPointBlueprint": "Blueprint",
    "pricing.backPointSupport": "Support",
    "pricing.backPointLabs": "Labs",
    "pricing.backPointManual": "Manual correction",
    "proof.label": "Cases",
    "proof.title": "What the client should feel",
    "proof.case1Title": "Weight loss",
    "proof.case1Text": "Moderate deficit, daily steps, waist control, and nutrition without sharp energy crashes.",
    "proof.case2Title": "Mass gain",
    "proof.case2Text": "Surplus, stable meals, gym progression, and control so weight does not go only to the waist.",
    "proof.case3Title": "Recomposition",
    "proof.case3Text": "Calm progress: strength, measurements, photos, and nutrition are corrected after 14-day control.",
    "faq.label": "FAQ",
    "faq.title": "Questions before starting",
    "faq.q1": "How does early access work?",
    "faq.a1": "Leave your email in the form above. We will save it in the early access list and notify you about launch, new modules, and payment opening.",
    "faq.q2": "What can I view for free?",
    "faq.a2": "Free lets you run one daily nutrition calculation and one training calculation. The full week of nutrition, training, and PDF report is in Start.",
    "faq.q3": "When will payment be available?",
    "faq.a3": "After payment, the user has 45 days to start the program. When the user enters data and runs the first calculation, 30 days of active program begin. Auto-renewal is enabled by default but can be turned off before payment.",
    "faq.q4": "What if the plan does not fit?",
    "faq.a4": "The plan should not be static. Adjustments are made through check-ins, 14-day progress control, waist, weight, well-being, and training performance.",
    "faq.q5": "Does everyone need lab tests?",
    "faq.a5": "No, but if there are symptoms, pharmacology context, hormonal questions, blood pressure issues, or sharp changes in well-being, labs help avoid guessing.",
    "faq.q6": "Does VitalRise replace a doctor?",
    "faq.a6": "No. The site does not diagnose or prescribe treatment. Lab markers, drugs, hormones, and AAS should be discussed with a doctor.",
    "faq.q7": "What happens to my email?",
    "faq.a7": "Email is used for early access, launch updates, and future purchase access. Details are described in the Privacy Policy.",
    "faq.q8": "Will refunds be possible?",
    "faq.a8": "A refund is possible before program activation, for duplicate payments, or if access does not open after successful payment and the technical issue cannot be resolved. After the 30-day program is activated, refunds do not apply, but the next renewal can be cancelled.",
    "policy.label": "Guarantee",
    "policy.title": "Clear terms",
    "policy.text": "If access does not open after successful payment, the purchase is checked manually and access is reissued to the same email.",
    "policy.refund": "A refund is possible before the 30-day program is activated, for an accidental duplicate payment, or if the access technical issue is not resolved.",
    "payment.stepEmail": "Email",
    "payment.stepPay": "Payment",
    "payment.stepAccess": "Access",
    "pricing.title": "What stays free and what becomes paid",
    "pricing.text": "The model: give quick value and trust for free, and make personalization, longer plans, progress control, reports, and expert support paid.",
    "pricing.freePrice": "0 UAH",
    "pricing.freeTitle": "Quick start",
    "pricing.freeItem1": "Calorie and macro calculator",
    "pricing.freeItem2": "1 daily nutrition calculation",
    "pricing.freeItem3": "1 training calculation",
    "pricing.freeItem4": "Partial exercise atlas",
    "pricing.freeItem5": "Basic supplements module",
    "pricing.freeCta": "Run free calculation",
    "pricing.badge": "Best value",
    "pricing.startPrice": "499 UAH",
    "pricing.startTitle": "7-day plan",
    "pricing.startItem1": "7-day nutrition plan for the goal",
    "pricing.startItem2": "Stable nutrition + hydration protocol",
    "nutrition.loadContext": "Load context",
    "nutrition.loadStandard": "Stable day",
    "nutrition.loadHeavy": "Before a heavy session",
    "nutrition.loadHeat": "Increased sweating",
    "pricing.startItem3": "Basic training program",
    "pricing.startItem4": "PDF report with the plan",
    "pricing.startCta": "Choose Start",
    "pricing.proPrice": "1,499 UAH",
    "pricing.proTitle": "4-week system",
    "pricing.proItem1": "30-day nutrition and food swaps",
    "pricing.proItem2": "4-week training program",
    "pricing.proItem3": "Coach, weekly check-in, charts",
    "pricing.proItem4": "Extended Blueprint and lab analysis",
    "pricing.proCta": "Choose Pro",
    "pricing.premiumPrice": "3,500 UAH",
    "pricing.premiumTitle": "Personal support",
    "pricing.premiumItem1": "Everything in Pro",
    "pricing.premiumItem2": "Manual plan correction",
    "pricing.premiumItem3": "Lab review with doctor-discussion notes",
    "pricing.premiumItem4": "Support in Telegram or an agreed messenger for one month",
    "pricing.premiumCta": "Apply"
  });

  Object.assign(translations.ru, {
    "labs.heroTitle": "Анализы перед резкими решениями",
    labLabel: "Лаборатория",
    gender: "Пол",
    "labs.heroText": "Анализы показывают, есть ли у организма ресурс для нагрузок, дефицита или набора, и помогают вовремя заметить факторы, которые могут тормозить результат.",
    "labs.heroPanelTitle": "Не диагноз, а карта для разговора с врачом",
    "labs.heroPanelText": "VitalRise показывает, что стоит проверить и когда не нужно экспериментировать самостоятельно.",
    labReviewSummaryNote: "Сначала сформируй Bloodwork Protocol, потом открой этот блок.",
    labReviewGate: "Сформируй панель в Bloodwork Protocol выше. После этого здесь появятся только те поля, которые входят в рекомендованный список анализов.",
    femaleContext: "Женский контекст",
    notApplicable: "Не актуально",
    follicularPhase: "Фолликулярная фаза",
    lutealPhase: "Лютеиновая фаза",
    irregularCycle: "Нерегулярный цикл",
    hormonalContraception: "Гормональная контрацепция",
    postpartumLactation: "После родов / лактация",
    reviewDate: "Дата анализов",
    fastingCondition: "Условия сдачи",
    unknown: "Не указано",
    fasting: "Натощак",
    notFasting: "Не натощак",
    afterHeavyTraining: "После тяжелой тренировки",
    "supplements.heroLabel": "Supplement Command",
    "supplements.heroTitle": "Добавки только там, где есть смысл",
    "supplements.heroText": "Спортпит, ферменты, электролиты и поддержка пищеварения подбираются под цель, рацион, переносимость и лабораторный контекст.",
    "supplements.heroPanelTitle": "Сначала база, потом добавки",
    "supplements.heroPanelText": "Дополнительные углеводы и гейнеры уместны в основном на наборе массы или легкой рекомпозиции, а не на снижении веса.",
    buildBaseStack: "Собрать базовый стек",
    buildStack: "Сформировать стек",
    proteinFromFood: "Белок из еды",
    proteinByType: "Протеин по типу",
    proteinByTypeText: "Говяжий протеин, казеин или гидролизат подбираются по переносимости, времени приема и бюджету.",
    oftenLowProtein: "Часто не добираю",
    almostEnoughProtein: "Почти добираю",
    stableEnoughProtein: "Добираю стабильно",
    fattyFish: "Жирная рыба",
    rarely: "Редко",
    weekly1to2: "1-2 раза в неделю",
    weekly3plus: "3+ раза в неделю",
    vitaminDByLabs: "Витамин D по анализу",
    low: "Низкий",
    normalRange: "В норме",
    fatBurning: "Жиросжигание",
    sleepRecovery: "Сон / восстановление",
    oftenPoor: "Часто плохо",
    unstable: "Нестабильно",
    brainFocus: "Мозг / фокус",
    notPriority: "Не приоритет",
    focusConcentration: "Фокус и концентрация",
    memoryLearning: "Память / обучение",
    stressTension: "Стресс / напряжение",
    mentalFatigue: "Ментальная усталость",
    caffeinePreworkout: "Кофеин / предтрен",
    stimulantSensitive: "Плохо переношу",
    stimulantNormal: "Переношу нормально",
    avoidStimulants: "Не хочу стимуляторы",
    stressSleepRecovery: "Стресс / сон / восстановление",
    strengthMuscleGain: "Сила / набор мышц",
    openReport: "Открыть отчет",
    excessFilterText: "Гейнеры, жиросжигатели и предтрены должны проходить проверку целью, давлением, сном и рационом.",
    "features.platformLabel": "VitalRise Platform",
    "features.platformTitle": "Что дает VitalRise",
    "features.modulesAria": "Модули VitalRise",
    "features.openNutrition": "Открыть модуль Питание",
    "features.openTraining": "Открыть модуль Тренировки",
    "features.openProgress": "Открыть модуль Прогресс",
    "features.openLabs": "Открыть модуль Анализы",
    "features.openSupplements": "Открыть модуль Добавки",
    "features.openRecovery": "Открыть модуль Восстановление",
    "features.nutritionMeta": "Меню / БЖУ / замены",
    "features.trainingMeta": "PPL / сила / объем",
    "features.progressMeta": "Check-in / 14 дней",
    "features.labsMeta": "Маркеры / риски",
    "features.supplementsCardTitle": "Добавки",
    "features.supplementsMeta": "Спортпит / ЖКТ",
    "features.recoveryMeta": "Сон / массаж / вода",
    footerText: "Атлетическая система для питания, тренировок, спортпита, лабораторного контроля, прогресса и финального Blueprint.",
    footerSellerTitle: "Продавец и контакты",
    footerSellerInfo: "ФЛП Белашова Марианна Игоревна, РНУКПН 3283103940. Регистрационный и фактический адрес: г. Киев, ул. Харьковское шоссе, 168Д, кв. 51. Телефон: +38 (093) 581-06-28. Email: info@vitalrise.com.ua.",
    system: "Система",
    important: "Важно",
    footerNote: "VitalRise не ставит диагнозы и не назначает лечение. Лабораторные показатели, гормоны, пролактин, щитовидную железу, печеночные и почечные маркеры нужно трактовать с врачом.",
    footerBottom: "Контроль высокого уровня для атлетической рекомпозиции.",
    footerLinksAria: "Быстрые ссылки",
    "nav.home": "Главная",
    "vlog.footerText": "Фармакологическая база знаний дополняет основную систему VitalRise и не заменяет врача.",
    "vlog.footerNote": "VitalRise не назначает фармакологию, не ставит диагнозы и не дает схемы самолечения. Материалы нужны для образования, оценки рисков и подготовки правильных вопросов специалисту.",
    "vlog.footerBottom": "Образовательный влог о препаратах, рисках и контроле здоровья.",
    activity: "Уровень активности",
    lowActivity: "Низкая: до 5 000 шагов/день, без тренировок",
    moderateActivity: "Умеренная: 5 000-8 000 шагов или 2-3 легкие тренировки/неделю",
    mediumActivity: "Средняя: 8 000-12 000 шагов и 3-4 тренировки/неделю",
    highActivity: "Высокая: 12 000+ шагов или 4-5 интенсивных тренировок/неделю",
    veryHighActivity: "Очень высокая: физическая работа и 5+ тяжелых тренировок/неделю",
    activityHint: "Если сомневаешься между двумя уровнями, для похудения выбирай нижний.",
    goal: "Цель",
    recomp: "Рекомпозиция тела",
    weightLoss: "Снижение веса",
    maintain: "Поддержание формы",
    massGain: "Набор массы",
    goalHint: "Рекомпозиция: вес может меняться медленно, цель - меньше жира и сохранение или набор мышц. Снижение веса: главная цель - минус на весах через дефицит калорий с контролем силы и самочувствия.",
    "nav.knowledge": "База знаний",
    "nav.pricing": "Тарифы",
    "knowledge.label": "База знаний",
    "knowledge.title": "Короткие объяснения, которые помогают клиенту доверять плану",
    "knowledge.text": "Этот блок закрывает типичные вопросы перед покупкой: как работает снижение веса, почему при наборе нужен контроль талии, зачем считать БЖУ и когда стоит смотреть на здоровье шире, чем только на вес.",
    "knowledge.cutTitle": "Снижение веса без срывов",
    "knowledge.cutText": "Устойчивый дефицит калорий должен быть умеренным. Если слишком резко урезать еду, падает энергия, тренировки становятся хуже, а соблюдение плана ломается.",
    "knowledge.cutCta": "Рассчитать дефицит",
    "knowledge.gainTitle": "Набор веса без лишнего жира",
    "knowledge.gainText": "Для набора нужен профицит, достаточный белок и прогрессия нагрузок. Контроль талии показывает, растет ли мышечная масса или калорий уже слишком много.",
    "knowledge.gainCta": "Подобрать профицит",
    "knowledge.nutritionTitle": "Рацион, который реально выполнять",
    "knowledge.nutritionText": "Хороший план питания не должен быть идеальным только на бумаге. Он должен совпадать с графиком, бюджетом, количеством приемов пищи и продуктами, которые человек готов есть.",
    "knowledge.nutritionCta": "Собрать рацион",
    "knowledge.healthTitle": "Здоровье и стоп-сигналы",
    "knowledge.healthText": "Сон, усталость, цикл, либидо, давление, пищеварение и анализы могут объяснить, почему вес или сила стоят. VitalRise не ставит диагноз, но помогает понять, что обсудить со специалистом.",
    "knowledge.healthCta": "Проверить маркеры",
    "pricing.label": "Тарифы",
    "newsletter.title": "Получить обновления о запуске",
    "newsletter.text": "Email для сообщений о запуске, новых модулях и открытии оплаты.",
    "newsletter.placeholder": "Твой email",
    "newsletter.cta": "Подписаться",
    "pricing.freeCopy": "Для человека, который хочет без оплаты сделать первый расчет: 1 день питания и 1 тренировку. Полный недельный план открывается в Start.",
    "pricing.startCopy": "Первый платный шаг: готовая неделя питания, тренировок и отчета без ручной сборки с нуля.",
    "pricing.proCopy": "Основной формат для результата: план, контроль, check-in и коррекция курса после накопления данных.",
    "pricing.premiumCopy": "Для тех, кому нужны ручное внимание, разбор сложных ситуаций и поддержка во время выполнения плана.",
    "pricing.freeBackLabel": "Для старта",
    "pricing.freeBackTitle": "Что открывает",
    "pricing.freeBackText": "Дает один бесплатный расчет питания и один расчет тренировки. После этого повторные расчеты, 7-дневный план, PDF и Blueprint открывает Start.",
    "pricing.startBackLabel": "Первая покупка",
    "pricing.startBackTitle": "Когда выбрать Start",
    "pricing.startBackText": "Когда нужен не просто расчет, а готовая неделя действий: что есть, как тренироваться и что получить в PDF.",
    "pricing.proBackLabel": "Основной продукт",
    "pricing.proBackTitle": "Почему Pro",
    "pricing.proBackText": "Pro держит клиента в системе 4 недели: рацион, тренировки, check-in, коррекция через 14 дней, графики и Blueprint.",
    "pricing.premiumBackLabel": "Ручное участие",
    "pricing.premiumBackTitle": "Для сложных задач",
    "pricing.premiumBackText": "Premium нужен, когда важна не только система, но и ручной разбор: анализы, коррекция плана и сопровождение в процессе.",
    "pricing.backPointCalculator": "Калькулятор",
    "pricing.backPointSample": "Пример рациона",
    "pricing.backPointBase": "База системы",
    "pricing.backPointSevenDays": "7 дней",
    "pricing.backPointHydration": "Гидратация",
    "pricing.backPointPdf": "PDF-отчет",
    "pricing.backPointThirtyDays": "45 дней на старт",
    "pricing.backPointCheckin": "Check-in",
    "pricing.backPointBlueprint": "Blueprint",
    "pricing.backPointSupport": "Сопровождение",
    "pricing.backPointLabs": "Анализы",
    "pricing.backPointManual": "Ручная коррекция",
    "proof.label": "Кейсы",
    "proof.title": "Что должен почувствовать клиент",
    "proof.case1Title": "Снижение веса",
    "proof.case1Text": "Умеренный дефицит, шаги, контроль талии и рацион без резких провалов по энергии.",
    "proof.case2Title": "Набор массы",
    "proof.case2Text": "Профицит, стабильные приемы пищи, прогрессия в зале и контроль, чтобы вес не шел только в талию.",
    "proof.case3Title": "Рекомпозиция",
    "proof.case3Text": "Спокойная динамика: сила, замеры, фото и питание корректируются после 14-дневного контроля.",
    "faq.label": "FAQ",
    "faq.title": "Вопросы перед стартом",
    "faq.q1": "Как работает ранний доступ?",
    "faq.a1": "Оставь email в форме выше. Мы сохраним его в базе раннего доступа и сообщим о запуске, новых модулях и открытии оплаты.",
    "faq.q2": "Что можно посмотреть бесплатно?",
    "faq.a2": "Бесплатно можно один раз сделать расчет питания на день и один раз сформировать тренировку. Полная неделя питания, тренировок и PDF-отчет — в Start.",
    "faq.q3": "Когда будет доступна оплата?",
    "faq.a3": "После оплаты есть 45 дней, чтобы начать программу. Когда пользователь вводит данные и запускает первый расчет, активируются 30 дней программы. Автопродление включено по умолчанию, но его можно выключить перед оплатой.",
    "faq.q4": "Что делать, если план не подходит?",
    "faq.a4": "План не должен быть статичным. Коррекция делается через check-in, 14-дневный контроль прогресса, талию, вес, самочувствие и тренировочную продуктивность.",
    "faq.q5": "Анализы нужны всем?",
    "faq.a5": "Нет, но если есть симптомы, фармакологический контекст, гормональные вопросы, проблемы с давлением или резкие изменения самочувствия, анализы помогают не действовать вслепую.",
    "faq.q6": "VitalRise заменяет врача?",
    "faq.a6": "Нет. Сайт не ставит диагнозы и не назначает лечение. Лабораторные маркеры, препараты, гормоны и АС/ААС нужно обсуждать с врачом.",
    "faq.q7": "Что будет с моим email?",
    "faq.a7": "Email используется для раннего доступа, сообщений о запуске и будущего доступа к покупке. Детали описаны в Privacy Policy.",
    "faq.q8": "Можно будет вернуть оплату?",
    "faq.a8": "Возврат возможен до активации программы, при дубль-оплате или если после успешной оплаты доступ не открылся и техническую проблему не удалось решить. После активации 30-дневной программы возврат не применяется, но можно отменить следующее продление.",
    "policy.label": "Гарантия",
    "policy.title": "Прозрачные условия",
    "policy.text": "Если доступ не открылся после успешной оплаты, покупка проверяется вручную и доступ выдается повторно на тот же email.",
    "policy.refund": "Возврат средств возможен до активации 30-дневной программы, при ошибочной дубль-оплате или если техническая ошибка доступа не была решена.",
    "payment.stepEmail": "Email",
    "payment.stepPay": "Оплата",
    "payment.stepAccess": "Доступ",
    "pricing.title": "Что оставить бесплатным, а за что брать оплату",
    "pricing.text": "Модель: бесплатно дать быструю пользу и доверие, а платными сделать персонализацию, длинные планы, контроль прогресса, отчеты и экспертное сопровождение.",
    "pricing.freePrice": "0 грн",
    "pricing.freeTitle": "Быстрый старт",
    "pricing.freeItem1": "Калькулятор калорий и БЖУ",
    "pricing.freeItem2": "1 расчет дневного рациона",
    "pricing.freeItem3": "1 расчет тренировки",
    "pricing.freeItem4": "Частичный атлас упражнений",
    "pricing.freeItem5": "Базовый модуль спортпита",
    "pricing.freeCta": "Сделать free-расчет",
    "pricing.badge": "Оптимально",
    "pricing.startPrice": "499 грн",
    "pricing.startTitle": "План на 7 дней",
    "pricing.startItem1": "7-дневный рацион под цель",
    "pricing.startItem2": "Стабильный рацион + протокол гидратации",
    "nutrition.loadContext": "Контекст нагрузки",
    "nutrition.loadStandard": "Стабильный день",
    "nutrition.loadHeavy": "Перед тяжелой сессией",
    "nutrition.loadHeat": "Повышенное потоотделение",
    "pricing.startItem3": "Базовая программа тренировок",
    "pricing.startItem4": "PDF-отчет с планом",
    "pricing.startCta": "Выбрать Start",
    "pricing.proPrice": "1 499 грн",
    "pricing.proTitle": "Система на 4 недели",
    "pricing.proItem1": "30-дневный рацион и замены продуктов",
    "pricing.proItem2": "4-недельная программа тренировок",
    "pricing.proItem3": "Coach, weekly check-in, графики",
    "pricing.proItem4": "Расширенный Blueprint и анализы",
    "pricing.proCta": "Выбрать Pro",
    "pricing.premiumPrice": "3 500 грн",
    "pricing.premiumTitle": "Персональное сопровождение",
    "pricing.premiumItem1": "Все из Pro",
    "pricing.premiumItem2": "Ручная коррекция плана",
    "pricing.premiumItem3": "Разбор анализов с рекомендациями к врачу",
    "pricing.premiumItem4": "Поддержка в Telegram или согласованном мессенджере в течение месяца",
    "pricing.premiumCta": "Подать заявку"
  });

  const textNodeKeys = new WeakMap();
  const automaticTextNodeKeys = new WeakMap();
  const placeholderKeys = new WeakMap();
  let isApplyingTranslations = false;
  let mutationTimer = null;

  function getSavedLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      // Storage can be unavailable in private or locked-down browser contexts.
    }
  }

  function getLanguage(language) {
    return supportedLanguages.includes(language) ? language : DEFAULT_LANGUAGE;
  }

  function translate(key, language) {
    const dictionary = translations[language] || translations[DEFAULT_LANGUAGE];
    const automaticEntry = automaticTextTranslations[key];
    return dictionary[key]
      || translations[DEFAULT_LANGUAGE][key]
      || (automaticEntry && automaticEntry[language])
      || (automaticEntry && automaticEntry[DEFAULT_LANGUAGE])
      || "";
  }

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function buildTextTranslationIndex(dictionary) {
    const index = Object.create(null);

    Object.keys(dictionary).forEach(function (key) {
      const item = dictionary[key];
      supportedLanguages.forEach(function (language) {
        const normalizedValue = normalizeText(item[language]);
        if (normalizedValue && !Object.prototype.hasOwnProperty.call(index, normalizedValue)) {
          index[normalizedValue] = key;
        }
      });
    });

    return index;
  }

  const automaticTextIndex = buildTextTranslationIndex(automaticTextTranslations);
  const placeholderTextIndex = buildTextTranslationIndex(placeholderTranslations);
  const scopedTextIndexes = Object.create(null);

  Object.keys(scopedTextTranslations).forEach(function (selector) {
    scopedTextIndexes[selector] = buildTextTranslationIndex(scopedTextTranslations[selector]);
  });

  function getScopedTextKey(value, dictionary, index) {
    const normalizedValue = normalizeText(value);
    if (!normalizedValue) return "";

    if (index && Object.prototype.hasOwnProperty.call(index, normalizedValue)) {
      return index[normalizedValue];
    }

    if (index) return "";

    return Object.keys(dictionary).find(function (key) {
      const item = dictionary[key];
      return supportedLanguages.some(function (language) {
        return normalizeText(item[language]) === normalizedValue;
      });
    });
  }

  function preserveOuterWhitespace(original, value) {
    const leading = original.match(/^\s*/)[0];
    const trailing = original.match(/\s*$/)[0];
    return leading + value + trailing;
  }

  function applyScopedTextTranslations(language) {
    Object.keys(scopedTextTranslations).forEach(function (selector) {
      const root = document.querySelector(selector);
      const dictionary = scopedTextTranslations[selector];
      const index = scopedTextIndexes[selector];
      if (!root || !dictionary) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      let node = walker.nextNode();

      while (node) {
        textNodes.push(node);
        node = walker.nextNode();
      }

      textNodes.forEach(function (textNode) {
        const trimmed = normalizeText(textNode.textContent);
        if (!trimmed) return;

        const key = textNodeKeys.get(textNode) || getScopedTextKey(trimmed, dictionary, index);
        if (!key || !dictionary[key] || !dictionary[key][language]) return;

        textNodeKeys.set(textNode, key);
        textNode.textContent = preserveOuterWhitespace(textNode.textContent, dictionary[key][language]);
      });
    });
  }

  function translateAutomaticText(value, language) {
    const key = getScopedTextKey(value, automaticTextTranslations, automaticTextIndex);
    if (key && automaticTextTranslations[key] && automaticTextTranslations[key][language]) {
      return automaticTextTranslations[key][language];
    }

    const normalized = normalizeText(value);
    const translatePart = function (part) {
      const translated = translateAutomaticText(part, language);
      return translated || part;
    };

    if (normalized.indexOf(" / ") !== -1) {
      const originalParts = normalized.split(" / ");
      const translatedParts = originalParts.map(translatePart);
      if (translatedParts.some(function (part, index) { return part !== originalParts[index]; })) {
        return translatedParts.join(" / ");
      }
    }

    if (normalized.indexOf(" | ") !== -1) {
      const originalParts = normalized.split(" | ");
      const translatedParts = originalParts.map(translatePart);
      if (translatedParts.some(function (part, index) { return part !== originalParts[index]; })) {
        return translatedParts.join(" | ");
      }
    }

    let match = normalized.match(/^Готовність (\d+)%$/) || normalized.match(/^Readiness (\d+)%$/) || normalized.match(/^Готовность (\d+)%$/);
    if (match) {
      return language === "en" ? "Readiness " + match[1] + "%" : language === "ru" ? "Готовность " + match[1] + "%" : "Готовність " + match[1] + "%";
    }

    match = normalized.match(/^(\d+)\/(\d+) дані$/) || normalized.match(/^(\d+)\/(\d+) data$/) || normalized.match(/^(\d+)\/(\d+) данных$/);
    if (match) {
      return language === "en" ? match[1] + "/" + match[2] + " data" : language === "ru" ? match[1] + "/" + match[2] + " данных" : match[1] + "/" + match[2] + " дані";
    }

    match = normalized.match(/^Останні: (.+)$/) || normalized.match(/^Last: (.+)$/) || normalized.match(/^Последние: (.+)$/);
    if (match) {
      return language === "en" ? "Last: " + translatePart(match[1]) : language === "ru" ? "Последние: " + translatePart(match[1]) : "Останні: " + translatePart(match[1]);
    }

    match = normalized.match(/^Аналізи: (.+)$/) || normalized.match(/^Labs: (.+)$/) || normalized.match(/^Анализы: (.+)$/);
    if (match) {
      return language === "en" ? "Labs: " + translatePart(match[1]) : language === "ru" ? "Анализы: " + translatePart(match[1]) : "Аналізи: " + translatePart(match[1]);
    }

    match = normalized.match(/^Структура тренувального плану на (\d+) тиж\.$/) || normalized.match(/^Training plan structure for (\d+) weeks\.$/) || normalized.match(/^Структура тренировочного плана на (\d+) нед\.$/);
    if (match) {
      return language === "en" ? "Training plan structure for " + match[1] + " weeks." : language === "ru" ? "Структура тренировочного плана на " + match[1] + " нед." : "Структура тренувального плану на " + match[1] + " тиж.";
    }

    match = normalized.match(/^Орієнтовне спалювання за тренування: (.+)$/) || normalized.match(/^Estimated burn per workout: (.+)$/) || normalized.match(/^Ориентировочный расход за тренировку: (.+)$/);
    if (match) {
      return language === "en" ? "Estimated burn per workout: " + match[1] : language === "ru" ? "Ориентировочный расход за тренировку: " + match[1] : "Орієнтовне спалювання за тренування: " + match[1];
    }

    match = normalized.match(/^Дата: (.+)$/) || normalized.match(/^Date: (.+)$/);
    if (match) {
      return language === "en" ? "Date: " + match[1] : language === "ru" ? "Дата: " + match[1] : "Дата: " + match[1];
    }

    match = normalized.match(/^Умови: (.+)$/) || normalized.match(/^Conditions: (.+)$/) || normalized.match(/^Условия: (.+)$/);
    if (match) {
      return language === "en" ? "Conditions: " + match[1] : language === "ru" ? "Условия: " + match[1] : "Умови: " + match[1];
    }

    match = normalized.match(/^Сформовано: (.+)$/) || normalized.match(/^Generated: (.+)$/) || normalized.match(/^Сформировано: (.+)$/);
    if (match) {
      return language === "en" ? "Generated: " + match[1] : language === "ru" ? "Сформировано: " + match[1] : "Сформовано: " + match[1];
    }

    match = normalized.match(/^(-?\d+(?:[.,]\d+)?)\s*год$/) || normalized.match(/^(-?\d+(?:[.,]\d+)?)\s*h$/) || normalized.match(/^(-?\d+(?:[.,]\d+)?)\s*ч$/);
    if (match) {
      return language === "en" ? match[1] + " h" : language === "ru" ? match[1] + " ч" : match[1] + " год";
    }

    match = normalized.match(/^(-?\d+(?:[.,]\d+)?)\s*кг$/) || normalized.match(/^(-?\d+(?:[.,]\d+)?)\s*kg$/);
    if (match) {
      return language === "en" ? match[1] + " kg" : match[1] + " кг";
    }

    match = normalized.match(/^(-?\d+(?:[.,]\d+)?)\s*см$/) || normalized.match(/^(-?\d+(?:[.,]\d+)?)\s*cm$/);
    if (match) {
      return language === "en" ? match[1] + " cm" : match[1] + " см";
    }

    match = normalized.match(/^(\d+(?:-\d+)?)\s*підх\.$/) || normalized.match(/^(\d+(?:-\d+)?)\s*sets$/) || normalized.match(/^(\d+(?:-\d+)?)\s*подх\.$/);
    if (match) {
      return language === "en" ? match[1] + " sets" : language === "ru" ? match[1] + " подх." : match[1] + " підх.";
    }

    match = normalized.match(/^щотижня \+(.+) кг$/) || normalized.match(/^weekly \+(.+) kg$/) || normalized.match(/^каждую неделю \+(.+) кг$/);
    if (match) {
      return language === "en" ? "weekly +" + match[1] + " kg" : language === "ru" ? "каждую неделю +" + match[1] + " кг" : "щотижня +" + match[1] + " кг";
    }

    match = normalized.match(/^\+(.+) кг цього тижня$/) || normalized.match(/^\+(.+) kg this week$/) || normalized.match(/^\+(.+) кг на этой неделе$/);
    if (match) {
      return language === "en" ? "+" + match[1] + " kg this week" : language === "ru" ? "+" + match[1] + " кг на этой неделе" : "+" + match[1] + " кг цього тижня";
    }

    match = normalized.match(/^(\d+(?:-\d+)?) сек$/) || normalized.match(/^(\d+(?:-\d+)?) sec$/);
    if (match) {
      return language === "en" ? match[1] + " sec" : match[1] + " сек";
    }

    const titleParts = {
      "вхід у цикл": { en: "cycle entry", ru: "вход в цикл" },
      "помірна прогресія": { en: "moderate progression", ru: "умеренная прогрессия" },
      "робоче посилення": { en: "working intensification", ru: "рабочее усиление" },
      "важкий робочий": { en: "heavy working week", ru: "тяжелая рабочая неделя" },
      "майже піковий": { en: "near peak", ru: "почти пиковая" },
      "контрольний / полегшений": { en: "control / deload", ru: "контрольная / облегченная" },
      "стартовий об’єм": { en: "starting volume", ru: "стартовый объем" },
      "прогресія": { en: "progression", ru: "прогрессия" },
      "підсилення": { en: "intensification", ru: "усиление" },
      "стабілізація": { en: "stabilization", ru: "стабилизация" },
      "адаптація": { en: "adaptation", ru: "адаптация" },
      "більше щільності": { en: "more density", ru: "больше плотности" },
      "контрольний об’єм": { en: "controlled volume", ru: "контрольный объем" },
      "стабільний фініш": { en: "stable finish", ru: "стабильный финиш" },
      "базовий об'єм": { en: "base volume", ru: "базовый объем" },
      "більше повторів": { en: "more reps", ru: "больше повторов" },
      "більше підходів": { en: "more sets", ru: "больше подходов" },
      "щільність і контроль": { en: "density and control", ru: "плотность и контроль" },
      "стабільний старт": { en: "stable start", ru: "стабильный старт" },
      "плавна прогресія": { en: "smooth progression", ru: "плавная прогрессия" },
      "робочий": { en: "working week", ru: "рабочая" },
      "без форсування": { en: "no forcing", ru: "без форсирования" },
      "груди + руки": { en: "chest + arms", ru: "грудь + руки" },
      "ноги": { en: "legs", ru: "ноги" },
      "спина + плечі": { en: "back + shoulders", ru: "спина + плечи" },
      "верх": { en: "upper body", ru: "верх" },
      "низ": { en: "lower body", ru: "низ" },
      "все тіло": { en: "full body", ru: "все тело" },
      "силовий верх": { en: "strength upper body", ru: "силовой верх" },
      "силовий низ": { en: "strength lower body", ru: "силовой низ" },
      "груди": { en: "chest", ru: "грудь" },
      "плечі + руки": { en: "shoulders + arms", ru: "плечи + руки" },
      "спина": { en: "back", ru: "спина" },
      "груди + руки": { en: "chest + arms", ru: "грудь + руки" }
    };

    match = normalized.match(/^Тиждень (\d+) [—-] (.+)$/) || normalized.match(/^Week (\d+) [—-] (.+)$/) || normalized.match(/^Неделя (\d+) [—-] (.+)$/);
    if (match) {
      const part = titleParts[normalizeText(match[2])];
      const translatedPart = part ? part[language] : match[2];
      return language === "en" ? "Week " + match[1] + " - " + translatedPart : language === "ru" ? "Неделя " + match[1] + " - " + translatedPart : "Тиждень " + match[1] + " - " + translatedPart;
    }

    match = normalized.match(/^День (\d+) [—-] (.+)$/) || normalized.match(/^Day (\d+) [—-] (.+)$/) || normalized.match(/^День (\d+) [—-] (.+)$/);
    if (match) {
      const part = titleParts[normalizeText(match[2])];
      const translatedPart = part ? part[language] : match[2];
      return language === "en" ? "Day " + match[1] + " - " + translatedPart : language === "ru" ? "День " + match[1] + " - " + translatedPart : "День " + match[1] + " - " + translatedPart;
    }

    return "";
  }

  function applyAutomaticTextTranslations(language) {
    const roots = [
      document.querySelector(".hero-command-panel"),
      document.querySelector("#dashboard"),
      document.querySelector("#calculator"),
      document.querySelector("#supplements"),
      document.querySelector("#labs"),
      document.querySelector("#coach"),
      document.querySelector("#progress"),
      document.querySelector("#blueprint"),
      document.querySelector(".site-footer"),
      document.querySelector(".mobile-report-modal"),
      document.querySelector(".exercise-atlas-modal")
    ].filter(Boolean);

    roots.forEach(function (root) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      let node = walker.nextNode();

      while (node) {
        textNodes.push(node);
        node = walker.nextNode();
      }

      textNodes.forEach(function (textNode) {
        const trimmed = normalizeText(textNode.textContent);
        if (!trimmed) return;

        const cachedAutomaticText = automaticTextNodeKeys.get(textNode);
        const key = cachedAutomaticText && cachedAutomaticText.value === trimmed
          ? cachedAutomaticText.key
          : getScopedTextKey(trimmed, automaticTextTranslations, automaticTextIndex);
        if (key && automaticTextTranslations[key] && automaticTextTranslations[key][language]) {
          automaticTextNodeKeys.set(textNode, { key: key, value: trimmed });
          textNode.textContent = preserveOuterWhitespace(textNode.textContent, automaticTextTranslations[key][language]);
          return;
        }

        const translated = translateAutomaticText(trimmed, language);
        if (!translated || normalizeText(translated) === trimmed) return;

        textNode.textContent = preserveOuterWhitespace(textNode.textContent, translated);
      });
    });
  }

  function getPlaceholderKey(value) {
    const normalizedValue = normalizeText(value);
    if (Object.prototype.hasOwnProperty.call(placeholderTextIndex, normalizedValue)) {
      return placeholderTextIndex[normalizedValue];
    }

    return "";
  }

  function applyPlaceholderTranslations(language) {
    document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(function (field) {
      const currentValue = field.getAttribute("placeholder");
      const key = placeholderKeys.get(field) || getPlaceholderKey(currentValue);
      if (!key || !placeholderTranslations[key] || !placeholderTranslations[key][language]) return;

      placeholderKeys.set(field, key);
      field.setAttribute("placeholder", placeholderTranslations[key][language]);
    });
  }

  function padDatePart(value) {
    return String(value).padStart(2, "0");
  }

  function parseDateValue(value) {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;

    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3])
    };
  }

  function getDaysInMonth(year, month) {
    if (!year || !month) return 31;
    return new Date(year, month, 0).getDate();
  }

  function getDateYearRange(selectedYear) {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let year = currentYear + 2; year >= currentYear - 10; year -= 1) {
      years.push(year);
    }

    if (selectedYear && !years.includes(selectedYear)) {
      years.push(selectedYear);
      years.sort(function (a, b) { return b - a; });
    }

    return years;
  }

  function setSelectOptions(select, options, selectedValue) {
    const nextValue = selectedValue ? String(selectedValue) : "";
    select.textContent = "";

    options.forEach(function (option) {
      const node = document.createElement("option");
      node.value = option.value;
      node.textContent = option.label;
      select.appendChild(node);
    });

    select.value = nextValue;
    if (nextValue && select.value !== nextValue) select.value = "";
  }

  function createDateSelect(part) {
    const select = document.createElement("select");
    select.dataset.datePart = part;
    select.setAttribute("aria-label", part);
    return select;
  }

  function formatDateValue(year, month, day) {
    if (!year || !month || !day) return "";
    return String(year) + "-" + padDatePart(month) + "-" + padDatePart(day);
  }

  function syncNativeDateFromControl(input) {
    const control = input.nextElementSibling;
    if (!control || !control.classList.contains("localized-date-control")) return;

    const daySelect = control.querySelector('[data-date-part="day"]');
    const monthSelect = control.querySelector('[data-date-part="month"]');
    const yearSelect = control.querySelector('[data-date-part="year"]');
    const year = Number(yearSelect.value);
    const month = Number(monthSelect.value);
    let day = Number(daySelect.value);
    const maxDay = getDaysInMonth(year, month);

    if (day > maxDay) {
      day = maxDay;
      daySelect.value = String(maxDay);
    }

    const previousValue = input.value;
    input.value = formatDateValue(year, month, day);
    if (!input.value && !previousValue) return;

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function syncControlFromNativeDate(input, language) {
    const control = input.nextElementSibling;
    if (!control || !control.classList.contains("localized-date-control")) return;

    const currentLanguage = getLanguage(language);
    const parsed = parseDateValue(input.value);
    const selectedYear = parsed ? parsed.year : null;
    const selectedMonth = parsed ? parsed.month : null;
    const selectedDay = parsed ? parsed.day : null;
    const daySelect = control.querySelector('[data-date-part="day"]');
    const monthSelect = control.querySelector('[data-date-part="month"]');
    const yearSelect = control.querySelector('[data-date-part="year"]');
    const maxDay = getDaysInMonth(selectedYear, selectedMonth);
    const dayOptions = [{ value: "", label: dateSelectPlaceholders.day[currentLanguage] }];
    const monthOptions = [{ value: "", label: dateSelectPlaceholders.month[currentLanguage] }];
    const yearOptions = [{ value: "", label: dateSelectPlaceholders.year[currentLanguage] }];

    daySelect.setAttribute("aria-label", dateSelectPlaceholders.day[currentLanguage]);
    monthSelect.setAttribute("aria-label", dateSelectPlaceholders.month[currentLanguage]);
    yearSelect.setAttribute("aria-label", dateSelectPlaceholders.year[currentLanguage]);

    for (let day = 1; day <= maxDay; day += 1) {
      dayOptions.push({ value: String(day), label: String(day) });
    }

    monthTranslations[currentLanguage].forEach(function (month, index) {
      monthOptions.push({ value: String(index + 1), label: month });
    });

    getDateYearRange(selectedYear).forEach(function (year) {
      yearOptions.push({ value: String(year), label: String(year) });
    });

    setSelectOptions(daySelect, dayOptions, selectedDay);
    setSelectOptions(monthSelect, monthOptions, selectedMonth);
    setSelectOptions(yearSelect, yearOptions, selectedYear);
  }

  function enhanceDateInputs(language) {
    document.querySelectorAll('input[type="date"]').forEach(function (input) {
      if (input.dataset.dateEnhanced === "true") return;

      const control = document.createElement("div");
      control.className = "localized-date-control";
      control.appendChild(createDateSelect("day"));
      control.appendChild(createDateSelect("month"));
      control.appendChild(createDateSelect("year"));

      input.dataset.dateEnhanced = "true";
      input.classList.add("native-date-input-hidden");
      input.setAttribute("aria-hidden", "true");
      input.setAttribute("tabindex", "-1");
      input.insertAdjacentElement("afterend", control);

      control.addEventListener("change", function () {
        syncNativeDateFromControl(input);
      });

      input.addEventListener("change", function () {
        syncControlFromNativeDate(input, getLanguage(getSavedLanguage() || document.documentElement.lang));
      });
    });

    syncLocalizedDateControls(language);
  }

  function syncLocalizedDateControls(language) {
    const currentLanguage = getLanguage(language);

    document.querySelectorAll('input[type="date"][data-date-enhanced="true"]').forEach(function (input) {
      input.setAttribute("lang", currentLanguage);
      const control = input.nextElementSibling;
      if (control && control.classList.contains("localized-date-control")) {
        control.setAttribute("lang", currentLanguage);
        control.querySelectorAll("select").forEach(function (select) {
          select.setAttribute("lang", currentLanguage);
        });
      }
      syncControlFromNativeDate(input, currentLanguage);
    });
  }

  function applyTranslations(language) {
    const currentLanguage = getLanguage(language);
    const title = translate("metaTitle", currentLanguage);
    const description = translate("metaDescription", currentLanguage);
    const descriptionNode = document.querySelector('meta[name="description"]');
    const shouldUpdateGlobalMeta = !document.querySelector(".module-page-main, .vlog-main, [data-legal-page]");

    isApplyingTranslations = true;
    document.documentElement.lang = currentLanguage;
    document.body.dataset.language = currentLanguage;
    if (shouldUpdateGlobalMeta && title) document.title = title;
    if (shouldUpdateGlobalMeta && descriptionNode && description) descriptionNode.setAttribute("content", description);

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      const value = translate(node.dataset.i18n, currentLanguage);
      if (value) node.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      const value = translate(node.dataset.i18nPlaceholder, currentLanguage);
      if (value) node.setAttribute("placeholder", value);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (node) {
      const value = translate(node.dataset.i18nAriaLabel, currentLanguage);
      if (value) node.setAttribute("aria-label", value);
    });

    applyScopedTextTranslations(currentLanguage);
    applyAutomaticTextTranslations(currentLanguage);
    applyPlaceholderTranslations(currentLanguage);

    document.querySelectorAll('input[type="date"], select').forEach(function (field) {
      field.setAttribute("lang", currentLanguage);
    });

    enhanceDateInputs(currentLanguage);
    syncLocalizedDateControls(currentLanguage);

    document.querySelectorAll("[data-lang-switch]").forEach(function (button) {
      const isActive = button.dataset.langSwitch === currentLanguage;
      button.setAttribute("aria-pressed", String(isActive));
    });

    window.setTimeout(function () {
      isApplyingTranslations = false;
    }, 0);
  }

  function setLanguage(language) {
    const nextLanguage = getLanguage(language);
    saveLanguage(nextLanguage);
    applyTranslations(nextLanguage);
  }

  function initLanguageSwitcher() {
    const language = getLanguage(getSavedLanguage() || document.documentElement.lang);
    applyTranslations(language);

    const observer = new MutationObserver(function (mutations) {
      if (isApplyingTranslations) return;
      const shouldApply = mutations.some(function (mutation) {
        return (mutation.type === "childList" && mutation.addedNodes.length) || mutation.type === "characterData";
      });
      if (!shouldApply) return;

      window.clearTimeout(mutationTimer);
      mutationTimer = window.setTimeout(function () {
        applyTranslations(getLanguage(getSavedLanguage() || document.documentElement.lang));
      }, 100);
    });

    observer.observe(document.body, {
      characterData: true,
      childList: true,
      subtree: true
    });

    document.addEventListener("click", function (event) {
      const button = event.target.closest("[data-lang-switch]");
      if (!button) return;
      setLanguage(button.dataset.langSwitch);
    });
  }

  window.VitalRiseI18n = {
    setLanguage: setLanguage,
    apply: function () {
      applyTranslations(getLanguage(getSavedLanguage() || document.documentElement.lang));
    },
    getLanguage: function () {
      return getLanguage(getSavedLanguage() || document.documentElement.lang);
    },
    translateText: function (value) {
      return translateAutomaticText(value, getLanguage(getSavedLanguage() || document.documentElement.lang)) || value;
    },
    t: function (key) {
      return translate(key, getLanguage(getSavedLanguage() || DEFAULT_LANGUAGE));
    },
    languages: supportedLanguages.slice()
  };

  document.addEventListener("DOMContentLoaded", initLanguageSwitcher);
})();
