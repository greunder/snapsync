import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

# Search for xL component definition
components = ['xL']

for comp in components:
    print(f"\n===== Searching for component '{comp}' =====")
    pattern = r'\b' + re.escape(comp) + r'\b\s*=\s*(?:function|\([^)]*\)\s*=>|class|\w+\s*\()'
    matches = [m.start() for m in re.finditer(pattern, js_code)]
    
    if not matches:
        pattern = r'\b(function\s+' + re.escape(comp) + r'|' + re.escape(comp) + r'\s*=)'
        matches = [m.start() for m in re.finditer(pattern, js_code)]
        
    print(f"Found {len(matches)} potential definition matches for {comp}:")
    for idx, pos in enumerate(matches):
        start = max(0, pos - 100)
        end = min(len(js_code), pos + 1500)
        print(f"Match {idx+1} at {pos}:\n{js_code[start:end]}\n")
