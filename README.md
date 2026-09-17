# BioPhotonix website

A rebuild of [biophotonix.co.uk](https://www.biophotonix.co.uk) on Next.js,
replacing the Wix build. It keeps the company's copy, portraits and device
renders, and adds what Wix could not do: a dark, high-tech design aimed at
optometrists, ophthalmologists and investors, animated diagrams of how Revolux
delivers light and how photobiomodulation reaches the retina, a scroll-driven
development roadmap, a practice revenue calculator, drawn data visualisations
of the dry AMD burden, a dedicated investors page with a data-room request
form, and a contact form that lands in your inbox.

Built the same way as the RevolutionEyes site, so the two can be maintained
together.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run typecheck
```

Node 20 or newer.

## How it is put together

| Path | What it holds |
|---|---|
| `src/content/site.ts` | Every piece of copy, plus contact details, statistics, FAQ, roadmap and team |
| `src/content/posts.ts` | News articles, as typed blocks rather than raw HTML |
| `src/content/privacy.ts` | The privacy notice |
| `src/app/(site)/` | The pages. The group wraps them in the header and footer |
| `src/app/api/contact/` | The form handler (contact, clinic registration, data-room request) |
| `src/app/` | The document shell, health check, sitemap, robots and icons |
| `src/components/` | Shared UI and the interactive pieces |
| `public/images/` | Web-sized portraits, renders and the brand mark |
| `scripts/build-images.mjs` | Turns originals in `source-images/` into `public/images/` |
| `scripts/test/browser/` | The browser regression suite |

**To change wording, edit `src/content/site.ts`.** You should not need to touch
a component. Adding an article means appending an entry to
`src/content/posts.ts` and picking one of the four drawn cover motifs.

### Pages

| URL | Purpose |
|---|---|
| `/` | The story in one page: the unmet need, the shift from watching to treating, Revolux, clinics, roadmap, founder, news, contact |
| `/technology` | Revolux in depth: the five-step delivery explainer, the retina diagram, safety and standards, FAQ. Carries the MedicalDevice and FAQPage structured data |
| `/vision` | The vision simulator: what a patient sees at each stage of dry AMD |
| `/evidence` | The published literature on photobiomodulation in dry AMD, filterable, including the findings that do not support it |
| `/clinics` | For practices: value propositions, the five-step clinical pathway, the revenue calculator, FAQ, registration form |
| `/about` | The belief, the origin, values, founder, advisors and partners |
| `/investors` | The thesis, market charts, business model, regulatory strategy, roadmap, team, data-room request |
| `/news`, `/news/[slug]` | The four articles from the Wix blog |
| `/contact` | Contact details and the form. `?as=clinic` or `?as=investor` preselects the role |
| `/privacy-policy` | The privacy notice |

## The interactive pieces

All in `src/components`:

- **PhotonField** draws photons drifting towards a focal point behind the hero,
  on a canvas. It pauses off screen and shows a single still frame under
  `prefers-reduced-motion`.
- **PrevalenceFrame** is a frame of 144 figures, each two million people,
  that fills from the 2020 figure to the 2040 one as the years advance. The
  head of each affected figure has a dark centre for the central vision dry
  AMD takes. It plays once on scroll, then the year can be dragged.
- **BurdenChart** places that frame beside a hundred-square grid of dry
  against wet AMD. Used on the home and investors pages.
- **PathwayDiagram** lights up the care pathway as it is, then the pathway
  with Revolux.
- **RevoluxExplainer** is a tablist with five drawings of the binocular head:
  geometry, soft-start, wavelengths, interlocks, reporting. It advances on its
  own until someone touches it. On a phone the tabs are a horizontal row of
  short labels above the diagram, so the drawing is on screen as soon as a tab
  is chosen; a vertical list of full titles pushed it more than a screen down.
  The tabs keep their full title as their accessible name at every width.
- **RetinaExplainer** is the eye cross-section, with light reaching the
  mitochondria.
- **Roadmap** is the development stages with a rail that fills on scroll.
  Statuses are set in `roadmap.stages` in `site.ts`.
- **RevenueCalculator** is the slider on the clinics page. Its numbers are
  fitted to the figures the FAQ publishes (see below).
- **StandardsTicker** scrolls the standards Revolux is built against.
- **RevoluxAnatomy** shows the prototype from five angles with numbered
  markers over the front view, keyed to the list beside it; hovering either
  emphasises both. The markers arrive one at a time and then stay. The overlay
  is one 960x700 coordinate space with the front render occupying x 318 to 642
  inside it, so the markers never drift. Views and marker coordinates live in
  `anatomy.views` and `anatomy.parts` in `site.ts`. **Every label is limited to
  what the company has already published**; do not add internal detail there
  without a source. Markers are anchored to the front view only, so the other
  angles carry a caption instead.
- **TreatmentCourse** fills the nine sessions week by week with the treatment
  time counting up. Used on `/technology` and `/clinics`.
- **CardMark** draws the small marks on the cards that would otherwise carry
  only a number and a paragraph. Eighteen motifs, each named in `site.ts` by
  the `mark` key on its item, all built from the same 2px stroked line as the
  larger diagrams.
- **RevoluxDevice** is the front render with therapy light rising from both
  eyepieces, used in the two heroes. The glow is anchored to the apertures
  rather than eyeballed: their centres were found by detecting the teal-rimmed
  openings in the render itself, at 29.4%/22.3% and 70.5%/22.4% of its
  305x660 pixels. The wrapper carries the render's aspect ratio so those
  percentages land on the apertures at any size. **If the render is replaced,
  re-measure them** — nothing infers the position at runtime. The light builds
  over five seconds and holds, rather than pulsing, because that is what a
  session does.
- **CountUp** counts a figure written as text, used for the investor
  headlines. It animates only a value containing exactly one number, so
  "200M" counts while "85-90%" and "Class IIa" are left alone.
- **PhotonField** drifts photons towards the device behind the hero. The
  convergence point follows the pointer part of the way — partial on purpose,
  so the light keeps looking like it belongs to the device rather than
  chasing a cursor — and particles already in flight steer towards it so the
  field bends instead of snapping. Mouse and trackpad only; a pointer that
  exists only during a tap would make it lurch.

- **VisionSimulator** shows what a patient sees at each stage of dry AMD,
  over three photographs and an Amsler grid. It is drawn to a canvas by
  `vision-engine.ts`, and the first version is worth knowing about because it
  was wrong in an instructive way: it used CSS backdrop-filters over live DOM
  and argued itself into subtlety. Backdrop-filter can blur and desaturate,
  but it cannot bend a straight line, cannot give the lost area a ragged
  edge, and cannot move without re-running the filters every frame. The
  result read as "some loss of contrast", which understates the disease far
  more than a dark patch overstates it.

  The engine renders the three things dry AMD actually is: metamorphopsia (a
  smooth noise field displaces the scene, so straight lines bend), a scotoma
  with a lobed, ragged edge, and a surround that loses colour and light before
  it loses detail. The lost area follows the pointer, because a scotoma is on
  the retina and goes wherever the eye goes; that is the one thing a static
  picture cannot convey. On touch it takes a tap, so the page still scrolls.

  Performance: the expensive work (warp, desaturate, blur, and the ragged
  blob) is done once per stage at half resolution, which the blur hides, and
  cached; the other stages are built one per idle slot. Each frame is then
  four `drawImage` calls, so following a mouse costs almost nothing. The
  stage numbers in `STAGES` were tuned by eye against the simulations the
  Macular Society and the US National Eye Institute publish; the Amsler grid
  bends more and blurs less than the photographs, because distortion is what
  the grid exists to show. The lost area is drawn dark so it can be seen, and
  the caveat says that patients more often describe grey or absence.

  The photographs are from Pexels (free for commercial use; the photographers
  are credited under each). `scripts/build-images.mjs` fetches them by ID, so
  the source is on record.

- **EvidenceLibrary** lists the published literature, filterable by topic and
  by whether the study supports the approach. See the header of
  `src/content/evidence.ts` for the rules that file is kept to. The short
  version: every entry is checked against the NCBI E-utilities API rather
  than written from memory, every summary restates that paper's own abstract,
  unsupportive findings are listed with the same prominence as supportive
  ones, and `evidenceSignedOff` gates the page — while it is `false` the page
  carries a draft banner, is served `noindex` and stays out of the sitemap.

- **PageTransition** cross-fades between routes and carries the device
  between the home and technology heroes (`.vt-device`). It drives the View
  Transitions API directly: React ships a `<ViewTransition>` component and
  Next has an `experimental.viewTransition` flag, but on React 19.3 stable the
  export is absent at runtime, so that route builds cleanly and then does
  nothing. It only ever intercepts a plain left-click on a same-origin anchor
  to a different path, takes the click in the capture phase so Next never
  pushes the route twice, and bounds every transition with a timeout so a
  navigation that does not complete cannot leave the page frozen.

Nothing on the site is a photograph of a patient or a treatment outcome. The
article covers are drawn in code (`PostArt`) rather than being the
AI-generated illustrations the Wix site used.

## Checking a change did not break anything

```bash
npm run typecheck
npm run build && npm start &
npm run test:site
```

`test:site` loads every page at desktop and phone width, with and without
`prefers-reduced-motion`, scrolling three different ways, and fails on a
section left invisible by a reveal animation that never fired, sideways
scroll, a skipped heading level, an image with no alt text, text under 14px,
a second `<main>` or `<h1>`, or anything in the console. It needs Playwright,
which is deliberately not a dependency: `npm i -g playwright && npx playwright
install chromium`.

## Deploying

The site is a standard Next.js app and deploys to Vercel with no configuration.

1. Push this repository to GitHub.
2. Import it at vercel.com. Accept the defaults.
3. Add the environment variables below.
4. Point `biophotonix.co.uk` at Vercel: add the domain under Settings,
   Domains, and set the DNS records Vercel shows at your registrar. Vercel
   serves `www` and redirects the apex to it. `site.url` in `site.ts` is set to
   `https://www.biophotonix.co.uk`; canonical URLs, Open Graph tags and the
   sitemap are all built from it.
5. Cancel the Wix plan only once the new site is live on the domain.

### Environment variables

| Variable | Required | What it does |
|---|---|---|
| `RESEND_API_KEY` | Yes | API key from resend.com. Without it every form tells people to email instead of failing silently. |
| `CONTACT_FROM` | Yes | Sender on a domain verified with Resend, e.g. `BioPhotonix <info@biophotonix.co.uk>`. Without it the form refuses to send: Resend's shared test sender only reaches the account owner, so enquiries would look sent and never arrive. |
| `CONTACT_TO` | No | Where enquiries are delivered. Defaults to the address in `site.ts`. |

Setting up Resend is the same job as for RevolutionEyes: sign up, add the
domain (pick the Ireland region), add the three DNS records on the `send`
subdomain, verify, create a key, add the two variables in Vercel, redeploy.
Do not turn on Resend's "Enable Receiving": it replaces the root MX record and
stops `info@biophotonix.co.uk` receiving mail. `/api/health` reports
`"email": "ok"` once the variables are in the build.

Each submission sends two emails: the enquiry to you, with reply-to set to the
sender and a subject that says whether it is a general enquiry, a clinic
registration or a data-room request, and an acknowledgement to the sender that
repeats none of their message.

## Search rankings

The Wix blog lived at `/post/<slug>`. `next.config.ts` redirects those, and
`/blog`, permanently to `/news`, so the ranking follows. Once the domain
points at Vercel, add it in Google Search Console and submit
`https://www.biophotonix.co.uk/sitemap.xml`.

## Typography

Headlines are Source Serif 4 and everything else is Source Sans 3, a pair
designed to work together and long used in scientific and medical publishing.
There is deliberately no monospace face anywhere: section labels are the sans
in letterspaced capitals, and figures use its tabular numerals only where
numbers align in columns. Both faces load through `next/font` in
`src/app/layout.tsx`; the roles are mapped in `globals.css`.

## Imagery

`public/images/` holds web-sized copies made by `npm run build:images` from
originals in `source-images/`, which is not committed. The originals are the
founder portrait and clinic photograph, the three advisor portraits, the brand
mark, and the five Revolux V2 renders.

The V2 renders arrive on a transparent background inside a fixed landscape
frame, so sharp's `trim` cannot find the device: it compares RGB and the
invisible pixels are not a uniform colour. `build-images.mjs` crops to the
**alpha** bounding box instead. If you add a render, drop it in
`source-images/` and add a line to the `views` list in that script. To add a photograph, drop the
original in `source-images/`, add a line to `scripts/build-images.mjs` and
run it.

The logo is the brand mark plus a wordmark set in type (`Logo.tsx`), because
the supplied logo has a black wordmark that vanishes on the dark palette. The
supplied logo is kept at `public/images/logo-light-bg.png`.

## Things to check before you launch

- **The figures.** Every statistic came from the Wix site or the company's
  articles: 200 million people with AMD, 288 million by 2040, 85 to 90% dry,
  more than 500,000 progressing to severe vision loss a year, twice the risk
  of cognitive decline, vision loss in the top three most feared outcomes, and
  the $49 billion US economic burden. The prevalence frame cites Wong et al.,
  The Lancet Global Health, 2014, and the 47% growth figure is derived from
  its two numbers (196 to 288 million). Investors will ask for the rest; a source
  for each belongs in `burden.stats` before a raise.
- **The revenue calculator.** It is fitted to the FAQ's published examples
  (one, two and three patients a month generating £700, £1,600 and £2,500 of
  monthly profit), which imply £900 per patient over £200 a month fixed. If
  the pricing changes, change `clinics.calculator` in `site.ts`. The note
  under the calculator says the figures are illustrative; keep it.
- **The investors page** carries a disclaimer that it is not an offer of
  securities. Have your advisers read the page before it goes to investors.
- **The roadmap statuses** are set from the December 2025 article: design
  freeze in progress, pilot clinical evaluation next. Update
  `roadmap.stages` as milestones land.
- **The privacy policy** is the Wix text, tidied. It still describes a cookie
  banner and a cookie notice that do not exist here, because the site sets no
  cookies. Remove those lines or add the banner if analytics are introduced.
- **The founder's LinkedIn** link is Adail's personal profile; there is no
  company page yet.

## Drawing the diagrams

Two rules, both learned the hard way, apply to every annotated SVG here.

**Keep the annotations out of the artwork.** In the explainer the handle runs
down the middle of the lower half, and anything written across it collides.
Each drawing therefore puts the device in the top two thirds and every label
in a clear band beneath it. If you add a label, put it below y=400 in that
component's 640x530 space, or above y=80.

**Size annotation text in CSS, not with `fontSize`.** A 640-unit viewBox on a
350px phone halves everything, so a label sized for the desktop lands near
8px. The `CAP` and `CAP_SM` constants in the explainer and the retina diagram
set a larger size in user units on a phone and a smaller one from `md` up, so
both come out near 15px on screen.

`scripts/` has no checker for this, but the browser does: measure a text
node's `getBoundingClientRect()` against the drawn elements around it, in
screen coordinates rather than `getBBox()`, which ignores transforms and
over-reports for ellipses and diagonals.

## Contrast and text size

Every piece of text on the site was measured in the browser against the
surface actually behind it, compositing each colour through a canvas so that
Tailwind's `color-mix` opacities resolve the way they really paint. The audit
found six outright WCAG AA failures and a wide band of supporting copy sitting
between 4 and 6.5 to 1, which passes the AA floor but is tiring to read on a
near-black page.

The opacity ladder was raised so that **nothing on the site falls below
7:1, the WCAG AAA threshold**: supporting text sits at 8.5:1, ordinary body
copy near 10:1, and headings above 16:1. Ember set as text uses
`--color-ember-text`, a lighter step of the same hue, because the graphic
ember is only 6.2:1. The type scale moved up a step as well, so the smallest
text on the site is 16px.

This matters more here than on most sites: the readership is older clinicians
and the subject is loss of central vision. If you add copy, keep it at
`text-fog/70` or brighter, and re-run the audit rather than judging by eye.

## Accessibility

- Content is server-rendered visible. Scroll animations are applied after
  hydration and only to content below the fold, so a failed script or a
  missed observer can never leave the page blank.
- `prefers-reduced-motion` disables every animation, including the canvas,
  the count-up figures, the ticker, the card marks, the article covers and
  the diagrams' pulses. Each of those renders in its finished state instead.
- The explainer tabs and the calculator bars are keyboard operable, every
  diagram has a text description, and the page outline never skips a heading
  level.
