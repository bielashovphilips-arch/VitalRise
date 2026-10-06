(function () {
  const system = window.VitalRiseSystem || {};
  const keys = ['fibreG', 'saturatedFatG', 'sodiumMg'];
  function getValues(food, amount) {
    if (!food) return {};
    let values = food.unitType === 'piece' ? food.qualityPerUnit : food.qualityPer100;
    let factor = food.unitType === 'piece' ? amount : amount / 100;
    let source = null;
    if (!values) {
      const entry = (system.nutritionQualityData || {})[food.id];
      source = entry && entry[food.weightState === 'raw' ? 'raw' : 'ready'];
      values = source && source.per100;
      if (food.unitType === 'piece') factor = source && source.unitGrams ? amount * source.unitGrams / 100 : NaN;
    }
    const result = {};
    keys.forEach(function (key) {
      result[key] = values && typeof values[key] === 'number' && Number.isFinite(values[key]) && values[key] >= 0 && Number.isFinite(factor) ? values[key] * factor : null;
    });
    result.source = source;
    return result;
  }
  function summarize(meals) {
    const result = {};
    keys.forEach(function (key) { result[key] = {knownTotal:0, missingFoods:[], complete:false}; });
    let count = 0;
    const sources = new Map();
    (meals || []).forEach(function (meal) {
      (meal.items || []).forEach(function (item) {
        if (!(Number(item.amount) > 0)) return;
        count += 1;
        const food = system.nutrition.getFoodById(item.id), values = getValues(food, Number(item.amount));
        if (values.source) sources.set(item.id, {food:food, reference:values.source});
        keys.forEach(function (key) {
          if (values[key] === null || values[key] === undefined) {
            if (!result[key].missingFoods.some(function (missing) { return missing.id === item.id; })) result[key].missingFoods.push({id:item.id, name:food ? food.name : item.name});
          } else result[key].knownTotal += values[key];
        });
      });
    });
    keys.forEach(function (key) { result[key].complete = count > 0 && !result[key].missingFoods.length; });
    result.sources = Array.from(sources.values());
    result.itemCount = count;
    return result;
  }
  system.nutritionQuality = {keys:keys, getValues:getValues, summarize:summarize};
  window.VitalRiseSystem = system;
})();
