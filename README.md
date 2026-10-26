# Ecomlik Academy

A Moroccan Darija, RTL course landing page with enrolment requests and a WhatsApp handoff. Deploy on **Netlify with Netlify Forms**, or run the included Express/SQLite server. The supplied transparent SVG logo and icon are used directly. Fonts are bundled locally.

## Launch on GitHub and Netlify

See [Analytics and orders](docs/analytics-and-orders.md) for visitor counts, acquisition/landing-page reports, the direct `/order` page and email notification setup. Accepted requests emit GA4's standard `generate_lead` event.

Follow [the launch guide](docs/netlify-launch.md). The repository includes `netlify.toml`, so Netlify can build the extracted project using **`npm run build:netlify`**, publish **`dist`**, and use **Node 24**. Enable Netlify form detection and redeploy if needed; verify a real submission appears under the **`ecomlik-academy`** form before accepting customer enquiries.

The Netlify build uses the platform's form storage. It does not need the Express server, SQLite, `PUBLIC_ORIGIN` or a separate database account. Customers still explicitly send their WhatsApp message after submitting. This is an enrolment-request flow, with payment arranged on WhatsApp.

```sh
npm ci
npm run build:netlify
npm run test:netlify
```

The Netlify tests simulate form-service responses; actual hosted capture and WhatsApp delivery require a live test in your account. Upload the extracted source folders to GitHub, not just the archive.

## Run

Requires Node.js **24 or newer** (for the built-in `node:sqlite` module).

```sh
cd /workspace/FromCODEX
npm ci --cache /workspace/.npm-cache
npm run dev
```

The development server listens on port `3000` and serves both the website and API. Use this existing checkout; a cloud task is already isolated, so do not create a Git worktree unless explicitly requested.

```sh
npm run build
npm test
npm run test:e2e
```

Browser tests use the installed `/usr/bin/chromium` by default and a separate database in `/tmp`. Override the executable with `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if necessary. Tests block analytics network traffic, so synthetic visits are not sent to the real GA property.

## Owner-confirmed offer

- **Ecomlik Academy**, **4,700 MAD / $470**; these are the owner's two quoted prices, not a live exchange-rate calculation.
- Recorded lessons and live sessions. The nine curriculum topics come from the image the owner supplied.
- WhatsApp destination: **+212 650 291 012**.
- GA4 public measurement ID: **G-02NN6XJBCT**.
- Audience: Moroccan adults, especially 30+, in Morocco and abroad. Copy uses Moroccan Darija in Arabic script.

Edit `src/content.ts` for the offer, curriculum, examples and FAQs. Product examples are explicitly illustrative. No learner testimonials, enrolment counts, founder portraits, income figures, discounts or guarantees have been invented.

## How enquiries work on the included Node server

1. The visitor submits name, phone, country, experience and interest, with explicit consent to follow up on this enquiry.
2. The API validates the request and saves it to `data/ecomlik.sqlite` before acknowledging success. Duplicate retries use the same submission UUID.
3. A confirmation presents a WhatsApp link containing the supplied enquiry details. **The visitor must press Send in WhatsApp**; the website cannot send a message on the visitor's behalf. Saving locally does not prove a WhatsApp message was delivered.
4. The owner can follow up on saved enquiries even if the visitor never sends the WhatsApp message.

There is no publicly accessible endpoint to read enquiries. Export them from the server:

```sh
npm run --silent leads:export > data/leads.csv
```

Exports protect against spreadsheet formula injection. Keep the database and exports private; back up the database on persistent storage. Deleting a deployment's ephemeral filesystem would lose the locally saved leads. The API includes same-origin checks, body limits, a honeypot and a basic in-process rate limit. A production edge rate limit is appropriate when running multiple instances or behind a proxy; the app intentionally does not trust arbitrary forwarding headers.

An optional HTTPS `LEAD_WEBHOOK_URL` can deliver enquiries to an existing CRM. `LEAD_WEBHOOK_TOKEN` is an optional server-only bearer token. A failed webhook leaves the lead saved with `delivery_status=pending`; automatic retries are not implemented, so export/reconcile pending leads or connect a delivery queue before relying exclusively on the CRM. These credentials must be set securely in the hosting environment, never committed.

## Analytics

Analytics is opt-in. Choosing the necessary-only option loads no GA/Meta scripts. The GA ID is wired to the supplied property; no access to its reports or historic conversion data was provided.

Events: `page_view`, `cta_click`, `product_interest`, `lead_form_start`, `lead_field_completed`, `lead_submit_success`, `generate_lead`, `lead_submit_error`, `whatsapp_click`. Field completion sends the **field name**, never its content. Names and phone numbers are saved only as part of the consented enquiry and included in the visitor-controlled WhatsApp message. Disable GA automatic form-interaction collection; the app supplies these events itself.

In GA4, mark `generate_lead` as the lead key event. Keep `lead_submit_success` diagnostic and `whatsapp_click` as a separate funnel step. A click is not proof of a sent message or a purchase. Use GA DebugView/Realtime on the deployed domain to confirm collection with a real consenting visit; automated tests deliberately intercept the tracking scripts. No Meta pixel ID was supplied, so Meta tracking stays disabled.

Visitors can reopen privacy choices from the footer. Revocation reloads the page without analytics; users can remove already-created third-party cookies through browser settings.

## Production on a Node host (alternative to Netlify)

```sh
cp .env.example .env
# Set PUBLIC_ORIGIN to the actual HTTPS origin, without a trailing slash.
# Set DATABASE_PATH to a private persistent volume if required by the host.
npm run build
npm start
```

`PUBLIC_ORIGIN` is required for the Node server in production and must exactly match the browser's origin. Terminate HTTPS at your hosting platform or reverse proxy and forward requests to the configured `PORT`. This server serves the default `npm run build` output and API in the same process. Use the separate `npm run build:netlify` output for Netlify's managed form service. The site is an enquiry funnel; it contains no payment collection or protected course-delivery system.

Optional settings are described in `.env.example`. Empty WhatsApp/GA overrides fall back to the owner-confirmed public defaults in `src/content.ts`.

Before collecting real enquiries, confirm live-session scheduling, enrolment/payment terms, the business's privacy contact/retention policy and the instructor details you want to publish. The public page asks visitors to confirm enrolment terms before paying and makes no commitments about lesson hours, lifetime access or refunds.

## Reference fidelity

The requested reference (`walidtoolsprovider.com`) and YouTube channel were blocked by the environment proxy with HTTP 403. The necessary reference/YouTube domains were added to the environment configuration draft, but saving that draft does not apply network access. Until the user saves the network settings or supplies the reference content, a 99–100% structural match and a video-based audience analysis cannot be verified. The build uses the user's business brief, supplied SVGs, uploaded frontend/copywriting/CRO guidance and confirmed curriculum image. It should not be described as a verified clone.

Design decisions and the initial section plan are in `docs/design.md`.
