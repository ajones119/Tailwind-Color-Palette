import { useColors } from '../../../contexts/ColorsContext'

export default function MockSingleImageCard() {
  const { colorRows } = useColors()

  const neutral = colorRows.find(r => r.title === 'Neutral')?.colors ?? []
  const primary = colorRows.find(r => r.title === 'Primary')?.colors ?? []
  const tertiary = colorRows.find(r => r.title === 'Tertiary')?.colors ?? []

  return (
    <div
      className="rounded-xl p-6 font-sans border"
      style={{ backgroundColor: neutral[0], borderColor: neutral[2] }}
    >
      <div className="mb-1 text-lg font-bold" style={{ color: neutral[9] }}>Spotlight</div>
      <div className="text-sm leading-relaxed mb-5" style={{ color: neutral[6] }}>One image, one story</div>

      <div
        className="w-full aspect-video rounded-lg flex items-center justify-center"
        style={{ backgroundColor: primary[4] }}
      >
        <svg className="w-12 h-12 opacity-40" viewBox="0 0 24 24" fill="currentColor" style={{ color: primary[7] }}>
          <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" />
        </svg>
      </div>
    </div>
  )
}
