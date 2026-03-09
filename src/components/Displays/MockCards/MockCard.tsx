import { useColors } from '../../../contexts/ColorsContext'
import Topography from "../../../assets/topography.svg"

/**
 * MockCard — a small UI card preview driven entirely by the palette context.
 *
 * Neutral shades are used for backgrounds, borders, and muted text.
 * Primary shades are used for interactive elements (button, badge, link).
 *
 * Colors are applied via inline style objects so they respond instantly
 * to palette changes without needing any CSS classes.
 *
 * Shade index reference (matches SHADE_KEYS: 50, 100, 200, … 950):
 *   0 = 50   (lightest)
 *   1 = 100
 *   2 = 200
 *   3 = 300
 *   4 = 400
 *   5 = 500
 *   6 = 600
 *   7 = 700
 *   8 = 800
 *   9 = 900
 *  10 = 950  (darkest)
 */
export default function MockCard() {
  const { colorRows } = useColors()

  const neutral = colorRows.find(r => r.title === 'Neutral')?.colors ?? []
  const primary = colorRows.find(r => r.title === 'Primary')?.colors ?? []

  return (
    <div
      className="rounded-xl p-6 font-sans border relative overflow-hidden"
      style={{ backgroundColor: neutral[0], borderColor: neutral[2] }}
    >
      {/* Topography pattern — SVG used as mask so the line color is palette-driven */}
      <div
        className="absolute inset-0 pointer-events-none z-0 hidden"
        style={{
          maskImage: `url(${Topography})`,
          WebkitMaskImage: `url(${Topography})`,
          maskSize: '1000% 1000%',
          WebkitMaskSize: '1000% 1000%',
          maskPosition: '20% 50%',
          WebkitMaskPosition: '50% 50%',
          backgroundColor: neutral[1],
          opacity: 0.8,
        }}
      />
      <div className="relative z-10">
      {/* Badge — primary-100 bg, primary-700 text */}
      <span
        className="inline-block text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full mb-3 font-body"
        style={{ backgroundColor: primary[1], color: primary[7] }}
      >
        New
      </span>

      {/* Title — neutral-900 */}
      <div
        className="text-lg font-bold mb-1 font-title"
        style={{ color: neutral[9] }}
      >
        See Your Colors
      </div>

      {/* Description — neutral-600 */}
      <div
        className="text-sm leading-relaxed mb-5 font-body"
        style={{ color: neutral[6] }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum cursus rutrum interdum. Phasellus sollicitudin feugiat sollicitudin. 
      </div>

      {/* Divider — neutral-200 */}
      <div className="mb-5 border-t" style={{ borderColor: neutral[2] }} />

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {/* Primary button — primary-500 bg, white text */}
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold font-body text-white cursor-pointer"
          style={{ backgroundColor: primary[5] }}
        >
          Get started
        </button>

        {/* Ghost button — primary-600 text, primary-300 border */}
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold font-body cursor-pointer border bg-transparent"
          style={{ color: primary[6], borderColor: primary[3] }}
        >
          Learn more
        </button>
      </div>
      </div>
    </div>
  )
}
