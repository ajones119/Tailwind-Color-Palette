import RootColorInput from './RootColorInput'
import { useColors, type AnchorTitle } from '../../../contexts/ColorsContext'
import { generateShadesFromBaseColor, hexToColorName } from '../../../lib/color'
import { SHADE_KEYS } from '../../../constants/palette'
import HarmonyInput from '../HarmonyInput/HarmonyInput'
import { startTransition } from 'react'


export const ManualRootInputs = () => {
    const { colorRows, updateRow, alignWithHarmony, harmonyMethod } = useColors()

    return (
        <div className="flex lg:flex-col flex-wrap lg:gap-3 xl:gap-10">
            {colorRows.map((colorRow) => {
                const colorName = hexToColorName(colorRow.rootColor)
                return (
                <div key={colorRow.title}>
                    <h2 className="text-lg font-bold pb-4">
                        {colorRow.title}
                        <span className="text-sm text-neutral-500">{colorName ? ` (${colorName})` : null}</span>
                    </h2>
                    <RootColorInput
                        value={colorRow.rootColor}
                        onChange={(hex) => {
                            startTransition(() => {
                                const colors = generateShadesFromBaseColor(hex, SHADE_KEYS.length)
                                updateRow({ colors, title: colorRow.title, rootColor: hex })
                                if (harmonyMethod !== 'auto' && colorRow.title !== 'Neutral') {
                                    alignWithHarmony(colorRow.title as AnchorTitle)
                                }
                            })
                        }}
                    />
                </div>
                )
            })}
            <HarmonyInput />
            </div>
    )
}