import { normalizePersonio } from '../core.mjs';
import { fetchText } from './http.mjs';
import {
  assertXmlRoot,
  xmlElement,
  xmlElements,
  xmlOpeningTagCount,
  xmlRawValue,
  xmlValue,
} from './xml.mjs';

export function parsePersonioXmlWithEvidence(xml) {
  assertXmlRoot(xml, ['workzag-jobs']);
  const positions = xmlElements(xml, 'position');
  const rawCount = xmlOpeningTagCount(xml, 'position');
  const jobs = positions.map((position) => {
    const additional = xmlElement(position, 'additionalOffices');
    const descriptions = xmlElement(position, 'jobDescriptions');
    return {
      id: xmlValue(position, 'id'),
      subcompany: xmlValue(position, 'subcompany'),
      office: xmlValue(position, 'office'),
      additionalOffices: additional ? xmlElements(additional, 'office').map((office) => xmlValue(`<office>${office}</office>`, 'office')).filter(Boolean) : [],
      department: xmlValue(position, 'department'),
      recruitingCategory: xmlValue(position, 'recruitingCategory'),
      name: xmlValue(position, 'name'),
      employmentType: xmlValue(position, 'employmentType'),
      schedule: xmlValue(position, 'schedule'),
      workplaceType: xmlValue(position, 'workplaceType'),
      occupation: xmlValue(position, 'occupation'),
      yearsOfExperience: xmlValue(position, 'yearsOfExperience'),
      createdAt: xmlValue(position, 'createdAt'),
      updatedAt: xmlValue(position, 'updatedAt'),
      url: xmlValue(position, 'url'),
      applyUrl: xmlValue(position, 'applyUrl'),
      jobDescriptions: descriptions ? xmlElements(descriptions, 'jobDescription').map((description) => ({
        name: xmlValue(description, 'name'),
        value: xmlRawValue(description, 'value'),
      })) : [],
    };
  }).filter((job) => job.id && job.name);
  return {
    jobs,
    rawCount,
    invalidCount: Math.max(0, rawCount - jobs.length),
  };
}

export function parsePersonioXml(xml) {
  return parsePersonioXmlWithEvidence(xml).jobs;
}

export const personioConnector = {
  type: 'personio',
  describe(company, inferred) {
    let sourceUrl = company.api ?? company.feed_url;
    if (!sourceUrl && company.careers_url) {
      const careersUrl = new URL(company.careers_url);
      if (/\.jobs\.personio\./i.test(careersUrl.hostname)) {
        careersUrl.pathname = '/xml';
        careersUrl.search = '';
        careersUrl.hash = '';
        sourceUrl = careersUrl.toString();
      }
    }
    sourceUrl ??= `https://${encodeURIComponent(inferred.slug)}.jobs.personio.de/xml`;
    const url = new URL(sourceUrl);
    if (!url.searchParams.has('language')) url.searchParams.set('language', company.language ?? 'en');
    return {
      ...inferred,
      sourceUrl: url.toString(),
      careersBase: company.personio_careers_url ?? new URL('/', url).toString(),
    };
  },
  async scan({ company, source, options }) {
    const parsed = parsePersonioXmlWithEvidence(await fetchText(source.sourceUrl, {
      ...options,
      accept: 'application/xml, text/xml',
    }));
    const complete = parsed.invalidCount === 0;
    return {
      jobs: parsed.jobs.map((job) => normalizePersonio(company, source, job)),
      complete,
      advertisedTotal: parsed.rawCount,
      diagnostics: complete ? null : {
        raw_entries: parsed.rawCount,
        invalid_entries: parsed.invalidCount,
        partial_reason: 'invalid_feed_entries',
      },
    };
  },
};
