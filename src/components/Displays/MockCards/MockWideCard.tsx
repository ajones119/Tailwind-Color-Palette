import { useColors } from '../../../contexts/ColorsContext'

/**
 * MockWideCard — full-width strip card, 3 columns wide in the preview grid.
 * Uses neutral, primary, and tertiary from the palette.
 */
export default function MockWideCard() {
  const { colorRows } = useColors()

  const neutral = colorRows.find(r => r.title === 'Neutral')?.colors ?? []
  const primary = colorRows.find(r => r.title === 'Primary')?.colors ?? []
  const tertiary = colorRows.find(r => r.title === 'Tertiary')?.colors ?? []

  return (
    <div
      className="md:col-span-3 rounded-xl p-6 font-sans border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      style={{ backgroundColor: neutral[0], borderColor: neutral[2] }}
    >
      <div>
        <div
          className="text-lg font-bold mb-1"
          style={{ color: neutral[9] }}
        >
          Your palette in action
        </div>
        <div
          className="text-sm leading-relaxed"
          style={{ color: neutral[6] }}
        >
          Neutral, primary, and tertiary colors applied across backgrounds, text, and buttons.
        </div>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
          style={{ backgroundColor: primary[5] }}
        >
          Primary
        </button>
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
          style={{ backgroundColor: tertiary[5] }}
          >
          Tertiary
        </button>
      </div>
    </div>
  )
}
