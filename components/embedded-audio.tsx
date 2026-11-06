'use client'

import posthog from 'posthog-js'

type EmbeddedAudioProps = {
  src: string
  title: string
}

export function EmbeddedAudio({ src, title }: EmbeddedAudioProps) {
  return (
    <audio
      controls
      preload="metadata"
      src={src}
      className="embedded-audio mt-5 w-full max-w-full"
      aria-label={title}
      onPlay={() => posthog.capture('audio_playback_started', { title, src })}
    >
      <a href={src}>Download {title}</a>
    </audio>
  )
}
