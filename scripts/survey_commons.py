#!/usr/bin/env python3
"""Survey Wikimedia Commons for real, freely-licensed photographs.

Commons is used as the primary image source because it provides:
  - genuine photographs (no AI generation)
  - high resolution originals
  - explicit machine-readable licensing + author metadata for attribution
  - strong coverage of African / South African infrastructure and industry

Nothing is downloaded here. Candidates are printed for curation.
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "SpartconSiteBuild/1.0 (corporate website image sourcing)"

OK_LICENSES = re.compile(
    r"(cc0|cc[- ]?by(?![- ]?nc)|public domain|pd-|attribution)", re.I
)
BAD_LICENSES = re.compile(r"(nc|nd|non[- ]?commercial|fair use|copyright)", re.I)


def clean(html):
    if not html:
        return ""
    txt = re.sub(r"<[^>]+>", " ", str(html))
    txt = urllib.parse.unquote(txt)
    return re.sub(r"\s+", " ", txt).strip()


def search(query, limit=12):
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"filetype:bitmap {query}",
        "gsrnamespace": "6",
        "gsrlimit": str(limit),
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|size|mime",
        "iiurlwidth": "2000",
    }
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        data = json.load(r)
    pages = data.get("query", {}).get("pages", {})
    out = []
    for p in pages.values():
        ii = (p.get("imageinfo") or [{}])[0]
        if not ii or ii.get("mime") not in ("image/jpeg", "image/png"):
            continue
        w, h = ii.get("width", 0), ii.get("height", 0)
        if w < 1500 or w < h * 1.15:  # want large landscape
            continue
        meta = ii.get("extmetadata", {})

        def m(k):
            return clean(meta.get(k, {}).get("value", ""))

        lic = m("LicenseShortName") or m("License")
        out.append(
            {
                "title": p["title"].replace("File:", ""),
                "w": w,
                "h": h,
                "license": lic,
                "author": m("Artist") or "Unknown",
                "credit": m("Credit")[:80],
                "desc": m("ImageDescription")[:150],
                "page": ii.get("descriptionurl"),
                "thumb": ii.get("thumburl"),
                "orig": ii.get("url"),
            }
        )
    return out


def usable(c):
    lic = c["license"]
    if BAD_LICENSES.search(lic) and not re.search(r"cc[- ]?by[- ]?sa", lic, re.I):
        return False
    return bool(OK_LICENSES.search(lic))


if __name__ == "__main__":
    queries = json.load(open(sys.argv[1]))
    allout = {}
    for slug, q in queries.items():
        try:
            res = search(q)
        except Exception as e:  # noqa: BLE001
            print(f"\n### {slug} -- ERROR {e}")
            continue
        res = [c for c in res if usable(c)]
        allout[slug] = res
        print(f"\n### {slug}   <-- '{q}'   ({len(res)} usable)")
        for i, c in enumerate(res[:8]):
            print(f"  {i}. [{c['license']}] {c['w']}x{c['h']}  {c['title'][:88]}")
        time.sleep(0.3)
    json.dump(allout, open(sys.argv[2], "w"), indent=1)
    print(f"\n-> {sys.argv[2]}", file=sys.stderr)
