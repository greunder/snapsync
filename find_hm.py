import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

# Find where hM is defined
# In minified JS it might be: hM = "url", or hM = something
matches = [m.start() for m in re.finditer(r'\bhM\b', js_code)]
print(f"Found {len(matches)} matches of hM.")
for idx, pos in enumerate(matches[:5]):
    start = max(0, pos - 100)
    end = min(len(js_code), pos + 100)
    print(f"Match {idx+1} at {pos}:\n{js_code[start:end]}\n")
