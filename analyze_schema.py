import re

js_file_path = "/Users/greunder/.gemini/antigravity/brain/4bb9d43f-604b-4e2b-942b-4856228821ad/.system_generated/steps/12/content.md"

with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split("---", 1)
js_code = parts[1] if len(parts) > 1 else content

# Let's search for some schema/entity-like words
# We can search for typical model properties like:
# 'id', 'name', 'status', 'position', 'photo', 'frame', 'text', 'created_at' or similar.
# In React/Base44, we might see objects with properties or query definitions.
# Let's search for common React Hook usage, e.g. "useQuery" or "useMutation" or "useEntity" or "useLiveQuery"

hook_matches = re.findall(r'\b(use[A-Z][a-zA-Z0-9_]+)\b', js_code)
unique_hooks = list(set(hook_matches))
print(f"React hooks used: {unique_hooks}")

# Let's search for entities definition or tables in base44
# In base44 apps, entities are often defined as useEntity("table_name") or similar.
# Let's search for useEntity or any functions that look like useEntity, useModel, useTable, etc.
base44_hooks = [h for h in unique_hooks if 'entity' in h.lower() or 'model' in h.lower() or 'query' in h.lower() or 'mutation' in h.lower()]
print(f"Base44/API Hooks: {base44_hooks}")

# Let's find context around any "useEntity" or similar call
entity_matches = [m.start() for m in re.finditer(r'useEntity', js_code)]
print(f"\nFound {len(entity_matches)} matches of useEntity:")
for idx, pos in enumerate(entity_matches[:10]):
    start = max(0, pos - 150)
    end = min(len(js_code), pos + 150)
    print(f"Match {idx+1} at {pos}:\n{js_code[start:end]}\n")

# Let's search for the actual screen or views mapping
# For example, searching for "page", "route", "router" or "path"
route_matches = [m.start() for m in re.finditer(r'path:', js_code)]
print(f"\nFound {len(route_matches)} matches of path:")
for idx, pos in enumerate(route_matches[:10]):
    start = max(0, pos - 100)
    end = min(len(js_code), pos + 100)
    print(f"Match {idx+1} at {pos}:\n{js_code[start:end]}\n")
