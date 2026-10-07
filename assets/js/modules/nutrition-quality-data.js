// USDA / BLS 4.0 and fixed-mixture references; see docs/nutrition-micronutrients.md for attribution and units.
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
      "macrosPer100": {
        "kcal": 143.0,
        "p": 12.56,
        "f": 9.51,
        "c": 0.72
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
      "macrosPer100": {
        "f": 3.57,
        "c": 0.0,
        "kcal": 165.0,
        "p": 31.02
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
      "macrosPer100": {
        "f": 2.62,
        "kcal": 120.0,
        "p": 22.5,
        "c": 0.0
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
      "macrosPer100": {
        "p": 30.13,
        "f": 2.08,
        "kcal": 147.0,
        "c": 0.0
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
      "macrosPer100": {
        "kcal": 114.0,
        "f": 1.48,
        "p": 23.66,
        "c": 0.14
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171098/nutrients",
      "description": "Turkey, whole, breast, meat only, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "white_fish": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.168,
        "sodiumMg": 78.0
      },
      "macrosPer100": {
        "kcal": 105.0,
        "f": 0.86,
        "c": 0.0,
        "p": 22.83
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171956/nutrients",
      "description": "Fish, cod, Atlantic, cooked, dry heat",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.131,
        "sodiumMg": 54.0
      },
      "macrosPer100": {
        "kcal": 82.0,
        "p": 17.81,
        "f": 0.67,
        "c": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171955/nutrients",
      "description": "Fish, cod, Atlantic, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "greek_yogurt": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 2.395,
        "sodiumMg": 35.0
      },
      "macrosPer100": {
        "p": 9.0,
        "f": 5.0,
        "c": 3.98,
        "kcal": 97.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171304/nutrients",
      "description": "Yogurt, Greek, plain, whole milk",
      "unitGrams": null,
      "reference": true
    }
  },
  "salmon": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 2.397,
        "sodiumMg": 61.0
      },
      "macrosPer100": {
        "f": 12.35,
        "c": 0.0,
        "p": 22.1,
        "kcal": 206.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/175168/nutrients",
      "description": "Fish, salmon, Atlantic, farmed, cooked, dry heat",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 3.05,
        "sodiumMg": 59.0
      },
      "macrosPer100": {
        "kcal": 208.0,
        "f": 13.42,
        "p": 20.42,
        "c": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/175167/nutrients",
      "description": "Fish, salmon, Atlantic, farmed, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "mackerel": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 4.176,
        "sodiumMg": 83.0
      },
      "macrosPer100": {
        "p": 23.85,
        "f": 17.81,
        "c": 0.0,
        "kcal": 262.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/175120/nutrients",
      "description": "Fish, mackerel, Atlantic, cooked, dry heat",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 3.257,
        "sodiumMg": 90.0
      },
      "macrosPer100": {
        "f": 13.89,
        "c": 0.0,
        "kcal": 205.0,
        "p": 18.6
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/175119/nutrients",
      "description": "Fish, mackerel, Atlantic, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "tofu": {
    "ready": {
      "per100": {
        "fibreG": 2.3,
        "saturatedFatG": 1.261,
        "sodiumMg": 14.0
      },
      "macrosPer100": {
        "c": 2.78,
        "kcal": 144.0,
        "p": 17.27,
        "f": 8.72
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172475/nutrients",
      "description": "Tofu, raw, firm, prepared with calcium sulfate",
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
      "macrosPer100": {
        "p": 2.54,
        "f": 1.52,
        "c": 12.0,
        "kcal": 71.0
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
      "macrosPer100": {
        "f": 6.52,
        "c": 67.7,
        "kcal": 379.0,
        "p": 13.15
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
      "macrosPer100": {
        "f": 0.28,
        "c": 28.17,
        "kcal": 130.0,
        "p": 2.69
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169757/nutrients",
      "description": "Rice, white, long-grain, regular, unenriched, cooked without salt",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 1.3,
        "saturatedFatG": 0.18,
        "sodiumMg": 5.0
      },
      "macrosPer100": {
        "p": 7.13,
        "f": 0.66,
        "c": 79.95,
        "kcal": 365.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169756/nutrients",
      "description": "Rice, white, long-grain, regular, raw, unenriched",
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
      "macrosPer100": {
        "f": 0.62,
        "c": 19.94,
        "kcal": 92.0,
        "p": 3.38
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
      "macrosPer100": {
        "p": 11.73,
        "f": 2.71,
        "c": 74.95,
        "kcal": 346.0
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
      "macrosPer100": {
        "f": 0.93,
        "p": 5.8,
        "c": 30.86,
        "kcal": 158.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168928/nutrients",
      "description": "Pasta, cooked, unenriched, without added salt",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 3.2,
        "saturatedFatG": 0.277,
        "sodiumMg": 6.0
      },
      "macrosPer100": {
        "p": 13.04,
        "f": 1.51,
        "c": 74.67,
        "kcal": 371.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168927/nutrients",
      "description": "Pasta, dry, unenriched",
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
      "macrosPer100": {
        "c": 20.01,
        "kcal": 86.0,
        "f": 0.1,
        "p": 1.71
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
      "macrosPer100": {
        "c": 17.72,
        "kcal": 76.0,
        "p": 1.37,
        "f": 0.14
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
      "macrosPer100": {
        "p": 3.08,
        "f": 0.24,
        "c": 18.58,
        "kcal": 83.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170287/nutrients",
      "description": "Bulgur, cooked",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 12.5,
        "saturatedFatG": 0.232,
        "sodiumMg": 17.0
      },
      "macrosPer100": {
        "f": 1.33,
        "c": 75.87,
        "kcal": 342.0,
        "p": 12.29
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170688/nutrients",
      "description": "Bulgur, dry",
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
      "macrosPer100": {
        "f": 0.16,
        "c": 23.22,
        "kcal": 112.0,
        "p": 3.79
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169700/nutrients",
      "description": "Couscous, cooked",
      "unitGrams": null,
      "reference": true
    },
    "raw": {
      "per100": {
        "fibreG": 5.0,
        "saturatedFatG": 0.117,
        "sodiumMg": 10.0
      },
      "macrosPer100": {
        "p": 12.76,
        "f": 0.64,
        "c": 77.43,
        "kcal": 376.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169699/nutrients",
      "description": "Couscous, dry",
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
      "macrosPer100": {
        "p": 4.4,
        "f": 1.92,
        "c": 21.3,
        "kcal": 120.0
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
      "macrosPer100": {
        "p": 14.12,
        "f": 6.07,
        "c": 64.16,
        "kcal": 368.0
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
      "macrosPer100": {
        "c": 20.13,
        "kcal": 116.0,
        "p": 9.02,
        "f": 0.38
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
      "macrosPer100": {
        "f": 1.06,
        "p": 24.63,
        "c": 63.35,
        "kcal": 352.0
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
      "macrosPer100": {
        "kcal": 127.0,
        "f": 0.5,
        "c": 22.8,
        "p": 8.67
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
      "macrosPer100": {
        "c": 60.01,
        "kcal": 333.0,
        "f": 0.83,
        "p": 23.58
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
      "macrosPer100": {
        "f": 0.09,
        "c": 22.41,
        "kcal": 124.0,
        "p": 9.13
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
      "macrosPer100": {
        "p": 24.37,
        "f": 0.25,
        "c": 59.8,
        "kcal": 330.0
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
      "macrosPer100": {
        "c": 27.42,
        "kcal": 164.0,
        "f": 2.59,
        "p": 8.86
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
      "macrosPer100": {
        "c": 62.95,
        "kcal": 378.0,
        "p": 20.47,
        "f": 6.04
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
      "macrosPer100": {
        "c": 19.15,
        "kcal": 105.0,
        "f": 0.38,
        "p": 7.02
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
      "macrosPer100": {
        "c": 62.62,
        "kcal": 347.0,
        "p": 23.86,
        "f": 1.15
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
      "macrosPer100": {
        "c": 21.1,
        "kcal": 118.0,
        "p": 8.34,
        "f": 0.39
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
      "macrosPer100": {
        "p": 23.12,
        "f": 3.89,
        "c": 61.63,
        "kcal": 364.0
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
      "macrosPer100": {
        "f": 5.2,
        "c": 8.91,
        "kcal": 121.0,
        "p": 11.91
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
      "macrosPer100": {
        "f": 100.0,
        "c": 0.0,
        "kcal": 884.0,
        "p": 0.0
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
      "macrosPer100": {
        "p": 2.0,
        "f": 14.66,
        "c": 8.53,
        "kcal": 160.0
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
      "macrosPer100": {
        "c": 22.84,
        "kcal": 89.0,
        "p": 1.09,
        "f": 0.33
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
      "macrosPer100": {
        "c": 13.81,
        "kcal": 52.0,
        "f": 0.17,
        "p": 0.26
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
      "macrosPer100": {
        "f": 3.5,
        "c": 42.71,
        "kcal": 252.0,
        "p": 12.45
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
      "macrosPer100": {
        "p": 25.8,
        "f": 49.24,
        "c": 16.13,
        "kcal": 567.0
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
      "macrosPer100": {
        "p": 2.86,
        "f": 0.39,
        "c": 3.63,
        "kcal": 23.0
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
      "macrosPer100": {
        "c": 6.64,
        "kcal": 34.0,
        "f": 0.37,
        "p": 2.82
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
      "macrosPer100": {
        "c": 3.63,
        "kcal": 15.0,
        "f": 0.11,
        "p": 0.65
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
      "macrosPer100": {
        "c": 3.89,
        "kcal": 18.0,
        "f": 0.2,
        "p": 0.88
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
      "macrosPer100": {
        "kcal": 26.0,
        "c": 6.03,
        "p": 0.99,
        "f": 0.3
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
      "macrosPer100": {
        "f": 0.1,
        "c": 5.8,
        "kcal": 25.0,
        "p": 1.28
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
      "macrosPer100": {
        "p": 0.93,
        "f": 0.24,
        "c": 9.58,
        "kcal": 41.0
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
      "macrosPer100": {
        "f": 0.1,
        "c": 9.34,
        "kcal": 40.0,
        "p": 1.1
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
      "macrosPer100": {
        "p": 1.68,
        "f": 0.18,
        "c": 9.96,
        "kcal": 44.0
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
      "macrosPer100": {
        "f": 0.32,
        "c": 3.11,
        "kcal": 17.0,
        "p": 1.21
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
      "macrosPer100": {
        "f": 0.34,
        "p": 3.09,
        "c": 3.26,
        "kcal": 22.0
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
      "macrosPer100": {
        "c": 4.97,
        "kcal": 25.0,
        "p": 1.92,
        "f": 0.28
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169986/nutrients",
      "description": "Cauliflower, raw",
      "unitGrams": null,
      "reference": true
    }
  },
  "hard_cheese": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 18.867,
        "sodiumMg": 653.0
      },
      "macrosPer100": {
        "c": 3.37,
        "kcal": 403.0,
        "p": 22.87,
        "f": 33.31
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173414/nutrients",
      "description": "Cheese, cheddar (Includes foods for USDA's Food Distribution Program)",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Твердий сир чедер",
        "en": "Cheddar cheese",
        "ru": "Твёрдый сыр чеддер"
      }
    }
  },
  "beef": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 2.99,
        "sodiumMg": 56.0
      },
      "macrosPer100": {
        "f": 7.49,
        "c": 0.0,
        "kcal": 177.0,
        "p": 27.51
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/174004/nutrients",
      "description": "Beef, loin, tenderloin roast, boneless, separable lean only, trimmed to 0\" fat, all grades, cooked, roasted",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Яловича вирізка без видимого жиру",
        "en": "Lean beef tenderloin",
        "ru": "Говяжья вырезка без видимого жира"
      },
      "weightState": "cooked"
    },
    "raw": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 1.956,
        "sodiumMg": 44.0
      },
      "macrosPer100": {
        "p": 21.94,
        "f": 5.74,
        "c": 0.0,
        "kcal": 139.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171765/nutrients",
      "description": "Beef, loin, tenderloin roast, boneless, separable lean only, trimmed to 0\" fat, all grades, raw",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Яловича вирізка без видимого жиру",
        "en": "Lean beef tenderloin",
        "ru": "Говяжья вырезка без видимого жира"
      }
    }
  },
  "tuna": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.205,
        "sodiumMg": 54.0
      },
      "macrosPer100": {
        "p": 29.15,
        "f": 0.59,
        "c": 0.0,
        "kcal": 130.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172006/nutrients",
      "description": "Fish, tuna, yellowfin, fresh, cooked, dry heat",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Тунець жовтоперий",
        "en": "Yellowfin tuna",
        "ru": "Тунец желтопёрый"
      },
      "weightState": "cooked"
    },
    "raw": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.172,
        "sodiumMg": 45.0
      },
      "macrosPer100": {
        "f": 0.49,
        "kcal": 109.0,
        "p": 24.4,
        "c": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/175159/nutrients",
      "description": "Fish, tuna, fresh, yellowfin, raw",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Тунець жовтоперий",
        "en": "Yellowfin tuna",
        "ru": "Тунец желтопёрый"
      }
    }
  },
  "chicken_thigh": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 2.311,
        "sodiumMg": 106.0
      },
      "macrosPer100": {
        "p": 24.76,
        "f": 8.15,
        "kcal": 179.0,
        "c": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172388/nutrients",
      "description": "Chicken, broilers or fryers, thigh, meat only, cooked, roasted",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Куряче стегно без шкіри й кістки",
        "en": "Boneless skinless chicken thigh",
        "ru": "Куриное бедро без кожи и кости"
      },
      "weightState": "cooked"
    },
    "raw": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 1.097,
        "sodiumMg": 95.0
      },
      "macrosPer100": {
        "kcal": 121.0,
        "f": 4.12,
        "p": 19.66,
        "c": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173627/nutrients",
      "description": "Chicken, broilers or fryers, dark meat, thigh, meat only, raw",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Куряче стегно без шкіри й кістки",
        "en": "Boneless skinless chicken thigh",
        "ru": "Куриное бедро без кожи и кости"
      }
    }
  },
  "whey_protein": {
    "ready": {
      "per100": {
        "fibreG": 3.1,
        "saturatedFatG": 0.781,
        "sodiumMg": 156.0
      },
      "macrosPer100": {
        "p": 78.13,
        "f": 1.56,
        "c": 6.25,
        "kcal": 352.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173180/nutrients",
      "description": "Beverages, Protein powder whey based",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Сироватковий протеїн · довідковий склад",
        "en": "Whey protein · reference formula",
        "ru": "Сывороточный протеин · справочный состав"
      }
    }
  },
  "butter": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 50.489,
        "sodiumMg": 11.0
      },
      "macrosPer100": {
        "kcal": 717.0,
        "f": 81.11,
        "c": 0.06,
        "p": 0.85
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173430/nutrients",
      "description": "Butter, without salt",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Вершкове масло без солі",
        "en": "Unsalted butter",
        "ru": "Сливочное масло без соли"
      }
    }
  },
  "peanut_butter": {
    "ready": {
      "per100": {
        "fibreG": 5.0,
        "saturatedFatG": 10.325,
        "sodiumMg": 17.0
      },
      "macrosPer100": {
        "p": 22.21,
        "f": 51.36,
        "c": 22.31,
        "kcal": 598.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172470/nutrients",
      "description": "Peanut butter, smooth style, without salt",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Арахісова паста гладка, без солі",
        "en": "Smooth unsalted peanut butter",
        "ru": "Арахисовая паста гладкая, без соли"
      }
    }
  },
  "nuts": {
    "ready": {
      "per100": {
        "fibreG": 9.6,
        "saturatedFatG": 4.964,
        "sodiumMg": 1.5
      },
      "macrosPer100": {
        "p": 18.19,
        "f": 57.57,
        "c": 17.63,
        "kcal": 616.5
      },
      "sourceUrl": "https://fdc.nal.usda.gov/",
      "description": "Calculated fresh mixture: almonds 50%, walnuts 50%; no added oil or salt",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Горіховий мікс: мигдаль і волоські 1:1",
        "en": "Nut mix: almonds and walnuts 1:1",
        "ru": "Ореховый микс: миндаль и грецкие 1:1"
      }
    }
  },
  "seeds": {
    "ready": {
      "per100": {
        "fibreG": 7.3,
        "saturatedFatG": 6.557,
        "sodiumMg": 8.0
      },
      "macrosPer100": {
        "p": 25.505,
        "f": 50.255,
        "c": 15.355,
        "kcal": 571.5
      },
      "sourceUrl": "https://fdc.nal.usda.gov/",
      "description": "Calculated fresh mixture: sunflower_seeds 50%, pumpkin_seeds 50%; no added oil or salt",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Насіння: соняшникове й гарбузове 1:1",
        "en": "Seeds: sunflower and pumpkin 1:1",
        "ru": "Семена: подсолнечные и тыквенные 1:1"
      }
    }
  },
  "shrimp": {
    "ready": {
      "per100": {
        "fibreG": null,
        "saturatedFatG": 0.056,
        "sodiumMg": 111.0
      },
      "macrosPer100": {
        "p": 23.98,
        "f": 0.28,
        "c": 0.2,
        "kcal": 99.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/175180/nutrients",
      "description": "Crustaceans, shrimp, cooked",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Креветки очищені, варені без солі",
        "en": "Peeled shrimp, cooked without salt",
        "ru": "Креветки очищенные, варёные без соли"
      },
      "weightState": "cooked"
    },
    "raw": {
      "per100": {
        "fibreG": null,
        "saturatedFatG": 0.101,
        "sodiumMg": 119.0
      },
      "macrosPer100": {
        "f": 0.51,
        "c": 0.0,
        "kcal": 85.0,
        "p": 20.1
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/175179/nutrients",
      "description": "Crustaceans, shrimp, raw",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Креветки очищені, сирі",
        "en": "Peeled shrimp, raw",
        "ru": "Креветки очищенные, сырые"
      }
    }
  },
  "pork_tenderloin": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 1.198,
        "sodiumMg": 57.0
      },
      "macrosPer100": {
        "p": 26.17,
        "f": 3.51,
        "kcal": 143.0,
        "c": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168250/nutrients",
      "description": "Pork, fresh, loin, tenderloin, separable lean only, cooked, roasted",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Свиняча вирізка без видимого жиру",
        "en": "Lean pork tenderloin",
        "ru": "Свиная вырезка без видимого жира"
      },
      "weightState": "cooked"
    },
    "raw": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.698,
        "sodiumMg": 53.0
      },
      "macrosPer100": {
        "f": 2.17,
        "p": 20.95,
        "kcal": 109.0,
        "c": 0.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168249/nutrients",
      "description": "Pork, fresh, loin, tenderloin, separable lean only, raw",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Свиняча вирізка без видимого жиру",
        "en": "Lean pork tenderloin",
        "ru": "Свиная вырезка без видимого жира"
      }
    }
  },
  "berries": {
    "ready": {
      "per100": {
        "fibreG": 6.5,
        "saturatedFatG": 0.019,
        "sodiumMg": 1.0
      },
      "macrosPer100": {
        "c": 11.94,
        "kcal": 52.0,
        "f": 0.65,
        "p": 1.2
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/167755/nutrients",
      "description": "Raspberries, raw",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Малина свіжа",
        "en": "Fresh raspberries",
        "ru": "Малина свежая"
      },
      "weightState": "fresh"
    }
  },
  "rice_cakes": {
    "ready": {
      "per100": {
        "fibreG": 4.2,
        "saturatedFatG": 0.57,
        "sodiumMg": 26.0
      },
      "macrosPer100": {
        "f": 2.8,
        "c": 81.5,
        "kcal": 387.0,
        "p": 8.2
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170250/nutrients",
      "description": "Snacks, rice cakes, brown rice, plain, unsalted",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Рисові хлібці цільнозернові без солі",
        "en": "Plain unsalted brown rice cakes",
        "ru": "Рисовые хлебцы цельнозерновые без соли"
      }
    }
  },
  "honey": {
    "ready": {
      "per100": {
        "fibreG": 0.2,
        "saturatedFatG": 0.0,
        "sodiumMg": 4.0
      },
      "macrosPer100": {
        "p": 0.3,
        "f": 0.0,
        "c": 82.4,
        "kcal": 304.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169640/nutrients",
      "description": "Honey",
      "unitGrams": null,
      "reference": true
    }
  },
  "jam": {
    "ready": {
      "per100": {
        "fibreG": 1.1,
        "saturatedFatG": 0.01,
        "sodiumMg": 32.0
      },
      "macrosPer100": {
        "p": 0.37,
        "f": 0.07,
        "c": 68.86,
        "kcal": 278.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169641/nutrients",
      "description": "Jams and preserves",
      "unitGrams": null,
      "reference": true
    }
  },
  "dates": {
    "ready": {
      "per100": {
        "fibreG": 8.0,
        "saturatedFatG": 0.032,
        "sodiumMg": 2.0
      },
      "macrosPer100": {
        "c": 75.03,
        "kcal": 282.0,
        "f": 0.39,
        "p": 2.45
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/171726/nutrients",
      "description": "Dates, deglet noor",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Фініки деглет нур",
        "en": "Deglet Noor dates",
        "ru": "Финики деглет нур"
      }
    }
  },
  "raisins": {
    "ready": {
      "per100": {
        "fibreG": 4.5,
        "saturatedFatG": 0.094,
        "sodiumMg": 26.0
      },
      "macrosPer100": {
        "p": 3.3,
        "f": 0.25,
        "c": 79.32,
        "kcal": 299.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168165/nutrients",
      "description": "Raisins, dark, seedless (Includes foods for USDA's Food Distribution Program)",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Родзинки темні без кісточок",
        "en": "Dark seedless raisins",
        "ru": "Изюм тёмный без косточек"
      }
    }
  },
  "tortilla": {
    "ready": {
      "per100": {
        "fibreG": 2.4,
        "saturatedFatG": 1.225,
        "sodiumMg": 742.0
      },
      "macrosPer100": {
        "f": 7.58,
        "c": 49.27,
        "kcal": 297.0,
        "p": 8.01
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/167535/nutrients",
      "description": "Tortillas, ready-to-bake or -fry, flour, shelf stable",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Тортилья пшенична",
        "en": "Wheat flour tortilla",
        "ru": "Тортилья пшеничная"
      }
    }
  },
  "fruit_juice": {
    "ready": {
      "per100": {
        "fibreG": 0.20964694,
        "saturatedFatG": 0.02515763,
        "sodiumMg": 1.0482347
      },
      "macrosPer100": {
        "p": 0.73376429,
        "f": 0.20964694,
        "c": 10.90164092,
        "kcal": 47.17056167
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169098/nutrients",
      "description": "Orange juice, raw (Includes foods for USDA's Food Distribution Program); per 100 ml (USDA fluid-ounce mass conversion)",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Апельсиновий сік свіжий",
        "en": "Fresh orange juice",
        "ru": "Апельсиновый сок свежий"
      }
    }
  },
  "pumpkin_seeds": {
    "ready": {
      "per100": {
        "fibreG": 6.0,
        "saturatedFatG": 8.659,
        "sodiumMg": 7.0
      },
      "macrosPer100": {
        "c": 10.71,
        "kcal": 559.0,
        "p": 30.23,
        "f": 49.05
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170556/nutrients",
      "description": "Seeds, pumpkin and squash seed kernels, dried",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Гарбузове насіння очищене, сушене",
        "en": "Dried pumpkin seed kernels",
        "ru": "Тыквенные семечки очищенные, сушёные"
      }
    }
  },
  "dark_chocolate": {
    "ready": {
      "per100": {
        "fibreG": 10.9,
        "saturatedFatG": 24.489,
        "sodiumMg": 20.0
      },
      "macrosPer100": {
        "f": 42.63,
        "c": 45.9,
        "kcal": 598.0,
        "p": 7.79
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170273/nutrients",
      "description": "Chocolate, dark, 70-85% cacao solids",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Чорний шоколад 70–85%",
        "en": "Dark chocolate 70–85% cacao",
        "ru": "Тёмный шоколад 70–85%"
      }
    }
  },
  "green_peas": {
    "ready": {
      "per100": {
        "fibreG": 5.5,
        "saturatedFatG": 0.039,
        "sodiumMg": 3.0
      },
      "macrosPer100": {
        "c": 15.63,
        "kcal": 84.0,
        "f": 0.22,
        "p": 5.36
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170420/nutrients",
      "description": "Peas, green, cooked, boiled, drained, without salt",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Зелений горошок варений без солі",
        "en": "Green peas, boiled without salt",
        "ru": "Зелёный горошек варёный без соли"
      },
      "weightState": "cooked"
    },
    "raw": {
      "per100": {
        "fibreG": 5.7,
        "saturatedFatG": 0.071,
        "sodiumMg": 5.0
      },
      "macrosPer100": {
        "c": 14.45,
        "kcal": 81.0,
        "p": 5.42,
        "f": 0.4
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170419/nutrients",
      "description": "Peas, green, raw",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Зелений горошок сирий",
        "en": "Green peas, raw",
        "ru": "Зелёный горошек сырой"
      }
    }
  },
  "tempeh": {
    "ready": {
      "per100": {
        "fibreG": null,
        "saturatedFatG": 3.4,
        "sodiumMg": 14.0
      },
      "macrosPer100": {
        "p": 19.91,
        "c": 7.62,
        "kcal": 195.0,
        "f": 11.38
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172467/nutrients",
      "description": "Tempeh, cooked",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Темпе готовий",
        "en": "Cooked tempeh",
        "ru": "Темпе готовый"
      },
      "weightState": "cooked"
    },
    "raw": {
      "per100": {
        "fibreG": null,
        "saturatedFatG": 2.539,
        "sodiumMg": 9.0
      },
      "macrosPer100": {
        "p": 20.29,
        "c": 7.64,
        "kcal": 192.0,
        "f": 10.8
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/174272/nutrients",
      "description": "Tempeh",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Темпе сирий",
        "en": "Raw tempeh",
        "ru": "Темпе сырой"
      }
    }
  },
  "asparagus": {
    "ready": {
      "per100": {
        "fibreG": 2.1,
        "saturatedFatG": 0.04,
        "sodiumMg": 2.0
      },
      "macrosPer100": {
        "p": 2.2,
        "c": 3.88,
        "kcal": 20.0,
        "f": 0.12
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/168389/nutrients",
      "description": "Asparagus, raw",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Спаржа свіжа",
        "en": "Fresh asparagus",
        "ru": "Спаржа свежая"
      },
      "weightState": "fresh"
    }
  },
  "green_beans": {
    "ready": {
      "per100": {
        "fibreG": 3.2,
        "saturatedFatG": 0.064,
        "sodiumMg": 1.0
      },
      "macrosPer100": {
        "c": 7.88,
        "kcal": 35.0,
        "p": 1.89,
        "f": 0.28
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169141/nutrients",
      "description": "Beans, snap, green, cooked, boiled, drained, without salt",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Стручкова квасоля варена без солі",
        "en": "Green beans, boiled without salt",
        "ru": "Стручковая фасоль варёная без соли"
      },
      "weightState": "cooked"
    },
    "raw": {
      "per100": {
        "fibreG": 2.7,
        "saturatedFatG": 0.05,
        "sodiumMg": 6.0
      },
      "macrosPer100": {
        "f": 0.22,
        "p": 1.83,
        "c": 6.97,
        "kcal": 31.0
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169961/nutrients",
      "description": "Beans, snap, green, raw",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Стручкова квасоля сира",
        "en": "Green beans, raw",
        "ru": "Стручковая фасоль сырая"
      }
    }
  },
  "frozen_vegetables": {
    "ready": {
      "per100": {
        "fibreG": 4.4,
        "saturatedFatG": 0.031,
        "sodiumMg": 35.0
      },
      "macrosPer100": {
        "c": 13.09,
        "kcal": 65.0,
        "p": 2.86,
        "f": 0.15
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170472/nutrients",
      "description": "Vegetables, mixed, frozen, cooked, boiled, drained, without salt",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Овочева суміш варена без солі · кукурудза, бобові, морква",
        "en": "Mixed vegetables, boiled without salt · corn, beans, peas, carrots",
        "ru": "Овощная смесь варёная без соли · кукуруза, бобовые, морковь"
      },
      "weightState": "cooked"
    },
    "raw": {
      "per100": {
        "fibreG": 4.0,
        "saturatedFatG": 0.098,
        "sodiumMg": 47.0
      },
      "macrosPer100": {
        "c": 13.47,
        "kcal": 72.0,
        "f": 0.52,
        "p": 3.33
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/170471/nutrients",
      "description": "Vegetables, mixed, frozen, unprepared",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Овочева суміш сира · кукурудза, бобові, морква",
        "en": "Mixed vegetables, raw · corn, beans, peas, carrots",
        "ru": "Овощная смесь сырая · кукуруза, бобовые, морковь"
      }
    }
  },
  "milk_whole": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 1.865,
        "sodiumMg": 43.0
      },
      "macrosPer100": {
        "c": 4.78,
        "kcal": 61.0,
        "f": 3.27,
        "p": 3.15
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172217/nutrients",
      "description": "Milk, whole, 3.25% milkfat, without added vitamin A and vitamin D",
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
      "macrosPer100": {
        "c": 4.8,
        "kcal": 50.0,
        "f": 1.98,
        "p": 3.3
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/172205/nutrients",
      "description": "Milk, reduced fat, fluid, 2% milkfat, without added vitamin A and vitamin D",
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
      "macrosPer100": {
        "c": 4.99,
        "kcal": 42.0,
        "p": 3.37,
        "f": 0.97
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/173441/nutrients",
      "description": "Milk, fluid, 1% fat, without added vitamin A and vitamin D",
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
      "macrosPer100": {
        "kcal": 61.0,
        "p": 3.47,
        "f": 3.25,
        "c": 4.66
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
      "macrosPer100": {
        "kcal": 63.0,
        "f": 1.55,
        "c": 7.04,
        "p": 5.25
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
      "macrosPer100": {
        "kcal": 56.0,
        "p": 5.73,
        "f": 0.18,
        "c": 7.68
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
      "macrosPer100": {
        "p": 3.79,
        "f": 1.02,
        "c": 4.77,
        "kcal": 43.0
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
      "macrosPer100": {
        "p": 22.17,
        "f": 22.14,
        "c": 2.4,
        "kcal": 299.0
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
      "macrosPer100": {
        "f": 21.49,
        "c": 3.88,
        "kcal": 265.0,
        "p": 14.21
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
      "macrosPer100": {
        "p": 7.54,
        "f": 10.18,
        "c": 7.27,
        "kcal": 150.0
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
      "macrosPer100": {
        "p": 2.44,
        "f": 19.35,
        "c": 4.63,
        "kcal": 198.0
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
      "macrosPer100": {
        "p": 3.51,
        "f": 1.0,
        "c": 23.67,
        "kcal": 119.0
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
      "macrosPer100": {
        "kcal": 123.0,
        "p": 2.26,
        "f": 0.44,
        "c": 28.22
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
      "macrosPer100": {
        "kcal": 259.0,
        "p": 8.5,
        "f": 3.3,
        "c": 48.3
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
      "macrosPer100": {
        "f": 0.14,
        "c": 15.23,
        "kcal": 57.0,
        "p": 0.36
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
      "macrosPer100": {
        "f": 0.12,
        "c": 11.75,
        "kcal": 47.0,
        "p": 0.94
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
      "macrosPer100": {
        "f": 0.31,
        "c": 13.34,
        "kcal": 53.0,
        "p": 0.81
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
      "macrosPer100": {
        "c": 9.54,
        "kcal": 39.0,
        "p": 0.91,
        "f": 0.25
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
      "macrosPer100": {
        "c": 11.42,
        "kcal": 46.0,
        "p": 0.7,
        "f": 0.28
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
      "macrosPer100": {
        "f": 0.16,
        "p": 0.72,
        "c": 18.1,
        "kcal": 69.0
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
      "macrosPer100": {
        "f": 0.3,
        "p": 0.67,
        "c": 7.68,
        "kcal": 32.0
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
      "macrosPer100": {
        "c": 14.49,
        "kcal": 57.0,
        "f": 0.33,
        "p": 0.74
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
      "macrosPer100": {
        "c": 16.01,
        "kcal": 63.0,
        "f": 0.2,
        "p": 1.06
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
      "macrosPer100": {
        "p": 1.4,
        "f": 0.39,
        "c": 11.12,
        "kcal": 48.0
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
      "macrosPer100": {
        "p": 1.14,
        "f": 0.52,
        "c": 14.66,
        "kcal": 61.0
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
      "macrosPer100": {
        "p": 21.15,
        "f": 49.93,
        "c": 21.55,
        "kcal": 579.0
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
      "macrosPer100": {
        "c": 13.71,
        "kcal": 654.0,
        "p": 15.23,
        "f": 65.21
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
      "macrosPer100": {
        "c": 16.7,
        "kcal": 628.0,
        "f": 60.75,
        "p": 14.95
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
      "macrosPer100": {
        "p": 18.22,
        "f": 43.85,
        "c": 30.19,
        "kcal": 553.0
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
      "macrosPer100": {
        "f": 45.32,
        "c": 27.17,
        "kcal": 560.0,
        "p": 20.16
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
      "macrosPer100": {
        "p": 20.78,
        "f": 51.46,
        "c": 20.0,
        "kcal": 584.0
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
      "macrosPer100": {
        "f": 42.16,
        "p": 18.29,
        "c": 28.88,
        "kcal": 534.0
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
      "macrosPer100": {
        "p": 16.54,
        "f": 30.74,
        "c": 42.12,
        "kcal": 486.0
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
      "macrosPer100": {
        "p": 0.0,
        "f": 100.0,
        "c": 0.0,
        "kcal": 884.0
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
      "macrosPer100": {
        "f": 8.59,
        "p": 4.86,
        "c": 20.12,
        "kcal": 177.0
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
      "macrosPer100": {
        "f": 0.18,
        "c": 5.88,
        "kcal": 25.0,
        "p": 0.98
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
      "macrosPer100": {
        "c": 3.29,
        "kcal": 17.0,
        "f": 0.3,
        "p": 1.23
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
      "macrosPer100": {
        "c": 3.4,
        "kcal": 16.0,
        "p": 0.68,
        "f": 0.1
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
      "macrosPer100": {
        "kcal": 14.0,
        "c": 2.97,
        "f": 0.17,
        "p": 0.69
      },
      "sourceUrl": "https://fdc.nal.usda.gov/food-details/169988/nutrients",
      "description": "Celery, raw",
      "unitGrams": null,
      "reference": false
    }
  },
  "cottage_cheese": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 2.762,
        "sodiumMg": 35.0
      },
      "macrosPer100": {
        "p": 12.245,
        "f": 5.1,
        "c": 3.04,
        "kcal": 110.0
      },
      "sourceUrl": "https://blsdb.prod.se.ble.de/download",
      "description": "Max Rubner-Institut, BLS 4.0 (2025), CC BY 4.0, DOI 10.25826/Data20251217-134202-0; M713300: Quark 20 % fat in dry matter",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Сир кисломолочний ≈5% (кварк)",
        "en": "Quark ≈5% fat",
        "ru": "Творог ≈5% (кварк)"
      }
    }
  },
  "cottage_cheese_lowfat": {
    "ready": {
      "per100": {
        "fibreG": 0.0,
        "saturatedFatG": 0.114,
        "sodiumMg": 33.6
      },
      "macrosPer100": {
        "p": 11.85,
        "f": 0.18,
        "c": 3.68,
        "kcal": 66.0
      },
      "sourceUrl": "https://blsdb.prod.se.ble.de/download",
      "description": "Max Rubner-Institut, BLS 4.0 (2025), CC BY 4.0, DOI 10.25826/Data20251217-134202-0; M713100: Quark < 10 % fat in dry matter",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Сир кисломолочний ≈0,2% (кварк)",
        "en": "Quark ≈0.2% fat",
        "ru": "Творог ≈0,2% (кварк)"
      }
    }
  },
  "skyr": {
    "ready": {
      "per100": {
        "fibreG": 0.18,
        "saturatedFatG": 0.47,
        "sodiumMg": 33.3
      },
      "macrosPer100": {
        "p": 10.35,
        "f": 0.84,
        "c": 3.19,
        "kcal": 64.0
      },
      "sourceUrl": "https://blsdb.prod.se.ble.de/download",
      "description": "Max Rubner-Institut, BLS 4.0 (2025), CC BY 4.0, DOI 10.25826/Data20251217-134202-0; M710100: Skyr Icelandic style strained yogurt < 10 % fat in dry matter",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Скір натуральний ≈0,8%",
        "en": "Plain skyr ≈0.8% fat",
        "ru": "Скир натуральный ≈0,8%"
      }
    }
  },
  "seitan": {
    "ready": {
      "per100": {
        "fibreG": 2.1,
        "saturatedFatG": 0.651,
        "sodiumMg": 652.5
      },
      "macrosPer100": {
        "p": 28.4,
        "f": 7.2,
        "c": 4.0,
        "kcal": 199.0
      },
      "sourceUrl": "https://blsdb.prod.se.ble.de/download",
      "description": "Max Rubner-Institut, BLS 4.0 (2025), CC BY 4.0, DOI 10.25826/Data20251217-134202-0; C558000: Meat substitute containing gluten (seitan)",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Сейтан · довідковий склад",
        "en": "Seitan · reference formula",
        "ru": "Сейтан · справочный состав"
      }
    }
  },
  "soy_mince": {
    "ready": {
      "per100": {
        "fibreG": 5.31,
        "saturatedFatG": 0.28,
        "sodiumMg": 2.3
      },
      "macrosPer100": {
        "p": 14.17,
        "f": 1.8,
        "c": 3.96,
        "kcal": 99.0
      },
      "sourceUrl": "https://blsdb.prod.se.ble.de/download",
      "description": "Max Rubner-Institut, BLS 4.0 (2025), CC BY 4.0, DOI 10.25826/Data20251217-134202-0; H765082: Plant-based mince, made from texturised soya protein, plain, soaked, fried without fat (pan)",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Соєвий фарш розмочений, готовий без олії",
        "en": "Textured soy mince, hydrated, cooked without oil",
        "ru": "Соевый фарш размоченный, готовый без масла"
      },
      "rawNames": {
        "uk": "Соєвий фарш сухий (текстурат)",
        "en": "Dry textured soy mince",
        "ru": "Соевый фарш сухой (текстурат)"
      },
      "weightState": "cooked"
    },
    "raw": {
      "per100": {
        "fibreG": 18.05,
        "saturatedFatG": 1.048,
        "sodiumMg": 1.6
      },
      "macrosPer100": {
        "p": 50.2,
        "f": 6.74,
        "c": 13.46,
        "kcal": 351.0
      },
      "sourceUrl": "https://blsdb.prod.se.ble.de/download",
      "description": "Max Rubner-Institut, BLS 4.0 (2025), CC BY 4.0, DOI 10.25826/Data20251217-134202-0; H765000: Plant-based mince, made from texturised soya protein, plain, dry",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Соєвий фарш сухий (текстурат)",
        "en": "Dry textured soy mince",
        "ru": "Соевый фарш сухой (текстурат)"
      }
    }
  },
  "vegetables": {
    "ready": {
      "per100": {
        "fibreG": 0.985,
        "saturatedFatG": 0.03555,
        "sodiumMg": 11.05
      },
      "macrosPer100": {
        "p": 0.9745,
        "f": 0.1785,
        "c": 3.747,
        "kcal": 17.15
      },
      "sourceUrl": "https://fdc.nal.usda.gov/",
      "description": "Calculated fresh mixture: cucumber 45%, tomato 45%, spinach 10%; no added oil or salt",
      "unitGrams": null,
      "reference": true,
      "names": {
        "uk": "Салат: огірок 45%, томат 45%, шпинат 10%",
        "en": "Salad: cucumber 45%, tomato 45%, spinach 10%",
        "ru": "Салат: огурец 45%, томат 45%, шпинат 10%"
      },
      "weightState": "fresh"
    }
  }
};
  window.VitalRiseSystem = system;
})();
