import type { Post, Project } from '@/lib/content'
import { cleanMarkdownText, getPosts, getProjects } from '@/lib/content'
import { storyTimeline } from '@/lib/site-data'
import { absoluteUrl, siteName, siteUrl } from '@/lib/seo'

function bulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n')
}

function summarize(value: string, maxLength = 220) {
  const cleaned = cleanMarkdownText(value).replace(/\s+/g, ' ').trim()
  if (cleaned.length <= maxLength) return cleaned
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`
}

function formatTags(tags: string[]) {
  return tags.length ? tags.join(', ') : 'none'
}

function projectLine(project: Project) {
  return `- [${project.title}](${absoluteUrl(`/projects/${project.slug}`)}): ${summarize(project.excerpt || project.lead)}`
}

function postLine(post: Post) {
  return `- [${post.title}](${absoluteUrl(`/writing/${post.slug}`)}): ${summarize(post.excerpt || post.lead)}`
}

export function buildLlmsIndex() {
  const projects = getProjects()
  const posts = getPosts()

  return [
    `# ${siteName}`,
    '',
    '> Personal website and portfolio for Akash Dubey.',
    '',
    `Canonical site: ${siteUrl}`,
    `Full machine-readable index: ${absoluteUrl('/llms-full.txt')}`,
    '',
    '## Main pages',
    bulletList([
      `[Home](${absoluteUrl('/')}): Software engineering, AI systems, robotics, research, and product work.`,
      `[About](${absoluteUrl('/about')}): Background, interests, and current direction.`,
      `[Projects](${absoluteUrl('/projects')}): Portfolio projects across startups, AI, data, robotics, and software.`,
      `[Writing](${absoluteUrl('/writing')}): Writing on programming, robotics, school, and reflection.`,
      `[Story](${absoluteUrl('/story')}): Timeline showing how projects and interests connect over time.`,
      `[Resume](${absoluteUrl('/resume')}): Recruiter-facing summary and PDF resume.`,
      `[Contact](${absoluteUrl('/contact')}): Contact details and external profiles.`,
    ]),
    '',
    '## Selected projects',
    bulletList(projects.slice(0, 12).map((project) => `[${project.title}](${absoluteUrl(`/projects/${project.slug}`)}): ${summarize(project.excerpt || project.lead, 160)}`)),
    '',
    '## Recent writing',
    bulletList(posts.slice(0, 8).map((post) => `[${post.title}](${absoluteUrl(`/writing/${post.slug}`)}): ${summarize(post.excerpt || post.lead, 160)}`)),
  ].join('\n')
}

export function buildLlmsFull() {
  const projects = getProjects()
  const posts = getPosts()

  return [
    `# ${siteName}`,
    '',
    '> Extended machine-readable index for language models, search tools, and other text-first readers.',
    '',
    `Canonical site: ${siteUrl}`,
    '',
    '## Site summary',
    'Akash Dubey is a Rutgers student working across computer science, mathematics, software engineering, AI systems, robotics, research, and product development.',
    '',
    '## Main pages',
    bulletList([
      `[Home](${absoluteUrl('/')}): Entry point to the portfolio and featured work.`,
      `[About](${absoluteUrl('/about')}): Personal background and working style.`,
      `[Projects](${absoluteUrl('/projects')}): Full project archive.`,
      `[Writing](${absoluteUrl('/writing')}): Articles and reflections.`,
      `[Story](${absoluteUrl('/story')}): Narrative timeline.`,
      `[Resume](${absoluteUrl('/resume')}): Resume overview and PDF.`,
      `[Contact](${absoluteUrl('/contact')}): Contact information.`,
    ]),
    '',
    '## Story timeline',
    bulletList(storyTimeline.map((beat) => `${beat.year}: ${beat.title}. ${beat.body}`)),
    '',
    '## Projects',
    ...projects.flatMap((project) => [
      `### ${project.title}`,
      `URL: ${absoluteUrl(`/projects/${project.slug}`)}`,
      `Date: ${project.date}`,
      `Tags: ${formatTags(project.tags)}`,
      `Summary: ${summarize(project.excerpt || project.lead, 320)}`,
      project.sections.length
        ? `Sections: ${project.sections.map((section) => `${section.title}${section.summary ? ` - ${summarize(section.summary, 120)}` : ''}`).join(' | ')}`
        : 'Sections: none listed',
      project.links.length
        ? `Links: ${project.links.map((link) => `${link.label} (${link.url})`).join(' | ')}`
        : 'Links: none listed',
      '',
    ]),
    '## Writing',
    ...posts.flatMap((post) => [
      `### ${post.title}`,
      `URL: ${absoluteUrl(`/writing/${post.slug}`)}`,
      `Date: ${post.date}`,
      `Tags: ${formatTags(post.tags)}`,
      `Summary: ${summarize(post.excerpt || post.lead, 320)}`,
      '',
    ]),
  ].join('\n')
}

export function buildHomeLlmMarkdown(projects: Project[]) {
  return [
    '# Home',
    '',
    'Akash Dubey builds software, AI systems, robotics projects, and research-driven products.',
    '',
    '## Focus areas',
    bulletList([
      'Software engineering and full-stack product development',
      'AI systems and language-model-adjacent tools',
      'Research, mathematics, and data-heavy analysis',
      'Robotics and engineering projects',
    ]),
    '',
    '## Featured projects',
    ...projects.slice(0, 6).map(projectLine),
  ].join('\n')
}

export function buildProjectsLlmMarkdown(projects: Project[]) {
  return [
    '# Projects',
    '',
    'Portfolio index for selected software, AI, data, robotics, and research projects.',
    '',
    '## Entries',
    ...projects.map(projectLine),
  ].join('\n')
}

export function buildProjectLlmMarkdown(project: Project) {
  return [
    `# ${project.title}`,
    '',
    `URL: ${absoluteUrl(`/projects/${project.slug}`)}`,
    `Date: ${project.date}`,
    `Tags: ${formatTags(project.tags)}`,
    '',
    `Summary: ${summarize(project.excerpt || project.lead, 320)}`,
    '',
    project.sections.length
      ? `Sections: ${project.sections.map((section) => section.title).join(' | ')}`
      : 'Sections: none listed',
    project.links.length
      ? `Links: ${project.links.map((link) => `${link.label} (${link.url})`).join(' | ')}`
      : 'Links: none listed',
  ].join('\n')
}

export function buildWritingLlmMarkdown(posts: Post[]) {
  return [
    '# Writing',
    '',
    'Writing index covering programming, robotics, school, and reflection.',
    '',
    '## Entries',
    ...posts.map(postLine),
  ].join('\n')
}

export function buildPostLlmMarkdown(post: Post) {
  return [
    `# ${post.title}`,
    '',
    `URL: ${absoluteUrl(`/writing/${post.slug}`)}`,
    `Date: ${post.date}`,
    `Reading time: ${post.reading}`,
    `Tags: ${formatTags(post.tags)}`,
    '',
    `Summary: ${summarize(post.excerpt || post.lead, 320)}`,
  ].join('\n')
}

export function buildAboutLlmMarkdown() {
  return [
    '# About',
    '',
    'Akash Dubey is a builder, researcher, and operator working across software engineering, AI, product, and quantitative research.',
    '',
    '## Snapshot',
    bulletList([
      'Studies Computer Science and Mathematics at Rutgers',
      'Interested in turning messy systems into usable products',
      'Works across engineering, research, and product environments',
    ]),
  ].join('\n')
}

export function buildStoryLlmMarkdown() {
  return [
    '# Story',
    '',
    'A timeline showing how programming, robotics, writing, mathematics, research, and product work converged into one portfolio.',
    '',
    '## Timeline',
    ...storyTimeline.map((beat) => `- ${beat.year}: ${beat.title}. ${beat.body}`),
  ].join('\n')
}

export function buildResumeLlmMarkdown() {
  return [
    '# Resume',
    '',
    'Recruiter-facing page for internships, software engineering, AI systems, research, and product roles.',
    '',
    '## Highlights',
    bulletList([
      'Short summary of experience and focus areas',
      `PDF resume: ${absoluteUrl('/files/resume.pdf')}`,
      'External profile link to LinkedIn',
    ]),
  ].join('\n')
}

export function buildContactLlmMarkdown() {
  return [
    '# Contact',
    '',
    'Contact page for internships, research, product work, collaborations, and general outreach.',
    '',
    '## Contact methods',
    bulletList([
      'Email: akash.dubey@rutgers.edu',
      'GitHub: https://github.com/AkeBoss-tech',
      'LinkedIn: https://www.linkedin.com/in/akash---dubey/',
      `VCF card: ${absoluteUrl('/akash-dubey.vcf')}`,
    ]),
  ].join('\n')
}
