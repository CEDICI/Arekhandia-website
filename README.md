# AREKHANDIA website

Static HTML/CSS/JavaScript website. Production hosting uses the existing GitHub Pages configuration with the repository root on `main`. No frontend framework, package install or application server is required.

## Preview

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080/`. Serve the root over HTTP: nested service pages intentionally use root-relative navigation and assets.

## Static production build

```sh
node scripts/build.mjs
```

The build checks HTML entry points, local routes, anchors, referenced resources, one H1 per page and basic SEO metadata. It copies the site to ignored `dist/`. To choose another directory:

```sh
node scripts/build.mjs ../site-build
```

There are no configured lint or TypeScript commands. JavaScript syntax can be checked with `node --check atelier.js` and `node --check service-led.js`. Browser and accessibility checks are separate from the static build.

## Service-led information architecture

- `/services.html`: service overview
- `/services/brand-identity/`
- `/services/digital-experiences/`
- `/services/creative-direction/`
- `/services/brand-transformation/`
- `/studio.html`
- `/work.html`: Selected Work
- `/contact.html`: project inquiry

New service routes are directories containing `index.html`, compatible with GitHub Pages. Existing `.html` pages remain available. `/brand-identity.html` is a rendering alias with the new service URL as its canonical. Existing Content Creation, Creative Strategy and Visualisierung pages connect to Creative Direction.

## Source layout

- `atelier.css` and `atelier.js`: retained core styling, project worlds and navigation/form behaviour
- `service-led.css`: service-led layout and responsive presentation
- `service-led.js`: whitelisted service-interest preselection and accessible validation messages
- `services/*/index.html`: individual service pages
- `assets/`: original approved brand/project artwork, optimised image derivatives and local fonts
- `sitemap.xml`: indexable URLs
- `atelier-preview.html`: local noindex homepage alias

Manrope is self-hosted. Its OFL licence is included in `assets/fonts/manrope-OFL.txt`. Original logos are image assets and are independent of the website typeface.

## Contact workflow

The existing native form posts to the configured FormSubmit destination `https://formsubmit.co/earekhandia@gmail.com`. Existing name/email/topic/message fields, honeypot and provider flow are retained. Company and indicative budget are optional. Service pages link to `/contact.html?service=<slug>`; only the four declared service keys are recognised.

Required fields use native validation and accessible inline messages. Submission disables the button until navigation; no local success message claims delivery. FormSubmit handles the provider response and spam checks. Direct email and telephone links remain available. An intercepted browser test verifies the POST payload without sending a message; it does not prove mailbox receipt or provider activation.

## Deployment boundary

The service-led redesign is prepared on `redesign/service-led`. Do not push to the production-triggering branch or deploy it without separate authorisation for this redesign. The production pipeline is intentionally unchanged.
