# Verification

Validated in this cloud workspace on 20 October 2026 with Node 24.19.0 and the installed Chromium.

- Clean frozen-lockfile installation (`npm ci --prefer-offline`): passed.
- TypeScript check and Vite production build (`npm run build`): passed.
- Backend suite (`npm test`): 6 passed, 0 failed.
- Browser suite (`npm run test:e2e`): 11 passed, 0 failed, 1 intentionally skipped desktop instance of the mobile-only navigation test.
- Browser coverage: RTL rendering, 9 curriculum topics, category filters, both price displays, FAQ, invalid phone rejection, successful submission, failed-network retry with field preservation, correct WhatsApp destination/message, analytics consent and absence of field values in event data, keyboard closing of privacy dialog, and widths from 320 to 1440 pixels.
- Automated axe scan for WCAG A/AA and WCAG 2.1 AA tags: no detected violations on desktop or mobile after contrast fixes.
- Production server: served built assets and transparent SVGs, returned healthy API/config, saved a synthetic enquiry into a separate test database, and exported a formula-safe CSV.
- Default public runtime settings: WhatsApp `212650291012`, GA4 `G-02NN6XJBCT`; Meta disabled because no ID was supplied.

Synthetic submissions use separate test databases, not the application's real lead database. Tests intercept analytics traffic and inspect WhatsApp URLs without sending messages. Live GA receipt, WhatsApp delivery, public hosting, real payments and reference fidelity are not established by these checks.

Reference and YouTube requests returned HTTP 403 from the network proxy. Network additions, the tested install script and startup instructions are saved in the environment configuration draft. Saving the draft does not apply network changes, publish the environment or deploy the website. Retry source inspection after the relevant environment settings are saved.

## Netlify launch preparation

- Added `netlify.toml` with Node 24, build command `npm run build:netlify` and publish directory `dist`.
- The Netlify bundle uses Netlify Forms instead of `/api/leads` and loads public WhatsApp/GA settings without `/api/config`.
- Static HTML declares every submitted field for Netlify's deploy-time form detection.
- Six additional desktop/mobile tests passed against the actual Netlify-mode bundle. They simulate Netlify's HTTP responses, checking encoded contact/consent/campaign data, validation, failed-request recovery and the WhatsApp handoff. They do not prove storage in a Netlify account.
- The Node build, six backend tests and eleven existing browser tests passed again after adding the platform adapter (one mobile-only desktop case intentionally skipped).
- Removed the cloud-specific npm cache path from the project's `.npmrc` so a Netlify checkout uses its own writable cache.
- GitHub's uploaded `main` was inspected before preparing the launch branch. Its existing history and uploaded source archive were preserved; the missing extracted source folders are part of the launch change.

Still requires the owner's Netlify/GitHub connection, a successful hosted build, enabled form detection, a real dashboard submission check and a visitor-sent WhatsApp message. Payment remains arranged manually over WhatsApp, as requested.
