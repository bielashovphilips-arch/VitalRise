# VitalRise newsletter: Google Sheets

Це безкоштовний стартовий варіант для збору email із блоку "Отримати ранній доступ і знижку".

## 1. Що вже готово на сайті

- Форма відправляє email на `/api/newsletter`.
- Локальний access server зберігає заявки у `.vitalrise-access/access-db.json` у полі `newsletter`.
- Якщо додати `NEWSLETTER_WEBHOOK_URL`, server додатково пересилатиме заявки в Google Sheets Apps Script.
- Якщо сервер не запущений, email тимчасово зберігається у браузері і повторно відправляється пізніше.

## 2. Що створити в Google Sheets

1. Створи Google Sheet з колонками:
   `createdAt`, `email`, `language`, `source`, `page`.
2. Відкрий `Extensions -> Apps Script`.
3. Додай Apps Script `doPost`, який приймає JSON і додає рядок у таблицю.
4. Опублікуй як Web App:
   `Deploy -> New deployment -> Web app`.
5. Доступ: `Anyone with the link`.
6. Скопіюй Web App URL.

Мінімальний Apps Script:

```javascript
function doPost(e) 
  const sheetName = "Leads";
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(["createdAt", "email", "language", "source", "page"]);
  }

  const data = JSON.parse(e.postData.contents || "{}");
  sheet.appendRow([
    data.createdAt || new Date().toISOString(),
    data.email || "",
    data.language || "",
    data.source || "",
    data.page || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Як підключити до локального сервера

Запускай access server з URL:

```powershell
$env:NEWSLETTER_WEBHOOK_URL="PASTE_GOOGLE_APPS_SCRIPT_URL_HERE"
npm run dev:access
```

Після цього кожна підписка з сайту буде збережена локально і відправлена у Google Sheets.
