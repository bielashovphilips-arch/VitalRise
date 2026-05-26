# ПЛАТІЖНА СИСТЕМА: ПОКРОКОВИЙ ГАЙД

## 📋 ВИБІР ПЛАТІЖНОГО ПРОВАЙДЕРА

Вибери **один** з трьох (найпопулярніший в Україні - **LiqPay**):

| Провайдер | Краї | Комісія | Популярність |
|-----------|------|---------|-------------|
| **LiqPay** | 🇺🇦 Україна | 1.5% | ⭐⭐⭐⭐⭐ (найпопулярніший) |
| **WayForPay** | 🇺🇦 Україна | 2% | ⭐⭐⭐⭐ |
| **Mono** | 🇺🇦 Україна | 2% | ⭐⭐⭐⭐ |

**Рекомендація**: Почни з **LiqPay** (найбільше користувачів в Україні).

---

## 🎯 КРОК 1: РЕЄСТРАЦІЯ В ПЛАТІЖНОМУ СЕРВІСІ

### Якщо обираєш **LiqPay**:

1. Перейди на https://www.liqpay.ua/
2. Клікни "Для бізнесу" → "Інтеграція"
3. Заповни форму регістрації:
   - Ім'я компанії: VitalRise
   - Email: твій email
   - Телефон: твій номер
4. Підтвердь email (перейди по посиланню)
5. Завантажи документи (паспорт, ПДВ свідоцтво)
6. Чекай активації (1-5 днів)

### Якщо обираєш **WayForPay**:

1. Перейди на https://wayforportal.com/uk/
2. Клікни "Особистий кабінет" → "Реєстрація"
3. Заповни дані компанії
4. Підтвердь через SMS
5. Завантажи документи
6. Чекай активації

### Якщо обираєш **Mono**:

1. Перейди на https://monobank.ua/uk/business
2. Клікни "Підключитися"
3. Заповни форму компанії
4. Завантажи документи
5. Чекай активації

---

## 🔑 КРОК 2: ОТРИМАЙ API КЛЮЧІ (WEBHOOK SECRET)

Після активації аккаунту у платіжному сервісі:

### 📍 LiqPay:

1. Залогуйся в особистому кабінеті https://www.liqpay.ua/uk/admin/
2. Перейди "Налаштування" → "API"
3. Знайди поле **"Webhook Secret"** (або "Секретний ключ")
4. Скопіюй його (виглядає так: `abc123def456ghi789`)
5. Збережи de цьому месте! 👇

```
LIQPAY_WEBHOOK_SECRET = ___________________________
```

### 📍 WayForPay:

1. Залогуйся в https://wayforportal.com/uk/
2. "Налаштування" → "API"
3. Знайди "Secret Key"
4. Скопіюй його
5. Збережи:

```
WAYFORPAY_WEBHOOK_SECRET = ___________________________
```

### 📍 Mono:

1. Залогуйся в https://dashboard.monobank.ua/
2. "Інтеграція" → "Webhook"
3. Знайди "API Key"
4. Скопіюй його
5. Збережи:

```
MONO_WEBHOOK_SECRET = ___________________________
```

---

## 🌐 КРОК 3: НАЛАШТУЙ WEBHOOK URL

Webhook URL - це адреса, на яку платіжний сервіс відправить повідомлення про успішний платіж.

### Твій webhook URL буде одним з цих (залежить від провайдера):

| Провайдер | Webhook URL |
|-----------|------------|
| LiqPay | `https://yourdomain.com/api/access/webhook/liqpay` |
| WayForPay | `https://yourdomain.com/api/access/webhook/wayforpay` |
| Mono | `https://yourdomain.com/api/access/webhook/mono` |

**❌ ВАЖНО**: Замість `yourdomain.com` підставь свій реальний домен!

**Приклади**:
- ✅ `https://vitalrise.ua/api/access/webhook/liqpay`
- ✅ `https://athlete.com.ua/api/access/webhook/wayforpay`
- ✅ `https://mysite.com.ua/api/access/webhook/mono`

### Де ввести webhook URL:

#### 📍 LiqPay:
1. Особистий кабінет → Налаштування → API
2. Поле **"Webhook URL"** або **"Адреса callback"**
3. Вставь свій URL: `https://yourdomain.com/api/access/webhook/liqpay`
4. Збережи

#### 📍 WayForPay:
1. Особистий кабінет → Налаштування → Webhook
2. Поле **"URL для сповіщень"** або **"Webhook URL"**
3. Вставь: `https://yourdomain.com/api/access/webhook/wayforpay`
4. Збережи

#### 📍 Mono:
1. Особистий кабінет → Інтеграція → Webhook
2. Поле **"Webhook URL"**
3. Вставь: `https://yourdomain.com/api/access/webhook/mono`
4. Збережи

---

## 💻 КРОК 4: ВСТАВ СЕКРЕТ НА СЕРВЕР

Теперь потрібно сказати серверу який секрет використовувати.

### На локальній машині (Windows):

**Закрий** старий сервер (Ctrl+C) якщо він запущений.

Відкрий PowerShell **в папці проекту** (`c:\Users\Yevgen\Desktop\VitalRise`):

```powershell
# Якщо використовуєш LiqPay:
$env:LIQPAY_WEBHOOK_SECRET=" твій-секрет-від-лікпей"; node tools/access-server.js

# Або якщо WayForPay:
$env:WAYFORPAY_WEBHOOK_SECRET=" твій-секрет-від-вейфорпей"; node tools/access-server.js

# Або якщо Mono:
$env:MONO_WEBHOOK_SECRET=" твій-секрет-від-мон"; node tools/access-server.js
```

**Приклад** (реальні значення):
```powershell
$env:LIQPAY_WEBHOOK_SECRET="abc123def456ghi789jkl"; node tools/access-server.js
```

**Очікуваний вивід**:
```
VitalRise access server running at http://127.0.0.1:4175/
Mock payments: off
```

✅ Якщо бачиш це - сервер запущений!

---

## 🧪 КРОК 5: ТЕСТУВАННЯ (БЕЗ РЕАЛЬНИХ ГРОШЕЙ)

### Варіант A: Mock платежи (НЕ потрібні реальні гроші):

```powershell
$env:ACCESS_MOCK_PAYMENTS="1"; node tools/access-server.js
```

Тепер **всі платежи** будуть автоматично підтверджуватися:

1. Відкрий http://127.0.0.1:4175/
2. Натисни на тариф (Start/Pro/Premium)
3. Введи email: `test@example.com`
4. Натисни "Перейти до оплати"
5. Бачиш: **"Тестову оплату підтверджено. Доступ відкрито."**

✅ Працює! Можеш вводити дані любі (реальні гроші не списуватимуться).

### Варіант B: Test платіжного сервісу (рекомендується):

Кожний платіжний сервіс мас **test mode**:

#### LiqPay test:
1. Особистий кабінет → Налаштування
2. Включи **"Test Mode"** або **"Тестовий режим"**
3. Запусти сервер з реальним секретом:
   ```powershell
   $env:LIQPAY_WEBHOOK_SECRET="твій-реальний-секрет"; node tools/access-server.js
   ```
4. Спробуй платіж - буде в тестовому режимі (реальних грошей не буде)

#### WayForPay test:
- Аналогічно: включи Test Mode в налаштуваннях

#### Mono test:
- Аналогічно: включи Test Mode в налаштуваннях

---

## 🚀 КРОК 6: РОЗГОРТАННЯ НА СЕРВЕР (PRODUCTION)

Як тільки локально працює, розгортаємо на реальний сервер.

### На Linux/VPS сервері:

```bash
# 1. SSH на сервер
ssh user@yourdomain.com

# 2. Перейди в папку проекту
cd /var/www/vitalrise

# 3. Запусти сервер із secret (постійно)
export LIQPAY_WEBHOOK_SECRET="твій-реальний-секрет"
node tools/access-server.js

# Або краще - використай PM2 щоб сервер не вмирав:
npm install -g pm2
pm2 start tools/access-server.js --name vitalrise-payments --update-env
```

### На Heroku / хмарному хостингу:

1. Перейди на сайт хостингу (Heroku, Render, Railway, тощо)
2. Создай нову app
3. Налаштуй environment variables:
   ```
   LIQPAY_WEBHOOK_SECRET=твій-реальний-секрет
   ```
4. Deploy код
5. Вестави webhook URL в платіжному сервісі (буде `https://твойaрр.herokuapp.com/api/access/webhook/liqpay`)

---

## ✅ ЧЕКЛИСТ: КОЛИ ВСЕ ГОТОВО

Перш ніж іти в production, переконайся що:

- [ ] Зареєстрований акаунт у платіжному сервісі (LiqPay/WayForPay/Mono)
- [ ] Отримав webhook secret (скопійовано, збережено)
- [ ] Налаштував webhook URL у платіжному сервісі (до твого domain)
- [ ] Локально протестував із mock платежами (`ACCESS_MOCK_PAYMENTS=1`)
- [ ] Локально протестував із реальним secret (без реальних грошей - test mode)
- [ ] Бачиш "Order created" → автоматичне підтвердження → user видит access
- [ ] GA4 трекирует события (view_tier, begin_checkout, purchase)
- [ ] Код розгорнений на сервер
- [ ] Webhook URL з реальним domain налаштовані у платіжному сервісі
- [ ] Першій тестовий платіж в production прошов успішно

---

## 🆘 ПРОБЛЕМИ ТА РІШЕННЯ

### ❌ Проблема: "Webhook не срабатывает"

**Рішення**:
1. Перевір webhook URL у платіжному сервісі (має бути повністю правильно, з https://)
2. Перевір що environment variable встановлений:
   ```powershell
   $env:LIQPAY_WEBHOOK_SECRET  # Має показати твій секрет
   ```
3. Перевір логи сервера - там видно вхідні webhook запити
4. Спробуй test webhook прямо з dashboard платіжного сервісу

### ❌ Проблема: "403 Forbidden" на webhook

**Рішення**: Секрет неправильний або не встановлений. Перевір:
```powershell
# Мас вивести твій secret
echo $env:LIQPAY_WEBHOOK_SECRET

# Якщо пусто - встанови заново:
$env:LIQPAY_WEBHOOK_SECRET="abc123..."
```

### ❌ Проблема: Order створюється але не підтверджується

**Рішення**: 
1. Перевір webhook signature verification в коді (`tools/access-server.js` рядки 175-195)
2. Перевір що orderId в webhook збігається з orderId в БД
3. Перевір логи - `console.log` має показати `✓ LiqPay payment confirmed for order...`

### ❌ Проблема: "Server is not responding" при checkout

**Рішення**:
1. Чи запущен сервер? 
   ```
   ps aux | grep "node tools/access-server.js"
   ```
2. Чи слухає порт 4175?
   ```
   netstat -an | grep 4175
   ```
3. Перезапусти сервер

---

## 📞 ПОДДЕРЖКА ПЛАТІЖНИХ СЕРВІСІВ

| Провайдер | Лінія поддержки | Статус API |
|-----------|-----------------|-----------|
| LiqPay | support@liqpay.ua / https://liqpay.ua/uk/support | https://status.liqpay.ua/ |
| WayForPay | support@wayforportal.com / https://wayforportal.com/support | https://wayforportal.com/api-status |
| Mono | support@monobank.ua / https://discord.gg/mono | https://status.mono.co/ |

---

## 🎓 РЕЗЮМЕ ЯК ВСЕ ПРАЦЮЄ

```
1. Користувач клікає тариф
   ↓
2. Вводить email
   ↓
3. Натискає "Перейти до оплати"
   ↓
4. Платіжний сервіс отримує платіж
   ↓
5. Платіжний сервіс АВТОМАТИЧНО ВІДПРАВЛЯЄ WEBHOOK на твій сервер
   ↓
6. Сервер (tools/access-server.js) отримує webhook
   ↓
7. Сервер перевіряє підпис (щоб це був реальний webhook)
   ↓
8. Сервер створює access token
   ↓
9. Користувач СРАЗУ видит доступ до модуля
```

**Без webhook**: Процес 5-9 не буває, потрібна ручна активація.  
**З webhook**: Все автоматично за < 1 секунду.

---

## ✨ ГОТОВО!

Якщо все зроблено правильно - платіжна система запрацює автоматично 🎉

Питання? Дивися `SALES_SETUP.md` або `tools/access-server.js` де написан весь код webhook'ів.
