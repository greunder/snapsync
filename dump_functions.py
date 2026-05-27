import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

# We want to extract the full functions: wL, EL, yM, etc.
# Since the code is minified, we can look for "function yM()" and find where the next function starts, or grab a large chunk of characters (e.g. 10000 characters) after "function yM(" and search for keywords to understand the logic.

def dump_chunk(function_name, size=15000):
    pos = js_code.find("function " + function_name + "(")
    if pos == -1:
        pos = js_code.find(function_name + "=function(")
    if pos == -1:
        # Fallback to variable name search
        pos = js_code.find("function " + function_name)
    if pos != -1:
        print(f"\n===== DUMPING FUNCTION {function_name} FROM INDEX {pos} =====")
        print(js_code[pos:pos+size])
    else:
        print(f"Could not find function {function_name}")

dump_chunk("yM", 20000)
dump_chunk("EL", 10000)
