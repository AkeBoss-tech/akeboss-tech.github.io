// This function is serialized by chrome.scripting.executeScript. Keep every
// dependency inside the function so it cannot inherit extension-page state.
export function extractVisibleJob() {
  const clip = (value, maximum) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maximum);
  const textFromHtml = (value) => {
    const parsed = new DOMParser().parseFromString(String(value ?? ''), 'text/html');
    return clip(parsed.body?.textContent, 4_000);
  };
  const hasType = (value, expected) => {
    const types = Array.isArray(value?.['@type']) ? value['@type'] : [value?.['@type']];
    return types.some((type) => String(type).toLowerCase() === expected.toLowerCase());
  };
  const findPosting = (value, depth = 0) => {
    if (!value || depth > 6) return null;
    if (Array.isArray(value)) {
      for (const item of value.slice(0, 100)) {
        const found = findPosting(item, depth + 1);
        if (found) return found;
      }
      return null;
    }
    if (typeof value !== 'object') return null;
    if (hasType(value, 'JobPosting')) return value;
    for (const key of ['@graph', 'mainEntity', 'itemListElement']) {
      const found = findPosting(value[key], depth + 1);
      if (found) return found;
    }
    return null;
  };
  const locationLabel = (posting) => {
    const raw = Array.isArray(posting?.jobLocation) ? posting.jobLocation[0] : posting?.jobLocation;
    const address = raw?.address ?? raw;
    return clip([
      address?.addressLocality,
      address?.addressRegion,
      address?.addressCountry,
    ].filter(Boolean).join(', '), 300);
  };

  let posting = null;
  for (const script of [...document.querySelectorAll('script[type="application/ld+json"]')].slice(0, 50)) {
    try {
      posting = findPosting(JSON.parse(script.textContent ?? ''));
      if (posting) break;
    } catch {
      // Malformed third-party structured data is ignored for this manual capture.
    }
  }
  const selectedText = clip(globalThis.getSelection?.().toString(), 2_000);
  return {
    url: globalThis.location.href,
    title: clip(posting?.title ?? document.title, 300),
    company: clip(posting?.hiringOrganization?.name, 200),
    location: locationLabel(posting),
    description: textFromHtml(posting?.description),
    selected_text: selectedText,
    source: 'manual_visible_page',
  };
}
