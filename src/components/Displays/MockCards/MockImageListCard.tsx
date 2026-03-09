import { useColors } from '../../../contexts/ColorsContext'

const items = [
  { subtitle: 'Neutral tones for backgrounds and text' },
  { subtitle: 'Primary for buttons and emphasis' },
  { subtitle: 'Tertiary for highlights and CTAs' },
]

export default function MockImageListCard() {
  const { colorRows } = useColors()

  const neutral = colorRows.find(r => r.title === 'Neutral')?.colors ?? []
  const primary = colorRows.find(r => r.title === 'Primary')?.colors ?? []
  const tertiary = colorRows.find(r => r.title === 'Tertiary')?.colors ?? []

  return (
    <div
      className="rounded-xl p-6 font-sans border"
      style={{ backgroundColor: neutral[0], borderColor: neutral[2] }}
    >
      <div className="mb-1 text-lg font-bold" style={{ color: neutral[9] }}>Palette roles</div>
      <div className="text-sm leading-relaxed mb-5" style={{ color: neutral[6] }}>How each row is used in UI</div>

      <ul className="flex flex-col">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 py-4 border-b last:border-b-0 first:pt-0"
            style={{ borderColor: neutral[2] }}
          >
            <div
              className="w-14 h-14 shrink-0 rounded-md flex items-center justify-center"
              style={{ backgroundColor: i === 0 ? neutral[4] : i === 1 ? primary[4] : tertiary[4] }}
            >
              <span className="text-xs font-semibold" style={{ color: i === 0 ? neutral[8] : i === 1 ? primary[8] : tertiary[8] }}>
                {i + 1}
              </span>
            </div>
            <div className="min-w-0 flex-1 flex items-center">
              <span className="text-sm leading-relaxed" style={{ color: neutral[7] }}>{item.subtitle}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
