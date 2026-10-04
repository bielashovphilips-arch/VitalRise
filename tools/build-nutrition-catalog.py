"""Extract the pinned, public USDA SR Legacy records used by nutrition-catalog.js.

Run: python tools/build-nutrition-catalog.py path/to/usda-sr-legacy-csv.zip
No request to the user's account or external runtime dependency is required.
"""
import csv
import io
import json
import sys
import zipfile
from pathlib import Path

# Identifier, FDC identifier, category, Ukrainian, English, Russian, weight state.
FOODS = [
    ('milk_whole',171265,'protein','Молоко 3,25%','Milk 3.25%','Молоко 3,25%','packaged'),
    ('milk_2',171267,'protein','Молоко 2%','Milk 2%','Молоко 2%','packaged'),
    ('milk_1',170872,'protein','Молоко 1%','Milk 1%','Молоко 1%','packaged'),
    ('yogurt_whole',171284,'protein','Йогурт натуральний, цільномолочний','Plain whole-milk yogurt','Йогурт натуральный, цельномолочный','packaged'),
    ('yogurt_lowfat',170886,'protein','Йогурт натуральний, нежирний','Plain low-fat yogurt','Йогурт натуральный, нежирный','packaged'),
    ('yogurt_nonfat',170887,'protein','Йогурт натуральний, знежирений','Plain nonfat yogurt','Йогурт натуральный, обезжиренный','packaged'),
    ('kefir_lifeway',170904,'protein','Кефір нежирний LIFEWAY','LIFEWAY plain low-fat kefir','Кефир нежирный LIFEWAY','packaged'),
    ('mozzarella',170845,'protein','Моцарела, цільномолочна','Whole-milk mozzarella','Моцарелла, цельномолочная','packaged'),
    ('feta',173420,'protein','Фета','Feta','Фета','packaged'),
    ('ricotta',170851,'protein','Рікота, цільномолочна','Whole-milk ricotta','Рикотта, цельномолочная','packaged'),
    ('sour_cream',171257,'fat','Сметана, усереднена','Cultured sour cream, generic','Сметана, усреднённая','packaged'),
    ('millet',168871,'carb','Пшоно готове','Cooked millet','Пшено готовое','cooked'),
    ('pearl_barley',170285,'carb','Перловка готова','Cooked pearl barley','Перловка готовая','cooked'),
    ('rye_bread',172684,'extra_carb','Житній хліб','Rye bread','Ржаной хлеб','packaged'),
    ('pear',169118,'carb','Груша','Pear','Груша','fresh'),
    ('orange',169097,'carb','Апельсин','Orange','Апельсин','fresh'),
    ('mandarin',169105,'carb','Мандарин','Mandarin','Мандарин','fresh'),
    ('peach',169928,'carb','Персик','Peach','Персик','fresh'),
    ('plum',169949,'carb','Слива','Plum','Слива','fresh'),
    ('grapes',174683,'carb','Виноград червоний / зелений','Red or green grapes','Виноград красный / зелёный','fresh'),
    ('strawberry',167762,'carb','Полуниця','Strawberry','Клубника','fresh'),
    ('blueberry',171711,'carb','Лохина','Blueberry','Голубика','fresh'),
    ('sweet_cherry',171719,'carb','Черешня','Sweet cherry','Черешня','fresh'),
    ('apricot',171697,'carb','Абрикос','Apricot','Абрикос','fresh'),
    ('kiwi',168153,'carb','Ківі зелений','Green kiwi','Киви зелёный','fresh'),
    ('almonds',170567,'fat','Мигдаль','Almonds','Миндаль','packaged'),
    ('walnuts',170187,'fat','Волоські горіхи','Walnuts','Грецкие орехи','packaged'),
    ('hazelnuts',170581,'fat','Фундук','Hazelnuts','Фундук','packaged'),
    ('cashews',170162,'fat','Кеш’ю сирі','Raw cashews','Кешью сырые','packaged'),
    ('pistachios',170184,'fat','Фісташки сирі','Raw pistachios','Фисташки сырые','packaged'),
    ('sunflower_seeds',170562,'fat','Насіння соняшника, очищене','Sunflower seed kernels','Семена подсолнечника, очищенные','packaged'),
    ('flaxseed',169414,'fat','Насіння льону','Flaxseed','Семена льна','packaged'),
    ('chia',170554,'fat','Насіння чіа','Chia seeds','Семена чиа','packaged'),
    ('sunflower_oil',171025,'fat','Соняшникова олія','Sunflower oil','Подсолнечное масло','packaged'),
    ('hummus',172454,'protein','Хумус, домашній базовий','Hummus, basic home recipe','Хумус, домашний базовый','packaged'),
    ('eggplant',169228,'vegetable','Баклажан сирий','Raw eggplant','Баклажан сырой','fresh'),
    ('romaine',169247,'vegetable','Салат ромен','Romaine lettuce','Салат ромэн','fresh'),
    ('radish',169276,'vegetable','Редис','Radish','Редис','fresh'),
    ('celery',169988,'vegetable','Селера, стебла','Celery stalks','Сельдерей, стебли','fresh'),
]

def build(archive_path):
    archive = zipfile.ZipFile(archive_path)
    def read_table(filename):
        path = next(n for n in archive.namelist() if n.endswith('/' + filename))
        return csv.DictReader(io.TextIOWrapper(archive.open(path), encoding='utf-8-sig'))
    records = {int(row['fdc_id']): row for row in read_table('food.csv')}
    identifiers = {item[1] for item in FOODS}
    nutrients = {identifier: {} for identifier in identifiers}
    nutrient_ids = {'1003':'p','1004':'f','1005':'c','1008':'kcal'}
    for row in read_table('food_nutrient.csv'):
        identifier = int(row['fdc_id'])
        if identifier in nutrients and row['nutrient_id'] in nutrient_ids:
            nutrients[identifier][nutrient_ids[row['nutrient_id']]] = float(row['amount'])
    foods = []
    for identifier, fdc, category, uk, en, ru, state in FOODS:
        macros = nutrients[fdc]
        assert set(macros) == {'p','f','c','kcal'}, (fdc, macros)
        dairy = fdc in {row[1] for row in FOODS[:11]}
        default = 10 if identifier == 'sunflower_oil' else 30 if category == 'fat' else 100
        food = dict(id=identifier, name=uk, names=dict(uk=uk,en=en,ru=ru), category=category,
                    unitType='grams',unitLabel='г',portionStep=5 if category=='fat' else 25,
                    min=5 if category=='fat' else 25,max=100 if category=='fat' else 500,defaultAmount=default,
                    allowedMeals=['breakfast','second_breakfast','lunch','snack','dinner','evening_snack'],
                    macrosPer100=macros,weightState=state,animal=dairy,highCarb=category in ['carb','extra_carb'],
                    sourceLabel='USDA FoodData Central · SR Legacy',sourceUrl=f'https://fdc.nal.usda.gov/food-details/{fdc}/nutrients',
                    sourceDescription=records[fdc]['description'])
        foods.append(food)
    root = Path(__file__).resolve().parent.parent
    output = root / 'assets/js/modules/nutrition-catalog.js'
    output.write_text('// Public USDA SR Legacy records, per 100 g edible portion. Generated by tools/build-nutrition-catalog.py.\n'
                      '(function () {\n  const system = window.VitalRiseSystem || {};\n  system.nutritionCatalog = '+json.dumps(foods,ensure_ascii=False,indent=2)+';\n  window.VitalRiseSystem = system;\n})();\n',encoding='utf-8')
    print(f'Generated {len(foods)} sourced foods')

if __name__ == '__main__':
    build(sys.argv[1])
