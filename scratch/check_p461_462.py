import sys
sys.stdout.reconfigure(encoding='utf-8')
import pymupdf
import re

doc = pymupdf.open(r'd:\jjc\mahalli notes\mahalli.pdf')

def strip_harakat(text):
    return re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]', '', text)

print('=== PAGE 461 ===')
print(doc[460].get_text()[:400])
print('=== PAGE 462 ===')
print(doc[461].get_text()[:400])
