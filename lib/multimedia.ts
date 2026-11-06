export type MultimediaSlide = {
  src: string
  alt: string
  title: string
  caption: string
}

/**
 * Photos already used on the homepage visual notes. Titles and captions are
 * copied from those notes so the slideshow does not invent new descriptions.
 */
export const multimediaSlides: MultimediaSlide[] = [
  {
    src: '/images/homepage/2026-05-24/nvidia.png',
    alt: 'NVIDIA campus photo from NVIDIA GTC',
    title: 'NVIDIA GTC',
    caption: 'A nod to the robotics and VLA thread in the work.',
  },
  {
    src: '/images/homepage/2026-05-24/dc.png',
    alt: 'U.S. Capitol in Washington DC',
    title: 'U.S. Capitol',
    caption: 'A cleaner title for a landmark that does not need abbreviation.',
  },
  {
    src: '/images/homepage/2026-05-24/chicago.png',
    alt: 'Chicago skyline',
    title: 'Chicago',
    caption: 'Big-grid energy and a city that reads like a system.',
  },
  {
    src: '/images/homepage/2026-05-10/img_7197.png',
    alt: 'Golden Gate Bridge in fog',
    title: 'Golden Gate Light',
    caption: 'Bridge, fog, and orange steel doing the obvious thing.',
  },
  {
    src: '/images/homepage/2026-05-24/ruroad.png',
    alt: 'Rutgers road at night',
    title: 'Rutgers Road',
    caption: 'A campus path that feels more symbolic than literal.',
  },
  {
    src: '/images/homepage/2026-05-24/beach_bloom.png',
    alt: 'Beach with blooming color near the water',
    title: 'Beach Bloom',
    caption: 'Color, water, and a softer edge to the scene.',
  },
  {
    src: '/images/homepage/2026-05-24/plane.png',
    alt: 'SR-71 Blackbird on display',
    title: 'SR-71 Blackbird',
    caption: 'A museum stop with a machine that earns the center of the frame.',
  },
  {
    src: '/images/homepage/2026-05-24/cool-building.png',
    alt: 'Hoover Tower',
    title: 'Hoover Tower',
    caption: 'A landmark where the architecture is strong enough to be specific.',
  },
]

/** Same YouTube demo already embedded on the Kenny's Racing Game project page. */
export const multimediaVideo = {
  title: "Kenny's Racing Game demo",
  embedUrl: 'https://www.youtube-nocookie.com/embed/M-2rncM2iWg',
  watchUrl: 'https://www.youtube.com/watch?v=M-2rncM2iWg',
  projectPath: '/projects/kenny-racing',
}

/**
 * Audio file already in the repo. ID3 tags: artist Akash Dubey, title
 * November Journal, album US History Journals, date 2022. The October journal
 * post already points at this recording.
 *
 * To swap the player, replace `src` with one public audio path or leave the
 * file in place and change only this constant.
 */
export const multimediaAudio = {
  src: '/images/posts/other/November_Journal.mp3',
  title: 'November Journal',
  writingPath: '/writing/october-journal',
}
