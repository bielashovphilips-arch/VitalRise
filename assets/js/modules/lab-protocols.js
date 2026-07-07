(function () {
  const system = window.VitalRiseSystem || {};
  const $ = system.$ || function (id) { return document.getElementById(id); };

  const labForm = $("lab-form");
  const labResult = $("lab-result");
  const labReset = $("lab-reset");
  const labReviewForm = $("lab-review-form");
  const labReviewResult = $("lab-review-result");
  const labReviewReset = $("lab-review-reset");
  const labReviewPanel = $("lab-review-panel");
  const labReviewGate = $("lab-review-gate");
  const labReviewExportActions = $("lab-review-export-actions");
  const labReviewSummaryNote = $("lab-review-summary-note");
  let activeLabProtocol = null;

  const baseReviewFieldIds = ["review-sex", "review-age", "review-cycle", "review-date", "review-fasting"];
  const markerFieldMap = {
    "Загальний аналіз крові": ["review-hemoglobin", "review-leukocytes", "review-platelets"],
    "Феритин": ["review-ferritin"],
    "Сироваткове залізо": ["review-iron"],
    "B12": ["review-b12"],
    "Фолат": ["review-folate"],
    "25(OH)D": ["review-vitamin-d"],
    "CRP": ["review-crp"],
    "Глюкоза натще": ["review-glucose"],
    "Інсулін натще": ["review-insulin"],
    "HbA1c": ["review-hba1c"],
    "Ліпідограма": ["review-total-cholesterol", "review-ldl", "review-hdl", "review-triglycerides"],
    "ALT": ["review-alt"],
    "AST": ["review-ast"],
    "GGT": ["review-ggt"],
    "Білірубін": ["review-bilirubin"],
    "Креатинін": ["review-creatinine"],
    "eGFR": ["review-egfr"],
    "Сечовина": ["review-urea"],
    "Натрій": ["review-sodium"],
    "Калій": ["review-potassium"],
    "Магній": ["review-magnesium"],
    "TSH": ["review-tsh"],
    "Вільний T4": ["review-free-t4"],
    "Вільний T3": ["review-free-t3"],
    "Anti-TPO за показами": ["review-anti-tpo"],
    "Загальний тестостерон": ["review-testosterone"],
    "Вільний тестостерон або розрахунок": ["review-free-testosterone"],
    "Вільний тестостерон або індекс": ["review-free-testosterone"],
    "SHBG": ["review-shbg"],
    "LH": ["review-lh"],
    "FSH": ["review-fsh"],
    "Естрадіол": ["review-estradiol"],
    "Прогестерон": ["review-progesterone"],
    "Пролактин": ["review-prolactin"],
    "ПСА загальний": ["review-psa"],
    "DHEA-S": ["review-dhea-s"],
    "Креатинкіназа за показами": ["review-ck"],
    "Кортизол за показами": ["review-cortisol"],
    "Загальний білок": ["review-total-protein"],
    "Альбумін": ["review-albumin"]
  };

  function getRecommendedReviewFieldIds(protocol) {
    const ids = new Set();
    if (!protocol || !protocol.groups) return ids;

    protocol.groups.forEach(function (group) {
      (group.markers || []).forEach(function (marker) {
        (markerFieldMap[marker] || []).forEach(function (id) {
          ids.add(id);
        });
      });
    });

    return ids;
  }

  function setReviewGateState(protocol) {
    const hasProtocol = !!protocol;
    const recommendedIds = getRecommendedReviewFieldIds(protocol);

    if (labReviewForm) {
      labReviewForm.hidden = !hasProtocol;

      Array.prototype.forEach.call(labReviewForm.querySelectorAll("input, select"), function (field) {
        const group = field.closest(".form-group");
        if (!group) return;

        const isBase = baseReviewFieldIds.includes(field.id);
        const isRecommended = recommendedIds.has(field.id);
        const shouldShow = hasProtocol && (isBase || isRecommended);

        group.dataset.labReviewVisible = shouldShow ? "true" : "false";
        group.style.display = shouldShow ? "flex" : "none";

        if (!shouldShow && !isBase) {
          field.value = "";
        }
      });
    }

    if (labReviewGate) {
      labReviewGate.hidden = hasProtocol;
    }

    if (labReviewExportActions) {
      labReviewExportActions.hidden = true;
    }

    if (labReviewSummaryNote) {
      labReviewSummaryNote.textContent = hasProtocol
        ? "Показано тільки маркери з рекомендованої панелі: " + recommendedIds.size + " полів."
        : "Спочатку сформуй Bloodwork Protocol, потім відкрий цей блок.";
    }

    if (hasProtocol) {
      const reviewSexField = $("review-sex");
      if (reviewSexField) reviewSexField.value = protocol.sex || "male";
      const reviewAgeField = $("review-age");
      if (reviewAgeField) reviewAgeField.value = protocol.age || 30;
    }

    syncReviewFemaleFieldsFromModule();
  }

  function syncReviewFemaleFieldsFromModule() {
    const reviewSexField = $("review-sex");
    if (reviewSexField) {
      reviewSexField.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
  function createLabGroup(title, tag, markers, note) {
    return {
      title: title,
      tag: tag,
      markers: markers,
      note: note
    };
  }

  function translateLabText(value) {
    if (window.VitalRiseI18n && typeof window.VitalRiseI18n.translateText === "function") {
      return window.VitalRiseI18n.translateText(value);
    }
    return value;
  }

  function translateLabKey(key, fallback) {
    if (window.VitalRiseI18n && typeof window.VitalRiseI18n.t === "function") {
      return window.VitalRiseI18n.t(key) || fallback;
    }
    return fallback;
  }

  function buildLabProtocol(data) {
    const sex = data["lab-sex"] || "male";
    const age = Math.min(100, Math.max(18, Number(data["lab-age"]) || 30));
    const prostateRisk = data["lab-prostate-risk"] || "average";
    const goal = data["lab-goal"] || "recomp";
    const load = data["lab-training-load"] || "moderate";
    const cycle = data["lab-cycle"] || "not_applicable";
    const symptoms = data["lab-symptoms"] || "none";
    const lastCheck = data["lab-last-check"] || "never";

    const groups = [
      createLabGroup(
        "База атлета",
        "foundation",
        ["Загальний аналіз крові", "Феритин", "Сироваткове залізо", "B12", "Фолат", "25(OH)D", "CRP"],
        "Показує ресурс для тренувань, відновлення, кисневий транспорт і можливі дефіцити."
      ),
      createLabGroup(
        "Метаболізм",
        "metabolic",
        ["Глюкоза натще", "Інсулін натще", "HbA1c", "Ліпідограма"],
        "Корисно для рекомпозиції, контролю апетиту, енергії та довгострокової роботи з жиром."
      ),
      createLabGroup(
        "Печінка, нирки, електроліти",
        "safety",
        ["ALT", "AST", "GGT", "Білірубін", "Креатинін", "eGFR", "Сечовина", "Натрій", "Калій", "Магній"],
        "Важливо при високому білку, креатині, дефіциті калорій і великому тренувальному об’ємі."
      ),
      createLabGroup(
        "Щитоподібна залоза",
        "thyroid",
        ["TSH", "Вільний T4", "Вільний T3", "Anti-TPO за показами"],
        "Тиреоїдні гормони впливають на енергію, вагу, пульс, настрій і переносимість дефіциту."
      )
    ];

    const notes = [
      "Рекомпозиція тіла йде краще, коли калорії, силові, сон і лабораторні маркери не конфліктують між собою.",
      "Інтерпретація аналізів залежить від референсів конкретної лабораторії, симптомів, ліків і медичної історії."
    ];

    if (sex === "male") {
      groups.push(
        createLabGroup(
          "Чоловіча гормональна панель",
          "male",
          ["Загальний тестостерон", "Вільний тестостерон або розрахунок", "SHBG", "LH", "FSH", "Естрадіол", "Пролактин"],
          "Для чоловіків гормони варто дивитися разом із симптомами, ранковим забором і повторним підтвердженням відхилень."
        )
      );

      if (symptoms === "libido" || goal === "hormones") {
        notes.push("Для чоловіків пролактин особливо важливий при зниженому лібідо, еректильній дисфункції, гінекомастії або підозрі на вплив ліків.");
      }

      if (age >= 30 && age < 40) {
        groups.push(
          createLabGroup(
            "Здоров’я простати 30+",
            "screening",
            ["Оцінка симптомів сечовипускання", "Сімейний анамнез раку простати"],
            "У 30-39 років рутинний ПСА без симптомів або високого ризику зазвичай не потрібен. Важливі сімейний анамнез, симптоми та своєчасна консультація уролога."
          )
        );
      } else if ((age >= 40 && prostateRisk === "elevated") || (age >= 50 && age <= 69)) {
        groups.push(
          createLabGroup(
            "Скринінг простати",
            "screening",
            ["ПСА загальний", "Оцінка симптомів сечовипускання", "Сімейний анамнез раку простати"],
            age < 50
              ? "У 40-49 років ПСА обговорюють раніше при підвищеному ризику. Рішення приймають разом з урологом після розмови про користь, хибнопозитивні результати й надмірну діагностику."
              : "У 50-69 років ПСА можна обговорити з лікарем як індивідуальний скринінг. Одне значення не встановлює діагноз: важливі вік, динаміка, симптоми, запалення та стан простати."
          )
        );
      } else if (age >= 70) {
        groups.push(
          createLabGroup(
            "Здоров’я простати",
            "screening",
            ["Індивідуальне рішення щодо ПСА", "Оцінка симптомів сечовипускання"],
            "Після 70 років користь рутинного ПСА залежить від загального здоров’я та очікуваної тривалості життя. Скринінг не повинен призначатися автоматично."
          )
        );
      } else if (age >= 40) {
        notes.push("Для чоловіків 40-49 років без підвищеного ризику рутинний ПСА не додається автоматично; ранній скринінг варто обговорити з лікарем за симптомів або зміни ризику.");
      }
    } else {
      groups.push(
        createLabGroup(
          "Жіноча гормональна панель",
          "female",
          ["LH", "FSH", "Естрадіол", "Прогестерон", "Пролактин", "SHBG", "Загальний тестостерон", "Вільний тестостерон або індекс", "DHEA-S"],
          "Для жінок день циклу, контрацепція, вагітність, лактація і симптоми критично змінюють інтерпретацію."
        )
      );

      if (cycle === "regular") {
        notes.push("При регулярному циклі частину гормонів часто обговорюють для 2-5 дня циклу, а прогестерон — у середині лютеїнової фази.");
      }

      if (cycle === "irregular" || symptoms === "libido" || goal === "hormones") {
        notes.push("Для жінок пролактин важливий при нерегулярному циклі, виділеннях з грудей, проблемах із фертильністю або підозрі на PCOS/щитоподібну залозу.");
      }

      if (cycle === "contraception") {
        notes.push("Гормональна контрацепція може змінювати SHBG, естрадіол, прогестерон і картину циклу — це треба зазначати лікарю.");
      }

      if (cycle === "postpartum") {
        notes.push("Після пологів або під час лактації пролактин може бути фізіологічно високим, тому контекст обов’язковий.");
      }

      if (age >= 21 && age <= 29) {
        groups.push(
          createLabGroup(
            "Скринінг шийки матки",
            "screening",
            ["ПАП-тест / цитологія шийки матки"],
            "У 21-29 років для середнього ризику орієнтиром є ПАП-тест раз на 3 роки. Попередні аномальні результати, імунодефіцит або ВІЛ потребують окремого графіка з гінекологом."
          )
        );
      } else if (age >= 30 && age <= 65) {
        groups.push(
          createLabGroup(
            "Скринінг шийки матки",
            "screening",
            ["hrHPV-тест", "ПАП-тест / цитологія шийки матки"],
            "У 30-65 років перевагу надають первинному hrHPV-тесту кожні 5 років; ко-тест ПАП + hrHPV кожні 5 років є прийнятною альтернативою, а ПАП окремо кожні 3 роки — варіантом, коли HPV-тест недоступний або обраний після консультації."
          )
        );
      } else if (age > 65) {
        groups.push(
          createLabGroup(
            "Скринінг шийки матки",
            "screening",
            ["Перевірка історії ПАП / hrHPV-тестів"],
            "Після 65 років скринінг можна завершити лише за достатньої серії попередніх негативних тестів і без високого ризику. Якщо історія неповна або були передракові зміни, графік визначає гінеколог."
          )
        );
      }

      notes.push("ПАП-тест і hrHPV-тест — це профілактичний скринінг, а не аналіз статевих гормонів. Вакцинація проти HPV не скасовує плановий скринінг.");
    }

    if (load === "high") {
      groups.push(
        createLabGroup(
          "Високе навантаження",
          "performance",
          ["Креатинкіназа за показами", "Кортизол за показами", "Загальний білок", "Альбумін"],
          "Допомагає відрізняти адаптацію від накопиченої втоми, якщо падають сила, сон і мотивація."
        )
      );
    }

    if (load === "cut" || goal === "plateau") {
      notes.push("На сушці або плато важливо не списувати все на силу волі: дефіцити, щитоподібна залоза, сон і стрес можуть ламати прогрес.");
    }

    if (symptoms === "hair_skin") {
      notes.push("Волосся, шкіра, акне або набряки можуть вимагати ширшого медичного контексту: андрогени, щитоподібна залоза, залізо, запалення.");
    }

    if (lastCheck !== "recent") {
      notes.push("Якщо аналізів не було понад 6 місяців, базову панель краще оновити перед агресивною сушкою, набором або великим об’ємом тренувань.");
    }

    return {
      sex: sex,
      age: age,
      groups: groups,
      notes: notes
    };
  }

  function renderLabProtocol(protocol) {
    const groupsMarkup = protocol.groups
      .map(function (group) {
        return (
          '<article class="lab-result-card lab-result-card-' + group.tag + '">' +
            '<div class="protocol-card-top">' +
              '<h4>' + translateLabText(group.title) + '</h4>' +
              '<span>' + translateLabText(group.tag) + '</span>' +
            '</div>' +
            '<div class="marker-list">' +
              group.markers.map(function (marker) {
                return '<span>' + translateLabText(marker) + '</span>';
              }).join("") +
            '</div>' +
            '<p>' + translateLabText(group.note) + '</p>' +
          '</article>'
        );
      })
      .join("");

    const notesMarkup = protocol.notes
      .map(function (note) {
        return '<div class="tip-item">' + translateLabText(note) + '</div>';
      })
      .join("");

    labResult.innerHTML =
      '<h3 class="result-title">' + (protocol.sex === "male" ? "Чоловіча" : "Жіноча") + ' лабораторна панель</h3>' +
      '<div class="lab-result-grid">' + groupsMarkup + '</div>' +
      '<h4 class="result-subtitle">Чому це важливо для рекомпозиції</h4>' +
      '<div class="tip-list">' + notesMarkup + '</div>' +
      '<p class="result-note">VitalRise не ставить діагнози й не призначає лікування. Аналізи треба трактувати з лікарем, особливо при відхиленнях пролактину, статевих гормонів, TSH, феритину, печінкових або ниркових маркерів.</p>';
  }

  if (labForm && labResult) {
    labForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(labForm);
      const data = Object.fromEntries(formData.entries());
      const protocol = buildLabProtocol(data);

      activeLabProtocol = protocol;
      renderLabProtocol(protocol);
      setReviewGateState(protocol);
      if (labReviewResult) {
        labReviewResult.innerHTML =
          '<div class="result-placeholder">Введи результати з бланку для маркерів, які увійшли у сформовану панель.</div>';
      }
    });
  }

  if (labReset && labForm && labResult) {
    labReset.addEventListener("click", function () {
      labForm.reset();
      activeLabProtocol = null;
      setReviewGateState(null);
      labResult.innerHTML =
        '<div class="result-placeholder">Обери параметри, щоб отримати лабораторну панель для рекомпозиції.</div>';
      if (labReviewResult) {
        labReviewResult.innerHTML =
          '<div class="result-placeholder">Спочатку сформуй Bloodwork Protocol, щоб відкрити оцінку результатів.</div>';
      }
    });
  }

  function parseLabNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(String(value).replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }

  function addLabFinding(findings, severity, marker, value, title, text, action) {
    findings.push({
      severity: severity,
      marker: marker,
      value: value,
      title: title,
      text: text,
      action: action
    });
  }

  function getLabSeverityScore(severity) {
    if (severity === "critical") return 3;
    if (severity === "attention") return 2;
    if (severity === "info") return 1;
    return 0;
  }

  function evaluateLabResults(data) {
    const sex = data["review-sex"] || "male";
    const age = Math.min(100, Math.max(18, Number(data["review-age"]) || 30));
    const cycle = data["review-cycle"] || "not_applicable";
    const reviewDate = data["review-date"] || "";
    const fasting = data["review-fasting"] || "unknown";
    const findings = [];

    const ferritin = parseLabNumber(data["review-ferritin"]);
    const hemoglobin = parseLabNumber(data["review-hemoglobin"]);
    const leukocytes = parseLabNumber(data["review-leukocytes"]);
    const platelets = parseLabNumber(data["review-platelets"]);
    const vitaminD = parseLabNumber(data["review-vitamin-d"]);
    const b12 = parseLabNumber(data["review-b12"]);
    const iron = parseLabNumber(data["review-iron"]);
    const folate = parseLabNumber(data["review-folate"]);
    const crp = parseLabNumber(data["review-crp"]);
    const glucose = parseLabNumber(data["review-glucose"]);
    const hba1c = parseLabNumber(data["review-hba1c"]);
    const insulin = parseLabNumber(data["review-insulin"]);
    const totalCholesterol = parseLabNumber(data["review-total-cholesterol"]);
    const ldl = parseLabNumber(data["review-ldl"]);
    const hdl = parseLabNumber(data["review-hdl"]);
    const triglycerides = parseLabNumber(data["review-triglycerides"]);
    const tsh = parseLabNumber(data["review-tsh"]);
    const freeT4 = parseLabNumber(data["review-free-t4"]);
    const freeT3 = parseLabNumber(data["review-free-t3"]);
    const antiTpo = parseLabNumber(data["review-anti-tpo"]);
    const alt = parseLabNumber(data["review-alt"]);
    const ast = parseLabNumber(data["review-ast"]);
    const ggt = parseLabNumber(data["review-ggt"]);
    const bilirubin = parseLabNumber(data["review-bilirubin"]);
    const creatinine = parseLabNumber(data["review-creatinine"]);
    const egfr = parseLabNumber(data["review-egfr"]);
    const urea = parseLabNumber(data["review-urea"]);
    const sodium = parseLabNumber(data["review-sodium"]);
    const potassium = parseLabNumber(data["review-potassium"]);
    const magnesium = parseLabNumber(data["review-magnesium"]);
    const prolactin = parseLabNumber(data["review-prolactin"]);
    const psa = parseLabNumber(data["review-psa"]);
    const testosterone = parseLabNumber(data["review-testosterone"]);
    const freeTestosterone = parseLabNumber(data["review-free-testosterone"]);
    const shbg = parseLabNumber(data["review-shbg"]);
    const lh = parseLabNumber(data["review-lh"]);
    const fsh = parseLabNumber(data["review-fsh"]);
    const estradiol = parseLabNumber(data["review-estradiol"]);
    const progesterone = parseLabNumber(data["review-progesterone"]);
    const dheaS = parseLabNumber(data["review-dhea-s"]);
    const ck = parseLabNumber(data["review-ck"]);
    const cortisol = parseLabNumber(data["review-cortisol"]);
    const totalProtein = parseLabNumber(data["review-total-protein"]);
    const albumin = parseLabNumber(data["review-albumin"]);
    const enteredMarkers = [
      { marker: "Феритин", value: ferritin, display: ferritin !== null ? ferritin + " нг/мл" : "", system: "blood" },
      { marker: "Гемоглобін", value: hemoglobin, display: hemoglobin !== null ? hemoglobin + " г/л" : "", system: "blood" },
      { marker: "Лейкоцити", value: leukocytes, display: leukocytes !== null ? leukocytes + " 10^9/л" : "", system: "blood" },
      { marker: "Тромбоцити", value: platelets, display: platelets !== null ? platelets + " 10^9/л" : "", system: "blood" },
      { marker: "25(OH)D", value: vitaminD, display: vitaminD !== null ? vitaminD + " нг/мл" : "", system: "blood" },
      { marker: "B12", value: b12, display: b12 !== null ? b12 + " пг/мл" : "", system: "blood" },
      { marker: "Сироваткове залізо", value: iron, display: iron !== null ? iron + " мкмоль/л" : "", system: "blood" },
      { marker: "Фолат", value: folate, display: folate !== null ? folate + " нг/мл" : "", system: "blood" },
      { marker: "CRP", value: crp, display: crp !== null ? crp + " мг/л" : "", system: "blood" },
      { marker: "Глюкоза", value: glucose, display: glucose !== null ? glucose + " ммоль/л" : "", system: "metabolic" },
      { marker: "HbA1c", value: hba1c, display: hba1c !== null ? hba1c + "%" : "", system: "metabolic" },
      { marker: "Інсулін", value: insulin, display: insulin !== null ? insulin + " мкОд/мл" : "", system: "metabolic" },
      { marker: "Загальний холестерин", value: totalCholesterol, display: totalCholesterol !== null ? totalCholesterol + " ммоль/л" : "", system: "metabolic" },
      { marker: "LDL", value: ldl, display: ldl !== null ? ldl + " ммоль/л" : "", system: "metabolic" },
      { marker: "HDL", value: hdl, display: hdl !== null ? hdl + " ммоль/л" : "", system: "metabolic" },
      { marker: "Тригліцериди", value: triglycerides, display: triglycerides !== null ? triglycerides + " ммоль/л" : "", system: "metabolic" },
      { marker: "TSH", value: tsh, display: tsh !== null ? tsh + " мМО/л" : "", system: "thyroid" },
      { marker: "Вільний T4", value: freeT4, display: freeT4 !== null ? freeT4 + " пмоль/л" : "", system: "thyroid" },
      { marker: "Вільний T3", value: freeT3, display: freeT3 !== null ? freeT3 + " пмоль/л" : "", system: "thyroid" },
      { marker: "Anti-TPO", value: antiTpo, display: antiTpo !== null ? antiTpo + " Од/мл" : "", system: "thyroid" },
      { marker: "ALT", value: alt, display: alt !== null ? alt + " Од/л" : "", system: "liver" },
      { marker: "AST", value: ast, display: ast !== null ? ast + " Од/л" : "", system: "liver" },
      { marker: "GGT", value: ggt, display: ggt !== null ? ggt + " Од/л" : "", system: "liver" },
      { marker: "Білірубін", value: bilirubin, display: bilirubin !== null ? bilirubin + " мкмоль/л" : "", system: "liver" },
      { marker: "Креатинін", value: creatinine, display: creatinine !== null ? creatinine + " мкмоль/л" : "", system: "kidney" },
      { marker: "eGFR", value: egfr, display: egfr !== null ? String(egfr) : "", system: "kidney" },
      { marker: "Сечовина", value: urea, display: urea !== null ? urea + " ммоль/л" : "", system: "kidney" },
      { marker: "Натрій", value: sodium, display: sodium !== null ? sodium + " ммоль/л" : "", system: "kidney" },
      { marker: "Калій", value: potassium, display: potassium !== null ? potassium + " ммоль/л" : "", system: "kidney" },
      { marker: "Магній", value: magnesium, display: magnesium !== null ? magnesium + " ммоль/л" : "", system: "kidney" },
      { marker: "Пролактин", value: prolactin, display: prolactin !== null ? prolactin + " нг/мл" : "", system: "hormonal" },
      { marker: "ПСА загальний", value: psa, display: psa !== null ? psa + " нг/мл" : "", system: "hormonal" },
      { marker: "Тестостерон", value: testosterone, display: testosterone !== null ? testosterone + " нмоль/л" : "", system: "hormonal" },
      { marker: "Вільний тестостерон", value: freeTestosterone, display: freeTestosterone !== null ? String(freeTestosterone) : "", system: "hormonal" },
      { marker: "SHBG", value: shbg, display: shbg !== null ? shbg + " нмоль/л" : "", system: "hormonal" },
      { marker: "LH", value: lh, display: lh !== null ? String(lh) : "", system: "hormonal" },
      { marker: "FSH", value: fsh, display: fsh !== null ? String(fsh) : "", system: "hormonal" },
      { marker: "Естрадіол", value: estradiol, display: estradiol !== null ? estradiol + " пг/мл" : "", system: "hormonal" },
      { marker: "Прогестерон", value: progesterone, display: progesterone !== null ? progesterone + " нг/мл" : "", system: "hormonal" },
      { marker: "DHEA-S", value: dheaS, display: dheaS !== null ? String(dheaS) : "", system: "hormonal" },
      { marker: "Креатинкіназа", value: ck, display: ck !== null ? ck + " Од/л" : "", system: "recovery" },
      { marker: "Кортизол", value: cortisol, display: cortisol !== null ? String(cortisol) : "", system: "recovery" },
      { marker: "Загальний білок", value: totalProtein, display: totalProtein !== null ? totalProtein + " г/л" : "", system: "recovery" },
      { marker: "Альбумін", value: albumin, display: albumin !== null ? albumin + " г/л" : "", system: "recovery" }
    ].filter(function (item) {
      return item.value !== null;
    });
    const enteredValues = enteredMarkers.map(function (item) { return item.value; });

    if (ferritin !== null) {
      if (ferritin < 30) {
        addLabFinding(findings, "critical", "Феритин", ferritin + " нг/мл", "Низький запас заліза", "Може погіршувати витривалість, відновлення, переносимість дефіциту і якість тренувань.", "Обговорити з лікарем причину низького феритину та стратегію корекції.");
      } else if (ferritin < 50) {
        addLabFinding(findings, "attention", "Феритин", ferritin + " нг/мл", "Запас заліза потребує уваги", "Для активної рекомпозиції та силових тренувань низько-нормальний запас може бути вузьким місцем.", "Звірити з ЗАК, залізом, симптомами і раціоном.");
      }
    }

    if (hemoglobin !== null) {
      const lowHemoglobin = sex === "female" ? 120 : 130;
      if (hemoglobin < lowHemoglobin) {
        addLabFinding(findings, "attention", "Гемоглобін", hemoglobin + " г/л", "Гемоглобін нижче типового орієнтира", "Може впливати на витривалість, пульс, слабкість і переносимість дефіциту.", "Оцінити разом із феритином, залізом, B12, фолатом і лікарем.");
      }
    }

    if (leukocytes !== null && (leukocytes < 4 || leukocytes > 10)) {
      addLabFinding(findings, "info", "Лейкоцити", leukocytes + " 10^9/л", "Лейкоцити поза типовим орієнтиром", "Можуть змінюватися через інфекцію, стрес, запалення, ліки або інші фактори.", "Звірити з формулою крові, CRP, симптомами і лікарем.");
    }

    if (platelets !== null && (platelets < 150 || platelets > 450)) {
      addLabFinding(findings, "info", "Тромбоцити", platelets + " 10^9/л", "Тромбоцити поза типовим орієнтиром", "Це не спортивний висновок, але важливий загальномедичний маркер з ЗАК.", "Звірити з референсами лабораторії та лікарем.");
    }

    if (vitaminD !== null) {
      if (vitaminD < 20) {
        addLabFinding(findings, "critical", "25(OH)D", vitaminD + " нг/мл", "Ймовірний дефіцит вітаміну D", "Може впливати на м’язову функцію, імунну стійкість і загальне самопочуття.", "Корекцію дозування узгодити з лікарем і контролювати повторним аналізом.");
      } else if (vitaminD < 30) {
        addLabFinding(findings, "attention", "25(OH)D", vitaminD + " нг/мл", "Вітамін D нижче бажаного спортивного діапазону", "Це не катастрофа, але для атлета може бути маркером, який варто оптимізувати.", "Перевірити сонце, раціон, добавки і план повторного контролю.");
      }
    }

    if (b12 !== null && b12 < 300) {
      addLabFinding(findings, "attention", "B12", b12 + " пг/мл", "B12 низько-нормальний або знижений", "Може бути пов’язаний з енергією, нервовою системою і якістю відновлення.", "Оцінити раціон, ЗАК, фолат і симптоми разом із фахівцем.");
    }

    if (iron !== null && (iron < 8 || iron > 32)) {
      addLabFinding(findings, "attention", "Сироваткове залізо", iron + " мкмоль/л", "Залізо потребує контексту", "Разом із феритином і ЗАК допомагає зрозуміти транспорт кисню, втому та переносимість навантаження.", "Не коригувати залізо самостійно; звірити з феритином, гемоглобіном, трансферином і лікарем.");
    }

    if (folate !== null && folate < 4) {
      addLabFinding(findings, "attention", "Фолат", folate + " нг/мл", "Фолат низький або низько-нормальний", "Може впливати на кровотворення, енергію та переносимість навантаження.", "Оцінити разом із B12, ЗАК, раціоном і симптомами.");
    }

    if (crp !== null) {
      if (crp > 10) {
        addLabFinding(findings, "critical", "CRP", crp + " мг/л", "CRP суттєво підвищений", "Може вказувати на активне запалення або гострий стан, де рекомпозицію краще не форсувати.", "Обговорити з лікарем, особливо якщо є симптоми або температура.");
      } else if (crp > 3) {
        addLabFinding(findings, "attention", "CRP", crp + " мг/л", "CRP потребує уваги", "Запалення, інфекція, травма або важке тренування можуть впливати на відновлення і вагу.", "Звірити з самопочуттям, тренуваннями напередодні та іншими маркерами.");
      }
    }

    if (glucose !== null) {
      if (glucose >= 7) {
        addLabFinding(findings, "critical", "Глюкоза", glucose + " ммоль/л", "Висока глюкоза натще", "Для рекомпозиції це важливий метаболічний сигнал, який не варто ігнорувати.", "Потрібна медична оцінка і, ймовірно, повторне підтвердження.");
      } else if (glucose >= 5.6) {
        addLabFinding(findings, "attention", "Глюкоза", glucose + " ммоль/л", "Глюкоза натще потребує уваги", "Може впливати на апетит, енергію і роботу з відсотком жиру.", "Звірити з HbA1c, інсуліном, сном, кроками і харчуванням.");
      }
    }

    if (hba1c !== null) {
      if (hba1c >= 6.5) {
        addLabFinding(findings, "critical", "HbA1c", hba1c + "%", "HbA1c у зоні високого ризику", "Це вже не просто спортивний маркер, а причина звернутися до лікаря.", "Не коригувати тільки тренуванням; потрібна медична оцінка.");
      } else if (hba1c >= 5.7) {
        addLabFinding(findings, "attention", "HbA1c", hba1c + "%", "HbA1c потребує уваги", "Може пояснювати складність жироспалення, нестабільну енергію і тягу до їжі.", "Переглянути вуглеводи, кроки, сон і здати додаткові маркери за рекомендацією лікаря.");
      }
    }

    if (insulin !== null && insulin > 15) {
      addLabFinding(findings, "attention", "Інсулін", insulin + " мкОд/мл", "Інсулін натще високий за спортивним орієнтиром", "Може пояснювати складність контролю апетиту, енергії та відсотка жиру.", "Оцінювати разом із глюкозою, HbA1c, талією, кроками, сном і лікарем.");
    }

    if (ldl !== null && ldl > 3.4) {
      addLabFinding(findings, "attention", "LDL", ldl + " ммоль/л", "LDL вище бажаного орієнтира", "Для довгострокового здоров’я серцево-судинний контекст важливий навіть у спортивній формі.", "Звірити з повною ліпідограмою, сімейним анамнезом, тиском і лікарем.");
    }

    if (hdl !== null && hdl < 1) {
      addLabFinding(findings, "attention", "HDL", hdl + " ммоль/л", "HDL низький", "Може бути маркером метаболічного контексту, особливо разом із талією, тригліцеридами і глюкозою.", "Оцінити харчування, активність, сон і повну ліпідограму.");
    }

    if (triglycerides !== null && triglycerides > 1.7) {
      addLabFinding(findings, "attention", "Тригліцериди", triglycerides + " ммоль/л", "Тригліцериди підвищені", "Можуть бути пов’язані з вуглеводами, алкоголем, дефіцитом активності, сном або метаболічним станом.", "Важливо знати, чи аналіз був натще, і звірити з глюкозою/HbA1c.");
    }

    if (totalCholesterol !== null && totalCholesterol > 6.2) {
      addLabFinding(findings, "info", "Загальний холестерин", totalCholesterol + " ммоль/л", "Загальний холестерин високий", "Сам по собі менш інформативний, ніж LDL/HDL/тригліцериди, але не варто ігнорувати.", "Дивитися повну ліпідограму і серцево-судинні фактори ризику.");
    }

    if (tsh !== null) {
      if (tsh < 0.4 || tsh > 4) {
        addLabFinding(findings, "attention", "TSH", tsh + " мМО/л", "TSH поза типовим орієнтиром", "Щитоподібна залоза може впливати на вагу, пульс, температуру, енергію і переносимість дефіциту.", "Обговорити з лікарем вільний T4, вільний T3, антитіла і симптоми.");
      }
    }

    if (freeT4 !== null && (freeT4 < 10 || freeT4 > 23)) {
      addLabFinding(findings, "attention", "Вільний T4", freeT4 + " пмоль/л", "Вільний T4 поза типовим орієнтиром", "Тиреоїдний контекст може впливати на енергію, вагу, пульс і переносимість навантажень.", "Оцінювати разом із TSH, вільним T3, симптомами і лікарем.");
    }

    if (freeT3 !== null && (freeT3 < 3.1 || freeT3 > 6.8)) {
      addLabFinding(findings, "attention", "Вільний T3", freeT3 + " пмоль/л", "Вільний T3 поза типовим орієнтиром", "На дефіциті калорій і при стресі T3 може змінюватися, впливаючи на самопочуття.", "Не трактувати окремо від TSH, T4, харчування і симптомів.");
    }

    if (antiTpo !== null && antiTpo > 35) {
      addLabFinding(findings, "attention", "Anti-TPO", antiTpo + " Од/мл", "Антитіла до TPO підвищені", "Це не спортивний маркер у вузькому сенсі, але може бути важливим для щитоподібної залози.", "Обговорити з ендокринологом разом із TSH, T4/T3 та УЗД за потреби.");
    }

    if (alt !== null && alt > 40) {
      addLabFinding(findings, "attention", "ALT", alt + " Од/л", "ALT підвищений відносно типового орієнтира", "Для атлета це може бути наслідком різних факторів, включно з тренуванням, але печінковий контекст треба перевірити.", "Звірити з AST, GGT, білірубіном, алкоголем, ліками і датою тренування.");
    }

    if (ast !== null && ast > 40) {
      addLabFinding(findings, "attention", "AST", ast + " Од/л", "AST підвищений відносно типового орієнтира", "Після важких тренувань AST може реагувати, але разом з ALT/GGT це важливий сигнал для перевірки.", "Повторювати аналіз краще після паузи від важких тренувань, якщо лікар погодить.");
    }

    if (ggt !== null && ggt > 60) {
      addLabFinding(findings, "attention", "GGT", ggt + " Од/л", "GGT підвищений", "Допомагає уточнювати печінковий контекст разом із ALT, AST, білірубіном, алкоголем і ліками.", "Обговорити з лікарем, особливо якщо ALT/AST теж підвищені.");
    }

    if (bilirubin !== null && bilirubin > 21) {
      addLabFinding(findings, "info", "Білірубін", bilirubin + " мкмоль/л", "Білірубін вище типового орієнтира", "Може мати різні причини і потребує контексту фракцій, печінкових маркерів та симптомів.", "Звірити з прямим/непрямим білірубіном, ALT, AST, GGT і лікарем.");
    }

    if (creatinine !== null && creatinine > 120) {
      addLabFinding(findings, "attention", "Креатинін", creatinine + " мкмоль/л", "Креатинін високий за типовим орієнтиром", "У спортсменів креатинін залежить від м’язової маси, креатину, м’яса, гідратації та тренувань.", "Оцінити разом із eGFR, сечовиною, аналізом сечі та лікарем.");
    }

    if (egfr !== null) {
      if (egfr < 60) {
        addLabFinding(findings, "critical", "eGFR", egfr, "Нирковий маркер потребує медичної оцінки", "При такому значенні не варто самостійно підвищувати білок, креатин або агресивні добавки.", "Обговорити з лікарем креатинін, сечовину, аналіз сечі та контекст м’язової маси.");
      } else if (egfr < 90) {
        addLabFinding(findings, "attention", "eGFR", egfr, "eGFR нижче оптимального орієнтира", "Для спортсмена важливо оцінювати це разом із креатиніном, м’язовою масою, гідратацією і білком.", "Не робити різких висновків без лікаря та повторного контексту.");
      }
    }

    if (urea !== null && urea > 8.3) {
      addLabFinding(findings, "info", "Сечовина", urea + " ммоль/л", "Сечовина підвищена", "Може реагувати на білок, дефіцит рідини, тренування та нирковий контекст.", "Звірити з креатиніном, eGFR, гідратацією і раціоном.");
    }

    if (sodium !== null && (sodium < 135 || sodium > 145)) {
      addLabFinding(findings, "attention", "Натрій", sodium + " ммоль/л", "Натрій поза типовим діапазоном", "Електроліти важливі для тиску, самопочуття, роботи м’язів і безпеки навантаження.", "Не коригувати агресивно самостійно; звірити з лікарем, водою, ліками і потовиділенням.");
    }

    if (potassium !== null && (potassium < 3.5 || potassium > 5.2)) {
      addLabFinding(findings, "attention", "Калій", potassium + " ммоль/л", "Калій поза типовим діапазоном", "Калій важливий для м’язів, серцевого ритму і переносимості навантажень.", "Потребує обережної медичної оцінки, особливо при ліках або ниркових питаннях.");
    }

    if (magnesium !== null && magnesium < 0.75) {
      addLabFinding(findings, "attention", "Магній", magnesium + " ммоль/л", "Магній низький або низько-нормальний", "Може бути пов’язаний із судомами, сном, нервовою системою і переносимістю стресу.", "Оцінити раціон, симптоми, ШКТ і добавки з фахівцем.");
    }

    if (prolactin !== null) {
      const prolactinAttention = sex === "female" ? 25 : 20;
      if (prolactin > prolactinAttention) {
        addLabFinding(findings, "attention", "Пролактин", prolactin + " нг/мл", "Пролактин підвищений відносно типового орієнтира", sex === "female"
          ? "У жінок це важливо оцінювати з циклом, лактацією, стресом, сном, TSH і симптомами."
          : "У чоловіків це може бути пов’язано з лібідо, еректильною функцією, відновленням і гормональним контекстом.", "Повторити за правилами підготовки і обговорити з лікарем, особливо якщо є симптоми.");
      }

      if (sex === "female" && cycle === "postpartum") {
        addLabFinding(findings, "info", "Пролактин", prolactin + " нг/мл", "Лактація змінює інтерпретацію", "Після пологів або під час грудного вигодовування пролактин може бути фізіологічно вищим.", "У висновку обов’язково зазначити лактацію.");
      }
    }

    if (testosterone !== null) {
      if (sex === "male") {
        if (testosterone < 10.4) {
          addLabFinding(findings, "critical", "Тестостерон", testosterone + " нмоль/л", "Низький тестостерон за орієнтиром", "Може гальмувати силу, лібідо, відновлення, настрій і рекомпозицію.", "Потрібне ранкове повторне підтвердження разом із SHBG, LH, FSH, естрадіолом і пролактином.");
        } else if (testosterone < 15.6) {
          addLabFinding(findings, "attention", "Тестостерон", testosterone + " нмоль/л", "Тестостерон у нижній зоні", "Сам по собі не діагноз, але при симптомах може пояснювати слабку відповідь на тренування.", "Дивитися разом із сном, дефіцитом калорій, стресом, SHBG і вільним тестостероном.");
        }
      } else if (testosterone > 2.4) {
        addLabFinding(findings, "attention", "Тестостерон", testosterone + " нмоль/л", "Андрогенний маркер потребує уваги", "У жінок підвищений тестостерон може бути пов’язаний з акне, волоссям, циклом і PCOS-контекстом.", "Обговорити з лікарем SHBG, вільний тестостерон, DHEA-S, LH/FSH і цикл.");
      }
    }

    if (psa !== null && sex === "male") {
      addLabFinding(
        findings,
        "info",
        "ПСА загальний",
        psa + " нг/мл",
        translateLabKey("psaFindingTitle", "ПСА потребує вікового та клінічного контексту"),
        translateLabKey("psaFindingText", "ПСА не є специфічним лише для раку: показник може змінюватися при доброякісному збільшенні простати, запаленні, інфекції або після маніпуляцій.") + " " +
          translateLabKey("psaFindingContext", "Вік: {age}. Важливі референс лабораторії та динаміка.").replace("{age}", age),
        translateLabKey("psaFindingAction", "Не робити висновок за одним значенням. Якщо ПСА вище референсу, зростає в динаміці або є симптоми сечовипускання, обговорити повторний тест і консультацію уролога.")
      );
    }

    if (freeTestosterone !== null) {
      addLabFinding(findings, "info", "Вільний тестостерон", freeTestosterone, "Вільний тестостерон внесено", "Для цього маркера одиниці й метод розрахунку сильно залежать від лабораторії.", "Трактувати тільки з референсами лабораторії, SHBG, загальним тестостероном і симптомами.");
    }

    if (shbg !== null) {
      if (sex === "male" && (shbg < 15 || shbg > 80)) {
        addLabFinding(findings, "attention", "SHBG", shbg + " нмоль/л", "SHBG поза типовим чоловічим орієнтиром", "SHBG змінює доступність тестостерону і може пояснювати різницю між загальним та вільним тестостероном.", "Оцінювати разом із тестостероном, естрадіолом, щитоподібною залозою і печінковими маркерами.");
      } else if (sex === "female" && (shbg < 20 || shbg > 150)) {
        addLabFinding(findings, "attention", "SHBG", shbg + " нмоль/л", "SHBG потребує контексту", "У жінок SHBG сильно залежить від контрацепції, щитоподібної залози, інсуліну та андрогенів.", "Трактувати з лікарем і жіночим контекстом.");
      }
    }

    if (lh !== null || fsh !== null) {
      addLabFinding(findings, "info", "LH / FSH", (lh !== null ? "LH " + lh : "") + (lh !== null && fsh !== null ? " / " : "") + (fsh !== null ? "FSH " + fsh : ""), "Гонадотропіни внесено", "LH і FSH не мають універсальної спортивної оцінки без статі, віку, циклу, симптомів і референсів.", "Дивитися разом із тестостероном/естрадіолом, пролактином, SHBG і лікарем.");
    }

    if (estradiol !== null && sex === "male") {
      if (estradiol < 10 || estradiol > 45) {
        addLabFinding(findings, "attention", "Естрадіол", estradiol + " пг/мл", "Естрадіол поза типовим чоловічим орієнтиром", "Для чоловіків занадто низький або високий естрадіол може впливати на лібідо, суглоби, настрій і самопочуття.", "Оцінювати разом із тестостероном, SHBG, відсотком жиру і симптомами.");
      }
    }

    if (progesterone !== null && sex === "female") {
      if (cycle === "luteal" && progesterone < 5) {
        addLabFinding(findings, "attention", "Прогестерон", progesterone + " нг/мл", "Прогестерон може бути низьким для лютеїнового контексту", "Це може бути важливо для циклу, сну, температури, настрою і відновлення.", "Оцінювати тільки з днем циклу та лікарем.");
      } else if (cycle !== "luteal") {
        addLabFinding(findings, "info", "Прогестерон", progesterone + " нг/мл", "Прогестерон залежить від фази циклу", "Без дня циклу цей показник майже неможливо коректно оцінити.", "Вказати день циклу або фазу при консультації.");
      }
    }

    if (dheaS !== null && sex === "female") {
      addLabFinding(findings, "info", "DHEA-S", dheaS, "DHEA-S внесено", "DHEA-S важливий при акне, волоссі, нерегулярному циклі та PCOS-контексті, але межі залежать від віку й лабораторії.", "Трактувати з референсами, тестостероном, SHBG, LH/FSH і лікарем.");
    }

    if (ck !== null) {
      if (ck > 1000) {
        addLabFinding(findings, "attention", "Креатинкіназа", ck + " Од/л", "CK суттєво підвищена", "Після важкого тренування CK може рости, але дуже високі значення потребують обережності й контексту симптомів.", "Не форсувати тренування; звірити з болем, сечею, гідратацією і лікарем.");
      } else if (ck > 300) {
        addLabFinding(findings, "info", "Креатинкіназа", ck + " Од/л", "CK підвищена після навантаження", "Для спортсмена це часто відображає м’язове навантаження, але важливий контекст тренування напередодні.", "Повторювати краще після відпочинку, якщо потрібна чиста лабораторна картина.");
      }
    }

    if (cortisol !== null) {
      addLabFinding(findings, "info", "Кортизол", cortisol, "Кортизол внесено", "Кортизол сильно залежить від часу забору, сну, стресу, кофеїну і дефіциту калорій.", "Оцінювати тільки з одиницями, часом забору та референсами лабораторії.");
    }

    if (totalProtein !== null && (totalProtein < 64 || totalProtein > 83)) {
      addLabFinding(findings, "info", "Загальний білок", totalProtein + " г/л", "Загальний білок поза типовим орієнтиром", "Може відображати гідратацію, харчування, печінковий або запальний контекст.", "Звірити з альбуміном, раціоном, печінковими маркерами та лікарем.");
    }

    if (albumin !== null && (albumin < 35 || albumin > 52)) {
      addLabFinding(findings, "info", "Альбумін", albumin + " г/л", "Альбумін поза типовим орієнтиром", "Альбумін важливий для загального білкового, печінкового і гідратаційного контексту.", "Не трактувати окремо від загального білка, печінкових маркерів і стану здоров’я.");
    }

    if (fasting === "not_fasting" && (glucose !== null || hba1c !== null)) {
      addLabFinding(findings, "info", "Умови здачі", "не натще", "Глюкозу натще не можна трактувати як натще", "Для метаболічних висновків важливо знати, чи був забір після нічного голодування.");
    }

    if (fasting === "after_training" && (alt !== null || ast !== null || egfr !== null || creatinine !== null || ck !== null)) {
      addLabFinding(findings, "info", "Умови здачі", "після тренування", "Важке тренування може спотворювати частину маркерів", "AST, ALT, креатинін/eGFR та запальні маркери краще звіряти з датою тренування і рекомендацією лікаря.");
    }

    const coveredMarkers = new Set(findings.map(function (item) { return item.marker; }));
    if (coveredMarkers.has("LH / FSH")) {
      coveredMarkers.add("LH");
      coveredMarkers.add("FSH");
    }

    enteredMarkers.forEach(function (item) {
      if (coveredMarkers.has(item.marker)) return;
      addLabFinding(
        findings,
        "normal",
        item.marker,
        item.display,
        translateLabKey("labNormalTitle", "Без явного відхилення за базовим орієнтиром"),
        translateLabKey("labNormalText", "Показник не створив окремого сигналу ризику в поточній скринінговій логіці. Це не означає, що його слід оцінювати ізольовано."),
        translateLabKey("labNormalAction", "Звірити з референсним діапазоном саме вашої лабораторії, симптомами та попередніми результатами.")
      );
    });

    findings.sort(function (a, b) {
      return getLabSeverityScore(b.severity) - getLabSeverityScore(a.severity);
    });

    const markerSystems = {};
    enteredMarkers.forEach(function (item) {
      markerSystems[item.marker] = item.system;
    });
    markerSystems["LH / FSH"] = "hormonal";

    const systemOrder = ["blood", "metabolic", "thyroid", "liver", "kidney", "hormonal", "recovery"];
    const systems = systemOrder.map(function (system) {
      const systemMarkers = enteredMarkers.filter(function (item) { return item.system === system; });
      if (!systemMarkers.length) return null;

      const systemFindings = findings.filter(function (item) {
        return markerSystems[item.marker] === system;
      });
      const severity = systemFindings.reduce(function (current, item) {
        return getLabSeverityScore(item.severity) > getLabSeverityScore(current) ? item.severity : current;
      }, "normal");

      return {
        key: system,
        severity: severity,
        enteredCount: systemMarkers.length,
        signalCount: systemFindings.filter(function (item) {
          return item.severity === "critical" || item.severity === "attention";
        }).length
      };
    }).filter(Boolean);

    const criticalCount = findings.filter(function (item) { return item.severity === "critical"; }).length;
    const attentionCount = findings.filter(function (item) { return item.severity === "attention"; }).length;

    let status = "green";
    let title = "Оптимально за введеними маркерами";
    let summary = "У заповнених показниках немає явних спортивних обмежувачів. Продовжуй дивитися на тренувальний прогрес, сон, раціон і динаміку тіла.";

    if (!enteredValues.length) {
      status = "neutral";
      title = "Немає введених показників";
      summary = "Введи хоча б один результат з лабораторного бланку, щоб отримати спортивну оцінку ризиків для рекомпозиції.";
    } else if (criticalCount) {
      status = "red";
      title = "Є маркери, які не варто ігнорувати";
      summary = "Рекомпозицію краще не форсувати, доки ці показники не будуть обговорені з лікарем або повторно перевірені в правильному контексті.";
    } else if (attentionCount) {
      status = "yellow";
      title = "Є фактори, які можуть гальмувати прогрес";
      summary = "Це не діагноз, але такі маркери можуть впливати на енергію, відновлення, апетит, силу або гормональний фон.";
    }

    return {
      status: status,
      title: title,
      summary: summary,
      reviewDate: reviewDate,
      fasting: fasting,
      enteredCount: enteredMarkers.length,
      normalCount: findings.filter(function (item) { return item.severity === "normal"; }).length,
      systems: systems,
      findings: findings
    };
  }

  function getLabFastingLabel(value) {
    if (window.VitalRiseSystem && window.VitalRiseSystem.labs) {
      return window.VitalRiseSystem.labs.getFastingLabel(value);
    }

    const labels = {
      unknown: "умови не вказані",
      fasting: "натще",
      not_fasting: "не натще",
      after_training: "після важкого тренування"
    };

    return labels[value] || labels.unknown;
  }

  function getLabPreparationNote(value) {
    if (window.VitalRiseSystem && window.VitalRiseSystem.labs) {
      return window.VitalRiseSystem.labs.getPreparationNote(value);
    }

    return "Умови здачі впливають на інтерпретацію частини маркерів.";
  }

  function getLabSystemTitle(key) {
    const titles = {
      blood: ["labSystemBlood", "Кровотворення та дефіцити"],
      metabolic: ["labSystemMetabolic", "Метаболізм і ліпіди"],
      thyroid: ["labSystemThyroid", "Щитоподібна залоза"],
      liver: ["labSystemLiver", "Печінковий контекст"],
      kidney: ["labSystemKidney", "Нирки та електроліти"],
      hormonal: ["labSystemHormonal", "Гормональний контекст"],
      recovery: ["labSystemRecovery", "Відновлення та білковий статус"]
    };
    const item = titles[key] || ["", key];
    return translateLabKey(item[0], item[1]);
  }

  function getLabSystemSummary(system) {
    if (system.severity === "critical") {
      return translateLabKey("labSystemCritical", "Є маркер, який потребує пріоритетної медичної оцінки.");
    }
    if (system.severity === "attention") {
      return translateLabKey("labSystemAttention", "Є відхилення, яке варто оцінити разом з іншими показниками та симптомами.");
    }
    if (system.severity === "info") {
      return translateLabKey("labSystemContext", "Показники потребують контексту референсів, підготовки або пов’язаних маркерів.");
    }
    return translateLabKey("labSystemStable", "За базовими правилами явних сигналів не виявлено; важливими залишаються референси лабораторії та динаміка.");
  }

  function renderLabReview(review) {
    const systemsMarkup = (review.systems || []).map(function (system) {
      return (
        '<article class="lab-system-card lab-system-' + system.severity + '">' +
          '<div class="protocol-card-top">' +
            '<h4>' + getLabSystemTitle(system.key) + '</h4>' +
            '<span>' + system.enteredCount + '</span>' +
          '</div>' +
          '<p>' + getLabSystemSummary(system) + '</p>' +
        '</article>'
      );
    }).join("");

    const findingsMarkup = review.findings.length
      ? review.findings.map(function (item) {
          return (
            '<article class="lab-finding lab-finding-' + item.severity + '">' +
              '<div class="protocol-card-top">' +
                '<h4>' + item.marker + '</h4>' +
                '<span>' + item.value + '</span>' +
              '</div>' +
              '<strong>' + item.title + '</strong>' +
              '<p>' + item.text + '</p>' +
              '<small>' + item.action + '</small>' +
            '</article>'
          );
        }).join("")
      : '<div class="tip-item">За введеними значеннями немає явних лабораторних стоп-сигналів. Це не скасовує референси лабораторії, симптоми і консультацію лікаря.</div>';

    const lifestyleMarkup = review.enteredCount
      ? (
        '<section class="lab-lifestyle-panel">' +
          '<span class="section-label">' + translateLabKey("labLifestyleLabel", "Динаміка показників") + '</span>' +
          '<h3>' + translateLabKey("labLifestyleTitle", "Харчування й активність можуть суттєво покращити частину аналізів") + '</h3>' +
          '<p class="lab-lifestyle-lead">' + translateLabKey("labLifestyleLead", "Стабільні зміни раціону, щоденної рухливості, тренувань, сну та маси тіла можуть через певний час помітно змінити частину показників у кращу сторону. Результат оцінюють у динаміці, а не за одним днем.") + '</p>' +
          '<div class="lab-lifestyle-grid">' +
            '<article><strong>' + translateLabKey("labLifestyleNutritionTitle", "Харчування") + '</strong><p>' + translateLabKey("labLifestyleNutritionText", "Контроль калорій, достатній білок і клітковина, менше надлишку цукру, алкоголю, трансжирів і насичених жирів можуть покращувати глюкозу, тригліцериди, частину ліпідного та печінкового профілю.") + '</p></article>' +
            '<article><strong>' + translateLabKey("labLifestyleActivityTitle", "Активність") + '</strong><p>' + translateLabKey("labLifestyleActivityText", "Регулярна ходьба, аеробне навантаження та силові тренування можуть покращувати чутливість до інсуліну, контроль глюкози, ліпіди, тиск і загальну метаболічну картину.") + '</p></article>' +
            '<article><strong>' + translateLabKey("labLifestyleTimeTitle", "Потрібен час") + '</strong><p>' + translateLabKey("labLifestyleTimeText", "Частина маркерів реагує протягом кількох тижнів, іншим потрібні місяці. HbA1c відображає середню глюкозу приблизно за попередні 2-3 місяці, тому швидка перездача може не показати повний ефект.") + '</p></article>' +
            '<article><strong>' + translateLabKey("labLifestyleLimitsTitle", "Не все вирішується способом життя") + '</strong><p>' + translateLabKey("labLifestyleLimitsText", "Виражені дефіцити, значні гормональні, ниркові, запальні або інші небезпечні відхилення не можна просто чекати або виправляти дієтою. Для них потрібні лікар, уточнення причини й контрольний план.") + '</p></article>' +
          '</div>' +
          '<div class="tip-item">' + translateLabKey("labLifestyleFollowup", "Практичний крок: зафіксувати вихідні результати, узгодити зміни харчування й активності, дотримуватися плану та повторити вибрані аналізи у термін, який визначить лікар. Порівнювати потрібно однакові одиниці, схожі умови здачі й бажано ту саму лабораторію.") + '</div>' +
        '</section>'
      )
      : "";

    labReviewResult.innerHTML =
      '<div class="lab-status lab-status-' + review.status + '">' +
        '<span>' + (review.status === "red" ? "червоний" : review.status === "yellow" ? "жовтий" : review.status === "neutral" ? "нейтральний" : "зелений") + ' статус</span>' +
        '<h3>' + review.title + '</h3>' +
        '<p>' + review.summary + '</p>' +
        '<div class="lab-review-meta">' +
          '<strong>Дата: ' + (review.reviewDate || "не вказано") + '</strong>' +
          '<strong>Умови: ' + getLabFastingLabel(review.fasting) + '</strong>' +
          '<strong>' + translateLabKey("labEnteredCount", "Введено показників") + ': ' + (review.enteredCount || 0) + '</strong>' +
        '</div>' +
      '</div>' +
      (systemsMarkup
        ? '<section class="lab-report-section"><h3>' + translateLabKey("labSystemsTitle", "Підсумок за системами") + '</h3><div class="lab-system-grid">' + systemsMarkup + '</div></section>'
        : '') +
      '<section class="lab-report-section"><h3>' + translateLabKey("labMarkersTitle", "Детальна оцінка кожного введеного показника") + '</h3>' +
      '<div class="lab-findings-grid">' + findingsMarkup + '</div>' +
      '</section>' +
      lifestyleMarkup +
      '<div class="tip-item">' + getLabPreparationNote(review.fasting) + '</div>' +
      '<p class="result-note">Орієнтири в цьому блоці не замінюють референсні межі лабораторії. На результати впливають підготовка, час забору, важкі тренування напередодні, ліки, цикл, вагітність, лактація, сон і гострий стрес.</p>';

    if (labReviewExportActions) {
      labReviewExportActions.hidden = false;
    }
  }

  if (labReviewForm && labReviewResult) {
    labReviewForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!activeLabProtocol) {
        setReviewGateState(null);
        if (labReviewPanel) labReviewPanel.open = true;
        labReviewResult.innerHTML =
          '<div class="result-placeholder">Спочатку сформуй Bloodwork Protocol вище. Після цього тут з’являться потрібні поля для оцінки.</div>';
        return;
      }

      const formData = new FormData(labReviewForm);
      const data = Object.fromEntries(formData.entries());
      const review = evaluateLabResults(data);

      renderLabReview(review);
    });
  }

  if (labReviewReset && labReviewForm && labReviewResult) {
    labReviewReset.addEventListener("click", function () {
      labReviewForm.reset();
      setReviewGateState(activeLabProtocol);
      syncReviewFemaleFieldsFromModule();
      labReviewResult.innerHTML =
        '<div class="result-placeholder">Введи показники з бланку, щоб отримати спортивну оцінку ризиків.</div>';
    });
  }

  setReviewGateState(null);


  system.labProtocols = {
    buildLabProtocol: buildLabProtocol,
    renderLabProtocol: renderLabProtocol,
    evaluateLabResults: evaluateLabResults,
    renderLabReview: renderLabReview,
    getLabFastingLabel: getLabFastingLabel,
    getLabPreparationNote: getLabPreparationNote
  };

  window.VitalRiseSystem = system;
})();
