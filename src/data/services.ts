/**
 * SERVICES — Spartcon's construction and engineering service lines.
 *
 * Content is taken from the supplied "Building Construction" company profile.
 * Obvious source typos are corrected in published copy ("Ruble" → "Rubble",
 * "Sheet Gladding" → "Sheet Cladding", "turkey" → "turnkey").
 *
 * To add a service line, append to `services` — navigation, the services hub,
 * the homepage divisions section and the footer all read from this array.
 */

export type ServiceCapability = {
  title: string;
  summary: string;
  items?: string[];
};

export type Service = {
  slug: string;
  navLabel: string;
  title: string;
  strapline: string;
  metaTitle: string;
  metaDescription: string;
  image: string | null;
  bodyImage?: string | null;
  intro: string;
  body: string[];
  capabilities: ServiceCapability[];
  index: string;
};

export const services: Service[] = [
  {
    slug: "building-construction",
    navLabel: "Building Construction",
    title: "Building Construction",
    strapline: "Foundations, structures and steel",
    metaTitle: "Building Construction | Spartcon",
    metaDescription:
      "Spartcon delivers building construction — engineering design, foundations, mega structures, concrete and structural steel, with construction management support.",
    image: "construction-cranes-city-skyline",
    bodyImage: "concrete-pour-base-slab",
    index: "01",
    intro:
      "We offer professional service in building construction projects from professional engineering and project management throughout the construction value chain.",
    body: [
      "Our industry experience ranges from single to multiple storey buildings with complex structural loads. We have in-house construction support solutions — including onsite concrete batch plant, formwork and scaffolding — geared up to equip any concrete project and reduce your cost and risk.",
      "Our diversified construction skills lead us as a noteworthy construction company that is rooted in its reputation of work. We are passionate and committed in building infrastructure that resonates with our company culture and client needs.",
    ],
    capabilities: [
      {
        title: "Engineering Design Services",
        summary:
          "Engineering design across architectural, civil, mechanical and electrical disciplines, with quantity surveying support.",
        items: [
          "Design and modelling",
          "Project budgeting and estimation",
          "Compliance management",
          "Architectural and structural design input",
        ],
      },
      {
        title: "Foundations",
        summary:
          "Foundation is paramount to any building structure. We specialise in various foundation types, with years of practical experience in concrete structures.",
        items: [
          "Strip, raft and pad foundations",
          "Column footing foundations",
          "Piling",
        ],
      },
      {
        title: "Mega Structures",
        summary:
          "We have erected structures in industries including mining and commercial buildings, with a team of competent, qualified tradesmen in the building industry.",
        items: [
          "Load-bearing cavity walls",
          "Reinforced concrete walls",
          "Structural steel support",
          "Concrete and masonry structures",
        ],
      },
      {
        title: "Concrete Structures",
        summary:
          "We specialise in constructing vertical, horizontal and transverse columns, and in slab development and erection across multiple structural forms.",
        items: [
          "Design and shuttering of formwork",
          "Reinforcing",
          "Casting of concrete",
          "Testing and signoff",
          "Onsite concrete batch plant",
        ],
      },
      {
        title: "Structural Steel",
        summary:
          "We operate a full factory facility equipped to design, fabricate and apply corrosion protection to structural steel portals, with onsite fabrication and testing capability.",
        items: [
          "Design",
          "Fabrication",
          "Erection",
          "Sheet cladding",
          "Technical compliance and signoff",
          "Corrosion protection",
        ],
      },
      {
        title: "Construction Management & Support",
        summary:
          "Programme planning, resource management and contract accounting, with engineering expert trades platform and technical support furnished to the project.",
        items: [
          "Programme planning",
          "Trades expertise rationale",
          "Resource management",
          "Contract accounting",
          "Quality Control Programme (QCP)",
        ],
      },
    ],
  },
  {
    slug: "civil-engineering",
    navLabel: "Civil Engineering",
    title: "Civil Engineering",
    strapline: "Earthworks, roads, water and sanitation",
    metaTitle: "Civil Engineering | Spartcon",
    metaDescription:
      "Spartcon's civil engineering capability covers bulk earthworks, road construction, water treatment, distribution networks, pumping stations and sanitation infrastructure.",
    image: "road-cape-town-stellenbosch",
    bodyImage: "pipeline-construction-trench",
    index: "02",
    intro:
      "Our engineers, site foremen and plant operators are conversant with executing mega earthworks projects in multidisciplinary civil works, ranging from deep foundations to roads.",
    body: [
      "We pride ourselves on project execution methodologies that are output driven from inception to completion. Our dedicated teams are trained to be target orientated to ensure consistency in quality and speed of delivery.",
      "We have delivered mega pipeline projects cutting across multiple communities with various landscape and terrain challenges, and have executed turnkey projects in sectors including mining, commercial and residential.",
    ],
    capabilities: [
      {
        title: "Bulk Earthworks",
        summary:
          "Large-volume earthmoving executed with a dedicated pool of plant, with operators skilled in autonomous onsite maintenance to reduce downtime.",
        items: [
          "Grubbing and clearing",
          "Rubble removal",
          "Top and sub-soil excavations",
          "Hard rock excavations",
          "Rock breaking and demolitions",
          "Layering, levelling and compaction",
          "Soil chemical treatment",
          "Base finishing",
        ],
      },
      {
        title: "Road Construction",
        summary:
          "We design and build road infrastructure that has stood the test of time in durability and performance, in accordance with recognised industry standards and specifications.",
        items: [
          "Provincial, local municipal and facilities internal roads",
          "Low to medium lying bridges",
          "Sidewalks",
          "Planning, design, construction and maintenance",
        ],
      },
      {
        title: "Water Infrastructure",
        summary:
          "A professional team of engineers to design, build, install and maintain water works for facilities and bulk infrastructure networks.",
        items: [
          "Water treatment plants",
          "Distribution networks",
          "Pumping stations",
          "Transmission pipelines",
          "Bulk storage",
          "Development of underground water sources",
        ],
      },
      {
        title: "Sanitation",
        summary:
          "Sanitation infrastructure delivered across mining, commercial and residential sectors.",
        items: [
          "Sanitation infrastructure",
          "Septic tanks",
          "VIP toilets",
          "Sewer networks",
        ],
      },
    ],
  },
  {
    slug: "construction-support-solutions",
    navLabel: "Construction Support",
    title: "Construction Support Solutions",
    strapline: "Plant, machinery and site capability",
    metaTitle: "Construction Support Solutions | Spartcon",
    metaDescription:
      "Spartcon's Construction Support Solutions division manages a pool of plant and machinery, onsite concrete batch plant, formwork and scaffolding for construction projects.",
    image: "standby-generator-installation",
    bodyImage: "excavator-street-works-night",
    index: "03",
    intro:
      "We have a dedicated Construction Support Solutions division which manages a pool of plant and machinery, ensuring we have efficient plant that performs exceptionally at all times.",
    body: [
      "Plant availability is often what determines whether a programme holds. Our plant operators are skilled in performing autonomous maintenance onsite to reduce downtime, which keeps productivity on the critical path rather than in a workshop queue.",
      "This division also provides the in-house packages that equip our concrete and structural work — onsite concrete batch plant, formwork and scaffolding — reducing both cost and risk on a project.",
    ],
    capabilities: [
      {
        title: "Plant & Machinery Pool",
        summary:
          "A managed pool of construction plant and machinery, maintained to perform exceptionally and deployed with skilled operators.",
        items: [
          "Earthmoving plant",
          "Skilled plant operators",
          "Autonomous onsite maintenance",
          "Downtime reduction",
        ],
      },
      {
        title: "Onsite Concrete Batch Plant",
        summary:
          "In-house concrete batching brought to site, supporting concrete structures without dependence on external supply schedules.",
        items: ["Onsite batching", "Supply continuity", "Cost and risk reduction"],
      },
      {
        title: "Formwork & Scaffolding",
        summary:
          "Standard to custom formwork designed by experienced concrete specialists, with scaffolding to support the works.",
        items: [
          "Standard and custom formwork design",
          "Shuttering",
          "Scaffolding",
          "Access provision",
        ],
      },
    ],
  },
];

export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

/**
 * ENGINEERING DISCIPLINES — the professional capability behind the service
 * lines, from the Engineering section of the Building Construction profile.
 */
export const engineeringDisciplines = {
  core: {
    title: "Core competencies",
    items: [
      "Architectural",
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Quantity Surveying",
    ],
  },
  support: {
    title: "Support consultancy",
    items: ["Fire management", "Energy management", "Security management"],
  },
  packages: {
    title: "End-to-end packages",
    items: [
      "Design and modelling",
      "Project budgeting and estimation",
      "Compliance management",
    ],
  },
  outsourced: {
    title: "Outsourced professional services",
    items: [
      "Geotechnical assessment",
      "Environmental assessment",
      "Town planning",
      "Land surveying",
    ],
  },
} as const;

/** Operating strategy focus areas, from the Building Construction profile. */
export const operatingStrategy = [
  "Programme planning",
  "Trades expertise rationale",
  "Resource management",
  "Contract accounting",
  "Risk management",
  "Quality management",
  "Health and safety",
] as const;
