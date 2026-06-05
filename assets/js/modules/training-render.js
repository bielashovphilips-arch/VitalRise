(function () {
  const system = window.VitalRiseSystem || {};

  function escapeAttr(text) {
    return String(text).replace(/"/g, "&quot;");
  }

  function getFormatter(formatters, key) {
    return formatters && typeof formatters[key] === "function"
      ? formatters[key]
      : function (value) {
          return String(value);
        };
  }

  function t(value) {
    const text = String(value == null ? "" : value);
    const translated = window.VitalRiseI18n && typeof window.VitalRiseI18n.translateText === "function"
      ? window.VitalRiseI18n.translateText(text)
      : text;
    const language = window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function"
      ? window.VitalRiseI18n.getLanguage()
      : "uk";
    const fallback = {
      "підбирається індивідуально": { en: "selected individually", ru: "подбирается индивидуально" },
      "залиш поточну вагу": { en: "keep the current load", ru: "оставь текущий вес" },
      "без додавання ваги": { en: "no added load", ru: "без добавления веса" },
      "Тренерський контроль": { en: "Coaching control", ru: "Тренерский контроль" },
      "Адаптація, якість, наступний крок і корекція": { en: "Adaptation, quality, next step, and correction", ru: "Адаптация, качество, следующий шаг и коррекция" },
      "Адаптація": { en: "Adaptation", ru: "Адаптация" },
      "Перші 2-4 тижні": { en: "First 2-4 weeks", ru: "Первые 2-4 недели" },
      "Якість": { en: "Quality", ru: "Качество" },
      "Що контролювати": { en: "What to monitor", ru: "Что контролировать" },
      "Наступний крок": { en: "Next step", ru: "Следующий шаг" },
      "Після контрольного блоку": { en: "After the control block", ru: "После контрольного блока" },
      "Корекція": { en: "Correction", ru: "Коррекция" },
      "Як змінювати план": { en: "How to change the plan", ru: "Как менять план" },
      "Відпочинок": { en: "Rest", ru: "Отдых" },
      "за протоколом вправи": { en: "by exercise protocol", ru: "по протоколу упражнения" },
      "за таймером": { en: "by timer", ru: "по таймеру" },
      "60-90 сек між колами": { en: "60-90 sec between rounds", ru: "60-90 сек между кругами" }
    };

    if (translated === text && fallback[text] && fallback[text][language]) {
      return fallback[text][language];
    }

    return translated;
  }

  function formatSets(value) {
    const language = window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function"
      ? window.VitalRiseI18n.getLanguage()
      : "uk";
    if (language === "en") return String(value) + " sets";
    if (language === "ru") return String(value) + " подх.";
    return String(value) + " підх.";
  }

  function renderExercises(exercises) {
    return exercises
      .map(function (exercise) {
        const exerciseName = t(exercise.name);
        const setsText = exercise.setsLabel ? t(exercise.setsLabel) : formatSets(exercise.sets);

        return (
          '<div class="exercise-item">' +
            '<strong>' + exerciseName + '</strong>' +
            '<div class="exercise-meta">' + setsText + '</div>' +
            '<div class="exercise-meta">' + t(exercise.reps) + '</div>' +
            '<div class="exercise-meta">' + t(exercise.weightText) + '</div>' +
            '<div class="exercise-meta exercise-rest">' + t('Відпочинок') + ': ' + t(exercise.restText || '60-90 сек') + '</div>' +
            '<button type="button" class="atlas-inline-btn" data-exercise-name="' + escapeAttr(exercise.name) + '">' + t('Техніка') + '</button>' +
          '</div>' +
          '<div class="exercise-item" style="margin-top: -2px;">' +
            '<div class="exercise-meta muted" style="grid-column: 1 / -1; text-align: left;">' +
              t(exercise.percentText) +
              '<br>' + t('Контроль: відкрий «Техніка», звір амплітуду, темп і робочі м’язи перед прогресією.') +
            '</div>' +
          '</div>'
        );
      })
      .join("");
  }

  function renderOrderedExerciseGroups(exercises) {
    const groups = [];
    (exercises || []).forEach(function (exercise) {
      const label = exercise.muscleGroupLabel || "";
      const lastGroup = groups[groups.length - 1];
      if (!lastGroup || lastGroup.label !== label) {
        groups.push({ label: label, exercises: [exercise] });
      } else {
        lastGroup.exercises.push(exercise);
      }
    });

    return groups.map(function (group) {
      return (
        '<div class="exercise-group-title">' + t(group.label || 'Послідовність вправ') + '</div>' +
        '<div class="exercise-list">' + renderExercises(group.exercises) + '</div>'
      );
    }).join("");
  }

  function renderWeekDays(days) {
    return days
      .map(function (day) {
        const cardioMarkup = day.cardio && day.cardio.length
          ? '<div class="tip-list" style="margin-top: 14px;">' +
              day.cardio.map(function (item) {
                return '<div class="tip-item">' + t(item) + '</div>';
              }).join("") +
            '</div>'
          : "";

        const orderedMarkup = day.orderedExercises && day.orderedExercises.length
          ? renderOrderedExerciseGroups(day.orderedExercises)
          : "";

        const basicMarkup = !orderedMarkup && day.basic && day.basic.length
          ? '<div class="exercise-group-title">' + t('Базові вправи') + '</div><div class="exercise-list">' + renderExercises(day.basic) + '</div>'
          : "";
        const accessoryMarkup = !orderedMarkup
          ? '<div class="exercise-group-title">' + t('Допоміжні вправи') + '</div>' +
            '<div class="exercise-list">' + renderExercises(day.accessory || []) + '</div>'
          : "";
        return (
          '<div class="training-day-card">' +
            '<div class="training-day-header">' +
              '<h4 class="training-day-title">' + t(day.title) + '</h4>' +
              '<span class="training-day-badge">' + t(day.badge) + '</span>' +
            '</div>' +
            orderedMarkup +
            basicMarkup +
            accessoryMarkup +
            cardioMarkup +
          '</div>'
        );
      })
      .join("");
  }

  function renderGuidanceItems(items, className) {
    return (items || [])
      .map(function (item) {
        return '<div class="' + className + '">' + t(item) + '</div>';
      })
      .join("");
  }

  function renderTrainingCoachBlocks(blocks) {
    if (!blocks || !blocks.length) return "";

    return (
      '<div class="training-coach-system">' +
        '<div class="training-coach-system-head">' +
          '<span>' + t('Тренерський контроль') + '</span>' +
          '<h4>' + t('Адаптація, якість, наступний крок і корекція') + '</h4>' +
        '</div>' +
        '<div class="training-coach-grid">' +
          blocks.map(function (block) {
            return (
              '<div class="training-guidance-card training-coach-card">' +
                '<span>' + t(block.label || '') + '</span>' +
                '<h4>' + t(block.title || '') + '</h4>' +
                '<div class="training-guidance-list">' + renderGuidanceItems(block.items || [], "training-guidance-item") + '</div>' +
              '</div>'
            );
          }).join("") +
        '</div>' +
      '</div>'
    );
  }

  function renderProgramRecommendation(recommendation) {
    if (!recommendation) return "";

    const reasonsMarkup = renderGuidanceItems(recommendation.reasons || [], "training-guidance-item");

    return (
      '<div class="training-guidance-card training-program-recommendation">' +
        '<span>' + t('\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u043e\u0432\u0430\u043d\u0438\u0439 \u0442\u0438\u043f') + '</span>' +
        '<h4>' + t(recommendation.appliedLabel || recommendation.recommendedLabel || '\u0423\u043d\u0456\u0432\u0435\u0440\u0441\u0430\u043b\u044c\u043d\u0430') + '</h4>' +
        '<p class="training-guidance-note">' + t(recommendation.summary || '') + '</p>' +
        '<div class="training-passport-grid training-program-mini-grid">' +
          '<div class="training-passport-card"><span>' + t('\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0456\u044f') + '</span><strong>' + t(recommendation.recommendedLabel || '') + '</strong></div>' +
          '<div class="training-passport-card"><span>' + t('\u0412\u0438\u0431\u0456\u0440') + '</span><strong>' + t(recommendation.selectedLabel || '') + '</strong></div>' +
          '<div class="training-passport-card"><span>' + t('\u0414\u043e\u0432\u0456\u0440\u0430') + '</span><strong>' + t(recommendation.confidence || '') + '</strong></div>' +
        '</div>' +
        '<div class="training-guidance-list">' + reasonsMarkup + '</div>' +
      '</div>'
    );
  }

  function renderTrainingResult(result, formatters) {
    const formatKcal = getFormatter(formatters, "formatKcal");

    if (!result || !result.weeks || !result.weeks.length) {
      return '<div class="result-placeholder">Не вдалося сформувати план. Перевір параметри та спробуй ще раз.</div>';
    }

    const weeksMarkup = result.weeks
      .map(function (week) {
        return (
          '<h4 class="result-subtitle">' + t(week.title) + '</h4>' +
          '<div class="training-days-list">' +
            renderWeekDays(week.days) +
          '</div>'
        );
      })
      .join("");

    const tipsMarkup = result.tips
      .map(function (tip) {
        return '<div class="tip-item">' + t(tip) + '</div>';
      })
      .join("");

    const guidance = result.guidance || {};
    const coachBlocksMarkup = renderTrainingCoachBlocks(guidance.coachBlocks);
    const programRecommendationMarkup = renderProgramRecommendation(result.programRecommendation);
    const warningMarkup = guidance.warnings && guidance.warnings.length
      ? '<div class="training-guidance-card training-guidance-warning">' +
          '<span>' + t('Контроль ризику') + '</span>' +
          '<h4>' + t('Зверни увагу') + '</h4>' +
          '<div class="training-guidance-list">' + renderGuidanceItems(guidance.warnings, "training-warning-item") + '</div>' +
        '</div>'
      : "";

    const guidanceMarkup =
      '<div class="training-passport">' +
        '<div class="training-passport-grid">' +
          '<div class="training-passport-card"><span>' + t('Формат') + '</span><strong>' + t(guidance.format || "Тренування") + '</strong></div>' +
          '<div class="training-passport-card"><span>' + t('Ціль') + '</span><strong>' + t(guidance.goal || "Програма") + '</strong></div>' +
          '<div class="training-passport-card"><span>' + t('Рівень') + '</span><strong>' + t(guidance.level || "Адаптивний") + '</strong></div>' +
          '<div class="training-passport-card"><span>' + t('Фокус') + '</span><strong>' + t(guidance.focus || "Контроль техніки") + '</strong></div>' +
        '</div>' +
      '</div>' +
      '<div class="training-guidance-grid">' +
        '<div class="training-guidance-card">' +
          '<span>' + t('Інтенсивність') + '</span>' +
          '<h4>' + t('RIR / запас повторів') + '</h4>' +
          '<p class="training-guidance-note">' + t('RIR - це скільки повторів лишилось у запасі. RIR 2 означає: міг би зробити ще 2 чисті повтори.') + '</p>' +
          '<div class="training-guidance-list">' + renderGuidanceItems(guidance.rirRules, "training-guidance-item") + '</div>' +
        '</div>' +
        '<div class="training-guidance-card">' +
          '<span>' + t('Прогресія') + '</span>' +
          '<h4>' + t('Як додавати навантаження') + '</h4>' +
          '<div class="training-guidance-list">' + renderGuidanceItems(guidance.progressionRules, "training-guidance-item") + '</div>' +
        '</div>' +
        '<div class="training-guidance-card">' +
          '<span>Deload</span>' +
          '<h4>' + t('Коли пригальмувати') + '</h4>' +
          '<div class="training-guidance-list">' + renderGuidanceItems(guidance.deloadRules, "training-guidance-item") + '</div>' +
        '</div>' +
        warningMarkup +
      '</div>';

    return (
      '<h3 class="result-title">' + t('Структура тренувального плану на ' + result.weeks.length + ' тиж.') + '</h3>' +
      '<div class="kcal-badge">' + t('Орієнтовне спалювання за тренування: ' + formatKcal(result.caloriesBurned)) + '</div>' +
      '<p class="result-note">' + t(result.volumeNote) + '</p>' +
      programRecommendationMarkup +
      guidanceMarkup +
      coachBlocksMarkup +
      weeksMarkup +
      '<h4 class="result-subtitle">' + t('Робочі підказки') + '</h4>' +
      '<div class="tip-list">' + tipsMarkup + '</div>'
    );
  }

  system.trainingRender = {
    renderExercises: renderExercises,
    renderWeekDays: renderWeekDays,
    renderGuidanceItems: renderGuidanceItems,
    renderTrainingResult: renderTrainingResult
  };

  window.VitalRiseSystem = system;
})();
