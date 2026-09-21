/**
 * PROJECTS & EXPERIENCE
 *
 * ========================== IMPORTANT — READ FIRST ==========================
 * NO PROJECT INFORMATION WAS SUPPLIED. The `projects` array below is therefore
 * intentionally EMPTY.
 *
 * Do not add illustrative, placeholder or example projects. Project names,
 * values, locations, clients, dates and outcomes are exactly the kind of claim
 * that must never be fabricated on a construction company's website — it is
 * misleading to prospective clients and damaging in a tender process.
 *
 * The /projects page detects the empty array and renders an experience and
 * capability presentation instead. The moment a real project is added here, the
 * page switches automatically to a project grid — no template changes needed.
 *
 * TO ADD A REAL PROJECT
 *   Append an object matching the `Project` type. Only `title`, `scope`,
 *   `summary` and `serviceLines` are required. Omit any field that has not been
 *   confirmed — the card renders around whatever is missing.
 * ===========================================================================
 */

export type Project = {
  slug: string;
  title: string;
  /** Client name — only include with the client's permission. */
  client?: string;
  location?: string;
  /** Year or range, e.g. "2024" or "2022–2024". */
  period?: string;
  /** Contract value. Only publish where Spartcon has confirmed it may be shown. */
  value?: string;
  /** Which service lines delivered the work. Slugs from services.ts. */
  serviceLines: string[];
  /** Industry slug from industries.ts. */
  industry?: string;
  scope: string[];
  summary: string;
  /** Image slug. Only use genuine project photography here. */
  image?: string | null;
  /** Confirms the imagery genuinely depicts this Spartcon project. */
  imageIsOfThisProject?: boolean;
};

/** Deliberately empty — see the notice above. */
export const projects: Project[] = [];

export const hasProjects = projects.length > 0;

/**
 * Experience presentation used while no projects are published.
 * These describe the TYPES of work Spartcon undertakes — drawn from the
 * supplied service lines — without asserting any specific engagement.
 */
export const experienceAreas = [
  {
    index: "01",
    title: "Structural Building Works",
    serviceLine: "building-construction",
    summary:
      "Foundations, reinforced concrete and structural steel forming the load-carrying structure of a building.",
    typicalScope: [
      "Foundation excavation and construction",
      "Reinforced concrete frames, slabs and elements",
      "Structural steel fabrication and erection",
      "Sequencing of structural trades against programme",
    ],
    image: "concrete-pour-base-slab",
  },
  {
    index: "02",
    title: "Civil & Infrastructure Works",
    serviceLine: "civil-engineering",
    summary:
      "Earthworks, roads and the water and sanitation networks that service a site or development.",
    typicalScope: [
      "Bulk earthworks and platform formation",
      "Road layerworks and surfacing",
      "Water reticulation and bulk supply",
      "Sanitation and sewer networks",
    ],
    image: "pipeline-construction-trench",
  },
  {
    index: "03",
    title: "Construction Management & Support",
    serviceLine: "construction-support-solutions",
    summary:
      "Management capability, plant and machinery supporting delivery on Spartcon and third-party contracts.",
    typicalScope: [
      "Construction management alongside the client team",
      "Plant and machinery provision",
      "Site capability and construction support",
      "Engineering input to buildability and method",
    ],
    image: "excavator-street-works-night",
  },
  {
    index: "04",
    title: "Facilities Engineering & Maintenance",
    serviceLine: "facilities-engineering",
    summary:
      "Installation, operation and maintenance of building systems through Spartcon Tech.",
    typicalScope: [
      "Installation and commissioning of building systems",
      "Predictive, pre-emptive and reactive maintenance",
      "Engineering labour and technical support",
      "Asset lifecycle and maintenance management",
    ],
    image: "mechanical-plant-room",
  },
] as const;
