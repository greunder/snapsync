import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

# Search for event names
# socket.emit("...", ...) or socket.on("...", ...) or events
# Minified might be: socket.emit("event") or .emit("event", ...) or socket.on("event")
emit_events = re.findall(r'\.emit\(\s*["\']([^"\']+)["\']', js_code)
on_events = re.findall(r'\.on\(\s*["\']([^"\']+)["\']', js_code)

print(f"Emitted events found: {list(set(emit_events))}")
print(f"Listened events found: {list(set(on_events))}")

# Let's search for "socket" or "io" usages
# We can look for occurrences of socket.io setup code or channel names
socket_context = []
for match in re.finditer(r'\b(socket|io)\b', js_code):
    start = max(0, match.start() - 100)
    end = min(len(js_code), match.end() + 100)
    socket_context.append(js_code[start:end])

print(f"\nFound {len(socket_context)} mentions of socket/io. Displaying a few:")
for ctx in list(set(socket_context))[:10]:
    print(f"Context: {ctx}\n")
