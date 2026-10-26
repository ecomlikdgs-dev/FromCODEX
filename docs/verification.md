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

## Analytics and order connectivity update — 26 October 2026

- Added `/order`, explicit registration calls to action, campaign-preserving navigation, submission page capture and standard GA4 `generate_lead` tracking.
- GA page views now include path, title, sanitized URL and referrer; repeated consent acceptance does not add a duplicate view. Consent also works for the current visit when persistent browser storage is unavailable.
- Verified the automatic Netlify provider selection with `NETLIFY=true npm run build` and the explicit `npm run build:netlify` build.
- Backend tests: 6 passed. Default browser suite: 11 passed and one intentionally skipped mobile-only case on desktop. Netlify suite: 14 passed, including direct registration, failed request recovery, campaign fields, accepted-request conversion, absence of contact data in analytics events, consent decline and desktop/mobile accessibility scans.
- Netlify form responses and analytics scripts are simulated in browser tests. No real request, email notification or WhatsApp message was sent.
- The owner supplied the public Netlify URL. Requests to it returned workspace-proxy HTTP 403. The domain and GitHub API additions were saved in the network draft, but the running instance still reports an enforced policy with no custom allowed hosts. This observation does not establish that the public website itself returns 403 to visitors.
- No Netlify auth token, CLI session/site binding, or Google property administration/report connection is available in this workspace. Account settings, live capture, email notifications and Google report receipt remain unverified. See `analytics-and-orders.md` for exact owner-account checks.

## Live form failure diagnosis and recovery

- After the network policy changed, live GET requests succeeded. `/deployment.json` confirmed the expected deployed commit and the Netlify Forms provider.
- A diagnostic POST with a deliberately nonempty honeypot and a clearly labelled setup probe with an empty honeypot both returned Netlify HTTP 404. Neither used a real person's contact details. The live HTML retained the raw `data-netlify` declaration. The receiving form is not being handled; enabling/checking Netlify form detection and redeploying is the remaining account action.
- Added specific unavailable/temporary-error messages and a visitor-controlled WhatsApp alternative containing the already validated contact fields. Unconfirmed submissions do not show saved success or emit `generate_lead`, including after clicking the alternative link.
- Netlify browser checks: 16 passed, including desktop/mobile coverage of the observed 404 condition, retained fields, prefilled recovery message and absence of contact details in analytics events. Test popups are intercepted; no WhatsApp message is sent.
- The first diagnostic honeypot was intentionally nonempty so it would be discarded if a form handler were present. The second probe used an explicit setup-test name and an unallocated-format test number to distinguish handler failure from spam filtering. Both requests returned 404; neither is an acknowledged saved request, and persistence/email delivery cannot be claimed from these probes.
