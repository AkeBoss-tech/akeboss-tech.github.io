# Akash Dubey's portfolio

This is a Next.js 16 portfolio exported as a static site and deployed to GitHub Pages. The root website uses Bun 1.4 for dependency installation, local scripts, and CI builds. The separate `career/` tools remain a Node.js package with their own lockfile and instructions.

## Run locally

Install [Bun 1.4](https://bun.com/docs/installation), then run:

```bash
bun ci
bun run dev
```

The development server runs at <http://localhost:3001>.

## Validate and build

```bash
bun run lint
bun run test
bun run check
bun run wiki:validate
GITHUB_PAGES=true bun run build
bun run redirects:build
```

The GitHub Pages export is written to `out/`. CI pins Bun 1.4.0 and uses the committed `bun.lock` for reproducible installs.

`bun run check` runs linting, wiki validation, and the Bun test suite concurrently. `bun run audit` reports high-severity dependency advisories. New dependency resolutions must be at least three days old, and Bun's implicit package auto-install is disabled in `bunfig.toml`.

## Analytics configuration

To enable PostHog analytics locally and in production, add these variables:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The app initializes PostHog through [`instrumentation-client.ts`](./instrumentation-client.ts) when both values are present.
