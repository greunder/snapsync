import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

pos = js_code.find("function pM")
if pos == -1:
    pos = js_code.find("pM=function")
if pos != -1:
    body = js_code[pos:pos+6000]
    print(f"pM code body:\n{body}")
else:
    print("Could not find function pM")
