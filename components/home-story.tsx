import { HomeYoshiScene } from '@/components/home-yoshi-scene'
import type { Project } from '@/lib/content'
import { getYoshiGalleryChapters } from '@/lib/site-data'

type HomeStoryProps = {
  projects: Project[]
}

export function HomeStory({ projects }: HomeStoryProps) {
  return <HomeYoshiScene chapters={getYoshiGalleryChapters(projects)} />
}
