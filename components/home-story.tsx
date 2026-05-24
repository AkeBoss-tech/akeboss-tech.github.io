import { HomeYoshiScene } from '@/components/home-yoshi-scene'
import type { Project } from '@/lib/content'

type HomeStoryProps = {
  projects: Project[]
}

export function HomeStory({ projects }: HomeStoryProps) {
  return <HomeYoshiScene projects={projects} />
}
