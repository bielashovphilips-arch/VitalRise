(function () {
  const system = window.VitalRiseSystem || {};
  const $ = system.$ || function (id) { return document.getElementById(id); };
  const storage = system.storage || null;
  const correctionKey = storage && storage.keys
    ? storage.keys.nutritionCorrection
    : "vitalrise:nutrition:active-correction";
  const historyKey = storage && storage.keys
    ? storage.keys.progressHistory
    : "vitalrise:progress:history";

  const progressForm = $("progress-form");
  const progressResult = $("progress-result");
  const progressReset = $("progress-reset");
  const checkinModeField = $("checkin-mode");
  const progressModeNote = $("progress-mode-note");

  function parseProgressNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(String(value).replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }

  function getJson(key, fallback) {
    if (storage) return storage.getJson(key, fallback);

    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function setJson(key, value) {
    if (storage) return storage.setJson(key, value);

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatAdjustment(value) {
    const rounded = Math.round(Number(value) || 0);
    if (!rounded) return "0 ккал";
    return (rounded > 0 ? "+" : "") + rounded + " ккал";
  }

  function buildCorrection(goal, calorieAdjustment, reason) {
    const delta = Math.round(Number(calorieAdjustment) || 0);
    const current = getJson(correctionKey, null);
    const currentAdjustment = current && current.goal === goal
      ? Math.round(Number(current.calorieAdjustment) || 0)
      : 0;
    const adjustment = Math.max(-250, Math.min(200, currentAdjustment + delta));

    return {
      goal: goal,
      calorieAdjustment: adjustment,
      carbAdjustment: Math.round(adjustment / 4),
      reason: reason + " Активна сумарна поправка: " + formatAdjustment(adjustment) + ".",
      updatedAt: new Date().toISOString(),
      source: "14-day-check-in"
    };
  }

  function readProgressData(data) {
    const rawMode = data["checkin-mode"];
    const mode = rawMode === "biweekly" || rawMode === "monthly" ? "biweekly" : "weekly";

    return {
      mode,
      goal: data["progress-goal"] || "recomp",
      weightChange: parseProgressNumber(data["weight-change"]),
      waistChange: parseProgressNumber(data["waist-change"]),
      strengthTrend: data["strength-trend"] || "stable",
      sleepHours: parseProgressNumber(data["sleep-score"]),
      energy: data["energy-score"] || "medium",
      steps: parseProgressNumber(data["steps-average"]),
      adherence: parseProgressNumber(data["nutrition-adherence"]),
      hunger: data["hunger-level"] || "controlled"
    };
  }

  function getEnteredMetrics(metrics) {
    return [
      metrics.weightChange,
      metrics.waistChange,
      metrics.sleepHours,
      metrics.steps,
      metrics.adherence
    ].filter(function (value) {
      return value !== null;
    });
  }

  function collectBaseSignals(metrics) {
    const positives = [];
    const risks = [];
    const actions = [];

    if (metrics.adherence !== null && metrics.adherence < 80) {
      risks.push("Дотримання раціону нижче 80%: спочатку варто стабілізувати виконання плану.");
      actions.push("Спростити меню і тримати один і той самий план без додаткового урізання калорій.");
    }

    if (metrics.sleepHours !== null && metrics.sleepHours < 6.5) {
      risks.push("Сон нижче 6.5 год: вода, апетит і силові можуть маскувати реальний прогрес.");
      actions.push("Підняти сон хоча б на 30-45 хв у середньому.");
    }

    if (metrics.energy === "low") {
      risks.push("Низька енергія: можливий дефіцит відновлення або накопичена втома.");
    }

    if (metrics.strengthTrend === "up") positives.push("Силові ростуть: тренувальний стимул працює.");
    if (metrics.strengthTrend === "stable") positives.push("Силові стабільні: це хороший сигнал для рекомпозиції або зниження ваги.");
    if (metrics.strengthTrend === "down") risks.push("Силові падають: перевір сон, втому, техніку і загальний обсяг навантаження.");

    if (metrics.waistChange !== null && metrics.waistChange <= -0.3) positives.push("Талія рухається вниз: є ознака втрати жиру.");
    if (metrics.waistChange !== null && metrics.waistChange >= 0.5) risks.push("Талія виросла: можливий перебір, затримка води, цикл або слабке дотримання.");

    if (metrics.goal === "cut") {
      actions.push("Для зниження ваги кроки за день є ключовим фактором: вони підтримують витрати енергії без додаткового стресу від тренувань.");
      actions.push("Навіть при крепатурі залишай легку ходьбу: вона покращує кровообіг, м’яко прискорює відновлення і допомагає не випадати з дефіциту.");
    }

    if (metrics.steps !== null && metrics.steps < 6500 && (metrics.goal === "cut" || metrics.goal === "recomp")) {
      actions.push("Поступово підняти середні кроки до 7500-9000 без різкого стрибка.");
    }

    return { positives, risks, actions };
  }

  function buildWeeklyDecision(metrics) {
    const signals = collectBaseSignals(metrics);
    const enteredMetrics = getEnteredMetrics(metrics);
    const positives = signals.positives;
    const risks = signals.risks;
    const actions = signals.actions;
    let status = "green";
    let title = "Тримати курс";
    let summary = "Це щотижневий контроль: він допомагає бачити рух, але не змінює калорії.";

    if (!enteredMetrics.length) {
      status = "neutral";
      title = "Потрібні дані за тиждень";
      summary = "Введи хоча б вагу, талію, сон, кроки або дотримання раціону.";
      actions.push("Зібрати дані за тиждень і повторити check-in.");
      return { status, title, summary, positives, risks, actions, correction: null, mode: "weekly" };
    }

    if (metrics.adherence !== null && metrics.adherence < 80) {
      status = "yellow";
      title = "Спочатку дисципліна";
      summary = "Зараз проблема може бути не в калоріях, а в нестабільному виконанні плану.";
    } else if (metrics.strengthTrend === "down" && (metrics.energy === "low" || (metrics.sleepHours !== null && metrics.sleepHours < 7))) {
      status = "yellow";
      title = "Підтягнути відновлення";
      summary = "На цьому тижні не треба урізати раціон. Краще прибрати втому і вирівняти сон.";
      actions.push("Зробити легший тренувальний тиждень або не форсувати прогресію ваг.");
    } else if (metrics.goal === "recomp" && metrics.waistChange !== null && metrics.waistChange <= -0.3 && metrics.strengthTrend !== "down") {
      title = "Рекомпозиція має позитивний сигнал";
      summary = "Талія рухається вниз, силові не падають. Калорії залишаються без змін.";
      actions.push("Тримати той самий раціон до 14-денного контролю.");
    } else if (metrics.goal === "cut" && metrics.weightChange !== null && metrics.weightChange < -1.2 && (metrics.energy === "low" || metrics.hunger === "high")) {
      status = "yellow";
      title = "Темп може бути завеликий";
      summary = "За один тиждень ще не міняємо калорії, але слідкуємо за відновленням.";
      actions.push("Не урізати додатково. Перевірити сон, воду, сіль і голод.");
    } else {
      actions.push("Не змінювати калорії цього тижня. Повторити check-in через 7 днів.");
    }

    return { status, title, summary, positives, risks, actions, correction: null, mode: "weekly" };
  }

  function buildBiweeklyDecision(metrics) {
    const signals = collectBaseSignals(metrics);
    const enteredMetrics = getEnteredMetrics(metrics);
    const positives = signals.positives;
    const risks = signals.risks;
    const actions = signals.actions;
    let correction = null;
    let status = "green";
    let title = "Залишити раціон";
    let summary = "За 14-денними даними немає причини різко змінювати план.";

    if (!enteredMetrics.length) {
      status = "neutral";
      title = "Потрібні контрольні заміри";
      summary = "Введи зміну ваги, талії, силових, сну і дотримання раціону за 14 днів.";
      actions.push("Зробити контрольні заміри в однакових умовах: ранок, після туалету, до їжі.");
      return { status, title, summary, positives, risks, actions, correction: null, mode: "biweekly" };
    }

    const canChangeCalories = metrics.adherence === null || metrics.adherence >= 80;

    if (metrics.goal === "recomp") {
      if (metrics.waistChange !== null && metrics.waistChange <= -0.5 && metrics.strengthTrend !== "down") {
        status = "green";
        title = "Рекомпозиція йде правильно";
        summary = "Талія зменшується, а силові не падають. Калорії краще залишити без змін.";
        actions.push("Залишити поточний раціон ще на 14 днів.");
      } else if (
        canChangeCalories &&
        metrics.waistChange !== null &&
        Math.abs(metrics.waistChange) < 0.3 &&
        metrics.weightChange !== null &&
        Math.abs(metrics.weightChange) < 0.6 &&
        metrics.strengthTrend !== "up"
      ) {
        status = "yellow";
        title = "Потрібна невелика корекція";
        summary = "За 14 днів талія і вага майже не змінились. Раціон буде зменшено м’яко.";
        correction = buildCorrection(metrics.goal, -100, "Талія і вага стоять 14 днів при достатньому дотриманні.");
        actions.push("Наступний раціон автоматично рахуватиметься на 100 ккал нижче.");
      } else if (canChangeCalories && metrics.waistChange !== null && metrics.waistChange >= 0.5 && metrics.weightChange !== null && metrics.weightChange > 0) {
        status = "yellow";
        title = "Прибрати зайвий надлишок";
        summary = "Вага і талія ростуть разом. Для рекомпозиції це сигнал зменшити енергію.";
        correction = buildCorrection(metrics.goal, -100, "Вага і талія виросли за 14 днів.");
        actions.push("Наступний раціон автоматично рахуватиметься на 100 ккал нижче.");
      } else if (metrics.strengthTrend === "down" && (metrics.energy === "low" || metrics.hunger === "high")) {
        status = "yellow";
        title = "Не урізати калорії";
        summary = "Силові або самопочуття просіли. Зараз важливіше відновлення.";
        correction = buildCorrection(metrics.goal, 75, "Силові/енергія просіли на рекомпозиції.");
        actions.push("Наступний раціон буде трохи вищим: +75 ккал переважно з вуглеводів.");
      } else {
        actions.push("Залишити калорії та повторити контроль через 14 днів.");
      }
    }

    if (metrics.goal === "cut") {
      if (canChangeCalories && metrics.waistChange !== null && metrics.waistChange >= -0.2 && metrics.weightChange !== null && metrics.weightChange > -0.5) {
        status = "yellow";
        title = "Дефіцит замалий";
        summary = "За 14 днів талія і вага майже не знизились. Потрібна помірна корекція.";
        correction = buildCorrection(metrics.goal, -100, "Недостатня зміна ваги/талії за 14 днів.");
        actions.push("Наступний раціон автоматично рахуватиметься на 100 ккал нижче.");
      } else if (metrics.weightChange !== null && metrics.weightChange < -2.5 && (metrics.strengthTrend === "down" || metrics.energy === "low" || metrics.hunger === "high")) {
        status = "red";
        title = "Дефіцит занадто агресивний";
        summary = "Вага падає швидко, але відновлення просідає. Треба зменшити тиск на організм.";
        correction = buildCorrection(metrics.goal, 100, "Занадто швидке зниження ваги з просіданням відновлення.");
        actions.push("Наступний раціон буде на 100 ккал вище.");
      } else {
        actions.push("Залишити дефіцит без змін і повторити контроль через 14 днів.");
      }
    }

    if (metrics.goal === "gain") {
      if (canChangeCalories && metrics.weightChange !== null && metrics.weightChange < 0.25 && metrics.strengthTrend !== "up") {
        status = "yellow";
        title = "Енергії може не вистачати";
        summary = "За 14 днів вага і силові майже не рухаються. Для набору потрібен невеликий плюс.";
        correction = buildCorrection(metrics.goal, 100, "Немає росту ваги/силових за 14 днів.");
        actions.push("Наступний раціон автоматично рахуватиметься на 100 ккал вище.");
      } else if (canChangeCalories && metrics.weightChange !== null && metrics.weightChange > 1.5 && metrics.waistChange !== null && metrics.waistChange > 1) {
        status = "yellow";
        title = "Набір занадто швидкий";
        summary = "Вага і талія ростуть надто активно. Потрібно зменшити надлишок.";
        correction = buildCorrection(metrics.goal, -100, "Надто швидкий ріст ваги і талії.");
        actions.push("Наступний раціон автоматично рахуватиметься на 100 ккал нижче.");
      } else {
        actions.push("Залишити профіцит і повторити контроль через 14 днів.");
      }
    }

    if (metrics.goal === "maintain") {
      if (canChangeCalories && metrics.waistChange !== null && metrics.waistChange > 0.7) {
        status = "yellow";
        title = "Підтримка завелика";
        summary = "Талія росте на підтримці. Потрібна невелика корекція вниз.";
        correction = buildCorrection(metrics.goal, -100, "Талія росте на підтримці.");
        actions.push("Наступний раціон автоматично рахуватиметься на 100 ккал нижче.");
      } else {
        actions.push("Залишити підтримку без змін.");
      }
    }

    if (!actions.length) {
      actions.push("Повторити контроль через 14 днів з тими самими метриками.");
    }

    return { status, title, summary, positives, risks, actions, correction, mode: "biweekly" };
  }

  function buildProgressDecision(data) {
    const metrics = readProgressData(data);
    return metrics.mode === "biweekly" ? buildBiweeklyDecision(metrics) : buildWeeklyDecision(metrics);
  }

  function saveProgressDecision(data, decision) {
    const history = getJson(historyKey, []);
    const nextHistory = Array.isArray(history) ? history.slice(-15) : [];

    nextHistory.push({
      createdAt: new Date().toISOString(),
      mode: decision.mode,
      data: data,
      decision: {
        status: decision.status,
        title: decision.title,
        summary: decision.summary,
        correction: decision.correction || null
      }
    });

    setJson(historyKey, nextHistory);

    if (decision.mode === "biweekly" && decision.correction) {
      setJson(correctionKey, decision.correction);
    }
  }

  function buildCorrectionMarkup(decision) {
    if (decision.mode === "weekly") {
      const existingCorrection = getJson(correctionKey, null);
      return (
        '<div class="nutrition-correction-card neutral">' +
          '<span class="section-label">Щотижневий контроль</span>' +
          '<h4>Калорії не змінюються</h4>' +
          '<p>Цей режим потрібен для контролю дисципліни, води, сну, кроків і тренувань. Активна поправка раціону не перезаписується.</p>' +
          (existingCorrection
            ? '<small>Поточна збережена поправка після 14-денного контролю: ' + formatAdjustment(existingCorrection.calorieAdjustment) + '.</small>'
            : '<small>Активної 14-денної поправки ще немає.</small>') +
        '</div>'
      );
    }

    const existingCorrection = getJson(correctionKey, null);
    const correctionToShow = decision.correction || existingCorrection;

    if (!correctionToShow) {
      return (
        '<div class="nutrition-correction-card neutral">' +
          '<span class="section-label">Активна корекція раціону</span>' +
          '<h4>Без нової зміни калорій</h4>' +
          '<p>Активної поправки ще немає. Наступний раціон рахуватиметься від базової формули.</p>' +
        '</div>'
      );
    }

    return (
      '<div class="nutrition-correction-card">' +
        '<span class="section-label">Активна корекція раціону</span>' +
        '<h4>' + formatAdjustment(correctionToShow.calorieAdjustment) + '</h4>' +
        '<p>' + escapeHtml(correctionToShow.reason) + '</p>' +
        '<small>Наступний розрахунок харчування автоматично врахує цю поправку. Білок залишається стабільним, зміна йде переважно через вуглеводи.</small>' +
      '</div>'
    );
  }

  function renderProgressDecision(decision) {
    const positivesMarkup = decision.positives.length
      ? decision.positives.map(function (item) {
          return '<div class="tip-item positive">' + escapeHtml(item) + '</div>';
        }).join("")
      : '<div class="tip-item">Позитивні сигнали з’являться після стабільних даних.</div>';

    const risksMarkup = decision.risks.length
      ? decision.risks.map(function (item) {
          return '<div class="tip-item">' + escapeHtml(item) + '</div>';
        }).join("")
      : '<div class="tip-item positive">Критичних ризиків за введеними даними не видно.</div>';

    const actionsMarkup = decision.actions
      .map(function (item, index) {
        return (
          '<article class="progress-action">' +
            '<span>' + String(index + 1).padStart(2, "0") + '</span>' +
            '<p>' + escapeHtml(item) + '</p>' +
          '</article>'
        );
      })
      .join("");

    const periodTitle = decision.mode === "biweekly"
      ? "Рішення на наступні 14 днів"
      : "Рішення на наступні 7 днів";
    const resultNote = decision.mode === "biweekly"
      ? "14-денний контроль може змінити активну поправку раціону. Заміри роби в однакових умовах: ранок, після туалету, до їжі."
      : "Щотижневий check-in не змінює калорії. Він потрібен, щоб не губити курс і бачити, що саме варто підтягнути цього тижня.";

    progressResult.innerHTML =
      '<div class="lab-status lab-status-' + decision.status + '">' +
        '<span>' + (decision.status === "red" ? "корекція" : decision.status === "yellow" ? "увага" : decision.status === "neutral" ? "дані" : "курс") + '</span>' +
        '<h3>' + escapeHtml(decision.title) + '</h3>' +
        '<p>' + escapeHtml(decision.summary) + '</p>' +
      '</div>' +
      buildCorrectionMarkup(decision) +
      '<div class="progress-columns">' +
        '<div><h4 class="result-subtitle">Сильні сигнали</h4><div class="tip-list">' + positivesMarkup + '</div></div>' +
        '<div><h4 class="result-subtitle">Ризики</h4><div class="tip-list">' + risksMarkup + '</div></div>' +
      '</div>' +
      '<h4 class="result-subtitle">' + periodTitle + '</h4>' +
      '<div class="progress-actions">' + actionsMarkup + '</div>' +
      '<p class="result-note">' + resultNote + '</p>';
  }

  function syncProgressModeText() {
    if (!checkinModeField || !progressModeNote) return;

    if (checkinModeField.value === "biweekly" || checkinModeField.value === "monthly") {
      progressModeNote.textContent = "Контроль 14 днів може зберегти активну поправку, і наступний раціон буде рахуватися вже з нею.";
      return;
    }

    progressModeNote.textContent = "Щотижня сайт дає рішення по дисципліні, воді, сну, кроках і тренуваннях, але не змінює калорії.";
  }

  if (checkinModeField) {
    checkinModeField.addEventListener("change", syncProgressModeText);
    syncProgressModeText();
  }

  if (progressForm && progressResult) {
    progressForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(progressForm);
      const data = Object.fromEntries(formData.entries());
      const decision = buildProgressDecision(data);

      saveProgressDecision(data, decision);
      renderProgressDecision(decision);
    });
  }

  if (progressReset && progressForm && progressResult) {
    progressReset.addEventListener("click", function () {
      progressForm.reset();
      syncProgressModeText();
      progressResult.innerHTML =
        '<div class="result-placeholder">Обери режим контролю і заповни дані, щоб отримати рішення.</div>';
    });
  }

  system.progressDecision = {
    buildProgressDecision: buildProgressDecision,
    renderProgressDecision: renderProgressDecision
  };

  window.VitalRiseSystem = system;
})();
