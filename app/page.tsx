import { HomeStory } from '@/components/home-story'
import { getProjects } from '@/lib/content'

export default function HomePage() {
  const projects = getProjects()

  return <HomeStory projects={projects} />
}
