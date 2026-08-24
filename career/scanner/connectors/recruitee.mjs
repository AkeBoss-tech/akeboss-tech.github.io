import { normalizeRecruitee } from '../core.mjs';
import { fetchText } from './http.mjs';
import {
  assertXmlRoot,
  xmlBoolean,
  xmlElement,
  xmlElements,
  xmlOpeningTagCount,
  xmlNumber,
  xmlRawValue,
  xmlValue,
} from './xml.mjs';

export function parseRecruiteeXmlWithEvidence(xml) {
  assertXmlRoot(xml, ['jobs', 'offers']);
  const root = String(xml ?? '')
    .trim()
    .replace(/^<\?xml\b[\s\S]*?\?>\s*/i, '')
    .match(/^<(?:(?:[a-z][\w.-]*):)?(jobs|offers)\b/i)?.[1]?.toLowerCase();
  if (!root) throw new Error('Malformed XML response: could not determine Recruitee feed root');
  const entryTag = root === 'offers' ? 'offer' : 'job';
  const entries = xmlElements(xml, entryTag);
  const rawCount = xmlOpeningTagCount(xml, entryTag);
  const jobs = entries.map((entry) => {
    const locations = xmlElement(entry, 'locations');
    const salary = xmlElement(entry, 'salary');
    const description = xmlRawValue(entry, 'description_requirements')
      ?? xmlRawValue(entry, 'description');
    const requirements = root === 'offers' ? xmlRawValue(entry, 'requirements') : null;
    return {
      reference: xmlValue(entry, 'reference') ?? xmlValue(entry, 'id'),
      slug: xmlValue(entry, 'slug'),
      title: xmlValue(entry, 'title'),
      company: xmlValue(entry, 'company') ?? xmlValue(entry, 'company_name'),
      companyId: xmlValue(entry, 'company_id'),
      description: [description, requirements].filter(Boolean).join('\n'),
      location: xmlValue(entry, 'location'),
      city: xmlValue(entry, 'city'),
      state: xmlValue(entry, 'state') ?? xmlValue(entry, 'state_code'),
      country: xmlValue(entry, 'country'),
      locations: locations ? xmlElements(locations, 'location').map((location) => ({
        city: xmlValue(location, 'city'),
        region: xmlValue(location, 'state') ?? xmlValue(location, 'state_code'),
        country: xmlValue(location, 'country'),
      })) : [],
      hybrid: xmlBoolean(xmlValue(entry, 'hybrid')),
      onSite: xmlBoolean(xmlValue(entry, 'on_site')),
      remote: xmlBoolean(xmlValue(entry, 'remote')),
      education: xmlValue(entry, 'education') ?? xmlValue(entry, 'education_code'),
      experience: xmlValue(entry, 'experience') ?? xmlValue(entry, 'experience_code'),
      contractType: xmlValue(entry, 'contract_type') ?? xmlValue(entry, 'employment_type_code'),
      department: xmlValue(entry, 'department'),
      category: xmlValue(entry, 'category'),
      minHours: xmlNumber(xmlValue(entry, 'min_hours') ?? xmlValue(entry, 'min_hours_per_week')),
      maxHours: xmlNumber(xmlValue(entry, 'max_hours') ?? xmlValue(entry, 'max_hours_per_week')),
      salary: salary ? {
        min: xmlNumber(xmlValue(salary, 'min_salary') ?? xmlValue(salary, 'min')),
        max: xmlNumber(xmlValue(salary, 'max_salary') ?? xmlValue(salary, 'max')),
        period: xmlValue(salary, 'period'),
        currency: xmlValue(salary, 'currency'),
      } : null,
      url: xmlValue(entry, 'url') ?? xmlValue(entry, 'careers_url'),
      applyUrl: xmlValue(entry, 'apply_url'),
      posted: xmlValue(entry, 'posted') ?? xmlValue(entry, 'published_at') ?? xmlValue(entry, 'created_at'),
      updated: xmlValue(entry, 'updated') ?? xmlValue(entry, 'updated_at'),
      language: xmlValue(entry, 'primary_lang_code'),
    };
  }).filter((job) => job.reference && job.title && job.url);
  return {
    jobs,
    rawCount,
    invalidCount: Math.max(0, rawCount - jobs.length),
  };
}

export function parseRecruiteeXml(xml) {
  return parseRecruiteeXmlWithEvidence(xml).jobs;
}

export const recruiteeConnector = {
  type: 'recruitee',
  describe(company, inferred) {
    const sourceUrl = company.api ?? company.feed_url;
    if (!sourceUrl) return null;
    return {
      ...inferred,
      sourceUrl,
    };
  },
  async scan({ company, source, options }) {
    const parsed = parseRecruiteeXmlWithEvidence(await fetchText(source.sourceUrl, {
      ...options,
      accept: 'application/xml, text/xml',
    }));
    const complete = parsed.invalidCount === 0;
    return {
      jobs: parsed.jobs.map((job) => normalizeRecruitee(company, source, job)),
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
