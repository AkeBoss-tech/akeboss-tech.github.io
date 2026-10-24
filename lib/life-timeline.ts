// Chronological record for /experience. Sources: the CV page, project
// front matter, and the story timeline. Keep entries short: one line of body.

export type LifeKind = 'work' | 'research' | 'build' | 'school' | 'leadership' | 'milestone'

export type LifeEvent = {
  /** Sortable start, YYYY-MM. */
  start: string
  /** Human date label shown on the card. */
  when: string
  kind: LifeKind
  title: string
  role?: string
  body: string
  href?: string
  logo?: string
  image?: string
  /** Something that hasn't happened yet. */
  upcoming?: boolean
}

export const lifeKinds: Record<LifeKind, { label: string; hue: number }> = {
  work: { label: 'Work', hue: 220 },
  research: { label: 'Research', hue: 168 },
  build: { label: 'Builds', hue: 268 },
  school: { label: 'School', hue: 350 },
  leadership: { label: 'Leadership', hue: 32 },
  milestone: { label: 'Milestones', hue: 200 },
}

export const lifeEvents: LifeEvent[] = [
  {
    start: '2016-01',
    when: '2016',
    kind: 'milestone',
    title: 'The habit starts',
    body: 'Programming turns from curiosity into routine: small builds, too many ideas.',
  },
  {
    start: '2018-01',
    when: '2018',
    kind: 'milestone',
    title: 'Robotics adds pressure',
    body: 'Engineering gets physical. Code now has to survive deadlines and real machines.',
  },
  {
    start: '2020-09',
    when: 'Sep 2020 – Jun 2024',
    kind: 'school',
    title: 'Academy for Information Technology',
    role: 'Union County Vocational-Technical Schools',
    body: 'High school focused on computer science; Mathematics Award.',
    logo: '/school-logos/ait-logo.png',
  },
  {
    start: '2021-09',
    when: 'Sep 2021 – Jun 2024',
    kind: 'leadership',
    title: 'AIT Math League',
    role: 'Officer, then President',
    body: 'Ran practices and competitions for 50+ students; consistent top-three scorer.',
    logo: '/activity-logos/ucvts.png',
  },
  {
    start: '2022-09',
    when: 'Sep 2022 – Jun 2024',
    kind: 'leadership',
    title: 'FRC Team 1257',
    role: 'Programming Manager',
    body: 'Led a 30+ person programming group across robot code, controls, and vision.',
    href: '/projects/robot-code',
    logo: '/activity-logos/team-1257.png',
    image: '/images/posts/frc24/images/image2.png',
  },
  {
    start: '2022-12',
    when: 'Dec 2022 – now',
    kind: 'leadership',
    title: 'The Connection',
    role: 'ESL Instructor',
    body: 'Teaching English to 50+ adult learners, plus worksheets and tutoring tools.',
    href: '/projects/esl-worksheet',
    logo: '/activity-logos/the-connection.svg',
  },
  {
    start: '2023-05',
    when: 'May 2023 – Aug 2025',
    kind: 'work',
    title: 'Samaritan Scout',
    role: 'Full Stack Engineer',
    body: 'Search across 35,000+ volunteer opportunities and agentic scraping of 100,000+ nonprofit sites.',
    logo: '/company-logos/samaritan-scout.png',
  },
  {
    start: '2023-09',
    when: 'Sep 2023 – Jun 2024',
    kind: 'leadership',
    title: 'Newspaper & Coding Club',
    role: 'Layout Editor · Board Member',
    body: 'Rebuilt the school paper’s site and ran coding workshops and competitions.',
    href: '/projects/newspaper-website',
    logo: '/activity-logos/newspaper-club.png',
  },
  {
    start: '2024-06',
    when: 'Jun 2024',
    kind: 'milestone',
    title: 'Graduated high school',
    body: 'Four years of robotics, math league, and side projects wrap up.',
  },
  {
    start: '2024-09',
    when: 'Sep 2024 – May 2027',
    kind: 'school',
    title: 'Rutgers University Honors College',
    role: 'B.S. Computer Science and Mathematics',
    body: 'Minor in Quantitative Economics. Presenting Chair of the Quant Finance Club.',
    logo: '/school-logos/rutgers-block-r.svg',
  },
  {
    start: '2024-10',
    when: 'Oct 2024 – now',
    kind: 'research',
    title: 'Rutgers Economics Labs',
    role: 'President (formerly Research Director)',
    body: 'Quantitative research for NJDOL, NJDEP, NJBPU, HUD, and the U.S. Census Bureau.',
    href: '/projects/economic-grapher',
    logo: '/company-logos/rutgers-economics-labs.jpg',
  },
  {
    start: '2024-12',
    when: 'Dec 2024',
    kind: 'build',
    title: 'Rutgers Bus Analysis',
    body: 'Collected and visualized load and reliability data for the campus bus system.',
    href: '/projects/rutgers-bus-analysis',
    image: '/images/portfolio/bus/image-1.png',
  },
  {
    start: '2025-01',
    when: 'Jan 2025 – now',
    kind: 'build',
    title: 'Scarlet Sync',
    role: 'Founder',
    body: 'A Rutgers planning app with thousands of users: schedules, degrees, and campus info.',
    href: '/projects/scarlet-sync',
    logo: '/company-logos/scarlet-sync.png',
    image: '/images/portfolio/scarlet-sync/generated-schedule.jpg',
  },
  {
    start: '2025-05',
    when: 'Spring 2025',
    kind: 'research',
    title: 'Directed Reading Program',
    role: 'q-Binomial theorem',
    body: 'Proof-writing and a talk on q-analogues and symmetric functions.',
    href: '/projects/drp-spring-2025',
  },
  {
    start: '2025-05',
    when: 'May 2025',
    kind: 'build',
    title: 'NOSTRADAMUS',
    body: 'A 3D geospatial simulation of New Jersey with live flights and layered data.',
    href: '/projects/nostradamus',
    image: '/images/portfolio/nostradamus/hero.png',
  },
  {
    start: '2025-06',
    when: 'Jun 2025',
    kind: 'milestone',
    title: 'TopCoder top performer',
    body: 'Reverse-engineered a 60-year-old reimbursement system; invited to interview at 8090 AI.',
    href: '/projects/top-coder-challenge',
  },
  {
    start: '2025-09',
    when: 'Sep 2025 – now',
    kind: 'work',
    title: 'Lykke',
    role: 'Founding Software Engineer',
    body: 'AI study platform used by 285+ students: course ingestion, RAG, and wiki generation.',
    href: '/projects/lykke',
    logo: '/company-logos/lykke.svg',
    image: '/images/portfolio/lykke/wiki-reading-surface.jpg',
  },
  {
    start: '2026-01',
    when: 'Jan 2026 – now',
    kind: 'research',
    title: 'Three Rutgers labs',
    role: 'Research Assistant',
    body: 'Robot task and motion planning (ARC Lab), 3D genome analysis (Kwan Lab), and CS research.',
    href: '/projects/tamp-research',
    image: '/images/homepage/arc-lab/setup.png',
  },
  {
    start: '2026-05',
    when: 'May – Aug 2026',
    kind: 'work',
    title: 'New York Life',
    role: 'Software Engineering Intern',
    body: 'Applied AI: a claims assistant across web, phone, and SMS, plus knowledge and developer tools.',
    href: '/experience/new-york-life',
    logo: '/company-logos/new-york-life.svg',
    image: '/images/homepage/2026-05-29/nyl.avif',
  },
  {
    start: '2026-10',
    when: 'Oct 2026',
    kind: 'build',
    title: 'Rutgers Health Hack',
    body: 'Synthetic patient encounters, faculty authoring, and a playable hospital world.',
    href: '/projects/healthcare-simulation',
    image: '/images/portfolio/healthcare-simulation/patient-encounter.jpg',
  },
  {
    start: '2027-05',
    when: 'May 2027',
    kind: 'milestone',
    title: 'Graduating from Rutgers',
    body: 'Next chapter: building in software, applied AI, and robotics.',
    upcoming: true,
  },
]
