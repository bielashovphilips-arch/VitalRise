"""Build traceable quality references from pinned USDA / BLS records and fixed mixtures.

Run: python tools/build-nutrition-quality.py path/to/usda-sr-legacy-csv.zip
Calories, macros and quality share one record and food state. Mixtures have explicit weight shares.
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
    'salmon': (175168, 175167), 'mackerel': (175120, 175119),
    'tofu': (172475, None),
    'oatmeal': (173905, 173904), 'rice': (169757, 169756),
    'buckwheat': (170686, 170685), 'pasta': (168928, 168927),
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
    'hard_cheese': (173414, None), 'beef': (174004, 171765),
    'tuna': (172006, 175159), 'chicken_thigh': (172388, 173627),
    'whey_protein': (173180, None), 'butter': (173430, None),
    'peanut_butter': (172470, None), 'nuts': (170567, None), 'seeds': (170562, None),
    'shrimp': (175180, 175179), 'pork_tenderloin': (168250, 168249),
    'berries': (167755, None), 'rice_cakes': (170250, None), 'honey': (169640, None),
    'jam': (169641, None), 'dates': (171726, None), 'raisins': (168165, None),
    'tortilla': (167535, None), 'fruit_juice': (169098, None),
    'pumpkin_seeds': (170556, None), 'dark_chocolate': (170273, None),
    'green_peas': (170420, 170419), 'tempeh': (172467, 174272),
    'asparagus': (168389, None), 'green_beans': (169141, 169961),
    'frozen_vegetables': (170472, 170471),
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
    supplements = json.loads((ROOT/'tools/data/nutrition-reference-supplements.json').read_text(encoding='utf-8'))
    matches = json.loads((ROOT/'tools/data/nutrition-reference-matches.json').read_text(encoding='utf-8'))
    for identifier in matches['blsPrimary']:
        output[identifier] = {}
        for mode, code in zip(('ready','raw'), matches['bls'][identifier]):
            if not code: continue
            row = supplements['bls'][code]
            output[identifier][mode] = dict(per100=row['quality'], macrosPer100=row['macros'],
                sourceUrl=supplements['sources']['bls']['url'],description='Max Rubner-Institut, BLS 4.0 (2025), CC BY 4.0, DOI 10.25826/Data20251217-134202-0; '+code+': '+row['description'],
                unitGrams=None,reference=True)
    # USDA reference fluid ounce = 31 g; an exact US fluid ounce is 29.5735295625 ml.
    # Per-100 fields for this sole volume food mean per 100 ml, consistently in all modules.
    assert any(int(r['fdc_id']) == 169098 and r['modifier'] == 'fl oz' and float(r['gram_weight']) == 31 for r in table('food_portion.csv'))
    density = 31/29.5735295625
    juice = output['fruit_juice']['ready']
    for field in ('per100','macrosPer100'):
        juice[field] = {k:round(v*density,8) if v is not None else None for k,v in juice[field].items()}
    juice['description'] += '; per 100 ml (USDA fluid-ounce mass conversion)'
    for identifier, parts in matches['mixtures'].items():
        records = [output[k]['ready'] for k in parts]
        description = 'Calculated fresh mixture: '+', '.join(f'{f} {w*100:g}%' for f,w in parts.items())+'; no added oil or salt'
        output[identifier] = {'ready':dict(
            per100={k:round(sum(output[f]['ready']['per100'][k]*w for f,w in parts.items()),8) if all(r['per100'][k] is not None for r in records) else None for k in nutrient_ids.values()},
            macrosPer100={k:round(sum(output[f]['ready']['macrosPer100'][k]*w for f,w in parts.items()),8) for k in macro_ids.values()},
            sourceUrl='https://fdc.nal.usda.gov/',description=description,unitGrams=None,reference=True)}
    labels = json.loads((ROOT/'tools/data/nutrition-reference-labels.json').read_text(encoding='utf-8'))
    for identifier, label in labels.items():
        output[identifier]['ready'].update(label)
        if 'raw' in output[identifier]:
            names = label.get('rawNames',label.get('names'))
            # Explicit raw names keep preparation words out of the raw weighing mode.
            if identifier in ('shrimp','green_peas','green_beans','tempeh','frozen_vegetables'):
                names = {lang:name.replace('варені без солі','сирі').replace('варений без солі','сирий').replace('варена без солі','сира').replace('готовий','сирий')
                    .replace('cooked without salt','raw').replace('boiled without salt','raw').replace('Cooked','Raw')
                    .replace('варёные без соли','сырые').replace('варёный без соли','сырой').replace('варёная без соли','сырая').replace('готовый','сырой') for lang,name in names.items()}
            output[identifier]['raw']['names'] = names
    target = ROOT / 'assets/js/modules/nutrition-quality-data.js'
    target.write_text('// USDA / BLS 4.0 and fixed-mixture references; see docs/nutrition-micronutrients.md for attribution and units.\n'
        '(function () {\n  const system = window.VitalRiseSystem || {};\n  system.nutritionQualityData = '
        + json.dumps(output, ensure_ascii=False, indent=2) + ';\n  window.VitalRiseSystem = system;\n})();\n', encoding='utf-8')
    print(f'Generated quality references for {len(output)} foods; missing nutrient values remain null')

if __name__ == '__main__':
    build(sys.argv[1])
