import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

pos = js_code.find("function yM()")
if pos != -1:
    body = js_code[pos:pos+15000]
    # Let's find return statement of yM
    # In minified code, return is usually "return P.jsxs" or "return P.jsx" near the end of the function
    # Let's search for "return" inside body
    ret_positions = [m.start() for m in re.finditer(r'\breturn\b', body)]
    print(f"Found {len(ret_positions)} return statements inside yM function body.")
    for idx, r_pos in enumerate(ret_positions):
        print(f"\n--- Return {idx+1} (at index {pos + r_pos}) ---")
        print(body[r_pos:r_pos+1500])
else:
    print("Could not find function yM")
