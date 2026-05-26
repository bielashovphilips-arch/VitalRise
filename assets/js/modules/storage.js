(function () {
  const system = window.VitalRiseSystem || {};

  function getJson(key, fallback) {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function setJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function remove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  system.storage = {
    getJson: getJson,
    setJson: setJson,
    remove: remove,
    keys: {
      athleteProfile: "vitalrise:athlete-profile",
      nutritionCorrection: "vitalrise:nutrition:active-correction",
      nutritionLastTargets: "vitalrise:nutrition:last-targets",
      progressHistory: "vitalrise:progress:history"
    }
  };

  window.VitalRiseSystem = system;
})();
