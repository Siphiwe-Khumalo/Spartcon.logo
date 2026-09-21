/**
 * SPARTCON TECH — the Facilities Engineering division of Spartcon (Pty) Ltd.
 *
 * All content from the supplied "Facilities Engineering" company profile.
 * Standards references (SANS, SABS, OHSA, ASME) are quoted as stated there.
 *
 * NAMING NOTE FOR THE CLIENT: the supplied profile titles this division
 * "Spartcon Facilities Engineering", while the brief and the supplied logo use
 * "Spartcon Tech" / "Spartcon Technologies". The site follows the brief and
 * presents the division as Spartcon Tech, descriptor "Facilities Engineering by
 * Spartcon". Change `techBrand.name` here to switch it site-wide.
 */

export const techBrand = {
  name: "Spartcon Tech",
  descriptor: "Facilities Engineering by Spartcon",
  parentStatement:
    "Spartcon Tech is the Facilities Engineering division of Spartcon (Pty) Ltd.",
  positioning:
    "Outsourced engineering and maintenance solutions nationwide — maximising asset lifecycle value through predictive, pre-emptive and reactive maintenance.",
  metaDescription:
    "Spartcon Tech is the Facilities Engineering division of Spartcon (Pty) Ltd — outsourced engineering and maintenance for HVAC, electrical, water, steam, fire and security systems nationwide.",
  basePath: "/facilities-engineering",
} as const;

/** Market segments served, as listed in the Facilities Engineering profile. */
export const techMarketSegments = [
  "Government facilities",
  "Commercial office",
  "Hospitality",
  "Retail",
  "Residential estates",
  "Industrial",
  "Medical",
] as const;

/** Trades experience, as listed in the Facilities Engineering profile. */
export const techTrades = [
  "Water treatment",
  "Steam",
  "HVAC",
  "Fire",
  "Surveillance",
  "Plumbing",
  "Electrical",
  "Mechanical",
  "Facilities equipment",
  "General building maintenance",
] as const;

/* ========================================================================== */
/* BUILDING SYSTEMS                                                            */
/* ========================================================================== */

export type BuildingSystem = {
  slug: string;
  title: string;
  index: string;
  summary: string;
  scope: string[];
  /** Standards explicitly cited for this system in the source material. */
  standards?: string[];
  image: string | null;
  category: "Mechanical" | "Electrical" | "Water" | "Life Safety" | "Thermal" | "Equipment";
};

export const buildingSystems: BuildingSystem[] = [
  {
    slug: "hvac",
    title: "HVAC",
    index: "01",
    category: "Mechanical",
    summary:
      "Internal capacity to design, select, supply, install and maintain HVAC systems.",
    scope: ["Roof packaging", "Midwall splits", "Ceiling cassettes"],
    image: "air-cooled-liquid-chiller",
  },
  {
    slug: "ventilation",
    title: "Ventilation",
    index: "02",
    category: "Mechanical",
    summary:
      "Mechanical ventilation systems across supply and exhaust streams.",
    scope: [
      "Ducting",
      "Cooling systems",
      "Underfloor cooling systems",
      "Water-cooled systems",
      "Air-cooled systems",
    ],
    standards: ["SANS 10400"],
    image: "air-handling-unit-plantroom",
  },
  {
    slug: "refrigeration",
    title: "Refrigeration",
    index: "03",
    category: "Mechanical",
    summary:
      "Refrigeration units produced in conformity with cold and freezer room conditions to client specification.",
    scope: [
      "Evaporative",
      "Mechanical compression",
      "Absorption",
      "Thermoelectric",
    ],
    standards: ["SABS 0147", "SANS 10147:2014"],
    image: "air-handling-units-commercial",
  },
  {
    slug: "electrical",
    title: "Electrical",
    index: "04",
    category: "Electrical",
    summary:
      "Internal engineering capacity to design, install and maintain medium to low voltage electrical infrastructure.",
    scope: [
      "Municipal and Eskom feed compliance",
      "Medium voltage miniature substation",
      "Cabling and reticulation network",
      "MV and LV distribution boards",
      "LV reticulation",
      "External and internal lighting",
      "Equipment installation (VSDs and others)",
      "Earthing and lightning protection",
    ],
    standards: ["SANS 10142-1", "OHSA"],
    image: "electrical-substation-switchyard",
  },
  {
    slug: "standby-power",
    title: "Power Generation & Standby Power",
    index: "05",
    category: "Electrical",
    summary:
      "Design, installation and maintenance of standby power generation units and networks to OEM specification.",
    scope: [
      "Diesel, petrol and gas generators",
      "Power invertors (UPS and others)",
      "Solar generation",
    ],
    standards: ["SANS 10142-1"],
    image: "standby-generator-installation",
  },
  {
    slug: "water-works",
    title: "Water Works",
    index: "06",
    category: "Water",
    summary:
      "A professional team of engineers to design, build, install and maintain water works for facilities and bulk infrastructure networks.",
    scope: [
      "Pump stations",
      "Water storage (reservoirs, tanks and others)",
      "Purification plants",
      "Water pipelines",
      "Bulk water works",
      "Boreholes and equipping",
      "Fire pump sets",
    ],
    image: "cooling-water-pumps-pipework",
  },
  {
    slug: "wastewater",
    title: "Wastewater Treatment Works",
    index: "07",
    category: "Water",
    summary:
      "Design, build, installation and maintenance of waste treatment works for sewer sludge, slurry and other mediums, incorporating advanced technology through OEM linkages.",
    scope: [
      "Feed pumping and networks",
      "Filtration",
      "Separation",
      "Purification",
      "Dewatering process",
    ],
    image: "wastewater-aeration-basins",
  },
  {
    slug: "steam-generation",
    title: "Steam Generation",
    index: "08",
    category: "Thermal",
    summary:
      "Design, build, installation and maintenance of steam generation units for facilities heating requirements, working with international and local OEMs.",
    scope: [
      "Coal-fired boilers",
      "Gas-fired boilers",
      "Oil-fired boilers",
      "Fuel-fired boilers",
      "Steam and condensate reticulation",
      "Steam pipe insulation for heat control efficiency",
    ],
    standards: ["SANS 347:2007", "OHSA Vessels under Pressure R.3(1)(a)"],
    image: null,
  },
  {
    slug: "heating-heat-exchange",
    title: "Heating Systems & Heat Exchange",
    index: "09",
    category: "Thermal",
    summary:
      "Design, manufacture, installation and maintenance of heat exchangers to the guidelines for categorisation and conformity assessment of pressure equipment.",
    scope: [
      "Steam calorifiers",
      "Hot water storage vessels",
      "Condensers",
      "Evaporators",
    ],
    standards: ["SANS 347:2007"],
    image: "heat-exchanger-tubes",
  },
  {
    slug: "fire-systems",
    title: "Fire Systems",
    index: "10",
    category: "Life Safety",
    summary:
      "Fire detection and suppression systems for fire protection networks, designed, installed and monitored to client needs.",
    scope: [
      "Point smoke detection — ionisation chamber, optical and multisensor detectors",
      "Heat signature monitoring — point, linear and optical beam detectors",
      "Flame detectors",
      "Carbon monoxide detectors",
      "Water suppression",
      "Pressurised gas systems",
      "Foam deluge systems",
      "Chemical foam systems",
    ],
    image: null,
  },
  {
    slug: "security-systems",
    title: "Access & Surveillance",
    index: "11",
    category: "Life Safety",
    summary:
      "An integrated security solution based on intelligent infrastructure evaluation, design, installation and maintenance, using hardware and software from leading OEMs.",
    scope: [
      "Access and time management",
      "Biometric clocking",
      "Time and attendance management systems",
      "Turnstiles and boom gates",
      "Barrier entry control systems",
      "Internal and external cameras (IP, Wi-Fi and others)",
      "Alarm systems — contactors, beams, motion and heat sensors, control panels",
      "Intercoms — video monitored and audio",
      "Recording (DVR, NVR and others)",
      "Switches, Cat5/6 cabling and cabinets",
      "Backup drives and monitoring",
    ],
    image: null,
  },
  {
    slug: "facilities-equipment",
    title: "Facilities Equipment",
    index: "12",
    category: "Equipment",
    summary:
      "Design, build, selection, installation and maintenance of facilities equipment to OEM specifications, with distribution rights through international and local OEMs.",
    scope: [
      "Industrial washers — continuous batch and loader washers",
      "Dewatering presses — centrifugal and linear",
      "Dryers — steam and electrical",
      "Chest ironers — steam and electrical",
      "Packaging units — automatic and manual",
      "Cooking equipment, dishwashers and extractors",
      "Freezers, chillers, warmers and waste incineration",
    ],
    image: null,
  },
];

export const systemCategories = [
  "Mechanical",
  "Thermal",
  "Electrical",
  "Water",
  "Life Safety",
  "Equipment",
] as const;

export const getBuildingSystem = (slug: string): BuildingSystem | undefined =>
  buildingSystems.find((s) => s.slug === slug);

/* ========================================================================== */
/* MAINTENANCE & OPERATIONS                                                    */
/* ========================================================================== */

export type MaintenanceDiscipline = {
  id: string;
  index: string;
  title: string;
  summary: string;
  detail: string;
  appliesWhen: string;
};

export const maintenanceDisciplines: MaintenanceDiscipline[] = [
  {
    id: "predictive",
    index: "01",
    title: "Predictive Maintenance",
    summary: "Intervene before failure, based on equipment condition.",
    detail:
      "Predictive maintenance identifies deterioration while plant is still running, so work is scheduled against evidence rather than assumption — ensuring services are provided with minimum disruption.",
    appliesWhen:
      "Best suited to critical plant where failure is expensive and condition can be meaningfully measured.",
  },
  {
    id: "pre-emptive",
    index: "02",
    title: "Pre-emptive Maintenance",
    summary: "Planned intervals that protect reliability before faults form.",
    detail:
      "Pre-emptive maintenance keeps equipment within its intended operating condition to a planned schedule, reducing the number of faults that ever reach the reactive queue.",
    appliesWhen:
      "Appropriate across the majority of installed building systems, where interval-based work is proven and economic.",
  },
  {
    id: "reactive",
    index: "03",
    title: "Reactive Maintenance",
    summary: "Structured response when something has already failed.",
    detail:
      "Reactive maintenance restores service after a fault or breakdown. It is unavoidable in any estate, so it is organised deliberately — with response pathways and escalation rather than improvisation.",
    appliesWhen:
      "Always required as a capability; the objective is to reduce how much of the estate depends on it.",
  },
  {
    id: "asset-lifecycle",
    index: "04",
    title: "Life Cycle Management",
    summary: "Maximising asset lifecycle value from installation to replacement.",
    detail:
      "Our solutions are oriented towards maximising asset lifecycle value and ensuring continuous optimum performance of infrastructure, facilities and buildings.",
    appliesWhen:
      "Relevant wherever an owner carries long-term responsibility for installed engineering.",
  },
  {
    id: "asset-preservation",
    index: "05",
    title: "Asset Preservation",
    summary: "Protecting the condition and value of installed plant over time.",
    detail:
      "Asset preservation balances operational efficiency against environmental comfort, cost effectiveness, convenience and safety — so savings in one area are not paid for elsewhere.",
    appliesWhen:
      "Where an estate represents significant capital that must retain its value and performance.",
  },
  {
    id: "engineering-labour",
    index: "06",
    title: "Engineering Labour",
    summary: "Skilled people on site, operating and maintaining installed systems.",
    detail:
      "Spartcon furnishes engineering labour to maintain facilities mechanical, electrical, plumbing and utility systems. We employ engineers, technologists, technicians and skilled trades professionals.",
    appliesWhen:
      "Where an estate needs consistent technical presence rather than call-out attendance alone.",
  },
  {
    id: "operations-platforms",
    index: "07",
    title: "Operations Platform",
    summary: "The platform used to run engineering services day to day.",
    detail:
      "Our operations platform is tailored to each facility but built on consistent components: minimum engineering standards (SANS, ASME and others), OEM operational standards and OHSA regulations.",
    appliesWhen:
      "Where multiple systems, sites or teams need a single operating picture.",
  },
  {
    id: "technical-support",
    index: "08",
    title: "Technical Support",
    summary: "Engineering guidance for the teams operating the infrastructure.",
    detail:
      "Technical support gives client teams access to engineering judgement on installed systems. Our staff work closely with your personnel to meet key facilities services objectives.",
    appliesWhen:
      "Where the client retains operational control but needs engineering depth behind it.",
  },
];

/** Operating strategy focus areas, from the Facilities Engineering profile. */
export const techOperatingStrategy = [
  "Operational efficiency",
  "Asset preservation",
  "Life cycle management",
  "Safety",
] as const;

/* ========================================================================== */
/* ENGINEERING SERVICES                                                        */
/* ========================================================================== */

export const engineeringServices = [
  {
    index: "01",
    title: "Outsourced Engineering & Maintenance",
    summary:
      "Spartcon provides outsourced engineering and maintenance solutions nationwide, serving either small facilities or large facilities portfolios.",
    points: [
      "Nationwide coverage through regional offices",
      "Small facilities to large portfolios",
      "Engineers, technologists, technicians and skilled trades",
      "Staff working alongside your own personnel",
    ],
    image: "mechanical-plant-room",
  },
  {
    index: "02",
    title: "Design, Build & Install",
    summary:
      "Engineering systems designed, built, installed and commissioned so a facility becomes operational — not merely complete.",
    points: [
      "Mechanical, electrical, plumbing and utility systems",
      "Water works and wastewater treatment works",
      "Steam generation and heat exchange",
      "Installation to OEM and SANS standards",
    ],
    image: "standby-generator-installation",
  },
  {
    index: "03",
    title: "Facilities Equipment & OEM Supply",
    summary:
      "Facilities equipment designed, selected, installed and maintained in respect of OEM specifications, with distribution rights through international and local OEMs.",
    points: [
      "Laundry equipment",
      "Commercial kitchen equipment",
      "Economic value across the product life cycle",
      "OEM-backed maintenance",
    ],
    image: "heat-exchanger-bundle-extraction",
  },
  {
    index: "04",
    title: "Engineering Labour & Technical Support",
    summary:
      "Engineering labour, an operations platform and technical support furnished to maintain facilities systems, applying professional engineering management concepts.",
    points: [
      "Deployed engineering labour",
      "Operations platform tailored to each facility",
      "Technical support to in-house teams",
      "Quality Control Programme (QCP)",
    ],
    image: "centrifugal-pump",
  },
] as const;

/* ========================================================================== */
/* ENERGY & UTILITIES                                                          */
/* ========================================================================== */

export const energyUtilities = [
  {
    index: "01",
    title: "Energy Management",
    summary:
      "Electric utilities are one of the single largest controllable operating expenses related to facilities and real estate portfolios.",
    points: [
      "Energy audits",
      "Cost savings analysis and control",
      "Utility rebates",
      "Code compliance",
      "Energy-efficient product installation and updates",
    ],
    image: "solar-water-heating-south-africa",
  },
  {
    index: "02",
    title: "Energy Audit Programme",
    summary:
      "Spartcon has developed and implemented an Energy Audit Programme in use across different benchmarks, highlighting opportunities for operational efficiency.",
    points: [
      "Audit against established benchmarks",
      "Prioritised recommendations based on client input and objectives",
      "Operational efficiency opportunities",
    ],
    image: null,
  },
  {
    index: "03",
    title: "Metering & Electricity Cost Management",
    summary:
      "We partner with energy industry professionals to provide a web-based tool to manage electricity costs, applying knowledge of utilities, tariffs and rates.",
    points: [
      "Advanced metering technologies",
      "Tariff and rate analysis",
      "Web-based cost management tooling",
    ],
    image: null,
  },
  {
    index: "04",
    title: "Alternative & Standby Energy",
    summary:
      "Standby and alternative generation designed, installed and maintained to OEM specification and electrical installation standards.",
    points: [
      "Solar generation",
      "Diesel, petrol and gas generators",
      "Power invertors and UPS",
    ],
    image: "electrical-substation-switchyard",
  },
] as const;

/** Green Building Programme, from the Facilities Engineering profile. */
export const greenBuildingProgramme = {
  title: "Green Building Programme",
  intro:
    "Part of being a responsible member of the business community is being a responsible member of the world community and protecting the environment.",
  body: [
    "Spartcon has embraced green engineering, recognising that supporting and promoting environmental stewardship is a necessity. As we maintain or capitalise engineering projects, we evaluate your day-to-day operations, always looking for the most innovative and sustainable products to implement the programme.",
    "Our green programme strategy in energy and environmental design is designed to assist facilities in achieving Green Building Council South Africa (GBCSA) certification through a variety of initiatives — across engineering design, build, install, operate and maintenance of facilities.",
  ],
};

/* ========================================================================== */
/* MAINTENANCE MANAGEMENT                                                      */
/* ========================================================================== */

/**
 * The supplied approach: "flexible enough to either adopt the client's system
 * or introduce our own turnkey system."
 */
export const maintenanceManagement = {
  intro:
    "We have proven tools and processes to ensure standardised delivery of services, and we leverage leading technology to automate virtually every aspect of engineering and maintenance management.",
  flexibilityStatement:
    "We are flexible enough to either adopt the client's system or introduce our own turnkey system.",
  approaches: [
    {
      index: "01",
      title: "Adopt your existing system",
      summary:
        "Where a client already operates a maintenance management system, Spartcon Tech works inside it.",
      detail:
        "Your existing system remains the record of truth. Our teams plan, execute and record work within the platform your organisation already uses and reports from, so nothing fragments across parallel systems.",
      points: [
        "Adopt the client's existing platform and conventions",
        "Maintain a single maintenance record",
        "Report through established client processes",
      ],
    },
    {
      index: "02",
      title: "Introduce a Spartcon turnkey system",
      summary:
        "Where no suitable system is in place, Spartcon introduces its own turnkey maintenance management capability.",
      detail:
        "A Spartcon turnkey system establishes the asset register, maintenance schedules, work request pathways and reporting from the outset — giving an estate a maintenance record where previously there was none.",
      points: [
        "Asset register and equipment history",
        "Planned maintenance schedules",
        "Work request, execution and reporting pathways",
      ],
    },
  ],
  platformComponents: [
    {
      title: "Minimum engineering standards",
      detail: "SANS, ASME and other applicable engineering standards.",
    },
    {
      title: "OEM operational standards",
      detail:
        "Original equipment manufacturer operating and maintenance specifications.",
    },
    {
      title: "OHSA regulations",
      detail:
        "Occupational Health and Safety Act requirements, including pressure equipment regulations.",
    },
  ],
  capabilities: [
    "Asset registers and equipment history",
    "Planned, predictive and pre-emptive maintenance scheduling",
    "Work request and response pathways",
    "Maintenance records supporting compliance",
    "Reporting into client operational processes",
  ],
} as const;
