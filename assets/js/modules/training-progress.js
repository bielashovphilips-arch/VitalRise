(function () {
  const SESSION_KEY = "vitalrise:training:sessions";
  const COACH_LOG_KEY = "vitalrise:coach:training-logs";
  let language = "uk";

  const labels = {
    uk: {
      kicker: "Training progress",
      title: "Прогрес у тренуваннях",
      note: "Виконані сесії, робочий об’єм і найкращі результати зберігаються в цьому браузері.",
      sessions: "Сесії",
      sets: "Підходи",
      reps: "Повтори",
      volume: "Загальний об’єм",
      lastSessions: "Останні сесії",
      bestResults: "Найкращі результати",
      noData: "Заверши перше тренування, щоб побачити динаміку.",
      openTraining: "Відкрити тренування",
      noBest: "Результати з’являться після першої сесії.",
      latest: "Останній результат",
      best: "Найкраща вага",
      today: "сьогодні",
      session: "сесія",
      from: "від",
      volumeShort: "об’єм",
      autoCoach: "Автоматично додано з Training session"
    },
    en: {
      kicker: "Training progress",
      title: "Training progress",
      note: "Completed sessions, working volume, and best results are stored in this browser.",
      sessions: "Sessions",
      sets: "Sets",
      reps: "Reps",
      volume: "Total volume",
      lastSessions: "Recent sessions",
      bestResults: "Best results",
      noData: "Finish your first workout to see your progress.",
      openTraining: "Open training",
      noBest: "Results will appear after your first session.",
      latest: "Latest result",
      best: "Best weight",
      today: "today",
      session: "session",
      from: "from",
      volumeShort: "volume",
      autoCoach: "Automatically added from Training session"
    },
    ru: {
      kicker: "Training progress",
      title: "Прогресс в тренировках",
      note: "Выполненные сессии, рабочий объём и лучшие результаты хранятся в этом браузере.",
      sessions: "Сессии",
      sets: "Подходы",
      reps: "Повторы",
      volume: "Общий объём",
      lastSessions: "Последние сессии",
      bestResults: "Лучшие результаты",
      noData: "Заверши первую тренировку, чтобы увидеть динамику.",
      openTraining: "Открыть тренировки",
      noBest: "Результаты появятся после первой сессии.",
      latest: "Последний результат",
      best: "Лучший вес",
      today: "сегодня",
      session: "сессия",
      from: "от",
      volumeShort: "объём",
      autoCoach: "Автоматически добавлено из Training session"
    }
  };

  function getLanguage() {
    return window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function"
      ? window.VitalRiseI18n.getLanguage()
      : "uk";
  }

  function t(key) {
    return (labels[language] || labels.uk)[key] || labels.uk[key] || key;
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
      // Keep the visual progress view available if storage is blocked.
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function number(value) {
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  }

  function formatNumber(value) {
    return number(value).toLocaleString(language === "uk" ? "uk-UA" : language);
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(language === "uk" ? "uk-UA" : language, {
      day: "2-digit",
      month: "short"
    });
  }

  function getSessions() {
    return readJson(SESSION_KEY, [])
      .filter(function (session) { return session && session.finishedAt; })
      .sort(function (a, b) { return number(b.finishedAt) - number(a.finishedAt); });
  }

  function getMetrics(sessions) {
    return sessions.reduce(function (result, session) {
      result.sets += number(session.sets);
      result.volume += number(session.volume);
      result.reps += getSessionReps(session);
      return result;
    }, { sets: 0, volume: 0, reps: 0 });
  }

  function getSessionReps(session) {
    return (session.exercises || []).reduce(function (sum, exercise) {
      return sum + (exercise.sets || []).reduce(function (total, set) { return total + number(set.reps); }, 0);
    }, 0);
  }

  function getExerciseStats(sessions) {
    const stats = {};
    sessions.forEach(function (session) {
      (session.exercises || []).forEach(function (exercise) {
        const key = String(exercise.name || "").trim();
        if (!key) return;
        if (!stats[key]) stats[key] = { name: key, bestWeight: 0, latestWeight: 0, latestReps: 0, latestSeconds: 0, latestAt: 0 };
        (exercise.sets || []).forEach(function (set) {
          const weight = number(set.weight);
          const reps = number(set.reps);
          if (weight > stats[key].bestWeight) stats[key].bestWeight = weight;
          if (number(set.recordedAt) > stats[key].latestAt) {
            stats[key].latestAt = number(set.recordedAt);
            stats[key].latestWeight = weight;
            stats[key].latestReps = reps;
            stats[key].latestSeconds = number(set.seconds);
          }
        });
      });
    });
    return Object.keys(stats).map(function (key) { return stats[key]; })
      .sort(function (a, b) { return b.bestWeight - a.bestWeight; })
      .slice(0, 8);
  }

  function buildProgressMarkup(sessions) {
    const metrics = getMetrics(sessions);
    const exerciseStats = getExerciseStats(sessions);
    const recent = sessions.slice(0, 6);
    const showVolume = metrics.volume > 0;
    const maxVolume = Math.max.apply(null, recent.map(function (session) { return showVolume ? number(session.volume) : getSessionReps(session); }).concat([1]));

    if (!sessions.length) {
      return (
        '<div class="training-history-empty">' +
          '<p>' + escapeHtml(t("noData")) + '</p>' +
          '<a class="btn btn-primary" href="training.html">' + escapeHtml(t("openTraining")) + '</a>' +
        '</div>'
      );
    }

    const recentMarkup = recent.map(function (session) {
      const width = Math.max(8, Math.round(((showVolume ? number(session.volume) : getSessionReps(session)) / maxVolume) * 100));
      return (
        '<article class="training-history-session">' +
          '<div class="training-history-session-head"><strong>' + escapeHtml(session.dayTitle || t("session")) + '</strong><span>' + escapeHtml(formatDate(session.finishedAt)) + '</span></div>' +
          '<div class="training-history-bar"><i style="width: ' + width + '%"></i></div>' +
          '<div class="training-history-session-meta"><span>' + formatNumber(session.sets) + ' ' + escapeHtml(t("sets").toLowerCase()) + '</span><strong>' + formatNumber(getSessionReps(session)) + ' ' + escapeHtml(t("reps").toLowerCase()) + (session.volume ? ' · ' + formatNumber(session.volume) + ' кг' : '') + '</strong></div>' +
        '</article>'
      );
    }).join("");

    const bestMarkup = exerciseStats.length
      ? exerciseStats.map(function (item) {
          return '<article class="training-history-best"><strong>' + escapeHtml(item.name) + '</strong><span>' + escapeHtml(t("latest")) + ': ' + escapeHtml(item.latestSeconds ? item.latestSeconds + ' s' : item.latestWeight > 0 ? formatNumber(item.latestWeight) + ' кг × ' + item.latestReps : "BW × " + item.latestReps) + '</span><small>' + escapeHtml(t("best")) + ': ' + escapeHtml(item.bestWeight > 0 ? formatNumber(item.bestWeight) + ' кг' : "BW") + '</small></article>';
        }).join("")
      : '<div class="training-history-empty"><p>' + escapeHtml(t("noBest")) + '</p></div>';

    return (
      '<div class="training-history-metrics">' +
        '<div class="training-history-metric"><span>' + escapeHtml(t("sessions")) + '</span><strong>' + formatNumber(sessions.length) + '</strong></div>' +
        '<div class="training-history-metric"><span>' + escapeHtml(t("sets")) + '</span><strong>' + formatNumber(metrics.sets) + '</strong></div>' +
        '<div class="training-history-metric"><span>' + escapeHtml(t(showVolume ? "volume" : "reps")) + '</span><strong>' + (showVolume ? formatNumber(metrics.volume) + ' кг' : formatNumber(metrics.reps)) + '</strong></div>' +
      '</div>' +
      '<div class="training-history-columns">' +
        '<div><h4>' + escapeHtml(t("lastSessions")) + '</h4><div class="training-history-sessions">' + recentMarkup + '</div></div>' +
        '<div><h4>' + escapeHtml(t("bestResults")) + '</h4><div class="training-history-best-list">' + bestMarkup + '</div></div>' +
      '</div>'
    );
  }

  function panelMarkup() {
    return '<section class="training-history-panel" data-plan-required="pro"><div class="container"><div class="section-head"><span class="section-label">' + escapeHtml(t("kicker")) + '</span><h2>' + escapeHtml(t("title")) + '</h2><p>' + escapeHtml(t("note")) + '</p></div><div class="training-history-content">' + buildProgressMarkup(getSessions()) + '</div></div></section>';
  }

  function mountPanel() {
    language = getLanguage();
    const existing = document.querySelector(".training-history-panel");
    if (existing) {
      const content = existing.querySelector(".training-history-content");
      if (content) content.innerHTML = buildProgressMarkup(getSessions());
      return existing;
    }

    if (document.querySelector("#training-result")) {
      const anchor = document.querySelector(".training-session-panel") || document.querySelector("#training-result");
      if (anchor) {
        anchor.insertAdjacentHTML("afterend", panelMarkup());
        return document.querySelector(".training-history-panel");
      }
    }

    const progress = document.querySelector("#progress");
    if (progress) {
      progress.insertAdjacentHTML("afterend", panelMarkup());
      return document.querySelector(".training-history-panel");
    }
    return null;
  }

  function syncCoachLogs() {
    const sessions = getSessions();
    const logs = readJson(COACH_LOG_KEY, []);
    const known = new Set(logs.filter(function (item) { return item.sourceSessionId; }).map(function (item) { return item.sourceSessionId; }));
    const additions = [];

    sessions.slice().reverse().forEach(function (session) {
      if (known.has(session.id)) return;
      (session.exercises || []).forEach(function (exercise) {
        const sets = exercise.sets || [];
        if (!sets.length) return;
        // The coach log only supports reps; do not report seconds as repetitions.
        if (sets.some(function (set) { return number(set.seconds) > 0; })) return;
        const last = sets[sets.length - 1];
        const averageReps = Math.round(sets.reduce(function (sum, set) { return sum + number(set.reps); }, 0) / sets.length);
        additions.push({
          date: new Date(session.finishedAt).toISOString().slice(0, 10),
          exercise: exercise.name,
          sets: sets.length,
          reps: averageReps,
          load: number(last.weight),
          rpe: last.rir === null || last.rir === undefined ? "" : Math.max(1, 10 - number(last.rir)),
          pain: (exercise.pain === true || sets.some(function (set) { return set.pain === true; })) ? "yes" : "no",
          sourceSessionId: session.id,
          source: "training-session"
        });
      });
    });

    if (additions.length) writeJson(COACH_LOG_KEY, additions.concat(logs).slice(0, 100));
  }

  function refresh() {
    syncCoachLogs();
    mountPanel();
  }

  function init() {
    refresh();
    document.addEventListener("vitalrise:training-session-complete", refresh);
  }

  window.VitalRiseTrainingProgress = {
    refresh: refresh,
    getSessions: getSessions
  };
  document.addEventListener("DOMContentLoaded", init);
})();
