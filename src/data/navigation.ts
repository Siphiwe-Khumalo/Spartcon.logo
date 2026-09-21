/**
 * NAVIGATION — single source of truth for the header, mega-menu, mobile drawer
 * and footer link groups.
 *
 * Adding a page here places it in the header, the mobile menu and (where listed
 * in `footerGroups`) the footer. Nothing is hard-coded in the components.
 */

import { services } from "./services";
import { techBrand } from "./spartcon-tech";

export type NavLink = {
  label: string;
  href: string;
  /** Short supporting line shown in dropdowns and mega-menus. */
  description?: string;
};

export type NavItem = NavLink & {
  /** A simple dropdown of links. */
  children?: NavLink[];
  /** Renders the Spartcon Tech mega-menu instead of a plain dropdown. */
  megaMenu?: "spartcon-tech";
};

/** Spartcon Tech section links — reused by the mega-menu and the footer. */
export const techLinks: NavLink[] = [
  {
    label: "Spartcon Tech Overview",
    href: techBrand.basePath,
    description: "The Facilities Engineering division of Spartcon",
  },
  {
    label: "Engineering Services",
    href: `${techBrand.basePath}/engineering-services`,
    description: "Installation, commissioning, plant rooms and overhaul",
  },
  {
    label: "Maintenance & Operations",
    href: `${techBrand.basePath}/maintenance-operations`,
    description: "Predictive, pre-emptive and reactive maintenance",
  },
  {
    label: "Building Systems",
    href: `${techBrand.basePath}/building-systems`,
    description: "HVAC, electrical, water, fire, steam and standby power",
  },
  {
    label: "Energy & Utilities",
    href: `${techBrand.basePath}/energy-utilities`,
    description: "Energy systems, utility supply and consumption",
  },
  {
    label: "Maintenance Management",
    href: `${techBrand.basePath}/maintenance-management`,
    description: "Your existing system, or a Spartcon turnkey system",
  },
  {
    label: "Contact Spartcon Tech",
    href: `${techBrand.basePath}/contact`,
    description: "Facilities engineering enquiries",
  },
];

/** Primary desktop navigation, in order. */
export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "All Services",
        href: "/services",
        description: "Construction and engineering service lines",
      },
      ...services.map((s) => ({
        label: s.navLabel,
        href: `/services/${s.slug}`,
        description: s.strapline,
      })),
    ],
  },
  { label: "Industries", href: "/industries" },
  { label: "Capabilities", href: "/capabilities" },
  {
    label: "Facilities Engineering",
    href: techBrand.basePath,
    megaMenu: "spartcon-tech",
    children: techLinks,
  },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

/** Primary call to action in the header. */
export const navCta: NavLink = {
  label: "Start a Conversation",
  href: "/contact",
};

/** Footer link groups. */
export const footerGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Navigation",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Industries", href: "/industries" },
      { label: "Capabilities", href: "/capabilities" },
      { label: "Credentials", href: "/credentials" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Facilities Engineering",
    links: [
      { label: "Spartcon Tech", href: techBrand.basePath },
      {
        label: "Engineering Services",
        href: `${techBrand.basePath}/engineering-services`,
      },
      {
        label: "Maintenance & Operations",
        href: `${techBrand.basePath}/maintenance-operations`,
      },
      {
        label: "Building Systems",
        href: `${techBrand.basePath}/building-systems`,
      },
      {
        label: "Energy & Utilities",
        href: `${techBrand.basePath}/energy-utilities`,
      },
      {
        label: "Maintenance Management",
        href: `${techBrand.basePath}/maintenance-management`,
      },
    ],
  },
  {
    title: "Services",
    links: services.map((s) => ({
      label: s.navLabel,
      href: `/services/${s.slug}`,
    })),
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Website Terms", href: "/website-terms" },
  { label: "Image Credits", href: "/image-credits" },
];

/**
 * True when `href` is the current page or an ancestor of it — used for
 * aria-current and the navigation active indicator.
 */
export function isActive(href: string, pathname: string): boolean {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (href === "/") return clean === "/";
  return clean === href || clean.startsWith(`${href}/`);
}
