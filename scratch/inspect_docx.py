import zipfile
import xml.etree.ElementTree as ET
import os

docx_path = r"C:\Users\iwand\Downloads\PunFiction_ 1 star Tourist Traps.docx"

with zipfile.ZipFile(docx_path) as docx:
    xml_content = docx.read('word/document.xml')
    root = ET.fromstring(xml_content)
    
    # Let's search for "Level" in all text elements
    for text in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
        if text.text and "Level" in text.text:
            print(f"Found text element: '{text.text}'")
