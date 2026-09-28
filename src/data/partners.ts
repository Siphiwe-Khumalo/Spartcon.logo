/**
 * PARTNERS / AFFILIATIONS — homepage marquee.
 *
 * No real partner, client or supplier logos were supplied with the source
 * material, so this file is DELIBERATELY placeholder data — same rule as
 * `projects.ts`: nothing is presented as fact unless Spartcon has confirmed
 * it. Do not add a real company name or logo here without Spartcon's
 * explicit confirmation that the relationship exists and may be displayed.
 *
 * TO PUBLISH REAL PARTNERS
 *   1. Drop each logo at src/assets/images/brand/partners/<slug>.png (or .svg
 *      — svg preferred, renders crisp in the marquee at any size).
 *   2. Replace the placeholder entries below with `{ name, logoSrc }`, where
 *      `logoSrc` is an import of that file.
 *   3. Nothing else needs to change — HomePartners.astro reads this array.
 */

export type Partner = {
  /** Accessible name. Kept generic until a real, confirmed partner replaces it. */
  name: string;
  /** Import of the logo asset once supplied. Undefined renders the placeholder tile. */
  logoSrc?: ImageMetadata;
};

/** Eight placeholder slots — a reasonable marquee length; add or remove freely. */
export const partners: Partner[] = Array.from({ length: 8 }, (_, i) => ({
  name: `Partner ${i + 1}`,
}));
