/**
 * INDUSTRIES — sectors named in Spartcon's supplied company profiles.
 *
 * Construction experience [BC]: "mining, residential, factories, corporate
 * offices and warehouse spaces", plus "government, facilities and commercial".
 * Road work [BC]: "large mining infrastructure, commercial development,
 * housing development and state infrastructure".
 * Facilities Engineering market segments [FE]: "government facilities,
 * commercial office, hospitality, retail, residential estates, industrial,
 * medical".
 *
 * `image: null` is deliberate — where no genuine, relevant photograph could be
 * sourced the sector renders as a typographic composition rather than borrowing
 * a loosely-related image.
 */

export type Industry = {
  slug: string;
  title: string;
  shortTitle?: string;
  index: string;
  summary: string;
  relevance: string;
  /** Which parts of the business serve this sector. */
  served: ("Construction" | "Facilities Engineering")[];
  image: string | null;
};

export const industries: Industry[] = [
  {
    slug: "government-state-infrastructure",
    title: "Government / State Infrastructure",
    shortTitle: "Government",
    index: "01",
    served: ["Construction", "Facilities Engineering"],
    summary:
      "Public infrastructure and state facilities, where delivery is measured against public accountability as much as programme and cost.",
    relevance:
      "Spartcon has been involved in the construction of government infrastructure since 2018, and maintains government facilities as a Facilities Engineering market segment. CIDB grading and NHBRC registration support public-sector procurement.",
    image: "municipal-administration-building",
  },
  {
    slug: "mining",
    title: "Mining",
    index: "02",
    served: ["Construction", "Facilities Engineering"],
    summary:
      "Mining operations and their supporting surface infrastructure, where production continuity governs every decision on site.",
    relevance:
      "We have erected structures in mining and delivered large mining road infrastructure, bulk earthworks and turnkey water and sanitation projects for the sector.",
    image: "iron-ore-mining-thabazimbi",
  },
  {
    slug: "commercial-corporate",
    title: "Commercial / Corporate Offices",
    shortTitle: "Commercial",
    index: "03",
    served: ["Construction", "Facilities Engineering"],
    summary:
      "Offices and commercial property, where building services performance is directly visible to tenants and occupants.",
    relevance:
      "Construction experience spans corporate offices and commercial development. Commercial office is a core Facilities Engineering market segment, covering HVAC, electrical, water and security systems.",
    image: "johannesburg-city-skyline",
  },
  {
    slug: "industrial-manufacturing",
    title: "Industrial / Factories",
    shortTitle: "Industrial",
    index: "04",
    served: ["Construction", "Facilities Engineering"],
    summary:
      "Production and processing environments, where unplanned downtime has an immediate and measurable cost.",
    relevance:
      "Factory construction experience combined with facilities engineering across steam generation, heat exchange, compressed utilities and process-supporting plant.",
    image: "ferrochrome-smelter-mpumalanga",
  },
  {
    slug: "residential-housing",
    title: "Residential / Housing",
    shortTitle: "Residential",
    index: "05",
    served: ["Construction", "Facilities Engineering"],
    summary:
      "Housing delivery and residential estates, from the platform and services layer through to the built structure and its ongoing operation.",
    relevance:
      "NHBRC registered, with housing development road infrastructure and residential water and sanitation experience. Residential estates are a Facilities Engineering market segment.",
    image: null,
  },
  {
    slug: "warehousing",
    title: "Warehousing",
    index: "06",
    served: ["Construction", "Facilities Engineering"],
    summary:
      "Distribution and storage facilities, where large floor plates, structural spans and continuous operation define the brief.",
    relevance:
      "Construction experience includes warehouse spaces, supported by structural steel portal frame capability and facilities engineering for ventilation, refrigeration, fire systems and standby power.",
    image: "warehouse-loading-bay",
  },
  {
    slug: "hospitality",
    title: "Hospitality",
    index: "07",
    served: ["Facilities Engineering"],
    summary:
      "Hotels and hospitality properties, where guest experience depends on building systems staying invisible.",
    relevance:
      "A Facilities Engineering market segment. Covers HVAC, hot water and steam calorifiers, water treatment, commercial laundry and kitchen equipment, and standby power.",
    image: "hotel-riviera-on-vaal",
  },
  {
    slug: "retail",
    title: "Retail",
    index: "08",
    served: ["Facilities Engineering"],
    summary:
      "Retail centres and trading environments, where works are often carried out around live trading hours.",
    relevance:
      "A Facilities Engineering market segment. Covers HVAC, refrigeration and cold rooms, electrical reticulation, fire detection and suppression, and access and surveillance.",
    image: "shopping-centre-riebeeckstad",
  },
  {
    slug: "medical",
    title: "Medical",
    index: "09",
    served: ["Facilities Engineering"],
    summary:
      "Healthcare facilities, where building systems are clinical infrastructure and tolerance for failure is lowest.",
    relevance:
      "A Facilities Engineering market segment. Covers mechanical ventilation, water treatment, steam generation for sterilisation and laundry, standby power and fire systems.",
    image: "mediclinic-welkom",
  },
];

export const getIndustry = (slug: string): Industry | undefined =>
  industries.find((i) => i.slug === slug);
