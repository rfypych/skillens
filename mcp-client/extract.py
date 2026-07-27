import json
import os

os.makedirs(r"d:\projects\JHIC-rev\frontend\src\components\ui", exist_ok=True)

with open("comp_7038.json", "r") as f:
    data = json.load(f)
    code = data['result']['structuredContent']['component']['componentCode']
    with open(r"d:\projects\JHIC-rev\frontend\src\components\ui\aurora-bento-grid.tsx", "w", encoding='utf-8') as out:
        out.write(code)

with open("comp_7841.json", "r") as f:
    data = json.load(f)
    code = data['result']['structuredContent']['component']['componentCode']
    with open(r"d:\projects\JHIC-rev\frontend\src\components\ui\stats-card-1.tsx", "w", encoding='utf-8') as out:
        out.write(code)
    
    card_code = data['result']['structuredContent']['component']['registryDependencies']['filesWithRegistry']['/components/ui/card.tsx']['code']
    with open(r"d:\projects\JHIC-rev\frontend\src\components\ui\card.tsx", "w", encoding='utf-8') as out:
        out.write(card_code)

print("Extraction complete!")
