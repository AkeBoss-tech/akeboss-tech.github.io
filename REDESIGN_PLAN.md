# Redesign Plan

Branch: `dev/light-dark-refresh`

## Direction
- Full rebuild from legacy Jekyll/Minimal Mistakes toward a modern Next.js portfolio
- Visual style: **Research Editorial** base with **Systems Minimal** layering
- Must preserve the substance of the old site while upgrading presentation

## Core goals
- Clean, minimal, professional look
- Proper light/dark mode with manual toggle
- Strong project storytelling
- Tasteful motion and transitions
- Better use of visuals, GIFs, screenshots, and selected autoplay media
- Keep old portfolio and writing content available in the new site

## Current status
- Next.js app scaffolded
- Dual-theme shell implemented
- Old `_portfolio` and `_posts` content parsed directly into the new app
- New routes in place: home, projects, project detail, writing, post detail, about, resume
- Initial screenshots generated for light/dark variants

## Content priorities
Feature prominently:
- Scarlet Sync
- Lykke
- HiC-TAD-Library
- Personal Assistant
- Grokipedia API
- Robotics / motion-planning work

Archive but keep:
- Older high-school projects
- Yearly reflections
- Robotics journals

## Visual/system priorities for next passes
1. Refine homepage layout and spacing
2. Improve project detail templates
3. Add better media treatment (GIF/video/image modules)
4. Polish typography and hierarchy
5. Add contact/media pages if useful
6. Tighten mobile experience
7. Final SEO / metadata / deployment cleanup

## Motion guidance
- Subtle reveal transitions only
- Small hover lifts
- No loud novelty animations
- Autoplay only when muted, useful, and not distracting
- Respect `prefers-reduced-motion`
