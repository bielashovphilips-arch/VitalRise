"""Small streaming XLSX reader for public reference datasets, using stdlib only."""
import io
import xml.etree.ElementTree as ET
import zipfile

NS = {'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def workbook(payload):
    archive = zipfile.ZipFile(io.BytesIO(payload))
    strings = []
    if 'xl/sharedStrings.xml' in archive.namelist():
        for event, node in ET.iterparse(archive.open('xl/sharedStrings.xml'), events=('end',)):
            if node.tag.endswith('}si'):
                strings.append(''.join(t.text or '' for t in node.findall('.//s:t',NS)))
                node.clear()
    return archive, strings

def rows(book, sheet='xl/worksheets/sheet1.xml'):
    archive, strings = book
    for event, node in ET.iterparse(archive.open(sheet), events=('end',)):
        if not node.tag.endswith('}row'): continue
        row = {}
        for cell in node.findall('s:c',NS):
            column = ''.join(c for c in cell.attrib['r'] if c.isalpha())
            value = cell.find('s:v',NS)
            if value is not None:
                row[column] = strings[int(value.text)] if cell.attrib.get('t') == 's' else value.text
            elif cell.attrib.get('t') == 'inlineStr':
                row[column] = ''.join(t.text or '' for t in cell.findall('.//s:t',NS))
        yield row
        node.clear()
