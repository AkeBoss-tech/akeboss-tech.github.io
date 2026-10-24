/** Stable hue per slug so each project gets its own accent glow. */
export function projectHue(slug: string) {
  let hash = 0
  for (const char of slug) hash = (hash * 33 + char.charCodeAt(0)) % 360
  return hash
}
