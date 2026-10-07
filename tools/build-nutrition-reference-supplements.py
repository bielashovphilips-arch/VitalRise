"""Extract ONLY reviewed food matches from the original national XLSX tables.

Usage: python tools/build-nutrition-reference-supplements.py bls4.zip cofid.xlsx mext.xlsx
Numerical zero is preserved; missing, trace, LOD and LOQ remain unknown.
Published calculated values retain provenance. No cooked/raw extrapolation.
"""
import json, re, runpy, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
XLSX = runpy.run_path(str(ROOT/'tools/read-reference-xlsx.py'))
MATCHES = json.loads((ROOT/'tools/data/nutrition-reference-matches.json').read_text(encoding='utf-8'))
SOURCES = {
 'bls': {'url':'https://blsdb.prod.se.ble.de/download','title':'Max Rubner-Institut (2025), Bundeslebensmittelschlüssel 4.0',
         'doi':'10.25826/Data20251217-134202-0','license':'CC BY 4.0','download':'https://blsdb.prod.se.ble.de/assets/uploads/BLS_4_0_2025_DE.zip'},
 'cofid': {'url':'https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid',
           'title':'Public Health England, CoFID 2021','license':'Open Government Licence v3.0'},
 'mext': {'url':'https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html',
          'title':'MEXT, Standard Tables of Food Composition in Japan 2023, corrected 27 March 2026',
          'license':'Government of Japan standard terms of use; adapted reference facts'}
}
BLS = {'vitaminA':('AK',1),'vitaminC':('DN',1),'vitaminD':('AW',1),'vitaminE':('BI',1),'vitaminK':('CA',1),
 'b1':('CG',1),'b2':('CJ',1),'b3':('CM',1),'b5':('CS',1),'b6':('CV',.001),'b7':('CY',1),'b9':('DB',1),'b12':('DK',1),
 'calcium':('EC',1),'chloride':('DW',1),'chromium':('FG',1),'copper':('EX',1),'fluoride':('FD',.001),'iodine':('EU',1),
 'iron':('EO',1),'magnesium':('EF',1),'manganese':('FA',.001),'molybdenum':('FJ',1),'phosphorus':('EI',1),
 'potassium':('DZ',1),'sodium':('DT',1),'zinc':('ER',1)}
COFID_MIN = {'sodium':('H',1),'potassium':('I',1),'calcium':('J',1),'magnesium':('K',1),'phosphorus':('L',1),
 'iron':('M',1),'copper':('N',1000),'zinc':('O',1),'chloride':('P',1),'manganese':('Q',1),'selenium':('R',1),'iodine':('S',1)}
# RE and tocopherol-equivalent columns are intentionally not substituted for RAE / alpha-tocopherol.
COFID_VIT = {'vitaminD':('K',1),'vitaminK':('M',1),'b1':('N',1),'b2':('O',1),'b3':('R',1),'b6':('S',1),
 'b12':('T',1),'b9':('U',1),'b5':('V',1),'b7':('W',1),'vitaminC':('X',1)}
MEXT = {'vitaminA':('AQ',1),'vitaminC':('BG',1),'vitaminD':('AR',1),'vitaminE':('AS',1),
 'b1':('AX',1),'b2':('AY',1),'b3':('BA',1),'b6':('BB',1),'b12':('BC',1),'b9':('BD',1),'b5':('BE',1),'b7':('BF',1),
 'sodium':('X',1),'potassium':('Y',1),'calcium':('Z',1),'magnesium':('AA',1),'phosphorus':('AB',1),'iron':('AC',1),
 'zinc':('AD',1),'copper':('AE',1000),'manganese':('AF',1),'iodine':('AH',1),'selenium':('AI',1),'chromium':('AJ',1),'molybdenum':('AK',1)}
# MEXT total K is not K1; natural food folate here equals DFE (no enriched foods in these matches).
def number(value, factor=1):
    text = (value or '').strip()
    if not re.fullmatch(r'\(?[0-9]+(?:\.[0-9]*)?(?:[Ee][+-]?[0-9]+)?\)?',text): return None
    return round(float(text.strip('()'))*factor,8)

def next_column(column, offset):
    n=0
    for c in column: n=n*26+ord(c)-64
    result='';n+=offset
    while n: n,d=divmod(n-1,26);result=chr(65+d)+result
    return result

def build(bls_path, cofid_path, mext_path):
    output={'sources':SOURCES,'bls':{},'cofid':{},'mext':{}}
    z=zipfile.ZipFile(bls_path)
    p=next(n for n in z.namelist() if n.endswith('BLS_4_0_Daten_2025_DE.xlsx'))
    wanted={c for pair in MATCHES['bls'].values() for c in pair if c}
    for row in XLSX['rows'](XLSX['workbook'](z.read(p))):
        code=row.get('A')
        if code not in wanted: continue
        values={k:number(row.get(col),fac) for k,(col,fac) in BLS.items()}
        provenance={k:{'published':row.get(col),'method':row.get(next_column(col,1)), 'reference':row.get(next_column(col,2))}
                    for k,(col,fac) in BLS.items()}
        output['bls'][code]={'description':row['C'],'per100':values,'provenance':provenance,
            'upperPer100':{'retinol':number(row.get('AN')),'folicAcid':number(row.get('DH'))},
            'macros':{k:number(row.get(col)) for k,col in {'p':'M','f':'P','c':'S','kcal':'G'}.items()},
            'quality':{k:number(row.get(col)) for k,col in {'fibreG':'V','saturatedFatG':'IM','sodiumMg':'DT'}.items()}}
    b=XLSX['workbook'](Path(cofid_path).read_bytes())
    wanted={c for pair in MATCHES['cofid'].values() for c in pair if c}
    for sheet, mapping in [(5,COFID_MIN),(6,COFID_VIT)]:
        for row in XLSX['rows'](b,f'xl/worksheets/sheet{sheet}.xml'):
            code=row.get('A')
            if code not in wanted:continue
            record=output['cofid'].setdefault(code,{'description':row['B'],'sample':row.get('C'),'reference':row.get('F'),'per100':{},'provenance':{}})
            for key,(col,factor) in mapping.items():
                record['per100'][key]=number(row.get(col),factor)
                record['provenance'][key]={'published':row.get(col),'method':'CoFID reference value; may include published estimates','reference':row.get('F')}
    wanted={c for pair in MATCHES['mext'].values() for c in pair if c}
    for row in XLSX['rows'](XLSX['workbook'](Path(mext_path).read_bytes())):
        code=row.get('B')
        if code not in wanted:continue
        output['mext'][code]={'description':row['D'],'per100':{k:number(row.get(col),fac) for k,(col,fac) in MEXT.items()},
            'upperPer100':{'retinol':number(row.get('AL'))},
            'provenance':{k:{'published':row.get(col),'method':'Published estimate' if '(' in row.get(col,'') else 'MEXT reference value'} for k,(col,fac) in MEXT.items()}}
    for source in ['bls','cofid','mext']:
        wanted={c for pair in MATCHES[source].values() for c in pair if c}
        assert wanted==set(output[source]), (source,wanted-set(output[source]))
    target=ROOT/'tools/data/nutrition-reference-supplements.json'
    target.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Pinned reference records:', {k:len(output[k]) for k in ['bls','cofid','mext']})

if __name__=='__main__':build(*sys.argv[1:])
