#!/usr/bin/env python3
"""Survey Openverse for real, commercially-licensed photographs.

Prints candidates so a human (or the build agent) can curate by relevance
before anything is downloaded. Nothing is downloaded by this script.
"""
import json
import sys
import time
import urllib.parse
import urllib.request

API = "https://api.openverse.org/v1/images/"

QUERIES = json.load(open(sys.argv[1])) if len(sys.argv) > 1 else {}


def search(q, page_size=8):
    params = {
        "q": q,
        "license_type": "commercial,modification",
        "category": "photograph",
        "page_size": page_size,
        "mature": "false",
    }
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "SpartconSiteBuild/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            return json.load(r).get("results", [])
    except Exception as e:  # noqa: BLE001
        print(f"  !! {q}: {e}", file=sys.stderr)
        return []


out = {}
for slug, q in QUERIES.items():
    res = search(q)
    print(f"\n### {slug}  <-- '{q}'  ({len(res)} results)")
    keep = []
    for r in res:
        item = {
            "id": r.get("id"),
            "title": (r.get("title") or "").strip()[:95],
            "creator": r.get("creator"),
            "license": f"{r.get('license')} {r.get('license_version')}",
            "license_url": r.get("license_url"),
            "source": r.get("source"),
            "landing": r.get("foreign_landing_url"),
            "url": r.get("url"),
        }
        keep.append(item)
        print(f"  [{r.get('license')}] {item['title']}  | {r.get('creator')} | {r.get('source')}")
    out[slug] = keep
    time.sleep(0.4)

json.dump(out, open("scripts/candidates.json", "w"), indent=1)
print("\nwrote scripts/candidates.json", file=sys.stderr)
