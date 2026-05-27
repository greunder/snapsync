import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

# Let's search for "u0=" or "c0=" near index 494941 where fM and hM are defined.
pos = js_code.find("fM=")
if pos != -1:
    start = max(0, pos - 4000)
    end = min(len(js_code), pos + 1000)
    print("Context around fM:")
    print(js_code[start:end])
else:
    print("Could not find fM")
