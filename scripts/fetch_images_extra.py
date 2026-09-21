#!/usr/bin/env python3
"""Second sourcing pass: sector imagery + replacements for weak/mislabelled files."""
import fetch_images as fi

fi.SELECTION = {
    "johannesburg-city-skyline": (
        "Newtown Johannesburg.jpg",
        "Johannesburg city skyline viewed from Newtown, South Africa",
        "Commercial",
    ),
    "office-tower-concrete-frame": (
        "Concrete skyscraper.jpg",
        "Reinforced concrete office tower in South Africa",
        "Commercial",
    ),
    "municipal-administration-building": (
        "Thaba Chweu Municipality - Graskop Administration Unit.jpg",
        "Municipal administration building at Graskop, Mpumalanga, South Africa",
        "Government",
    ),
    "hotel-riviera-on-vaal": (
        "Riviera on Vaal Hotel.jpg",
        "Hotel and conference property on the Vaal River, South Africa",
        "Hospitality",
    ),
    "residential-development": (
        "Dunluce Residence.jpg",
        "Contemporary residential property in South Africa",
        "Residential",
    ),
    "solar-water-heating-south-africa": (
        "DomesticSolarHeater SouthAfrica.jpg",
        "Solar water heating installation on a rooftop in South Africa",
        "Energy",
    ),
}

if __name__ == "__main__":
    fi.CREDITS = "src/data/image-credits.extra.json"
    fi.main()
