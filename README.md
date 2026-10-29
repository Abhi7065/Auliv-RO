# Auliv RO’s

Auliv-branded purifier sales and all-brand RO after-sales care. Built with React, Vinext, Cloudflare Workers, D1 and Drizzle, using the Sites starter integrations.

## Run locally

Use Node.js 22.13+ and npm. Run `npm ci`, then `npm run dev`. The development sign-in uses `seedy@sites.test`. For dashboard QA only, set `ADMIN_EMAIL=seedy@sites.test` in an untracked `.dev.vars` file. Never use this mock email in production.

## Database

Five tables store customers, enquiries, installations, service history and AMC plans. Production database provisioning and migration application are managed by Sites using `.openai/hosting.json` and the SQL in `drizzle/`. Do not edit an applied migration. After changing the schema, run `npm run db:generate` and review the generated SQL.

For local database setup, build first and execute each pending SQL file with:

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_graceful_wrecker.sql
```

Local and production databases are separate. Test records are never packaged or uploaded.

## Private team dashboard

Set `ADMIN_EMAIL` in Sites runtime settings to the authorised administrator’s ChatGPT sign-in email. `/admin` requires ChatGPT sign-in and a matching email; `/api/admin` checks authorisation on every request. No password or shared admin key is embedded in the browser. Public enquiries do not expose customer records.

The dashboard supports enquiry status changes, enquiry-to-customer conversion, customer editing, installations and warranty dates, service scheduling and completion, AMC coverage and renewal tracking, search and CSV export. AMC indicators include expired and next-30-day plans; automated reminders are not configured.

Public form validation, a honeypot, same-origin checks and database-backed hourly rate limits protect the enquiry endpoint. SQL values use bound parameters. CSV export escapes spreadsheet formula prefixes.

## Build and publish

`npm run build` produces the Worker and assets. Use the Sites skill workflow to synchronise exact source, package the built archive, save a version and deploy. GitHub Pages alone does not run the Worker or D1 backend. The Sites source remote and GitHub source mirror are separate; GitHub pushes do not automatically deploy this Site.

## Content to finalise

Product illustrations are explicitly labelled concepts. Add real Auliv model photos, specifications, prices and warranty terms once supplied. Current phone, email and Delhi NCR service area are retained from the supplied prototype. No third-party brand service lists, fabricated product specifications or testimonials are included.

## Validation

TypeScript and production build verified. Local end-to-end checks cover enquiries, customer conversion, installation/service/AMC creation, service completion, duplicate phone handling, invalid dates, invalid customer references, unauthorised access, same-origin enforcement and persistent rate limits. Browser checks cover form success, dashboard records and mobile navigation. Local QA records are not production data.

## GitHub Pages deployment

The dedicated source repository is `Abhi7065/Auliv-RO`. GitHub Pages serves the generated storefront in `docs/` at `https://abhi7065.github.io/Auliv-RO/`. Configure Pages to deploy from the `main` branch and `/docs` folder.

Run `npm run build:pages` after changing the public storefront, then commit the updated `docs/` files. The generator reuses the same storefront and CSS, sets the repository base path, and points enquiry submissions to the hosted Auliv API. The backend permits CORS only from `https://abhi7065.github.io`; admin operations retain same-origin enforcement and require the authorised ChatGPT account. Customer records, runtime secrets and the dashboard remain hosted on Sites and are never published in GitHub Pages assets.

The Pages frontend and server backend are separate deployments. Keep the Sites backend running for bookings and customer management. Changing backend code in GitHub alone does not deploy it; use the Sites workflow. No hosting migration or database copy is performed.
