import Link from 'next/link'
import { EmbeddedAudio } from '@/components/embedded-audio'
import { LlmMarkdown } from '@/components/llm-markdown'
import { PictureSlideshow } from '@/components/picture-slideshow'
import { buildMultimediaLlmMarkdown } from '@/lib/llm'
import { multimediaAudio, multimediaSlides, multimediaVideo } from '@/lib/multimedia'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Multimedia',
  description:
    'Picture slideshow, embedded video, and embedded audio from Akash Dubey’s site: photos, the Kenny’s Racing Game demo, and the November Journal recording.',
  path: '/multimedia',
  image: '/multimedia/opengraph-image',
})

export default function MultimediaPage() {
  return (
    <div className="container-wide py-10 sm:py-14">
      <LlmMarkdown content={buildMultimediaLlmMarkdown()} />
      <section className="max-w-3xl">
        <p className="eyebrow">Multimedia</p>
        <h1 className="mt-4 text-5xl text-text sm:text-7xl">Pictures, a film, and a recording.</h1>
        <p className="mt-6 text-lg leading-8 text-text-muted">
          Three pieces already on this site, gathered here so they are easy to find: a photo slideshow, an embedded video, and an embedded audio player.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-muted">
          <li><a href="#slideshow" className="story-link text-text hover:text-text">Picture slideshow</a></li>
          <li><a href="#video" className="story-link text-text hover:text-text">Embedded video</a></li>
          <li><a href="#audio" className="story-link text-text hover:text-text">Embedded audio</a></li>
        </ul>
      </section>

      <section id="slideshow" className="mt-16 scroll-mt-32 max-w-5xl">
        <p className="eyebrow">01 — Pictures</p>
        <h2 className="mt-3 text-3xl tracking-[-0.04em] text-text sm:text-5xl">Picture slideshow</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-text-muted">
          Photos from the homepage visual notes. The show advances on its own, and the previous, next, and pause controls work with a keyboard, a pointer, or a swipe. It stays paused when reduced motion is requested.
        </p>
        <PictureSlideshow slides={multimediaSlides} label="Photo slideshow" />
      </section>

      <section id="video" className="mt-16 scroll-mt-32 max-w-5xl">
        <p className="eyebrow">02 — Video</p>
        <h2 className="mt-3 text-3xl tracking-[-0.04em] text-text sm:text-5xl">Embedded video</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-text-muted">
          The same YouTube demo already embedded on the{' '}
          <Link href={multimediaVideo.projectPath} className="story-link text-text">Kenny&apos;s Racing Game</Link>{' '}
          project page.
        </p>
        <div className="mt-6 overflow-hidden rounded-[28px] border border-text/10 bg-black">
          <iframe
            src={multimediaVideo.embedUrl}
            title={multimediaVideo.title}
            className="aspect-video h-auto w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          <a href={multimediaVideo.watchUrl} className="story-link text-text" target="_blank" rel="noreferrer">
            Open {multimediaVideo.title} on YouTube
          </a>
        </p>
      </section>

      <section id="audio" className="mt-16 scroll-mt-32 max-w-3xl">
        <p className="eyebrow">03 — Audio</p>
        <h2 className="mt-3 text-3xl tracking-[-0.04em] text-text sm:text-5xl">Embedded audio</h2>
        <p className="mt-4 text-base leading-8 text-text-muted">
          November Journal, a 2022 recording by Akash Dubey from the US History Journals files already in this site. It is about 6 minutes 50 seconds. The written{' '}
          <Link href={multimediaAudio.writingPath} className="story-link text-text">October journal</Link>{' '}
          points at the same file.
        </p>
        <div className="panel-soft mt-6 rounded-[28px] px-4 py-5 sm:px-6">
          <p className="text-lg text-text">{multimediaAudio.title}</p>
          <p className="mt-1 text-sm text-text-muted">Akash Dubey · US History Journals · 2022</p>
          <EmbeddedAudio src={multimediaAudio.src} title={multimediaAudio.title} />
        </div>
      </section>
    </div>
  )
}
