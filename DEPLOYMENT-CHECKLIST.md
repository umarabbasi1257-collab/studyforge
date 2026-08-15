# StudyForge production checklist

## Required from the owner
1. Buy a domain you control.
2. Create a static hosting account (Cloudflare Pages, Netlify, Vercel static hosting, or equivalent).
3. Upload the contents of this folder.
4. Connect the domain and enable HTTPS.
5. Replace `YOUR-DOMAIN.example` in `robots.txt` and `sitemap.xml` with the real domain.
6. Replace the placeholder support email in `privacy.html` and `terms.html`.
7. Create a Google Search Console property for the real domain and submit `/sitemap.xml`.

## Optional monetization
- Add analytics only after choosing the provider and updating the privacy policy.
- Add advertising only after the site has substantial original content and the account is eligible.
- Add paid accounts/payments only after a backend, authentication, webhook verification, refund policy, and secure secret storage are configured. Never put secret API keys in `script.js`.

## Important
This package is a deployment-ready static frontend, not a hosted SaaS backend. Domain purchases, account ownership, identity checks, payment-provider onboarding, and DNS changes require the site owner.
