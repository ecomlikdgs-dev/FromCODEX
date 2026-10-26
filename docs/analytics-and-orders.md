# Connect traffic reports and enrolment requests

Live website: <https://ecomlikacademy.netlify.app/>. GA4 measurement ID: `G-02NN6XJBCT`. WhatsApp: `+212 650 291 012`.

## Implemented in the site

- A direct **`/order`** page, clearly labelled registration buttons, a name/phone form, and the course price. Requests are saved through Netlify Forms independently of the visitor sending the prepared WhatsApp message. Payment remains arranged manually with the owner.
- GA4 `page_view` includes the current page URL/path, title and referrer. Campaign fields are retained, while arbitrary query fields and fragments are omitted from the analytics configuration. Reopening privacy choices and accepting again does not duplicate a page view in the same document.
- An accepted request emits **`generate_lead`** (GA4's recommended lead event) and the existing diagnostic `lead_submit_success`. Failures do not emit a lead conversion. No purchase or revenue is reported.
- Names, phone numbers, submission UUIDs and field contents are kept out of analytics event payloads. Contact information is sent to the form service and the visitor-reviewed WhatsApp message.
- Campaign parameters follow visitors from the homepage to `/order`. Netlify records the request's `page_path` too.
- Netlify builds use Netlify Forms, including when the platform runs the standard build with `NETLIFY=true`. `/deployment.json` identifies the compiled release (`analytics-orders-v2`) and provider. This is build configuration, not a live health check of Google or Netlify.

## 1. Publish the updated version

The changes are on GitHub branch `codex/netlify-launch`. If Netlify deploys `main`, merge the latest launch branch into `main` and wait for the production deploy. If it deploys `codex/netlify-launch`, pushing the branch normally triggers it. Follow the actual production branch setting; a successful Git push alone does not prove the public site changed.

Build command: `npm run build:netlify`. Publish directory: `dist`. On the production address, check `/deployment.json` for `release: "analytics-orders-v2"` and `leadProvider: "netlify_forms"`. Open `/order` directly.

## 2. Save requests and receive email notifications

1. In Netlify, enable **Forms → form detection** if disabled. Redeploy after enabling it so the published HTML is scanned again.
2. Confirm that **`ecomlik-academy`** is listed.
3. Add an **email notification** for submissions to this form using the recipient supplied by the owner. Depending on the dashboard version, notifications are under the form controls or project **Notifications → Emails and webhooks**. The account setting is not controlled by `netlify.toml` or a `mailto:` link.
4. Submit a clearly labelled test with contact details you control. Confirm the dashboard record contains name, normalized phone, country, consent, campaign and page. Check the spam section if missing.
5. Verify the notification reaches the chosen inbox, including its Spam folder. Stored requests can be reviewed/exported even when a visitor does not send the WhatsApp message.
6. Inspect the confirmation's WhatsApp destination and message, then send it if testing delivery to the business account. A click is not proof of a delivered message.

Mock responses in local tests cannot establish hosted capture. A Forms dashboard record and a received notification are the live checks. Netlify's spam filtering and plan limits apply. A lost response followed by a retry can duplicate a request; `submission_id` helps recognize duplicates.

## 3. Open the correct Google Analytics property

1. Sign in to <https://analytics.google.com/> using an account with access to the property. The public measurement ID does not grant report access.
2. In **Admin → Data streams**, confirm the web stream ID is **`G-02NN6XJBCT`**. Its website URL should be **`https://ecomlikacademy.netlify.app`**, or the canonical custom domain when added.
3. Use **Africa/Casablanca** as the reporting time zone if Morocco is the intended daily reporting boundary.
4. Open a fresh visit, choose **نوافق على التحليلات**, and check **Realtime** for visits to `/` and `/order`. If none arrive, check the selected property, deployed version, browser/ad blocker, cookie choice and network requests.
5. Submit a test request and confirm **`generate_lead`** arrives. Mark it as the lead **key event**. Keep `lead_submit_success` as a diagnostic event so the same request is not counted as two conversions. `whatsapp_click` is separate from an accepted request or payment.
6. Disable Enhanced Measurement's automatic form-interaction collection for this stream. The app supplies consent-aware form events without field contents.

Realtime can show a test promptly. Standard reports are processed later and can take 24–48 hours. Tracking starts when collection works and cannot reconstruct previously unmeasured visitors. GA4 covers consenting visits and can miss blocked scripts; it is not an exact count of all server requests.

## 4. Find daily, weekly and monthly reports

Set the date selector to **Today**, **Last 7 days** or **Last 30 days** and use the chart's available day/week/month granularity. GA menu collections vary; search these report names if missing from the sidebar.

| Question                        | Report and useful metrics                                                                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How many visitors?              | Reports snapshot / Engagement overview: Active users, Sessions and Views, with date range and timeline. Views can exceed users.                                        |
| Where do they come from?        | Traffic acquisition: Session source / medium and Session campaign. User acquisition describes first-user sources instead.                                              |
| Which page did they enter on?   | Landing page: Landing page + query string, Sessions and Active users. The homepage is `/`, registration is `/order`; `#join` is a section rather than a separate page. |
| Which pages are viewed?         | Pages and screens: Page path/title and Views.                                                                                                                          |
| How many registration requests? | Events / Key events: `generate_lead`, compared with Netlify Forms records. Consent and blocking can make totals differ.                                                |
| How many WhatsApp clicks?       | Events: `whatsapp_click`; it does not prove delivery or payment.                                                                                                       |

Use campaign-labelled links in YouTube descriptions, ads and emails, for example:

`https://ecomlikacademy.netlify.app/?utm_source=youtube&utm_medium=organic&utm_campaign=academy`

Use consistent labels for each channel. Direct/none can mean the referrer is absent; it does not always mean the address was typed. Do not put personal names or phone numbers in campaign URLs.

## Live-account limitations

This workspace has no Netlify account authentication or Google report/administration connection. The live domain and GitHub API returned proxy HTTP 403; required domain additions were saved in the environment draft. Applying network access allows inspection, not login to the owner's accounts. Form detection, email recipients, Google report access, key-event settings, hosted capture and email delivery still require an authenticated account or owner verification.

Automated tests intercept analytics and simulate Netlify responses. No real enrolment notification or WhatsApp message was sent. There is no public list of private requests or public admin dashboard.
