import { decodeHtmlEntities } from '../core.mjs';

function escapedTag(tag) {
  return String(tag).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function xmlElements(xml, tag) {
  const name = escapedTag(tag);
  const pattern = new RegExp(`<(?:(?:[a-z][\\w.-]*):)?${name}\\b[^>]*>([\\s\\S]*?)<\\/(?:(?:[a-z][\\w.-]*):)?${name}\\s*>`, 'gi');
  return [...String(xml ?? '').matchAll(pattern)].map((match) => match[1]);
}

export function xmlOpeningTagCount(xml, tag) {
  const name = escapedTag(tag);
  const pattern = new RegExp(`<(?:(?:[a-z][\\w.-]*):)?${name}\\b`, 'gi');
  return [...String(xml ?? '').matchAll(pattern)].length;
}

export function xmlAttribute(xml, tag, attribute) {
  const name = escapedTag(tag);
  const attributeName = escapedTag(attribute);
  const element = new RegExp(`<(?:(?:[a-z][\\w.-]*):)?${name}\\b([^>]*)>`, 'i')
    .exec(String(xml ?? ''))?.[1];
  if (element == null) return null;
  const value = new RegExp(`\\b${attributeName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i')
    .exec(element);
  return decodeHtmlEntities(value?.[1] ?? value?.[2] ?? value?.[3] ?? '') || null;
}

export function xmlElement(xml, tag) {
  return xmlElements(xml, tag)[0] ?? null;
}

export function xmlText(fragment) {
  if (fragment === null || fragment === undefined) return null;
  const text = String(fragment)
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '');
  const decoded = decodeHtmlEntities(text).trim();
  return decoded || null;
}

export function xmlValue(xml, tag) {
  const fragment = xmlElement(xml, tag);
  if (fragment === null) {
    const name = escapedTag(tag);
    if (new RegExp(`<(?:(?:[a-z][\\w.-]*):)?${name}\\b[^>]*/>`, 'i').test(String(xml ?? ''))) return null;
    return null;
  }
  return xmlText(fragment);
}

export function xmlRawValue(xml, tag) {
  const fragment = xmlElement(xml, tag);
  if (fragment === null) return null;
  const value = String(fragment)
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .trim();
  return decodeHtmlEntities(value) || null;
}

export function assertXmlRoot(xml, roots) {
  const value = String(xml ?? '').trim();
  if (!value.startsWith('<')) throw new Error('Malformed XML response: expected an XML document');
  const accepted = roots.some((root) => {
    const name = escapedTag(root);
    return new RegExp(`<${name}\\b[^>]*>[\\s\\S]*<\\/${name}\\s*>`, 'i').test(value);
  });
  if (!accepted) throw new Error(`Malformed XML response: expected <${roots.join('> or <')}> root`);
}

export function xmlBoolean(value) {
  return /^(?:1|true|yes)$/i.test(String(value ?? '').trim());
}

export function xmlNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
