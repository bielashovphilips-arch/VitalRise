(function () {
  const system = window.VitalRiseSystem || {};

  const exerciseAtlas = [
    {
      name: "Підтягування",
      place: "Вулиця / зал",
      level: "середній+",
      muscles: { main: ["lats"], secondary: ["biceps", "rearDelts"], other: ["core"] },
      cues: ["Лопатки вниз", "Груди до перекладини", "Без розгойдування"],
      swaps: ["Тяга верхнього блоку", "Австралійські підтягування", "Резина"]
    },
    {
      name: "Бруси",
      place: "Вулиця / зал",
      level: "середній+",
      muscles: { main: ["chest", "triceps"], secondary: ["frontDelts"], other: ["core"] },
      cues: ["Плече стабільне", "Контроль глибини", "Не падати вниз"],
      swaps: ["Жим вузьким хватом", "Віджимання на опорах", "Резина"]
    },
    {
      name: "Віджимання",
      place: "Дім / вулиця",
      level: "усі",
      muscles: { main: ["chest"], secondary: ["triceps", "frontDelts"], other: ["core"] },
      cues: ["Корпус однією лінією", "Лікті під контролем", "Після 20 повторів ускладнюй"],
      swaps: ["Ноги на підвищенні", "Рюкзак", "Псевдо-планш"]
    },
    {
      name: "Жим лежачи",
      place: "Зал",
      level: "усі",
      muscles: { main: ["chest"], secondary: ["triceps", "frontDelts"], other: ["lats"] },
      cues: ["Лопатки зведені", "Стопи стабільні", "Гриф під контролем"],
      swaps: ["Жим гантелей", "Хамер", "Віджимання з вагою"]
    },
    {
      name: "Тяга блоку / горизонтальна тяга",
      place: "Зал / дім",
      level: "усі",
      muscles: { main: ["lats", "midBack"], secondary: ["biceps", "rearDelts"], other: ["core"] },
      cues: ["Тягни ліктем", "Не задирай плечі", "Пауза біля корпусу"],
      swaps: ["Тяга рюкзака", "Тяга резини", "Тяга під столом"]
    },
    {
      name: "Болгарські присідання",
      place: "Дім / вулиця / зал",
      level: "середній+",
      muscles: { main: ["quads", "glutes"], secondary: ["hamstrings"], other: ["core"] },
      cues: ["Коліно стабільне", "Корпус під контролем", "Повна амплітуда без болю"],
      swaps: ["Випади назад", "Жим ногами", "Пістолет до опори"]
    },
    {
      name: "Румунська тяга",
      place: "Дім / зал",
      level: "усі",
      muscles: { main: ["hamstrings", "glutes"], secondary: ["lowerBack"], other: ["lats"] },
      cues: ["Таз назад", "Спина нейтральна", "Вага близько до тіла"],
      swaps: ["Гіперекстензія", "Тяга на одній нозі", "Хіп-траст"]
    },
    {
      name: "Присідання",
      place: "Зал / дім",
      level: "усі",
      muscles: { main: ["quads", "glutes"], secondary: ["hamstrings"], other: ["core", "lowerBack"] },
      cues: ["Стопа повністю на підлозі", "Коліна за носками по лінії стопи", "Глибина без втрати спини"],
      swaps: ["Гоблет-присід", "Жим ногами", "Болгарські"]
    },
    {
      name: "Станова тяга",
      place: "Зал",
      level: "середній+",
      muscles: { main: ["glutes", "hamstrings", "lowerBack"], secondary: ["lats", "traps"], other: ["core"] },
      cues: ["Гриф близько", "Напруга спини до старту", "Не смикати з підлоги"],
      swaps: ["Румунська тяга", "Тяга з блоків", "Гіперекстензія"]
    },
    {
      name: "Pike-віджимання",
      place: "Дім",
      level: "середній+",
      muscles: { main: ["frontDelts"], secondary: ["triceps", "upperChest"], other: ["core"] },
      cues: ["Голова між руками", "Таз високо", "Контроль ліктів"],
      swaps: ["Жим рюкзака", "Стійка біля стіни", "Жим гантелей"]
    },
    {
      name: "Розгинання на трицепс від низької перекладини",
      place: "Вулиця",
      level: "середній+",
      muscles: { main: ["triceps"], secondary: ["frontDelts"], other: ["core"] },
      cues: ["Тіло жорстке", "Рух у лікті", "Не провалюй поперек"],
      swaps: ["Французький жим", "Резина на трицепс", "Вузькі віджимання"]
    },
    {
      name: "Підйом ніг / прес у висі",
      place: "Вулиця / зал",
      level: "середній+",
      muscles: { main: ["abs"], secondary: ["hipFlexors"], other: ["lats", "forearms"] },
      cues: ["Без розгойдування", "Таз підкручується", "Лопатки активні"],
      swaps: ["Підйом колін", "Hollow body", "Скручування"]
    }
  ];

  const exerciseAtlasImages = {
    "підтягування": "assets/images/exercises/894939dffe27a418233bb0a3c05b1d46.jpg",
    "бруси": "assets/images/exercises/otzhymanyia-na-brusiakh.gif",
    "Віджимання на брусах": "assets/images/exercises/otzhymanyia-na-brusiakh.gif",
    "віджимання": "assets/images/exercises/OIP (1).webp",
    "жим лежачи": "assets/images/exercises/OIP (2).webp",
    "тяга блоку / горизонтальна тяга": "assets/images/exercises/OIP (3).webp",
    "болгарські присідання": "assets/images/exercises/bulgarian-split-squat.webp",
    "Болгарські спліт-присідання": "assets/images/exercises/bulgarian-split-squat.webp",
    "Випади або болгарські спліт-присідання": "assets/images/exercises/bulgarian-split-squat.webp",
    "румунська тяга": "assets/images/exercises/R.jpg",
    "присідання": "assets/images/exercises/OIP (5).webp",
    "станова тяга": "assets/images/exercises/Best-Hamstring-Exercises-Deadlifts.jpg",
    "pike-віджимання": "assets/images/exercises/OIP (6).webp",
    "розгинання на трицепс від низької перекладини": "assets/images/exercises/bodyweight_triceps_extension_480x480.webp",
    "підйом ніг / прес у висі": "assets/images/exercises/hanging-leg-raise.webp",
    "Тяга верхнього блоку": "assets/images/exercises/R (1).jpg",
    "Тяга верхнього блоку вузьким хватом": "assets/images/exercises/OIP (7).webp",
    "Тяга горизонтального блоку": "assets/images/exercises/OIP (9).webp",
    "Тяга нижнього блоку": "assets/images/exercises/OIP (8).webp",
    "Тяга Т-грифа": "assets/images/exercises/t-bar-row-to-waist.webp",
    "Тяга штанги / Т-грифа до пояса": "assets/images/exercises/t-bar-row-to-waist.webp",
    "Тяга до поясу": "assets/images/exercises/OIP (11).webp",
    "Тяга резини до поясу": "assets/images/exercises/R (2).jpg",
    "Тяга рюкзака / гантелі в нахилі": "assets/images/exercises/a677f6f824a40f9cef4bd671ca778bd3.jpg",
    "Жим гантелей лежачи": "assets/images/exercises/zhim-lezha-s-gantelyami.jpg",
    "Жим гантелей під кутом": "assets/images/exercises/6621f2c93553989ac8a902d221efb6c5.jpg",
    "Жим лежачи вузьким хватом": "assets/images/exercises/zhim-shtangi-lezha-uzkim-hvatom.jpg",
    "Жим в хамері під кутом": "assets/images/exercises/OIP (12).webp",
    "Жим сидячи в тренажері": "assets/images/exercises/zhim-sidya-v-trenazhere.jpg",
    "Жим ногами": "assets/images/exercises/OIP (13).webp",
    "Жим резини над головою": "assets/images/exercises/sportsman-with-elastic-band-holding-arms-raised_128034-174.avif",
    "Плечовий жим гантелей": "assets/images/exercises/seated-dumbbell-press-form.jpg",
    "Жим штанги або гантелей сидячи": "assets/images/exercises/seated-dumbbell-press-form.jpg",
    "Махи через сторони": "assets/images/exercises/Dumbbell-Lateral-Raise-1.webp",
    "Махи гантелями в сторони": "assets/images/exercises/Dumbbell-Lateral-Raise-1-1.webp",
    "Підйоми через сторони": "assets/images/exercises/Dumbbell-Lateral-Raise-1-1.webp",
    "Тяга до підборіддя": "assets/images/exercises/OIP (14).webp",
    "Біцепс стоячи з гантелями": "assets/images/exercises/pidyom_ganteli_na_biceps_stoyachy_nakachka_org_ua.jpg",
    "Згинання рук з EZ-штангою": "assets/images/exercises/2741.png",
    "Згинання рук з резиною": "assets/images/exercises/28dcd9.jpg",
    "Підйом на біцепс молот": "assets/images/exercises/biczeps-3.jpg",
    "Підйом на біцепс рюкзаком / резиною": "assets/images/exercises/28dcd9.jpg",
    "Розгинання в кросовері на трицепс": "assets/images/exercises/image.png",
    "Розгинання рук на блоці": "assets/images/exercises/image.png",
    "Розгинання рук з резиною": "assets/images/exercises/5583aab687de03ef3ae38d7632af02ec.webp",
    "Французьке розгинання резиною / рюкзаком": "assets/images/exercises/Resistance-Band-Tricep-Extensions.jpg",
    "Розгинання ніг": "assets/images/exercises/1977aec3424113ef355b1b3bca2655bc.jpg",
    "Згинання ніг": "assets/images/exercises/leg-curls-im-liegen-768x432.jpg",
    "Гіперекстензія": "assets/images/exercises/OIP (15).webp",
    "Випади": "assets/images/exercises/lunges-1653161919671.jpg",
    "Випади назад з рюкзаком": "assets/images/exercises/fee7981ae2602192d4fb7d5e904e93b8.jpg",
    "Присідання з власною вагою / гоблет-присід": "assets/images/exercises/OIP (20)-1.webp",
    "Присідання з власною вагою": "assets/images/exercises/OIP (20)-1.webp",
    "Присідання з власною вагою або рюкзаком": "assets/images/exercises/OIP (20)-1.webp",
    "Присідання / присідання з рюкзаком": "assets/images/exercises/OIP (20)-1.webp",
    "Присідання з паузою": "assets/images/exercises/afc05a3cbe1fcbdfb8e9198e4f6d4724.webp",
    "Пістолетик до опори / болгарські присідання": "assets/images/exercises/d7e16158b28892bfff0ebb81ca59e1f8.jpg",
    "Сідничний міст / hip thrust на одній нозі": "assets/images/exercises/single-leg-hip-thrust-muscles.gif",
    "Сідничний міст / хіп-траст від лавки": "assets/images/exercises/2edbed_9e7c0c36f88d4189b50599214256e8de~mv2.gif",
    "Підйоми на носки однією ногою": "assets/images/exercises/standing-single-leg-calf-raise-balance.jpg",
    "Планка": "assets/images/exercises/spider-plank-male-video-exercise-guide-tips-1024x576.webp",
    "Бокова планка": "assets/images/exercises/OIP (16).webp",
    "Планка з вагою / бічна планка": "assets/images/exercises/OIP (17).webp",
    "Скручування": "assets/images/exercises/1.jpg",
    "Підйом колін": "assets/images/exercises/OIP (18).webp",
    "Підйом колін у висі": "assets/images/exercises/Підйоми-ніг-у-висі-Основні-задіяні-мязи-1.gif",
    "Підйом прямих ніг у висі": "assets/images/exercises/3604.png",
    "Прес: підйом ніг лежачи / hollow body": "assets/images/exercises/pidjom-nih-lezhachy.webp",
    "Зведення рук у тренажері / кросовері": "assets/images/exercises/13f33-16909862664255-1920.avif",
    "Зведення рук в кросовері": "assets/images/exercises/13f33-16909862664255-1920.avif",
    "Розведення в тренажері / кросовері": "assets/images/exercises/13f33-16909862664255-1920.avif",
    "Тяга к обличчу з резиною / задня дельта": "assets/images/exercises/5607 (1).webp",
    "Розведення на задню дельту резиною / нахил": "assets/images/exercises/5607 (1).webp",
    "Пуловер з гантеллю": "assets/images/exercises/625117de68fa4111e4e0eb313f06a1c6.gif",
    "Пуловер у блоці": "assets/images/exercises/cable-pullover-back.jpg",
    "Пуловер у тренажері або блоці": "assets/images/exercises/cable-pullover-back.jpg"
  };

  const missingExercisePhotoBacklog = [];

  system.exerciseAtlasData = {
    exerciseAtlas: exerciseAtlas,
    exerciseAtlasImages: exerciseAtlasImages,
    missingExercisePhotoBacklog: missingExercisePhotoBacklog
  };

  window.VitalRiseSystem = system;
})();
