(function () {
  const system = window.VitalRiseSystem || {};
  const $ = system.$ || function (id) { return document.getElementById(id); };

  function padRank(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function buildBlueprint(data) {
    const goal = data["blueprint-goal"] || "recomp";
    const level = data["blueprint-level"] || "beginner";
    const nutrition = data["blueprint-nutrition"] || "stable";
    const training = data["blueprint-training"] || "progressing";
    const labs = data["blueprint-labs"] || "unknown";
    const progress = data["blueprint-progress"] || "unknown";
    const recovery = data["blueprint-recovery"] || "medium";
    const supplements = data["blueprint-supplements"] || "minimal";

    const priorities = [];
    const protocol = [];
    const fourWeeks = [];

    function addPriority(rank, title, text) {
      priorities.push({ rank: rank, title: title, text: text });
    }

    function addNextPriority(title, text) {
      addPriority(padRank(priorities.length + 1), title, text);
    }

    if (labs === "red") {
      addPriority("01", "Медичний стоп-сигнал", "Не форсувати сушку, набір або стимулятори, доки червоні лабораторні маркери не обговорені з лікарем.");
    } else if (labs === "yellow") {
      addPriority("01", "Лабораторний контроль", "Маркер уваги може гальмувати рекомпозицію через енергію, відновлення або гормональний фон.");
    } else if (labs === "unknown") {
      addPriority("01", "Здати базову панель", "Перед агресивним циклом варто знати феритин, 25(OH)D, глюкозу/HbA1c, TSH, печінку, нирки й гормони за статтю.");
    }

    if (recovery === "poor") {
      addNextPriority("Відновлення", "Сон і втома зараз важливіші за додаткове кардіо або нові добавки.");
      protocol.push("Полегшити тренувальний об’єм на 20-30% на 1 тиждень.");
    }

    if (nutrition !== "stable") {
      addNextPriority("Стабілізувати харчування", "Без 80-90% дотримання раціону зміна калорій буде шумом, а не керуванням.");
      protocol.push("Зібрати 3-5 повторюваних прийомів їжі та закрити білок.");
    }

    if (training === "too_much") {
      addNextPriority("Прибрати зайву втому", "Більше навантаження не дорівнює кращій рекомпозиції, якщо силові падають і сон слабкий.");
      protocol.push("Залишити базові вправи, але зменшити допоміжний об’єм.");
    } else if (training === "flat") {
      addNextPriority("Повернути прогресію", "Тіло змінюється краще, коли є зрозумілий стимул у силових або об’ємі.");
      protocol.push("Додати контрольовану прогресію: +1 повтор або +1-2.5 кг за чистої техніки.");
    }

    if (progress === "plateau") {
      protocol.push(goal === "cut"
        ? "Якщо дотримання раціону нормальне: -100-150 ккал або +1500 кроків."
        : "На плато рекомпозиції міняти тільки один важіль: кроки, калорії або прогресію.");
    }

    if (supplements === "random") {
      protocol.push("Очистити спортпіт: залишити тільки те, що має причину, дозу і маркер контролю.");
    }

    if (!priorities.length) {
      addPriority("01", "Тримати курс", "Система виглядає стабільною: головне не розхитувати план зайвими правками.");
    }

    if (goal === "recomp") {
      fourWeeks.push("Тиждень 1: стабілізувати білок, сон і 3-4 силові тренування.");
      fourWeeks.push("Тиждень 2: тримати калорії, додати прогресію в базових вправах.");
      fourWeeks.push("Тиждень 3: оцінити талію, силові й середню вагу.");
      fourWeeks.push("Тиждень 4: міняти тільки один важіль, якщо є плато.");
    } else if (goal === "cut") {
      fourWeeks.push("Тиждень 1: підтвердити дефіцит без падіння силових.");
      fourWeeks.push("Тиждень 2: стабілізувати кроки й сон.");
      fourWeeks.push("Тиждень 3: коригувати -100-150 ккал тільки за плато.");
      fourWeeks.push("Тиждень 4: перевірити втому і потребу в diet break.");
    } else if (goal === "gain") {
      fourWeeks.push("Тиждень 1: профіцит без різкого росту талії.");
      fourWeeks.push("Тиждень 2: прогресія в базових вправах.");
      fourWeeks.push("Тиждень 3: додати 100-200 ккал тільки якщо вага і сила стоять.");
      fourWeeks.push("Тиждень 4: оцінити талію, фото і силові.");
    } else {
      fourWeeks.push("Тиждень 1: стабілізувати графік тренувань.");
      fourWeeks.push("Тиждень 2: підняти якість сну і розминки.");
      fourWeeks.push("Тиждень 3: додати прогресію без втрати техніки.");
      fourWeeks.push("Тиждень 4: зробити контрольний check-in.");
    }

    if (level === "beginner") protocol.push("Не ускладнювати: 80% результату дасть стабільність бази.");
    if (level === "advanced") protocol.push("Для просунутого рівня головний ризик — зайвий об’єм без відновлення.");

    return {
      goal: goal,
      generatedAt: new Date().toLocaleDateString("uk-UA"),
      priorities: priorities.slice(0, 3),
      protocol: protocol.slice(0, 5),
      fourWeeks: fourWeeks
    };
  }

  function getBlueprintGoalTitle(goal) {
    const titles = {
      recomp: "Рекомпозиція",
      cut: "Зниження жиру",
      gain: "Набір м'язів",
      performance: "Сила / продуктивність"
    };

    return titles[goal] || "Персональний фокус";
  }

  function renderBlueprint(blueprint, elements) {
    const blueprintResult = elements && elements.result ? elements.result : $("blueprint-result");
    const blueprintPrint = elements && elements.print ? elements.print : $("blueprint-print");
    if (!blueprintResult) return;

    const priorityMarkup = blueprint.priorities
      .map(function (item) {
        return (
          '<article class="blueprint-priority">' +
            '<span>' + item.rank + '</span>' +
            '<h4>' + item.title + '</h4>' +
            '<p>' + item.text + '</p>' +
          '</article>'
        );
      })
      .join("");

    const protocolMarkup = blueprint.protocol.length
      ? blueprint.protocol.map(function (item) {
          return '<div class="tip-item">' + item + '</div>';
        }).join("")
      : '<div class="tip-item positive">Система стабільна. Повторюй check-in і не міняй план без причини.</div>';

    const weeksMarkup = blueprint.fourWeeks
      .map(function (item, index) {
        return (
          '<article class="blueprint-week">' +
            '<span>W' + (index + 1) + '</span>' +
            '<p>' + item + '</p>' +
          '</article>'
        );
      })
      .join("");

    blueprintResult.innerHTML =
      '<div class="blueprint-passport">' +
        '<div class="lab-status lab-status-green">' +
          '<span>passport</span>' +
          '<h3>Athlete Blueprint активовано</h3>' +
          '<p>Це короткий порядок дій: спочатку блокери, потім стабільність, потім прогресія.</p>' +
          '<div class="blueprint-passport-meta">' +
            '<strong>' + getBlueprintGoalTitle(blueprint.goal) + '</strong>' +
            '<small>Сформовано: ' + blueprint.generatedAt + '</small>' +
          '</div>' +
        '</div>' +
        '<h4 class="result-subtitle">Головні пріоритети</h4>' +
        '<div class="blueprint-priority-grid">' + priorityMarkup + '</div>' +
        '<h4 class="result-subtitle">Протокол рішень</h4>' +
        '<div class="tip-list">' + protocolMarkup + '</div>' +
        '<h4 class="result-subtitle">4-тижневий фокус</h4>' +
        '<div class="blueprint-weeks">' + weeksMarkup + '</div>' +
      '</div>';

    if (blueprintPrint) {
      blueprintPrint.disabled = false;
    }
  }

  function initBlueprint() {
    const blueprintForm = $("blueprint-form");
    const blueprintResult = $("blueprint-result");
    const blueprintReset = $("blueprint-reset");
    const blueprintPrint = $("blueprint-print");

    if (blueprintForm && blueprintResult) {
      blueprintForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(blueprintForm);
        const data = Object.fromEntries(formData.entries());
        const blueprint = buildBlueprint(data);

        renderBlueprint(blueprint, {
          result: blueprintResult,
          print: blueprintPrint
        });
      });
    }

    if (blueprintReset && blueprintForm && blueprintResult) {
      blueprintReset.addEventListener("click", function () {
        blueprintForm.reset();
        if (blueprintPrint) blueprintPrint.disabled = true;
        blueprintResult.innerHTML =
          '<div class="result-placeholder">Обери стан системи, щоб отримати паспорт пріоритетів.</div>';
      });
    }
  }

  system.blueprint = {
    buildBlueprint: buildBlueprint,
    getBlueprintGoalTitle: getBlueprintGoalTitle,
    renderBlueprint: renderBlueprint
  };
  system.initBlueprint = initBlueprint;
  window.VitalRiseSystem = system;

  document.addEventListener("DOMContentLoaded", initBlueprint);
})();
