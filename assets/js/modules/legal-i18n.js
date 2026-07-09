(function () {
  const pageName = document.body.dataset.legalPage;
  if (!pageName) return;

  const pages = {
    privacy: {
      uk: {
        title: "VitalRise — Політика конфіденційності",
        description: "Політика конфіденційності VitalRise: які дані може обробляти сайт, як вони використовуються і як користувач контролює збережену інформацію.",
        heroTitle: "Політика конфіденційності",
        heroLead: "Політика конфіденційності VitalRise. Останнє оновлення: 9 липня 2026."
      },
      en: {
        title: "VitalRise — Privacy Policy",
        description: "VitalRise Privacy Policy: what data the site may process, how it is used, and how users control stored information.",
        heroTitle: "Privacy Policy",
        heroLead: "VitalRise Privacy Policy. Last updated: July 9, 2026.",
        headings: [
          "1. Data VitalRise may process",
          "2. How the data is used",
          "3. Payments, email, and analytics",
          "4. Medical and sensitive data",
          "5. Sharing with third parties",
          "6. User control",
          "7. Policy updates"
        ],
        paragraphs: [
          "VitalRise may process data that users enter into site forms themselves: sex, age, height, weight, goal, activity level, nutrition preferences, training context, progress measurements, laboratory values, check-ins, and an email address for access or communication.",
          "Some information may be stored locally in the user's browser so the site can remember calculations, nutrition plans, progress, and access. Users can clear this data with the button in the main-page footer or through their browser settings.",
          "The data is used to calculate calories and macros, build nutrition plans and training recommendations, create laboratory checklists, track progress, generate PDF/Blueprint materials, manage access to paid modules, and improve the site.",
          "When a user pays for access, the commercial provider of paid access is sole proprietor Bielashova Marianna Ihorivna, taxpayer registration number 3283103940, address: Kyiv, Kharkivske Shose Street, 168D, apartment 51. In payment documents, the recipient may appear as FOP Bielashova M.I.",
          "Seller contacts and the contact for access, payment, refund, and personal-data requests: phone +38 (093) 581-06-28, email info@vitalrise.com.ua.",
          "Payment details are processed by the WayForPay payment provider. VitalRise and FOP Bielashova M.I. do not store full bank-card details. To create an order, confirm access, send service messages, restore access, and communicate about the product, the site may use the user's email, order amount, plan, technical payment identifier, payment status, subscription status, next charge date, and data required to cancel or verify automatic renewal. To manage access, the site may also store the purchase date, the 45-day start window, the program activation date, and the end date of the 30-day active period.",
          "The site may use visitor analytics. It helps us understand which sections work, where users stop, and what should be improved.",
          "Laboratory markers, hormones, information about medicines, AS/AAS, symptoms, diagnoses, or treatment are sensitive information. Users decide whether to enter such data. VitalRise is not a medical record and does not replace a doctor's consultation.",
          "Data may be processed by services that keep the site running, including hosting, payment, email, analytics, and technical service providers. VitalRise does not sell personal data as a standalone product.",
          "Users may clear local data, export or import a JSON copy, choose not to enter sensitive information, unsubscribe from marketing messages, and contact VitalRise through its official contact to request access, correction, or deletion of data.",
          "This policy may be updated before new features, payments, analytics, email campaigns, or personal accounts are launched. The current version is published on this page."
        ]
      },
      ru: {
        title: "VitalRise — Политика конфиденциальности",
        description: "Политика конфиденциальности VitalRise: какие данные может обрабатывать сайт, как они используются и как пользователь контролирует сохраненную информацию.",
        heroTitle: "Политика конфиденциальности",
        heroLead: "Политика конфиденциальности VitalRise. Последнее обновление: 9 июля 2026.",
        headings: [
          "1. Какие данные может обрабатывать VitalRise",
          "2. Для чего используются данные",
          "3. Платежи, email и аналитика",
          "4. Медицинские и чувствительные данные",
          "5. Передача третьим сторонам",
          "6. Контроль пользователя",
          "7. Обновления политики"
        ],
        paragraphs: [
          "VitalRise может обрабатывать данные, которые пользователь сам вводит в формы сайта: пол, возраст, рост, вес, цель, активность, настройки питания, тренировочный контекст, замеры прогресса, лабораторные значения, чек-ины, email для доступа или связи.",
          "Часть информации может храниться локально в браузере пользователя, чтобы сайт помнил расчеты, рацион, прогресс и доступ. Пользователь может очистить эти данные кнопкой в футере главной страницы или через настройки браузера.",
          "Данные используются для расчета калорий, БЖУ, рациона, тренировочных рекомендаций, лабораторного чек-листа, прогресса, формирования PDF/Blueprint, управления доступом к платным модулям и улучшения работы сайта.",
          "Если пользователь оплачивает доступ, коммерческим поставщиком платного доступа является ФЛП Белашова Марианна Игоревна, РНУКПН 3283103940, адрес: г. Киев, ул. Харьковское шоссе, 168Д, кв. 51. В платежных документах получатель может отображаться как ФЛП Белашова М.И.",
          "Контакты продавца и контакт для запросов по доступу, платежам, возврату средств и персональным данным: телефон +38 (093) 581-06-28, email info@vitalrise.com.ua.",
          "Платежные данные обрабатывает платежный провайдер WayForPay. VitalRise и ФЛП Белашова М.И. не хранят полные данные банковской карты. Для создания заказа, подтверждения доступа, служебных сообщений, восстановления доступа и коммуникации о продукте могут использоваться email, сумма заказа, тариф, технический идентификатор платежа, статус оплаты, статус подписки, дата следующего списания и данные, необходимые для отмены или проверки автоматического продления. Для учета доступа также могут храниться дата покупки, 45-дневный срок для старта, дата активации программы и дата завершения 30-дневного активного периода.",
          "На сайте может использоваться аналитика посещений. Она нужна, чтобы понимать, какие блоки работают, где пользователи останавливаются и что следует улучшить.",
          "Лабораторные показатели, гормоны, информация о препаратах, АС/ААС, симптомы, диагнозы или лечение являются чувствительной информацией. Пользователь сам решает, вводить ли такие данные. VitalRise не является медицинской картой и не заменяет консультацию врача.",
          "Данные могут обрабатываться сервисами, обеспечивающими работу сайта: хостингом, платежным провайдером, email-сервисом, аналитикой или техническими инструментами. VitalRise не продает персональные данные как отдельный продукт.",
          "Пользователь может очистить локальные данные, экспортировать или импортировать JSON-копию, не вводить чувствительную информацию, отказаться от маркетинговых сообщений и обратиться по вопросам доступа, исправления или удаления данных через официальный контакт VitalRise.",
          "Политика может обновляться перед запуском новых функций, платежей, аналитики, email-рассылок или личных кабинетов. Актуальная версия публикуется на этой странице."
        ]
      }
    },
    terms: {
      uk: {
        title: "VitalRise — Умови використання",
        description: "Умови використання VitalRise: правила доступу, оплати, відповідальності користувача, контенту та обмежень сервісу.",
        heroTitle: "Умови використання",
        heroLead: "Умови використання VitalRise. Останнє оновлення: 9 липня 2026."
      },
      en: {
        title: "VitalRise — Terms of Use",
        description: "VitalRise Terms of Use: rules for access, payments, user responsibility, content, and service limitations.",
        heroTitle: "Terms of Use",
        heroLead: "VitalRise Terms of Use. Last updated: July 9, 2026.",
        headings: [
          "1. Service provider and payment details",
          "2. Purpose of the service",
          "3. User responsibility",
          "4. Paid access",
          "5. Payments and refunds",
          "6. Content and intellectual property",
          "7. Disclaimer of warranties",
          "8. Prohibited use",
          "9. Changes to these terms"
        ],
        paragraphs: [
          "Paid access and commercial VitalRise services are provided by sole proprietor Bielashova Marianna Ihorivna, who may also be referred to as FOP Bielashova M.I. Taxpayer registration number: 3283103940. Registered and actual address: Kyiv, Kharkivske Shose Street, 168D, apartment 51.",
          "Seller contact information for payment, access, refund, and transaction-cancellation requests: sole proprietor Bielashova Marianna Ihorivna, taxpayer registration number 3283103940; registered and actual address: Kyiv, Kharkivske Shose Street, 168D, apartment 51; phone: +38 (093) 581-06-28; email: info@vitalrise.com.ua.",
          "FOP Bielashova M.I. operates under the simplified taxation system, group 2. Payment is accepted through the WayForPay payment service. In payment documents, receipts, or bank statements, the recipient may appear as FOP Bielashova M.I.",
          "The name VitalRise is used as the name of the service, interface, and materials. Unless another provider is expressly indicated before payment, the paid-access contract is concluded between the user and FOP Bielashova M.I.",
          "VitalRise is an educational and analytical service for nutrition, training, supplements, laboratory monitoring, progress, and vlog content about medical and pharmacological topics. The service is not a medical institution, does not diagnose conditions, and does not prescribe treatment.",
          "Users are responsible for the accuracy of the data they enter, their decisions about nutrition, training, supplements and lab tests, seeking medical advice, and complying with the laws of their country. Any symptoms, abnormal test results, or issues involving blood pressure, the heart, hormones, liver, kidneys, or mental health require consultation with a qualified professional.",
          "Some features may be available only after payment, including an expanded plan, personal adjustments, PDF/Blueprint materials, in-depth content, or other modules. Access may not be transferred to third parties, resold, or used to copy materials at scale. Unless a plan description states otherwise, after payment confirmation the user has 45 calendar days to start the program. After the first program calculation is run, 30 calendar days of active access begin.",
          "Payment terms, access duration, plan contents, price, access-delivery procedure, and refund eligibility must be shown to the user before purchase. Payment is made through WayForPay; VitalRise and FOP Bielashova M.I. do not store full bank-card details. If a separate refund policy is published on the site, it forms part of these terms.",
          "Paid plans may be sold as a subscription with automatic renewal. Auto-renewal may be enabled by default in the payment form, but the user can uncheck it before payment and buy the plan without a subscription. If auto-renewal remains enabled, after the active 30-day program ends, the cost of the selected plan is charged automatically for the next period unless the user cancels the subscription before the next charge date.",
          "A refund is possible before the 30-day program is activated, for an accidental duplicate payment, or if access does not open after successful payment and the technical issue cannot be resolved. After the program and access to digital materials are activated, refunds do not apply except where directly required by law or separately agreed with FOP Bielashova M.I. Cancelling a subscription stops future charges but does not cancel the already provided current access period.",
          "To initiate a refund or cancellation of an accidental transaction, the user should contact info@vitalrise.com.ua or +38 (093) 581-06-28 and provide the access email, plan, payment date and amount, and the reason for the request. If applicable, the refund is processed after checking the access and transaction status, usually through the same payment method via WayForPay.",
          "The texts, page structure, calculators, selection algorithms, educational materials, exercise database, supplement and medicine catalogs, tables, PDF/Blueprint materials, design, interface, code, VitalRise name, logo, and visual elements belong to VitalRise or are used lawfully.",
          "Users receive the right to use service materials only for personal informational, educational, and training purposes. Personal reports, plans, protocols, PDFs, or Blueprints may be saved for personal use, but may not be sold, published as the user's own product, distributed publicly at scale, or used to create a competing service.",
          "It is prohibited to copy, scrape, automatically collect, reproduce, translate for commercial use, adapt, resell, or publicly distribute substantial portions of VitalRise content without written permission. Creating a clone of the service or copying calculator logic, protocol structure, the knowledge base, catalogs, design, or paid materials is prohibited.",
          "Names of third-party medicines, supplements, brands, trademarks, sources, and images may belong to their respective owners. Their mention on VitalRise is informational or educational and does not imply partnership, endorsement, or transfer of rights. Third-party materials are used with source attribution, on a lawful basis, or must be replaced with owned or licensed materials when required.",
          "VitalRise does not guarantee a specific amount of weight loss, muscle gain, changes in lab results, athletic performance, or medical effect. Results depend on health, routine, nutrition, training, sleep, stress, genetics, discipline, and medical context.",
          "The site may not be used for self-treatment, dangerous pharmacological experiments, bypassing medical care, violating anti-doping rules, sharing access, hacking, automated collection of materials, or entering another person's data without consent.",
          "VitalRise may update these terms when pricing, access, features, payment systems, legal requirements, or the service format changes. The current version is published on this page."
        ]
      },
      ru: {
        title: "VitalRise — Условия использования",
        description: "Условия использования VitalRise: правила доступа, оплаты, ответственности пользователя, контента и ограничений сервиса.",
        heroTitle: "Условия использования",
        heroLead: "Условия использования VitalRise. Последнее обновление: 9 июля 2026.",
        headings: [
          "1. Поставщик услуг и платежные реквизиты",
          "2. Назначение сервиса",
          "3. Ответственность пользователя",
          "4. Платный доступ",
          "5. Оплата и возврат",
          "6. Контент и интеллектуальная собственность",
          "7. Ограничение гарантий",
          "8. Запрещенное использование",
          "9. Изменения условий"
        ],
        paragraphs: [
          "Платный доступ и коммерческие услуги VitalRise предоставляет ФЛП Белашова Марианна Игоревна, которая также может указываться как ФЛП Белашова М.И. Регистрационный номер учетной карточки налогоплательщика: 3283103940. Регистрационный и фактический адрес: г. Киев, ул. Харьковское шоссе, 168Д, кв. 51.",
          "Контактная информация продавца для вопросов оплаты, доступа, возврата средств и отмены транзакции: ФЛП Белашова Марианна Игоревна, РНУКПН 3283103940; регистрационный и фактический адрес: г. Киев, ул. Харьковское шоссе, 168Д, кв. 51; телефон: +38 (093) 581-06-28; email: info@vitalrise.com.ua.",
          "ФЛП Белашова М.И. работает на упрощенной системе налогообложения, 2 группа. Оплата принимается через платежный сервис WayForPay. В платежных документах, квитанциях или банковской выписке получатель может отображаться как ФЛП Белашова М.И.",
          "Название VitalRise используется как название сервиса, интерфейса и материалов. Если перед оплатой прямо не указан другой поставщик, договор о платном доступе заключается между пользователем и ФЛП Белашова М.И.",
          "VitalRise является образовательно-аналитическим сервисом для питания, тренировок, спортпита, лабораторного контроля, прогресса и влога о медицинских и фармакологических темах. Сервис не является медицинским учреждением, не ставит диагнозы и не назначает лечение.",
          "Пользователь отвечает за точность введенных данных, решения о питании, тренировках, добавках и анализах, обращение к врачу и соблюдение законодательства своей страны. Любые симптомы, отклонения в анализах, проблемы с давлением, сердцем, гормонами, печенью, почками или психикой требуют консультации специалиста.",
          "Часть функций может быть доступна только после оплаты: расширенный план, персональные корректировки, PDF/Blueprint, углубленные материалы или другие модули. Доступ нельзя передавать третьим лицам, перепродавать или использовать для массового копирования материалов. Если в описании тарифа не указано иное, после подтверждения оплаты пользователь имеет 45 календарных дней, чтобы начать программу. После первого запуска расчета программы активируются 30 календарных дней активного доступа.",
          "Условия оплаты, продолжительность доступа, состав тарифа, цена, порядок предоставления доступа и возможность возврата средств должны быть показаны пользователю до покупки. Оплата осуществляется через WayForPay; VitalRise и ФЛП Белашова М.И. не хранят полные данные банковской карты пользователя. Если на сайте будет опубликована отдельная политика возврата, она является частью этих условий.",
          "Платные тарифы могут оформляться как подписка с автоматическим продлением. Автопродление может быть включено по умолчанию в форме оплаты, но пользователь может снять соответствующую отметку перед оплатой и купить тариф без подписки. Если автопродление оставлено включенным, после завершения активной 30-дневной программы с карты пользователя автоматически списывается стоимость выбранного тарифа за следующий период, если пользователь не отменил подписку до даты следующего списания.",
          "Возврат средств возможен до активации 30-дневной программы, при ошибочной дубль-оплате или если после успешной оплаты доступ не открылся и техническую проблему не удалось решить. После активации программы и доступа к цифровым материалам возврат средств не применяется, кроме случаев, прямо предусмотренных законодательством или отдельно согласованных с ФЛП Белашова М.И. Отмена подписки прекращает будущие списания, но не отменяет уже предоставленный текущий период доступа.",
          "Чтобы инициировать возврат средств или отмену ошибочной транзакции, пользователь должен обратиться на info@vitalrise.com.ua или по телефону +38 (093) 581-06-28 и указать email доступа, тариф, дату и сумму оплаты, а также причину обращения. Если возврат применим, он проводится после проверки статуса доступа и транзакции, обычно тем же платежным способом через WayForPay.",
          "Тексты, структура страниц, калькуляторы, алгоритмы подбора, учебные материалы, база упражнений, каталоги добавок и препаратов, таблицы, PDF/Blueprint, дизайн, интерфейс, код, название VitalRise, логотип и визуальные элементы сервиса принадлежат VitalRise или используются на законных основаниях.",
          "Пользователь получает право использовать материалы сервиса только в личных информационных, образовательных и тренировочных целях. Персональные отчеты, планы, протоколы, PDF или Blueprint можно сохранять для собственного использования, но нельзя продавать, публиковать как собственный продукт, передавать в массовый доступ или использовать для создания конкурирующего сервиса.",
          "Запрещено без письменного разрешения копировать, парсить, автоматически собирать, воспроизводить, переводить для коммерческого использования, адаптировать, перепродавать или публично распространять значительные части контента VitalRise. Запрещено создавать клон сервиса, копировать логику калькуляторов, структуру протоколов, базу знаний, каталоги, дизайн или платные материалы.",
          "Названия сторонних препаратов, добавок, брендов, торговых марок, источников и изображений могут принадлежать их соответствующим владельцам. Их упоминание в VitalRise носит справочный или образовательный характер и не означает партнерства, одобрения или передачи прав. Сторонние материалы используются со ссылкой на источник, на законных основаниях либо при необходимости должны быть заменены собственными или лицензированными материалами.",
          "VitalRise не гарантирует конкретную потерю веса, набор мышечной массы, изменение анализов, спортивный результат или медицинский эффект. Результат зависит от здоровья, режима, питания, тренировок, сна, стресса, генетики, дисциплины и медицинского контекста.",
          "Запрещено использовать сайт для самолечения, опасных фармакологических экспериментов, обхода врача, нарушения антидопинговых правил, распространения доступа, взлома, автоматического сбора материалов или ввода чужих персональных данных без согласия.",
          "VitalRise может обновлять условия при изменении тарифов, доступа, функций, платежной системы, законодательных требований или формата сервиса. Актуальная версия публикуется на этой странице."
        ]
      }
    },
    disclaimer: {
      uk: {
        title: "VitalRise — Медичний та АС/ААС дисклеймер",
        description: "Медичний та АС/ААС дисклеймер VitalRise: освітній характер матеріалів, обмеження відповідальності, ризики фармакології та необхідність консультації лікаря.",
        heroTitle: "Медичний та АС/ААС дисклеймер",
        heroLead: "Медичний та АС/ААС дисклеймер VitalRise. Останнє оновлення: 26 травня 2026."
      },
      en: {
        title: "VitalRise — Medical / AS/AAS Disclaimer",
        description: "VitalRise medical and AS/AAS disclaimer: educational purpose, limitations of liability, pharmacology risks, and the need to consult a doctor.",
        heroTitle: "Medical / AS/AAS Disclaimer",
        heroLead: "VitalRise Medical / AS/AAS Disclaimer. Last updated: May 26, 2026.",
        headings: [
          "1. Educational purpose",
          "2. Laboratory markers",
          "3. AS/AAS and pharmacology",
          "4. When to seek urgent medical help",
          "5. Supplements and sports nutrition",
          "6. Age and special conditions",
          "7. Sources for verification"
        ],
        paragraphs: [
          "All information on VitalRise is educational. It helps users better understand nutrition, training, supplements, laboratory markers, medicines, risks, and questions worth discussing with a doctor. It is not medical advice, a diagnosis, or a treatment plan.",
          "Lab results cannot be evaluated in isolation. Sleep, training, stress, infections, alcohol, medicines, supplements, nutrition, sampling time, hydration, and chronic conditions can affect them. Final interpretation should be performed by a doctor who considers symptoms, medical history, and examination.",
          "Materials about AS/AAS, hormones, anti-estrogens, thyroid medicines, stimulants, insulin, and incretin-based medicines are published to explain risks and medical context. VitalRise does not provide instructions for cycles, dosing, self-prescribing, bypassing a doctor, or illegal drug use.",
          "AS/AAS and other pharmacology may affect the cardiovascular system, blood pressure, lipids, blood clotting, liver, kidneys, mental health, fertility, the hormonal axis, skin, sleep, and the risk of addictive behavior. Athletes must also consider anti-doping restrictions and legal consequences that vary by country and federation.",
          "Chest pain, shortness of breath, fainting, very high or suddenly low blood pressure, speech problems, one-sided weakness, a severe headache, jaundice, dark urine, blood in urine, severe abdominal pain, swelling, sudden mental changes, suicidal thoughts, or an erection lasting more than four hours require immediate medical attention.",
          "Supplements do not replace nutrition, sleep, training, or treatment. Some may interact with medicines or affect blood pressure, clotting, the liver, kidneys, or sleep. Product quality, dosage, and ingredients should be checked, especially for people subject to doping control or living with chronic conditions.",
          "The materials are not intended for children. Pregnancy, breastfeeding, adolescence, diabetes, cardiovascular disease, liver, kidney, or thyroid disease, cancer, mental disorders, or eating disorders require individual medical supervision.",
          "For medical safety, verify information against official sources: medicine leaflets, medical databases, a doctor, and the anti-doping rules of your federation."
        ]
      },
      ru: {
        title: "VitalRise — Медицинский и АС/ААС дисклеймер",
        description: "Медицинский и АС/ААС дисклеймер VitalRise: образовательный характер материалов, ограничение ответственности, риски фармакологии и необходимость консультации врача.",
        heroTitle: "Медицинский и АС/ААС дисклеймер",
        heroLead: "Медицинский и АС/ААС дисклеймер VitalRise. Последнее обновление: 26 мая 2026.",
        headings: [
          "1. Образовательный характер материалов",
          "2. Лабораторные показатели",
          "3. АС/ААС и фармакология",
          "4. Когда нужно немедленно обратиться к врачу",
          "5. Добавки и спортпит",
          "6. Возраст и особые состояния",
          "7. Источники для самопроверки"
        ],
        paragraphs: [
          "Вся информация на VitalRise носит образовательный характер. Она помогает лучше понимать питание, тренировки, спортпит, лабораторные маркеры, препараты, риски и вопросы, которые стоит обсудить с врачом. Это не медицинская консультация, не диагноз и не схема лечения.",
          "Анализы нельзя оценивать изолированно. На результат влияют сон, тренировки, стресс, инфекции, алкоголь, лекарства, добавки, питание, время сдачи, гидратация и хронические заболевания. Окончательную интерпретацию должен проводить врач с учетом симптомов, анамнеза и осмотра.",
          "Материалы об АС/ААС, гормонах, антиэстрогенах, препаратах щитовидной железы, стимуляторах, инсулиновых и инкретиновых препаратах публикуются для понимания рисков и медицинского контекста. VitalRise не дает инструкций по курсам, дозировкам, самоназначению, обходу врача или незаконному использованию препаратов.",
          "АС/ААС и другая фармакология могут влиять на сердечно-сосудистую систему, давление, липиды, свертывание крови, печень, почки, психику, фертильность, гормональную ось, кожу, сон и риск зависимого поведения. Для спортсменов также существуют антидопинговые ограничения и юридические последствия в зависимости от страны и федерации.",
          "Боль в груди, одышка, обморок, очень высокое или резко низкое давление, нарушение речи, слабость одной стороны тела, сильная головная боль, желтуха, темная моча, кровь в моче, сильная боль в животе, отеки, резкие изменения психики, суицидальные мысли или эрекция более четырех часов требуют немедленной медицинской помощи.",
          "Добавки не заменяют рацион, сон, тренировки и лечение. Некоторые добавки могут взаимодействовать с лекарствами, влиять на давление, свертывание крови, печень, почки или сон. Качество, дозировку и состав продуктов следует проверять, особенно если человек проходит допинг-контроль или имеет хронические заболевания.",
          "Материалы не предназначены для детей. Беременность, грудное вскармливание, подростковый возраст, диабет, сердечно-сосудистые заболевания, болезни печени, почек, щитовидной железы, онкология, психические расстройства или расстройства пищевого поведения требуют индивидуального медицинского сопровождения.",
          "Для медицинской безопасности следует сверять информацию с официальными источниками: инструкциями к препаратам, медицинскими базами, врачом и антидопинговыми правилами своей федерации."
        ]
      }
    }
  };

  const page = pages[pageName];
  if (!page) return;

  const article = document.querySelector(".legal-document");
  const headings = article ? Array.from(article.querySelectorAll("h2")) : [];
  const paragraphs = article ? Array.from(article.querySelectorAll(":scope > p")) : [];
  const originalHeadings = headings.map(function (node) { return node.textContent.trim(); });
  const originalParagraphs = paragraphs.map(function (node) { return node.textContent.replace(/\s+/g, " ").trim(); });

  function getLanguage() {
    if (window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function") {
      return window.VitalRiseI18n.getLanguage();
    }
    return document.documentElement.lang || "uk";
  }

  function setText(nodes, values) {
    nodes.forEach(function (node, index) {
      if (values[index]) node.textContent = values[index];
    });
  }

  function applyLegalTranslations() {
    const language = ["uk", "en", "ru"].includes(getLanguage()) ? getLanguage() : "uk";
    const content = page[language];
    if (!content) return;

    document.documentElement.lang = language;
    document.title = content.title;

    const description = document.querySelector('meta[name="description"]');
    const heroLabel = document.querySelector(".legal-hero .section-label");
    const heroTitle = document.querySelector(".legal-hero .vlog-library-title");
    const heroLead = document.querySelector(".legal-hero .vlog-library-lead");
    const footerItems = Array.from(document.querySelectorAll(".legal-footer > *"));
    const brand = document.querySelector(".brand-mark");
    const menuButton = document.querySelector("[data-mobile-menu-toggle]");
    const navigation = document.querySelector(".site-nav");
    const languageSwitcher = document.querySelector(".language-switcher");

    if (description) description.setAttribute("content", content.description);
    if (heroLabel) heroLabel.textContent = language === "uk" ? "Юридична інформація" : language === "ru" ? "Правовая информация" : "Legal";
    if (heroTitle) heroTitle.textContent = content.heroTitle;
    if (heroLead) heroLead.textContent = content.heroLead;
    if (brand) brand.setAttribute("aria-label", language === "uk" ? "VitalRise головна" : language === "ru" ? "Главная VitalRise" : "VitalRise home");
    if (menuButton) menuButton.setAttribute("aria-label", language === "uk" ? "Меню" : language === "ru" ? "Меню" : "Menu");
    if (navigation) navigation.setAttribute("aria-label", language === "uk" ? "Головна навігація" : language === "ru" ? "Основная навигация" : "Main navigation");
    if (languageSwitcher) languageSwitcher.setAttribute("aria-label", language === "uk" ? "Мова сайту" : language === "ru" ? "Язык сайта" : "Site language");

    setText(headings, content.headings || originalHeadings);
    setText(paragraphs, content.paragraphs || originalParagraphs);

    if (footerItems[0]) {
      footerItems[0].textContent = language === "uk"
        ? "© 2026 VitalRise. Усі права захищені."
        : language === "ru"
          ? "© 2026 VitalRise. Все права защищены."
          : "© 2026 VitalRise. All rights reserved.";
    }
    if (footerItems[1]) footerItems[1].textContent = language === "uk" ? "Політика конфіденційності" : language === "ru" ? "Политика конфиденциальности" : "Privacy Policy";
    if (footerItems[2]) footerItems[2].textContent = language === "uk" ? "Умови використання" : language === "ru" ? "Условия использования" : "Terms of Use";
    if (footerItems[3]) footerItems[3].textContent = language === "uk" ? "Медичний / АС/ААС дисклеймер" : language === "ru" ? "Медицинский / АС/ААС дисклеймер" : "Medical / AS/AAS Disclaimer";
  }

  function init() {
    applyLegalTranslations();

    document.addEventListener("click", function (event) {
      if (!event.target.closest("[data-lang-switch]")) return;
      window.setTimeout(applyLegalTranslations, 0);
      window.setTimeout(applyLegalTranslations, 120);
    });

    const observer = new MutationObserver(function (mutations) {
      const languageChanged = mutations.some(function (mutation) {
        return mutation.type === "attributes" && mutation.attributeName === "data-language";
      });
      if (languageChanged) applyLegalTranslations();
    });
    observer.observe(document.body, { attributes: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
