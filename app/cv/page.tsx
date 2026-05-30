import { ContactIconLinks } from '@/components/contact-icon-links'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Akash Dubey CV',
  description:
    'Academic and research CV for Akash Dubey, including education, research roles, experience, leadership, and awards.',
  path: '/cv',
  image: '/cv/opengraph-image',
})

const topStats = [
  { label: 'Rutgers', value: 'Honors College', accent: 'text-[#84a9ff]' },
  { label: 'GPA', value: '4.0', accent: 'text-[#d8b4fe]' },
  { label: 'SAT', value: '1580', accent: 'text-[#f6c177]' },
  { label: 'Current', value: 'Research + startups', accent: 'text-[#8be9fd]' },
] as const

const education = [
  {
    title: 'Rutgers University Honors College, School of Arts and Sciences',
    href: 'https://honorscollege.rutgers.edu/',
    logo: '/school-logos/rutgers-block-r.svg',
    logoTileStyle: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    location: 'New Brunswick, NJ',
    dates: 'Sep 2024 - May 2027',
    summaryItems: [
      'B.S. in Computer Science and Mathematics',
      'Minor in Quantitative Economics',
      'GPA: 4.0',
    ],
  },
  {
    title: 'Academy for Information Technology, Union County Vocational-Technical Schools',
    href: 'https://www.ucvts.org/domain/19',
    logo: '/school-logos/ait-logo.png',
    logoTileStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: 'rgba(255, 255, 255, 0.72)',
    },
    location: 'Scotch Plains, NJ',
    dates: 'Sep 2020 - Jun 2024',
    summaryItems: [
      'High school diploma',
      'Mathematics Award',
      'QPA: 97.92',
    ],
  },
] as const

const experience = [
  {
    title: 'New York Life Insurance',
    href: 'https://www.newyorklife.com/',
    logo: '/company-logos/new-york-life.svg',
    logoTileStyle: {
      backgroundColor: 'rgba(37, 99, 235, 0.92)',
      borderColor: 'rgba(96, 165, 250, 0.46)',
    },
    role: 'Incoming Software Engineering Intern',
    dates: 'May 2026 - Aug 2026',
    bullets: [],
  },
  {
    title: 'Scarlet Sync',
    href: 'https://scarletsync.app/',
    logo: '/company-logos/scarlet-sync.png',
    role: 'Founder',
    dates: 'Jan 2025 - Present',
    bullets: [
      'Built a Rutgers scheduling and degree-planning product used by hundreds of students.',
      'Created AI-assisted ingestion pipelines for classes, sections, and degree requirements from legacy university systems.',
    ],
  },
  {
    title: 'Lykke',
    href: 'https://getlykke.com/',
    logo: '/company-logos/lykke.svg',
    logoTileStyle: {
      backgroundColor: 'rgba(87, 64, 211, 0.92)',
      borderColor: 'rgba(167, 139, 250, 0.46)',
    },
    role: 'Software Engineer',
    dates: 'Sep 2025 - Present',
    bullets: [
      'Working on multi-model ingestion, browser-side RAG, and Canvas-connected study tooling.',
      'Built local WebGPU-powered retrieval workflows for private, fast client-side use.',
    ],
  },
  {
    title: 'Samaritan Scout',
    href: 'https://www.samaritanscout.org/',
    logo: '/company-logos/samaritan-scout.png',
    logoTileStyle: {
      backgroundColor: 'rgba(36, 84, 60, 0.95)',
      borderColor: 'rgba(92, 196, 141, 0.52)',
    },
    role: 'Frontend / Full Stack Engineer',
    dates: 'May 2023 - Aug 2025',
    bullets: [
      'Built product surfaces in React and TypeScript for a volunteer-opportunity search platform.',
      'Helped build large-scale search and agentic scraping pipelines covering volunteer and nonprofit data.',
    ],
  },
] as const

const research = [
  {
    title: 'Rutgers Economics Labs',
    href: 'https://rutgerseconomics.org',
    logo: '/company-logos/rutgers-economics-labs.jpg',
    logoTileStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: 'rgba(255, 255, 255, 0.72)',
    },
    role: 'President; formerly Research Director, Team Lead, Economic Researcher',
    dates: 'Oct 2024 - Present',
    bullets: [
      'Leading agency-facing quantitative research for NJDOL, NJDEP, NJBPU, HUD, and the U.S. Census Bureau.',
      'Using Python and R for econometrics, public-sector analysis, historical budget scraping, and forecasting.',
    ],
  },
  {
    title: 'Rutgers Department of Computer Science',
    href: 'https://cs.rutgers.edu/',
    logo: '/school-logos/rutgers-block-r.svg',
    logoTileStyle: {
      backgroundColor: 'var(--cv-rutgers-logo-bg)',
      borderColor: 'var(--cv-rutgers-logo-border)',
    },
    role: 'Research Assistant',
    dates: 'Jan 2026 - Present',
    bullets: [
      'Studying second-order optimization for large-scale machine learning.',
      'Designing agentic systems for non-sequential code generation from research papers.',
    ],
  },
  {
    title: 'Algorithmic Robotics and Control Lab, Rutgers CS',
    href: 'https://arc-lab-robotics.github.io/',
    logo: '/school-logos/rutgers-block-r.svg',
    logoTileStyle: {
      backgroundColor: 'var(--cv-rutgers-logo-bg)',
      borderColor: 'var(--cv-rutgers-logo-border)',
    },
    role: 'Research Assistant',
    dates: 'Jan 2026 - Present',
    bullets: [
      'Optimizing motion-planning algorithms with CUDA for scalable high-dimensional robotics.',
      'Exploring robotics applications of vision-language-action models.',
    ],
  },
  {
    title: 'Kwan Lab, Rutgers Cancer Institute of New Jersey',
    href: 'https://sites.rutgers.edu/kwan-lab/',
    logo: '/school-logos/rutgers-block-r.svg',
    logoTileStyle: {
      backgroundColor: 'var(--cv-rutgers-logo-bg)',
      borderColor: 'var(--cv-rutgers-logo-border)',
    },
    role: 'Computational Biology Research Assistant',
    dates: 'Jan 2026 - Present',
    bullets: [
      'Built tooling for TAD-boundary deletion analysis and chromatin simulation from Hi-C data.',
    ],
  },
] as const

const leadership = [
  {
    title: 'AIT Math League Officer & President',
    logo: '/activity-logos/ucvts.png',
    dates: 'Sep 2021 - Jun 2024',
    body: 'Organized practices, competitions, and study culture for 50+ students; consistent top-three scorer.',
  },
  {
    title: 'UCVTS Robotics Team 1257 Programming Manager',
    logo: '/activity-logos/team-1257.png',
    dates: 'Sep 2022 - Jun 2024',
    body: 'Led a 30+ member programming group across robot code, control systems, vision, and training.',
  },
  {
    title: 'Newspaper Club Layout Editor',
    logo: '/activity-logos/newspaper-club.png',
    logoTileStyle: {
      backgroundColor: 'var(--cv-newspaper-logo-bg)',
      borderColor: 'var(--cv-newspaper-logo-border)',
    },
    dates: 'Sep 2023 - Jun 2024',
    body: 'Led the programming and migration work for the club website and taught editors markdown workflows.',
  },
  {
    title: 'Coding Club Board Member',
    logo: '/activity-logos/ucvts.png',
    dates: 'Sep 2023 - Jun 2024',
    body: 'Ran beginner and advanced coding workshops and helped organize competitions.',
  },
  {
    title: 'The Connection',
    logo: '/activity-logos/the-connection.svg',
    dates: 'Dec 2022 - Present',
    body: 'English as a Second Language Instructor. Taught 50+ adult learners in small groups and built worksheets, tutoring tools, and classroom resources.',
  },
  {
    title: 'Berkeley Heights Public Library',
    logo: '/activity-logos/bh-library.svg',
    dates: 'High school',
    body: 'Book Shelving Volunteer.',
  },
] as const

const collegeActivities = [
  {
    title: 'Rutgers Quantitative Finance Club',
    logo: '/activity-logos/rutgers-qfc.png',
    logoTileStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: 'rgba(255, 255, 255, 0.72)',
    },
    role: 'Presenting Chair',
    dates: 'Sep 2024 - Present',
    body: 'In charge of teaching students about math, computer science, statistics, and quantitative finance.',
  },
] as const

const certifications = [
  'Microsoft Word 2019',
  'Microsoft PowerPoint 2019',
  'Microsoft Excel 2019',
  'Microsoft Excel Expert 2019',
  'Microsoft Access 2019',
  'IC3 Digital Literacy GS6 Master',
  'CompTIA ITF+',
  'Oracle Java Foundations (1Z0-811)',
  'Oracle Database Foundations (1Z0-006)',
] as const

const collegeAwards = [
  'TechStart Challenge - 2nd Place',
  'RUHealthHacks - prize winner',
] as const

const highSchoolAwards = [
  'Dean’s List Semifinalist, 2023 FIRST Robotics Season',
  'RIT High School Science and Math Award',
  'AP Scholar with Distinction',
  'National Merit Commended Student',
  'ARML participant (3x)',
  'High Honor Roll',
] as const

const scores = [
  'SAT: 1580 (800 Math, 780 R&W)',
  'AP Calculus AB: 5',
  'AP Calculus BC: 5',
  'AP Computer Science Principles: 5',
  'AP Statistics: 5',
  'AP Computer Science A: 5',
  'AP Physics C: Mechanics: 5',
  'AP Microeconomics / Macroeconomics: 5 / 5',
  'AP Physics C: Electricity and Magnetism: 5',
  'AP Chemistry: 5',
  'AP English Language: 5',
  'AP United States History: 5',
] as const

const selectedProjects = [
  { title: 'Math League Participation Leaderboard Website', href: '/projects/school-projects' },
  { title: 'FRC Robot Code', href: '/projects/robot-code' },
  { title: 'Resources Website for Non-native English Speakers', href: '/projects/esl-worksheet' },
  { title: 'ESL Worksheet Maker with NLTK and LLMs', href: '/projects/esl-worksheet' },
  { title: 'AI Tutor for English Speakers', href: '/projects/personal-assistant' },
  { title: 'FRC Strategy Web App and QR Code Scanner', href: '/projects/robot-code' },
  { title: 'Calculus Problem Generator', href: '/projects/calculus-generator' },
  { title: 'New Newspaper Club Website', href: '/projects/newspaper-website' },
  { title: 'Path Finder and Driver', href: '/projects/path-finder' },
  { title: 'Arduino Projects and 3D Prints', href: '/projects/school-projects' },
  { title: 'Economic Series and Feature Plotter', href: '/projects/economic-grapher' },
  { title: 'Analysis of the Rutgers Bus System', href: '/projects/rutgers-bus-analysis' },
] as const

const cvCollageImages = [
  { src: '/images/portfolio/scarlet-sync/home.png', alt: 'Scarlet Sync interface', className: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/portfolio/hic-tad/hero.png', alt: 'Hi-C TAD analysis visualization', className: '' },
  { src: '/images/portfolio/random_environment.png', alt: 'Path finding visualization', className: '' },
  { src: '/images/portfolio/lykke/hero.png', alt: 'Lykke study product interface', className: 'sm:col-span-2' },
  { src: '/images/portfolio/llm-research/image.png', alt: 'LLM research chart', className: '' },
  { src: '/images/portfolio/vis/economic-plotter.png', alt: 'Economic feature plotting interface', className: '' },
  { src: '/images/portfolio/2024-upscaled.png', alt: 'FRC robot project', className: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/homepage/2026-05-24/nvidia.png', alt: 'NVIDIA campus photo', className: '' },
  { src: '/images/homepage/2026-05-24/dc.png', alt: 'Washington DC photo', className: '' },
  { src: '/images/homepage/2026-05-24/ruroad.png', alt: 'Rutgers road at night', className: 'sm:col-span-2' },
] as const

const skills = [
  'Python',
  'C++',
  'CUDA',
  'TypeScript',
  'R',
  'SQL',
  'React',
  'PyTorch',
  'Web scraping',
  'Computer vision',
  'LLMs',
  'Data science',
  'Full-stack web development',
  'Arduino',
  'Robotics',
  '3D modeling and printing',
  'Spanish',
  'IT support',
] as const

function Section({
  title,
  accentClass = 'text-text',
  titleClassName = '',
  children,
}: {
  title: string
  accentClass?: string
  titleClassName?: string
  children: React.ReactNode
}) {
  return (
    <section className="panel-soft rounded-[28px] p-6 sm:p-7">
      <p className={`eyebrow ${accentClass} ${titleClassName}`.trim()}>{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function CVPage() {
  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_18rem]">
        <div className="max-w-4xl">
          <p className="eyebrow">Curriculum Vitae</p>
          <h1 className="mt-4 text-5xl text-text sm:text-7xl">Akash Dubey</h1>
          <p className="mt-5 text-base leading-8 text-text-muted sm:text-lg">
            Berkeley Heights, NJ | 212-814-3681 | akash.dubey@rutgers.edu
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-text-muted">
            A running record of school, research, engineering, teaching, leadership, projects, certifications, and awards.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {topStats.map((item) => (
              <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/[0.02] px-4 py-3 backdrop-blur-md">
                <p className="eyebrow">{item.label}</p>
                <p className={`mt-2 text-lg ${item.accent}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="panel rounded-[26px] p-4 lg:sticky lg:top-28 lg:h-fit">
          <p className="eyebrow">Links</p>
          <ContactIconLinks className="mt-3 grid-cols-3" />
        </aside>
      </section>

      <section className="mt-10 grid gap-6">
        <Section title="Education" accentClass="text-[#84a9ff]">
          <div className="grid gap-5">
            {education.map((item) => (
              <article key={item.title} className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.03] p-2"
                      style={'logoTileStyle' in item ? item.logoTileStyle : undefined}
                    >
                      <img src={item.logo} alt={`${item.title} logo`} className="max-h-full max-w-full object-contain" />
                    </div>
                    <a href={item.href} target="_blank" rel="noreferrer" className="story-link text-2xl text-text hover:text-white">
                      {item.title}
                    </a>
                  </div>
                  <p className="text-sm text-text-soft">{item.dates}</p>
                </div>
                <p className="mt-2 pl-16 text-sm text-text-soft">{item.location}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 pl-16 text-sm leading-7 text-text-muted">
                  {item.summaryItems.map((line) => (
                    <p
                      key={line}
                      className={line.includes('GPA') || line.includes('QPA') ? 'text-[#d8b4fe]' : ''}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Engineering and Work" accentClass="text-[#d8b4fe]">
          <div className="grid gap-6">
            {experience.map((item) => (
              <article key={`${item.title}-${item.role}`} className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.03] p-2"
                      style={'logoTileStyle' in item ? item.logoTileStyle : undefined}
                    >
                      <img src={item.logo} alt={`${item.title} logo`} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <a href={item.href} target="_blank" rel="noreferrer" className="story-link text-2xl text-text hover:text-white">
                        {item.title}
                      </a>
                      <p className="mt-1 text-sm text-[#d8b4fe]">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-soft">{item.dates}</p>
                </div>
                {item.bullets.length ? (
                  <ul className="mt-4 grid gap-2 text-sm leading-7 text-text-muted">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="pl-4 relative before:absolute before:left-0 before:top-[0.8em] before:h-1 before:w-1 before:rounded-full before:bg-[#d8b4fe]">{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </Section>

        <Section title="Research" accentClass="text-[#8be9fd]">
          <div className="grid gap-6">
            {research.map((item) => (
              <article key={`${item.title}-${item.role}`} className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.03] p-2"
                      style={item.logoTileStyle}
                    >
                      <img src={item.logo} alt={`${item.title} logo`} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <a href={item.href} target="_blank" rel="noreferrer" className="story-link text-2xl text-text hover:text-white">
                        {item.title}
                      </a>
                      <p className="mt-1 text-sm text-[var(--cv-research-role)]">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-soft">{item.dates}</p>
                </div>
                <ul className="mt-4 grid gap-2 pl-16 text-sm leading-7 text-text-muted">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="pl-4 relative before:absolute before:left-0 before:top-[0.8em] before:h-1 before:w-1 before:rounded-full before:bg-[#8be9fd]">{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Skills" accentClass="text-[#84a9ff]">
            <div className="flex flex-wrap gap-2">
              {skills.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Certifications" accentClass="text-[#84a9ff]">
            <div className="flex flex-wrap gap-2">
              {certifications.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
            <a
              href="https://www.credly.com/users/akash-dubey.0b4eb82d/badges"
              target="_blank"
              rel="noreferrer"
              className="story-link mt-5 inline-block text-sm text-text-muted hover:text-text"
            >
              Credly Profile ↗
            </a>
          </Section>
        </div>

        <div className="mt-2">
          <p className="eyebrow text-[#84a9ff]">Activities and Leadership</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="College" accentClass="text-[#84a9ff]">
            <div className="grid gap-4">
              {collegeActivities.map((item) => (
                <article key={item.title} className="border-b border-white/8 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.03] p-2"
                        style={item.logoTileStyle}
                      >
                        <img src={item.logo} alt={`${item.title} logo`} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <h2 className="text-lg text-text">{item.title}</h2>
                        <p className="mt-1 text-sm text-[#84a9ff]">{item.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-soft">{item.dates}</p>
                  </div>
                  <p className="mt-1 text-sm leading-7 text-text-muted sm:pl-16">{item.body}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section title="High School" accentClass="text-[#f6c177]">
            <div className="grid gap-4">
              {leadership.map((item) => (
                <article key={item.title} className="border-b border-white/8 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.03] p-2"
                        style={'logoTileStyle' in item ? item.logoTileStyle : undefined}
                      >
                        <img src={item.logo} alt={`${item.title} logo`} className="max-h-full max-w-full object-contain" />
                      </div>
                      <h2 className="text-lg text-text">{item.title}</h2>
                    </div>
                    <p className="text-sm text-text-soft">{item.dates}</p>
                  </div>
                  <p className="mt-1 text-sm leading-7 text-text-muted sm:pl-16">{item.body}</p>
                </article>
              ))}
            </div>
          </Section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Awards and Competitions" accentClass="text-[#f6c177]">
            <div className="grid gap-6 text-sm leading-7 text-text-muted">
              <div>
                <p className="eyebrow text-[#84a9ff]">College</p>
                <div className="mt-3 grid gap-2">
                  {collegeAwards.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/8 pt-5">
                <p className="eyebrow text-[#f6c177]">High School</p>
                <div className="mt-3 grid gap-2">
                  {highSchoolAwards.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Scores (High School)" accentClass="text-[#d8b4fe]">
            <div className="grid gap-2 text-sm leading-7 text-text-muted">
              {scores.map((item) => (
                <p key={item} className={item.startsWith('SAT') ? 'text-[#d8b4fe]' : ''}>{item}</p>
              ))}
            </div>
          </Section>
        </div>

        <div className="grid gap-6">
          <Section title="Selected Projects" accentClass="text-[#8be9fd]">
            <div className="grid gap-2 text-sm leading-7 text-text-muted">
              {selectedProjects.map((item) => (
                <a key={item.title} href={item.href} className="story-link selected-project-link text-text-muted hover:text-text">
                  {item.title}
                </a>
              ))}
            </div>
          </Section>

          <Section title="Visual Collage" accentClass="text-[#d8b4fe]" titleClassName="text-center">
            <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-4">
              {cvCollageImages.map((image) => (
                <figure
                  key={image.src}
                  className={`group relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] ${image.className}`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_54%,rgba(0,0,0,0.48))]" />
                </figure>
              ))}
            </div>
          </Section>
        </div>
      </section>
    </div>
  )
}
