(function () {
  const system = window.VitalRiseSystem || {};
  const PLAN_KEY = "vitalrise:training:last-plan";
  const ACTIVE_KEY = "vitalrise:training:active-session";
  const HISTORY_KEY = "vitalrise:training:sessions";
  let root = null;
  let state = null;
  let timer = null;

  const copy = {
    uk: {
      kicker: "Training session",
      close: "Закрити",
      sets: "Підходи",
      volume: "Об’єм",
      time: "Час",
      current: "Поточна вправа",
      target: "Ціль",
      previous: "Минулого разу",
      weight: "Вага, кг (0 — власна вага)",
      reps: "Чисті повтори",
      seconds: "Час, секунд",
      totalReps: "Повтори",
      rir: "RIR",
      weightPlaceholder: "Вага",
      repsPlaceholder: "Повтори",
      bodyweight: "Вага тіла",
      logSet: "Зарахувати чистий підхід",
      rest: "Відпочинок",
      skipRest: "Пропустити",
      nextExercise: "Наступна вправа",
      finish: "Завершити",
      completed: "Сесію збережено",
      completedText: "Дані тренування збережені. Їх можна використати для прогресії та check-in.",
      closeSummary: "Повернутися до плану",
      noPrevious: "Ще немає запису",
      set: "Підхід",
      of: "з",
      upcoming: "Далі",
      noExercises: "У цьому дні немає вправ для виконання.",
      invalid: "Введи вагу та кількість повторів.",
      bodyweightValue: "BW",
      session: "Сесія",
      closeWarning: "Закриття через × без завершення — дані сесії не збережуться.",
      pain: "Біль",
      painNo: "Ні",
      painYes: "Так"
    },
    en: {
      kicker: "Training session",
      close: "Close",
      sets: "Sets",
      volume: "Volume",
      time: "Time",
      current: "Current exercise",
      target: "Target",
      previous: "Last time",
      weight: "Weight, kg (0 — bodyweight)",
      reps: "Clean reps",
      seconds: "Time, seconds",
      totalReps: "Reps",
      rir: "RIR",
      weightPlaceholder: "Weight",
      repsPlaceholder: "Reps",
      bodyweight: "Bodyweight",
      logSet: "Log clean set",
      rest: "Rest",
      skipRest: "Skip",
      nextExercise: "Next exercise",
      finish: "Finish",
      completed: "Session saved",
      completedText: "Your workout data has been saved for progression and check-ins.",
      closeSummary: "Back to plan",
      noPrevious: "No record yet",
      set: "Set",
      of: "of",
      upcoming: "Up next",
      noExercises: "There are no exercises in this day.",
      invalid: "Enter weight and reps.",
      bodyweightValue: "BW",
      session: "Session",
      closeWarning: "Closing with × before finishing will discard this session.",
      pain: "Pain",
      painNo: "No",
      painYes: "Yes"
    },
    ru: {
      kicker: "Training session",
      close: "Закрыть",
      sets: "Подходы",
      volume: "Объём",
      time: "Время",
      current: "Текущее упражнение",
      target: "Цель",
      previous: "В прошлый раз",
      weight: "Вес, кг (0 — собственный вес)",
      reps: "Чистые повторы",
      seconds: "Время, секунд",
      totalReps: "Повторы",
      rir: "RIR",
      weightPlaceholder: "Вес",
      repsPlaceholder: "Повторы",
      bodyweight: "Вес тела",
      logSet: "Записать чистый подход",
      rest: "Отдых",
      skipRest: "Пропустить",
      nextExercise: "Следующее упражнение",
      finish: "Завершить",
      completed: "Сессия сохранена",
      completedText: "Данные тренировки сохранены для прогрессии и check-in.",
      closeSummary: "Вернуться к плану",
      noPrevious: "Записей пока нет",
      set: "Подход",
      of: "из",
      upcoming: "Дальше",
      noExercises: "В этом дне нет упражнений для выполнения.",
      invalid: "Введи вес и количество повторов.",
      bodyweightValue: "BW",
      session: "Сессия",
      closeWarning: "Закрытие через × без завершения не сохранит эту сессию.",
      pain: "Боль",
      painNo: "Нет",
      painYes: "Да"
    }
  };

  function getLanguage() {
    return window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function"
      ? window.VitalRiseI18n.getLanguage()
      : "uk";
  }

  function text(key) {
    const language = getLanguage();
    return (copy[language] || copy.uk)[key] || copy.uk[key] || key;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function readJson(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // The session still works for the current page if storage is blocked.
    }
  }

  function removeJson(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function formatNumber(value) {
    const number = Number(value) || 0;
    return number.toLocaleString(getLanguage() === "uk" ? "uk-UA" : getLanguage());
  }

  function formatWeight(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return text("bodyweightValue");
    return formatNumber(number) + " кг";
  }

  function formatDuration(seconds) {
    const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
    const minutes = Math.floor(safeSeconds / 60);
    const restSeconds = safeSeconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(restSeconds).padStart(2, "0");
  }

  function parseWeight(value) {
    const match = String(value || "").replace(",", ".").match(/^\s*(\d+(?:\.\d+)?)\s*кг\s*$/);
    return match ? Number(match[1]) : 0;
  }

  function parseRestSeconds(value) {
    const match = String(value || "").match(/(\d+)/);
    return match ? Math.min(300, Math.max(30, Number(match[1]))) : 90;
  }

  function parseSetCount(value) {
    const match = String(value == null ? "" : value).match(/(\d+)/);
    return match ? Number(match[1]) : 1;
  }

  function getPlan() {
    return window.VitalRiseTrainingPlan || readJson(PLAN_KEY, null);
  }

  function getDay(plan, weekIndex, dayIndex) {
    return plan && plan.weeks && plan.weeks[weekIndex] && plan.weeks[weekIndex].days
      ? plan.weeks[weekIndex].days[dayIndex]
      : null;
  }

  function getExercises(day) {
    if (!day) return [];
    const exercises = day.orderedExercises && day.orderedExercises.length
      ? day.orderedExercises
      : (day.basic || []).concat(day.accessory || []);

    return exercises.map(function (exercise) {
      return {
        name: exercise.name || "Exercise",
        prescriptionKey: exercise.prescriptionKey || null,
        targetSets: parseSetCount(exercise.sets),
        targetReps: exercise.reps || "",
        timed: /сек|хв/.test(exercise.reps || ""),
        targetWeight: parseWeight(exercise.weightText),
        weightText: exercise.weightText || "",
        restSeconds: exercise.restSeconds || parseRestSeconds(exercise.restText),
        sets: []
      };
    });
  }

  function getLatestPreviousSet(exerciseName, prescriptionKey) {
    const history = readJson(HISTORY_KEY, []);
    for (let sessionIndex = history.length - 1; sessionIndex >= 0; sessionIndex -= 1) {
      const session = history[sessionIndex];
      const exercise = (session.exercises || []).find(function (item) {
        return item.name === exerciseName && item.sets && item.sets.length &&
          (!prescriptionKey || item.prescriptionKey === prescriptionKey);
      });
      if (exercise) return exercise.sets[exercise.sets.length - 1];
    }
    return null;
  }

  function getAllCompletedSets() {
    return (state && state.exercises || []).reduce(function (total, exercise) {
      return total + exercise.sets.length;
    }, 0);
  }

  function getTotalTargetSets() {
    return (state && state.exercises || []).reduce(function (total, exercise) {
      return total + exercise.targetSets;
    }, 0);
  }

  function getTotalVolume() {
    return (state && state.exercises || []).reduce(function (total, exercise) {
      return total + exercise.sets.reduce(function (exerciseTotal, set) {
        return exerciseTotal + (Number(set.weight) || 0) * (Number(set.reps) || 0);
      }, 0);
    }, 0);
  }

  function getTotalReps() {
    return (state && state.exercises || []).reduce(function (total, exercise) {
      return total + exercise.sets.reduce(function (sum, set) { return sum + (Number(set.reps) || 0); }, 0);
    }, 0);
  }

  function formatSet(set) {
    return set.seconds ? String(set.seconds) + ' s' : formatWeight(set.weight) + ' × ' + set.reps;
  }

  function getElapsedSeconds() {
    return Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000));
  }

  function buildRoot() {
    const result = document.getElementById("training-result");
    if (!result) return null;

    const existing = document.querySelector("#training-session-panel");
    if (existing) return existing;

    const panel = document.createElement("section");
    panel.id = "training-session-panel";
    panel.className = "training-session-panel";
    panel.hidden = true;
    panel.setAttribute("aria-live", "polite");
    result.insertAdjacentElement("afterend", panel);
    return panel;
  }

  function renderEmpty() {
    if (!root) return;
    root.hidden = true;
    root.innerHTML = "";
  }

  function renderCompleted(summary) {
    if (!root) return;
    root.hidden = false;
    root.innerHTML =
      '<div class="training-session-complete">' +
        '<div class="training-session-complete-mark">✓</div>' +
        '<div>' +
          '<span class="training-session-kicker">' + escapeHtml(text("session")) + '</span>' +
          '<h3>' + escapeHtml(text("completed")) + '</h3>' +
          '<p>' + escapeHtml(text("completedText")) + '</p>' +
          '<div class="training-session-complete-stats">' +
            '<strong>' + formatNumber(summary.sets) + ' ' + escapeHtml(text("sets").toLowerCase()) + '</strong>' +
            '<strong>' + formatNumber(summary.reps) + ' ' + escapeHtml(text("totalReps").toLowerCase()) + '</strong>' +
            (summary.volume ? '<strong>' + formatNumber(summary.volume) + ' кг</strong>' : '') +
          '</div>' +
          '<button type="button" class="btn btn-secondary training-session-close-summary">' + escapeHtml(text("closeSummary")) + '</button>' +
        '</div>' +
      '</div>';
  }

  function render() {
    if (!root) return;
    if (!state) {
      renderEmpty();
      return;
    }

    root.hidden = false;
    const exercise = state.exercises[state.exerciseIndex];
    if (!exercise) {
      finishSession();
      return;
    }

    const completedSets = getAllCompletedSets();
    const totalSets = getTotalTargetSets();
    const previous = getLatestPreviousSet(exercise.name, exercise.prescriptionKey);
    const currentSetNumber = exercise.sets.length + 1;
    const isExerciseComplete = exercise.sets.length >= exercise.targetSets;
    const restRemaining = state.restEndsAt ? Math.max(0, Math.ceil((state.restEndsAt - Date.now()) / 1000)) : 0;
    const upcoming = state.exercises.slice(state.exerciseIndex + 1, state.exerciseIndex + 4);

    root.innerHTML =
      '<div class="training-session-head">' +
        '<div>' +
          '<span class="training-session-kicker">' + escapeHtml(text("kicker")) + '</span>' +
          '<h3>' + escapeHtml(state.dayTitle) + '</h3>' +
        '</div>' +
        '<div class="training-session-close-action">' +
          '<button type="button" class="training-session-close" data-training-session-close aria-label="' + escapeHtml(text("close")) + '">×</button>' +
          '<small class="training-session-close-warning">' + escapeHtml(text("closeWarning")) + '</small>' +
        '</div>' +
      '</div>' +
      '<div class="training-session-metrics">' +
        '<div class="training-session-metric"><span>' + escapeHtml(text("sets")) + '</span><strong>' + completedSets + '/' + totalSets + '</strong></div>' +
        '<div class="training-session-metric"><span>' + escapeHtml(text(getTotalVolume() ? "volume" : "totalReps")) + '</span><strong>' + (getTotalVolume() ? formatNumber(getTotalVolume()) + ' кг' : formatNumber(getTotalReps())) + '</strong></div>' +
        '<div class="training-session-metric"><span>' + escapeHtml(text("time")) + '</span><strong data-training-session-time>' + formatDuration(getElapsedSeconds()) + '</strong></div>' +
      '</div>' +
      '<div class="training-session-layout">' +
        '<div class="training-session-main">' +
          '<div class="training-session-current-label">' + escapeHtml(text("current")) + '</div>' +
          '<div class="training-session-exercise-head">' +
            '<div>' +
              '<h4>' + escapeHtml(exercise.name) + '</h4>' +
              '<p>' + escapeHtml(text("target")) + ': ' + escapeHtml(String(exercise.targetSets)) + ' × ' + escapeHtml(String(exercise.targetReps)) + '</p>' +
            '</div>' +
            '<span class="training-session-set-badge">' + escapeHtml(text("set")) + ' ' + currentSetNumber + ' ' + escapeHtml(text("of")) + ' ' + exercise.targetSets + '</span>' +
          '</div>' +
          '<div class="training-session-previous">' +
            '<span>' + escapeHtml(text("previous")) + '</span>' +
            '<strong>' + (previous ? escapeHtml(formatSet(previous)) : escapeHtml(text("noPrevious"))) + '</strong>' +
          '</div>' +
          '<div class="training-session-inputs">' +
            '<label><span>' + escapeHtml(text("weight")) + '</span><input id="training-session-weight" data-training-session-weight type="number" min="0" max="600" step="0.5" inputmode="decimal" placeholder="' + escapeHtml(exercise.targetWeight ? String(exercise.targetWeight) : text("weightPlaceholder")) + '" value="' + (exercise.targetWeight || '') + '"></label>' +
            '<label><span>' + escapeHtml(text(exercise.timed ? "seconds" : "reps")) + '</span><input id="training-session-reps" data-training-session-reps type="number" min="1" max="' + (exercise.timed ? '3600' : '200') + '" step="1" inputmode="numeric" placeholder="' + escapeHtml(text(exercise.timed ? "seconds" : "repsPlaceholder")) + '"></label>' +
            '<label class="training-session-rir-field"><span>' + escapeHtml(text("rir")) + '</span><input id="training-session-rir" data-training-session-rir type="number" min="0" max="5" step="1" inputmode="numeric" placeholder="2"></label>' +
            '<label class="training-session-pain-field"><span>' + escapeHtml(text("pain")) + '</span><select id="training-session-pain" data-training-session-pain><option value="false">' + escapeHtml(text("painNo")) + '</option><option value="true">' + escapeHtml(text("painYes")) + '</option></select></label>' +
          '</div>' +
          '<div class="training-session-error" data-training-session-error role="status"></div>' +
          '<button type="button" class="btn btn-primary training-session-log" data-training-session-log' + (isExerciseComplete ? ' disabled' : '') + '>' + escapeHtml(text("logSet")) + '</button>' +
          (restRemaining > 0 ? '<div class="training-session-rest"><span>' + escapeHtml(text("rest")) + '</span><strong data-training-session-rest>' + formatDuration(restRemaining) + '</strong><button type="button" class="btn btn-secondary" data-training-session-skip-rest>' + escapeHtml(text("skipRest")) + '</button></div>' : '') +
          '<div class="training-session-set-list">' +
            (exercise.sets.length ? exercise.sets.map(function (set, index) {
              const rirLabel = set.rir === null || set.rir === undefined ? "–" : String(set.rir);
              return '<div class="training-session-set-row"><span>' + escapeHtml(text("set")) + ' ' + (index + 1) + '</span><strong>' + escapeHtml(formatSet(set)) + '</strong><small>RIR ' + escapeHtml(rirLabel) + '</small></div>';
            }).join("") : '<div class="training-session-set-empty">' + escapeHtml(text("noPrevious")) + '</div>') +
          '</div>' +
        '</div>' +
        '<aside class="training-session-side">' +
          '<div class="training-session-plan-label">' + escapeHtml(text("upcoming")) + '</div>' +
          '<div class="training-session-upcoming">' +
            (upcoming.length ? upcoming.map(function (item, index) {
              return '<div class="training-session-upcoming-item"><span>' + (state.exerciseIndex + index + 2) + '</span><strong>' + escapeHtml(item.name) + '</strong><small>' + item.sets.length + '/' + item.targetSets + ' ' + escapeHtml(text("sets").toLowerCase()) + '</small></div>';
            }).join("") : '<div class="training-session-set-empty">' + escapeHtml(text("noExercises")) + '</div>') +
          '</div>' +
          (isExerciseComplete && state.exerciseIndex < state.exercises.length - 1
            ? '<button type="button" class="btn btn-secondary training-session-next" data-training-session-next>' + escapeHtml(text("nextExercise")) + '</button>'
            : '') +
          '<button type="button" class="btn btn-secondary training-session-finish" data-training-session-finish>' + escapeHtml(text("finish")) + '</button>' +
        '</aside>' +
      '</div>';

    if (timer) window.clearInterval(timer);
    timer = window.setInterval(function () {
      if (!state || !root || root.hidden) return;
      const timeNode = root.querySelector("[data-training-session-time]");
      if (timeNode) timeNode.textContent = formatDuration(getElapsedSeconds());
      const restNode = root.querySelector("[data-training-session-rest]");
      if (restNode) {
        const remaining = state.restEndsAt ? Math.max(0, Math.ceil((state.restEndsAt - Date.now()) / 1000)) : 0;
        restNode.textContent = formatDuration(remaining);
        if (!remaining) {
          state.restEndsAt = 0;
          writeJson(ACTIVE_KEY, state);
          render();
        }
      }
    }, 1000);
  }

  function startSession(weekIndex, dayIndex) {
    const plan = getPlan();
    const day = getDay(plan, weekIndex, dayIndex);
    const exercises = getExercises(day);
    if (!root || !day || !exercises.length) return;

    state = {
      id: "session-" + Date.now(),
      planId: plan.planId || null,
      startedAt: Date.now(),
      weekIndex: weekIndex,
      dayIndex: dayIndex,
      dayTitle: day.title || text("session"),
      exerciseIndex: 0,
      restEndsAt: 0,
      exercises: exercises
    };
    writeJson(ACTIVE_KEY, state);
    render();
    root.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function recordSet() {
    if (!state) return;
    const exercise = state.exercises[state.exerciseIndex];
    if (!exercise || exercise.sets.length >= exercise.targetSets) return;
    const weightNode = root.querySelector("[data-training-session-weight]");
    const repsNode = root.querySelector("[data-training-session-reps]");
    const rirNode = root.querySelector("[data-training-session-rir]");
    const painNode = root.querySelector("[data-training-session-pain]");
    const errorNode = root.querySelector("[data-training-session-error]");
    const weight = Number(String(weightNode && weightNode.value || "").replace(",", "."));
    const reps = Number(repsNode && repsNode.value);

    if (!Number.isFinite(weight) || weight < 0 || weight > 600 || !Number.isInteger(reps) || reps < 1 || reps > (exercise.timed ? 3600 : 200)) {
      if (errorNode) errorNode.textContent = text("invalid");
      return;
    }

    const rirValue = rirNode && rirNode.value !== "" ? Number(rirNode.value) : null;
    if (rirValue !== null && (!Number.isInteger(rirValue) || rirValue < 0 || rirValue > 5)) {
      if (errorNode) errorNode.textContent = "RIR: 0–5";
      return;
    }
    exercise.sets.push({
      weight: weight,
      reps: exercise.timed ? 0 : reps,
      seconds: exercise.timed ? reps : 0,
      rir: Number.isFinite(rirValue) ? rirValue : null,
      pain: Boolean(painNode && painNode.value === "true"),
      techniqueClean: true,
      recordedAt: Date.now()
    });
    state.restEndsAt = Date.now() + (exercise.restSeconds * 1000);
    writeJson(ACTIVE_KEY, state);
    if (weightNode) weightNode.blur();
    if (repsNode) repsNode.blur();
    render();
  }

  function skipRest() {
    if (!state) return;
    state.restEndsAt = 0;
    writeJson(ACTIVE_KEY, state);
    render();
  }

  function nextExercise() {
    if (!state || state.exerciseIndex >= state.exercises.length - 1) return;
    state.exerciseIndex += 1;
    state.restEndsAt = 0;
    writeJson(ACTIVE_KEY, state);
    render();
  }

  function finishSession() {
    if (!state) return;
    const summary = {
      id: state.id,
      planId: state.planId || null,
      startedAt: state.startedAt,
      finishedAt: Date.now(),
      dayTitle: state.dayTitle,
      weekIndex: state.weekIndex,
      dayIndex: state.dayIndex,
      sets: getAllCompletedSets(),
      volume: getTotalVolume(),
      reps: getTotalReps(),
      exercises: state.exercises
    };
    const history = readJson(HISTORY_KEY, []);
    history.push(summary);
    const savedHistory = history.slice(-50);
    writeJson(HISTORY_KEY, savedHistory);
    let advancedPlan = null;
    if (system.trainingAdaptation) {
      advancedPlan = system.trainingAdaptation.advanceIfComplete(window.VitalRiseTrainingPlan || readJson(PLAN_KEY, null), savedHistory);
      if (advancedPlan) {
        window.VitalRiseTrainingPlan = advancedPlan;
        writeJson(PLAN_KEY, advancedPlan);
      }
    }
    removeJson(ACTIVE_KEY);
    state = null;
    if (timer) window.clearInterval(timer);
    renderCompleted(summary);
    document.dispatchEvent(new CustomEvent("vitalrise:training-session-complete", { detail: summary }));
    if (advancedPlan) {
      document.dispatchEvent(new CustomEvent("vitalrise:training-week-advanced", {
        detail: { plan: advancedPlan, weekIndex: advancedPlan.activeWeekIndex }
      }));
    }
  }

  function closeSession() {
    state = null;
    removeJson(ACTIVE_KEY);
    if (timer) window.clearInterval(timer);
    renderEmpty();
  }

  function handleClick(event) {
    if (!event.target || typeof event.target.closest !== "function") return;
    const start = event.target.closest("[data-training-start-week]");
    if (start) {
      startSession(Number(start.dataset.trainingStartWeek), Number(start.dataset.trainingStartDay));
      return;
    }
    if (event.target.closest("[data-training-session-close]")) {
      closeSession();
      return;
    }
    if (event.target.closest("[data-training-session-log]")) {
      recordSet();
      return;
    }
    if (event.target.closest("[data-training-session-skip-rest]")) {
      skipRest();
      return;
    }
    if (event.target.closest("[data-training-session-next]")) {
      nextExercise();
      return;
    }
    if (event.target.closest("[data-training-session-finish]")) {
      finishSession();
      return;
    }
    if (event.target.closest(".training-session-close-summary")) {
      renderEmpty();
    }
  }

  function init() {
    root = buildRoot();
    if (!root) return;
    document.addEventListener("click", handleClick);
    document.addEventListener("vitalrise:training-plan-ready", function (event) {
      window.VitalRiseTrainingPlan = event.detail;
      if (!state) renderEmpty();
    });
    document.addEventListener("vitalrise:training-plan-reset", closeSession);
    state = readJson(ACTIVE_KEY, null);
    if (state && state.exercises && state.exercises.length) render();
  }

  system.trainingSession = {
    startSession: startSession,
    finishSession: finishSession,
    getState: function () { return state; }
  };
  window.VitalRiseSystem = system;
  document.addEventListener("DOMContentLoaded", init);
})();
