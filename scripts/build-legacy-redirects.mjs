import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = process.cwd()
const outputDir = path.join(root, 'out')

if (!fs.existsSync(outputDir)) {
  console.log('Legacy redirect build skipped: no static export found.')
  process.exit(0)
}

const redirectPage = (destination) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${destination}">
    <link rel="canonical" href="${destination}">
    <meta name="robots" content="noindex">
    <title>Redirecting…</title>
    <script>location.replace(${JSON.stringify(destination)})</script>
  </head>
  <body><p>Redirecting to <a href="${destination}">the current page</a>…</p></body>
</html>
`

function writeRedirect(from, destination) {
  const target = path.join(outputDir, from.replace(/^\//, ''), 'index.html')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, redirectPage(destination))
}

const portfolioDir = path.join(root, '_portfolio')
const portfolioFiles = fs.readdirSync(portfolioDir).filter((file) => file.endsWith('.md'))

writeRedirect('/portfolio', '/projects')
for (const file of portfolioFiles) {
  const slug = file.replace(/\.md$/, '')
  writeRedirect(`/portfolio/${slug}`, `/projects/${slug}`)
}

const postsDir = path.join(root, '_posts')
const postFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'))

for (const file of postFiles) {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8')
  const { data } = matter(raw)
  const legacySlug = String(data.permalink || file.replace(/\.md$/, ''))
    .replace(/^\/posts\//, '')
    .replace(/\/$/, '')
  const destinationSlug = legacySlug || file.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '').replace(/\.md$/, '')
  writeRedirect(`/posts/${legacySlug}`, `/writing/${destinationSlug}`)
}

console.log(`Legacy redirect build complete. ${portfolioFiles.length + postFiles.length + 1} redirect pages written.`)
