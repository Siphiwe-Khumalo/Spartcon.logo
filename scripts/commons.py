#!/usr/bin/env python3
"""Wikimedia Commons sourcing helper for the Spartcon website.

Two modes:
  cat  <Category:Name> ...   -> list large landscape photos inside a category
  get  <selection.json>      -> download + convert selected files to WebP/JPEG

Commons is the primary image source: real photographs, high resolution, and
machine-readable author/licence metadata so every image can be attributed.
"""
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "SpartconSiteBuild/1.0 (https://www.spartcon.co.za; website image sourcing)"

OK = re.compile(r"(cc0|cc[- ]?by|public domain|pd[- ]|attribution)", re.I)
BAD = re.compile(r"(\bnc\b|\bnd\b|non[- ]?commercial|no[- ]?deriv|fair use)", re.I)


def clean(v):
    if not v:
        return ""
    t = re.sub(r"<[^>]+>", " ", str(v))
    return re.sub(r"\s+", " ", t).strip()


def api(params):
    params = {**params, "format": "json"}
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def info_from_page(p, min_w=1400, landscape=True):
    ii = (p.get("imageinfo") or [{}])[0]
    if not ii or ii.get("mime") not in ("image/jpeg", "image/png"):
        return None
    w, h = ii.get("width", 0), ii.get("height", 0)
    if w < min_w:
        return None
    if landscape and w < h * 1.15:
        return None
    meta = ii.get("extmetadata", {})

    def m(k):
        return clean(meta.get(k, {}).get("value", ""))

    lic = m("LicenseShortName") or m("License")
    if BAD.search(lic) and not re.search(r"cc[- ]?by[- ]?sa", lic, re.I):
        return None
    if not OK.search(lic):
        return None
    return {
        "title": p["title"].replace("File:", ""),
        "w": w,
        "h": h,
        "license": lic,
        "licenseUrl": m("LicenseUrl"),
        "author": m("Artist") or "Unknown author",
        "desc": m("ImageDescription")[:180],
        "page": ii.get("descriptionurl"),
        "orig": ii.get("url"),
    }


def list_category(cat, limit=60, min_w=1400, landscape=True):
    data = api(
        {
            "action": "query",
            "generator": "categorymembers",
            "gcmtitle": cat,
            "gcmtype": "file",
            "gcmlimit": str(limit),
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|size|mime",
        }
    )
    pages = data.get("query", {}).get("pages", {})
    out = []
    for p in pages.values():
        c = info_from_page(p, min_w, landscape)
        if c:
            out.append(c)
    out.sort(key=lambda c: -c["w"])
    return out


def search(q, limit=40, min_w=1400, landscape=True):
    data = api(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": f"filetype:bitmap {q}",
            "gsrnamespace": "6",
            "gsrlimit": str(limit),
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|size|mime",
        }
    )
    pages = data.get("query", {}).get("pages", {})
    out = []
    for p in pages.values():
        c = info_from_page(p, min_w, landscape)
        if c:
            out.append(c)
    out.sort(key=lambda c: -c["w"])
    return out


def fetch(url, timeout=120):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def thumb_url(orig, width=2200):
    """Build a Commons thumbnail URL so we never pull 40MB originals."""
    m = re.match(r"(https://upload\.wikimedia\.org/wikipedia/commons)/(\w)/(\w\w)/(.+)$", orig)
    if not m:
        return orig
    base, a, b, name = m.groups()
    return f"{base}/thumb/{a}/{b}/{name}/{width}px-{name}"


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode in ("cat", "search"):
        fn = list_category if mode == "cat" else search
        results = {}
        for target in sys.argv[2:]:
            try:
                res = fn(target)
            except Exception as e:  # noqa: BLE001
                print(f"\n### {target} ERROR {e}")
                continue
            results[target] = res
            print(f"\n### {target}  ({len(res)} usable)")
            for i, c in enumerate(res[:14]):
                print(f"  {i:2}. [{c['license']:<14}] {c['w']}x{c['h']}  {c['title'][:82]}")
            time.sleep(0.25)
        prev = {}
        if os.path.exists("scripts/pool.json"):
            prev = json.load(open("scripts/pool.json"))
        prev.update(results)
        json.dump(prev, open("scripts/pool.json", "w"), indent=1)
