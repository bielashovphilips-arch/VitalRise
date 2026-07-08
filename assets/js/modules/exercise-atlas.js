(function () {
  const system = window.VitalRiseSystem || {};

  document.addEventListener("DOMContentLoaded", function () {
    const exerciseAtlasOpen = document.getElementById("exercise-atlas-open");
    const exerciseAtlasModal = document.getElementById("exercise-atlas-modal");
    const exerciseAtlasGrid = document.getElementById("exercise-atlas-grid");
    const exerciseAtlasFilters = document.getElementById("exercise-atlas-filters");
    const exerciseAtlasClose = document.querySelector(".exercise-atlas-close");
    const trainingResult = document.getElementById("training-result");
  const exerciseAtlasData = window.VitalRiseSystem && window.VitalRiseSystem.exerciseAtlasData
    ? window.VitalRiseSystem.exerciseAtlasData
    : {};
  const exerciseAtlas = exerciseAtlasData.exerciseAtlas || [];
  const exerciseAtlasImages = exerciseAtlasData.exerciseAtlasImages || {};

  let activeAtlasFilter = "all";
  let lastAtlasTrigger = null;

  function t(value) {
    const text = String(value == null ? "" : value);
    return window.VitalRiseI18n && typeof window.VitalRiseI18n.translateText === "function"
      ? window.VitalRiseI18n.translateText(text)
      : text;
  }

  function atlasPartClass(exercise, part) {
    if (exercise.muscles.main.indexOf(part) !== -1) return "main";
    if (exercise.muscles.secondary.indexOf(part) !== -1) return "secondary";
    if (exercise.muscles.other.indexOf(part) !== -1) return "other";
    return "";
  }

  function renderAtlasBodyMapV2(exercise) {
    const part = function (name) {
      return atlasPartClass(exercise, name);
    };

    return (
      '<svg class="atlas-body-map atlas-body-map-human" viewBox="0 0 360 360" role="img" aria-label="' + t('Анатомічна карта м’язів') + '">' +
        '<text class="atlas-view-label" x="86" y="24">' + t('Перед') + '</text>' +
        '<text class="atlas-view-label" x="256" y="24">' + t('Спина') + '</text>' +
        '<g class="atlas-human front" transform="translate(16 20)">' +
          '<circle class="body-skin" cx="80" cy="24" r="17"></circle>' +
          '<path class="body-skin" d="M62 45 Q80 36 98 45 L104 75 L96 135 L88 162 L72 162 L64 135 L56 75 Z"></path>' +
          '<path class="body-part ' + part("traps") + '" d="M62 47 Q80 39 98 47 L92 61 Q80 56 68 61 Z"></path>' +
          '<path class="body-part ' + part("frontDelts") + '" d="M46 66 Q55 48 70 61 Q63 76 55 92 Q45 88 39 79 Z"></path>' +
          '<path class="body-part ' + part("frontDelts") + '" d="M114 66 Q105 48 90 61 Q97 76 105 92 Q115 88 121 79 Z"></path>' +
          '<path class="body-part ' + part("chest") + '" d="M63 63 Q78 56 80 79 Q70 89 56 84 Q55 70 63 63 Z"></path>' +
          '<path class="body-part ' + part("chest") + '" d="M97 63 Q82 56 80 79 Q90 89 104 84 Q105 70 97 63 Z"></path>' +
          '<path class="body-part ' + part("abs") + '" d="M67 90 Q80 97 93 90 L94 133 Q80 143 66 133 Z"></path>' +
          '<path class="body-part ' + part("core") + '" d="M58 116 Q80 132 102 116 L98 153 Q80 166 62 153 Z"></path>' +
          '<path class="body-part ' + part("biceps") + '" d="M38 82 Q51 88 50 123 L37 128 Q30 104 31 88 Z"></path>' +
          '<path class="body-part ' + part("biceps") + '" d="M122 82 Q109 88 110 123 L123 128 Q130 104 129 88 Z"></path>' +
          '<path class="body-part ' + part("triceps") + '" d="M50 85 Q60 96 56 130 L46 142 Q40 111 42 91 Z"></path>' +
          '<path class="body-part ' + part("triceps") + '" d="M110 85 Q100 96 104 130 L114 142 Q120 111 118 91 Z"></path>' +
          '<path class="body-part ' + part("forearms") + '" d="M35 126 L50 124 L46 176 L31 178 Z"></path>' +
          '<path class="body-part ' + part("forearms") + '" d="M125 126 L110 124 L114 176 L129 178 Z"></path>' +
          '<path class="body-part ' + part("hipFlexors") + '" d="M62 154 L80 164 L72 194 L53 188 Z"></path>' +
          '<path class="body-part ' + part("hipFlexors") + '" d="M98 154 L80 164 L88 194 L107 188 Z"></path>' +
          '<path class="body-part ' + part("quads") + '" d="M54 185 Q70 191 76 204 L68 316 L46 316 Q45 250 54 185 Z"></path>' +
          '<path class="body-part ' + part("quads") + '" d="M106 185 Q90 191 84 204 L92 316 L114 316 Q115 250 106 185 Z"></path>' +
          '<path class="muscle-line" d="M80 62 L80 152 M66 103 L94 103 M67 121 L93 121 M58 210 L75 214 M102 210 L85 214"></path>' +
        '</g>' +
        '<g class="atlas-human back" transform="translate(186 20)">' +
          '<circle class="body-skin" cx="80" cy="24" r="17"></circle>' +
          '<path class="body-skin" d="M60 45 Q80 35 100 45 L108 88 L101 145 L90 166 L70 166 L59 145 L52 88 Z"></path>' +
          '<path class="body-part ' + part("traps") + '" d="M56 50 Q80 34 104 50 L94 76 Q80 67 66 76 Z"></path>' +
          '<path class="body-part ' + part("rearDelts") + '" d="M43 66 Q56 49 72 63 Q66 82 54 97 Q43 91 36 80 Z"></path>' +
          '<path class="body-part ' + part("rearDelts") + '" d="M117 66 Q104 49 88 63 Q94 82 106 97 Q117 91 124 80 Z"></path>' +
          '<path class="body-part ' + part("midBack") + '" d="M64 69 Q80 62 96 69 L100 118 Q80 132 60 118 Z"></path>' +
          '<path class="body-part ' + part("lats") + '" d="M52 82 Q67 97 70 143 L55 157 Q41 123 38 94 Z"></path>' +
          '<path class="body-part ' + part("lats") + '" d="M108 82 Q93 97 90 143 L105 157 Q119 123 122 94 Z"></path>' +
          '<path class="body-part ' + part("lowerBack") + '" d="M67 126 Q80 136 93 126 L100 154 Q80 170 60 154 Z"></path>' +
          '<path class="body-part ' + part("triceps") + '" d="M49 87 Q61 99 56 137 L45 151 Q38 113 40 92 Z"></path>' +
          '<path class="body-part ' + part("triceps") + '" d="M111 87 Q99 99 104 137 L115 151 Q122 113 120 92 Z"></path>' +
          '<path class="body-part ' + part("forearms") + '" d="M34 135 L50 132 L47 181 L31 183 Z"></path>' +
          '<path class="body-part ' + part("forearms") + '" d="M126 135 L110 132 L113 181 L129 183 Z"></path>' +
          '<path class="body-part ' + part("glutes") + '" d="M58 154 Q80 170 102 154 L106 189 Q80 207 54 189 Z"></path>' +
          '<path class="body-part ' + part("hamstrings") + '" d="M53 188 Q70 198 76 218 L68 316 L45 316 Q44 250 53 188 Z"></path>' +
          '<path class="body-part ' + part("hamstrings") + '" d="M107 188 Q90 198 84 218 L92 316 L115 316 Q116 250 107 188 Z"></path>' +
          '<path class="body-part ' + part("quads") + '" d="M62 190 L78 206 L72 316 L55 316 Z"></path>' +
          '<path class="body-part ' + part("quads") + '" d="M98 190 L82 206 L88 316 L105 316 Z"></path>' +
          '<path class="muscle-line" d="M80 62 L80 158 M64 86 Q80 96 96 86 M62 115 Q80 127 98 115 M58 214 L75 220 M102 214 L85 220"></path>' +
        '</g>' +
      '</svg>'
    );
  }

  function getAtlasMuscleNames(exercise) {
    const muscles = exercise.muscles || { main: [], secondary: [], other: [] };
    const labels = {
      chest: "груди",
      triceps: "трицепс",
      biceps: "біцепс",
      frontDelts: "передня дельта",
      rearDelts: "задня дельта",
      lats: "широчайші",
      midBack: "середина спини",
      traps: "трапеції",
      core: "корпус",
      abs: "прес",
      lowerBack: "поперек",
      glutes: "сідниці",
      quads: "квадрицепс",
      hamstrings: "біцепс стегна",
      hipFlexors: "згиначі стегна",
      forearms: "передпліччя",
      upperChest: "верх грудей"
    };

    return muscles.main.concat(muscles.secondary, muscles.other)
      .filter(function (item, index, list) { return list.indexOf(item) === index; })
      .map(function (item) { return t(labels[item] || item); });
  }

  function renderAtlasVisual(exercise) {
    const imageKey = exercise.image ? "" : findExerciseImageName(exercise.name);
    const imageSrc = exercise.image || exerciseAtlasImages[exercise.name] || (imageKey ? exerciseAtlasImages[imageKey] : "");
    const musclesMarkup = getAtlasMuscleNames(exercise)
      .map(function (muscle) { return '<span>' + muscle + '</span>'; })
      .join("");
    const visualMarkup = imageSrc
      ? '<img class="exercise-atlas-photo" src="' + imageSrc + '" alt="' + t(exercise.name) + '" loading="lazy">'
      : renderAtlasBodyMapV2(exercise);

    return (
      '<div class="exercise-atlas-visual ' + (imageSrc ? "has-photo" : "has-map") + '">' +
        '<div class="exercise-atlas-figure">' + visualMarkup + '</div>' +
        '<div class="atlas-muscle-strip">' + musclesMarkup + '</div>' +
      '</div>'
    );
  }

  function atlasMatchesExercise(atlasItem, name) {
    const source = String(name || "").toLowerCase();
    const target = atlasItem.name.toLowerCase();

    if (target.indexOf("бруси") !== -1 && source.indexOf("брус") !== -1) return true;
    if (target.indexOf("підтягування") !== -1 && source.indexOf("підтяг") !== -1) return true;
    if (target.indexOf("віджимання") !== -1 && source.indexOf("віджим") !== -1) return true;
    if (
      target.indexOf("жим лежачи") !== -1 &&
      (
        source.indexOf("жим лежачи") !== -1 ||
        source.indexOf("жим гантелей лежачи") !== -1 ||
        source.indexOf("жим у тренажері або віджимання") !== -1
      )
    ) return true;
    if (target.indexOf("болгар") !== -1 && source.indexOf("болгар") !== -1) return true;
    if (target.indexOf("румунська") !== -1 && source.indexOf("румун") !== -1) return true;

    return source.indexOf(target.split(" / ")[0]) !== -1 ||
      target.indexOf(source.split("(")[0].trim()) !== -1 ||
      atlasItem.swaps.some(function (swap) {
        return source.indexOf(swap.toLowerCase().split(" / ")[0]) !== -1;
      });
  }

  function normalizeExerciseName(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/\([^)]*\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function findExerciseImageName(name) {
    const source = normalizeExerciseName(name);
    if (!source) return "";

    const keys = Object.keys(exerciseAtlasImages);
    const exact = keys.find(function (key) {
      return normalizeExerciseName(key) === source;
    });

    if (exact) return exact;

    return keys
      .slice()
      .sort(function (a, b) {
        return normalizeExerciseName(b).length - normalizeExerciseName(a).length;
      })
      .find(function (key) {
      const target = normalizeExerciseName(key);
      const targetHead = normalizeExerciseName(key.split(" / ")[0]);
      return source.indexOf(target) !== -1 ||
        target.indexOf(source) !== -1 ||
        source.indexOf(targetHead) !== -1 ||
        targetHead.indexOf(source) !== -1;
    }) || "";
  }

  function buildPhotoOnlyExercise(name) {
    const imageName = findExerciseImageName(name);
    if (!imageName) return null;

    return {
      name: imageName,
      place: "Приклад",
      level: "фото",
      image: exerciseAtlasImages[imageName],
      muscles: { main: [], secondary: [], other: [] },
      cues: ["Перевір амплітуду", "Контролюй темп", "Не працюй через гострий біль"],
      swaps: ["Фото-приклад для вправи з плану"]
    };
  }

  function renderExerciseAtlas(filter, focusName) {
    if (!exerciseAtlasGrid || !exerciseAtlasFilters) return;

    const filters = ["all", "Зал", "Дім", "Вулиця"];
    activeAtlasFilter = filter || activeAtlasFilter || "all";

    exerciseAtlasFilters.innerHTML = filters
      .map(function (item) {
        const label = item === "all" ? "Усі" : item;
        return '<button type="button" class="atlas-filter-btn ' + (activeAtlasFilter === item ? "active" : "") + '" data-atlas-filter="' + item + '">' + t(label) + '</button>';
      })
      .join("");

    const photoOnlyExercise = focusName ? buildPhotoOnlyExercise(focusName) : null;
    const list = photoOnlyExercise ? [] : exerciseAtlas.filter(function (exercise) {
      const filterMatch = activeAtlasFilter === "all" || exercise.place.indexOf(activeAtlasFilter) !== -1;
      const focusMatch = !focusName || atlasMatchesExercise(exercise, focusName);
      return focusName ? focusMatch : filterMatch;
    });

    const visibleList = list.length ? list : photoOnlyExercise ? [photoOnlyExercise] : exerciseAtlas;

    exerciseAtlasGrid.innerHTML = visibleList
      .map(function (exercise) {
        return (
          '<article class="exercise-atlas-card">' +
            renderAtlasVisual(exercise) +
            '<div class="exercise-atlas-info">' +
              '<div class="exercise-atlas-meta"><span>' + t(exercise.place) + '</span><span>' + t(exercise.level) + '</span></div>' +
              '<h3>' + t(exercise.name) + '</h3>' +
              '<div class="exercise-atlas-tags">' +
                exercise.cues.map(function (cue) { return '<span>' + t(cue) + '</span>'; }).join("") +
              '</div>' +
              '<div class="exercise-atlas-swaps"><strong>' + t('Заміни') + '</strong><p>' + exercise.swaps.map(t).join(" / ") + '</p></div>' +
            '</div>' +
          '</article>'
        );
      })
      .join("");
  }

  function openExerciseAtlas(focusName) {
    if (!exerciseAtlasModal) return;
    lastAtlasTrigger = document.activeElement;
    renderExerciseAtlas(focusName ? "all" : activeAtlasFilter, focusName);
    exerciseAtlasModal.classList.add("active");
    exerciseAtlasModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    window.setTimeout(function () {
      const firstFilter = exerciseAtlasModal.querySelector("[data-atlas-filter]");
      const focusTarget = exerciseAtlasClose || firstFilter;
      if (focusTarget) focusTarget.focus();
    }, 0);
  }

  function closeExerciseAtlas() {
    if (!exerciseAtlasModal) return;
    exerciseAtlasModal.classList.remove("active");
    exerciseAtlasModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastAtlasTrigger && typeof lastAtlasTrigger.focus === "function") {
      lastAtlasTrigger.focus();
    }
  }

  function trapExerciseAtlasFocus(event) {
    if (!exerciseAtlasModal || !exerciseAtlasModal.classList.contains("active") || event.key !== "Tab") return;

    const focusable = Array.from(
      exerciseAtlasModal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (exerciseAtlasOpen) {
    exerciseAtlasOpen.addEventListener("click", function () {
      openExerciseAtlas();
    });
  }

  if (exerciseAtlasModal) {
    exerciseAtlasModal.addEventListener("click", function (event) {
      const closeTarget = event.target.closest("[data-atlas-close]");
      const filterTarget = event.target.closest("[data-atlas-filter]");

      if (closeTarget) closeExerciseAtlas();
      if (filterTarget) renderExerciseAtlas(filterTarget.dataset.atlasFilter);
    });
  }

  if (trainingResult) {
    trainingResult.addEventListener("click", function (event) {
      const atlasButton = event.target.closest(".atlas-inline-btn");
      if (!atlasButton) return;
      openExerciseAtlas(atlasButton.dataset.exerciseName);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeExerciseAtlas();
    trapExerciseAtlasFocus(event);
  });


    system.exerciseAtlas = {
      renderExerciseAtlas: renderExerciseAtlas,
      openExerciseAtlas: openExerciseAtlas,
      closeExerciseAtlas: closeExerciseAtlas,
      atlasMatchesExercise: atlasMatchesExercise,
      exerciseNeedsPhoto: exerciseNeedsPhoto
    };
    window.VitalRiseSystem = system;
  });
})();
