(function () {
  const system = window.VitalRiseSystem || {};
  const HISTORY_KEY = "vitalrise:training:sessions";
  const ACTIVE_WEEK_KEY = "vitalrise:training:active-week";
  const INITIAL_PERIOD_COMPLETE_KEY = "vitalrise:training:beginner-initial-period-complete";

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
      // Keep the current plan available when storage is blocked.
    }
  }

  function removeValue(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function number(value) {
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function language() {
    return window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function"
      ? window.VitalRiseI18n.getLanguage()
      : "uk";
  }

  function localized(uk, en, ru) {
    return ({ uk: uk, en: en, ru: ru }[language()] || uk);
  }

  function parseWeight(value) {
    const match = String(value || "").replace(",", ".").match(/^\s*(\d+(?:\.\d+)?)\s*кг\s*$/);
    return match ? Number(match[1]) : 0;
  }

  function formatWeight(value) {
    const weight = Math.round(number(value) * 10) / 10;
    if (!weight) return "без ваги";
    return (weight % 1 === 0 ? String(weight) : weight.toFixed(1)) + " кг";
  }

  function getTargetUpper(reps) {
    const match = String(reps || "").match(/^\s*(\d+)(?:\s*[-–]\s*(\d+))?(?:\s+на (?:ногу|руку|сторону))?\s*$/);
    return match ? number(match[2] || match[1]) : 0;
  }

  function getSetCount(value) {
    const match = String(value == null ? "" : value).match(/\d+/);
    return match ? number(match[0]) : 1;
  }

  function reduceVolume(value) {
    if (value === null || value === undefined || value === "") return value;
    return String(value).replace(/(\d+)(?:-(\d+))?/g, function (match, lowText, highText) {
      const low = Math.max(1, Math.floor(number(lowText) * 0.7));
      if (!highText) return String(low);
      const high = Math.max(low, Math.floor(number(highText) * 0.7));
      return low + "-" + high;
    });
  }

  function getHistory() {
    return readJson(HISTORY_KEY, [])
      .filter(function (session) { return session && session.finishedAt; })
      .sort(function (a, b) { return number(b.finishedAt) - number(a.finishedAt); });
  }

  function isInitialPeriodComplete() {
    return readJson(INITIAL_PERIOD_COMPLETE_KEY, false) === true;
  }

  function markInitialPeriodComplete() {
    writeJson(INITIAL_PERIOD_COMPLETE_KEY, true);
    return true;
  }

  function resetInitialPeriod() {
    removeValue(INITIAL_PERIOD_COMPLETE_KEY);
  }

  function getExerciseRecords(name, history, prescriptionKey) {
    const records = [];
    (history || []).forEach(function (session) {
      const exercise = (session.exercises || []).find(function (item) {
        return String(item.name || "").trim() === String(name || "").trim() && (item.sets || []).length &&
          (!prescriptionKey || item.prescriptionKey === prescriptionKey);
      });
      if (exercise) records.push({ session: session, exercise: exercise });
    });
    return records.sort(function (a, b) { return number(b.session.finishedAt) - number(a.session.finishedAt); });
  }

  function hasPain(exercise) {
    return Boolean(exercise && (exercise.pain === true || (exercise.sets || []).some(function (set) {
      return set.pain === true;
    })));
  }

  function performance(record) {
    const sets = record && record.exercise && record.exercise.sets || [];
    const weighted = sets.some(function (set) { return number(set.weight) > 0; });
    return sets.reduce(function (total, set) {
      return total + (weighted ? number(set.weight) * number(set.reps) : number(set.reps));
    }, 0);
  }

  function averageReps(record) {
    const sets = record && record.exercise && record.exercise.sets || [];
    if (!sets.length) return 0;
    return sets.reduce(function (total, set) { return total + number(set.reps); }, 0) / sets.length;
  }

  function isDeclining(records) {
    if (records.length < 3) return false;
    const recent = records.slice(0, 3);
    return performance(recent[0]) < performance(recent[1]) * 0.9 &&
      performance(recent[1]) < performance(recent[2]) * 0.9;
  }

  function hasSharpDrop(record) {
    const sets = record && record.exercise && record.exercise.sets || [];
    if (sets.length < 2) return false;
    const firstReps = number(sets[0].reps);
    const lastReps = number(sets[sets.length - 1].reps);
    return firstReps > 0 && lastReps <= firstReps * 0.7;
  }

  function latestWeight(record) {
    const sets = record && record.exercise && record.exercise.sets || [];
    for (let index = sets.length - 1; index >= 0; index -= 1) {
      if (number(sets[index].weight) > 0) return number(sets[index].weight);
    }
    return 0;
  }

  function allSetsHaveRirAtLeast(record, value) {
    const sets = record && record.exercise && record.exercise.sets || [];
    return sets.length > 0 && sets.every(function (set) {
      return set.rir !== null && set.rir !== undefined && set.rir !== "" &&
        Number.isFinite(Number(set.rir)) && number(set.rir) >= value && number(set.rir) <= 5;
    });
  }

  function allSetsHitUpper(record, upper) {
    const sets = record && record.exercise && record.exercise.sets || [];
    return upper > 0 && sets.length > 0 && sets.every(function (set) {
      return number(set.reps) >= upper;
    });
  }

  function analyzeExercise(exercise, history) {
    const records = getExerciseRecords(exercise.name, history, exercise.prescriptionKey);
    if (!records.length) {
      return {
        mode: "baseline",
        label: localized("Плановий старт", "Planned start", "Плановый старт"),
        reason: localized("Поки немає запису з попереднього тижня.", "No previous-week record yet.", "Пока нет записи с предыдущей недели."),
        delta: 0
      };
    }

    const latest = records[0];
    const requiredSets = Math.max(getSetCount(exercise.sets), getSetCount(latest.exercise.targetSets));
    const completedAllSets = latest.exercise.sets.length >= requiredSets;
    const upper = getTargetUpper(exercise.reps);
    const latestRir = latest.exercise.sets.map(function (set) { return number(set.rir); });

    if (hasPain(latest.exercise)) {
      return {
        mode: "pain",
        label: localized("Біль: без автопрогресії", "Pain: no auto-progression", "Боль: без автопрогрессии"),
        reason: localized("Є позначка болю — вагу й об’єм автоматично не збільшуємо.", "Pain was reported, so load and volume are not increased automatically.", "Отмечена боль — вес и объём автоматически не увеличиваем."),
        delta: 0
      };
    }

    if (isDeclining(records)) {
      return {
        mode: "deload",
        label: localized("Deload: мінус 30% об’єму", "Deload: 30% less volume", "Deload: минус 30% объёма"),
        reason: localized("Результат погіршувався три сесії поспіль — об’єм зменшено для відновлення.", "Performance declined for three sessions in a row, so volume is reduced for recovery.", "Результат ухудшался три сессии подряд — объём уменьшен для восстановления."),
        delta: 0
      };
    }

    if (hasSharpDrop(latest)) {
      return {
        mode: "hold",
        label: localized("Зберегти вагу", "Hold the load", "Сохранить вес"),
        reason: localized("Є різке падіння повторів у сесії — спочатку стабілізуємо виконання.", "Reps dropped sharply within the session, so the load stays the same.", "Повторы резко упали в сессии — сначала стабилизируем выполнение."),
        delta: 0
      };
    }

    if (!completedAllSets) {
      return {
        mode: "hold",
        label: localized("Зберегти вагу", "Hold the load", "Сохранить вес"),
        reason: localized("Не всі цільові підходи завершені — вагу не збільшуємо.", "Not all target sets were completed, so the load stays the same.", "Не все целевые подходы завершены — вес не увеличиваем."),
        delta: 0
      };
    }

    const clean = latest.exercise.sets.every(function (set) { return set.techniqueClean === true; });
    const weight = latestWeight(latest);
    const bodyweight = latest.exercise.sets.every(function (set) { return number(set.weight) === 0 && !set.seconds; });
    if (bodyweight && upper > 0) {
      const ready = !exercise.deload && clean && allSetsHaveRirAtLeast(latest, exercise.targetRir || 2);
      return {
        mode: ready ? "progress" : "hold",
        label: ready
          ? localized("Прогрес із власною вагою", "Bodyweight progress", "Прогресс с собственным весом")
          : localized("Закріпи підходи та повтори", "Consolidate sets and reps", "Закрепи подходы и повторы"),
        reason: ready
          ? allSetsHitUpper(latest, upper)
            ? localized("Усі підходи виконані у верхній межі. Спробуй меншу допомогу або складніший варіант, зберігаючи техніку; підходи автоматично не додаються.", "All sets reached the upper target. Try less assistance or a harder variation with clean technique; sets are not added automatically.", "Все подходы на верхней границе. Попробуй меньше помощи или более сложный вариант с чистой техникой; подходы автоматически не добавляются.")
            : localized("Наступна ціль — на один чистий повтор більше за найменший результат минулого тренування, у межах плану.", "Next target: one clean rep above the lowest result from your last workout, within the planned range.", "Следующая цель — на один чистый повтор больше минимального результата прошлого занятия, в пределах плана.")
          : localized("Збережи підходи та повтори до стабільної техніки й потрібного запасу повторів.", "Keep sets and reps until technique and reps in reserve are consistent.", "Сохрани подходы и повторы до стабильной техники и нужного запаса повторов."),
        repTarget: ready && !allSetsHitUpper(latest, upper)
          ? Math.min(upper, Math.min.apply(null, latest.exercise.sets.map(function (set) { return number(set.reps); })) + 1)
          : null,
        delta: 0
      };
    }
    const sameWeight = weight > 0 && latest.exercise.sets.every(function (set) { return number(set.weight) === weight; });
    if (!exercise.deload && clean && sameWeight && allSetsHaveRirAtLeast(latest, exercise.targetRir || 2) && allSetsHitUpper(latest, upper)) {
      return {
        mode: "progress",
        label: localized("Готовність до малого кроку ваги", "Ready for a small load increase", "Готовность к малому шагу веса"),
        reason: localized("Усі підходи: верх повторів, потрібний RIR і підтверджена техніка. Додай найменший доступний крок; якщо він завеликий — залиш вагу.", "All sets met the upper rep target, required RIR and confirmed technique. Use the smallest available increment; otherwise hold the load.", "Все подходы: верх повторов, нужный RIR и подтверждённая техника. Добавь минимальный доступный шаг; иначе сохрани вес."),
        delta: 0
      };
    }

    return {
      mode: "hold",
      label: localized("Поточна вага з журналу", "Current load from log", "Текущий вес из журнала"),
      reason: localized("RIR 0–1 або немає достатньої підстави для збільшення — вагу залишаємо.", "RIR 0–1 or insufficient evidence to increase, so the load is held.", "RIR 0–1 или недостаточно оснований для увеличения — вес сохраняем."),
      delta: 0,
      latestRir: latestRir
    };
  }

  function adaptExercise(exercise, history) {
    const updated = clone(exercise);
    const analysis = analyzeExercise(updated, history);
    const records = getExerciseRecords(updated.name, history, updated.prescriptionKey);
    const previousWeight = records.length ? latestWeight(records[0]) : 0;
    const baseWeight = previousWeight || parseWeight(updated.weightText);

    if (analysis.repTarget) {
      const lower = number(String(updated.reps).match(/^\d+/)[0]);
      const upper = getTargetUpper(updated.reps);
      updated.reps = String(updated.reps).replace(/^\d+(?:\s*[-–]\s*\d+)?/, Math.max(lower, analysis.repTarget) + "-" + upper);
    }

    if (analysis.mode === "progress" && baseWeight > 0) {
      updated.weightText = formatWeight(baseWeight + analysis.delta);
    } else if (baseWeight > 0 && records.length) {
      updated.weightText = formatWeight(baseWeight);
    }

    if (analysis.mode === "deload" && !updated.deload) {
      updated.sets = reduceVolume(updated.sets);
      if (updated.setsLabel) updated.setsLabel = reduceVolume(updated.setsLabel);
    }

    updated.adaptation = analysis;
    return updated;
  }

  function adaptDay(day, history) {
    const updated = clone(day);
    ["basic", "accessory"].forEach(function (group) {
      updated[group] = (updated[group] || []).map(function (exercise) {
        return adaptExercise(exercise, history);
      });
    });

    if (updated.orderedExercises && updated.orderedExercises.length) {
      const byName = {};
      updated.basic.concat(updated.accessory).forEach(function (exercise) {
        byName[exercise.name] = exercise;
      });
      updated.orderedExercises = updated.orderedExercises.map(function (exercise) {
        return byName[exercise.name] || adaptExercise(exercise, history);
      });
    }
    return updated;
  }

  function adaptWeek(week, history) {
    const updated = clone(week);
    updated.days = (updated.days || []).map(function (day) {
      return day.restDay ? day : adaptDay(day, history || getHistory());
    });
    updated.adaptationApplied = true;
    return updated;
  }

  function getActiveWeekIndex(plan) {
    const max = Math.max(0, (plan && plan.weeks ? plan.weeks.length : 1) - 1);
    const stored = number(readJson(ACTIVE_WEEK_KEY, 0));
    return Math.min(max, Math.max(0, Math.floor(stored)));
  }

  function setActiveWeekIndex(index) {
    const safeIndex = Math.max(0, Math.floor(number(index)));
    writeJson(ACTIVE_WEEK_KEY, safeIndex);
    return safeIndex;
  }

  function resetActiveWeek() {
    removeValue(ACTIVE_WEEK_KEY);
  }

  function getTrainingDayIndexes(plan, weekIndex) {
    const week = plan && plan.weeks && plan.weeks[weekIndex];
    return week ? (week.days || []).map(function (day, index) {
      return day.restDay ? null : index;
    }).filter(function (index) { return index !== null; }) : [];
  }

  function isSessionComplete(session) {
    if (!session || number(session.sets) <= 0 || !(session.exercises || []).length) return false;
    return session.exercises.every(function (exercise) {
      const targetSets = getSetCount(exercise.targetSets || exercise.sets);
      return (exercise.sets || []).length >= targetSets;
    });
  }

  function isWeekComplete(plan, weekIndex, history) {
    const requiredDays = getTrainingDayIndexes(plan, weekIndex);
    if (!requiredDays.length) return false;
    return requiredDays.every(function (dayIndex) {
      return (history || []).some(function (session) {
        return (!plan.planId || session.planId === plan.planId) &&
          number(session.weekIndex) === weekIndex && number(session.dayIndex) === dayIndex && isSessionComplete(session);
      });
    });
  }

  function advanceIfComplete(plan, history) {
    if (!plan || !plan.weeks || !plan.weeks.length) return null;
    const activeIndex = getActiveWeekIndex(plan);
    const completedHistory = history || getHistory();
    if (!isWeekComplete(plan, activeIndex, completedHistory)) return null;

    if (activeIndex >= plan.weeks.length - 1) {
      if (plan.initialPeriod && plan.initialPeriod.type === "gym-beginner") {
        markInitialPeriodComplete();
      }
      const cycleLength = plan.cycleLength || plan.weeks.length;
      plan.cycleLength = cycleLength;
      // Continue every program beyond its initial cycle. Beginners continue
      // with Full Body, without repeating their introductory circuit week.
      const sourceIndex = plan.initialPeriod && plan.initialPeriod.type === "gym-beginner"
        ? cycleLength - 1
        : (activeIndex + 1) % cycleLength;
      const nextWeek = clone(plan.weeks[sourceIndex]);
      nextWeek.title = localized("Тиждень ", "Week ", "Неделя ") + (activeIndex + 2);
      plan.weeks.push(nextWeek);
    }

    const nextIndex = activeIndex + 1;
    plan.weeks[nextIndex] = adaptWeek(plan.weeks[nextIndex], completedHistory);
    plan.activeWeekIndex = nextIndex;
    setActiveWeekIndex(nextIndex);
    return plan;
  }

  system.trainingAdaptation = {
    getHistory: getHistory,
    isInitialPeriodComplete: isInitialPeriodComplete,
    markInitialPeriodComplete: markInitialPeriodComplete,
    resetInitialPeriod: resetInitialPeriod,
    adaptWeek: adaptWeek,
    analyzeExercise: analyzeExercise,
    getActiveWeekIndex: getActiveWeekIndex,
    setActiveWeekIndex: setActiveWeekIndex,
    resetActiveWeek: resetActiveWeek,
    isWeekComplete: isWeekComplete,
    advanceIfComplete: advanceIfComplete
  };
  window.VitalRiseSystem = system;
})();
