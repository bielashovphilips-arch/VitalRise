(function () {
  const system = window.VitalRiseSystem || {};
  const storage = system.storage;
  const $ = system.$ || function (id) { return document.getElementById(id); };

  const keys = {
    timeline: "vitalrise:coach:timeline",
    planFact: "vitalrise:coach:plan-fact",
    checkins: "vitalrise:coach:checkins",
    calendar: "vitalrise:coach:calendar",
    trainingLogs: "vitalrise:coach:training-logs"
  };

  const presets = {
    recomp: {
      label: "Recomp",
      profileGoal: "recomp",
      trainingGoal: "strength",
      nutritionGoal: "recomp",
      level: "intermediate",
      days: "3",
      note: "Баланс сили, стабільного білка і контрольованого дефіциту/підтримки."
    },
    cut: {
      label: "Cut",
      profileGoal: "cut",
      trainingGoal: "fatloss",
      nutritionGoal: "cut",
      level: "intermediate",
      days: "4",
      note: "Зберегти силу, тримати кроки і не робити дефіцит агресивним."
    },
    gain: {
      label: "Lean Gain",
      profileGoal: "gain",
      trainingGoal: "mass",
      nutritionGoal: "gain",
      level: "intermediate",
      days: "4",
      note: "Повільний набір, прогресія навантажень і контроль талії."
    },
    street: {
      label: "Street Strength",
      profileGoal: "performance",
      trainingGoal: "strength",
      nutritionGoal: "maintain",
      level: "advanced",
      days: "4",
      place: "outdoor",
      note: "Турнік, бруси, обсяг без втрати амплітуди."
    }
  };

  function getJson(key, fallback) {
    return storage ? storage.getJson(key, fallback) : fallback;
  }

  function setJson(key, value) {
    if (storage) storage.setJson(key, value);
  }

  function byDateDesc(a, b) {
    return String(b.date || "").localeCompare(String(a.date || ""));
  }

  function number(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function setField(id, value) {
    const field = $(id);
    if (!field || value === undefined || value === null) return;
    field.value = value;
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function scrollToPresetChanges() {
    const target = $("dashboard") || $("calculator");
    const profilePanel = $("athlete-profile-form");

    if (profilePanel) {
      profilePanel.classList.add("profile-panel-highlight");
      window.setTimeout(function () {
        profilePanel.classList.remove("profile-panel-highlight");
      }, 1800);
    }

    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (target) {
      window.location.hash = "#" + target.id;
    }
  }

  function getTimeline() {
    return getJson(keys.timeline, []);
  }

  function getPlanFact() {
    return getJson(keys.planFact, []);
  }

  function getCheckins() {
    return getJson(keys.checkins, []);
  }

  function getCalendar() {
    return getJson(keys.calendar, []);
  }

  function getTrainingLogs() {
    return getJson(keys.trainingLogs, []);
  }

  function saveEntry(key, entry) {
    const items = getJson(key, []);
    const next = [entry].concat(items).slice(0, 24);
    setJson(key, next);
    return next;
  }

  function average(values) {
    const clean = values.filter(function (value) { return Number.isFinite(value); });
    if (!clean.length) return null;
    return clean.reduce(function (sum, value) { return sum + value; }, 0) / clean.length;
  }

  function trend(values) {
    const clean = values.filter(function (value) { return Number.isFinite(value); });
    if (clean.length < 2) return 0;
    return clean[0] - clean[clean.length - 1];
  }

  function getTrainingVolume(item) {
    return number(item.sets, 0) * number(item.reps, 0) * number(item.load, 0);
  }

  function normalizeExerciseName(name) {
    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function buildProgressionAdvice() {
    const logs = getTrainingLogs().slice().sort(byDateDesc);
    const groups = {};

    logs.forEach(function (item) {
      const key = normalizeExerciseName(item.exercise);
      if (!key) return;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    const advice = Object.keys(groups).map(function (key) {
      const items = groups[key].slice(0, 3);
      const current = items[0];
      const previous = items[1] || null;
      const currentVolume = getTrainingVolume(current);
      const previousVolume = previous ? getTrainingVolume(previous) : 0;
      const rpe = number(current.rpe, 0);
      let action = "Повтори цю саму роботу ще раз і збери другий запис.";
      let status = "steady";

      if (current.pain === "yes") {
        action = "Зменш вагу або амплітуду на 10-20% і не додавай обсяг до зникнення болю.";
        status = "risk";
      } else if (rpe >= 9) {
        action = "Повтори навантаження або зменш 1 підхід: RPE зависокий для прогресії.";
        status = "hold";
      } else if (previous && currentVolume > previousVolume && rpe <= 8) {
        action = "Можна додати 1 повтор у підході або +2.5 кг наступного разу.";
        status = "progress";
      } else if (previous && currentVolume < previousVolume * 0.9) {
        action = "Поверни попередній обсяг перед додаванням ваги.";
        status = "hold";
      } else if (previous && rpe <= 7) {
        action = "Додай невеликий крок: +1 повтор або +2.5 кг.";
        status = "progress";
      }

      return {
        exercise: current.exercise || key,
        status: status,
        volume: currentVolume,
        rpe: rpe || "-",
        action: action
      };
    });

    return advice.slice(0, 5);
  }

  function buildMiniChart(items, field, label, unit) {
    const recent = items.slice().sort(byDateDesc).slice(0, 8).reverse();
    const values = recent.map(function (item) { return number(item[field], NaN); }).filter(Number.isFinite);
    if (values.length < 2) {
      return '<div class="coach-chart-empty">Потрібно мінімум 2 записи для графіка ' + label + '.</div>';
    }

    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const span = Math.max(1, max - min);
    const points = values.map(function (value, index) {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
      const y = 90 - ((value - min) / span) * 75;
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");

    return (
      '<div class="coach-chart">' +
        '<div class="coach-chart-head"><span>' + label + '</span><strong>' + values[values.length - 1] + unit + '</strong></div>' +
        '<svg viewBox="0 0 100 100" role="img" aria-label="' + label + '">' +
          '<polyline points="' + points + '" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>' +
        '</svg>' +
      '</div>'
    );
  }

  function buildWarnings() {
    const timeline = getTimeline().slice().sort(byDateDesc);
    const planFact = getPlanFact().slice().sort(byDateDesc);
    const checkins = getCheckins().slice().sort(byDateDesc);
    const trainingLogs = getTrainingLogs().slice().sort(byDateDesc);
    const warnings = [];
    const recentWeights = timeline.slice(0, 4).map(function (item) { return number(item.weight, NaN); });
    const weightTrend = trend(recentWeights);
    const recentFacts = planFact.slice(0, 5);
    const avgCalorieGap = average(recentFacts.map(function (item) {
      return number(item.caloriesFact, NaN) - number(item.caloriesTarget, NaN);
    }));
    const lastCheckin = checkins[0] || {};

    if (Math.abs(weightTrend) > 1.5) warnings.push("Вага змінюється швидко: перевір калорії, сон і воду перед новою корекцією.");
    if (Number.isFinite(avgCalorieGap) && Math.abs(avgCalorieGap) > 250) warnings.push("План і факт калорій розходяться більше ніж на 250 ккал у середньому.");
    if (number(lastCheckin.sleep, 8) < 6.5) warnings.push("Сон нижче 6.5 год: не форсуй прогресію і розглянь deload.");
    if (lastCheckin.energy === "low") warnings.push("Низька енергія: спочатку відновлення, потім нове навантаження.");
    if (number(lastCheckin.adherence, 100) < 75) warnings.push("Дотримання раціону нижче 75%: краще спростити меню, а не міняти цілі.");
    if (trainingLogs.slice(0, 3).some(function (item) { return number(item.rpe, 0) >= 9; })) warnings.push("Останні тренування важкі: якщо RPE 9+ тримається кілька сесій, не додавай обсяг цього тижня.");
    if (trainingLogs.slice(0, 5).some(function (item) { return item.pain === "yes"; })) warnings.push("Є запис болю після тренування: зменш амплітуду/вагу і перевір техніку перед прогресією.");

    if (!warnings.length) warnings.push("Критичних ризиків не видно. Тримай план і збирай дані ще 7 днів.");

    return warnings;
  }

  function getWeeklyDecision(entry) {
    const goal = entry.goal || "recomp";
    const weight = number(entry.weightChange, 0);
    const sleep = number(entry.sleep, 8);
    const adherence = number(entry.adherence, 100);
    const lowRecovery = sleep < 6.5 || entry.energy === "low";

    if (lowRecovery) return "Спершу відновлення: мінус 15-25% обсягу тренувань на 1 тиждень, калорії не урізати.";
    if (adherence < 75) return "Не міняти калорії. Спростити раціон і добити дотримання до 80-90%.";
    if (goal === "cut" && weight > -0.2) return "Дефіцит слабкий: мінус 100-150 ккал або +1500-2500 кроків/день.";
    if (goal === "cut" && weight < -1) return "Дефіцит агресивний: +100-200 ккал або менше кардіо.";
    if (goal === "gain" && weight < 0.1) return "Набір стоїть: +100-150 ккал, переважно вуглеводи навколо тренування.";
    if (goal === "gain" && weight > 0.6) return "Набір швидкий: залиш білок, зменш вуглеводи/жири на 100-150 ккал.";
    return "Курс тримати ще 7 днів. Нова корекція тільки після наступного check-in.";
  }

  function renderTimeline() {
    const timeline = getTimeline().slice().sort(byDateDesc);
    const rows = timeline.slice(0, 6).map(function (item) {
      return '<tr><td>' + item.date + '</td><td>' + item.weight + ' кг</td><td>' + item.waist + ' см</td><td>' + item.sleep + ' год</td><td>' + item.energy + '</td></tr>';
    }).join("");

    return (
      '<div class="coach-block">' +
        '<div class="coach-block-head"><span>01</span><h3>Athlete Timeline</h3></div>' +
        '<form id="coach-timeline-form" class="coach-form-grid">' +
          '<label class="coach-date-field">Дата<input type="date" name="date" value="' + todayIso() + '"></label>' +
          '<label>Вага, кг<input type="number" name="weight" min="35" max="250" step="0.1"></label>' +
          '<label>Талія, см<input type="number" name="waist" min="40" max="200" step="0.1"></label>' +
          '<label>Сон, год<input type="number" name="sleep" min="0" max="16" step="0.1"></label>' +
          '<label>Енергія<select name="energy"><option value="good">добра</option><option value="medium">середня</option><option value="low">низька</option></select></label>' +
          '<label>Нотатка<input name="note" maxlength="120"></label>' +
          '<button type="submit" class="btn btn-primary">Додати запис</button>' +
        '</form>' +
        '<div class="coach-charts">' +
          buildMiniChart(timeline, "weight", "Вага", " кг") +
          buildMiniChart(timeline, "waist", "Талія", " см") +
        '</div>' +
        '<div class="coach-table-wrap"><table class="coach-table"><thead><tr><th>Дата</th><th>Вага</th><th>Талія</th><th>Сон</th><th>Енергія</th></tr></thead><tbody>' + (rows || '<tr><td colspan="5">Записів ще немає.</td></tr>') + '</tbody></table></div>' +
      '</div>'
    );
  }

  function renderPlanFact() {
    const entries = getPlanFact().slice().sort(byDateDesc);
    const last = entries[0] || {};
    const kcalDelta = number(last.caloriesFact, 0) - number(last.caloriesTarget, 0);
    const proteinDelta = number(last.proteinFact, 0) - number(last.proteinTarget, 0);

    return (
      '<div class="coach-block">' +
        '<div class="coach-block-head"><span>02</span><h3>План / факт</h3></div>' +
        '<form id="coach-planfact-form" class="coach-form-grid">' +
          '<label class="coach-date-field">Дата<input type="date" name="date" value="' + todayIso() + '"></label>' +
          '<label>Ккал план<input type="number" name="caloriesTarget" min="900" max="7000" step="10"></label>' +
          '<label>Ккал факт<input type="number" name="caloriesFact" min="900" max="7000" step="10"></label>' +
          '<label>Білок план<input type="number" name="proteinTarget" min="30" max="400" step="1"></label>' +
          '<label>Білок факт<input type="number" name="proteinFact" min="30" max="400" step="1"></label>' +
          '<label>Тренування<select name="trainingDone"><option value="done">виконано</option><option value="partial">частково</option><option value="missed">пропущено</option></select></label>' +
          '<button type="submit" class="btn btn-primary">Зберегти факт</button>' +
        '</form>' +
        '<div class="coach-metric-grid">' +
          '<div><span>Калорії</span><strong>' + (entries.length ? (kcalDelta > 0 ? "+" : "") + kcalDelta + " ккал" : "-") + '</strong></div>' +
          '<div><span>Білок</span><strong>' + (entries.length ? (proteinDelta > 0 ? "+" : "") + proteinDelta + " г" : "-") + '</strong></div>' +
          '<div><span>Тренування</span><strong>' + (last.trainingDone || "-") + '</strong></div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderCheckin() {
    const checkins = getCheckins().slice().sort(byDateDesc);
    const last = checkins[0];

    return (
      '<div class="coach-block">' +
        '<div class="coach-block-head"><span>03</span><h3>Weekly Check-in</h3></div>' +
        '<form id="coach-checkin-form" class="coach-form-grid">' +
          '<label class="coach-date-field">Дата<input type="date" name="date" value="' + todayIso() + '"></label>' +
          '<label>Ціль<select name="goal"><option value="recomp">recomp</option><option value="cut">cut</option><option value="gain">gain</option></select></label>' +
          '<label>Зміна ваги, %<input type="number" name="weightChange" min="-5" max="5" step="0.1"></label>' +
          '<label>Сон<input type="number" name="sleep" min="0" max="16" step="0.1"></label>' +
          '<label>Енергія<select name="energy"><option value="good">добра</option><option value="medium">середня</option><option value="low">низька</option></select></label>' +
          '<label>Дотримання, %<input type="number" name="adherence" min="0" max="100" step="1"></label>' +
          '<button type="submit" class="btn btn-primary">Зробити висновок</button>' +
        '</form>' +
        '<div class="coach-decision"><span>Останнє рішення</span><strong>' + (last ? last.decision : "Поки немає check-in.") + '</strong></div>' +
      '</div>'
    );
  }

  function renderCalendar() {
    const saved = getCalendar();
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
    const cards = days.map(function (day, index) {
      const item = saved[index] || { type: index === 1 || index === 3 || index === 5 ? "training" : "recovery", done: false };
      return (
        '<label class="coach-calendar-day">' +
          '<span>' + day + '</span>' +
          '<select data-calendar-type="' + index + '"><option value="training"' + (item.type === "training" ? " selected" : "") + '>тренування</option><option value="recovery"' + (item.type === "recovery" ? " selected" : "") + '>відновлення</option><option value="steps"' + (item.type === "steps" ? " selected" : "") + '>кроки</option></select>' +
          '<input type="checkbox" data-calendar-done="' + index + '"' + (item.done ? " checked" : "") + '>' +
        '</label>'
      );
    }).join("");

    return (
      '<div class="coach-block">' +
        '<div class="coach-block-head"><span>04</span><h3>Календар тренувань</h3></div>' +
        '<div id="coach-calendar-grid" class="coach-calendar-grid">' + cards + '</div>' +
        '<button type="button" class="btn btn-secondary" id="coach-calendar-save">Зберегти тиждень</button>' +
      '</div>'
    );
  }

  function renderTrainingLog() {
    const logs = getTrainingLogs().slice().sort(byDateDesc);
    const recent = logs.slice(0, 6);
    const avgRpe = average(recent.map(function (item) { return number(item.rpe, NaN); }));
    const volume = recent.reduce(function (sum, item) {
      return sum + number(item.sets, 0) * number(item.reps, 0) * number(item.load, 0);
    }, 0);
    const rows = recent.map(function (item) {
      return '<tr><td>' + item.date + '</td><td>' + item.exercise + '</td><td>' + item.sets + 'x' + item.reps + '</td><td>' + (item.load || "-") + ' кг</td><td>' + item.rpe + '</td><td>' + (item.pain === "yes" ? "є" : "немає") + '</td></tr>';
    }).join("");

    return (
      '<div class="coach-block">' +
        '<div class="coach-block-head"><span>05</span><h3>Training execution log</h3></div>' +
        '<form id="coach-training-log-form" class="coach-form-grid">' +
          '<label class="coach-date-field">Дата<input type="date" name="date" value="' + todayIso() + '"></label>' +
          '<label>Вправа<input name="exercise" maxlength="80" placeholder="Жим лежачи"></label>' +
          '<label>Підходи<input type="number" name="sets" min="1" max="20" step="1"></label>' +
          '<label>Повтори<input type="number" name="reps" min="1" max="100" step="1"></label>' +
          '<label>Вага, кг<input type="number" name="load" min="0" max="500" step="0.5"></label>' +
          '<label>RPE<select name="rpe"><option value="6">6</option><option value="7">7</option><option value="8" selected>8</option><option value="9">9</option><option value="10">10</option></select></label>' +
          '<label>Біль<select name="pain"><option value="no">немає</option><option value="yes">є</option></select></label>' +
          '<label>Нотатка<input name="note" maxlength="120"></label>' +
          '<button type="submit" class="btn btn-primary">Додати тренування</button>' +
        '</form>' +
        '<div class="coach-metric-grid">' +
          '<div><span>Записів</span><strong>' + logs.length + '</strong></div>' +
          '<div><span>Середній RPE</span><strong>' + (avgRpe ? avgRpe.toFixed(1) : "-") + '</strong></div>' +
          '<div><span>Обсяг 6 записів</span><strong>' + Math.round(volume) + ' кг</strong></div>' +
        '</div>' +
        '<div class="coach-table-wrap"><table class="coach-table"><thead><tr><th>Дата</th><th>Вправа</th><th>Сети</th><th>Вага</th><th>RPE</th><th>Біль</th></tr></thead><tbody>' + (rows || '<tr><td colspan="6">Записів тренування ще немає.</td></tr>') + '</tbody></table></div>' +
      '</div>'
    );
  }

  function renderProgressionAdvisor() {
    const advice = buildProgressionAdvice();
    const rows = advice.map(function (item) {
      return (
        '<div class="coach-progression-item coach-progression-' + item.status + '">' +
          '<div><span>' + item.exercise + '</span><strong>' + item.action + '</strong></div>' +
          '<small>Обсяг: ' + Math.round(item.volume) + ' кг | RPE: ' + item.rpe + '</small>' +
        '</div>'
      );
    }).join("");

    return (
      '<div class="coach-block">' +
        '<div class="coach-block-head"><span>06</span><h3>Progression advisor</h3></div>' +
        (rows || '<div class="coach-chart-empty">Додай хоча б один запис у Training execution log, щоб отримати пораду прогресії.</div>') +
      '</div>'
    );
  }

  function renderBlueprintV2() {
    const warnings = buildWarnings();
    const lastCheckin = getCheckins().slice().sort(byDateDesc)[0];
    const planFacts = getPlanFact().slice().sort(byDateDesc);
    const adherence = average(planFacts.slice(0, 7).map(function (item) {
      const target = number(item.caloriesTarget, 0);
      const fact = number(item.caloriesFact, 0);
      if (!target || !fact) return NaN;
      return Math.max(0, 100 - Math.abs(fact - target) / target * 100);
    }));

    return (
      '<div class="coach-block coach-blueprint-v2">' +
        '<div class="coach-block-head"><span>07</span><h3>Blueprint 2.0</h3></div>' +
        '<div class="coach-metric-grid">' +
          '<div><span>Дотримання плану</span><strong>' + (adherence ? Math.round(adherence) + "%" : "-") + '</strong></div>' +
          '<div><span>Останній check-in</span><strong>' + (lastCheckin ? lastCheckin.date : "-") + '</strong></div>' +
          '<div><span>Ризики</span><strong>' + warnings.length + '</strong></div>' +
        '</div>' +
        '<div class="coach-warning-list">' + warnings.map(function (warning) { return '<div>' + warning + '</div>'; }).join("") + '</div>' +
      '</div>'
    );
  }

  function renderPresets() {
    return (
      '<div class="coach-block">' +
        '<div class="coach-block-head"><span>09</span><h3>Швидкі налаштування цілі</h3></div>' +
        '<p class="coach-preset-help">Натисни картку - сайт підставить ціль, рівень і тренувальні параметри у форми профілю, харчування та тренувань.</p>' +
        '<div class="coach-presets">' +
          Object.keys(presets).map(function (key) {
            const preset = presets[key];
            return '<button type="button" class="coach-preset" data-preset="' + key + '"><strong>' + preset.label + '</strong><span>' + preset.note + '</span></button>';
          }).join("") +
        '</div>' +
      '</div>'
    );
  }

  function renderCoach() {
    return (
      '<section id="coach" class="coach-section">' +
        '<div class="container">' +
          '<div class="section-head reveal">' +
            '<span class="section-label">Coach Command Center</span>' +
            '<h2>Персональний контроль циклу</h2>' +
            '<p>Timeline, план-факт, check-in, календар, графіки, попередження, швидкі налаштування і Blueprint 2.0 працюють як один кабінет спортсмена.</p>' +
          '<a class="btn btn-primary" href="https://t.me/bielashov" target="_blank" rel="noopener noreferrer">Написати тренеру</a>' +
          '</div>' +
          '<div class="coach-grid">' +
            renderTimeline() +
            renderPlanFact() +
            renderCheckin() +
            renderCalendar() +
            renderTrainingLog() +
            renderProgressionAdvisor() +
            renderBlueprintV2() +
            renderPresets() +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function readForm(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function bindCoach() {
    const coach = $("coach");
    if (!coach) return;

    coach.addEventListener("submit", function (event) {
      event.preventDefault();
      const form = event.target;
      const data = readForm(form);

      if (form.id === "coach-timeline-form") {
        saveEntry(keys.timeline, data);
      }

      if (form.id === "coach-planfact-form") {
        saveEntry(keys.planFact, data);
      }

      if (form.id === "coach-checkin-form") {
        data.decision = getWeeklyDecision(data);
        saveEntry(keys.checkins, data);
      }

      if (form.id === "coach-training-log-form") {
        saveEntry(keys.trainingLogs, data);
      }

      mountCoach();
    });

    coach.addEventListener("click", function (event) {
      const presetButton = event.target.closest("[data-preset]");
      if (presetButton) {
        const preset = presets[presetButton.dataset.preset];
        setField("profile-goal", preset.profileGoal);
        setField("profile-level", preset.level);
        setField("profile-days", preset.days);
        setField("goal", preset.nutritionGoal);
        setField("training-goal", preset.trainingGoal);
        setField("training-level", preset.level);
        setField("training-days", preset.days);
        if (preset.place) setField("training-place", preset.place);
        scrollToPresetChanges();
      }

      if (event.target.closest("#coach-calendar-save")) {
        const items = [];
        for (let i = 0; i < 7; i += 1) {
          const type = coach.querySelector('[data-calendar-type="' + i + '"]');
          const done = coach.querySelector('[data-calendar-done="' + i + '"]');
          items.push({ type: type ? type.value : "recovery", done: !!(done && done.checked) });
        }
        setJson(keys.calendar, items);
        mountCoach();
      }
    });
  }

  function mountCoach() {
    const existing = $("coach");
    if (existing) {
      existing.outerHTML = renderCoach();
    } else {
      const progress = $("progress");
      if (progress) {
        progress.insertAdjacentHTML("beforebegin", renderCoach());
      }
    }

    bindCoach();
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;

    const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname) || window.location.protocol === "file:";
    if (isLocalPreview) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        registrations.forEach(function (registration) {
          registration.unregister();
        });
      }).catch(function () {});

      if ("caches" in window) {
        caches.keys().then(function (keys) {
          keys.filter(function (key) {
            return key.indexOf("vitalrise") === 0;
          }).forEach(function (key) {
            caches.delete(key);
          });
        }).catch(function () {});
      }
      return;
    }

    navigator.serviceWorker.register("service-worker.js").catch(function () {});
  }

  system.coach = {
    mount: mountCoach,
    buildWarnings: buildWarnings,
    getWeeklyDecision: getWeeklyDecision,
    buildProgressionAdvice: buildProgressionAdvice
  };

  window.VitalRiseSystem = system;

  document.addEventListener("DOMContentLoaded", function () {
    mountCoach();
    registerServiceWorker();
  });
})();
