/**
 * CREDENTIALS, REGISTRATIONS & CLIENTS
 *
 * Sourced from Spartcon's supplied company profiles:
 *   [BC] Building Construction profile   [FE] Facilities Engineering profile
 *
 * `status: "verified"` means the credential is stated in Spartcon's own
 * material. Where a *registration number* was not supplied, the credential is
 * published (the company asserts it) but `registrationNumber` stays null — the
 * UI simply omits the number rather than inventing one.
 *
 * `status: "awaiting-verification"` items are NOT displayed as held. They are
 * listed as outstanding so the team knows what to supply.
 */

export type CredentialStatus = "verified" | "awaiting-verification";

export type Credential = {
  id: string;
  body: string;
  bodyFullName?: string;
  title: string;
  significance: string;
  /** Grades / designations exactly as stated in the source material. */
  grade: string | null;
  registrationNumber: string | null;
  detail: string | null;
  status: CredentialStatus;
  category:
    | "Statutory & Industry Registration"
    | "Professional Registration"
    | "Transformation & Compliance";
};

export const credentials: Credential[] = [
  {
    id: "cidb",
    body: "CIDB",
    bodyFullName: "Construction Industry Development Board",
    title: "Contractor Grading",
    significance:
      "CIDB grading determines the value and class of public-sector construction work a contractor may tender for in South Africa.",
    grade: "7ME · 7CE · 6GB PE",
    registrationNumber: null,
    detail:
      "Graded 7ME (mechanical engineering), 7CE (civil engineering) and 6GB PE (general building).",
    status: "verified",
    category: "Statutory & Industry Registration",
  },
  {
    id: "nhbrc",
    body: "NHBRC",
    bodyFullName: "National Home Builders Registration Council",
    title: "Home Builder Registration",
    significance:
      "NHBRC registration is a legal requirement for residential home building in South Africa and protects the housing consumer.",
    grade: null,
    registrationNumber: null,
    detail: "Registered with the National Home Builders Registration Council.",
    status: "verified",
    category: "Statutory & Industry Registration",
  },
  {
    id: "ecsa",
    body: "ECSA",
    bodyFullName: "Engineering Council of South Africa",
    title: "Professional Engineer Registration",
    significance:
      "ECSA registration confirms that named individuals are registered professionals entitled to take engineering responsibility.",
    grade: null,
    registrationNumber: null,
    detail:
      "Our construction and engineering managers are registered with ECSA as professional engineers.",
    status: "verified",
    category: "Professional Registration",
  },
  {
    id: "sacpcmp",
    body: "SACPCMP",
    bodyFullName:
      "South African Council for the Project and Construction Management Professions",
    title: "Construction Management Registration",
    significance:
      "SACPCMP registration covers the professional project and construction management roles on a built-environment appointment.",
    grade: null,
    registrationNumber: null,
    detail:
      "Our construction and engineering managers are registered with SACPCMP.",
    status: "verified",
    category: "Professional Registration",
  },
  {
    id: "bee",
    body: "B-BBEE",
    bodyFullName: "Broad-Based Black Economic Empowerment",
    title: "100% BEE Owned",
    significance:
      "Ownership status is routinely weighted in public-sector and large private-sector procurement in South Africa.",
    grade: "100% BEE",
    registrationNumber: null,
    detail: "A 100% BEE privately held corporation.",
    status: "verified",
    category: "Transformation & Compliance",
  },
  {
    id: "gbcsa",
    body: "GBCSA",
    bodyFullName: "Green Building Council South Africa",
    title: "Green Building Programme",
    significance:
      "Supports facilities pursuing GBCSA certification across design, build, install, operate and maintenance.",
    grade: null,
    registrationNumber: null,
    detail:
      "Our Green Building Programme is designed to assist facilities in achieving GBCSA certification.",
    status: "verified",
    category: "Transformation & Compliance",
  },

  /* ----------------------------- still outstanding ----------------------- */
  {
    id: "bee-level",
    body: "B-BBEE",
    bodyFullName: "Broad-Based Black Economic Empowerment",
    title: "Verified B-BBEE Contributor Level",
    significance:
      "Tenders usually require a specific verified contributor level and certificate, in addition to ownership percentage.",
    grade: null,
    registrationNumber: null,
    detail: null,
    status: "awaiting-verification",
    category: "Transformation & Compliance",
  },
  {
    id: "cipc",
    body: "CIPC",
    bodyFullName: "Companies and Intellectual Property Commission",
    title: "Company Registration Number",
    significance:
      "Required on formal documentation and in vendor onboarding processes.",
    grade: null,
    registrationNumber: null,
    detail: null,
    status: "awaiting-verification",
    category: "Statutory & Industry Registration",
  },
  {
    id: "tax-compliance",
    body: "SARS",
    bodyFullName: "South African Revenue Service",
    title: "Tax Compliance Status",
    significance:
      "A standard prerequisite in tender and vendor onboarding processes.",
    grade: null,
    registrationNumber: null,
    detail: null,
    status: "awaiting-verification",
    category: "Statutory & Industry Registration",
  },
  {
    id: "coid",
    body: "COID",
    bodyFullName:
      "Compensation for Occupational Injuries and Diseases Act",
    title: "Letter of Good Standing",
    significance:
      "Commonly required before site access is granted on industrial and mining sites.",
    grade: null,
    registrationNumber: null,
    detail: null,
    status: "awaiting-verification",
    category: "Statutory & Industry Registration",
  },
];

export const credentialCategories = [
  "Statutory & Industry Registration",
  "Professional Registration",
  "Transformation & Compliance",
] as const;

export const verifiedCredentials = credentials.filter(
  (c) => c.status === "verified"
);

export const pendingCredentials = credentials.filter(
  (c) => c.status === "awaiting-verification"
);

/**
 * CLIENTS
 *
 * These organisations are named in the client listings of Spartcon's own
 * supplied company profiles, so the names are published as supplied.
 *
 * `logoPermissionConfirmed` is separate and deliberately false: displaying a
 * third-party logo is a trademark matter that needs the client's written
 * permission, and no logo files were supplied. Until a logo file exists AND
 * permission is confirmed, the site lists the client as text only.
 */
export type Client = {
  name: string;
  sector:
    | "Mining & Resources"
    | "Government & Public Sector"
    | "Industrial & Manufacturing"
    | "Education & Health"
    | "Commercial & Other";
  /** Path to a supplied logo asset, once provided. */
  logo: string | null;
  logoPermissionConfirmed: boolean;
};

export const clients: Client[] = [
  { name: "Anglo American Platinum", sector: "Mining & Resources", logo: null, logoPermissionConfirmed: false },
  { name: "Impala Platinum", sector: "Mining & Resources", logo: null, logoPermissionConfirmed: false },
  { name: "Royal Bafokeng Platinum", sector: "Mining & Resources", logo: null, logoPermissionConfirmed: false },
  { name: "Glencore", sector: "Mining & Resources", logo: null, logoPermissionConfirmed: false },
  { name: "Seriti — New Denmark", sector: "Mining & Resources", logo: null, logoPermissionConfirmed: false },
  { name: "Transnet", sector: "Government & Public Sector", logo: null, logoPermissionConfirmed: false },
  { name: "Department of Public Works", sector: "Government & Public Sector", logo: null, logoPermissionConfirmed: false },
  { name: "Gauteng Province", sector: "Government & Public Sector", logo: null, logoPermissionConfirmed: false },
  { name: "Industrial Development Corporation", sector: "Government & Public Sector", logo: null, logoPermissionConfirmed: false },
  { name: "Automotive Industry Development Centre", sector: "Government & Public Sector", logo: null, logoPermissionConfirmed: false },
  { name: "University of Pretoria", sector: "Education & Health", logo: null, logoPermissionConfirmed: false },
  { name: "South African Nursing Council", sector: "Education & Health", logo: null, logoPermissionConfirmed: false },
  { name: "Daybreak Foods", sector: "Industrial & Manufacturing", logo: null, logoPermissionConfirmed: false },
  { name: "Ultra Technologies", sector: "Industrial & Manufacturing", logo: null, logoPermissionConfirmed: false },
  { name: "Lonerock Construction", sector: "Industrial & Manufacturing", logo: null, logoPermissionConfirmed: false },
  { name: "Shaweni Consulting Engineers", sector: "Industrial & Manufacturing", logo: null, logoPermissionConfirmed: false },
  { name: "Phumelela Gaming", sector: "Commercial & Other", logo: null, logoPermissionConfirmed: false },
  { name: "Goldrush", sector: "Commercial & Other", logo: null, logoPermissionConfirmed: false },
  { name: "TCC", sector: "Commercial & Other", logo: null, logoPermissionConfirmed: false },
];

export const clientSectors = [
  "Mining & Resources",
  "Government & Public Sector",
  "Industrial & Manufacturing",
  "Education & Health",
  "Commercial & Other",
] as const;

/** Joint ventures named in the supplied material. */
export const jointVentures = [
  {
    name: "Superfecta Spartan Group Joint Venture",
    note: "Joint venture named in the supplied company profile.",
  },
];

export const anyClientLogos = clients.some(
  (c) => c.logo && c.logoPermissionConfirmed
);
