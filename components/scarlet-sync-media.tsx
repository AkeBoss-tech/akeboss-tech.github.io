import { ImageCarousel } from '@/components/image-carousel'

const slides = [
  {
    src: '/images/portfolio/scarlet-sync/course-catalog.png',
    alt: 'Scarlet Sync course explorer showing a searchable Rutgers course catalog',
    title: 'Start with what you want to learn.',
    caption: 'Search the course catalog and explore section information. Bringing those choices together helps students decide what to take before arranging the week.',
  },
  {
    src: '/images/portfolio/scarlet-sync/schedule-preview.png',
    alt: 'Public Scarlet Sync schedule preview with an example weekly calendar',
    title: 'See the shape of your week.',
    caption: 'This example from the public product tour shows how a weekly calendar brings courses, meeting times, and campus locations together. The schedule builder lets students compare plans around their availability.',
  },
  {
    src: '/images/portfolio/scarlet-sync/product-overview.png',
    alt: 'Scarlet Sync homepage with an example course prerequisite path',
    title: 'Connect this semester to the bigger picture.',
    caption: 'This example prerequisite path on the public homepage shows how courses connect across semesters. It introduces the longer-term planning problem that Scarlet Sync’s degree planner addresses.',
  },
]

export function ScarletSyncMedia() {
  return (
    <section id="behind-the-build" className="product-media" aria-labelledby="scarlet-media-title">
      <p className="product-media-eyebrow">Behind the build</p>
      <h2 id="scarlet-media-title">A closer look at Scarlet Sync.</h2>
      <p>Conversations with Rutgers students helped shape Scarlet Sync during development. Hear the story behind the project, watch it in action, and explore the tools students can use to plan a semester.</p>
      <div className="product-media-block">
        <h3 id="scarlet-audio-title">Why I built Scarlet Sync</h3>
        <p id="scarlet-audio-description">Hear how my experience planning classes at Rutgers, along with conversations with students and professors, shaped Scarlet Sync. For me, this project brings together building software, solving practical problems, and making something useful for other people.</p>
        <audio controls preload="metadata" aria-labelledby="scarlet-audio-title" aria-describedby="scarlet-audio-description">
          <source src="/audio/scarlet-sync-why-i-built-it.m4a" type="audio/mp4" />
          Your browser does not support embedded audio. <a href="/audio/scarlet-sync-why-i-built-it.m4a">Download the recording.</a>
        </audio>
        <p className="product-media-note">33 seconds · Recorded by Akash Dubey.</p>
        <details className="product-audio-transcript">
          <summary>Read the audio transcript</summary>
          <p>Hi, I’m Akash, and I built Scarlet Sync to make planning a semester at Rutgers easier.</p>
          <p>Choosing classes often means jumping between different websites to check courses, schedules, and degree requirements. I wanted to bring those pieces together so students could spend more time deciding what works for them.</p>
          <p>Conversations with other Rutgers students and professors helped shape this project beyond my own experience.</p>
          <p>And for me, Scarlet Sync connects to the things that I enjoy most: building software, solving practical problems, and making something useful for other people.</p>
        </details>
      </div>
      <div className="product-media-block">
        <h3>Watch the product film</h3>
        <p>The film moves from a jumble of Rutgers planning resources to a weekly calendar, an AI planning conversation, and mobile interface previews. It captures an earlier version of the product; the gallery below offers a closer look at its planning features.</p>
        <video controls playsInline preload="metadata" poster="/images/portfolio/scarlet-sync/product-overview.png" aria-label="Scarlet Sync product film" aria-describedby="scarlet-video-description">
          <source src="/videos/scarlet-sync-demo-web.mp4" type="video/mp4" />
          Your browser does not support embedded video. <a href="/videos/scarlet-sync-demo-web.mp4">Download the Scarlet Sync film.</a>
        </video>
        <p id="scarlet-video-description" className="product-media-note">45 seconds · Silent video. For me, this film represents the effort to make course planning feel more approachable. The feature descriptions below explain what the app brings together.</p>
      </div>
      <div className="product-media-block">
        <h3>Explore the video tutorials</h3>
        <p>These videos from the Scarlet Sync channel connect the project story to practical examples. The scheduling tutorial focuses on planning a semester; the Claude tutorial introduces another way to access Scarlet Sync through an AI assistant. They document the product at the time of recording, so the current interface may differ.</p>
        <div className="product-tutorial-grid">
          <figure>
            <iframe src="https://www.youtube-nocookie.com/embed/T6cqyhjn_OE?cc_load_policy=1" title="Scarlet Sync scheduling tutorial" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            <figcaption>Planning a semester · <a href="https://www.youtube.com/watch?v=T6cqyhjn_OE" target="_blank" rel="noreferrer">Watch on YouTube</a></figcaption>
          </figure>
          <figure>
            <iframe src="https://www.youtube-nocookie.com/embed/FYG2LYDRm-o?cc_load_policy=1" title="Scarlet Sync Claude tutorial" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            <figcaption>Using Scarlet Sync with Claude · <a href="https://www.youtube.com/watch?v=FYG2LYDRm-o" target="_blank" rel="noreferrer">Watch on YouTube</a></figcaption>
          </figure>
        </div>
      </div>
      <div className="product-media-block">
        <h3>From finding a course to planning a semester</h3>
        <p>Three views of Scarlet Sync: the public course catalog, an example weekly schedule, and the course connections that introduce the product. The images rotate automatically; pause to read or move through them at your own pace.</p>
        <ImageCarousel slides={slides} label="Scarlet Sync features" />
        <p className="product-media-note">Captured from the public Scarlet Sync website on November 4, 2026. The schedule and prerequisite path are product-tour examples. Course availability can change.</p>
      </div>
    </section>
  )
}
