(function () {
  const system = window.VitalRiseSystem || {};

  const fastingLabels = {
    unknown: "умови не вказані",
    fasting: "натще",
    not_fasting: "не натще",
    after_training: "після важкого тренування"
  };

  const preparationNotes = {
    not_fasting: "Метаболічні маркери після їжі треба трактувати обережно, особливо глюкозу.",
    after_training: "Після важкого тренування AST, ALT, креатинін/eGFR і запальні маркери можуть бути тимчасово зміщені.",
    fasting: "Натще легше порівнювати глюкозу, ліпіди й частину метаболічних маркерів.",
    unknown: "Якщо умови здачі не вказані, не роби різких висновків з одного показника."
  };

  function getFastingLabel(value) {
    return fastingLabels[value] || fastingLabels.unknown;
  }

  function getPreparationNote(value) {
    return preparationNotes[value] || preparationNotes.unknown;
  }

  system.labs = {
    getFastingLabel: getFastingLabel,
    getPreparationNote: getPreparationNote
  };

  window.VitalRiseSystem = system;
})();
