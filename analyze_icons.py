import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

icons = ['Hl', 'TE', 'NE', 'VE', 'IE', 'wE', 'EE', '_E', 'gE']

for icon in icons:
    print(f"\n===== Searching for icon variable '{icon}' =====")
    # Let's search for assignments or mapping: e.g. "const Hl =" or "function Hl" or similar
    pattern = r'\b' + re.escape(icon) + r'\b\s*=\s*(\w+)'
    matches = [m.start() for m in re.finditer(pattern, js_code)]
    
    if not matches:
        pattern = r'\b(const\s+' + re.escape(icon) + r'|function\s+' + re.escape(icon) + r'|' + re.escape(icon) + r'\s*=)'
        matches = [m.start() for m in re.finditer(pattern, js_code)]
        
    print(f"Found {len(matches)} potential definition matches for icon {icon}:")
    for idx, pos in enumerate(matches[:2]):
        start = max(0, pos - 150)
        end = min(len(js_code), pos + 250)
        print(f"Match {idx+1} at {pos}:\n{js_code[start:end]}\n")
