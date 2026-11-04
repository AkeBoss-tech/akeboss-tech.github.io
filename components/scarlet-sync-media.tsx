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
      <p>Conversations with Rutgers students helped shape Scarlet Sync during development. These two views show the idea in motion and the tools students can use to plan a semester.</p>
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
        <h3>From finding a course to planning a semester</h3>
        <p>Three views of Scarlet Sync: the public course catalog, an example weekly schedule, and the course connections that introduce the product. The images rotate automatically; pause to read or move through them at your own pace.</p>
        <ImageCarousel slides={slides} label="Scarlet Sync features" />
        <p className="product-media-note">Captured from the public Scarlet Sync website on November 4, 2026. The schedule and prerequisite path are product-tour examples. Course availability can change.</p>
      </div>
    </section>
  )
}
