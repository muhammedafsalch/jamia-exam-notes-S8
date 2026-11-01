import json
import re

with open('js/hadees_data.js', 'r', encoding='utf-8') as f:
    text = f.read()

from enrich_hadees import predictions

for b_id in ['haid', 'mawaqit', 'adhan']:
    if b_id in predictions:
        # Check if already has examPredictions
        idx = text.find(f'"id": "{b_id}"')
        if idx != -1:
            chunk = text[idx:idx+2500]
            if '"examPredictions"' not in chunk:
                # Find "sections": [
                sec_idx = text.find('"sections":', idx)
                if sec_idx != -1:
                    pred_json = json.dumps(predictions[b_id], ensure_ascii=False, indent=6)
                    addition = f'    "examPredictions": {pred_json},\n    '
                    text = text[:sec_idx] + addition + text[sec_idx:]
                    print(f"Added predictions to {b_id}")

with open('js/hadees_data.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done checking all 10 books.")
