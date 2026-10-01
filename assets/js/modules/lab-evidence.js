(function () {
  const system = window.VitalRiseSystem || {};
  const reviewedAt = "2026-10-01";
  const sources = {
    preparation: {title: "MedlinePlus — Preparing for a lab test", url: "https://medlineplus.gov/lab-tests/how-to-prepare-for-a-lab-test/"},
    fasting: {title: "MedlinePlus — Fasting for a blood test", url: "https://medlineplus.gov/lab-tests/fasting-for-a-blood-test/"},
    sampling: {title: "EFLM–COLABIOCLI — Venous blood sampling", url: "https://cms.ifcc.org/media/477460/cclm_-joint_eflm-colabiocli_rec-for-venous-blood-sampling.pdf"},
    interpretation: {title: "MedlinePlus — Understanding lab results", url: "https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/"},
    psa: {title: "NHS — PSA test", url: "https://www.nhs.uk/tests-and-treatments/psa-test/"},
    prolactin: {title: "NHS Gloucestershire — Prolactin", url: "https://www.gloshospitals.nhs.uk/our-services/services-we-offer/pathology/tests-and-investigations/prolactin/"},
    glucose: {title: "NIDDK — Diabetes tests and diagnosis", url: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis"},
    kidney: {title: "National Kidney Foundation — eGFR", url: "https://www.kidney.org/kidney-failure-risk-factor-estimated-glomerular-filtration-rate-egfr"},
    ferritin: {title: "MedlinePlus — Ferritin blood test", url: "https://medlineplus.gov/lab-tests/ferritin-blood-test/"},
    liver: {title: "MedlinePlus — Liver function tests", url: "https://medlineplus.gov/lab-tests/liver-function-tests/"},
    thyroid: {title: "MedlinePlus — TSH test", url: "https://www.medlineplus.gov/lab-tests/tsh-thyroid-stimulating-hormone-test/"},
    lipids: {title: "MedlinePlus — Cholesterol", url: "https://medlineplus.gov/cholesterol.html"},
    testosterone: {title: "Endocrine Society — Testosterone testing (2026)", url: "https://www.endocrine.org/news-and-advocacy/news-room/2026/statement-on-testosterone-replacement-therapy"}
  };
  function local(uk, en, ru) {
    const lang = window.VitalRiseI18n && window.VitalRiseI18n.getLanguage ? window.VitalRiseI18n.getLanguage() : "uk";
    return ({uk:uk,en:en,ru:ru})[lang] || uk;
  }
  function escape(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch];
    });
  }
  function link(key) {
    const source = sources[key] || sources.interpretation;
    return '<a href="' + source.url + '" target="_blank" rel="noopener noreferrer">' + escape(source.title) + '</a>';
  }
  function preparationItems() {
    return [
      {id:"exercise", source:"sampling", title:local("Тренування", "Exercise", "Тренировки"), text:local(
        "EFLM радить уникати інтенсивних навантажень щонайменше 24 години. Пауза 40–45 годин може бути обраним запасом для планового контролю, але не гарантує відновлення всіх маркерів. Після незвично важкої сесії строк узгодь із лабораторією; для ПСА — 48 годин.",
        "EFLM advises avoiding intense exercise for at least 24 hours. A 40–45-hour buffer does not guarantee all markers have recovered. Ask the lab after unusually hard sessions; PSA requires 48 hours.",
        "EFLM рекомендует не тренироваться интенсивно минимум 24 часа. Пауза 40–45 часов не гарантирует восстановления всех маркеров. После необычно тяжёлой нагрузки уточни срок в лаборатории; для ПСА — 48 часов.")},
      {id:"sex", source:"psa", title:local("Секс та еякуляція", "Sex and ejaculation", "Секс и эякуляция"), text:local(
        "Загальної вимоги утримуватися 15–20 годин для всіх аналізів немає. Перед ПСА — без еякуляції 48 годин. Для пролактину уточни обмеження сексуальної активності та стимуляції грудей у лабораторії.",
        "There is no universal 15–20-hour rule. Avoid ejaculation for 48 hours before PSA testing. Ask the lab about sexual activity and breast stimulation before prolactin testing.",
        "Общего правила 15–20 часов для всех анализов нет. Перед ПСА — без эякуляции 48 часов. Для пролактина уточни ограничения сексуальной активности и стимуляции груди.")},
      {id:"fasting", source:"fasting", title:local("Натще — коли потрібно", "Fast when required", "Натощак — когда требуется"), text:local(
        "Якщо призначено аналіз натще: зазвичай 8–12 годин без їжі, лише звичайна вода. Точний час визначає лабораторія. HbA1c не потребує голодування. При діабеті або вагітності підготовку узгодь окремо.",
        "When fasting is required, it is usually 8–12 hours with plain water only. Follow the lab's timing. HbA1c does not require fasting. Arrange individual instructions for diabetes or pregnancy.",
        "Если анализ натощак: обычно 8–12 часов без еды, только обычная вода. Следуй срокам лаборатории. Для HbA1c голодание не нужно. При диабете или беременности согласуй подготовку отдельно.")},
      {id:"sleep", source:"preparation", title:local("Звичний повноцінний сон", "Your usual full night's sleep", "Привычный полноценный сон"), text:local(
        "Заплануй звичну ніч сну. Повідом про недосип, нічну зміну чи гострий стрес, особливо при гормональних дослідженнях. Сам по собі недосип не є причиною відкладати терміновий аналіз.",
        "Plan a normal night's sleep. Report sleep loss, night shifts or acute stress, especially for hormone tests. Do not delay urgent testing because you slept poorly.",
        "Запланируй привычный ночной сон. Сообщи о недосыпе, ночной смене или стрессе, особенно при гормональных анализах. Не откладывай срочный анализ из-за недосыпа.")},
      {id:"water", source:"fasting", title:local("Вода", "Water", "Вода"), text:local(
        "Можна випити склянку звичайної води, якщо немає обмеження рідини від лікаря. Не замінюй її кавою, чаєм або солодким напоєм; примусово пити багато води не потрібно.",
        "A glass of plain water is fine unless your clinician restricts fluids. Avoid coffee, tea and sugary drinks while fasting; do not force excessive water intake.",
        "Можно выпить стакан обычной воды, если врач не ограничил жидкость. Не заменяй её кофе, чаем или сладким напитком; пить много воды через силу не нужно.")},
      {id:"waking", source:"prolactin", title:local("Час після пробудження", "Time after waking", "Время после пробуждения"), text:local(
        "Для пролактину NHS Gloucestershire радить щонайменше 1 годину після пробудження, до їжі. Це не універсальна затримка для всіх тестів: для кортизолу та інших гормонів дотримуйся призначеного часу.",
        "For prolactin, NHS Gloucestershire recommends at least 1 hour after waking, before eating. Other tests have different timing; follow the specified time for cortisol and other hormones.",
        "Для пролактина NHS Gloucestershire рекомендует минимум 1 час после пробуждения, до еды. Это не правило для всех тестов: для кортизола и других гормонов соблюдай назначенное время.")},
      {id:"nicotine", source:"sampling", title:local("Нікотин і спокій перед забором", "Nicotine and rest before sampling", "Никотин и отдых перед забором"), text:local(
        "Не кури вранці перед забором. Щодо вейпів, нікотинових пакетиків і замісної терапії уточни інструкцію лабораторії; призначену терапію самостійно не змінюй. Перед забором спокійно посиди 15 хвилин.",
        "Do not smoke that morning. Ask the lab about vaping, nicotine pouches and replacement therapy; do not change prescribed treatment yourself. Sit quietly for 15 minutes before sampling.",
        "Не кури утром перед забором. Уточни правила для вейпов, никотиновых пакетиков и заместительной терапии; назначенную терапию не меняй самостоятельно. Посиди спокойно 15 минут.")},
      {id:"alcohol", source:"sampling", title:local("Алкоголь", "Alcohol", "Алкоголь"), text:local(
        "EFLM рекомендує щонайменше 24 години без алкоголю; окремі тести потребують довшої паузи. Якщо алкоголь був навіть 2 доби тому, повідом кількість і час. 48 годин не гарантують відсутності впливу; перенесення планового забору узгодь із лікарем.",
        "EFLM recommends at least 24 hours without alcohol; some tests need longer. Report the amount and timing even if it was 2 days ago. 48 hours does not guarantee no effect; ask whether routine testing should be rescheduled.",
        "EFLM рекомендует минимум 24 часа без алкоголя; некоторым тестам нужна большая пауза. Сообщи количество и время, даже если прошло 2 суток. 48 часов не гарантируют отсутствия влияния; перенос согласуй с врачом.")},
      {id:"injections", source:"preparation", title:local("Ліки, ін’єкції та пептиди", "Medicines, injections and peptides", "Лекарства, инъекции и пептиды"), text:local(
        "Повідом назви, дози й час останнього прийому або уколу, включно з пептидами, гормонами та добавками. Не починай нові необов’язкові засоби перед плановим контролем. Призначені ліки, інсулін чи ін’єкції не скасовуй і не перенось самостійно: час забору узгоджує лікар.",
        "Report names, doses and last use, including peptides, hormones and supplements. Avoid starting new optional products before routine testing. Never stop or reschedule prescribed medicines, insulin or injections yourself; agree sampling timing with your clinician.",
        "Сообщи названия, дозы и время последнего приёма или укола, включая пептиды, гормоны и добавки. Не начинай новые необязательные средства перед контролем. Не отменяй и не переноси назначенные лекарства, инсулин или инъекции самостоятельно.")}
    ];
  }
  const rules = [
    {match:/Феритин/, source:"ferritin", text:["Феритин оцінює запаси заліза, але може підвищуватися при запаленні. Оцінюй його разом із ЗАК, симптомами й контекстом CRP; не призначай собі залізо лише за однією цифрою.","Ferritin reflects iron stores but can rise with inflammation. Interpret it with the blood count, symptoms and CRP context; one value does not justify self-prescribing iron.","Ферритин отражает запасы железа, но может повышаться при воспалении. Учитывай ОАК, симптомы и CRP; не назначай себе железо по одной цифре."]},
    {match:/Глюкоза|HbA1c|Інсулін/, source:"glucose", text:["Пороги глюкози натще застосовні лише до забору натще. HbA1c відображає триваліший період і не потребує голодування. Діагноз зазвичай підтверджують повторним тестом; ізольований інсулін не встановлює інсулінорезистентність.","Fasting glucose thresholds require a fasting sample. HbA1c reflects a longer period and does not require fasting. Diagnosis usually needs confirmation; insulin alone does not establish insulin resistance.","Пороги глюкозы натощак применимы только натощак. HbA1c отражает длительный период и не требует голодания. Диагноз обычно подтверждают повторно; один инсулин не доказывает инсулинорезистентность."]},
    {match:/Креатинін|eGFR|Сечовина/, source:"kidney", text:["Один результат eGFR не встановлює хронічну хворобу нирок: важливі стійкість змін щонайменше 3 місяці та/або інші ознаки ураження, зокрема альбумін у сечі. Різке погіршення потребує швидкої оцінки, а не очікування 3 місяців.","A single eGFR does not diagnose chronic kidney disease; persistence for at least 3 months and/or other damage markers such as urine albumin matter. A sudden decline needs prompt assessment, not a 3-month wait.","Один eGFR не устанавливает хроническую болезнь почек: важны стойкость изменений не менее 3 месяцев и/или признаки повреждения, например альбумин мочи. Резкое ухудшение требует быстрой оценки."]},
    {match:/ALT|AST|GGT|Білірубін/, source:"liver", text:["Печінкові маркери оцінюють разом: ізольоване відхилення не визначає причину. Повідом про алкоголь, ліки й недавні навантаження; не списуй значне відхилення лише на тренування.","Liver markers need joint interpretation: an isolated abnormality does not identify the cause. Report alcohol, medicines and recent exercise; do not assume exercise explains a marked abnormality.","Печёночные маркеры оценивают вместе: отдельное отклонение не определяет причину. Сообщи об алкоголе, лекарствах и нагрузках; не списывай выраженное отклонение только на тренировку."]},
    {match:/TSH|Вільний T[34]|Anti-TPO/, source:"thyroid", text:["TSH оцінюють разом із вільним T4, симптомами та лікуванням. За одним TSH не можна встановити причину порушення; дози гормонів самостійно не змінюй.","Interpret TSH with free T4, symptoms and treatment. TSH alone does not establish the cause; do not change hormone doses yourself.","TSH оценивают с T4, симптомами и лечением. Один TSH не определяет причину; дозировки гормонов самостоятельно не меняй."]},
    {match:/холестерин|LDL|HDL|Тригліцериди/i, source:"lipids", text:["Ціль LDL залежить від загального серцево-судинного ризику. Обговори харчування, регулярну активність, куріння та потребу в лікуванні; «спортивна норма» не замінює індивідуальну оцінку ризику.","LDL goals depend on cardiovascular risk. Discuss diet, regular activity, smoking and whether medication is needed; an athletic target cannot replace individual risk assessment.","Цель LDL зависит от сердечно-сосудистого риска. Обсуди питание, активность, курение и необходимость лечения; спортивный ориентир не заменяет оценку риска."]},
    {match:/Пролактин/, source:"prolactin", text:["Пролактин залежить від сну, стресу, навантаження й ліків. За підвищення лікар може призначити повтор у стандартизованих умовах та перевірку макропролактину.","Sleep, stress, exercise and medicines can affect prolactin. Elevated results may require a standardized repeat and macroprolactin assessment.","Пролактин зависит от сна, стресса, нагрузки и лекарств. При повышении врач может назначить повтор в стандартных условиях и проверку макропролактина."]},
    {match:/ПСА/, source:"psa", text:["Підвищений ПСА не дорівнює діагнозу раку. Перед повтором врахуй інфекцію, процедури й підготовку; подальший крок визначають із лікарем.","Raised PSA is not a cancer diagnosis. Review infection, procedures and preparation before repeat testing; agree follow-up with your clinician.","Повышенный ПСА не равен диагнозу рака. Учитывай инфекции, процедуры и подготовку; дальнейшие шаги согласуй с врачом."]},
    {match:/Тестостерон|Вільний тестостерон/i, source:"testosterone", maleOnly:true, text:["У чоловіків низький тестостерон підтверджують щонайменше двома ранковими вимірюваннями натще разом із симптомами. Один низький результат не є підставою для гормонів чи пептидів.","In men, low testosterone needs at least two early-morning fasting measurements together with symptoms. One low result does not justify hormones or peptides.","У мужчин низкий тестостерон подтверждают минимум двумя утренними измерениями натощак вместе с симптомами. Одна цифра не является основанием для гормонов или пептидов."]}
  ];
  function matchingRules(markers, sex) {
    return rules.filter(function (rule) { return (!rule.maleOnly || sex === "male") && markers.some(function (marker) { return rule.match.test(marker); }); });
  }
  function renderPreparation() {
    return '<section class="lab-report-section lab-preparation-guide"><h3>' + local("Підготовка до здачі крові", "Preparing for a blood test", "Подготовка к сдаче крови") + '</h3><p class="result-note">' + local("Для планових аналізів. Інструкція твоєї лабораторії та лікаря має пріоритет. Термінові дослідження не відкладай заради підготовки.", "For routine testing. Follow your lab and clinician's specific instructions. Do not postpone urgent tests to meet preparation rules.", "Для плановых анализов. Инструкции лаборатории и врача приоритетны. Не откладывай срочные исследования ради подготовки.") + '</p><div class="lab-findings-grid">' + preparationItems().map(function (item) {
      return '<article class="lab-finding" data-preparation="' + item.id + '"><h4>' + escape(item.title) + '</h4><p>' + escape(item.text) + '</p><small>' + link(item.source) + '</small></article>';
    }).join('') + '</div></section>';
  }
  function renderReview(review) {
    if (!review.enteredCount) return "";
    const markers = (review.findings || []).map(function (item) { return item.marker; });
    const relevant = matchingRules(markers, review.sex);
    const context = review.fasting !== "fasting" && markers.some(function (marker) { return /Глюкоза|Інсулін/.test(marker); })
      ? '<div class="tip-item">' + local("Умови натще не підтверджені. Не застосовуй пороги глюкози або інсуліну натще до цього забору; уточни інтерпретацію й потребу повтору.", "Fasting is not confirmed. Do not apply fasting glucose or insulin thresholds to this sample; clarify interpretation and whether a repeat is needed.", "Условия натощак не подтверждены. Не применяй пороги глюкозы или инсулина натощак; уточни интерпретацию и необходимость повтора.") + '</div>' : '';
    return '<section class="lab-report-section lab-evidence-report"><h3>' + local("Що означають результати: обґрунтування", "What the results mean: evidence", "Что означают результаты: обоснование") + '</h3><p class="result-note">' + local("Оцінка за введеними числами є орієнтовною. Звір одиниці й референси саме свого бланка. Посилання нижче пояснюють контекст показників, а не встановлюють діагноз або універсальні спортивні норми.", "This is a preliminary review of the values entered. Check units and your lab's reference ranges. Sources below explain context, not diagnoses or universal athletic targets.", "Оценка введённых чисел ориентировочная. Сверь единицы и референсы своего бланка. Источники объясняют контекст, а не устанавливают диагноз или спортивные нормы.") + ' ' + link('interpretation') + '</p>' + context + '<div class="lab-findings-grid">' + relevant.map(function (rule) {
      return '<article class="lab-finding"><p>' + escape(local.apply(null, rule.text)) + '</p><small>' + link(rule.source) + '</small></article>';
    }).join('') + '</div><small>' + local("Джерела перевірено: ", "Sources checked: ", "Источники проверены: ") + reviewedAt + '</small></section>';
  }
  system.labEvidence = {reviewedAt:reviewedAt, sources:sources, preparationItems:preparationItems, matchingRules:matchingRules, renderPreparation:renderPreparation, renderReview:renderReview};
  window.VitalRiseSystem = system;
})();
