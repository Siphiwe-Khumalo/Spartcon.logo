/**
 * IMAGE REGISTRY
 *
 * Resolves a short slug (e.g. "mechanical-plant-room") to the optimisable
 * Astro asset plus its alt text and attribution.
 *
 * All photography is real, sourced from Wikimedia Commons under licences that
 * permit commercial use (CC0, Public Domain, CC BY, CC BY-SA). No AI-generated
 * imagery is used anywhere on this site.
 *
 * IMPORTANT: none of these photographs depict Spartcon projects. They are
 * contextual industry photography and must never be captioned as Spartcon work.
 * Genuine project photography should be added to src/assets/images/projects/
 * and referenced through `projects.ts`, where `imageIsOfThisProject` applies.
 *
 * TO REPLACE AN IMAGE
 *   Drop a new file at src/assets/images/<slug>.jpg and update the matching
 *   entry in src/data/image-credits.json. Nothing else needs to change.
 */

import creditsJson from "@data/image-credits.json";

export type ImageCredit = {
  slug: string;
  file: string;
  alt: string;
  subject: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourcePage: string;
  source: string;
  originalFileName: string;
};

export const imageCredits = creditsJson as Record<string, ImageCredit>;

/** Eagerly collected so Astro can optimise every asset at build time. */
const assets = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/*.{jpg,jpeg,png}",
  { eager: true }
);

const bySlug = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(assets)) {
  const slug = path.split("/").pop()!.replace(/\.(jpe?g|png)$/i, "");
  bySlug.set(slug, mod.default);
}

export type ResolvedImage = {
  src: ImageMetadata;
  alt: string;
  credit: ImageCredit;
};

/**
 * Resolve an image slug. Returns null when the slug is absent, so callers can
 * fall back to a typographic treatment rather than rendering a broken image.
 */
export function getImage(slug: string | null | undefined): ResolvedImage | null {
  if (!slug) return null;
  const src = bySlug.get(slug);
  const credit = imageCredits[slug];
  if (!src || !credit) {
    if (import.meta.env.DEV) {
      console.warn(`[images] unknown image slug: "${slug}"`);
    }
    return null;
  }
  return { src, alt: credit.alt, credit };
}

/** Resolve an image, throwing at build time if it is missing. For required art. */
export function requireImage(slug: string): ResolvedImage {
  const img = getImage(slug);
  if (!img) throw new Error(`[images] required image missing: "${slug}"`);
  return img;
}

/** All credits, grouped by subject, for the /image-credits page. */
export function creditsBySubject(): { subject: string; items: ImageCredit[] }[] {
  const groups = new Map<string, ImageCredit[]>();
  for (const c of Object.values(imageCredits)) {
    const list = groups.get(c.subject) ?? [];
    list.push(c);
    groups.set(c.subject, list);
  }
  return [...groups.entries()]
    .map(([subject, items]) => ({
      subject,
      items: items.sort((a, b) => a.slug.localeCompare(b.slug)),
    }))
    .sort((a, b) => a.subject.localeCompare(b.subject));
}

export const totalImages = Object.keys(imageCredits).length;
