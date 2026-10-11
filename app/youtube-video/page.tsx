import type { Metadata } from 'next'

// Change this URL and redeploy to update where /youtube-video sends visitors.
const destination = 'https://www.youtube.com/watch?v=BIjPviSJ0Yc'

export const metadata: Metadata = {
  title: 'Redirecting to video',
  robots: { index: false, follow: false },
}

export default function YoutubeVideoPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${destination}`} />
      <div className="container-wide py-10 sm:py-14">
        <p>
          Redirecting…{' '}
          <a href={destination} className="text-accent underline">
            Continue to the video
          </a>
        </p>
      </div>
    </>
  )
}
