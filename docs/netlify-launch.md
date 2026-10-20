# Put Ecomlik Academy online with GitHub and Netlify

This launch uses **enrolment request → WhatsApp**, as confirmed by the owner. Visitors can request Ecomlik Academy at 4,700 MAD / $470. You confirm the details and arrange payment with them on WhatsApp. The site does not charge a card or automatically grant course access.

## 1. Put the extracted project on GitHub

Repository: <https://github.com/ecomlikdgs-dev/FromCODEX>.

GitHub must contain the actual folders, including `src/` and `public/brand/`, beside `package.json`, `index.html` and `netlify.toml`. A ZIP uploaded as a repository file is an archive; Netlify does not extract it to build your app. The earlier uploaded root files alone are incomplete.

The Netlify-ready work is prepared on the branch `codex/netlify-launch`. If that branch has been pushed, select it in GitHub to review the files. You can deploy this branch directly, or open a pull request, merge it into `main`, and deploy `main`. Do not deploy the earlier incomplete `main` branch before merging.

If uploading manually, download the updated source archive, **extract it**, open the `ecomlik-academy` folder, and upload its contents to the repository root. Keep the `src`, `public`, `tests`, `server`, and `docs` folders intact. Include `netlify.toml`, `.npmrc` and the other configuration files. Do not upload `node_modules`, `data`, `.env`, or only the ZIP. Do not place the app one extra directory below the repository root unless you intentionally set Netlify's base directory to that folder.

If using Git locally, clone the connected repository, copy the updated extracted project into that checkout, then commit and push normally. Do not force-push over the uploaded history.

## 2. Connect Netlify to GitHub

1. Sign in to <https://app.netlify.com/>.
2. Choose **Add new project → Import an existing project** (the exact wording can vary).
3. Choose **GitHub** and authorize Netlify to access `ecomlikdgs-dev/FromCODEX`. Granting access to this repository is sufficient.
4. Select the repository.
5. Choose the deployment branch: **`codex/netlify-launch`**, or **`main` after merging the prepared branch**.
6. Leave **Base directory** empty. Use these settings, also saved in `netlify.toml`:

| Setting           | Value                   |
| ----------------- | ----------------------- |
| Build command     | `npm run build:netlify` |
| Publish directory | `dist`                  |
| Node version      | `24`                    |

7. Deploy the project. Netlify will give you a public HTTPS address ending in `.netlify.app`. Choose the project name you want if it is available; no particular name is reserved by this source code.

You do not run `npm start` on Netlify. This build uses Netlify Forms instead of the local Express/SQLite server. You do not need `PUBLIC_ORIGIN`, a database credential, a WhatsApp API token, or a GA secret for this deployment. The owner-confirmed WhatsApp number and public GA4 ID are already in `src/content.ts`.

## 3. Enable the form and verify real submissions

1. Open the project's **Forms** area and enable **form detection** if it is disabled.
2. If enabling detection after the first deploy, trigger another deploy so Netlify scans the published HTML.
3. Check that a form named **`ecomlik-academy`** appears.
4. Open the **public production address**, complete an enquiry using contact details you control, and submit it.
5. Confirm that the submission appears in **Forms → ecomlik-academy**. If it does not, check the spam section, detection setting, deploy logs, and the browser's failed POST request before accepting real enquiries. A success screen alone is not proof of a saved Netlify submission.
6. On the confirmation screen, press the WhatsApp button. Verify the destination is **+212 650 291 012**, review the prepared message, and press **Send**. Check that your business WhatsApp account receives it.
7. Add the email notification you want in Netlify's form notification settings and test that it arrives. No notification recipient has been invented or configured in the source.

Netlify stores the enrolment requests in its Forms dashboard, where you can review/export them even if the visitor does not finish sending the WhatsApp message. Netlify's spam filtering and your plan's form limits apply; check the plan and usage in your account. The local Express rate limit and SQLite database do not run on Netlify.

Submissions include name, normalized phone, country, stage/interest, consent, course, quoted prices, campaign tags and a submission UUID. Netlify supplies its own received timestamp. The consent timestamp field is browser-supplied. A retry after a connection failure can create a duplicate on Netlify; use `submission_id` to recognize retries. No private submission list or credentials are bundled into the public site.

## 4. Check analytics and your domain

- Accept analytics on a test visit and check GA4 Realtime/DebugView for property measurement ID **G-02NN6XJBCT**. Mark `lead_submit_success` as a key event and keep `whatsapp_click` separate. Neither event is proof of payment.
- In Netlify's **Domain management**, add your custom domain when you have one. Apply the exact DNS records Netlify gives you and wait for DNS and HTTPS to be verified. The form posts to the current origin, so no API-origin setting needs changing when adding the domain.
- If the GA web data stream still uses another website URL, update it for the production address/custom domain.
- Once the repository is connected, pushing a commit to the selected deployment branch normally triggers a rebuild automatically. Check Netlify's deploy result before assuming a change is live.

## Local checks before publishing

```sh
npm ci
npm run build:netlify
npm run test:netlify
```

The Netlify browser tests exercise the built bundle and **simulate** Netlify's form responses. They verify the HTML declaration, encoded request, consent, failure handling and WhatsApp link. They cannot prove persistence in an account that has not yet been deployed. `npm run preview:netlify` previews the compiled design locally; its static server does **not** save real Netlify submissions.

Official references: [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/) and [Deploy from a repository](https://docs.netlify.com/start/quickstarts/deploy-from-repository/). These sites were blocked by the cloud proxy during preparation, so account-specific UI names and plan availability must be checked in your own dashboard.
