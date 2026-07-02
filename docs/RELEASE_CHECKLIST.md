# MR.com Release Checklist

Last updated: 2026-07-02

Cloudflare Pages for MR.com is Direct Upload. A GitHub push does not deploy the live site.

## Standard Release

From `E:\games\website`:

```powershell
.\scripts\release-mrcom.ps1
```

This runs:

1. `npm run check`
2. `npm run build`
3. `npx wrangler pages deploy dist --project-name milsimrooster-com --branch main`
4. live `HEAD` checks for the home page, gallery, and hosted apps

## Local Validation Only

Use this before committing or when Cloudflare deploy is not intended:

```powershell
.\scripts\release-mrcom.ps1 -SkipDeploy -SkipLiveCheck
```

## Release Rules

- Do not claim the live site changed until the Direct Upload deploy has completed.
- Do not claim routes are live until the route checks return HTTP 200.
- Hosted apps under `public\apps\` are the live source of truth.
- Standalone app folders are source-history unless a sync workflow is explicitly chosen.
- Preserve existing validators when changing apps. Add a validator for any new cross-app rule.
