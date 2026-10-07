"""Build traceable fibre, saturated-fat and sodium references from pinned USDA SR Legacy CSV.

Run: python tools/build-nutrition-quality.py path/to/usda-sr-legacy-csv.zip
Calories, macros and quality share one record and food state. Ambiguous mixtures stay unknown.
"""
import csv
import io
import json
import runpy
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ADDITIONS = runpy.run_path(str(ROOT / 'tools/build-nutrition-catalog.py'))['FOODS']
# App ID: ready-reference FDC ID, raw-reference FDC ID when the app supports it.
REFERENCES = {
    'eggs': (171287, None),  # 50 g edible portion per egg, matching the existing 72 kcal basis.
    'chicken': (171477, 171077), 'turkey': (171496, 171098),
    'white_fish': (171956, 171955), 'greek_yogurt': (171304, None),
    'tofu': (172475, None),
    'oatmeal': (173905, 173904), 'rice': (168878, 168877),
    'buckwheat': (170686, 170685), 'pasta': (169737, 169736),
    'potato': (170440, None), 'sweet_potato': (168484, None),
    'bulgur': (170287, 170688), 'couscous': (169700, 169699),
    'quinoa': (168917, 168874), 'lentils': (172421, 172420),
    'beans': (173740, 175193), 'red_beans': (173743, 173742),
    'chickpeas': (173757, 173756), 'mung_beans': (174257, 174256),
    'split_peas': (172429, 172428), 'edamame': (168411, None),
    'olive_oil': (171413, None), 'avocado': (171705, None),
    'banana': (173944, None), 'apple': (171688, None),
    'whole_bread': (172688, None), 'peanuts': (172430, None),
    'spinach': (168462, None), 'broccoli': (170379, None),
    'cucumber': (168409, None), 'tomato': (170457, None),
    'bell_pepper': (170108, None), 'cabbage': (169975, None),
    'carrot': (170393, None), 'onion': (170000, None),
    'beetroot': (169146, None), 'zucchini': (169291, None),
    'mushrooms': (169251, None), 'cauliflower': (169986, None),
}

def build(archive_path):
    archive = zipfile.ZipFile(archive_path)
    def table(name):
        path = next(n for n in archive.namelist() if n.endswith('/' + name))
        return csv.DictReader(io.TextIOWrapper(archive.open(path), encoding='utf-8-sig'))
    records = {int(row['fdc_id']): row for row in table('food.csv')}
    references = dict(REFERENCES)
    references.update({row[0]: (row[1], None) for row in ADDITIONS})
    ids = {fdc for pair in references.values() for fdc in pair if fdc}
    nutrients = {fdc: {'fibreG': None, 'saturatedFatG': None, 'sodiumMg': None} for fdc in ids}
    nutrient_ids = {'1079': 'fibreG', '1258': 'saturatedFatG', '1093': 'sodiumMg'}
    macros = {fdc: {} for fdc in ids}
    macro_ids = {'1003': 'p', '1004': 'f', '1005': 'c', '1008': 'kcal'}
    for row in table('food_nutrient.csv'):
        fdc = int(row['fdc_id'])
        if fdc in nutrients and row['nutrient_id'] in nutrient_ids and row['amount'].strip():
            value = float(row['amount'])
            assert value >= 0
            nutrients[fdc][nutrient_ids[row['nutrient_id']]] = value
        if fdc in macros and row['nutrient_id'] in macro_ids and row['amount'].strip():
            macros[fdc][macro_ids[row['nutrient_id']]] = float(row['amount'])
    output = {}
    for identifier, pair in references.items():
        output[identifier] = {}
        for mode, fdc in zip(('ready', 'raw'), pair):
            if not fdc:
                continue
            assert len(macros[fdc]) == 4, (identifier, fdc)
            output[identifier][mode] = dict(per100=nutrients[fdc], macrosPer100=macros[fdc],
                sourceUrl=f'https://fdc.nal.usda.gov/food-details/{fdc}/nutrients',
                description=records[fdc]['description'], unitGrams=50 if identifier == 'eggs' else None,
                reference=identifier in REFERENCES)
    target = ROOT / 'assets/js/modules/nutrition-quality-data.js'
    target.write_text('// USDA SR Legacy quality references; grams of fibre/saturated fat, milligrams of sodium.\n'
        '(function () {\n  const system = window.VitalRiseSystem || {};\n  system.nutritionQualityData = '
        + json.dumps(output, ensure_ascii=False, indent=2) + ';\n  window.VitalRiseSystem = system;\n})();\n', encoding='utf-8')
    print(f'Generated quality references for {len(output)} foods; missing nutrient values remain null')

if __name__ == '__main__':
    build(sys.argv[1])
