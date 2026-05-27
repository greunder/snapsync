import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Strip the markdown header
parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

print(f"JS code length: {len(js_code)} characters")

# Find all double-quoted strings (simple regex)
strings_double = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', js_code)
strings_single = re.findall(r"'([^'\\]*(?:\\.[^'\\]*)*)'", js_code)
all_strings = strings_double + strings_single

print(f"Extracted {len(all_strings)} strings.")

# Filter for strings containing letters (more likely to be content/messages/labels)
french_chars = re.compile(r'[a-zA-ZÀ-ÿ]{3,}')
words_strings = [s for s in all_strings if french_chars.search(s) and len(s) < 300]
print(f"Filtered to {len(words_strings)} word-like strings.")

# Search for specific interesting keywords in strings
keywords = ['borne', 'file', 'attente', 'photo', 'camera', 'snap', 'sync', 'qr', 'code', 'smartphone', 'mobile', 'session', 'cadre', 'personnalis', 'filtre', 'télécharger', 'partage', 'admin', 'attente', 'position', 'temps', 'minute', 'seconde']

matched_strings = {}
for kw in keywords:
    matched = [s for s in words_strings if kw.lower() in s.lower()]
    if matched:
        matched_strings[kw] = list(set(matched))

# Print stats and some sample matched strings
for kw, matches in matched_strings.items():
    print(f"\n--- Keyword: '{kw}' ({len(matches)} matches) ---")
    # Sort by length and show top 15 matches
    for m in sorted(matches, key=len)[:15]:
        print(f"  - {m}")
