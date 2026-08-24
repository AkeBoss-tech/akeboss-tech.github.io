# Career Monitor Chrome extension

This unpacked Manifest V3 extension is a small local control surface for the
deterministic scanner. It talks to a macOS native-messaging host over Chrome's
length-prefixed stdio protocol. It does not open a localhost port and it has no
permission to fetch arbitrary websites.

Its stable unpacked extension ID is:

```text
hjmedfgjhbbfpmdmpikekgpngokcpfol
```

## Setup on macOS

From `career/`:

```bash
npm run extension:native:preview
npm run extension:native:install
```

Then open `chrome://extensions`, enable Developer mode, choose **Load
unpacked**, and select the `career/chrome-extension` directory. Confirm Chrome
shows the ID above. The installer only registers that exact extension origin
with the native host; it does not load or modify Chrome itself.

Use `npm run extension:native:uninstall` to remove the per-user native-host
manifest and wrapper. Reload the extension after installing or upgrading the
host.

## Behavior and privacy boundary

- A Chrome alarm wakes every 15 minutes while Chrome is running. It asks the
  native host to launch the existing due-source monitor; SQLite leases and
  source cadences decide whether any work is actually needed.
- The popup shows control-plane health, due/escalation counts, the latest new
  relevant count, and at most eight recent relevant roles.
- **Run due sources** launches the same local deterministic monitor manually.
- **Capture this visible job** is the only browser-page collection feature. It
  runs only after that click and only in the active tab. It saves a sanitized
  HTTPS URL (query and fragment removed), bounded JobPosting JSON-LD fields,
  and up to 2,000 characters the user selected. It never reads cookies,
  browsing history, hidden tabs, or page HTML.
- Manual captures go to ignored `data/manual-captures.ndjson` with
  `manual_review` status. They never enter canonical jobs or job-closure logic.
- LinkedIn and Handshake are not crawled or automated. A user may manually
  capture the currently visible posting, subject to their access and the site's
  terms.

The extension alarm is complementary to the macOS LaunchAgent. Chrome may
delay alarms while the browser or computer sleeps; the LaunchAgent remains the
more reliable background scheduler.
