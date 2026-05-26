(function () {
  const system = window.VitalRiseSystem || {};
  const namespace = "vitalrise:";

  function getVitalRiseData() {
    const data = {};

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key && key.indexOf(namespace) === 0) {
        data[key] = window.localStorage.getItem(key);
      }
    }

    return {
      app: "VitalRise",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: data
    };
  }

  function downloadJson(payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = "vitalrise-backup-" + stamp + ".json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function importPayload(payload) {
    if (!payload || payload.app !== "VitalRise" || !payload.data) return false;

    Object.keys(payload.data).forEach(function (key) {
      if (key.indexOf(namespace) === 0) {
        window.localStorage.setItem(key, String(payload.data[key]));
      }
    });

    return true;
  }

  function setButtonStatus(button, text) {
    if (!button) return;
    const original = button.dataset.originalText || button.textContent.trim();
    button.dataset.originalText = original;
    button.textContent = text;

    window.setTimeout(function () {
      button.textContent = original;
    }, 1800);
  }

  function bindDataPortability() {
    const exportButton = document.getElementById("export-saved-data");
    const importButton = document.getElementById("import-saved-data");
    const importFile = document.getElementById("import-saved-data-file");

    if (exportButton) {
      exportButton.addEventListener("click", function () {
        downloadJson(getVitalRiseData());
        setButtonStatus(exportButton, "Готово");
      });
    }

    if (importButton && importFile) {
      importButton.addEventListener("click", function () {
        importFile.click();
      });

      importFile.addEventListener("change", function () {
        const file = importFile.files && importFile.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", function () {
          try {
            const ok = importPayload(JSON.parse(String(reader.result || "{}")));
            setButtonStatus(importButton, ok ? "Імпортовано" : "Файл не підходить");
            if (ok) window.setTimeout(function () { window.location.reload(); }, 900);
          } catch (error) {
            setButtonStatus(importButton, "Помилка файлу");
          }
        });
        reader.readAsText(file);
        importFile.value = "";
      });
    }
  }

  system.dataPortability = {
    exportData: getVitalRiseData,
    importData: importPayload
  };

  window.VitalRiseSystem = system;
  document.addEventListener("DOMContentLoaded", bindDataPortability);
})();
