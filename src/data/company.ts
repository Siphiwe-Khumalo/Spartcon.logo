/**
 * COMPANY PROFILE — single source of truth for Spartcon corporate information.
 *
 * ======================= SOURCE OF TRUTH & GOVERNANCE =======================
 * Content below is taken from Spartcon's own supplied company profiles:
 *   [BC]  "Building Construction" profile
 *   [FE]  "Facilities Engineering" profile
 *
 * Every field carries an explicit `verified` state. The UI only presents a
 * value as fact when `verified === true`; anything else renders through
 * <PendingValue> as "to be confirmed" rather than inventing a plausible value.
 *
 * Obvious typographic errors in the source documents have been corrected in
 * published copy (e.g. "Ruble" → "Rubble", "Sheet Gladding" → "Sheet Cladding",
 * "turkey" → "turnkey", "GNCSA" → "GBCSA"). Meaning is unchanged.
 * ===========================================================================
 */

export type Verified<T> = {
  value: T | null;
  verified: boolean;
  /** Shown to editors in place of a value, and used as the public fallback. */
  note?: string;
};

const pending = <T,>(note: string): Verified<T> => ({
  value: null,
  verified: false,
  note,
});

const confirmed = <T,>(value: T): Verified<T> => ({ value, verified: true });

export const company = {
  legalName: "Spartcon (Pty) Ltd",
  name: "Spartcon",

  /** Spartcon operates within the Spartan Group of companies. [FE] */
  group: {
    name: "Spartan Group",
    statement:
      "Spartcon (Pty) Ltd operates within the Spartan Group of companies.",
  },

  /** The Facilities Engineering division — not a separate company. */
  division: {
    name: "Spartcon Tech",
    descriptor: "Facilities Engineering by Spartcon",
    parentStatement:
      "Spartcon Tech is the Facilities Engineering division of Spartcon (Pty) Ltd.",
  },

  /** Positioning line, as used throughout the supplied profiles. */
  positioning:
    "Professional construction solutions for the African environment, by African professionals.",

  shortDescription:
    "Spartcon (Pty) Ltd is a 100% BEE South African construction and engineering company delivering building construction, civil engineering, construction support and facilities engineering.",

  metaDescription:
    "Spartcon (Pty) Ltd is a 100% BEE South African construction and engineering company. Building construction, civil engineering, construction support and facilities engineering through Spartcon Tech.",

  country: "South Africa",
  countryCode: "ZA",
  locale: "en-ZA",

  /* ------------------------------------------------------------- ownership */
  /** "100% BEE privately held corporation" [BC, FE] */
  ownership: confirmed("100% BEE privately held corporation"),

  /* ------------------------------------------------------------- history --
   * The two profiles give different start dates because they describe two
   * different activities. Both are recorded precisely rather than collapsing
   * them into one figure.
   * ---------------------------------------------------------------------- */
  history: {
    facilitiesEngineeringSince: confirmed(2008),
    constructionSince: confirmed(2018),
    facilitiesEngineeringNote:
      "Providing engineering services to clients throughout South Africa since 2008 under the Spartan Group of companies.",
    constructionNote:
      "Involved in the construction of government, facilities and commercial infrastructure since 2018.",
  },

  /* --------------------------------------------------------------- contact */
  contact: {
    email: confirmed("tshepom@spartcongroup.co.za"),
    /** Second address given in both profiles, on the Spartan Group domain. */
    emailAlternate: confirmed("tshepom@spartangroup.co.za"),
    emailTech: confirmed("tshepom@spartcongroup.co.za"),
    telephone: confirmed("083 291 6707"),
    contactPerson: confirmed("Tshepo M"),
    address: confirmed({
      street: "52 Belveder Road",
      suburb: "Glen Austin AH",
      city: "Midrand",
      province: "Gauteng",
      postalCode: "1864",
    }),
    /** Regional offices are referenced but not individually listed. [FE] */
    regionalOffices: confirmed(
      "Regional offices located strategically throughout South Africa."
    ),
    postalAddress: pending<string>("Postal address to be confirmed"),
    mapEmbedUrl: pending<string>(
      "Map embed to be confirmed against the registered office"
    ),
    officeHours: pending<string>("Office hours to be confirmed"),
  },

  /** Statutory registration numbers were not included in the profiles. */
  registration: {
    companyRegistrationNumber: pending<string>(
      "Company registration number to be confirmed"
    ),
    vatNumber: pending<string>("VAT registration number to be confirmed"),
  },

  social: {
    linkedin: pending<string>("LinkedIn company page to be confirmed"),
  },

  siteUrl: "https://www.spartcon.co.za",
  /** Earliest activity referenced in the supplied material. */
  copyrightStart: confirmed(2008),
} as const;

export { pending, confirmed };

/** True when a Verified<T> holds a publishable value. */
export function isPublished<T>(v: Verified<T>): v is Verified<T> & { value: T } {
  return v.verified && v.value !== null && v.value !== undefined;
}

/**
 * Approach pillars. Drawn from the operating strategies stated in both
 * profiles, plus the relationship and environmental commitments in [BC]/[FE].
 */
export const approachPillars = [
  {
    id: "partnership",
    title: "Partnership",
    summary:
      "Our partnership with you starts at your capital planning stage and runs through to project completion. We value sustainable and transparent relationships with our clients over profit.",
  },
  {
    id: "quality",
    title: "Quality Management",
    summary:
      "A systematic and consistent Quality Control Programme, tailored to each project or maintenance contract and continually updated. The onsite project manager ensures every facet is followed and maintained.",
  },
  {
    id: "risk",
    title: "Risk Management",
    summary:
      "We endeavour to understand your infrastructure needs in order to help you mitigate risk and achieve your objectives — advising on practical techniques and industry best practice to reduce both risk and cost.",
  },
  {
    id: "safety",
    title: "Health & Safety",
    summary:
      "Work is planned and executed to OHSA regulations, with minimum engineering standards including SANS and ASME applied across construction and facilities engineering alike.",
  },
  {
    id: "environment",
    title: "Environmental Responsibility",
    summary:
      "Our Green Building Programme supports environmental stewardship, assisting facilities towards Green Building Council South Africa certification through engineering design, build, install, operate and maintenance.",
  },
  {
    id: "engineering",
    title: "Professional Engineering",
    summary:
      "Our construction and engineering managers are registered with ECSA and SACPCMP as professional engineers, bringing the hands-on experience essential to delivering quality projects on time.",
  },
  {
    id: "lifecycle",
    title: "Asset Lifecycle Value",
    summary:
      "Solutions are oriented towards maximising asset lifecycle value and ensuring continuous optimum performance of infrastructure, facilities and buildings.",
  },
] as const;

/** PLAN → DESIGN → BUILD → INSTALL → OPERATE → MAINTAIN */
export const lifecycle = [
  {
    step: "01",
    title: "Plan",
    summary:
      "Programme planning, resource management and contract accounting from your capital planning stage onwards.",
  },
  {
    step: "02",
    title: "Design",
    summary:
      "Engineering design across architectural, civil, mechanical and electrical disciplines, with design and modelling, budgeting and estimation.",
  },
  {
    step: "03",
    title: "Build",
    summary:
      "Foundations, concrete and masonry structures, structural steel, bulk earthworks, roads, water and sanitation.",
  },
  {
    step: "04",
    title: "Install",
    summary:
      "Installation and commissioning of HVAC, electrical, water, steam, fire and security systems to OEM and SANS standards.",
  },
  {
    step: "05",
    title: "Operate",
    summary:
      "Engineering labour, operations platforms and technical support maintaining mechanical, electrical, plumbing and utility systems.",
  },
  {
    step: "06",
    title: "Maintain",
    summary:
      "Predictive, pre-emptive and reactive maintenance managed across the asset lifecycle with minimum disruption.",
  },
] as const;

/**
 * Engineering standards referenced in the supplied profiles. Useful as a
 * credibility signal and genuinely verifiable, unlike invented statistics.
 */
export const standards = [
  {
    code: "SANS 347:2007",
    scope:
      "Categorisation and conformity assessment criteria for all pressure equipment — steam generation, reticulation and heat exchange.",
  },
  {
    code: "SANS 10142-1",
    scope: "Requirements for electrical installations — low-voltage installations.",
  },
  {
    code: "SANS 10400",
    scope: "National Building Regulations — applied to mechanical ventilation systems.",
  },
  {
    code: "SANS 10147:2014 / SABS 0147",
    scope: "Refrigerating systems and cold/freezer room conditions.",
  },
  {
    code: "OHSA",
    scope:
      "Occupational Health and Safety Act, including Vessels under Pressure regulations R.3(1)(a).",
  },
  {
    code: "ASME",
    scope: "American Society of Mechanical Engineers codes applied as minimum engineering standards.",
  },
  {
    code: "OEM standards",
    scope: "Original equipment manufacturer operational and maintenance specifications.",
  },
] as const;
