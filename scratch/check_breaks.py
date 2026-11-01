import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open(r'scratch\balaga_extracted\mukhtasar-almaani.htm', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

# Let's count <br clear=all> before idx_fasl
idx_fasl = txt.find('الفصل والوصل', 200000)
breaks_before_fasl = len(re.findall(r'<br\s+clear=all>', txt[:idx_fasl], re.IGNORECASE))
print(f'Number of <br clear=all> before الفصل والوصل: {breaks_before_fasl}')

idx_haqiqa = txt.find('الحقيقة والمجاز', 200000)
breaks_before_haqiqa = len(re.findall(r'<br\s+clear=all>', txt[:idx_haqiqa], re.IGNORECASE))
print(f'Number of <br clear=all> before الحقيقة والمجاز: {breaks_before_haqiqa}')

# In the rafed online reader, min page is 141 (or 9 is khutba).
# Let's check how pages map to pages 145 to 215.
# Let's see what is on page 215 and 216 online by checking the online URLs or <br clear=all>
