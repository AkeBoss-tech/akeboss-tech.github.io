'use client'

import { useState } from 'react'

import type { WikiVisualExperience } from '@/lib/wiki'

export function WikiVisualExperience({ experience }: { experience: WikiVisualExperience }) {
  const [active, setActive] = useState(0)
  const step = experience.steps[active]

  return (
    <section className="wiki-visual-experience" aria-label={experience.headline}>
      <img src={experience.image} alt={experience.alt} className="wiki-visual-image" />
      <div className="wiki-visual-scrim" />
      <div className="wiki-visual-copy">
        <p className="eyebrow">{experience.eyebrow}</p>
        <h2>{experience.headline}</h2>
        <p>{experience.subhead}</p>
      </div>

      <div className="wiki-visual-controls" aria-label="Explore the concept">
        <div className="wiki-visual-stepper" role="tablist" aria-label="Search signals">
          {experience.steps.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              id={`wiki-visual-tab-${index}`}
              aria-controls="wiki-visual-readout"
              aria-selected={active === index}
              className={active === index ? `active ${item.accent}` : item.accent}
              onClick={() => setActive(index)}
            >
              <span>0{index + 1}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div id="wiki-visual-readout" className={`wiki-visual-readout ${step.accent}`} role="tabpanel" aria-live="polite">
          <span>What changes</span>
          <strong>{step.label}</strong>
          <p>{step.detail}</p>
        </div>
      </div>
    </section>
  )
}
