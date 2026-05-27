import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

# Find occurrences of update_model and subscribeToRoom
search_terms = ['update_model', 'subscribeToRoom', 'model', 'state']

for term in search_terms:
    print(f"\n===== Contexts for '{term}' =====")
    matches = [m.start() for m in re.finditer(re.escape(term), js_code)]
    print(f"Found {len(matches)} matches.")
    # Print the 200 characters before and after for the first 5 matches
    for idx, pos in enumerate(matches[:5]):
        start = max(0, pos - 150)
        end = min(len(js_code), pos + 150)
        print(f"Match {idx+1} at {pos}:\n{js_code[start:end]}\n")
