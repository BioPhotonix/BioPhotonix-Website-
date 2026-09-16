# Going live

Everything here is done in a browser. No code changes are needed. Do the
steps in order: each one depends on the last.

Time: an afternoon, most of it waiting for DNS.

## 0. Merge the pull request

Merge PR #1 into `main` on GitHub. Vercel deploys from `main`, so nothing
below works until it is there.

## 1. Deploy to Vercel

1. Go to vercel.com and sign up with your GitHub account.
2. **Add New, Project**, pick `BioPhotonix/BioPhotonix-Website-`, and press
   **Deploy**. Vercel recognises a Next.js app; accept every default.
3. Two minutes later you have a `something.vercel.app` address. Open it and
   click through every page. This is the site exactly as it will appear on
   your domain.

**Plan.** Vercel's free Hobby plan is for non-commercial use under its terms,
and a company website is commercial. Take the Pro plan (about $20 a month);
the site will run on Hobby while you set up, but switch before launch.

From now on every push to `main` deploys automatically, and every pull
request gets its own preview address.

## 2. Turn the forms on with Resend

The contact form, the clinic registration and the investor data-room request
all send email through Resend. Until this step is done they tell people to
email `info@biophotonix.co.uk` instead. Nothing is lost, but nothing arrives
either.

**Step 1. Sign up** at resend.com. The free tier covers 3,000 emails a month.

**Step 2. Add your domain.** Resend, Domains, Add Domain, `biophotonix.co.uk`.
**When it asks for a region, choose Ireland (eu-west-1).** These emails carry
enquirers' names and, from clinics, practice details, so keep them in the EU.
It cannot be changed afterwards without adding the domain again.

**Step 3. Add the DNS records.** Resend shows three. Add them wherever the
DNS for `biophotonix.co.uk` is managed. If you bought the domain through Wix,
that is Wix: **Domains, biophotonix.co.uk, Advanced, Edit DNS**.

| Type | Host / Name | Value |
|---|---|---|
| MX | `send` | the `feedback-smtp…amazonses.com` address Resend shows, priority 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| TXT | `resend._domainkey` | the long `p=…` key Resend shows |

Two things that catch people out:

- **Some DNS panels append the domain for you.** If the Host field already
  shows `.biophotonix.co.uk` after what you type, enter just `send`, not
  `send.biophotonix.co.uk`. Getting this wrong creates
  `send.biophotonix.co.uk.biophotonix.co.uk`, which never verifies.
- **These records are on the `send` subdomain, so they do not disturb the
  email you already receive** at `info@biophotonix.co.uk`. Do not put the SPF
  record on the root domain; that is what breaks existing mail.

Then press **Verify** in Resend. Usually minutes, occasionally an hour.

**Do not turn on "Enable Receiving".** It sits next to the sending setup and
looks like part of the same job. It is not. Receiving replaces the MX record
on the root domain, which is what delivers `info@biophotonix.co.uk` to your
inbox today. Turn it on and the inbox goes silent. Nothing here needs it:
everything the site sends is outbound, and replies come back to your real
inbox because every email carries a `reply_to` header.

**Step 4. Create an API key.** Resend, API Keys, Create. "Sending access" is
enough. Copy it; you are not shown it again.

**Step 5. Add two variables in Vercel.** Project, Settings, Environment
Variables, for Production, Preview and Development:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | the key from step 4 |
| `CONTACT_FROM` | `BioPhotonix <info@biophotonix.co.uk>` |

`CONTACT_FROM` must be on the domain you verified. Then **Deployments, the
latest one, Redeploy**. Vercel only reads new variables on a fresh build.

Optional: `CONTACT_TO` if enquiries should land somewhere other than
`info@biophotonix.co.uk`.

**Step 6. Prove it works.** Two checks, in order:

1. `your-site.vercel.app/api/health` should say `"email": "ok"`. If it still
   says `not configured`, the variables are not in the build yet: redeploy.
2. Send yourself an enquiry from the contact page. Two emails should arrive:
   the enquiry in the BioPhotonix inbox, and an acknowledgement at the address
   you typed. Reply to the enquiry and check it reaches you.

If Resend refuses a send, the reason is shown on the page rather than hidden.

## 3. Point the domain at Vercel

Do this last, once everything above looks right on the `.vercel.app` address.

1. Vercel, Project, Settings, Domains. Add `www.biophotonix.co.uk`, then
   `biophotonix.co.uk`. When it asks, set the apex to redirect to `www`.
2. Vercel shows the records it needs: a CNAME for `www` and an A record for
   the apex. Copy the values it shows rather than any from a tutorial; they
   have changed over the years.
3. At your DNS host (Wix, if the domain is registered there), find the
   existing A and CNAME records that point at Wix, and replace them with
   Vercel's. **Change nothing else.** The MX records are your email; the
   `send` and `resend._domainkey` records are step 2.
4. Wait. Vercel checks the records every few minutes and issues the SSL
   certificate itself once they resolve. Usually under an hour, occasionally
   most of a day. The Domains screen tells you when it is done.

If the domain is registered with Wix, you can leave it registered there and
only change the DNS records. You do not need to transfer the domain to leave
Wix. Do not let the domain registration lapse when you cancel the site plan:
they are separate purchases in Wix.

## 4. Check the live site

- `https://www.biophotonix.co.uk` loads with a padlock.
- `https://biophotonix.co.uk` redirects to `www`.
- `https://www.biophotonix.co.uk/post/the-silent-epidemic-addressing-the-unmet-need-in-dry-amd`
  redirects to the article under `/news`. This is what carries the old
  links from LinkedIn and email across.
- `https://www.biophotonix.co.uk/api/health` says `"email": "ok"`.
- Send one more enquiry, from a phone, now that the domain is live.

## 5. Tell Google

Google Search Console, add `biophotonix.co.uk` as a domain property, verify
with the TXT record it gives you, then **Sitemaps** and submit
`https://www.biophotonix.co.uk/sitemap.xml`. Without this the move can take
months to show up in search.

## 6. Cancel Wix

Wait a week with the new site live first, so the DNS change has settled
everywhere and you have seen enquiries arrive. Then in Wix, **Subscriptions**,
cancel the **Premium site plan**. Keep the **domain** subscription if the
domain is registered with Wix, and keep any **mailbox** subscription if
`info@biophotonix.co.uk` is provided through Wix. Those are the two things
that must survive.

## Afterwards

- **Wording** lives in `src/content/site.ts`. Edit it on GitHub, commit to
  `main`, and Vercel deploys it in about two minutes.
- **A new article** is an entry appended to `src/content/posts.ts`.
- **A new photograph** goes in `source-images/` (not committed) and a line in
  `scripts/build-images.mjs`; run `npm run build:images` and commit the
  result in `public/images/`.
- **Milestones** are `roadmap.stages` in `site.ts`: change a stage's status
  from `current` to `complete` as they land.
