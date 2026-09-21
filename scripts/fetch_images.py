#!/usr/bin/env python3
"""Download the curated Spartcon image set from Wikimedia Commons.

Every image here is a REAL PHOTOGRAPH under a licence that permits commercial
use (CC0 / Public Domain / CC BY / CC BY-SA). No AI-generated imagery is used.

Each download records author, licence and source page so the site can render a
complete, honest attribution list on /image-credits.

Images are stored in src/assets/images/ so Astro can optimise them at build
time (WebP/AVIF, responsive widths, lazy loading).
"""
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from commons import UA, api, clean  # noqa: E402

OUT = "src/assets/images"
CREDITS = "src/data/image-credits.generated.json"

# slug -> (Commons file name, alt text, subject grouping)
SELECTION = {
    # ---------------------------------------------------------------- building
    "construction-cranes-city-skyline": (
        "CBD Cranes.jpg",
        "Tower cranes rising above a city centre building construction site at dusk",
        "Building Construction",
    ),
    "station-construction-site": (
        "20210519 Ny Ellebjerg Station 750A6745-3 (51192893861).jpg",
        "Large-scale station construction site with cranes, excavation and temporary works",
        "Building Construction",
    ),
    "concrete-pour-base-slab": (
        "Pouring concrete for a base slab under the 43rd St Bridge 07-30-2019 (48441365646).jpg",
        "Construction crew placing and levelling concrete for a heavily reinforced base slab",
        "Concrete",
    ),
    "reinforcement-bars-foundation": (
        "Placing of reinforcement bars at foundation level.jpg",
        "Reinforcing bars being fixed at foundation level before a concrete pour",
        "Foundations",
    ),
    "reinforcing-steel-south-africa": (
        "Reinforcing.jpg",
        "Steel reinforcement fixed in place on a South African construction site",
        "Foundations",
    ),
    "formwork-concrete-structure": (
        "Chantier de construction du 20 rue Pierre Chesneau à Saint Rémy lès Chevreuse 13.jpg",
        "Formwork and propping supporting a reinforced concrete structure under construction",
        "Concrete",
    ),
    # ------------------------------------------------------------------- civil
    "excavator-bulk-earthworks": (
        "Baustelle - Flickr - MoWePhoto.de.jpg",
        "Tracked excavator working an open excavation on a bulk earthworks site",
        "Bulk Earthworks",
    ),
    "pipeline-construction-trench": (
        "EUGAL-Baustelle.jpg",
        "Large-diameter pipeline being installed in an open trench by earthmoving plant",
        "Water & Sanitation",
    ),
    "road-cape-town-stellenbosch": (
        "Beautiful road from Cape Town to Stellenbosch.jpg",
        "Surfaced multi-lane road through the Western Cape landscape in South Africa",
        "Roads",
    ),
    "johannesburg-water-reservoir": (
        "Johannesburg Water E-rand Reservoir.jpg",
        "Municipal water reservoir infrastructure on the East Rand, Johannesburg",
        "Water Infrastructure",
    ),
    "water-conveyor-south-africa": (
        "Water Conveyor.jpg",
        "Bulk water conveyance infrastructure in South Africa",
        "Water Infrastructure",
    ),
    "sterkfontein-driekloof-dam": (
        "Sterkfontein-Driekloof Dam.JPG",
        "Driekloof Dam wall and spillway structure at Sterkfontein, South Africa",
        "Water Infrastructure",
    ),
    # --------------------------------------------------------------- industries
    "ferrochrome-smelter-mpumalanga": (
        "Xstrata ferrochroom-smelteraanleg, Lydenburg, Mpumalanga.jpg",
        "Ferrochrome smelter plant near Lydenburg, Mpumalanga, South Africa",
        "Industrial",
    ),
    "paper-mill-mpumalanga": (
        "Mpact-papiermeule, Piet Retief, Mpumalanga, a.jpg",
        "Paper mill industrial complex at Piet Retief, Mpumalanga, South Africa",
        "Industrial",
    ),
    "iron-ore-mining-thabazimbi": (
        "Thabazimbi - Iron ore mining - 001.JPG",
        "Iron ore mining operation and benched excavation at Thabazimbi, South Africa",
        "Mining",
    ),
    "sandton-skyline-johannesburg": (
        "Sandton Sky Views.jpg",
        "Commercial office towers in the Sandton business district of Johannesburg",
        "Commercial",
    ),
    "shopping-centre-riebeeckstad": (
        "Shopping centre in Riebeeckstad.jpg",
        "Retail shopping centre building and forecourt in Riebeeckstad, South Africa",
        "Retail",
    ),
    "mediclinic-welkom": (
        "Mediclinic in Meulin street, Welkom.jpg",
        "Private hospital building in Welkom, Free State, South Africa",
        "Medical",
    ),
    "warehouse-loading-bay": (
        "DFC 5396 Night shift at the loading bay delivery trucks parked inside a dimly lit warehouse in Pattaya.jpg",
        "Distribution warehouse loading bay with delivery vehicles during a night shift",
        "Warehousing",
    ),
    # ------------------------------------------------- spartcon tech: hvac etc
    "air-cooled-liquid-chiller": (
        "Air Cooled Liquid Chiller.jpg",
        "Air-cooled liquid chiller installed externally as part of a building cooling plant",
        "HVAC",
    ),
    "air-handling-units-commercial": (
        "Air handling units in large commercial building, Brisbane.jpg",
        "Rows of air handling units serving a large commercial building",
        "HVAC",
    ),
    "air-handling-unit-plantroom": (
        "HVAC Air Handler Unit, pic1.JPG",
        "Air handling unit with insulated ductwork inside a building plant room",
        "Ventilation",
    ),
    "mechanical-plant-room": (
        "Teknisk rom (School build. Lilleh. Norway 2024-09. Mechan. room Air ventil. Hot water Heat recov. unit) Hovedfordeler Varmeanlegg Ventilasjon Aggregat Isol. rør kanaler elkabler stige Varmegjenvinner Avtrekksvifte luftfilter lager vas.jpg",
        "Building plant room containing ventilation, heating and electrical distribution equipment",
        "Facilities",
    ),
    "chiller-plant-machine-hall": (
        "Kreuzberg Viktoria-Quartier Maschinenhaus Kältemaschine-001.jpg",
        "Refrigeration machine installed in a building services machine hall",
        "Refrigeration",
    ),
    "medium-voltage-switchgear": (
        "Kraftwerk Naturns Krafthaus Schaltanlage.jpg",
        "Medium-voltage switchgear panels in an electrical switch room",
        "Electrical",
    ),
    "electrical-distribution-board": (
        "Distribution board - Slovakia 01.jpg",
        "Electrical distribution board with circuit breakers and labelled circuits",
        "Electrical",
    ),
    "standby-diesel-generator": (
        "2019-10-03 - TDE - Dieselgenerator.jpg",
        "Diesel generator set installed to provide standby power to a building",
        "Standby Power",
    ),
    "standby-generator-installation": (
        "Blue Grass Chemical Agent-Destruction Pilot Plant Standby Diesel Generator (12119019006).jpg",
        "Standby diesel generator installation serving a process plant facility",
        "Standby Power",
    ),
    "cooling-water-pumps-pipework": (
        "Closed cooling water system pumps and its pipe connections.jpg",
        "Closed-circuit cooling water pumps with valved pipework connections",
        "Water Systems",
    ),
    "centrifugal-pump": (
        "Centrifugal Pump.jpg",
        "Centrifugal pump coupled to its drive motor on a fabricated baseplate",
        "Water Systems",
    ),
    "heat-exchanger-tubes": (
        "Tubes in a heat exchanger.jpg",
        "Tube bundle inside a shell-and-tube heat exchanger",
        "Heat Exchangers",
    ),
    "heat-exchanger-bundle-extraction": (
        "Cologne Germany Bundle-extractor-01.jpg",
        "Heat exchanger tube bundle being withdrawn for inspection and cleaning",
        "Heat Exchangers",
    ),
    "industrial-boiler-house": (
        "Tehnostroy-vrn.ru.jpg",
        "Industrial boiler installation with associated pipework and controls",
        "Steam & Heating",
    ),
    "fire-sprinkler-installation": (
        "Sprinkler mit Druckbehälter.jpg",
        "Fire sprinkler installation with pressure vessel and distribution pipework",
        "Fire Systems",
    ),
    "water-treatment-plant": (
        "Galler vid Staffanstorps reningsverk.jpg",
        "Screening and treatment stage at a water treatment works",
        "Water Treatment",
    ),
    "wastewater-aeration-basins": (
        "Gresham Wastewater Treatment Plant aeration basins 2025.jpg",
        "Aeration basins at a wastewater treatment plant",
        "Wastewater",
    ),
    "solar-photovoltaic-array-africa": (
        "Champ de panneaux solaires au Sénégal 01.jpg",
        "Ground-mounted solar photovoltaic array at a generation site in Senegal",
        "Energy",
    ),
}


def commons_meta(filename):
    data = api(
        {
            "action": "query",
            "titles": "File:" + filename,
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|size|mime",
            "iiurlwidth": "2400",
        }
    )
    pages = data.get("query", {}).get("pages", {})
    page = next(iter(pages.values()))
    if "imageinfo" not in page:
        raise RuntimeError(f"no imageinfo for {filename}")
    ii = page["imageinfo"][0]
    meta = ii.get("extmetadata", {})

    def m(k):
        return clean(meta.get(k, {}).get("value", ""))

    return {
        "thumb": ii.get("thumburl") or ii.get("url"),
        "width": ii.get("width"),
        "height": ii.get("height"),
        "license": m("LicenseShortName") or m("License"),
        "licenseUrl": m("LicenseUrl"),
        "author": m("Artist") or "Unknown author",
        "page": ii.get("descriptionurl"),
        "description": m("ImageDescription"),
    }


def main():
    os.makedirs(OUT, exist_ok=True)
    credits = {}
    failures = []
    for slug, (filename, alt, subject) in SELECTION.items():
        dest = f"{OUT}/{slug}.jpg"
        try:
            meta = commons_meta(filename)
        except Exception as e:  # noqa: BLE001
            print(f"  META FAIL {slug}: {e}")
            failures.append(slug)
            continue
        if not os.path.exists(dest):
            try:
                req = urllib.request.Request(meta["thumb"], headers={"User-Agent": UA})
                with urllib.request.urlopen(req, timeout=180) as r:
                    blob = r.read()
                with open(dest, "wb") as f:
                    f.write(blob)
                kb = len(blob) // 1024
                print(f"  ok  {slug}.jpg  ({kb} KB)")
            except Exception as e:  # noqa: BLE001
                print(f"  DL FAIL {slug}: {e}")
                failures.append(slug)
                continue
        else:
            print(f"  skip {slug}.jpg (exists)")
        credits[slug] = {
            "slug": slug,
            "file": f"{slug}.jpg",
            "alt": alt,
            "subject": subject,
            "author": re.sub(r"\s+", " ", meta["author"])[:120],
            "license": meta["license"],
            "licenseUrl": meta["licenseUrl"],
            "sourcePage": meta["page"],
            "source": "Wikimedia Commons",
            "originalFileName": filename,
        }

    os.makedirs("src/data", exist_ok=True)
    json.dump(credits, open(CREDITS, "w"), indent=1, ensure_ascii=False)
    print(f"\n{len(credits)} images credited -> {CREDITS}")
    if failures:
        print("FAILURES:", failures)


if __name__ == "__main__":
    main()
