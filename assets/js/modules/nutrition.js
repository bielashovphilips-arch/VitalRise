(function () {
  const system = window.VitalRiseSystem || {};

  const defaultSelection = {
    protein: ["eggs", "cottage_cheese", "hard_cheese", "chicken", "turkey", "white_fish", "salmon", "tuna", "greek_yogurt", "whey_protein", "skyr", "shrimp", "tofu"],
    carb: ["oatmeal", "banana", "rice", "buckwheat", "potato", "sweet_potato", "bulgur", "quinoa", "berries", "apple", "lentils", "beans"],
    extra_carb: ["whole_bread", "rice_cakes"],
    fat: ["olive_oil", "avocado", "nuts", "peanut_butter", "pumpkin_seeds", "dark_chocolate"],
    vegetable: ["spinach", "broccoli", "cucumber", "tomato", "zucchini", "bell_pepper", "asparagus"]
  };

  const foods = [
    {
      id: "eggs",
      name: "Яйця",
      category: "protein",
      unitType: "piece",
      unitLabel: "шт",
      portionStep: 1,
      min: 2,
      max: 5,
      defaultAmount: 3,
      allowedMeals: ["breakfast", "dinner"],
      macrosPerUnit: { p: 6.3, f: 5.3, c: 0.4, kcal: 72 }
    },
    {
      id: "cottage_cheese",
      name: "Сир кисломолочний 5%",
      category: "protein",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 50,
      min: 150,
      max: 300,
      defaultAmount: 200,
      allowedMeals: ["breakfast", "second_breakfast", "snack"],
      macrosPer100: { p: 17, f: 5, c: 3, kcal: 121 }
    },
    {
      id: "hard_cheese",
      name: "Твердий сир",
      category: "protein",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 10,
      min: 20,
      max: 80,
      defaultAmount: 40,
      allowedMeals: ["breakfast", "second_breakfast", "snack", "dinner"],
      macrosPer100: { p: 25, f: 28, c: 1.5, kcal: 358 }
    },
    {
      id: "chicken",
      name: "Куряче філе",
      category: "protein",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 125,
      max: 250,
      defaultAmount: 175,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 23, f: 2, c: 0, kcal: 110 }
    },
    {
      id: "turkey",
      name: "Індичка",
      category: "protein",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 125,
      max: 250,
      defaultAmount: 175,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 21, f: 4, c: 0, kcal: 125 }
    },
    {
      id: "beef",
      name: "Яловичина",
      category: "protein",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 125,
      max: 225,
      defaultAmount: 150,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 20, f: 10, c: 0, kcal: 170 }
    },
    {
      id: "tuna",
      name: "Тунець",
      category: "protein",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 125,
      max: 250,
      defaultAmount: 150,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 24, f: 1, c: 0, kcal: 109 }
    },
    {
      id: "white_fish",
      name: "Біла риба",
      category: "protein",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 150,
      max: 250,
      defaultAmount: 175,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 20, f: 2, c: 0, kcal: 98 }
    },
    {
      id: "salmon",
      name: "Лосось",
      category: "protein",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 125,
      max: 225,
      defaultAmount: 150,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 20, f: 13, c: 0, kcal: 208 }
    },

    {
      id: "oatmeal",
      name: "Вівсянка",
      category: "carb",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 10,
      min: 50,
      max: 100,
      defaultAmount: 70,
      allowedMeals: ["breakfast", "second_breakfast"],
      macrosPer100: { p: 12, f: 6, c: 60, kcal: 366 }
    },
    {
      id: "banana",
      name: "Банан",
      category: "carb",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 20,
      min: 80,
      max: 180,
      defaultAmount: 120,
      allowedMeals: ["breakfast", "second_breakfast", "snack"],
      macrosPer100: { p: 1.5, f: 0.2, c: 21, kcal: 96 }
    },
    {
      id: "rice",
      name: "Рис",
      category: "carb",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 100,
      max: 250,
      defaultAmount: 150,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 2.7, f: 0.3, c: 28, kcal: 130 }
    },
    {
      id: "buckwheat",
      name: "Гречка",
      category: "carb",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 100,
      max: 250,
      defaultAmount: 150,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 4.5, f: 1.6, c: 21, kcal: 110 }
    },
    {
      id: "potato",
      name: "Картопля",
      category: "carb",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 50,
      min: 150,
      max: 350,
      defaultAmount: 250,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 2, f: 0.4, c: 17, kcal: 77 }
    },
    {
      id: "pasta",
      name: "Макарони",
      category: "carb",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 100,
      max: 250,
      defaultAmount: 150,
      allowedMeals: ["lunch"],
      macrosPer100: { p: 5.8, f: 1.1, c: 30, kcal: 158 }
    },

    {
      id: "olive_oil",
      name: "Оливкова олія",
      category: "fat",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 5,
      min: 5,
      max: 15,
      defaultAmount: 10,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 0, f: 100, c: 0, kcal: 900 }
    },
    {
      id: "avocado",
      name: "Авокадо",
      category: "fat",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 50,
      max: 125,
      defaultAmount: 75,
      allowedMeals: ["breakfast", "lunch", "dinner"],
      macrosPer100: { p: 2, f: 15, c: 9, kcal: 160 }
    },
    {
      id: "nuts",
      name: "Горіхи",
      category: "fat",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 10,
      min: 15,
      max: 40,
      defaultAmount: 20,
      allowedMeals: ["second_breakfast", "snack"],
      macrosPer100: { p: 16, f: 50, c: 14, kcal: 600 }
    },
   {
  id: "chicken_thigh",
  name: "Куряче стегно",
  category: "protein",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 125,
  max: 300,
  defaultAmount: 175,
  allowedMeals: ["lunch", "dinner"],
  macrosPer100: { p: 18, f: 10, c: 0, kcal: 170 }
},
{
  id: "greek_yogurt",
  name: "Грецький йогурт",
  category: "protein",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 100,
  max: 300,
  defaultAmount: 200,
  allowedMeals: ["breakfast", "second_breakfast", "snack"],
  macrosPer100: { p: 8, f: 4, c: 4, kcal: 80 }
},
{
  id: "whey_protein",
  name: "Протеїн (сироватковий)",
  category: "protein",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 5,
  min: 20,
  max: 60,
  defaultAmount: 30,
  allowedMeals: ["second_breakfast", "snack"],
  macrosPer100: { p: 75, f: 5, c: 10, kcal: 380 }
},
{
  id: "sweet_potato",
  name: "Батат",
  category: "carb",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 150,
  max: 350,
  defaultAmount: 200,
  allowedMeals: ["lunch", "dinner"],
  macrosPer100: { p: 1.6, f: 0.1, c: 20, kcal: 86 }
},
{
  id: "bulgur",
  name: "Булгур",
  category: "carb",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 100,
  max: 300,
  defaultAmount: 150,
  allowedMeals: ["lunch", "dinner"],
  macrosPer100: { p: 3.1, f: 0.2, c: 18, kcal: 83 }
},
{
  id: "couscous",
  name: "Кус-кус",
  category: "carb",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 100,
  max: 300,
  defaultAmount: 150,
  allowedMeals: ["lunch"],
  macrosPer100: { p: 3.8, f: 0.2, c: 23, kcal: 112 }
},
{
  id: "whole_bread",
  name: "Цільнозерновий хліб",
  category: "extra_carb",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 10,
  min: 30,
  max: 120,
  defaultAmount: 60,
  allowedMeals: ["breakfast", "second_breakfast", "lunch", "snack", "dinner"],
  macrosPer100: { p: 8, f: 2, c: 40, kcal: 220 }
},
{
  id: "butter",
  name: "Вершкове масло",
  category: "fat",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 5,
  min: 5,
  max: 20,
  defaultAmount: 10,
  allowedMeals: ["breakfast", "lunch"],
  macrosPer100: { p: 1, f: 82, c: 1, kcal: 740 }
},
{
  id: "peanut_butter",
  name: "Арахісова паста",
  category: "fat",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 5,
  min: 10,
  max: 40,
  defaultAmount: 20,
  allowedMeals: ["breakfast", "snack"],
  macrosPer100: { p: 25, f: 50, c: 20, kcal: 590 }
},
{
  id: "seeds",
  name: "Насіння",
  category: "fat",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 5,
  min: 10,
  max: 40,
  defaultAmount: 20,
  allowedMeals: ["snack"],
  macrosPer100: { p: 20, f: 50, c: 20, kcal: 550 }
},
{
  id: "skyr",
  name: "Скір",
  category: "protein",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 150,
  max: 300,
  defaultAmount: 200,
  allowedMeals: ["breakfast", "second_breakfast", "snack"],
  macrosPer100: { p: 11, f: 0.2, c: 4, kcal: 62 }
},
{
  id: "tofu",
  name: "Тофу",
  category: "protein",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 100,
  max: 250,
  defaultAmount: 175,
  allowedMeals: ["lunch", "dinner"],
  macrosPer100: { p: 12, f: 7, c: 2, kcal: 120 }
},
{
  id: "shrimp",
  name: "Креветки",
  category: "protein",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 125,
  max: 250,
  defaultAmount: 175,
  allowedMeals: ["lunch", "dinner"],
  macrosPer100: { p: 24, f: 0.5, c: 0.2, kcal: 99 }
},
{
  id: "pork_tenderloin",
  name: "Свиняча вирізка",
  category: "protein",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 125,
  max: 250,
  defaultAmount: 175,
  allowedMeals: ["lunch", "dinner"],
  macrosPer100: { p: 21, f: 5, c: 0, kcal: 130 }
},
{
  id: "quinoa",
  name: "Кіноа",
  category: "carb",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 100,
  max: 250,
  defaultAmount: 150,
  allowedMeals: ["lunch", "dinner"],
  macrosPer100: { p: 4.4, f: 1.9, c: 21.3, kcal: 120 }
},
{
  id: "lentils",
  name: "Сочевиця",
  category: "carb",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 100,
  max: 250,
  defaultAmount: 150,
  allowedMeals: ["lunch", "dinner"],
  macrosPer100: { p: 9, f: 0.4, c: 20, kcal: 116 }
},
{
  id: "beans",
  name: "Квасоля",
  category: "carb",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 100,
  max: 250,
  defaultAmount: 150,
  allowedMeals: ["lunch", "dinner"],
  macrosPer100: { p: 8.7, f: 0.5, c: 22.8, kcal: 127 }
},
{
  id: "berries",
  name: "Ягоди",
  category: "carb",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 75,
  max: 250,
  defaultAmount: 150,
  allowedMeals: ["breakfast", "second_breakfast", "snack"],
  macrosPer100: { p: 0.8, f: 0.3, c: 12, kcal: 55 }
},
{
  id: "apple",
  name: "Яблуко",
  category: "carb",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 25,
  min: 100,
  max: 250,
  defaultAmount: 150,
  allowedMeals: ["breakfast", "second_breakfast", "snack"],
  macrosPer100: { p: 0.3, f: 0.2, c: 14, kcal: 52 }
},
{
  id: "rice_cakes",
  name: "Рисові хлібці",
  category: "extra_carb",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 10,
  min: 20,
  max: 80,
  defaultAmount: 40,
  allowedMeals: ["breakfast", "second_breakfast", "snack"],
  macrosPer100: { p: 7, f: 3, c: 80, kcal: 380 }
},
{
  id: "pumpkin_seeds",
  name: "Гарбузове насіння",
  category: "fat",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 5,
  min: 10,
  max: 40,
  defaultAmount: 20,
  allowedMeals: ["breakfast", "snack", "dinner"],
  macrosPer100: { p: 30, f: 49, c: 11, kcal: 559 }
},
{
  id: "dark_chocolate",
  name: "Чорний шоколад 85%",
  category: "fat",
  unitType: "grams",
  unitLabel: "г",
  portionStep: 5,
  min: 10,
  max: 30,
  defaultAmount: 15,
  allowedMeals: ["snack"],
  macrosPer100: { p: 11, f: 46, c: 30, kcal: 600 }
},


    {
      id: "vegetables",
      name: "Овочевий мікс: огірок, томат, зелень",
      category: "vegetable",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 50,
      min: 150,
      max: 300,
      defaultAmount: 200,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 1.5, f: 0.2, c: 5, kcal: 30 }
    },
    {
      id: "spinach",
      name: "Шпинат",
      category: "vegetable",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 50,
      max: 200,
      defaultAmount: 100,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 2.9, f: 0.4, c: 3.6, kcal: 23 }
    },
    {
      id: "broccoli",
      name: "Броколі",
      category: "vegetable",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 100,
      max: 300,
      defaultAmount: 200,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 2.8, f: 0.4, c: 6.6, kcal: 34 }
    },
    {
      id: "cucumber",
      name: "Огірок",
      category: "vegetable",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 50,
      min: 100,
      max: 300,
      defaultAmount: 200,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 0.7, f: 0.1, c: 3.6, kcal: 16 }
    },
    {
      id: "tomato",
      name: "Томат",
      category: "vegetable",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 50,
      min: 100,
      max: 300,
      defaultAmount: 200,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 0.9, f: 0.2, c: 3.9, kcal: 18 }
    },
    {
      id: "zucchini",
      name: "Кабачок",
      category: "vegetable",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 50,
      min: 100,
      max: 300,
      defaultAmount: 200,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 1.2, f: 0.3, c: 3.1, kcal: 17 }
    },
    {
      id: "bell_pepper",
      name: "Болгарський перець",
      category: "vegetable",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 50,
      min: 100,
      max: 250,
      defaultAmount: 150,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 1, f: 0.3, c: 6, kcal: 31 }
    },
    {
      id: "asparagus",
      name: "Спаржа",
      category: "vegetable",
      unitType: "grams",
      unitLabel: "г",
      portionStep: 25,
      min: 100,
      max: 300,
      defaultAmount: 200,
      allowedMeals: ["lunch", "dinner"],
      macrosPer100: { p: 2.2, f: 0.1, c: 3.9, kcal: 20 }
    }
  ];

  const mealNames = {
    breakfast: "Сніданок",
    second_breakfast: "Другий сніданок",
    lunch: "Обід",
    snack: "Перекус",
    dinner: "Вечеря"
  };

const autoMealTemplates = {
  breakfast: {
    protein: ["eggs", "cottage_cheese", "hard_cheese", "greek_yogurt", "skyr", "whey_protein"],
    carb: ["oatmeal", "berries", "apple"],
    extra_carb: ["banana", "whole_bread", "rice_cakes"],
    fat: ["butter", "peanut_butter", "avocado", "pumpkin_seeds"],
    vegetables: false
  },
  second_breakfast: {
    protein: ["cottage_cheese", "hard_cheese", "greek_yogurt", "skyr", "whey_protein"],
    carb: ["banana", "berries", "apple"],
    extra_carb: ["whole_bread", "rice_cakes"],
    fat: ["nuts", "peanut_butter", "pumpkin_seeds"],
    vegetables: false
  },
  lunch: {
    protein: ["chicken", "turkey", "beef", "tuna", "white_fish", "salmon", "chicken_thigh", "shrimp", "tofu", "pork_tenderloin"],
    carb: ["rice", "buckwheat", "potato", "sweet_potato", "bulgur", "pasta", "couscous", "quinoa", "lentils", "beans"],
    extra_carb: ["whole_bread"],
    fat: ["olive_oil", "avocado"],
    vegetables: true
  },
  snack: {
    protein: ["cottage_cheese", "hard_cheese", "greek_yogurt", "skyr", "whey_protein"],
    carb: ["banana", "berries", "apple"],
    extra_carb: ["whole_bread", "rice_cakes"],
    fat: ["nuts", "peanut_butter", "seeds", "pumpkin_seeds", "dark_chocolate"],
    vegetables: false
  },
  dinner: {
    protein: ["chicken", "turkey", "white_fish", "salmon", "tuna", "beef", "chicken_thigh", "eggs", "hard_cheese", "shrimp", "tofu", "pork_tenderloin"],
    carb: ["rice", "buckwheat", "potato", "sweet_potato", "bulgur", "quinoa", "lentils", "beans"],
    extra_carb: ["whole_bread"],
    fat: ["olive_oil", "avocado", "pumpkin_seeds"],
    vegetables: true
  }
};

  const professionalMealPresets = {
    breakfast: [
      {
        items: [
          { foodId: "eggs" },
          { foodId: "oatmeal", amount: { cut: 50, default: 60, gain: 70 } },
          { foodId: "berries", amount: 75, optional: true },
          { foodId: "pumpkin_seeds", amount: { cut: 10, default: 15 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "skyr" },
          { foodId: "banana", amount: { cut: 80, default: 100 } },
          { foodId: "rice_cakes", amount: { cut: 20, default: 30 }, optional: true },
          { foodId: "peanut_butter", amount: { cut: 10, default: 15 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "cottage_cheese" },
          { foodId: "apple", amount: 150 },
          { foodId: "nuts", amount: { cut: 15, default: 20 }, optional: true }
        ]
      }
    ],
    second_breakfast: [
      {
        items: [
          { foodId: "greek_yogurt" },
          { foodId: "berries", amount: 150 },
          { foodId: "nuts", amount: { cut: 15, default: 20 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "cottage_cheese" },
          { foodId: "banana", amount: { cut: 80, default: 100 } },
          { foodId: "pumpkin_seeds", amount: { cut: 10, default: 15 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "skyr" },
          { foodId: "apple", amount: 150 },
          { foodId: "dark_chocolate", amount: 10, optional: true }
        ]
      }
    ],
    lunch: [
      {
        items: [
          { foodId: "chicken" },
          { foodId: "rice", amount: { cut: 125, default: 150, gain: 175 } },
          { foodId: "spinach", amount: 100 },
          { foodId: "tomato", amount: 150, optional: true },
          { foodId: "olive_oil", amount: { cut: 5, default: 10 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "turkey" },
          { foodId: "bulgur", amount: { cut: 125, default: 175 } },
          { foodId: "asparagus" },
          { foodId: "bell_pepper", amount: 150, optional: true },
          { foodId: "avocado", amount: { cut: 50, default: 75 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "salmon" },
          { foodId: "potato", amount: { cut: 150, default: 225 } },
          { foodId: "broccoli" },
          { foodId: "cucumber", amount: 150, optional: true }
        ]
      },
      {
        items: [
          { foodId: "shrimp" },
          { foodId: "quinoa", amount: { cut: 125, default: 150 } },
          { foodId: "spinach", amount: 100 },
          { foodId: "bell_pepper", amount: 150, optional: true },
          { foodId: "olive_oil", amount: { cut: 5, default: 10 }, optional: true }
        ]
      }
    ],
    snack: [
      {
        items: [
          { foodId: "skyr" },
          { foodId: "berries", amount: 150 },
          { foodId: "nuts", amount: { cut: 15, default: 20 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "whey_protein" },
          { foodId: "banana", amount: { cut: 80, default: 100 } },
          { foodId: "rice_cakes", amount: { cut: 20, default: 30 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "greek_yogurt" },
          { foodId: "apple", amount: 150 },
          { foodId: "pumpkin_seeds", amount: { cut: 10, default: 15 }, optional: true }
        ]
      }
    ],
    dinner: [
      {
        items: [
          { foodId: "white_fish" },
          { foodId: "potato", amount: { cut: 150, default: 200 } },
          { foodId: "broccoli" },
          { foodId: "cucumber", amount: 150, optional: true },
          { foodId: "olive_oil", amount: { cut: 5, default: 10 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "turkey" },
          { foodId: "buckwheat", amount: { cut: 100, default: 125 } },
          { foodId: "zucchini" },
          { foodId: "tomato", amount: 150, optional: true },
          { foodId: "avocado", amount: { cut: 50, default: 75 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "tofu" },
          { foodId: "lentils", amount: { cut: 125, default: 150 } },
          { foodId: "spinach", amount: 100 },
          { foodId: "bell_pepper", amount: 150, optional: true },
          { foodId: "pumpkin_seeds", amount: { cut: 10, default: 15 }, optional: true }
        ]
      },
      {
        items: [
          { foodId: "salmon" },
          { foodId: "sweet_potato", amount: { cut: 150, default: 200 } },
          { foodId: "asparagus" },
          { foodId: "cucumber", amount: 150, optional: true }
        ]
      }
    ]
  };

  function clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function getStoredNutritionCorrection(goal) {
    try {
      const saved = window.localStorage.getItem("vitalrise:nutrition:active-correction");
      const correction = saved ? JSON.parse(saved) : null;
      const adjustment = correction ? Number(correction.calorieAdjustment) : 0;

      if (!correction || correction.goal !== goal || !Number.isFinite(adjustment) || adjustment === 0) {
        return null;
      }

      return {
        goal: correction.goal,
        calorieAdjustment: Math.max(-250, Math.min(200, Math.round(adjustment))),
        carbAdjustment: Math.round(adjustment / 4),
        reason: correction.reason || "",
        updatedAt: correction.updatedAt || ""
      };
    } catch (error) {
      return null;
    }
  }

  function applyNutritionCorrection(targets, correction) {
    if (!targets || !correction) return targets;

    const nextTargets = Object.assign({}, targets);
    const nextCalories = Math.max(1200, Math.round(nextTargets.calories + correction.calorieAdjustment));

    nextTargets.calories = nextCalories;
    nextTargets.carbs = +Math.max(
      0,
      (nextCalories - nextTargets.protein * 4 - nextTargets.fat * 9) / 4
    ).toFixed(1);
    nextTargets.activeCorrection = correction;

    return nextTargets;
  }

  function getCustomFoods() {
    return window.VitalRiseSystem &&
      window.VitalRiseSystem.nutritionCustom &&
      typeof window.VitalRiseSystem.nutritionCustom.getProducts === "function"
      ? window.VitalRiseSystem.nutritionCustom.getProducts()
      : [];
  }

  function getAllFoods() {
    return foods.concat(getCustomFoods());
  }

  function getFoodById(id) {
    const allFoods = getAllFoods();

    for (let i = 0; i < allFoods.length; i += 1) {
      if (allFoods[i].id === id) return clone(allFoods[i]);
    }

    return null;
  }

  function getFoodsByCategory(category) {
    return getAllFoods()
      .filter(function (food) {
        return food.category === category;
      })
      .map(function (food) {
        return clone(food);
      });
  }

  function normalizePortion(food, amount) {
    const stepped = Math.round(amount / food.portionStep) * food.portionStep;
    return Math.max(food.min, Math.min(food.max, stepped));
  }

  function getFoodMacros(food, amount) {
    if (food.unitType === "piece") {
      return {
        p: +(food.macrosPerUnit.p * amount).toFixed(1),
        f: +(food.macrosPerUnit.f * amount).toFixed(1),
        c: +(food.macrosPerUnit.c * amount).toFixed(1),
        kcal: +(food.macrosPerUnit.kcal * amount).toFixed(1)
      };
    }

    const factor = amount / 100;
    return {
      p: +(food.macrosPer100.p * factor).toFixed(1),
      f: +(food.macrosPer100.f * factor).toFixed(1),
      c: +(food.macrosPer100.c * factor).toFixed(1),
      kcal: +(food.macrosPer100.kcal * factor).toFixed(1)
    };
  }

  function getSelectionEntries(value) {
    if (!value) return [];

    if (typeof value === "string") {
      return [{ id: value, amount: null }];
    }

    if (Array.isArray(value)) {
      return value
        .map(function (item) {
          if (typeof item === "string") return { id: item, amount: null };
          return {
            id: item && item.id,
            amount: item && Number(item.amount)
          };
        })
        .filter(function (item) {
          return !!item.id;
        });
    }

    if (typeof value === "object") {
      return Object.keys(value)
        .map(function (id) {
          return { id: id, amount: Number(value[id]) };
        })
        .filter(function (item) {
          return !!item.id;
        });
    }

    return [];
  }

  function createMealItem(foodId, amount) {
    const food = getFoodById(foodId);
    if (!food) return null;

    const finalAmount = normalizePortion(food, amount);
    return {
      id: food.id,
      name: food.name,
      category: food.category,
      amount: finalAmount,
      unitType: food.unitType,
      unitLabel: food.unitLabel,
      macros: getFoodMacros(food, finalAmount)
    };
  }

  function calculateMealTotals(meal) {
    const totals = { kcal: 0, p: 0, f: 0, c: 0 };

    meal.items.forEach(function (item) {
      totals.kcal += item.macros.kcal;
      totals.p += item.macros.p;
      totals.f += item.macros.f;
      totals.c += item.macros.c;
    });

    meal.totals = {
      kcal: +totals.kcal.toFixed(1),
      p: +totals.p.toFixed(1),
      f: +totals.f.toFixed(1),
      c: +totals.c.toFixed(1)
    };

    return meal.totals;
  }

  function calculatePlanTotals(meals) {
    const totals = { kcal: 0, p: 0, f: 0, c: 0 };

    meals.forEach(function (meal) {
      calculateMealTotals(meal);
      totals.kcal += meal.totals.kcal;
      totals.p += meal.totals.p;
      totals.f += meal.totals.f;
      totals.c += meal.totals.c;
    });

    return {
      kcal: +totals.kcal.toFixed(1),
      p: +totals.p.toFixed(1),
      f: +totals.f.toFixed(1),
      c: +totals.c.toFixed(1)
    };
  }

  function addMealItem(meal, foodId, amount) {
    const item = createMealItem(foodId, amount);
    if (!item) return null;

    meal.items.push(item);
    return item;
  }

  function mealHas(meal, foodId) {
    return meal.items.some(function (item) {
      return item.id === foodId;
    });
  }

  function validateMeal(meal) {
    const ids = meal.items.map(function (item) {
      return item.id;
    });

    if (ids.includes("yolks")) return false;
    if (meal.mealKey === "lunch" && ids.includes("banana")) return false;
    if (meal.mealKey === "dinner" && ids.includes("banana")) return false;
    if (ids.includes("cottage_cheese") && ids.includes("avocado") && ids.includes("eggs")) return false;
    if (meal.items.length === 0) return false;

    return true;
  }

  function optimizeMealToCalories(meal, targetKcal) {
    let guard = 0;

    while (guard < 20) {
      guard += 1;
      calculateMealTotals(meal);

      const diff = targetKcal - meal.totals.kcal;
      if (Math.abs(diff) <= 45) break;

      if (diff > 45) {
        const carbItem = meal.items.find(function (item) {
          return item.category === "carb";
        });
        const proteinItem = meal.items.find(function (item) {
          return item.category === "protein";
        });
        const fatItem = meal.items.find(function (item) {
          return item.category === "fat";
        });

        if (carbItem) {
          const food = getFoodById(carbItem.id);
          carbItem.amount = normalizePortion(food, carbItem.amount + food.portionStep);
          carbItem.macros = getFoodMacros(food, carbItem.amount);
          continue;
        }

        if (proteinItem) {
          const food = getFoodById(proteinItem.id);
          proteinItem.amount = normalizePortion(food, proteinItem.amount + food.portionStep);
          proteinItem.macros = getFoodMacros(food, proteinItem.amount);
          continue;
        }

        if (fatItem) {
          const food = getFoodById(fatItem.id);
          fatItem.amount = normalizePortion(food, fatItem.amount + food.portionStep);
          fatItem.macros = getFoodMacros(food, fatItem.amount);
          continue;
        }
      }

      if (diff < -45) {
        const fatItem = meal.items.find(function (item) {
          return item.category === "fat";
        });
        const carbItem = meal.items.find(function (item) {
          return item.category === "carb";
        });
        const proteinItem = meal.items.find(function (item) {
          return item.category === "protein";
        });

        if (fatItem) {
          const food = getFoodById(fatItem.id);
          if (fatItem.amount > food.min) {
            fatItem.amount = normalizePortion(food, fatItem.amount - food.portionStep);
            fatItem.macros = getFoodMacros(food, fatItem.amount);
            continue;
          }
        }

        if (carbItem) {
          const food = getFoodById(carbItem.id);
          if (carbItem.amount > food.min) {
            carbItem.amount = normalizePortion(food, carbItem.amount - food.portionStep);
            carbItem.macros = getFoodMacros(food, carbItem.amount);
            continue;
          }
        }

        if (proteinItem) {
          const food = getFoodById(proteinItem.id);
          if (proteinItem.amount > food.min) {
            proteinItem.amount = normalizePortion(food, proteinItem.amount - food.portionStep);
            proteinItem.macros = getFoodMacros(food, proteinItem.amount);
            continue;
          }
        }

        break;
      }
    }

    calculateMealTotals(meal);
    return meal;
  }

  function rebalancePlan(meals, targets) {
    let totals = calculatePlanTotals(meals);
    let guard = 0;

    while (guard < 20) {
      guard += 1;

      const diff = targets.calories - totals.kcal;
      if (Math.abs(diff) <= 90) break;

      const lunch = meals.find(function (meal) { return meal.mealKey === "lunch"; });
      const dinner = meals.find(function (meal) { return meal.mealKey === "dinner"; });
      const breakfast = meals.find(function (meal) { return meal.mealKey === "breakfast"; });

      if (diff > 90) {
        if (lunch) optimizeMealToCalories(lunch, lunch.totals.kcal + 60);
        else if (dinner) optimizeMealToCalories(dinner, dinner.totals.kcal + 60);
      } else {
        if (dinner) optimizeMealToCalories(dinner, Math.max(220, dinner.totals.kcal - 60));
        else if (breakfast) optimizeMealToCalories(breakfast, Math.max(250, breakfast.totals.kcal - 50));
      }

      totals = calculatePlanTotals(meals);
    }

    return totals;
  }

  function pickAutoTemplateFood(category, mealKey, selected) {
    const template = autoMealTemplates[mealKey];
    if (!template || !template[category]) return null;

    const selectedIds = (selected && selected[category]) || [];
    const allowedTemplateIds = template[category];

    const selectedAllowed = selectedIds
      .filter(function (id) {
        return allowedTemplateIds.includes(id);
      })
      .map(getFoodById)
      .filter(Boolean);

    if (selectedAllowed.length) {
      return selectedAllowed[0];
    }

    const fallback = allowedTemplateIds
      .map(getFoodById)
      .filter(Boolean);

    return fallback[0] || null;
  }

  function isFoodAvailableForPreset(food, mealKey, selected) {
    if (!food) return false;

    const selectedIds = (selected && selected[food.category]) || [];
    if (selectedIds.length && !selectedIds.includes(food.id)) return false;

    if (food.allowedMeals && food.allowedMeals.length && !food.allowedMeals.includes(mealKey)) {
      return false;
    }

    return true;
  }

  function getPresetAmount(entry, food, mealKey, goal) {
    if (entry.amount && typeof entry.amount === "object") {
      return entry.amount[goal] || entry.amount.default || getDefaultAmountForMeal(food, mealKey, goal);
    }

    return entry.amount || getDefaultAmountForMeal(food, mealKey, goal);
  }

  function getPresetScore(preset, mealKey, selected) {
    let score = 0;

    for (let i = 0; i < preset.items.length; i += 1) {
      const entry = preset.items[i];
      const food = getFoodById(entry.foodId);
      const available = isFoodAvailableForPreset(food, mealKey, selected);

      if (!available && !entry.optional) return -1;
      if (available) score += entry.optional ? 1 : 3;
    }

    return score;
  }

  function pickProfessionalMealPreset(mealKey, targets, selected) {
    const presets = professionalMealPresets[mealKey] || [];
    if (!presets.length) return null;

    const ranked = presets
      .map(function (preset, index) {
        return {
          preset,
          index,
          score: getPresetScore(preset, mealKey, selected)
        };
      })
      .filter(function (item) {
        return item.score > 0;
      })
      .sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.index - b.index;
      });

    if (!ranked.length) return null;

    const goalOffset = targets.goal === "gain" ? 1 : targets.goal === "cut" ? 0 : 0;
    return ranked[goalOffset % ranked.length].preset;
  }

  function addPresetItemsToMeal(meal, preset, targets, selected) {
    let added = 0;

    preset.items.forEach(function (entry) {
      const food = getFoodById(entry.foodId);
      if (!isFoodAvailableForPreset(food, meal.mealKey, selected)) return;
      if (mealHas(meal, food.id)) return;

      addMealItem(meal, food.id, getPresetAmount(entry, food, meal.mealKey, targets.goal));
      added += 1;
    });

    return added;
  }

  function buildAutoMealFromTemplate(mealKey, targetKcal, targets, selected) {
    const meal = {
      mealKey: mealKey,
      mealName: mealNames[mealKey],
      items: [],
      totals: {}
    };

    const template = autoMealTemplates[mealKey];
    if (!template) return meal;

    const professionalPreset = pickProfessionalMealPreset(mealKey, targets, selected);
    if (professionalPreset && addPresetItemsToMeal(meal, professionalPreset, targets, selected)) {
      optimizeMealToCalories(meal, targetKcal);

      if (!validateMeal(meal)) {
        calculateMealTotals(meal);
      }

      return meal;
    }

    const proteinFood = pickAutoTemplateFood("protein", mealKey, selected);
    const carbFood = pickAutoTemplateFood("carb", mealKey, selected);
    const extraCarbFood = pickAutoTemplateFood("extra_carb", mealKey, selected);
    const fatFood = pickAutoTemplateFood("fat", mealKey, selected);

    if (proteinFood) {
      addMealItem(meal, proteinFood.id, getDefaultAmountForMeal(proteinFood, mealKey, targets.goal));
    }

    if (carbFood) {
      addMealItem(meal, carbFood.id, getDefaultAmountForMeal(carbFood, mealKey, targets.goal));
    }

    if (extraCarbFood) {
      if (mealKey === "breakfast" && targetKcal > 450) {
        addMealItem(meal, extraCarbFood.id, getDefaultAmountForMeal(extraCarbFood, mealKey, targets.goal));
      }

      if (mealKey === "lunch" && targetKcal > 650) {
        addMealItem(meal, extraCarbFood.id, 40);
      }

      if (mealKey === "second_breakfast" || mealKey === "snack") {
        if (targetKcal > 250 && extraCarbFood.id === "whole_bread") {
          addMealItem(meal, extraCarbFood.id, 40);
        }
      }

      if (mealKey === "dinner" && targets.goal === "gain" && targetKcal > 500) {
        addMealItem(meal, extraCarbFood.id, 40);
      }
    }

    if (fatFood) {
      const skipFatWithSalmon =
        proteinFood && proteinFood.id === "salmon" && fatFood.id === "olive_oil";

      if (!skipFatWithSalmon) {
        if (mealKey === "breakfast" && targets.goal !== "cut") {
          addMealItem(meal, fatFood.id, getDefaultAmountForMeal(fatFood, mealKey, targets.goal));
        }

        if (mealKey === "lunch" || mealKey === "dinner") {
          addMealItem(meal, fatFood.id, getDefaultAmountForMeal(fatFood, mealKey, targets.goal));
        }

        if ((mealKey === "second_breakfast" || mealKey === "snack") && targetKcal > 260) {
          addMealItem(meal, fatFood.id, getDefaultAmountForMeal(fatFood, mealKey, targets.goal));
        }
      }
    }

    if (template.vegetables) {
      const vegetableFood = pickSelectedVegetable(mealKey, selected);
      if (vegetableFood) addMealItem(meal, vegetableFood.id, getDefaultAmountForMeal(vegetableFood, mealKey, targets.goal));
    }

    optimizeMealToCalories(meal, targetKcal);

    if (!validateMeal(meal)) {
      calculateMealTotals(meal);
    }

    return meal;
  }

  function buildAutoMealPlan(targets, selected) {
    const distribution = getMealDistribution(targets.mealsCount);

    const meals = distribution.map(function (part) {
      const targetKcal = Math.round(targets.calories * part.ratio);
      return buildAutoMealFromTemplate(part.key, targetKcal, targets, selected);
    });

    return {
      meals: meals,
      totals: rebalancePlan(meals, targets)
    };
  }

  function addUniqueMealItem(meal, foodId, amount) {
    if (!foodId) return;

    const exists = meal.items.some(function (item) {
      return item.id === foodId;
    });

    if (!exists) {
      addMealItem(meal, foodId, amount);
    }
  }

  function getSelectedAllowedFoods(category, allowedIds, selected) {
    const selectedIds = (selected && selected[category]) || [];

    return selectedIds
      .filter(function (id) {
        return !allowedIds || !allowedIds.length || allowedIds.includes(id);
      })
      .map(getFoodById)
      .filter(Boolean);
  }

  function pickSelectedVegetable(mealKey, selected) {
    const selectedVegetables = ((selected && selected.vegetable) || [])
      .map(getFoodById)
      .filter(Boolean)
      .filter(function (food) {
        return !food.allowedMeals || !food.allowedMeals.length || food.allowedMeals.includes(mealKey);
      });

    const preferred = selectedVegetables.find(function (food) {
      return food.id !== "vegetables";
    });

    return preferred || selectedVegetables[0] || getFoodById("vegetables");
  }

  function addSelectedVegetableToMeal(meal, mealKey, selected, goal, used) {
    const vegetable = pickSelectedVegetable(mealKey, selected);
    if (!vegetable) return;

    addUniqueMealItem(meal, vegetable.id, getDefaultAmountForMeal(vegetable, mealKey, goal));
    if (used) used.add(vegetable.id);
  }

  function buildFallbackMeal(mealKey, targetKcal, goal, selected) {
    const meal = {
      mealKey: mealKey,
      mealName: mealNames[mealKey],
      items: [],
      totals: {}
    };

    const allowed = getAllowedIdsForMeal(mealKey);
    const protein = (allowed.protein || []).map(getFoodById).filter(Boolean)[0];
    const carb = (allowed.carb || []).map(getFoodById).filter(Boolean)[0];
    const fat = (allowed.fat || []).map(getFoodById).filter(Boolean)[0];

    if (protein) addUniqueMealItem(meal, protein.id, getDefaultAmountForMeal(protein, mealKey, goal));
    if (carb && goal !== "cut") addUniqueMealItem(meal, carb.id, getDefaultAmountForMeal(carb, mealKey, goal));
    if (mealKey === "lunch" || mealKey === "dinner") addSelectedVegetableToMeal(meal, mealKey, selected, goal);
    if (fat && targetKcal > 300) addUniqueMealItem(meal, fat.id, getDefaultAmountForMeal(fat, mealKey, goal));

    optimizeMealToCalories(meal, targetKcal);
    calculateMealTotals(meal);
    return meal;
  }

  function buildManualMealByKey(mealKey, targets, selected, usedIds) {
    const meal = {
      mealKey: mealKey,
      mealName: mealNames[mealKey],
      items: [],
      totals: {}
    };
    const used = usedIds || new Set();
    const allowed = getAllowedIdsForMeal(mealKey);

    const selectedProteins = getSelectedAllowedFoods("protein", allowed.protein, selected).filter(function (food) {
      return !used.has(food.id);
    });
    const selectedCarbs = getSelectedAllowedFoods("carb", allowed.carb, selected).filter(function (food) {
      return !used.has(food.id);
    });
    const selectedFats = getSelectedAllowedFoods("fat", allowed.fat, selected).filter(function (food) {
      return !used.has(food.id);
    });

    const fallbackProteins = getSelectedAllowedFoods("protein", allowed.protein, selected);
    const fallbackCarbs = getSelectedAllowedFoods("carb", allowed.carb, selected);
    const fallbackFats = getSelectedAllowedFoods("fat", allowed.fat, selected);

    const protein = selectedProteins[0] || fallbackProteins[0] || null;
    const carb = selectedCarbs[0] || fallbackCarbs[0] || null;
    const fat = selectedFats[0] || fallbackFats[0] || null;
    const extraCarb = getSelectedAllowedFoods("extra_carb", allowed.extra_carb || [], selected)
      .find(function (food) {
        return !used.has(food.id);
      });

    if (extraCarb && meal.items.length < 4) {
      addUniqueMealItem(meal, extraCarb.id, getDefaultAmountForMeal(extraCarb, mealKey, targets.goal));
      used.add(extraCarb.id);
    }

    if (mealKey === "breakfast") {
      if (protein) {
        addUniqueMealItem(meal, protein.id, getDefaultAmountForMeal(protein, mealKey, targets.goal));
        used.add(protein.id);
      }

      if (carb) {
        addUniqueMealItem(meal, carb.id, getDefaultAmountForMeal(carb, mealKey, targets.goal));
        used.add(carb.id);
      }

      const extraBanana = getSelectedAllowedFoods("carb", ["banana"], selected).find(function (food) {
        return !meal.items.some(function (item) { return item.id === food.id; });
      });

      if (extraBanana && targets.calories > 2200 && meal.items.length < 3) {
        addUniqueMealItem(meal, extraBanana.id, 100);
        used.add(extraBanana.id);
      }

      if (fat && fat.id === "avocado" && targets.goal === "gain" && meal.items.length < 4) {
        addUniqueMealItem(meal, fat.id, 50);
        used.add(fat.id);
      }
    }

    if (mealKey === "second_breakfast") {
      const proteinFood = protein || getFoodById("cottage_cheese");
      if (proteinFood) {
        addUniqueMealItem(meal, proteinFood.id, getDefaultAmountForMeal(proteinFood, mealKey, targets.goal));
        used.add(proteinFood.id);
      }

      if (carb && meal.items.length < 3) {
        addUniqueMealItem(meal, carb.id, getDefaultAmountForMeal(carb, mealKey, targets.goal));
        used.add(carb.id);
      }

      if (fat && fat.id === "nuts" && meal.items.length < 3) {
        addUniqueMealItem(meal, fat.id, 20);
        used.add(fat.id);
      }
    }

    if (mealKey === "lunch") {
      const proteinFood = protein || getFoodById("chicken");
      const carbFood = carb || getFoodById("rice");

      if (proteinFood) {
        addUniqueMealItem(meal, proteinFood.id, getDefaultAmountForMeal(proteinFood, mealKey, targets.goal));
        used.add(proteinFood.id);
      }

      if (carbFood) {
        addUniqueMealItem(meal, carbFood.id, getDefaultAmountForMeal(carbFood, mealKey, targets.goal));
        used.add(carbFood.id);
      }

      addSelectedVegetableToMeal(meal, mealKey, selected, targets.goal, used);

      if (fat && meal.items.length < 4 && proteinFood && proteinFood.id !== "salmon") {
        addUniqueMealItem(meal, fat.id, getDefaultAmountForMeal(fat, mealKey, targets.goal));
        used.add(fat.id);
      }
    }

    if (mealKey === "snack") {
      const proteinFood = protein || getFoodById("cottage_cheese");

      if (proteinFood) {
        addUniqueMealItem(meal, proteinFood.id, getDefaultAmountForMeal(proteinFood, mealKey, targets.goal));
        used.add(proteinFood.id);
      }

      if (carb && meal.items.length < 3) {
        addUniqueMealItem(meal, carb.id, 100);
        used.add(carb.id);
      }

      if (fat && fat.id === "nuts" && targets.goal !== "cut" && meal.items.length < 3) {
        addUniqueMealItem(meal, fat.id, 20);
        used.add(fat.id);
      }
    }

    if (mealKey === "dinner") {
      const proteinFood = protein || getFoodById("white_fish");

      if (proteinFood) {
        addUniqueMealItem(meal, proteinFood.id, getDefaultAmountForMeal(proteinFood, mealKey, targets.goal));
        used.add(proteinFood.id);
      }

      addSelectedVegetableToMeal(meal, mealKey, selected, targets.goal, used);

      if (carb && targets.goal !== "cut" && meal.items.length < 4) {
        addUniqueMealItem(meal, carb.id, getDefaultAmountForMeal(carb, mealKey, targets.goal));
        used.add(carb.id);
      }

      if (fat && proteinFood && !["salmon", "eggs"].includes(proteinFood.id) && meal.items.length < 4) {
        addUniqueMealItem(meal, fat.id, 5);
        used.add(fat.id);
      }
    }

    const targetRatios = getMealDistribution(targets.mealsCount);
    const currentRatio = targetRatios.find(function (part) {
      return part.key === mealKey;
    });
    const targetKcal = currentRatio
      ? Math.round(targets.calories * currentRatio.ratio)
      : Math.round(targets.calories / targets.mealsCount);

    optimizeMealToCalories(meal, targetKcal);

    if (!validateMeal(meal)) {
      return buildFallbackMeal(mealKey, targetKcal, targets.goal, selected);
    }

    calculateMealTotals(meal);
    return meal;
  }

  function buildManualMealPlan(targets, selected) {
    const mealKeys = getManualMealDistribution(targets.mealsCount);
    const usedIds = new Set();
    const meals = mealKeys.map(function (mealKey) {
      return buildManualMealByKey(mealKey, targets, selected, usedIds);
    });

    return {
      meals: meals,
      totals: rebalancePlan(meals, targets)
    };
  }

  function getMealDistribution(mealCount) {
    if (mealCount === 5) {
      return [
        { key: "breakfast", ratio: 0.22 },
        { key: "second_breakfast", ratio: 0.13 },
        { key: "lunch", ratio: 0.30 },
        { key: "snack", ratio: 0.13 },
        { key: "dinner", ratio: 0.22 }
      ];
    }

    return [
      { key: "breakfast", ratio: 0.25 },
      { key: "lunch", ratio: 0.35 },
      { key: "snack", ratio: 0.15 },
      { key: "dinner", ratio: 0.25 }
    ];
  }

  function getManualMealDistribution(mealCount) {
    if (mealCount === 5) {
      return ["breakfast", "second_breakfast", "lunch", "snack", "dinner"];
    }

    return ["breakfast", "lunch", "snack", "dinner"];
  }

  function getAllowedIdsForMeal(mealKey) {
    if (mealKey === "breakfast") {
      return {
        protein: ["eggs", "cottage_cheese", "hard_cheese", "greek_yogurt", "skyr", "whey_protein"],
        carb: ["oatmeal", "banana", "berries", "apple"],
        fat: ["avocado", "butter", "peanut_butter", "pumpkin_seeds"],
        vegetable: [],
        extra_carb: ["whole_bread", "rice_cakes"]
      };
    }

    if (mealKey === "second_breakfast") {
      return {
        protein: ["cottage_cheese", "hard_cheese", "greek_yogurt", "skyr", "whey_protein"],
        carb: ["banana", "oatmeal", "berries", "apple"],
        fat: ["nuts", "peanut_butter", "seeds", "pumpkin_seeds"],
        vegetable: [],
        extra_carb: ["whole_bread", "rice_cakes"]
      };
    }

    if (mealKey === "lunch") {
      return {
        protein: ["chicken", "turkey", "beef", "tuna", "white_fish", "salmon", "chicken_thigh", "shrimp", "tofu", "pork_tenderloin"],
        carb: ["rice", "buckwheat", "potato", "pasta", "sweet_potato", "bulgur", "couscous", "quinoa", "lentils", "beans"],
        fat: ["olive_oil", "avocado", "butter"],
        vegetable: ["spinach", "broccoli", "cucumber", "tomato", "zucchini", "bell_pepper", "asparagus"],
        extra_carb: ["whole_bread"]
      };
    }

    if (mealKey === "snack") {
      return {
        protein: ["cottage_cheese", "hard_cheese", "greek_yogurt", "skyr", "whey_protein"],
        carb: ["banana", "berries", "apple"],
        fat: ["nuts", "peanut_butter", "seeds", "pumpkin_seeds", "dark_chocolate"],
        vegetable: [],
        extra_carb: ["whole_bread", "rice_cakes"]
      };
    }

    return {
      protein: ["chicken", "turkey", "beef", "tuna", "white_fish", "salmon", "eggs", "hard_cheese", "chicken_thigh", "shrimp", "tofu", "pork_tenderloin"],
      carb: ["rice", "buckwheat", "potato", "sweet_potato", "bulgur", "quinoa", "lentils", "beans"],
      fat: ["olive_oil", "avocado", "pumpkin_seeds"],
      vegetable: ["spinach", "broccoli", "cucumber", "tomato", "zucchini", "bell_pepper", "asparagus"],
      extra_carb: ["whole_bread"]
    };
  }

  function getDefaultAmountForMeal(food, mealKey, goal) {
    if (!food) return 0;

    if (food.id === "whole_bread") return 60;

    if (food.id === "eggs") return goal === "gain" ? 4 : 3;

    if (food.id === "hard_cheese") return goal === "gain" ? 50 : 40;

    if (food.id === "cottage_cheese") return 200;

    if (food.id === "banana") return 100;

    if (food.id === "oatmeal") return mealKey === "breakfast" ? 70 : 60;

    if (food.id === "rice" || food.id === "buckwheat") {
      if (mealKey === "dinner") return goal === "gain" ? 100 : 75;
      return 150;
    }

    if (food.id === "potato") {
      if (mealKey === "dinner") return goal === "gain" ? 200 : 150;
      return 250;
    }

    if (food.id === "pasta") return 150;

    if (food.id === "olive_oil") return goal === "cut" ? 5 : 10;

    if (food.id === "avocado") return 50;

    if (food.id === "nuts") return 20;

    if (["vegetables", "broccoli", "cucumber", "tomato", "zucchini", "asparagus"].includes(food.id)) return 200;

    if (food.id === "spinach") return 100;

    if (food.id === "bell_pepper") return 150;

    return food.defaultAmount || food.min || 100;
  }

  function getMacroKeyByCategory(category) {
    if (category === "protein") return "p";
    if (category === "carb") return "c";
    if (category === "extra_carb") return "c";
    if (category === "fat") return "f";
    return "p";
  }

  function getMealMacroTargets(targets, mealKey) {
    const distribution = getMealDistribution(targets.mealsCount);
    const part = distribution.find(function (item) {
      return item.key === mealKey;
    });

    const ratio = part ? part.ratio : (1 / targets.mealsCount);

    return {
      kcal: +(targets.calories * ratio).toFixed(1),
      p: +(targets.protein * ratio).toFixed(1),
      f: +(targets.fat * ratio).toFixed(1),
      c: +(targets.carbs * ratio).toFixed(1)
    };
  }

  function calculateAmountForTargetMacro(food, targetValue, macroKey, extraTargetValue) {
    if (!food || !targetValue || targetValue <= 0) return null;

    const finalTargetValue = targetValue + (extraTargetValue || 0);

    if (food.unitType === "piece") {
      const perUnit = food.macrosPerUnit ? food.macrosPerUnit[macroKey] : 0;
      if (!perUnit || perUnit <= 0) return null;

      let amount = Math.round(finalTargetValue / perUnit);

      const maxByDefault = food.defaultAmount
        ? Math.max(food.defaultAmount, Math.round(food.defaultAmount * 1.35))
        : food.max;

      amount = Math.min(amount, maxByDefault);
      amount = Math.max(food.min, Math.min(food.max, amount));

      return {
        amount: amount,
        label: amount + " " + food.unitLabel,
        macros: getFoodMacros(food, amount)
      };
    }

    const per100 = food.macrosPer100 ? food.macrosPer100[macroKey] : 0;
    if (!per100 || per100 <= 0) return null;

    let amount = (finalTargetValue / per100) * 100;

    const maxByDefault = food.defaultAmount
      ? food.defaultAmount * 1.35
      : food.max;

    amount = Math.min(amount, maxByDefault);
    amount = normalizePortion(food, amount);

    return {
      amount: amount,
      label: amount + " " + food.unitLabel,
      macros: getFoodMacros(food, amount)
    };
  }

  function getBuilderRowsForMeal(category, mealKey, targetValue, selected) {
    const allowed = getAllowedIdsForMeal(mealKey);
    const allowedIds = allowed[category] || [];
    const selectedIds = (selected && selected[category]) || [];

    const foodsForMeal = selectedIds
      .map(getFoodById)
      .filter(Boolean)
      .filter(function (food) {
        if (!food.allowedMeals || !food.allowedMeals.length) return true;
        return food.allowedMeals.includes(mealKey);
      })
      .filter(function (food) {
        if (!allowedIds.length) return true;
        return allowedIds.includes(food.id) || category === "protein" || category === "carb" || category === "extra_carb" || category === "fat";
      });

    if (!foodsForMeal.length) return [];

    let targetForCategory = targetValue;

    if (category === "carb") {
      targetForCategory = targetValue * 0.75;
    }

    if (category === "extra_carb") {
      targetForCategory = targetValue * 0.25;
    }

    return foodsForMeal
      .map(function (food) {
        const calculated = calculateAmountForTargetMacro(
          food,
          targetForCategory,
          getMacroKeyByCategory(category)
        );

        if (!calculated) return null;

        return {
          id: food.id,
          name: food.name,
          amount: calculated.amount,
          unitLabel: food.unitLabel,
          label: calculated.label,
          macros: calculated.macros
        };
      })
      .filter(Boolean);
  }

  function getMealKeysForTargets(targets) {
    return getMealDistribution(targets.mealsCount).map(function (item) {
      return item.key;
    });
  }

  function buildEmptyMealSelections(targets) {
    const keys = getMealKeysForTargets(targets);
    const result = {};

    keys.forEach(function (mealKey) {
      result[mealKey] = {
        protein: {},
        carb: {},
        extra_carb: {},
        fat: {}
      };
    });

    return result;
  }

  function rebalanceSelectedMealsToTargets(meals, targets) {
    if (!meals || !meals.length || !targets) return meals;

    let totals = calculatePlanTotals(meals);
    let diffKcal = Math.round(targets.calories - totals.kcal);

    if (Math.abs(diffKcal) <= 40) return meals;

    const priorityMeals = ["breakfast", "lunch", "dinner"];

    priorityMeals.forEach(function (mealKey) {
      if (diffKcal <= 40) return;

      const meal = meals.find(function (item) {
        return item.mealKey === mealKey;
      });

      if (!meal) return;

      const carbItem = meal.items.find(function (item) {
        return item.category === "carb";
      });

      if (!carbItem) return;

      const food = getFoodById(carbItem.id);
      if (!food) return;

      const addStep = food.portionStep || 10;

      for (let i = 0; i < 2; i += 1) {
        totals = calculatePlanTotals(meals);
        diffKcal = Math.round(targets.calories - totals.kcal);

        if (diffKcal <= 40) break;
        if (carbItem.amount + addStep > food.max) break;

        carbItem.amount = normalizePortion(food, carbItem.amount + addStep);
        carbItem.macros = getFoodMacros(food, carbItem.amount);
        calculateMealTotals(meal);
      }
    });

    return meals;
  }

  function buildSelectedDaySummary(targets, selections, selected) {
    const daySelections = selections || {};
    const mealKeys = getMealKeysForTargets(targets);

    const selectedMeals = mealKeys.map(function (mealKey) {
      const mealSelection = daySelections[mealKey] || {};
      const meal = {
        mealKey: mealKey,
        mealName: mealNames[mealKey],
        items: [],
        totals: { kcal: 0, p: 0, f: 0, c: 0 }
      };

      ["protein", "carb", "extra_carb", "fat"].forEach(function (category) {
        const entries = getSelectionEntries(mealSelection[category]);

        entries.forEach(function (entry) {
          const food = getFoodById(entry.id);
          if (!food) return;

          const macroTargets = getMealMacroTargets(targets, mealKey);
          const targetValue = macroTargets[getMacroKeyByCategory(category)];
          let amount = entry.amount;

          if (!amount || amount <= 0) {
            const calculated = calculateAmountForTargetMacro(
              food,
              targetValue,
              getMacroKeyByCategory(category)
            );

            if (!calculated) return;
            amount = calculated.amount;
          }

          amount = normalizePortion(food, amount);

          meal.items.push({
            id: food.id,
            name: food.name,
            category: category,
            amount: amount,
            unitLabel: food.unitLabel,
            macros: getFoodMacros(food, amount)
          });
        });
      });

      if (mealKey === "lunch" || mealKey === "dinner") {
        const veg = pickSelectedVegetable(mealKey, selected);
        if (veg) {
          const amount = getDefaultAmountForMeal(veg, mealKey, targets.goal);
          meal.items.push({
            id: veg.id,
            name: veg.name,
            category: veg.category,
            amount: amount,
            unitLabel: veg.unitLabel,
            macros: getFoodMacros(veg, amount)
          });
        }
      }

      calculateMealTotals(meal);
      return meal;
    });

    rebalanceSelectedMealsToTargets(selectedMeals, targets);

    return {
      meals: selectedMeals,
      totals: calculatePlanTotals(selectedMeals)
    };
  }

  function formatSignedNutritionValue(value, formatter) {
    const rounded = Math.round(value);
    if (rounded === 0) return formatter(0);
    return (rounded > 0 ? "+" : "") + formatter(rounded);
  }

  function getNutritionAccuracyStatus(targets, totals) {
    const kcalDiff = totals.kcal - targets.calories;
    const kcalDiffAbs = Math.abs(kcalDiff);
    const kcalPercent = targets.calories ? (kcalDiffAbs / targets.calories) * 100 : 0;

    if (kcalPercent <= 3) {
      return {
        tone: "elite",
        title: "Точне попадання",
        text: "Раціон дуже близький до персональної цілі. Можна фіксувати цей варіант як робочий день."
      };
    }

    if (kcalPercent <= 7) {
      return {
        tone: "strong",
        title: kcalDiff > 0 ? "Невеликий перебір" : "Невеликий недобір",
        text: "Відхилення помірне. Для рекомпозиції краще підкоригувати одну порцію, а не перебудовувати весь день."
      };
    }

    return {
      tone: "alert",
      title: kcalDiff > 0 ? "Помітний перебір калорій" : "Помітний недобір калорій",
      text: kcalDiff > 0
        ? "Такий день може зірвати дефіцит або занадто прискорити набір. Зменш вуглеводи або жири в одному з прийомів."
        : "Такий день може погіршити відновлення, силу і контроль голоду. Додай вуглеводи або білково-вуглеводний прийом."
    };
  }

  function normalizeNutritionGoal(goalRaw) {
    const goal = String(goalRaw || "maintain").toLowerCase();
    if (goal === "recomp") return "recomp";
    if (goal === "cut") return "cut";
    if (goal === "gain") return "gain";
    return "maintain";
  }

  function normalizeNutritionProfile(value) {
    const profile = String(value || "fitness").toLowerCase();
    if (profile === "start") return "start";
    if (profile === "athlete") return "athlete";
    if (profile === "advanced") return "advanced";
    return "fitness";
  }

  function normalizeNutritionSex(value) {
    const sex = String(value || "").toLowerCase();
    if (sex === "female") return "female";
    return "male";
  }

  function normalizeLoadContext(value) {
    const context = String(value || "standard").toLowerCase();
    if (context === "heavy") return "heavy";
    if (context === "heat") return "heat";
    return "standard";
  }

  function getLoadContextLabel(context) {
    if (context === "heavy") return "Перед важкою сесією";
    if (context === "heat") return "Підвищене потовиділення";
    return "Стабільний день";
  }

  function getHydrationProtocol(context, waterLiters, saltGrams) {
    if (context === "heavy") {
      return {
        title: "Перед важкою сесією",
        text: "Раціон не зменшується. За 2-4 години до важкого навантаження тримай нормальну воду, сіль і вуглеводи; додатковий акцент робиться на електролітах, щоб тренування проходило комфортніше.",
        timing: "За 2-4 години: 500-700 мл води з їжею. За 30-60 хвилин: 250-400 мл води невеликими ковтками.",
        minerals: "Орієнтир: натрій із солі в межах добової норми, калій із продуктів, магній без перевищення індивідуальної переносимості.",
        waterLiters,
        saltGrams
      };
    }

    if (context === "heat") {
      return {
        title: "Підвищене потовиділення",
        text: "Калорії та вуглеводи залишаються стабільними. Додається контроль рідини й електролітів, бо сильне потовиділення може просаджувати самопочуття, тиск і якість роботи.",
        timing: "Пий частіше невеликими порціями, особливо до і після навантаження або сауни.",
        minerals: "Сіль і вода коригуються по потовиділенню, але без різких крайнощів. Якщо є тиск, набряки чи ниркові обмеження - орієнтир тільки через лікаря.",
        waterLiters,
        saltGrams
      };
    }

    return {
      title: "Стабільний день",
      text: "Калорії, білки, жири й вуглеводи не стрибають від дня до дня. Для набору це допомагає адаптувати травлення до більшого об'єму їжі, для схуднення - тримати прогнозований дефіцит.",
      timing: "Воду розподіляй рівно протягом дня, без різкого заливання перед навантаженням.",
      minerals: "Сіль не урізається під ціль. Головні зміни в раціоні робляться поступово через калорії та вуглеводи.",
      waterLiters,
      saltGrams
    };
  }

 function calculateNutrition(data) {
  const gender = normalizeNutritionSex(data.gender);
  const age = Number(data.age);
  const height = Number(data.height);
  const weight = Number(data.weight);
  const activity = Number(data.activity);
  const goal = normalizeNutritionGoal(data.goal);
  const profile = normalizeNutritionProfile(data["nutrition-profile"]);
  const loadContext = normalizeLoadContext(data["load-context"]);
  const manualMealsCount = Number(data["meals-count"]) || 4;
  const programPhase = data["program-phase"] || "adaptation";
  const progressWeek = Math.max(1, Math.min(4, Number(data["progress-week"]) || 1));

  if (!age || !height || !weight || !activity) return null;

  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  let calories = bmr * activity;

  if (goal === "cut") {
    calories -= 350;
  }

  if (goal === "recomp") {
    calories -= 120;
  }

  if (goal === "gain") {
    calories += 300;
  }

  calories = Math.max(1200, Math.round(calories));

  let proteinPerKg = 2.0;
  let fatPerKg = 0.9;

  if (goal === "cut") {
    proteinPerKg = 2.1;
    fatPerKg = 0.8;
  }

  if (goal === "recomp") {
    proteinPerKg = 2.2;
    fatPerKg = 0.85;
  }

  if (goal === "gain") {
    proteinPerKg = 1.9;
    fatPerKg = 1.0;
  }

  if (profile === "start") {
    proteinPerKg -= 0.1;
    fatPerKg += 0.05;
  }

  if (profile === "athlete") {
    proteinPerKg += 0.1;
  }

  if (profile === "advanced") {
    proteinPerKg += 0.15;
    fatPerKg = Math.max(0.75, fatPerKg - 0.05);
  }

  const protein = +(weight * proteinPerKg).toFixed(1);
  const fat = +(weight * fatPerKg).toFixed(1);
  let carbs = +Math.max(0, (calories - protein * 4 - fat * 9) / 4).toFixed(1);

  // ✅ Прогресія для набору після адаптації
  if (programPhase === "progression" && goal === "gain") {
    carbs = +(carbs + progressWeek * 30).toFixed(1);
    calories = Math.round(protein * 4 + fat * 9 + carbs * 4);
  }

  const activeCorrection = getStoredNutritionCorrection(goal);
  if (activeCorrection) {
    const corrected = applyNutritionCorrection({ calories, protein, fat, carbs }, activeCorrection);
    calories = corrected.calories;
    carbs = corrected.carbs;
  }

 const mealsCount = manualMealsCount;

  let waterLiters = weight * 0.034;
  if (loadContext === "heavy") waterLiters += 0.4;
  if (loadContext === "heat") waterLiters += 0.6;
  waterLiters = +waterLiters.toFixed(1);

  let saltGrams = weight * 0.050;
  if (goal === "gain") saltGrams = weight * 0.055;
  if (profile === "athlete" || profile === "advanced") saltGrams *= 1.05;
  if (loadContext === "heavy") saltGrams += 0.8;
  if (loadContext === "heat") saltGrams += 1.2;
  saltGrams = +saltGrams.toFixed(1);

  const hydrationProtocol = getHydrationProtocol(loadContext, waterLiters, saltGrams);

  return {
    calories,
    protein,
    fat,
    carbs,
    waterLiters,
    saltGrams,
    goal,
    profile,
    dayType: "stable",
    loadContext,
    loadContextLabel: getLoadContextLabel(loadContext),
    hydrationProtocol,
    mealsCount,
    programPhase,
    progressWeek,
    activeCorrection
  };
}

  function getDefaultSelection() {
    return clone(defaultSelection);
  }

  function getFoods() {
    return clone(getAllFoods());
  }

  function getMealNames() {
    return clone(mealNames);
  }

  function getAutoMealTemplates() {
    return clone(autoMealTemplates);
  }

  system.nutrition = {
    defaultSelection: defaultSelection,
    getDefaultSelection: getDefaultSelection,
    getFoods: getFoods,
    getMealNames: getMealNames,
    getAutoMealTemplates: getAutoMealTemplates,
    getFoodById: getFoodById,
    getFoodMacros: getFoodMacros,
    normalizePortion: normalizePortion,
    getFoodsByCategory: getFoodsByCategory,
    normalizePortion: normalizePortion,
    getFoodMacros: getFoodMacros,
    createMealItem: createMealItem,
    calculateMealTotals: calculateMealTotals,
    calculatePlanTotals: calculatePlanTotals,
    addMealItem: addMealItem,
    mealHas: mealHas,
    validateMeal: validateMeal,
    optimizeMealToCalories: optimizeMealToCalories,
    rebalancePlan: rebalancePlan,
    pickAutoTemplateFood: pickAutoTemplateFood,
    buildAutoMealFromTemplate: buildAutoMealFromTemplate,
    buildAutoMealPlan: buildAutoMealPlan,
    buildManualMealByKey: buildManualMealByKey,
    buildManualMealPlan: buildManualMealPlan,
    getMealDistribution: getMealDistribution,
    getManualMealDistribution: getManualMealDistribution,
    getAllowedIdsForMeal: getAllowedIdsForMeal,
    getDefaultAmountForMeal: getDefaultAmountForMeal,
    getMacroKeyByCategory: getMacroKeyByCategory,
    getMealMacroTargets: getMealMacroTargets,
    calculateAmountForTargetMacro: calculateAmountForTargetMacro,
    getBuilderRowsForMeal: getBuilderRowsForMeal,
    getMealKeysForTargets: getMealKeysForTargets,
    buildEmptyMealSelections: buildEmptyMealSelections,
    rebalanceSelectedMealsToTargets: rebalanceSelectedMealsToTargets,
    buildSelectedDaySummary: buildSelectedDaySummary,
    formatSignedNutritionValue: formatSignedNutritionValue,
    getNutritionAccuracyStatus: getNutritionAccuracyStatus,
    getStoredNutritionCorrection: getStoredNutritionCorrection,
    applyNutritionCorrection: applyNutritionCorrection,
    calculateNutrition: calculateNutrition
  };

  window.VitalRiseSystem = system;
})();



