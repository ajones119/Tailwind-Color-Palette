import ColorSquare from '../ColorSquare'
import { SHADE_KEYS } from '../../constants/palette'
import { hexToColorName, colorsEqual } from '../../lib/color'
import { useRow, getShadeColor } from '../../contexts/ColorsContext'
type ColorRowProps = { title: string }

const ColorRow = ({ title }: ColorRowProps) => {
    const row = useRow(title)

    if (!row) return null

    const colorName = hexToColorName(row.rootColor)

    return (
        <div className="lg:pt-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold lg:hidden font-body">
                    {title}
                    {colorName ? ` (${colorName})` : null}
                </h2>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap lg:grid lg:grid-cols-11">
                {SHADE_KEYS.map((shade, shadeIndex) => (
                    <div key={shade} className="flex flex-col items-center gap-1">
                        <ColorSquare
                            value={getShadeColor(row, shadeIndex)}
                            shadeIndex={shadeIndex}
                            isRootColor={colorsEqual(getShadeColor(row, shadeIndex), row.rootColor)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ColorRow