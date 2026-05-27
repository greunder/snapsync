import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

# Find URLs in code
urls = re.findall(r'https?://[^\s"\']+', js_code)
# Filter unique URLs
unique_urls = list(set(urls))
print(f"Found {len(unique_urls)} unique URLs:")
for url in sorted(unique_urls)[:30]:
    print(f"  - {url}")

# Find any API paths like /api/...
api_paths = re.findall(r'\"(/[^\"]+)\"|\'(/[^\']+)\'', js_code)
flat_api_paths = list(set([p[0] or p[1] for p in api_paths if p[0] or p[1]]))
interesting_paths = [p for p in flat_api_paths if 'api' in p or 'ws' in p or 'socket' in p or 'queue' in p or 'booth' in p or 'photo' in p]
print(f"\nFound {len(interesting_paths)} interesting absolute paths:")
for path in sorted(interesting_paths):
    print(f"  - {path}")

# Let's search for mentions of local storage or databases
db_keywords = ['localStorage', 'sessionStorage', 'indexedDB', 'supabase', 'firebase', 'firestore', 'socket.io', 'websocket', 'broadcast', 'channel']
found_db = []
for db in db_keywords:
    if db.lower() in js_code.lower():
        found_db.append(db)
print(f"\nFound database/sync keywords: {found_db}")
