(function () {
  const system = window.VitalRiseSystem || {};
  const $ = system.$ || function (id) { return document.getElementById(id); };

  let supplementResult = null;
  function createSupplementItem(name, category, fit, dose, control, rating) {
    return {
      name: name,
      category: category,
      fit: fit,
      dose: dose,
      control: control,
      rating: rating || "середній"
    };
  }

  function getCreatineDoseByLevel(level) {
    if (level === "advanced") {
      return "10 г щодня, краще 5 г + 5 г, без завантаження";
    }

    if (level === "intermediate") {
      return "5-10 г щодня, без завантаження";
    }

    return "5 г щодня, без завантаження";
  }

  function supplementStackHas(stack, name) {
    return stack.some(function (item) {
      return item.name === name;
    });
  }

  function buildSupplementProtocol(data) {
    const goal = data["supplement-goal"] || "strength";
    const level = data["supplement-level"] || "intermediate";
    const proteinCoverage = data["protein-coverage"] || "low";
    const fishIntake = data["fish-intake"] || "rare";
    const vitaminDStatus = data["vitamin-d-status"] || "unknown";
    const sleepQuality = data["sleep-quality"] || "poor";
    const brainFocus = data["brain-focus"] || "none";
    const stimulantTolerance = data["stimulant-tolerance"] || "normal";
    const hormoneSupport = data["male-hormone-support"] || "none";
    const isExpanded = level === "intermediate" || level === "advanced";
    const isAdvanced = level === "advanced";
    const needsMaleHormoneSupport = hormoneSupport !== "none";
    const stack = [];
    const caution = [];

    if (proteinCoverage !== "high") {
      stack.push(createSupplementItem("Протеїн: яловичий / казеїн / гідролізат", "Білок", "яловичий - без молочки; казеїн - довге насичення; гідролізат - найшвидше і найлегше, але дорожче", "20-40 г за потреби", "добовий білок, ШКТ, алергії, переносимість молочного", "високий"));
    }

    if (goal === "strength" || goal === "mass") {
      stack.push(createSupplementItem("Креатин моногідрат", "Сила", "повторювана потужність, силові підходи, об'єм", getCreatineDoseByLevel(level), "вода, вага, ШКТ, ниркові маркери за потреби", "високий"));
    }

    if (isAdvanced && (goal === "strength" || goal === "mass")) {
      stack.push(createSupplementItem("Екдистерон", "Експериментально", "можливий вплив на м'язову масу і силові показники, але людська доказовість неоднорідна; це не стероїд і не база рівня креатину", "не як база; спочатку якість продукту, антидопінг і медичні ризики", "сертифікат/склад, WADA monitoring, ШКТ, печінкові маркери, ліки", "обережний"));
    }

    if (goal === "strength" && stimulantTolerance === "normal" && isExpanded) {
      stack.push(createSupplementItem("Кофеїн", "Перед тренуванням", "фокус і продуктивність у важкі дні", "низька доза, не пізно ввечері", "тиск, пульс, сон, тривожність", "високий"));
    }

    if ((goal === "strength" || goal === "fatloss") && stimulantTolerance !== "normal" && isExpanded) {
      stack.push(createSupplementItem("Цитрулін / нітрати", "Перед тренуванням", "памп і робота без сильних стимуляторів", "за переносимістю", "тиск, шлунок, головний біль", "середній"));
    }

    if ((goal === "strength" || goal === "fatloss") && isExpanded) {
      stack.push(createSupplementItem("Бета-аланін", "Витривалість", "для інтервалів і сетів з високою щільністю", "курс 4+ тижні", "поколювання, переносимість", "середній"));
    }

    if (fishIntake !== "often") {
      stack.push(createSupplementItem("Омега-3", "Раціон", fishIntake === "rare" ? "коли жирної риби майже немає" : "як опція при нерегулярній рибі", "з їжею", "раціон, ліпідограма, ліки що впливають на згортання", "середній"));
    }

    if (vitaminDStatus === "low") {
      stack.push(createSupplementItem("Вітамін D3", "Дефіцит", "корекція тільки після низького 25(OH)D", "доза за аналізом", "25(OH)D, кальцій, рекомендація лікаря", "високий при дефіциті"));
    } else if (vitaminDStatus === "unknown") {
      caution.push("Вітамін D краще не підбирати навмання: спочатку 25(OH)D або консультація лікаря.");
    }

    if (sleepQuality !== "good") {
      stack.push(createSupplementItem("Магній гліцинат / хелат", "Сон", "м'якший для ШКТ, краще під сон, стрес і нервову систему", "увечері, за переносимістю", "сон, сонливість, ШКТ, нирки, ліки", "середній"));
    }

    if (isExpanded) {
      stack.push(createSupplementItem("Магній цитрат", "Травлення", "краще коли потрібен акцент на кишківник/закрепи; у жовчному контексті - тільки як підтримка травлення, не лікування", "з їжею або ввечері, обережно з дозою", "послаблення стулу, ШКТ, жовчні симптоми, ліки", "ситуативний"));
    }

    if (brainFocus !== "none" && isExpanded) {
      stack.push(createSupplementItem("Магній L-треонат / малат", "Мозок+енергія", "треонат - під фокус/мозок; малат - під втому і м'язову енергію", "за переносимістю, не змішувати всі форми одразу", "сон, тривожність, ШКТ, нирки", "обережний"));
    }

    if (brainFocus !== "none") {
      stack.push(createSupplementItem("B12 / B-комплекс", "Мозок", "не стимулятор; доречно при ризику дефіциту, втомі або малому споживанні тваринних продуктів", "краще після B12, фолату, гомоцистеїну", "B12, фолат, метформін/ІПП, раціон", "при дефіциті"));

      if (!supplementStackHas(stack, "Креатин моногідрат")) {
        stack.push(createSupplementItem("Креатин моногідрат", "Мозок+енергія", "може бути корисним при високому ментальному навантаженні, недосипі або малому м'ясі/рибі", getCreatineDoseByLevel(level), "вода, вага, ШКТ, ниркові маркери за потреби", "середній"));
      }
    }

    if (brainFocus !== "none" && isExpanded && stimulantTolerance === "normal") {
      stack.push(createSupplementItem("Кофеїн + L-теанін", "Фокус", "концентрація без надмірної різкості стимулятора", "точково в робочі дні, не ввечері", "сон, тиск, пульс, тривожність", "високий/середній"));
    }

    if ((brainFocus === "focus" || brainFocus === "fatigue") && isExpanded) {
      stack.push(createSupplementItem("L-тирозин", "Стрес-фокус", "короткостроково при недосипі, стресі або важкій розумовій роботі", "точково, не як щоденна база", "тиск, щитоподібна, стимулятори, ліки", "ситуативний"));
    }

    if (brainFocus === "memory" && isExpanded) {
      stack.push(createSupplementItem("Бакопа", "Пам'ять", "пам'ять/навчання; ефект не гострий, а після курсу", "курс 8-12 тижнів з їжею", "ШКТ, сонливість, щитоподібна, ліки", "обережний"));
    }

    if ((brainFocus === "stress" || brainFocus === "fatigue") && isExpanded) {
      stack.push(createSupplementItem("Родіола", "Втома/стрес", "можлива опція при ментальній втомі, але доказовість обмежена", "короткий курс, не пізно ввечері", "сон, тривожність, біполярність, антидепресанти", "обережний"));
    }

    if (isExpanded) {
      stack.push(createSupplementItem("Поліфеноли / антиоксиданти з їжі", "Антиоксиданти", "ягоди, какао, зелень, спеції, кольорові овочі", "щодня з раціону", "не замінювати овочі мегадозами C/E", "помірний"));

      if (goal === "health" || goal === "fatloss") {
        stack.push(createSupplementItem("CoQ10 / NAC", "Антиоксиданти+", "опція при високому стресі або медичному контексті", "не як база для всіх", "ліки, печінка, самопочуття", "обережний"));
      }

      stack.push(createSupplementItem("Ферменти / лактаза", "Травлення", "коли важко переноситься білок, молочні або великі прийоми їжі", "точково з проблемною їжею", "симптоми ШКТ, переносимість продуктів", "ситуативний"));
    }

    if (isExpanded && (goal === "strength" || goal === "mass" || sleepQuality !== "good" || needsMaleHormoneSupport)) {
      stack.push(createSupplementItem("Ашваганда", "Гормональна підтримка", "стрес, сон і відновлення; найдоречніша, коли тестостерон просідає на фоні напруги", "короткий курс", "сонливість, ШКТ, печінка, щитоподібна, ліки", "середній"));
    }

    if (needsMaleHormoneSupport) {
      stack.push(createSupplementItem("Цинк", "Підтримка тестостерону", "працює як корекція дефіциту, а не як універсальний бустер", "короткий курс або за раціоном/аналізами", "цинк, мідь при довгому прийомі, ШКТ, ліки", "високий при дефіциті"));

      if (!supplementStackHas(stack, "Магній гліцинат / хелат")) {
        stack.push(createSupplementItem("Магній гліцинат / хелат", "Сон і стрес", "підтримує відновлення, нервову систему і якість сну", "увечері, за переносимістю", "сон, сонливість, ШКТ, нирки, ліки", "середній"));
      }

      if (isExpanded) {
        stack.push(createSupplementItem("Тонгкат Алі", "Чоловіча підтримка", "опція при стресі, втомі або низько-нормальних ранкових аналізах", "короткий курс, не поєднувати з багатьма новими добавками одразу", "сон, тривожність, тиск, печінкові маркери, гормональні симптоми", "обережний"));
      } else {
        caution.push("Тонгкат Алі краще додавати не на старті, а після стабільного сну, харчування, тренувань і базових аналізів.");
      }

      if (isAdvanced && hormoneSupport === "low-labs") {
        stack.push(createSupplementItem("Очищений шиладжит", "Опція після аналізів", "можливий тільки як обережний експеримент з якісним брендом і перевіркою на домішки", "короткий курс", "сертифікат якості, важкі метали, печінка, самопочуття", "обережний"));
      }
    }

    if (goal === "fatloss") {
      caution.push("На жироспаленні добавки не мають замінювати дефіцит калорій, кроки, сон і силові тренування.");
    }

    if (goal === "strength" || goal === "mass") {
      caution.push("Креатин у цьому протоколі без фази завантаження: щоденний прийом стабільніший і простіший для контролю ШКТ.");
    }

    if (isAdvanced && (goal === "strength" || goal === "mass")) {
      caution.push("Екдистерон не є базовою добавкою: доказовість суперечлива, а WADA тримає ecdysterone у Monitoring Program для відстеження можливого зловживання у спорті.");
      caution.push("Для екдистерону критична якість продукту: заявлена кількість, домішки і антидопінгові ризики можуть відрізнятися між брендами.");
    }

    if (sleepQuality !== "good" || isExpanded) {
      caution.push("Магній обираємо за задачею, а не всі форми разом: гліцинат/хелат - сон і нервова система, цитрат - травлення/закрепи, треонат/малат - мозок або втома.");
    }

    if (needsMaleHormoneSupport) {
      caution.push("Підтримка тестостерону не працює окремо від сну, достатньої калорійності, жирів у раціоні, силових тренувань і контролю дефіцитів.");
      caution.push("Якщо є симптоми низького тестостерону або низькі ранкові аналізи, потрібне повторне ранкове вимірювання і лікар, а не випадковий набір добавок.");
    }

    if (brainFocus !== "none") {
      caution.push("Ноотропи не замінюють сон, дефіцити, харчування і режим. Не змішуй багато стимуляторів в один день.");
      caution.push("Уникай закритих proprietary blends: має бути зрозуміло, скільки кожної речовини в порції.");
    }

    if (!isExpanded) {
      caution.push("Початковий рівень: тільки база за реальною потребою. Розширені добавки краще додавати після стабільного харчування, сну і тренувань.");
    } else {
      caution.push("Великі дози антиоксидантів C/E навколо тренувань не робимо базою: вони можуть заважати частині тренувальних адаптацій.");
      caution.push("Гормональна підтримка не лікує низький тестостерон. Якщо є симптоми, потрібні ранкові аналізи і лікар, а не випадковий стек.");
    }

    return {
      goal: goal,
      level: level,
      stack: stack,
      caution: caution
    };
  }

  function getSupplementGoalTitle(goal) {
    const titles = {
      strength: "Сила / продуктивність",
      mass: "Набір м'язів",
      fatloss: "Жироспалення",
      health: "Здоров'я / відновлення"
    };

    return titles[goal] || "Персональний стек";
  }

  function getSupplementLevelTitle(level) {
    const titles = {
      beginner: "стисла база",
      intermediate: "розширений стек",
      advanced: "просунутий стек"
    };

    return titles[level] || "стек";
  }

  function renderSupplementProtocol(protocol) {
    const stackMarkup = protocol.stack
      .map(function (item) {
        return (
          '<article class="supplement-stack-card">' +
            '<div class="supplement-stack-top">' +
              '<span>' + item.category + '</span>' +
              '<strong>' + item.rating + '</strong>' +
            '</div>' +
            '<h4>' + item.name + '</h4>' +
            '<p>' + item.fit + '</p>' +
            '<div class="supplement-stack-row"><span>Як</span><b>' + item.dose + '</b></div>' +
            '<div class="supplement-stack-row"><span>Контроль</span><b>' + item.control + '</b></div>' +
          '</article>'
        );
      })
      .join("");

    const cautionMarkup = protocol.caution.length
      ? '<div class="supplement-compact-cautions">' +
          protocol.caution.map(function (item) {
            return '<div class="tip-item">' + item + '</div>';
          }).join("") +
        '</div>'
      : "";

    supplementResult.innerHTML =
      '<div class="supplement-result-head">' +
        '<span>' + getSupplementLevelTitle(protocol.level) + '</span>' +
        '<h3 class="result-title">' + getSupplementGoalTitle(protocol.goal) + '</h3>' +
      '</div>' +
      '<div class="supplement-stack-grid">' + stackMarkup + '</div>' +
      cautionMarkup +
      '<p class="result-note">Це спортивна навігація, не медичне призначення. При хронічних станах, ліках, відхиленнях аналізів, вагітності або гормональних симптомах рішення треба узгоджувати з лікарем.</p>';
  }


  function initSupplements() {
    const supplementForm = $("supplement-form");
    const supplementReset = $("supplement-reset");
    supplementResult = $("supplement-result");

    if (supplementForm && supplementResult) {
      supplementForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(supplementForm);
        const data = Object.fromEntries(formData.entries());
        const protocol = buildSupplementProtocol(data);

        renderSupplementProtocol(protocol);
      });
    }

    if (supplementReset && supplementForm && supplementResult) {
      supplementReset.addEventListener("click", function () {
        supplementForm.reset();
        supplementResult.innerHTML =
          '<div class="result-placeholder">Обери параметри, щоб отримати базовий протокол спортпіту.</div>';
      });
    }
  }

  system.supplements = {
    buildSupplementProtocol: buildSupplementProtocol,
    renderSupplementProtocol: renderSupplementProtocol,
    getSupplementGoalTitle: getSupplementGoalTitle,
    getSupplementLevelTitle: getSupplementLevelTitle
  };
  system.initSupplements = initSupplements;
  window.VitalRiseSystem = system;

  document.addEventListener("DOMContentLoaded", initSupplements);
})();
