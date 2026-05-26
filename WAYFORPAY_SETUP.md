# WAYFORPAY - ПОКРОКОВИЙ ГАЙД ДЛЯ VITALRISE

Добре! WayForPay - відмінний вибір. Це найбільша платіжна система в Україні для e-commerce.

---

## 🚀 6 КРОКІВ ДО РОБОЧОЇ ПЛАТІЖНОЇ СИСТЕМИ

### **КРОК 1: РЕЄСТРАЦІЯ НА WAYFORPAY**

1. Перейди на https://wayforportal.com/uk/
2. Клікни **"Для бізнесу"** → **"Почати"** або **"Реєстрація"**
3. Заповни форму:
   - ПІБ: твоє ім'я
   - Email: твоя електронна пошта
   - Телефон: твій номер (+38...)
   - Пароль: безпечний пароль
4. Клікни "Реєстрація"
5. Перевір email - має прийти лист з активацією
6. Клікни посилання в листі

✅ **Готово! Акаунт активований.**

---

### **КРОК 2: ЗАПОВНЕННЯ ДАНИХ КОМПАНІЇ**

1. Залогуйся на https://wayforportal.com/uk/ (введи email і пароль)
2. Перейди в **"Налаштування"** → **"Профіль"** (або **"Мої дані"**)
3. Заповни:
   - Назва компанії: **VitalRise**
   - ІПН (або ЕДДР): твій номер
   - Юридична адреса: адреса компанії
   - Телефон компанії: контактний номер
   - Вебсайт: https://yourdomain.com
4. Клікни **"Зберегти"**

---

### **КРОК 3: ЗАВАНТАЖЕННЯ ДОКУМЕНТІВ**

1. У тому ж розділі "Налаштування" → **"Документи"** 
2. Завантаж:
   - ✅ Копію паспорта (сторінки 1-2)
   - ✅ ПДВ свідоцтво (якщо є)
   - ✅ Виписку з реєстру (якщо ФОП/ТОВ)
3. Клікни **"Надіслати на перевірку"**
4. **Чекай 1-5 днів** (WayForPay перевіряє документи)

📧 Коли затвердять - прийде email "Акаунт активований"

---

### **КРОК 4: ОТРИМАЙ API КЛЮЧІ (WEBHOOK SECRET)**

Коли акаунт затверджений:

1. Залогуйся в кабінеті: https://wayforportal.com/uk/cabinet
2. Перейди **"Інтеграція"** → **"API"** (або **"Розробники"**)
3. Знайди цей раділ - там будуть ключі:

```
Merchant ID: 123456 (запам'ятай)
API Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (скопіюй це!)
Secret Key: yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy (ГЛАВНИЙ СЕКРЕТ - скопіюй!)
```

4. **Скопіюй Secret Key** і збережи його хде-небудь безпечно:

```
WAYFORPAY_WEBHOOK_SECRET = yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

⚠️ **ВАЖНО**: Не поділяйся цим ключем з нікимм!

---

### **КРОК 5: НАЛАШТУЙ WEBHOOK URL**

1. Все ще в розділі **"Інтеграція"** → **"API"** або **"Webhook"**
2. Знайди поле **"Webhook URL"** або **"URL для сповіщень"**
3. Вставь туди цю адресу (замість yourdomain.com вставь свій реальний домен):

```
https://yourdomain.com/api/access/webhook/wayforpay
```

**Приклади реальних URL'ів**:
- ✅ `https://vitalrise.ua/api/access/webhook/wayforpay`
- ✅ `https://athlete-body.com.ua/api/access/webhook/wayforpay`
- ✅ `https://my-app.com/api/access/webhook/wayforpay`

4. Клікни **"Зберегти"** або **"Активувати webhook"**

✅ **Готово! WayForPay тепер знає куди відправляти платежі.**

---

### **КРОК 6: ЗАПУСТИ СЕРВЕР З WAYFORPAY SECRET**

Тепер запусти локально сервер з твоїм secret ключем:

#### **На Windows (PowerShell):**

```powershell
# Перейди в папку проекту
cd c:\Users\Yevgen\Desktop\VitalRise

# Запусти сервер з WayForPay secret
$env:WAYFORPAY_WEBHOOK_SECRET="yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"; node tools/access-server.js
```

**Замість `yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy` вставь твій реальний Secret Key від WayForPay!**

#### **Очікуваний вивід:**
```
VitalRise access server running at http://127.0.0.1:4175/
Mock payments: off
```

✅ **Сервер запущений!**

---

## 🧪 ТЕСТУВАННЯ ЛОКАЛЬНО

### **Тест 1: Без реальних грошей (Mock mode)**

```powershell
# Закрий попередній сервер (Ctrl+C)

# Запусти в mock режимі
$env:ACCESS_MOCK_PAYMENTS="1"; node tools/access-server.js
```

Тепер:
1. Відкрий http://127.0.0.1:4175/
2. Клікни на тариф (Start, Pro або Premium)
3. Введи email: `test@example.com`
4. Натисни **"Перейти до оплати"**
5. Бачиш: **"Тестову оплату підтверджено. Доступ відкрито."**

✅ **Це працює! Платіжна система готова.**

---

### **Тест 2: З реальним WayForPay secret (але в test режимі)**

WayForPay має **test режим** - платежи не справжні, гроші не списуються.

1. Залогуйся в WayForPay кабінеті
2. Перейди **"Налаштування"** → **"Тестування"** або **"Test mode"**
3. **Включи тестовий режим** (мас бути toggle "ON")
4. Запусти сервер з реальним secret (не mock):

```powershell
$env:WAYFORPAY_WEBHOOK_SECRET="твій-реальний-secret-від-вейфорпей"; node tools/access-server.js
```

5. Тестуй платіж:
   - http://127.0.0.1:4175/
   - Вибери тариф
   - Введи email
   - Натисни "Перейти до оплати"
   - Платіж буде в тестовому режимі (реальних грошей немає)

✅ **WayForPay автоматично відправить webhook → сервер підтвердить заказ → доступ активуватиметься!**

---

## 📊 КАК ВЕРОВАТНІ ПОТОКОВЕ ПЛАТЕЖІ

Коли все налаштовано, платіжний процес виглядатиме так:

```
👤 Користувач                WayForPay          🖥️ Твій сервер
   │                            │                     │
   ├─ Вибирає тариф ───────────>│                     │
   ├─ Вводить email ───────────>│                     │
   ├─ Натискає "оплатити" ─────>│                     │
   │                            │                     │
   │                      [Платіж обробляється]      │
   │                            │                     │
   │                      [Платіж успішний]          │
   │                            │                     │
   │                            ├──── WEBHOOK ───────>│
   │                            │   (автоматично)    │
   │                            │                     │
   │                            │    [Сервер         │
   │                            │   перевіряє        │
   │                            │   підпис]          │
   │                            │                     │
   │                            │    [Видає         │
   │                            │    access token]   │
   │                            │                     │
   │ <────── Доступ активний ─────────────────────── │
   │                            │                     │
   ✅ Користувач видит модулі │                     │
```

---

## 🚀 РОЗГОРТАННЯ НА PRODUCTION

Коли локально все працює, розгорни на реальний сервер:

### **На Linux сервері (VPS/Dedicated):**

```bash
# 1. SSH на сервер
ssh user@yourdomain.com

# 2. Перейди в папку проекту
cd /var/www/vitalrise

# 3. Запусти сервер з secret
export WAYFORPAY_WEBHOOK_SECRET="твій-реальний-secret"
node tools/access-server.js

# Або краще - використай PM2 щоб процес не завершився:
npm install -g pm2
pm2 start "node tools/access-server.js" --name vitalrise-payments
pm2 env WAYFORPAY_WEBHOOK_SECRET "твій-реальний-secret"
```

### **На Heroku / Render / Railway (хмарні платформи):**

1. Залогуйся на платформу (Heroku, Render, Railway, тощо)
2. Створи нову app
3. В налаштуваннях app додай **Environment Variable**:
   ```
   WAYFORPAY_WEBHOOK_SECRET = твій-реальний-secret-від-вейфорпей
   ```
4. Deploy код
5. В WayForPay кабінеті оновай webhook URL на твій production domain:
   ```
   https://твійа-app.herokuapp.com/api/access/webhook/wayforpay
   ```

✅ **Production готовий!**

---

## ✅ ЧЕКЛИСТ ПЕРЕД ЗАПУСКОМ

Перш ніж йти в production, переконайся що:

- [ ] Зареєстрований на WayForPay (https://wayforportal.com/uk/)
- [ ] Завантажив документи і вони затверджені (статус "Активно")
- [ ] Отримав Secret Key з розділу "Інтеграція" → "API"
- [ ] Налаштував webhook URL: `https://yourdomain.com/api/access/webhook/wayforpay`
- [ ] Локально запустив сервер з WAYFORPAY_WEBHOOK_SECRET (тестовий платіж пройшов)
- [ ] Видно в логах: `✓ WayForPay payment confirmed for order...`
- [ ] Користувач сразу видит доступ після платежу
- [ ] GA4 трекирует события (view_tier, begin_checkout, purchase)
- [ ] Код розгорнений на production
- [ ] Production webhook URL налаштований в WayForPay кабінеті

---

## 🆘 ПРОБЛЕМИ WAYFORPAY

### ❌ "Webhook не срабатывает"

**Перевіри**:
1. Webhook URL правильно введений в WayForPay кабінеті (без опечаток, з https://)
2. Secret Key правильно встановлений як environment variable:
   ```powershell
   echo $env:WAYFORPAY_WEBHOOK_SECRET  # Має показати твій secret
   ```
3. Перезапусти сервер з новим secret
4. В WayForPay кабінеті тестовий webhook:
   - Налаштування → API → "Test webhook"
   - Натисни кнопку "Send test webhook"
   - Перевір логи сервера

### ❌ "403 Forbidden на webhook"

Secret неправильний або не встановлений.

**Рішення**:
1. Перевір що скопіював **Secret Key** (не API Key!)
2. Перевір що встановив саме WAYFORPAY_WEBHOOK_SECRET (не LIQPAY_!)
3. Перезапусти сервер:
   ```powershell
   $env:WAYFORPAY_WEBHOOK_SECRET="твій-secret"; node tools/access-server.js
   ```

### ❌ "500 error на сервері при webhook"

Ймовірно помилка в коді або БД.

**Рішення**:
1. Перевір логи сервера - там буде деталь помилки
2. Перевір що файл `tools/access-server.js` містить WayForPay handler (рядки 400-430 приблизно)
3. Перезапусти сервер

---

## 📞 ПОДДЕРЖКА WAYFORPAY

| Контакт | Адреса |
|---------|--------|
| Email поддержки | support@wayforportal.com |
| Документація API | https://wayforportal.com/uk/api |
| Статус сервісу | https://wayforportal.com/api-status |
| Статья про webhook | https://wayforportal.com/uk/api#webhook |

---

## ✨ ВСЕ ГОТОВО!

Якщо ти:
1. ✅ Зареєстрований на WayForPay
2. ✅ Отримав Secret Key
3. ✅ Налаштував webhook URL
4. ✅ Запустив сервер з secret
5. ✅ Тестовий платіж прошов

То **платіжна система VitalRise з WayForPay готова до production!** 🎉

---

## 📚 ПОСИЛАННЯ

- **WayForPay Кабінет**: https://wayforportal.com/uk/cabinet
- **API Документація**: https://wayforportal.com/uk/api
- **VitalRise SALES_SETUP.md**: `c:\Users\Yevgen\Desktop\VitalRise\SALES_SETUP.md`
- **Webhook код**: `c:\Users\Yevgen\Desktop\VitalRise\tools\access-server.js` (рядки 400-430)

---

**Питання? Напиши мені! Готовий допомогти налаштувати WayForPay! 🚀**
