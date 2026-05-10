import type { Post, Project } from '@/lib/content'

export const featuredProjectSlugs = ['scarlet-sync', 'lykke', 'hic-tad-analysis', 'nostradamus']

export const projectCategories = [
  {
    title: 'Startups',
    accent: 'text-[#d8b4fe]',
    glow: 'shadow-[0_0_32px_rgba(216,180,254,0.12)]',
    description: 'Product work with users, feedback loops, and the pressure to make something actually stick.',
    slugs: ['scarlet-sync', 'lykke', 'grokipedia-api', 'personal-assistant', 'flamingo'],
  },
  {
    title: 'AI & Research',
    accent: 'text-[#84a9ff]',
    glow: 'shadow-[0_0_32px_rgba(132,169,255,0.14)]',
    description: 'Tools and systems shaped by research questions, language models, and technical depth.',
    slugs: ['hic-tad-analysis', 'llm-research', 'asa-fall-data', 'economic-grapher'],
  },
  {
    title: 'Data Science & Math',
    accent: 'text-[#d1bf8a]',
    glow: 'shadow-[0_0_32px_rgba(209,191,138,0.14)]',
    description: 'Math, statistics, economics, and data stories that try to make noisy systems legible.',
    slugs: ['rutgers-bus-analysis', 'puerto-rico-migration', 'clean-your-data', 'drp-spring-2025'],
  },
  {
    title: 'Software Development',
    accent: 'text-[#8be9fd]',
    glow: 'shadow-[0_0_32px_rgba(139,233,253,0.14)]',
    description: 'Full-stack apps, interfaces, and engineering-heavy builds that reward structure and iteration.',
    slugs: ['newspaper-website', 'esl-worksheet', 'calculus-generator', 'fbla-coding-and-programming'],
  },
  {
    title: 'Specialized Engineering',
    accent: 'text-[#f6c177]',
    glow: 'shadow-[0_0_32px_rgba(246,193,119,0.14)]',
    description: 'Projects where software meets hardware, simulation, and the reality of moving things through space.',
    slugs: ['path-finder', 'robot-code', 'depth-estimation', 'fbla-mobile-app'],
  },
  {
    title: 'Early Builds',
    accent: 'text-[#fca5a5]',
    glow: 'shadow-[0_0_32px_rgba(252,165,165,0.12)]',
    description: 'Where the obsession started: first experiments, competitions, and projects before everything connected.',
    slugs: ['school-projects', 'top-coder-challenge', 'kenny-racing'],
  },
] as const

const yoshiBlueprint = [
  {
    title: 'Startups',
    accent: '#d3a3b0',
    glow: 'rgba(211, 163, 176, 0.28)',
    cards: [
      { slug: 'scarlet-sync', stack: ['Next.js', 'PostgreSQL', 'Supabase'], x: 10, y: 12, w: 20, dx: -10, dy: 12 },
      { slug: 'lykke', stack: ['Next.js', 'AI', 'Education'], x: 58, y: 8, w: 18, dx: 12, dy: 10 },
      { slug: 'grokipedia-api', stack: ['Python', 'TypeScript', 'API'], x: 36, y: 42, w: 18, dx: -8, dy: 16 },
      { slug: 'flamingo', stack: ['iOS', 'Vision AI', 'HealthKit'], x: 73, y: 54, w: 16, dx: 9, dy: 14 },
    ],
  },
  {
    title: 'AI & Research',
    accent: '#84a9ff',
    glow: 'rgba(132, 169, 255, 0.28)',
    cards: [
      { slug: 'hic-tad-analysis', stack: ['Python', 'Bioinformatics', 'AI'], x: 13, y: 18, w: 22, dx: -14, dy: 10 },
      { slug: 'llm-research', stack: ['SLMs', 'HPC', 'Training'], x: 48, y: 14, w: 17, dx: 10, dy: 18 },
      { slug: 'asa-fall-data', stack: ['Data', 'Research', 'Visualization'], x: 67, y: 42, w: 18, dx: 12, dy: 12 },
      { slug: 'nostradamus', stack: ['3D', 'Geospatial', 'Simulation'], x: 27, y: 55, w: 19, dx: -9, dy: 16 },
    ],
  },
  {
    title: 'Data Science & Math',
    accent: '#c6a6ff',
    glow: 'rgba(198, 166, 255, 0.24)',
    cards: [
      { slug: 'rutgers-bus-analysis', stack: ['Transit Data', 'Analysis', 'Visualization'], x: 12, y: 24, w: 22, dx: -11, dy: 12 },
      { slug: 'puerto-rico-migration', stack: ['Census Data', 'Narrative', 'Web'], x: 53, y: 10, w: 21, dx: 10, dy: 18 },
      { slug: 'economic-grapher', stack: ['FRED', 'BLS', 'Time Series'], x: 70, y: 48, w: 16, dx: 10, dy: 10 },
      { slug: 'drp-spring-2025', stack: ['Math', 'Research', 'Presentation'], x: 31, y: 57, w: 17, dx: -8, dy: 16 },
      { slug: 'clean-your-data', stack: ['AI Agent', 'CSV', 'Python'], x: 42, y: 34, w: 18, dx: -4, dy: 12 },
    ],
  },
  {
    title: 'Software Development',
    accent: '#8be9fd',
    glow: 'rgba(139, 233, 253, 0.22)',
    cards: [
      { slug: 'newspaper-website', stack: ['Web', 'Editorial', 'Frontend'], x: 10, y: 12, w: 20, dx: -10, dy: 10 },
      { slug: 'esl-worksheet', stack: ['Python', 'Content', 'Tooling'], x: 37, y: 20, w: 17, dx: 8, dy: 16 },
      { slug: 'calculus-generator', stack: ['Math', 'Generation', 'App'], x: 61, y: 12, w: 18, dx: 9, dy: 12 },
      { slug: 'fbla-coding-and-programming', stack: ['Website', 'Community', 'Frontend'], x: 25, y: 53, w: 21, dx: -8, dy: 14 },
    ],
  },
  {
    title: 'Specialized Engineering',
    accent: '#f6c177',
    glow: 'rgba(246, 193, 119, 0.24)',
    cards: [
      { slug: 'robot-code', stack: ['Robotics', 'Control', 'FRC'], x: 11, y: 14, w: 18, dx: -10, dy: 12 },
      { slug: 'path-finder', stack: ['A*', 'Simulation', 'Pygame'], x: 54, y: 12, w: 17, dx: 8, dy: 16 },
      { slug: 'depth-estimation', stack: ['Vision', 'Stereo', '3D'], x: 69, y: 48, w: 18, dx: 10, dy: 10 },
      { slug: 'fbla-mobile-app', stack: ['Android', 'Portfolio', 'Mobile'], x: 28, y: 54, w: 19, dx: -7, dy: 12 },
    ],
  },
  {
    title: 'Early Builds',
    accent: '#9ce08f',
    glow: 'rgba(156, 224, 143, 0.22)',
    cards: [
      { slug: 'school-projects', stack: ['Learning', 'Experiments', 'Projects'], x: 11, y: 18, w: 20, dx: -8, dy: 10 },
      { slug: 'top-coder-challenge', stack: ['XGBoost', 'Reverse Engineering', 'ML'], x: 45, y: 10, w: 21, dx: 8, dy: 16 },
      { slug: 'kenny-racing', stack: ['Godot', '3D', 'Game'], x: 70, y: 22, w: 17, dx: 10, dy: 12 },
      { slug: 'flamingo', stack: ['Hackathon', 'Prototype', 'Build'], x: 29, y: 56, w: 17, dx: -7, dy: 10 },
    ],
  },
] as const

export const storyTimeline = [
  {
    year: '2016',
    title: 'The habit starts',
    body: 'Programming turns from curiosity into routine. Small builds, too many ideas, and an early sense that code could become a way of thinking.',
  },
  {
    year: '2018',
    title: 'Robotics adds pressure',
    body: 'Engineering gets physical. Software starts needing to survive deadlines, teammates, and machines that do not care about intentions.',
  },
  {
    year: '2020',
    title: 'Writing and reflection',
    body: 'Notes, journals, and personal essays start documenting the process alongside the projects.',
  },
  {
    year: '2023',
    title: 'Math, data, and systems',
    body: 'Economics, research, robotics, and software stop feeling like separate interests and start feeling like one portfolio.',
  },
  {
    year: '2024',
    title: 'Products with real users',
    body: 'Scarlet Sync, research tooling, and student-facing systems make product thinking a bigger part of the work.',
  },
  {
    year: '2025',
    title: 'Living archive',
    body: 'AI agents, genomics, economics, and technical writing begin to read like one continuous story instead of disconnected projects.',
  },
] as const

export function getFeaturedProjects(projects: Project[]) {
  const bySlug = new Map(projects.map((project) => [project.slug, project]))
  return featuredProjectSlugs.map((slug) => bySlug.get(slug)).filter(Boolean) as Project[]
}

export function getProjectsByCategory(projects: Project[]) {
  const bySlug = new Map(projects.map((project) => [project.slug, project]))
  return projectCategories.map((category) => ({
    ...category,
    projects: category.slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as Project[],
  }))
}

export function getYoshiGalleryChapters(projects: Project[]) {
  const bySlug = new Map(projects.map((project) => [project.slug, project]))
  return yoshiBlueprint.map((chapter) => ({
    ...chapter,
    cards: chapter.cards
      .map((card) => {
        const project = bySlug.get(card.slug)
        if (!project) return null
        return {
          ...card,
          project,
        }
      })
      .filter(Boolean) as Array<(typeof chapter.cards)[number] & { project: Project }>,
  }))
}

export function getWritingGroups(posts: Post[]) {
  const reflections = posts.filter((post) => /(reflection|journal|life|school)/i.test(`${post.title} ${post.tags.join(' ')}`))
  const buildLogs = posts.filter((post) => !reflections.includes(post) && /(robotics|programming|build|arduino)/i.test(`${post.title} ${post.tags.join(' ')}`))
  const archive = posts.filter((post) => !buildLogs.includes(post) && !reflections.includes(post))

  return [
    {
      title: 'Build Logs',
      description: 'Technical notes, robotics updates, project process, and the work while it is still moving.',
      posts: buildLogs,
    },
    {
      title: 'Personal Reflections',
      description: 'School years, journals, and the quieter writing that explains the person behind the code.',
      posts: reflections,
    },
    {
      title: 'Personal Archive',
      description: 'Older notes, first posts, and early writing preserved as part of the record.',
      posts: archive,
    },
  ].filter((group) => group.posts.length > 0)
}
