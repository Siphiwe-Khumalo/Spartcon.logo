#!/usr/bin/env python3
"""Finalise the image library after visual review.

Every image in the shipped set was opened and visually checked. Files that were
mislabelled by their Commons title are renamed to describe what they actually
show, and files that were weak, ambiguous or unrepresentative are removed
rather than used misleadingly.
"""
import json
import os

IMG = "src/assets/images"

# Removed after visual review: mislabelled by source title, low quality, or
# not genuinely representative of the section they were intended for.
DROP = [
    "sandton-skyline-johannesburg",       # actually a dark field, not a skyline
    "solar-photovoltaic-array-africa",    # no panels visible
    "standby-diesel-generator",           # temporary event generators
    "fire-sprinkler-installation",        # a single extinguisher, not a system
    "industrial-boiler-house",            # blurred control panel only
    "electrical-distribution-board",      # scruffy legacy board
    "chiller-plant-machine-hall",         # heritage machine hall
    "office-tower-concrete-frame",        # abstract heritage detail
    "residential-development",            # heritage house, not housing delivery
]

# slug -> (new slug, corrected alt text)
RENAME = {
    "reinforcing-steel-south-africa": (
        "structural-steel-welding",
        "Welder joining structural steel members on site, wearing a helmet and gloves",
    ),
    "excavator-bulk-earthworks": (
        "excavator-street-works-night",
        "Wheeled excavator with a grab attachment on an urban services excavation at night",
    ),
    "water-treatment-plant": (
        "bottling-line-operator",
        "Operator monitoring bottled water moving along a production line",
    ),
    "medium-voltage-switchgear": (
        "electrical-substation-switchyard",
        "Electrical substation switchyard with outdoor busbars and a control building",
    ),
}

# Corrected alt text for files that keep their slug.
ALT_FIX = {
    "johannesburg-water-reservoir": "Elevated municipal water reservoir tower beside a road in Gauteng, South Africa",
    "reinforcement-bars-foundation": "Worker fixing steel reinforcement inside a foundation trench in red African soil",
    "iron-ore-mining-thabazimbi": "Access road and benched excavation at an iron ore mine near Thabazimbi, South Africa",
    "ferrochrome-smelter-mpumalanga": "Ferrochrome smelter complex in the Mpumalanga landscape, South Africa",
    "standby-generator-installation": "Mobile crane lifting a large generator package into position while riggers guide the load",
    "air-handling-unit-plantroom": "Large air handling unit installed along a basement plant room",
    "formwork-concrete-structure": "Wall formwork and starter bars set up for a reinforced concrete structure",
    "warehouse-loading-bay": "Distribution warehouse loading bay with delivery vehicles",
    "sterkfontein-driekloof-dam": "Dam and reservoir in the South African highlands",
}


def main():
    credits = {}
    for f in ("src/data/image-credits.generated.json", "src/data/image-credits.extra.json"):
        if os.path.exists(f):
            credits.update(json.load(open(f)))

    for slug in DROP:
        p = f"{IMG}/{slug}.jpg"
        if os.path.exists(p):
            os.remove(p)
            print(f"  dropped {slug}")
        credits.pop(slug, None)

    for old, (new, alt) in RENAME.items():
        op, np_ = f"{IMG}/{old}.jpg", f"{IMG}/{new}.jpg"
        if os.path.exists(op):
            os.rename(op, np_)
            print(f"  renamed {old} -> {new}")
        if old in credits:
            entry = credits.pop(old)
            entry["slug"] = new
            entry["file"] = f"{new}.jpg"
            entry["alt"] = alt
            credits[new] = entry

    for slug, alt in ALT_FIX.items():
        if slug in credits:
            credits[slug]["alt"] = alt

    ordered = {k: credits[k] for k in sorted(credits)}
    json.dump(ordered, open("src/data/image-credits.json", "w"), indent=1, ensure_ascii=False)
    for f in ("src/data/image-credits.generated.json", "src/data/image-credits.extra.json"):
        if os.path.exists(f):
            os.remove(f)

    on_disk = {f[:-4] for f in os.listdir(IMG) if f.endswith(".jpg")}
    print(f"\n{len(ordered)} credited / {len(on_disk)} files on disk")
    missing = on_disk ^ set(ordered)
    if missing:
        print("MISMATCH:", missing)


if __name__ == "__main__":
    main()
