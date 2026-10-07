(function () {
  const system = window.VitalRiseSystem || {};
  const storage = system.storage;
  const productKey = "vitalrise:nutrition:custom-products";
  const templateKey = "vitalrise:nutrition:meal-templates";
  const menuTemplateKey = "vitalrise:nutrition:menu-templates";
  const categories = ["protein", "carb", "extra_carb", "fat", "vegetable"];

  function getJson(key, fallback) {
    return storage ? storage.getJson(key, fallback) : fallback;
  }

  function setJson(key, value) {
    return storage ? storage.setJson(key, value) : false;
  }

  function slugify(text) {
    return String(text || "product")
      .toLowerCase()
      .replace(/[^a-z0-9а-щьюяєіїґ]+/gi, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 42) || "product";
  }

  function number(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function normalizeProduct(input) {
    const category = categories.includes(input.category) ? input.category : "protein";
    const name = String(input.name || "").trim();
    if (!name) return null;
    const savedMacros = input.macrosPer100 || input.macrosPerUnit || {};
    const macroValue = function (key) {
      const value = input[key] === undefined ? input[{p:"protein",f:"fat",c:"carbs",kcal:"kcal"}[key]] : input[key];
      return value === undefined ? number(savedMacros[key], 0) : Number(value);
    };
    const macros = ["p", "f", "c", "kcal"].map(macroValue);
    if (macros.some(function (value) { return !Number.isFinite(value) || value < 0; }) || macros[0] + macros[1] + macros[2] > 100.5 || macros[3] > 900) return null;

    const unitType = input.unitType === "piece" ? "piece" : "grams";
    const savedQuality = (unitType === "piece" ? input.qualityPerUnit : input.qualityPer100) || {};
    const quality = {};
    for (const key of ["fibreG", "saturatedFatG", "sodiumMg"]) {
      const value = input[key] === undefined ? savedQuality[key] : input[key];
      quality[key] = value === undefined || value === null || String(value).trim() === "" ? null : Number(value);
      if (quality[key] !== null && (!Number.isFinite(quality[key]) || quality[key] < 0 || quality[key] > (key === "sodiumMg" ? 100000 : 100))) return null;
    }
    if (quality.saturatedFatG !== null && quality.saturatedFatG > macros[1] + 0.1) return null;
    const micro = system.nutritionMicronutrients;
    const micronutrients = {}, micronutrientUpper = {};
    if (micro) {
      const savedMicro = (unitType === 'piece' ? input.micronutrientsPerUnit : input.micronutrientsPer100) || {};
      const savedUpper = (unitType === 'piece' ? input.micronutrientUpperPerUnit : input.micronutrientUpperPer100) || {};
      for (const key of micro.keys.concat(micro.upperKeys)) {
        const isUpper = micro.upperKeys.includes(key);
        const field = 'micro-' + (isUpper ? 'upper-' : '') + key;
        const raw = input[field] === undefined ? (isUpper ? savedUpper : savedMicro)[key] : input[field];
        const value = raw === undefined || raw === null || String(raw).trim() === '' ? null : Number(raw);
        if (value !== null && (!Number.isFinite(value) || value < 0 || value > 1000000)) return null;
        (isUpper ? micronutrientUpper : micronutrients)[key] = value;
      }
      for (const pair of [['retinol','vitaminA',1],['folicAcid','b9',1.7],['addedVitaminE','vitaminE',1],['addedNiacin','b3',1]]) {
        const component = micronutrientUpper[pair[0]], total = micronutrients[pair[1]];
        if (component !== null && total !== null && component*pair[2] > total + 0.1) return null;
      }
    }
    const unitLabel = unitType === "piece" ? "шт" : "г";
    const id = String(input.id || ("custom_" + slugify(name))).trim();
    const base = {
      id: id.indexOf("custom_") === 0 ? id : "custom_" + id,
      name: name,
      category: category,
      unitType: unitType,
      unitLabel: unitLabel,
      portionStep: unitType === "piece" ? 1 : Math.max(1, number(input.portionStep, 25)),
      min: unitType === "piece" ? Math.max(1, number(input.min, 1)) : Math.max(1, number(input.min, 50)),
      max: unitType === "piece" ? Math.max(1, number(input.max, 10)) : Math.max(1, number(input.max, 300)),
      defaultAmount: unitType === "piece" ? Math.max(1, number(input.defaultAmount, 1)) : Math.max(1, number(input.defaultAmount, 100)),
      animal: input.animal === true || input.animal === "true",
      highCarb: input.highCarb === true || input.highCarb === "true" || Number(input.c) >= 15,
      recipe: input.recipe && Array.isArray(input.recipe.ingredients) && Number(input.recipe.yieldGrams) > 0 ? input.recipe : null,
      weightState: ["cooked","fresh","packaged"].includes(input.weightState) ? input.weightState : "packaged",
      allowedMeals: Array.isArray(input.allowedMeals) && input.allowedMeals.length
        ? input.allowedMeals
        : ["breakfast", "second_breakfast", "lunch", "snack", "dinner"]
    };

    if (unitType === "piece") {
      base.qualityPerUnit = quality;
      base.micronutrientsPerUnit = micronutrients;
      base.micronutrientUpperPerUnit = micronutrientUpper;
      base.macrosPerUnit = {
        p: macroValue("p"),
        f: macroValue("f"),
        c: macroValue("c"),
        kcal: macroValue("kcal")
      };
    } else {
      base.qualityPer100 = quality;
      base.micronutrientsPer100 = micronutrients;
      base.micronutrientUpperPer100 = micronutrientUpper;
      base.macrosPer100 = {
        p: macroValue("p"),
        f: macroValue("f"),
        c: macroValue("c"),
        kcal: macroValue("kcal")
      };
    }

    return base;
  }

  function getProducts() {
    return getJson(productKey, []);
  }

  function saveProducts(products) {
    return setJson(productKey, products);
  }

  function addProduct(input) {
    const product = normalizeProduct(input);
    if (!product) return null;

    const products = getProducts().filter(function (item) {
      return item.id !== product.id;
    });

    products.push(product);
    return saveProducts(products) ? product : null;
  }

  function importProducts(payload) {
    const source = Array.isArray(payload) ? payload : (payload && payload.products) || [];
    const normalized = source.map(normalizeProduct).filter(Boolean);
    const existing = getProducts();
    const byId = {};

    existing.concat(normalized).forEach(function (item) {
      byId[item.id] = item;
    });

    const products = Object.keys(byId).map(function (id) { return byId[id]; });
    saveProducts(products);
    return normalized.length;
  }

  function deleteProduct(id) {
    const products = getProducts().filter(function (item) {
      return item.id !== id;
    });

    saveProducts(products);
    return products.length;
  }

  function getTemplates() {
    return getJson(templateKey, []);
  }

  function saveTemplate(name, selected) {
    const label = String(name || "").trim() || "Мій шаблон";
    const templates = getTemplates().filter(function (template) {
      return template.name !== label;
    });

    templates.push({
      name: label,
      selected: selected,
      savedAt: new Date().toISOString()
    });

    return setJson(templateKey, templates.slice(-12)) ? label : null;
  }

  function getMenuTemplates() {
    return getJson(menuTemplateKey, []);
  }

  function saveMenuTemplate(name, data) {
    const label = String(name || "").trim() || "Моє меню";
    const templates = getMenuTemplates().filter(function (template) {
      return template.name !== label;
    });

    templates.push({
      name: label,
      selected: data.selected,
      mealSelections: data.mealSelections,
      activeDayView: data.activeDayView,
      weightMode: data.weightMode,
      savedAt: new Date().toISOString()
    });

    return setJson(menuTemplateKey, templates.slice(-12)) ? label : null;
  }

  system.nutritionCustom = {
    categories: categories,
    getProducts: getProducts,
    addRecipe: function (name, yieldGrams, category, meal) {
      const weight = Number(yieldGrams);
      if (!meal || !meal.items.length || !Number.isFinite(weight) || weight < 1 || weight > 20000) return null;
      const factor = 100 / weight;
      const product = {name:name, category:category, p:meal.totals.p * factor, f:meal.totals.f * factor, c:meal.totals.c * factor, kcal:meal.totals.kcal * factor, weightState:"cooked", min:1, max:3000, portionStep:10, defaultAmount:100,
        animal:meal.items.some(function (item) { const food = system.nutrition.getFoodById(item.id); return !system.nutrition.isFoodAllowedForDiet(food, "vegan"); }),
        recipe:{yieldGrams:weight,ingredients:meal.items.map(function (item) { return {id:item.id,name:item.name,amount:item.amount,unitLabel:item.unitLabel,weightState:item.weightState,weightModeLabel:item.weightModeLabel}; })}};
      if (system.nutritionQuality) {
        const quality = system.nutritionQuality.summarize([meal]);
        product.qualityPer100 = {};
        system.nutritionQuality.keys.forEach(function (key) { product.qualityPer100[key] = quality[key].complete ? quality[key].knownTotal * factor : null; });
      }
      if (system.nutritionMicronutrients) {
        // Ingredient reference totals, not a measured cooked-recipe composition.
        // Heat and discarded liquid losses are not known: leave final recipe values unknown.
        product.micronutrientsPer100 = {};
        product.micronutrientUpperPer100 = {};
      }
      return addProduct(product);
    },
    getFavorites: function () { const saved = getJson("vitalrise:nutrition:favorites", []); return Array.isArray(saved) ? saved.filter(function (id) { return typeof id === "string"; }) : []; },
    saveFavorites: function (ids) { return setJson("vitalrise:nutrition:favorites", ids); },
    addProduct: addProduct,
    deleteProduct: deleteProduct,
    importProducts: importProducts,
    getTemplates: getTemplates,
    saveTemplate: saveTemplate,
    getMenuTemplates: getMenuTemplates,
    saveMenuTemplate: saveMenuTemplate
  };

  window.VitalRiseSystem = system;
})();
