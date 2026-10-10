# KINETIQ STUDIO

An original, editorial creative-studio experience built with React, TypeScript, Vite, Tailwind CSS, GSAP, Motion, React Three Fiber and an Express/MongoDB API. All project artwork and illustrated portraits are original local SVGs. Projects, people, metrics and seeded vacancies are explicitly fictional.

## Run locally

Requires Node.js 22.12+ and MongoDB 7+ (local MongoDB or an Atlas connection).

```powershell
npm install
Copy-Item .env.example .env
# Edit .env: set MONGODB_URI and a random SESSION_SECRET of 32+ characters.
npm run seed
$env:ADMIN_PASSWORD = 'your-unique-password-at-least-14-characters'
npm run admin:create
Remove-Item Env:ADMIN_PASSWORD
npm run dev
```

Open http://localhost:5173. The API runs on port 4000. Administrator creation prompts for an email and reads the password from the current terminal environment; no public registration or default credentials exist. The seed command inserts missing demo records without overwriting edited content.

Without an API connection the public website shows bundled demo content. It does **not** simulate successful form submission. Applications are disabled until live database content is available. Contact displays actual API failures. Restart or reload after database seeding.

## Pages and content

`/`, `/about`, `/services`, `/work`, `/work/:slug`, `/process`, `/team`, `/journal`, `/journal/:slug`, `/careers`, `/careers/:slug`, `/contact`, `/admin` and a custom 404. Vite dev and the production Express server support deep links.

The dashboard includes an overview, create/edit/delete for projects, articles, people and positions; portfolio display order and featured flags; image uploads; journal draft/publish states; enquiry filters/statuses and career application review/statuses. Editors have read-only access; administrators have write access. Roles with existing applications cannot be deleted; close them to preserve references. Lists currently load up to 1,000 records per module.

Form submissions are stored in MongoDB for administrator review. Email delivery is not configured. Seeded roles are sample positions; replace them and turn off the sample flag before using the site for real recruitment.

## Build and validation

```powershell
npm run lint
npm test
npm run build
npm start
```

For the temporary database integration scenario and browser suite:

```powershell
$env:RUN_DB_TESTS = '1'
npm test
Remove-Item Env:RUN_DB_TESTS
npm exec -w client -- playwright test
```

The first database test run downloads a temporary MongoDB binary. Browser tests use installed Microsoft Edge and an isolated dev server on port 5178.

Production serves `client/dist` from Express. Set `NODE_ENV=production`, a strong `SESSION_SECRET`, the deployed `CLIENT_ORIGIN`, and a MongoDB connection. Serve the entire app under the same HTTPS origin. Secure cookies require HTTPS. Set `TRUST_PROXY=1` only when a trusted reverse proxy is in front of Express. The default port is 4000.

The production Content Security Policy allows local application code and images. Media URLs are restricted by validation. Deployments need persistent storage for `UPLOAD_DIR`; the local upload adapter currently stores validated raster images with random names in that directory. Back up MongoDB and uploads together. Configure a dedicated object-storage adapter before deploying on ephemeral disks or scaling across multiple servers. Do not expose MongoDB directly to the public internet.

## Architecture

- `client/src/pages`: lazy-loaded routes and functional public/admin interfaces.
- `client/src/animations`: scoped GSAP timelines, ScrollTrigger, Lenis integration, intro and custom cursor with cleanup.
- `client/src/three`: procedural pointer-responsive sculpture with local lighting and a mobile/reduced-motion graphic fallback.
- `client/src/contexts`: live API content with explicitly fictional offline previews.
- `client/public/images`: original SVG concept artwork and portraits.
- `server/src/models`: seven Mongoose models, unique slug/email indexes and timestamps.
- `server/src/validators`: Zod allowlists for mutations, submissions and safe URLs.
- `server/src/app.js`: rate limits, origin checks, Helmet, Mongo-backed sessions, authentication, CSRF tokens, authorization, verified uploads and API error handling.
- `shared/content.js`: original demo records shared by seed scripts and frontend preview.
- `server/test`: security and validation tests without a database dependency.

## Motion and accessibility

Typography and route reveals, scroll parallax, procedural 3D rotation and pointer camera movement, custom cursor, Flip filtering, animated service accordions, SVG connector drawing, progress indicator, metric counters, responsive menu, project hover previews, ticker, focus states and closing CTA interactions. Lenis and ScrollTrigger share a GSAP ticker. Reduced-motion users receive static layouts and a 2D sculpture. Mobile galleries use native touch scrolling instead of pinned scroll hijacking. Native links, labelled inputs, visible focus, a skip link, and real form errors preserve essential functionality.

## Verification scope

See `TEST_RESULTS.md` for executed checks and remaining environment-dependent verification. Mongo-backed end-to-end authentication, storage and uploads require a running database; unit/security tests do not substitute for those checks.
