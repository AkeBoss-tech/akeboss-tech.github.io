# Scarlet Sync multimedia update — November 4, 2026

Implementation and verification notes prepared before release. Git history and the GitHub Pages workflow record the subsequent commit and deployment status.

- Embedded the existing 45-second silent product film with native controls, descriptive context, and a web-sized 1080p copy (7.5 MB versus 37 MB original).
- Added an automatically rotating three-image carousel, captions, pause/play, arrow and dot controls, keyboard navigation, and reduced-motion support.
- Linked the homepage Scarlet Sync card directly to `/projects/scarlet-sync#behind-the-build`.
- Expanded the project story around conversations with many Rutgers students, based on the user's November 4 request. No interview count or specific research findings were invented.
- Replaced old Scarlet Sync media containing a development-error badge and a test fixture with public-site captures. Kept complete interfaces and research figures visible in homepage galleries, added captions, widened secondary images, and retained click-to-expand behavior. Photos use a separate crop treatment.
- Audio draft: `drafts/scarlet-sync-audio-script.md`. Recording and embedding the final audio remain outstanding.

## Image provenance

All three new images are browser screenshots, with no generated interface content:

- `images/portfolio/scarlet-sync/product-overview.png`: https://scarletsync.app/ — public homepage and example prerequisite graph, captured November 4, 2026.
- `images/portfolio/scarlet-sync/schedule-preview.png`: https://scarletsync.app/ — fully populated example schedule in the public product tour, captured November 4, 2026. This is a public preview, not an authenticated student's plan.
- `images/portfolio/scarlet-sync/course-catalog.png`: https://scarletsync.app/courses — public course catalog, captured November 4, 2026.

The signed-in scheduler and degree planner redirect to login. No login or saved student data was used. Public paths and captions identify the preview images as examples. `public/images` is a symlink to the repository's `images` directory.

## Verification

- Scoped ESLint and TypeScript passed.
- Existing image tests passed: 10 tests; responsive AVIF/WebP assets generated for the three new images.
- Wiki validation passed: 40 pages and 81 related links.
- Direct Next.js production build passed, generating 145 routes.
- Production-browser verification: homepage link, actual video playback, automatic rotation, pause, next/previous/dots, keyboard wrap, reduced-motion default, mobile/tablet overflow, and all homepage gallery images. No page errors. Evidence: `out/screenshots/multimedia-20261104/verification.json` and screenshots in the same directory.
- The normal `bun run build` prebuild is blocked on this machine: installed Bun 1.3.13 lacks `Bun.file(...).image()`, which the existing image builder uses; package.json specifies Bun 1.4.0. The existing build script was preserved. New image derivatives and placeholders were generated with the installed sharp library, then tested. The direct Next.js build was used for production verification.
