"""Generate micronutrients from the same pinned SR Legacy records as macros.

Run with SR CSV zip, extracted DRI table JSON, and iodine release 4 per-100g rows JSON.
DRI table order is the official NASEM 2019 summary tables. No missing value becomes zero.
"""
import csv
import io
import json
import re
import runpy
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUALITY = runpy.run_path(str(ROOT / 'tools/build-nutrition-quality.py'))
REFERENCES = dict(QUALITY['REFERENCES'])
REFERENCES.update({r[0]: (r[1], None) for r in QUALITY['ADDITIONS']})
KEYS = ['vitaminA','vitaminC','vitaminD','vitaminE','vitaminK','b1','b2','b3','b6','b9','b12','b5','b7','choline',
        'calcium','chromium','copper','fluoride','iodine','iron','magnesium','manganese','molybdenum','phosphorus','selenium','zinc','potassium','sodium','chloride']
IDS = [1106,1162,1114,1109,1185,1165,1166,1169,1175,1190,1178,1170,1176,1180,
       1087,1096,1098,1099,1100,1089,1090,1101,1102,1091,1103,1095,1092,1093,1088]
# Canonical units match DRI: copper in micrograms, fluoride in milligrams.
FACTORS = {'copper':1000, 'fluoride':0.001}
AUX = {1105:'retinol',1186:'folicAcid',1242:'addedVitaminE',1245:'addedNiacin'}
BIO_SOURCE = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1450323/'
# Exact fresh-food / milk matches only; ng/g * 0.1 = micrograms/100g.
BIOTIN = {'milk_2':0.113,'milk_whole':0.091,'broccoli':0.943,'cauliflower':0.161,
          'apple':0.020,'avocado':0.961,'banana':0.133,'orange':0.049}
IODINE_SOURCE = 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Iodine/IODINE_RELEASE_4_DOCUMENTATION.pdf'
DRI_SOURCE = 'https://www.nationalacademies.org/read/25353/chapter/28'
# NIH ODS table 2 amounts per reference serving. Serving masses are from the
# corresponding SR Legacy food_portion.csv, not a generic cup-to-gram conversion.
# These are guide estimates, not analysis of the user's actual food sample.
NIH_PORTIONS = {
    'chromium': {
        'apple':(1.4,182,'medium (3" dia)'), 'banana':(1,118,'medium (7" to 7-7/8" long)'),
        'orange':(0.4,131,'fruit (2-5/8" dia)'), 'carrot':(0.3,61,'medium'),
        'tomato':(0.9,123,'medium whole (2-3/5" dia)'), 'celery':(0.1,40,'stalk, medium (7-1/2" - 8" long)'),
        'whole_bread':(1,32,'slice'),
    },
    'molybdenum': {
        'chicken':(9,85.048569375,'3 US ounces'), 'yogurt_lowfat':(26,245,'cup (8 fl oz)'),
        'milk_2':(22,246,'cup'), 'banana':(15,118,'medium (7" to 7-7/8" long)'),
        'rice':(13,79,'half cup'), 'whole_bread':(12,32,'slice'),
        'orange':(4,131,'fruit (2-5/8" dia)'),
    }
}

def build(archive_path, tables_path, iodine_path):
    z = zipfile.ZipFile(archive_path)
    def table(name):
        p = next(p for p in z.namelist() if p.endswith('/'+name))
        return csv.DictReader(io.TextIOWrapper(z.open(p), encoding='utf-8-sig'))
    ndb = {int(r['fdc_id']):r['NDB_number'].zfill(5) for r in table('sr_legacy_food.csv')}
    portions = list(table('food_portion.csv'))
    wanted = {i for pair in REFERENCES.values() for i in pair if i}
    values = {i:{} for i in wanted}
    for r in table('food_nutrient.csv'):
        if int(r['fdc_id']) in wanted and r['amount'].strip():
            values[int(r['fdc_id'])][int(r['nutrient_id'])] = float(r['amount'])
    iodine_rows = json.loads(Path(iodine_path).read_text(encoding='utf-8'))
    # NDB matches ensure state and product identity; no fuzzy cooked/raw extrapolation.
    iodine = {}
    for r in iodine_rows:
        match = re.match(r'^(\d{5})(?:\s|$)', r.get('B',''))
        if match and r.get('F'):
            iodine[match[1]] = {'value':float(r['F']), 'description':r['D'], 'min':float(r.get('H',r['F'])), 'max':float(r.get('I',r['F']))}
    output = {}
    for food, pair in REFERENCES.items():
        output[food] = {}
        for mode, fdc in zip(('ready','raw'),pair):
            if not fdc: continue
            v = values[fdc]
            p = {k: v.get(i)*FACTORS.get(k,1) if i in v else None for k,i in zip(KEYS,IDS)}
            partial = []
            if p['b3'] is None and 1167 in v:
                p['b3'] = v[1167] + v.get(1210,0)*1000/60
                if 1210 not in v: partial.append('b3')
            if p['vitaminD'] is None and 1110 in v: p['vitaminD'] = v[1110]/40
            extras = {}
            if food in BIOTIN and mode == 'ready':
                p['b7'] = BIOTIN[food]
                extras['b7'] = {'url':BIO_SOURCE,'description':'Measured reference sample; fresh food / fluid milk (Staggs et al., 2004)'}
            for key, foods in NIH_PORTIONS.items():
                if food in foods and mode == 'ready':
                    value, grams, description = foods[food]
                    if description != '3 US ounces':
                        modifier = 'cup' if description == 'half cup' else description
                        expected = grams*2 if description == 'half cup' else grams
                        assert any(int(r['fdc_id']) == fdc and r['modifier'] == modifier and float(r['gram_weight']) == expected for r in portions), (food,description,grams)
                    p[key] = value/grams*100
                    extras[key] = {'url':f'https://ods.od.nih.gov/factsheets/{key.capitalize()}-HealthProfessional/',
                        'description':f'NIH ODS guide estimate: {value} micrograms / {description}; reference mass {grams:g} g from USDA portion table', 'estimate':True}
            if ndb[fdc] in iodine:
                match = iodine[ndb[fdc]]
                p['iodine'] = match['value']
                extras['iodine'] = {'url':IODINE_SOURCE,'description':match['description'], 'rangePer100':[match['min'],match['max']]}
            output[food][mode] = {'per100':p,'upperPer100':{k:v.get(i) for i,k in AUX.items()},'partialKeys':partial,'extraSources':extras}
    tables = json.loads(Path(tables_path).read_text(encoding='utf-8'))
    profiles = {}
    row_groups = {'male':range(8,14),'female':range(15,21),'pregnancy':range(22,25),'lactation':range(26,29)}
    def number(cell):
        if cell == 'ND': return None
        return float(re.sub(r'[^\d.]','',cell))
    for group, rows in row_groups.items():
        profiles[group] = []
        for row in rows:
            cells = tables[2][row][1:] + tables[3][row] + tables[4][row][1:] + tables[5][row]
            assert len(cells) == len(KEYS)
            refs = {k:{'value':number(c),'type':'AI' if '*' in c else 'RDA'} for k,c in zip(KEYS,cells)}
            refs['chloride']['value'] *= 1000
            # Upper limits in the same canonical units. Restricted forms stay separate.
            uv = tables[10][row][1:] + tables[11][row]
            um = tables[12][row][1:] + tables[13][row]
            upper = dict(zip(['retinol','vitaminC','vitaminD','addedVitaminE','vitaminK','b1','b2','addedNiacin','b6','folicAcid','b12','b5','b7','choline','carotenoids'],map(number,uv)))
            upper.update(dict(zip(['arsenic','boron','calcium','chromium','copper','fluoride','iodine','iron','supplementMagnesium','manganese','molybdenum','nickel','phosphorus','potassium','selenium','silicon','sulfate','vanadium','zinc','sodium','chloride'],map(number,um))))
            for key in ['choline','phosphorus','chloride']:
                if upper[key] is not None: upper[key] *= 1000
            ages = [9,14,19,31,51,71] if group in ('male','female') else [14,19,31]
            idx = len(profiles[group])
            profiles[group].append({'minAge':ages[idx], 'maxAge': ages[idx+1]-1 if idx+1<len(ages) else (120 if group in ('male','female') else 50),'references':refs,'upper':upper})
    target = ROOT/'assets/js/modules/nutrition-micronutrient-data.js'
    payload = {'sourceUrl':DRI_SOURCE,'framework':'NASEM DRI (including 2019 sodium/potassium)','profiles':profiles,'foods':output}
    target.write_text('// Generated reference facts; see tools/build-nutrition-micronutrients.py and docs/nutrition-micronutrients.md.\n(function () {\n const system = window.VitalRiseSystem || {};\n system.nutritionMicronutrientData = '+json.dumps(payload,ensure_ascii=False,indent=2)+';\n window.VitalRiseSystem = system;\n})();\n',encoding='utf-8')
    print(f'Generated {len(KEYS)} nutrient definitions, {len(output)} food profiles; unknowns preserved')

if __name__ == '__main__': build(*sys.argv[1:])
