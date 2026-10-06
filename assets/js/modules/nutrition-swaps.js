(function () {
  const system = window.VitalRiseSystem || {};
  const nutrition = system.nutrition;
  function getOptions(foodId, amount, targets, mealKey, items, selected) {
    const original = nutrition.getFoodById(foodId);
    if (!original || !(Number(amount) > 0)) return [];
    const before = nutrition.getFoodMacros(original, Number(amount));
    const primary = {protein:'p',carb:'c',extra_carb:'c',fat:'f'}[original.category] || 'kcal';
    const occupied = new Set((items || []).map(function (item) { return item.id; }));
    const allowed = selected && selected[original.category] || [];
    return allowed.map(nutrition.getFoodById).filter(function (food) {
      return food && food.id !== foodId && !occupied.has(food.id) && food.category === original.category &&
        nutrition.isFoodAllowedForGoal(food, targets.goal) && nutrition.isFoodAllowedForDiet(food, targets.dietStyle) &&
        (!food.allowedMeals || food.allowedMeals.includes(mealKey));
    }).map(function (food) {
      const perUnit = nutrition.getFoodMacros(food, food.unitType === 'piece' ? 1 : 100);
      const matchKey = before[primary] > 0 && perUnit[primary] > 0 ? primary : 'kcal';
      if (!(perUnit[matchKey] > 0)) return null;
      const energyRatio = perUnit.kcal / Math.max(before.kcal,1);
      const primaryRatio = perUnit[matchKey] / Math.max(before[matchKey],1);
      const units = (energyRatio + primaryRatio) / (energyRatio * energyRatio + primaryRatio * primaryRatio);
      const proposed = original.category === 'vegetable' ? Number(amount) : units * (food.unitType === 'piece' ? 1 : 100);
      const portion = nutrition.normalizeManualPortion(food, proposed);
      if (!portion || proposed > (food.max || 600) || proposed < (food.unitType === 'piece' ? 0.5 : 1)) return null;
      const after = nutrition.getFoodMacros(food, portion);
      const energyError = Math.abs(after.kcal - before.kcal) / Math.max(before.kcal,1);
      const primaryError = Math.abs(after[matchKey] - before[matchKey]) / Math.max(before[matchKey],1);
      if (original.category !== 'vegetable' && (energyError > 0.2 || primaryError > 0.2)) return null;
      const deltas = {};
      ['kcal','p','f','c'].forEach(function (key) { deltas[key] = Math.round((after[key] - before[key]) * 10) / 10; });
      const score = energyError + primaryError + Math.abs(deltas.p)/Math.max(before.p,10) + Math.abs(deltas.f)/Math.max(before.f,10) + Math.abs(deltas.c)/Math.max(before.c,10);
      return {food:food, amount:portion, before:before, after:after, deltas:deltas, score:score};
    }).filter(Boolean).sort(function (a,b) { return a.score - b.score || a.food.id.localeCompare(b.food.id); }).slice(0,4);
  }
  system.nutritionSwaps = {getOptions:getOptions};
  window.VitalRiseSystem = system;
})();
