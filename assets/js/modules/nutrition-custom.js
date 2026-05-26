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

    const unitType = input.unitType === "piece" ? "piece" : "grams";
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
      allowedMeals: Array.isArray(input.allowedMeals) && input.allowedMeals.length
        ? input.allowedMeals
        : ["breakfast", "second_breakfast", "lunch", "snack", "dinner"]
    };

    if (unitType === "piece") {
      base.macrosPerUnit = {
        p: number(input.p, number(input.protein, 0)),
        f: number(input.f, number(input.fat, 0)),
        c: number(input.c, number(input.carbs, 0)),
        kcal: number(input.kcal, 0)
      };
    } else {
      base.macrosPer100 = {
        p: number(input.p, number(input.protein, 0)),
        f: number(input.f, number(input.fat, 0)),
        c: number(input.c, number(input.carbs, 0)),
        kcal: number(input.kcal, 0)
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
    saveProducts(products);
    return product;
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

    setJson(templateKey, templates.slice(-12));
    return label;
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
      savedAt: new Date().toISOString()
    });

    setJson(menuTemplateKey, templates.slice(-12));
    return label;
  }

  system.nutritionCustom = {
    categories: categories,
    getProducts: getProducts,
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
