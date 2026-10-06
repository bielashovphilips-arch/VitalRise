// USDA SR Legacy quality references; grams of fibre/saturated fat, milligrams of sodium.
(function () {
  const system = window.VitalRiseSystem || {};
  system.nutritionQualityData = {
  "eggs": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 3.126,
        "sodiumMg": 142.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171287/nutrients",
      "description": "Egg, whole, raw, fresh",
      "unitGrams": 50,
      "reference": true
    }
  },
  "chicken": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 1.01,
        "sodiumMg": 74.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171477/nutrients",
      "description": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.563,
        "sodiumMg": 45.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171077/nutrients",
      "description": "Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "turkey": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.593,
        "sodiumMg": 99.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171496/nutrients",
      "description": "Turkey, whole, breast, meat only, cooked, roasted",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.289,
        "sodiumMg": 113.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171098/nutrients",
      "description": "Turkey, whole, breast, meat only, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "oatmeal": {
    "ready": {
      "per100": {
        "fibreG": 1.7,
        "saturatedFatG": 0.31,
        "sodiumMg": 4.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173905/nutrients",
      "description": "Cereals, oats, regular and quick, unenriched, cooked with water (includes boiling and microwaving), without salt",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 10.1,
        "saturatedFatG": 1.11,
        "sodiumMg": 6.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173904/nutrients",
      "description": "Cereals, oats, regular and quick, not fortified, dry",
      "unitGrams": null,
      "reference": true
    }
  },
  "rice": {
    "ready": {
      "per100": {
        "fibreG": 0.4,
        "saturatedFatG": 0.077,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168878/nutrients",
      "description": "Rice, white, long-grain, regular, enriched, cooked",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 1.3,
        "saturatedFatG": 0.18,
        "sodiumMg": 5.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168877/nutrients",
      "description": "Rice, white, long-grain, regular, raw, enriched",
      "unitGrams": null,
      "reference": true
    }
  },
  "buckwheat": {
    "ready": {
      "per100": {
        "fibreG": 2.7,
        "saturatedFatG": 0.134,
        "sodiumMg": 4.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170686/nutrients",
      "description": "Buckwheat groats, roasted, cooked",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 10.3,
        "saturatedFatG": 0.591,
        "sodiumMg": 11.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170685/nutrients",
      "description": "Buckwheat groats, roasted, dry",
      "unitGrams": null,
      "reference": true
    }
  },
  "pasta": {
    "ready": {
      "per100": {
        "fibreG": 1.8,
        "saturatedFatG": 0.176,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169737/nutrients",
      "description": "Pasta, cooked, enriched, without added salt",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 3.2,
        "saturatedFatG": 0.277,
        "sodiumMg": 6.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169736/nutrients",
      "description": "Pasta, dry, enriched",
      "unitGrams": null,
      "reference": true
    }
  },
  "potato": {
    "ready": {
      "per100": {
        "fibreG": 1.8,
        "saturatedFatG": 0.026,
        "sodiumMg": 5.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170440/nutrients",
      "description": "Potatoes, boiled, cooked without skin, flesh, without salt",
      "unitGrams": null,
      "reference": true
    }
  },
  "sweet_potato": {
    "ready": {
      "per100": {
        "fibreG": 2.5,
        "saturatedFatG": 0.031,
        "sodiumMg": 27.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168484/nutrients",
      "description": "Sweet potato, cooked, boiled, without skin",
      "unitGrams": null,
      "reference": true
    }
  },
  "bulgur": {
    "ready": {
      "per100": {
        "fibreG": 4.5,
        "saturatedFatG": 0.042,
        "sodiumMg": 5.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170287/nutrients",
      "description": "Bulgur, cooked",
      "unitGrams": null,
      "reference": true
    }
  },
  "couscous": {
    "ready": {
      "per100": {
        "fibreG": 1.4,
        "saturatedFatG": 0.029,
        "sodiumMg": 5.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169700/nutrients",
      "description": "Couscous, cooked",
      "unitGrams": null,
      "reference": true
    }
  },
  "quinoa": {
    "ready": {
      "per100": {
        "fibreG": 2.8,
        "saturatedFatG": 0.231,
        "sodiumMg": 7.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168917/nutrients",
      "description": "Quinoa, cooked",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 7.0,
        "saturatedFatG": 0.706,
        "sodiumMg": 5.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168874/nutrients",
      "description": "Quinoa, uncooked",
      "unitGrams": null,
      "reference": true
    }
  },
  "lentils": {
    "ready": {
      "per100": {
        "fibreG": 7.9,
        "saturatedFatG": 0.053,
        "sodiumMg": 2.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172421/nutrients",
      "description": "Lentils, mature seeds, cooked, boiled, without salt",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 10.7,
        "saturatedFatG": 0.154,
        "sodiumMg": 6.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172420/nutrients",
      "description": "Lentils, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "beans": {
    "ready": {
      "per100": {
        "fibreG": 6.4,
        "saturatedFatG": 0.073,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173740/nutrients",
      "description": "Beans, kidney, all types, mature seeds, cooked, boiled, without salt",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 24.9,
        "saturatedFatG": 0.12,
        "sodiumMg": 24.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/175193/nutrients",
      "description": "Beans, kidney, all types, mature seeds, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "red_beans": {
    "ready": {
      "per100": {
        "fibreG": 9.3,
        "saturatedFatG": 0.014,
        "sodiumMg": 4.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173743/nutrients",
      "description": "Beans, kidney, california red, mature seeds, cooked, boiled, without salt",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 24.9,
        "saturatedFatG": 0.036,
        "sodiumMg": 11.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173742/nutrients",
      "description": "Beans, kidney, california red, mature seeds, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "chickpeas": {
    "ready": {
      "per100": {
        "fibreG": 7.6,
        "saturatedFatG": 0.269,
        "sodiumMg": 7.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173757/nutrients",
      "description": "Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 12.2,
        "saturatedFatG": 0.603,
        "sodiumMg": 24.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173756/nutrients",
      "description": "Chickpeas (garbanzo beans, bengal gram), mature seeds, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "mung_beans": {
    "ready": {
      "per100": {
        "fibreG": 7.6,
        "saturatedFatG": 0.116,
        "sodiumMg": 2.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/174257/nutrients",
      "description": "Mung beans, mature seeds, cooked, boiled, without salt",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 16.3,
        "saturatedFatG": 0.348,
        "sodiumMg": 15.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/174256/nutrients",
      "description": "Mung beans, mature seeds, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "split_peas": {
    "ready": {
      "per100": {
        "fibreG": 8.3,
        "saturatedFatG": 0.054,
        "sodiumMg": 2.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172429/nutrients",
      "description": "Peas, split, mature seeds, cooked, boiled, without salt",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 22.2,
        "saturatedFatG": 0.408,
        "sodiumMg": 5.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172428/nutrients",
      "description": "Peas, green, split, mature seeds, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "edamame": {
    "ready": {
      "per100": {
        "fibreG": 5.2,
        "saturatedFatG": 0.62,
        "sodiumMg": 6.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168411/nutrients",
      "description": "Edamame, frozen, prepared",
      "unitGrams": null,
      "reference": true
    }
  },
  "olive_oil": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 13.808,
        "sodiumMg": 2.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171413/nutrients",
      "description": "Oil, olive, salad or cooking",
      "unitGrams": null,
      "reference": true
    }
  },
  "avocado": {
    "ready": {
      "per100": {
        "fibreG": 6.7,
        "saturatedFatG": 2.126,
        "sodiumMg": 7.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171705/nutrients",
      "description": "Avocados, raw, all commercial varieties",
      "unitGrams": null,
      "reference": true
    }
  },
  "banana": {
    "ready": {
      "per100": {
        "fibreG": 2.6,
        "saturatedFatG": 0.112,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173944/nutrients",
      "description": "Bananas, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "apple": {
    "ready": {
      "per100": {
        "fibreG": 2.4,
        "saturatedFatG": 0.028,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171688/nutrients",
      "description": "Apples, raw, with skin (Includes foods for USDA's Food Distribution Program)",
      "unitGrams": null,
      "reference": true
    }
  },
  "whole_bread": {
    "ready": {
      "per100": {
        "fibreG": 6.0,
        "saturatedFatG": 0.722,
        "sodiumMg": 455.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172688/nutrients",
      "description": "Bread, whole-wheat, commercially prepared",
      "unitGrams": null,
      "reference": true
    }
  },
  "peanuts": {
    "ready": {
      "per100": {
        "fibreG": 8.5,
        "saturatedFatG": 6.279,
        "sodiumMg": 18.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172430/nutrients",
      "description": "Peanuts, all types, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "spinach": {
    "ready": {
      "per100": {
        "fibreG": 2.2,
        "saturatedFatG": 0.063,
        "sodiumMg": 79.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168462/nutrients",
      "description": "Spinach, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "broccoli": {
    "ready": {
      "per100": {
        "fibreG": 2.6,
        "saturatedFatG": 0.114,
        "sodiumMg": 33.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170379/nutrients",
      "description": "Broccoli, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "cucumber": {
    "ready": {
      "per100": {
        "fibreG": 0.5,
        "saturatedFatG": 0.037,
        "sodiumMg": 2.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168409/nutrients",
      "description": "Cucumber, with peel, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "tomato": {
    "ready": {
      "per100": {
        "fibreG": 1.2,
        "saturatedFatG": 0.028,
        "sodiumMg": 5.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170457/nutrients",
      "description": "Tomatoes, red, ripe, raw, year round average",
      "unitGrams": null,
      "reference": true
    }
  },
  "bell_pepper": {
    "ready": {
      "per100": {
        "fibreG": 2.1,
        "saturatedFatG": 0.059,
        "sodiumMg": 4.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170108/nutrients",
      "description": "Peppers, sweet, red, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "cabbage": {
    "ready": {
      "per100": {
        "fibreG": 2.5,
        "saturatedFatG": 0.034,
        "sodiumMg": 18.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169975/nutrients",
      "description": "Cabbage, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "carrot": {
    "ready": {
      "per100": {
        "fibreG": 2.8,
        "saturatedFatG": 0.032,
        "sodiumMg": 69.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170393/nutrients",
      "description": "Carrots, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "onion": {
    "ready": {
      "per100": {
        "fibreG": 1.7,
        "saturatedFatG": 0.042,
        "sodiumMg": 4.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170000/nutrients",
      "description": "Onions, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "beetroot": {
    "ready": {
      "per100": {
        "fibreG": 2.0,
        "saturatedFatG": 0.028,
        "sodiumMg": 77.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169146/nutrients",
      "description": "Beets, cooked, boiled, drained",
      "unitGrams": null,
      "reference": true
    }
  },
  "zucchini": {
    "ready": {
      "per100": {
        "fibreG": 1.0,
        "saturatedFatG": 0.084,
        "sodiumMg": 8.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169291/nutrients",
      "description": "Squash, summer, zucchini, includes skin, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "mushrooms": {
    "ready": {
      "per100": {
        "fibreG": 1.0,
        "saturatedFatG": 0.05,
        "sodiumMg": 5.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169251/nutrients",
      "description": "Mushrooms, white, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "cauliflower": {
    "ready": {
      "per100": {
        "fibreG": 2.0,
        "saturatedFatG": 0.13,
        "sodiumMg": 30.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169986/nutrients",
      "description": "Cauliflower, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "milk_whole": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 1.865,
        "sodiumMg": 43.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171265/nutrients",
      "description": "Milk, whole, 3.25% milkfat, with added vitamin D",
      "unitGrams": null,
      "reference": false
    }
  },
  "milk_2": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 1.257,
        "sodiumMg": 47.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171267/nutrients",
      "description": "Milk, reduced fat, fluid, 2% milkfat, with added vitamin A and vitamin D",
      "unitGrams": null,
      "reference": false
    }
  },
  "milk_1": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.633,
        "sodiumMg": 44.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170872/nutrients",
      "description": "Milk, lowfat, fluid, 1% milkfat, with added vitamin A and vitamin D",
      "unitGrams": null,
      "reference": false
    }
  },
  "yogurt_whole": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 2.096,
        "sodiumMg": 46.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171284/nutrients",
      "description": "Yogurt, plain, whole milk",
      "unitGrams": null,
      "reference": false
    }
  },
  "yogurt_lowfat": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 1.0,
        "sodiumMg": 70.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170886/nutrients",
      "description": "Yogurt, plain, low fat",
      "unitGrams": null,
      "reference": false
    }
  },
  "yogurt_nonfat": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.116,
        "sodiumMg": 77.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170887/nutrients",
      "description": "Yogurt, plain, skim milk",
      "unitGrams": null,
      "reference": false
    }
  },
  "kefir_lifeway": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.658,
        "sodiumMg": 40.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170904/nutrients",
      "description": "Kefir, lowfat, plain, LIFEWAY",
      "unitGrams": null,
      "reference": false
    }
  },
  "mozzarella": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 13.9,
        "sodiumMg": 486.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170845/nutrients",
      "description": "Cheese, mozzarella, whole milk",
      "unitGrams": null,
      "reference": false
    }
  },
  "feta": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 13.3,
        "sodiumMg": 1139.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173420/nutrients",
      "description": "Cheese, feta",
      "unitGrams": null,
      "reference": false
    }
  },
  "ricotta": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 6.42,
        "sodiumMg": 110.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170851/nutrients",
      "description": "Cheese, ricotta, whole milk",
      "unitGrams": null,
      "reference": false
    }
  },
  "sour_cream": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 10.14,
        "sodiumMg": 31.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171257/nutrients",
      "description": "Cream, sour, cultured",
      "unitGrams": null,
      "reference": false
    }
  },
  "millet": {
    "ready": {
      "per100": {
        "fibreG": 1.3,
        "saturatedFatG": 0.172,
        "sodiumMg": 2.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168871/nutrients",
      "description": "Millet, cooked",
      "unitGrams": null,
      "reference": false
    }
  },
  "pearl_barley": {
    "ready": {
      "per100": {
        "fibreG": 3.8,
        "saturatedFatG": 0.093,
        "sodiumMg": 3.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170285/nutrients",
      "description": "Barley, pearled, cooked",
      "unitGrams": null,
      "reference": false
    }
  },
  "rye_bread": {
    "ready": {
      "per100": {
        "fibreG": 5.8,
        "saturatedFatG": 0.626,
        "sodiumMg": 603.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172684/nutrients",
      "description": "Bread, rye",
      "unitGrams": null,
      "reference": false
    }
  },
  "pear": {
    "ready": {
      "per100": {
        "fibreG": 3.1,
        "saturatedFatG": 0.022,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169118/nutrients",
      "description": "Pears, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "orange": {
    "ready": {
      "per100": {
        "fibreG": 2.4,
        "saturatedFatG": 0.015,
        "sodiumMg": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169097/nutrients",
      "description": "Oranges, raw, all commercial varieties",
      "unitGrams": null,
      "reference": false
    }
  },
  "mandarin": {
    "ready": {
      "per100": {
        "fibreG": 1.8,
        "saturatedFatG": 0.039,
        "sodiumMg": 2.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169105/nutrients",
      "description": "Tangerines, (mandarin oranges), raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "peach": {
    "ready": {
      "per100": {
        "fibreG": 1.5,
        "saturatedFatG": 0.019,
        "sodiumMg": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169928/nutrients",
      "description": "Peaches, yellow, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "plum": {
    "ready": {
      "per100": {
        "fibreG": 1.4,
        "saturatedFatG": 0.017,
        "sodiumMg": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169949/nutrients",
      "description": "Plums, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "grapes": {
    "ready": {
      "per100": {
        "fibreG": 0.9,
        "saturatedFatG": 0.054,
        "sodiumMg": 2.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/174683/nutrients",
      "description": "Grapes, red or green (European type, such as Thompson seedless), raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "strawberry": {
    "ready": {
      "per100": {
        "fibreG": 2.0,
        "saturatedFatG": 0.015,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/167762/nutrients",
      "description": "Strawberries, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "blueberry": {
    "ready": {
      "per100": {
        "fibreG": 2.4,
        "saturatedFatG": 0.028,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171711/nutrients",
      "description": "Blueberries, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "sweet_cherry": {
    "ready": {
      "per100": {
        "fibreG": 2.1,
        "saturatedFatG": 0.038,
        "sodiumMg": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171719/nutrients",
      "description": "Cherries, sweet, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "apricot": {
    "ready": {
      "per100": {
        "fibreG": 2.0,
        "saturatedFatG": 0.027,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171697/nutrients",
      "description": "Apricots, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "kiwi": {
    "ready": {
      "per100": {
        "fibreG": 3.0,
        "saturatedFatG": 0.029,
        "sodiumMg": 3.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168153/nutrients",
      "description": "Kiwifruit, green, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "almonds": {
    "ready": {
      "per100": {
        "fibreG": 12.5,
        "saturatedFatG": 3.802,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170567/nutrients",
      "description": "Nuts, almonds",
      "unitGrams": null,
      "reference": false
    }
  },
  "walnuts": {
    "ready": {
      "per100": {
        "fibreG": 6.7,
        "saturatedFatG": 6.126,
        "sodiumMg": 2.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170187/nutrients",
      "description": "Nuts, walnuts, english",
      "unitGrams": null,
      "reference": false
    }
  },
  "hazelnuts": {
    "ready": {
      "per100": {
        "fibreG": 9.7,
        "saturatedFatG": 4.464,
        "sodiumMg": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170581/nutrients",
      "description": "Nuts, hazelnuts or filberts",
      "unitGrams": null,
      "reference": false
    }
  },
  "cashews": {
    "ready": {
      "per100": {
        "fibreG": 3.3,
        "saturatedFatG": 7.783,
        "sodiumMg": 12.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170162/nutrients",
      "description": "Nuts, cashew nuts, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "pistachios": {
    "ready": {
      "per100": {
        "fibreG": 10.6,
        "saturatedFatG": 5.907,
        "sodiumMg": 1.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170184/nutrients",
      "description": "Nuts, pistachio nuts, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "sunflower_seeds": {
    "ready": {
      "per100": {
        "fibreG": 8.6,
        "saturatedFatG": 4.455,
        "sodiumMg": 9.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170562/nutrients",
      "description": "Seeds, sunflower seed kernels, dried",
      "unitGrams": null,
      "reference": false
    }
  },
  "flaxseed": {
    "ready": {
      "per100": {
        "fibreG": 27.3,
        "saturatedFatG": 3.663,
        "sodiumMg": 30.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169414/nutrients",
      "description": "Seeds, flaxseed",
      "unitGrams": null,
      "reference": false
    }
  },
  "chia": {
    "ready": {
      "per100": {
        "fibreG": 34.4,
        "saturatedFatG": 3.33,
        "sodiumMg": 16.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170554/nutrients",
      "description": "Seeds, chia seeds, dried",
      "unitGrams": null,
      "reference": false
    }
  },
  "sunflower_oil": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 10.3,
        "sodiumMg": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171025/nutrients",
      "description": "Oil, sunflower, linoleic, (approx. 65%)",
      "unitGrams": null,
      "reference": false
    }
  },
  "hummus": {
    "ready": {
      "per100": {
        "fibreG": 4.0,
        "saturatedFatG": 1.141,
        "sodiumMg": 242.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172454/nutrients",
      "description": "Hummus, home prepared",
      "unitGrams": null,
      "reference": false
    }
  },
  "eggplant": {
    "ready": {
      "per100": {
        "fibreG": 3.0,
        "saturatedFatG": 0.034,
        "sodiumMg": 2.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169228/nutrients",
      "description": "Eggplant, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "romaine": {
    "ready": {
      "per100": {
        "fibreG": 2.1,
        "saturatedFatG": 0.039,
        "sodiumMg": 8.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169247/nutrients",
      "description": "Lettuce, cos or romaine, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "radish": {
    "ready": {
      "per100": {
        "fibreG": 1.6,
        "saturatedFatG": 0.032,
        "sodiumMg": 39.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169276/nutrients",
      "description": "Radishes, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "celery": {
    "ready": {
      "per100": {
        "fibreG": 1.6,
        "saturatedFatG": 0.042,
        "sodiumMg": 80.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169988/nutrients",
      "description": "Celery, raw",
      "unitGrams": null,
      "reference": false
    }
  }
};
  window.VitalRiseSystem = system;
})();
