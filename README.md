# Spartcon (Pty) Ltd — Corporate Website

Production-ready corporate website for **Spartcon (Pty) Ltd**, including the
**Spartcon Tech** Facilities Engineering division.

Built with [Astro](https://astro.build) as a fully static site: 22 pages,
~12 KB of JavaScript in total, no runtime framework, no animation library.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview  # serve the production build
```

Requires Node 20 or newer.

---

## Project structure

```
src/
├── data/              ← ALL CONTENT LIVES HERE (single source of truth)
│   ├── company.ts         Company profile, contact, history, approach, standards
│   ├── services.ts        Construction & civil service lines
│   ├── spartcon-tech.ts   Facilities Engineering division content
│   ├── capabilities.ts    Technical capability index
│   ├── industries.ts      Sectors served
│   ├── credentials.ts     Registrations, grading, clients
│   ├── projects.ts        Project portfolio (currently empty — see below)
│   ├── navigation.ts      Header, mega-menu and footer link architecture
│   └── image-credits.json Photography attribution registry
├── components/
│   ├── brand/         Logo + wave mark
│   ├── nav/           Site navigation & footer
│   ├── ui/            Buttons, sections, media, accordions, panels
│   ├── forms/         Enquiry form
│   ├── sections/      Reusable page sections (incl. homepage sections)
│   └── seo/           Meta, Open Graph, structured data
├── layouts/           Document shell
├── pages/             Routes (file-based)
├── styles/            Design tokens, base, utilities
├── scripts/           Scroll-animation module
└── assets/images/     Source photography (optimised at build time)
```

**Content is deliberately separated from presentation.** Adding a service,
industry, capability or project is a data edit — no template changes needed.

---

## Content governance

This site follows a strict rule: **nothing is presented as fact unless it is
confirmed in Spartcon's own supplied material.**

Fields in `company.ts` carry an explicit `verified` flag. Anything unverified
renders through the `<PendingValue>` component as a neutral "to be confirmed"
state rather than showing an invented value.

### Currently verified and published

| Item | Value |
|---|---|
| Ownership | 100% BEE privately held corporation |
| CIDB grading | 7ME · 7CE · 6GB PE |
| NHBRC | Registered |
| Professional registration | ECSA · SACPCMP |
| Facilities engineering since | 2008 (under Spartan Group) |
| Construction since | 2018 |
| Address | 52 Belveder Rd, Glen Austin AH, Midrand 1864 |
| Telephone | 083 291 6707 |
| Email | tshepom@spartcongroup.co.za · tshepom@spartangroup.co.za |

### Still outstanding

- **Registration numbers** for CIDB, NHBRC, ECSA and SACPCMP — the
  registrations are stated in the company profile, but the numbers were not
  supplied, so they are omitted rather than invented.
- **B-BBEE verified contributor level**, CIPC company registration number,
  SARS tax compliance status, COID letter of good standing.
- **Office hours** and postal address.

To publish any of these: set the value in `src/data/company.ts` or
`src/data/credentials.ts` and flip `verified` / `status` — the whole site
updates.

---

## Projects

`src/data/projects.ts` is **intentionally empty**. No project names, values,
locations, clients or outcomes were supplied, and fabricating them on a
construction company's website would be misleading in a tender context.

While the array is empty, `/projects` renders an experience-and-capability
presentation. The moment a real project is added, the page switches
automatically to a project grid. See the notes in that file for the fields
required per project.

---

## Photography

All imagery is **real photography** sourced from Wikimedia Commons under
licences permitting commercial use (CC0, public domain, CC BY, CC BY-SA).
**No AI-generated imagery is used anywhere.** Every image was visually reviewed
before inclusion; several candidates were discarded because their source titles
did not match what the photograph actually showed.

**None of the photographs depict Spartcon projects.** They are contextual
industry and equipment imagery. Full attribution is published at
`/image-credits`, which is also a licence obligation for the CC BY images.

To replace an image: drop a new file at `src/assets/images/<slug>.jpg` and
update the matching entry in `src/data/image-credits.json`.

When genuine Spartcon project photography is available it should live in
`src/assets/images/projects/` and be referenced from `projects.ts`, where the
`imageIsOfThisProject` flag controls captioning.

---

## Brand assets

`brand/reference/` holds the supplied logo artwork used as the reconstruction
reference.

The logo is currently rendered as **vector geometry plus live text** in
`src/components/brand/` — the wave mark as SVG paths, the wordmark set in
Poppins SemiBold. Proportions were measured against the supplied artwork
(mark width = 0.91 × wordmark width, aspect ratio 3.62:1).

> **Before launch:** replace `WaveMark.astro` with Spartcon's official vector
> artwork to guarantee exact brand geometry. The current mark is a faithful
> reconstruction, not the original file.

---

## Forms

The enquiry forms are fully functional client-side — validation, inline error
states, accessible labelling, keyboard support and a success state — but they
are **not connected to a mail service**. No backend credentials were invented.

To connect one, pass an endpoint to the component:

```astro
<EnquiryForm variant="spartcon" action="https://your-endpoint" />
```

Without `action`, the form runs in demo mode: it validates, shows the success
state, and logs the payload to the console instead of sending it.

---

## Legal pages

`/privacy-policy` and `/website-terms` are **professionally structured
templates, not completed legal documents.** Sections marked `[TO CONFIRM]`
need Spartcon's input, and both should be reviewed by a qualified legal
advisor before launch — South African data processing is governed by POPIA,
which requires specific disclosures and a designated Information Officer.

---

## Accessibility & SEO

Verified by `scripts/audit.mjs`, which crawls every built route and checks:

- Internal link integrity
- One `<h1>` per page, no heading-level jumps
- `alt` text on every image
- Labels on every form control
- Titles, meta descriptions, canonicals and Open Graph images
- WCAG AA colour contrast on body copy
- That no content is stranded by the scroll-reveal system
- Console and network errors

```bash
npm run build
./scripts/review.sh scripts/audit.mjs
```

Current status: **21 routes, no issues.**

Reduced-motion preferences are respected throughout — the motion module
short-circuits entirely and all content displays immediately.

---

## Deployment

Static output. Any static host works (Netlify, Vercel, Cloudflare Pages, S3 +
CloudFront, or standard web hosting).

**Before going live,** update `site` in `astro.config.mjs` and the `Sitemap:`
line in `public/robots.txt` to the production domain. Both currently point at
`https://www.spartcon.co.za`.
