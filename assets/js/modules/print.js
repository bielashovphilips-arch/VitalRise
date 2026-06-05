(function () {
  const system = window.VitalRiseSystem || {};
  const $ = system.$ || function (id) { return document.getElementById(id); };

  const printTargets = [
    "nutrition-result",
    "training-result",
    "supplement-result",
    "lab-result",
    "lab-review-result",
    "progress-result",
    "blueprint-result"
  ];

  const targetTitles = {
    "nutrition-result": "Раціон VitalRise",
    "training-result": "Тренувальний план VitalRise",
    "supplement-result": "Supplement Protocol",
    "lab-result": "Лабораторна панель",
    "lab-review-result": "Оцінка аналізів",
    "progress-result": "Progress Command",
    "blueprint-result": "Athlete Blueprint"
  };

  let activeTarget = "";
  let activeScope = "current";
  let activeWeek = "1";

  function hasResultContent(target) {
    const node = $(target);
    return node && !node.querySelector(".result-placeholder");
  }

  function getLanguage() {
    return window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function"
      ? window.VitalRiseI18n.getLanguage()
      : "uk";
  }

  function t(uk, en, ru) {
    const language = getLanguage();
    if (language === "en") return en || uk;
    if (language === "ru") return ru || uk;
    return uk;
  }

  function getReportDate() {
    return new Date().toLocaleDateString(getLanguage() === "en" ? "en-US" : getLanguage() === "ru" ? "ru-RU" : "uk-UA");
  }

  function getTargetTitle(target) {
    return targetTitles[target] || "VitalRise Report";
  }

  function getMobilePrintCss() {
    return (
      '@page{margin:0;}' +
      '*{box-sizing:border-box;}' +
      'html,body{min-height:100%;}' +
      'body{margin:0;background:#05060a;color:#eef2f7;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:11pt;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact;-webkit-font-smoothing:antialiased;}' +
      '.mobile-report-document{width:430px;max-width:100%;margin:0 auto;background:linear-gradient(180deg,#0f1117 0%,#05060a 100%);box-shadow:none;overflow:hidden;}' +
      '.mobile-report-hero{padding:28px 24px 24px;border-bottom:2px solid rgba(212,175,55,.3);background:linear-gradient(135deg,rgba(212,175,55,.08),transparent 62%),rgba(255,255,255,.01);}' +
      '.mobile-report-logo{display:flex;align-items:center;gap:12px;margin-bottom:20px;}' +
      '.mobile-report-logo span{display:inline-grid;place-items:center;width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#d4af37,#f0d675);color:#111216;font-size:14px;font-weight:900;box-shadow:0 4px 12px rgba(212,175,55,.2);}' +
      '.mobile-report-logo strong{color:#fff;font-size:20px;font-weight:700;}' +
      '.mobile-report-hero p{margin:0;color:rgba(236,240,248,.6);font-size:11pt;font-weight:500;text-transform:uppercase;letter-spacing:.5px;}' +
      '.mobile-report-hero small{margin:0;display:block;margin-top:8px;color:rgba(212,175,55,.8);font-size:10pt;font-weight:500;}' +
      '.mobile-report-hero h2{margin:10px 0 12px;color:#fff;font-size:32px;font-weight:700;line-height:1.1;}' +
      '.mobile-report-content{display:grid;gap:16px;padding:24px 20px 28px;}' +
      '.result-title{margin:16px 0 12px;color:#fff;font-size:22px;font-weight:700;line-height:1.2;border-bottom:2px solid rgba(212,175,55,.2);padding-bottom:10px;}' +
      '.result-subtitle{margin:14px 0 10px;color:#f0d675;font-size:16px;font-weight:600;line-height:1.3;}' +
      'h3,h4,h5{margin:10px 0 8px;color:#fff;line-height:1.3;font-weight:600;}' +
      'h3{font-size:18px;}h4{font-size:15px;}h5{font-size:13px;}' +
      'p,li,span,small,.exercise-meta,.result-item-label,.tip-item{font-size:11pt;line-height:1.6;color:rgba(236,240,248,.8);}' +
      'strong,b,.result-item-value{color:#fff;font-weight:600;}' +
      '.result-grid,.nutrition-delta-grid,.training-days-list,.supplement-stack-grid,.lab-result-grid,.lab-findings-grid,.progress-columns,.blueprint-priority-grid,.blueprint-weeks,.training-passport-grid,.training-guidance-grid{display:grid;grid-template-columns:1fr;gap:12px;margin:12px 0;}' +
      '.result-item,.nutrition-delta-item{display:grid;grid-template-columns:1fr;gap:4px;padding:14px;border:1px solid rgba(212,175,55,.2);border-radius:12px;background:rgba(212,175,55,.04);}' +
      'article,section,.nutrition-summary,.nutrition-accuracy-card,.tip-item,.exercise-item,.lab-status,.lab-finding,.supplement-stack-card,.training-day-card,.auto-meal-card,.selected-day-card,.phase-recommendation-card,.blueprint-priority,.blueprint-week,.training-passport-card,.training-guidance-card{break-inside:avoid;page-break-inside:avoid;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;margin:0;background:rgba(255,255,255,.04);color:#eef2f7;}' +
      '.exercise-item{display:grid;grid-template-columns:1fr;gap:8px;padding:12px;border:1px solid rgba(255,255,255,.1);}' +
      '.exercise-meta{font-size:10.5pt;color:rgba(212,175,55,.9);font-weight:500;}' +
      '.meal-summary{padding:10px;background:rgba(212,175,55,.08);border-radius:10px;font-size:10.5pt;font-weight:500;color:rgba(236,240,248,.85);}' +
      'button,input,select,textarea,details,summary,.atlas-inline-btn,.builder-actions,.mode-switch,.day-switcher,.nutrition-custom-tools,.nutrition-menu-template-tools{display:none!important;}' +
      'a[href]::after{content:"";}'
    );
  }

  function getA4PrintCss() {
    return (
      '@page{size:A4;margin:14mm;}' +
      '*{box-sizing:border-box;}' +
      'body{margin:0;background:#fff;color:#111827;font-family:Arial,Inter,sans-serif;font-size:11pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' +
      '.mobile-report-document{width:100%;max-width:none;margin:0;border:0;background:#fff;box-shadow:none;}' +
      '.mobile-report-hero{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:end;padding:0 0 14px;margin:0 0 16px;border-bottom:2px solid #111827;background:#fff;}' +
      '.mobile-report-logo{display:flex;align-items:center;gap:10px;margin-bottom:10px;}' +
      '.mobile-report-logo span{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:8px;background:#d4af37;color:#111827;font-size:12px;font-weight:900;}' +
      '.mobile-report-logo strong{font-size:18px;color:#111827;}' +
      '.mobile-report-hero p,.mobile-report-hero small{margin:0;color:#4b5563;font-size:10pt;}' +
      '.mobile-report-hero h2{grid-column:1/-1;margin:5px 0 6px;color:#111827;font-size:22pt;line-height:1.12;}' +
      '.mobile-report-content{display:block;padding:0;}' +
      '.result-title,.result-subtitle,h3,h4,h5{margin:12px 0 8px;color:#111827;line-height:1.18;}' +
      '.result-title{font-size:18pt;}.result-subtitle{font-size:14pt;color:#7a5a00;}' +
      'p,li,span,small,strong,b,.exercise-meta,.result-item-label,.result-item-value,.tip-item{font-size:10.5pt;line-height:1.45;color:#111827;}' +
      '.result-grid,.nutrition-delta-grid,.training-days-list,.supplement-stack-grid,.lab-result-grid,.lab-findings-grid,.progress-columns,.blueprint-priority-grid,.blueprint-weeks,.training-passport-grid,.training-guidance-grid{display:grid;grid-template-columns:1fr;gap:8px;margin:8px 0;}' +
      'article,section,.nutrition-summary,.nutrition-accuracy-card,.result-item,.tip-item,.exercise-item,.lab-status,.lab-finding,.supplement-stack-card,.training-day-card,.auto-meal-card,.selected-day-card,.phase-recommendation-card,.blueprint-priority,.blueprint-week,.training-passport-card,.training-guidance-card{break-inside:avoid;page-break-inside:avoid;border:1px solid #d1d5db;border-radius:8px;padding:10px;margin:0 0 8px;background:#fff;color:#111827;}' +
      '.exercise-item{display:grid;grid-template-columns:1fr;gap:5px;}' +
      'button,input,select,textarea,details,summary,.atlas-inline-btn,.builder-actions,.mode-switch,.day-switcher,.nutrition-custom-tools,.nutrition-menu-template-tools{display:none!important;}' +
      'a[href]::after{content:"";}'
    );
  }

  function buildPrintDocument(target, layout) {
    const css = layout === "mobile" ? getMobilePrintCss() : getA4PrintCss();
    const titleSuffix = layout === "mobile" ? "Mobile PDF" : "A4 PDF";

    return (
      '<!doctype html>' +
      '<html lang="' + getLanguage() + '">' +
      '<head>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<base href="' + window.location.href.split("#")[0] + '">' +
        '<title>' + getTargetTitle(target) + ' - ' + titleSuffix + '</title>' +
        '<style>' + css + '</style>' +
      '</head>' +
      '<body>' + buildReportContent(target) + '</body>' +
      '</html>'
    );
  }

  function exportReportAsPDF(target, layout) {
    if (!target || !hasResultContent(target)) return;

    const source = $(target);
    if (!source) return;

    const fileName = "vitalrise-" + target.replace("-result", "") + "-" + new Date().toISOString().slice(0, 10) + ".pdf";

    // Якщо html2pdf доступна, використовуємо її
    if (typeof window.html2pdf !== "undefined") {
      try {
        const element = source.cloneNode(true);
        const opt = {
          margin: layout === "mobile" ? 5 : 14,
          filename: fileName,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, backgroundColor: "#fff" },
          jsPDF: layout === "mobile" ? { format: [100, 160], orientation: "portrait" } : { format: "a4", orientation: "portrait" }
        };
        window.html2pdf().set(opt).from(element).save();
        return;
      } catch (error) {
        console.error("html2pdf export failed:", error);
      }
    }

    // Fallback: використовуємо print dialog
    const iframe = document.createElement("iframe");
    iframe.setAttribute("title", "VitalRise PDF");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.opacity = "0";
    document.body.appendChild(iframe);

    const frameWindow = iframe.contentWindow;
    const frameDocument = iframe.contentDocument || (frameWindow && frameWindow.document);

    if (frameWindow && frameDocument) {
      frameDocument.open();
      frameDocument.write(buildPrintDocument(target, layout));
      frameDocument.close();

      window.setTimeout(function () {
        frameWindow.focus();
        frameWindow.print();
        window.setTimeout(function () {
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        }, 1500);
      }, 250);
    }
  }

  function printIsolatedReport(target, layout) {
    if (!target || !hasResultContent(target)) return;
    exportReportAsPDF(target, layout);
  }

  function exportReportAsPNG(target) {
    if (!target || !hasResultContent(target)) {
      alert(t("Нема результату для експорту", "No result to export", "Нет результата для экспорта"));
      return;
    }

    if (!window.html2canvas) {
      alert(t("Бібліотека експорту не завантажилась", "Export library not loaded", "Библиотека экспорта не загружена"));
      return;
    }

    const sourceEl = $(target);
    if (!sourceEl) return;

    const exportBtn = document.querySelector("[data-export-png]");
    const originalText = exportBtn ? exportBtn.textContent : "";
    const fileName = "vitalrise-" + target.replace("-result", "") + "-" + new Date().toISOString().slice(0, 10) + ".png";

    if (exportBtn) {
      exportBtn.textContent = t("Обробка...", "Processing...", "Обработка...");
      exportBtn.disabled = true;
    }

    window.html2canvas(sourceEl, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: "#05060a",
      scale: 2,
      logging: false,
      windowHeight: sourceEl.scrollHeight,
      windowWidth: 430
    }).then(function (canvas) {
      try {
        // Спробуємо toBlob спочатку
        canvas.toBlob(function (blob) {
          if (blob) {
            downloadBlob(blob, fileName);
            finishExport();
            return;
          }

          // Fallback: конвертуємо data URL в blob
          const dataUrl = canvas.toDataURL("image/png");
          dataUrlToBlob(dataUrl, function (blob) {
            if (blob) {
              downloadBlob(blob, fileName);
              finishExport();
            } else {
              throw new Error("Could not convert canvas to blob");
            }
          });
        }, "image/png");
      } catch (error) {
        console.error("PNG canvas error:", error);
        alert(t("Помилка експорту PNG", "PNG export error", "Ошибка экспорта PNG") + ": " + error.message);
        if (exportBtn) {
          exportBtn.textContent = originalText;
          exportBtn.disabled = false;
        }
      }

      function downloadBlob(blob, fileName) {
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      function dataUrlToBlob(dataUrl, callback) {
        try {
          const arr = dataUrl.split(",");
          if (arr.length < 2) {
            console.error("Invalid dataURL format");
            callback(null);
            return;
          }

          let mime = "image/png";
          const mimeMatch = arr[0].match(/:(.*?);/);
          if (mimeMatch && mimeMatch[1]) {
            mime = mimeMatch[1];
          }

          const bstr = atob(arr[1]);
          const n = bstr.length;
          const u8arr = new Uint8Array(n);
          for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
          }
          callback(new Blob([u8arr], { type: mime }));
        } catch (error) {
          console.error("dataUrlToBlob error:", error);
          callback(null);
        }
      }

      function finishExport() {
        if (exportBtn) {
          exportBtn.textContent = originalText;
          exportBtn.disabled = false;
        }
      }
    }).catch(function (error) {
      console.error("PNG export error:", error);
      alert(t("Помилка експорту PNG", "PNG export error", "Ошибка экспорта PNG") + ": " + error.message);
      if (exportBtn) {
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
      }
    });
  }

  function createReportModal() {
    let modal = $("mobile-report-modal");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "mobile-report-modal";
      modal.className = "mobile-report-modal";
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML =
        '<div class="mobile-report-backdrop" data-report-close></div>' +
        '<div class="mobile-report-panel" role="dialog" aria-modal="true" aria-label="VitalRise report">' +
          '<div class="mobile-report-toolbar">' +
            '<div>' +
              '<span class="mobile-report-kicker">VitalRise</span>' +
              '<strong id="mobile-report-toolbar-title">Report</strong>' +
            '</div>' +
            '<button type="button" class="mobile-report-icon-btn" data-report-close aria-label="Закрити">×</button>' +
          '</div>' +
          '<div class="mobile-report-controls" id="mobile-report-controls"></div>' +
          '<div class="mobile-report-phone" id="mobile-report-phone"></div>' +
          '<div class="mobile-report-actions">' +
            '<button type="button" class="btn btn-secondary" data-report-close>' + t("Закрити", "Close", "Закрыть") + '</button>' +
            '<div class="mobile-report-save-actions">' +
              '<button type="button" class="btn btn-secondary" id="mobile-report-export-png" data-export-png>' + t("Зберегти PNG", "Save as PNG", "Сохранить PNG") + '</button>' +
              '<button type="button" class="btn btn-secondary" id="mobile-report-print-mobile">' + t("PDF для телефона", "Mobile PDF", "PDF для телефона") + '</button>' +
              '<button type="button" class="btn btn-primary" id="mobile-report-print-a4">' + t("PDF A4", "PDF A4", "PDF A4") + '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(modal);
    }

    const actions = modal.querySelector(".mobile-report-actions");
    if (actions && !modal.querySelector("#mobile-report-export-png")) {
      actions.innerHTML =
        '<button type="button" class="btn btn-secondary" data-report-close>' + t("Закрити", "Close", "Закрыть") + '</button>' +
        '<div class="mobile-report-save-actions">' +
          '<button type="button" class="btn btn-secondary" id="mobile-report-export-png" data-export-png>' + t("Зберегти PNG", "Save as PNG", "Сохранить PNG") + '</button>' +
          '<button type="button" class="btn btn-secondary" id="mobile-report-print-mobile">' + t("PDF для телефона", "Mobile PDF", "PDF для телефона") + '</button>' +
          '<button type="button" class="btn btn-primary" id="mobile-report-print-a4">' + t("PDF A4", "PDF A4", "PDF A4") + '</button>' +
        '</div>';
    }

    if (modal.dataset.reportReady === "true") return modal;
    modal.dataset.reportReady = "true";

    modal.addEventListener("click", function (event) {
      if (event.target.closest("[data-report-close]")) {
        closeReportModal();
      }
    });

    const pngButton = modal.querySelector("#mobile-report-export-png");
    if (pngButton) {
      pngButton.addEventListener("click", function () {
        exportReportAsPNG(activeTarget);
      });
    }

    const mobilePrintButton = modal.querySelector("#mobile-report-print-mobile");
    if (mobilePrintButton) {
      mobilePrintButton.addEventListener("click", function () {
        printIsolatedReport(activeTarget, "mobile");
      });
    }

    const a4PrintButton = modal.querySelector("#mobile-report-print-a4");
    if (a4PrintButton) {
      a4PrintButton.addEventListener("click", function () {
        printIsolatedReport(activeTarget, "a4");
      });
    }

    return modal;
  }

  function closeReportModal() {
    const modal = $("mobile-report-modal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-mobile-report-open");
  }

  function getTrainingWeeks(source) {
    const weeks = [];
    const titles = Array.from(source.querySelectorAll(".result-subtitle"));

    titles.forEach(function (title) {
      const next = title.nextElementSibling;
      if (next && next.classList.contains("training-days-list")) {
        weeks.push({ title: title, list: next });
      }
    });

    return weeks;
  }

  function getTrainingIntroNodes(source) {
    const weeks = getTrainingWeeks(source);
    const firstWeekTitle = weeks.length ? weeks[0].title : null;
    const nodes = [];
    let child = source.firstElementChild;

    while (child && child !== firstWeekTitle) {
      nodes.push(child.cloneNode(true));
      child = child.nextElementSibling;
    }

    return nodes;
  }

  function getTrainingTipsNodes(source) {
    const weeks = getTrainingWeeks(source);
    if (!weeks.length) return [];

    const lastWeekList = weeks[weeks.length - 1].list;
    const nodes = [];
    let child = lastWeekList.nextElementSibling;

    while (child) {
      nodes.push(child.cloneNode(true));
      child = child.nextElementSibling;
    }

    return nodes;
  }

  function buildTrainingReportContent(source) {
    const content = document.createElement("div");
    const weeks = getTrainingWeeks(source);

    getTrainingIntroNodes(source).forEach(function (node) {
      content.appendChild(node);
    });

    if (!weeks.length || activeScope === "all") {
      weeks.forEach(function (week) {
        content.appendChild(week.title.cloneNode(true));
        content.appendChild(week.list.cloneNode(true));
      });
    } else {
      const index = activeScope === "choose" ? Math.max(0, Number(activeWeek) - 1) : 0;
      const selectedWeek = weeks[index] || weeks[0];
      content.appendChild(selectedWeek.title.cloneNode(true));
      content.appendChild(selectedWeek.list.cloneNode(true));
    }

    getTrainingTipsNodes(source).forEach(function (node) {
      content.appendChild(node);
    });

    return content;
  }

  function buildGenericReportContent(source) {
    const content = document.createElement("div");
    Array.from(source.children).forEach(function (child) {
      if (!child.classList.contains("result-placeholder")) {
        content.appendChild(child.cloneNode(true));
      }
    });
    return content;
  }

  function buildReportContent(target) {
    const source = $(target);
    if (!source) return "";

    const body = target === "training-result"
      ? buildTrainingReportContent(source)
      : buildGenericReportContent(source);

    return (
      '<div class="mobile-report-document">' +
        '<header class="mobile-report-hero">' +
          '<div class="mobile-report-logo"><span>VR</span><strong>VitalRise</strong></div>' +
          '<p>' + t("Мобільний звіт", "Mobile report", "Мобильный отчет") + '</p>' +
          '<h2>' + getTargetTitle(target) + '</h2>' +
          '<small>' + t("Сформовано", "Generated", "Сформировано") + ': ' + getReportDate() + '</small>' +
        '</header>' +
        '<main class="mobile-report-content">' + body.innerHTML + '</main>' +
      '</div>'
    );
  }

  function renderTrainingControls(modal, target) {
    const controls = modal.querySelector("#mobile-report-controls");
    if (!controls) return;

    const source = $(target);
    const weeks = source ? getTrainingWeeks(source) : [];

    if (target !== "training-result" || !weeks.length) {
      controls.innerHTML = "";
      return;
    }

    controls.innerHTML =
      '<label class="mobile-report-control">' +
        '<span>' + t("Формат звіту", "Report format", "Формат отчета") + '</span>' +
        '<select id="mobile-report-scope">' +
          '<option value="current">' + t("Поточний тиждень", "Current week", "Текущая неделя") + '</option>' +
          '<option value="choose">' + t("Обрати тиждень", "Choose week", "Выбрать неделю") + '</option>' +
          '<option value="all">' + t("Усі тижні", "All weeks", "Все недели") + '</option>' +
        '</select>' +
      '</label>' +
      '<label class="mobile-report-control mobile-report-week-control">' +
        '<span>' + t("Тиждень", "Week", "Неделя") + '</span>' +
        '<select id="mobile-report-week">' +
          weeks.map(function (_, index) {
            return '<option value="' + (index + 1) + '">' + t("Тиждень ", "Week ", "Неделя ") + (index + 1) + '</option>';
          }).join("") +
        '</select>' +
      '</label>';

    const scopeSelect = $("mobile-report-scope");
    const weekSelect = $("mobile-report-week");

    if (scopeSelect) {
      scopeSelect.value = activeScope;
      scopeSelect.addEventListener("change", function () {
        activeScope = scopeSelect.value;
        updateReportPreview();
      });
    }

    if (weekSelect) {
      weekSelect.value = activeWeek;
      weekSelect.addEventListener("change", function () {
        activeWeek = weekSelect.value;
        updateReportPreview();
      });
    }
  }

  function updateWeekControlState() {
    const modal = $("mobile-report-modal");
    if (!modal) return;

    const weekControl = modal.querySelector(".mobile-report-week-control");
    if (weekControl) {
      weekControl.hidden = activeScope !== "choose";
    }
  }

  function updateReportPreview() {
    const modal = $("mobile-report-modal");
    const phone = $("mobile-report-phone");
    if (!modal || !phone || !activeTarget) return;

    phone.innerHTML = buildReportContent(activeTarget);
    updateWeekControlState();

    if (window.VitalRiseI18n && typeof window.VitalRiseI18n.apply === "function") {
      window.VitalRiseI18n.apply();
    }
  }

  function openReportModal(target) {
    if (!target || !hasResultContent(target)) return;

    activeTarget = target;
    activeScope = "current";
    activeWeek = "1";

    const modal = createReportModal();
    const title = modal.querySelector("#mobile-report-toolbar-title");

    if (title) title.textContent = getTargetTitle(target);

    renderTrainingControls(modal, target);
    updateReportPreview();

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-mobile-report-open");
  }

  function bindPrintButtons() {
    document.addEventListener("click", function (event) {
      const button = event.target.closest("[data-print-target]");
      if (!button) return;

      event.preventDefault();
      openReportModal(button.dataset.printTarget);
    });

    window.addEventListener("afterprint", function () {
      document.body.classList.remove("is-mobile-report-print");
    });
  }

  system.printTargets = printTargets;
  system.initPrint = bindPrintButtons;
  system.openMobileReport = openReportModal;

  window.VitalRiseSystem = system;

  document.addEventListener("DOMContentLoaded", function () {
    bindPrintButtons();
    console.log("Print module loaded. Libraries available:", {
      html2canvas: typeof window.html2canvas !== "undefined",
      html2pdf: typeof window.html2pdf !== "undefined"
    });
  });
})();
