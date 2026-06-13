# Deployment

This project is designed for the MR.com Direct Upload flow.

1. Copy `quotetron` into the MR.com site's app directory.
2. Run `npm run check`.
3. Run `npm run build`.
4. Run `npx wrangler pages deploy dist --project-name milsimrooster-com --branch main`.
5. Verify `https://milsimrooster.com/apps/quotetron/` over HTTPS on the live custom domain.

GitHub pushes alone do not deploy the current MR.com site.
