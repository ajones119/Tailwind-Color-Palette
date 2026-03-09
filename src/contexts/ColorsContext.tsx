import { createContext, useContext, useEffect, useState } from "react"
import { DEFAULT_NEUTRAL, DEFAULT_PRIMARY, DEFAULT_SECONDARY, DEFAULT_TERTIARY } from "../constants/palette"
import { SHADE_KEYS } from "../constants/palette"
import {
    generateShadesFromBaseColor,
    getHarmonyRootsFromHsl,
    getPrimaryFromSecondaryOrTertiary,
    hexToHsl,
    hslToHex,
    type Hsl,
    type HarmonyMethod,
} from "../lib/color"

export type ColorRow = {
    colors: string[]
    title: AnchorTitle
    rootColor: string
}

export type AnchorTitle = 'Primary' | 'Secondary' | 'Tertiary' | 'Neutral'

export type ColorsContextType = {
    colorRows: ColorRow[]
    setColorRows: React.Dispatch<React.SetStateAction<ColorRow[]>>
    updateRow: (updated: ColorRow) => void
    updateRowRootColor: (title: AnchorTitle, rootColor: string) => void
    alignWithHarmony: (anchor: AnchorTitle) => void
    alignNeutralWithPrimary: () => void
    /** Set saturation and lightness on all non-neutral rows (keep each hue), regenerate shades, then align Neutral to Primary. */
    setNonNeutralSaturationLightness: (saturation: number, lightness: number) => void
    harmonyMethod: HarmonyMethod
    setHarmonyMethod: React.Dispatch<React.SetStateAction<HarmonyMethod>>
}

export type { HarmonyMethod }

const VALID_HARMONY: HarmonyMethod[] = ['auto', 'analogous', 'complementary', 'triadic', 'square', 'rectangle', 'split-complementary', 'split-triadic', 'tetradic']

function parseHexParam(value: string | null): string | null {
    if (!value || typeof value !== 'string') return null
    const hex = value.replace(/^#/, '').trim()
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return null
    return `#${hex}`
}

function parseHarmonyParam(value: string | null): HarmonyMethod | null {
    if (!value || typeof value !== 'string') return null
    const v = value.trim().toLowerCase()
    return (VALID_HARMONY.includes(v as HarmonyMethod) ? v : null) as HarmonyMethod | null
}

function colorRowsToParams(rows: ColorRow[], harmony: HarmonyMethod, mode: 'radial' | 'inputs'): URLSearchParams {
    const params = new URLSearchParams()
    for (const row of rows) {
        const key = row.title.toLowerCase()
        params.set(key, row.rootColor.replace(/^#/, ''))
    }
    params.set('harmony', harmony)
    params.set('mode', mode)
    return params
}

function getInitialStateFromUrl(): { rows: ColorRow[]; harmony: HarmonyMethod } {
    if (typeof window === 'undefined') return { rows: DEFAULT_ROWS, harmony: defaultHarmony }
    const params = new URLSearchParams(window.location.search)
    const primary = parseHexParam(params.get('primary'))
    const secondary = parseHexParam(params.get('secondary'))
    const tertiary = parseHexParam(params.get('tertiary'))
    const neutral = parseHexParam(params.get('neutral'))
    const harmony = parseHarmonyParam(params.get('harmony'))
    const hasAny = primary ?? secondary ?? tertiary ?? neutral ?? harmony != null
    if (!hasAny) return { rows: DEFAULT_ROWS, harmony: defaultHarmony }
    const rows: ColorRow[] = DEFAULT_ROWS.map((row) => {
        const hex =
            row.title === 'Primary' ? (primary ?? row.rootColor)
            : row.title === 'Secondary' ? (secondary ?? row.rootColor)
            : row.title === 'Tertiary' ? (tertiary ?? row.rootColor)
            : row.title === 'Neutral' ? (neutral ?? row.rootColor)
            : row.rootColor
        return { ...row, rootColor: hex, colors: generateShadesFromBaseColor(hex, SHADE_KEYS.length) }
    })
    return { rows, harmony: harmony ?? defaultHarmony }
}

const DEFAULT_ROWS: ColorRow[] = [
    { colors: [...DEFAULT_NEUTRAL], title: 'Neutral', rootColor: '#5d5c60' },
    { colors: [...DEFAULT_PRIMARY], title: 'Primary', rootColor: '#186ddc' },
    { colors: [...DEFAULT_SECONDARY], title: 'Secondary', rootColor: '#0d9488' },
    { colors: [...DEFAULT_TERTIARY], title: 'Tertiary', rootColor: '#ec7513' },
]

const defaultHarmony: HarmonyMethod = 'auto'

/** Harmony is always the rule for deriving secondary/tertiary from primary. "Auto" means we do not apply that rule when a row changes—users can adjust each row individually. Non-auto means updating primary cascades to secondary and tertiary. */
const ColorsContext = createContext<ColorsContextType>({
    colorRows: DEFAULT_ROWS,
    setColorRows: () => {},
    updateRow: () => {},
    updateRowRootColor: () => {},
    alignWithHarmony: () => {},
    alignNeutralWithPrimary: () => {},
    setNonNeutralSaturationLightness: () => {},
    harmonyMethod: defaultHarmony,
    setHarmonyMethod: () => {},
})

export const ColorsProvider = ({ children }: { children: React.ReactNode }) => {
    const [initial] = useState(() => getInitialStateFromUrl())
    const [colorRows, setColorRows] = useState<ColorRow[]>(initial.rows)
    const [harmonyMethod, setHarmonyMethod] = useState<HarmonyMethod>(initial.harmony)

    const updateRow = (updated: ColorRow) => {
        setColorRows(prev => prev.map(r => r.title === updated.title ? updated : r))
    }

    const updateRowRootColor = (title: AnchorTitle, rootColor: string) => {
        const shades = generateShadesFromBaseColor(rootColor, SHADE_KEYS.length)
        setColorRows(prev => prev.map(r => r.title === title ? { ...r, rootColor, colors: shades } : r))
    }

    /** Set Neutral row from Primary: same hue and lightness, 10% saturation; regenerates root and shades. */
    const alignNeutralWithPrimary = () => {
        setColorRows(prev => {
            const primary = prev.find(r => r.title === 'Primary')
            if (!primary) return prev
            const hsl = hexToHsl(primary.rootColor)
            if (!hsl) return prev
            const neutralHex = hslToHex(hsl.h, 10, hsl.l, 100)
            if (!neutralHex) return prev
            return prev.map(r =>
                r.title === 'Neutral'
                    ? { ...r, rootColor: neutralHex, colors: generateShadesFromBaseColor(neutralHex, SHADE_KEYS.length) }
                    : r
            )
        })
    }

    /** Apply new saturation and lightness to all non-neutral rows (keep each row's hue), regenerate their shades, then align Neutral to Primary. */
    const setNonNeutralSaturationLightness = (saturation: number, lightness: number) => {
        setColorRows(prev => {
            const primary = prev.find(r => r.title === 'Primary')
            const secondary = prev.find(r => r.title === 'Secondary')
            const tertiary = prev.find(r => r.title === 'Tertiary')
            if (!primary || !secondary || !tertiary) return prev
            const pHsl = hexToHsl(primary.rootColor)
            const sHsl = hexToHsl(secondary.rootColor)
            const tHsl = hexToHsl(tertiary.rootColor)
            if (!pHsl || !sHsl || !tHsl) return prev
            const primaryHex = hslToHex(pHsl.h, saturation, lightness, 100)
            const secondaryHex = hslToHex(sHsl.h, saturation, lightness, 100)
            const tertiaryHex = hslToHex(tHsl.h, saturation, lightness, 100)
            if (!primaryHex || !secondaryHex || !tertiaryHex) return prev
            const neutralHex = hslToHex(pHsl.h, 10, lightness, 100)
            if (!neutralHex) return prev
            return prev.map(r => {
                if (r.title === 'Primary') return { ...r, rootColor: primaryHex, colors: generateShadesFromBaseColor(primaryHex, SHADE_KEYS.length) }
                if (r.title === 'Secondary') return { ...r, rootColor: secondaryHex, colors: generateShadesFromBaseColor(secondaryHex, SHADE_KEYS.length) }
                if (r.title === 'Tertiary') return { ...r, rootColor: tertiaryHex, colors: generateShadesFromBaseColor(tertiaryHex, SHADE_KEYS.length) }
                if (r.title === 'Neutral') return { ...r, rootColor: neutralHex, colors: generateShadesFromBaseColor(neutralHex, SHADE_KEYS.length) }
                return r
            })
        })
    }

    /** Derive all rows from a single anchor row using the current harmony method.
     *  - 'Primary': Secondary, Tertiary and Neutral are derived from Primary's HSL.
     *  - 'Secondary' / 'Tertiary': Primary is back-computed first, then all rows are derived from it.
     */
    const alignWithHarmony = (anchor: AnchorTitle) => {
        setColorRows(prev => {
            const anchorRow = prev.find(r => r.title === anchor)
            if (!anchorRow) return prev
            const anchorHsl = hexToHsl(anchorRow.rootColor)
            if (!anchorHsl) return prev

            let primaryHsl: Hsl = { h: anchorHsl.h, s: anchorHsl.s, l: anchorHsl.l }
            if (anchor !== 'Primary') {
                const derived = getPrimaryFromSecondaryOrTertiary(
                    anchorHsl,
                    harmonyMethod,
                    anchor.toLowerCase() as 'secondary' | 'tertiary'
                )
                if (!derived) return prev
                primaryHsl = derived
            }

            const { secondary, tertiary } = getHarmonyRootsFromHsl(primaryHsl, harmonyMethod)
            const primaryHex   = hslToHex(primaryHsl.h, primaryHsl.s, primaryHsl.l, 100)
            const secondaryHex = hslToHex(secondary.h, secondary.s, secondary.l, 100)
            const tertiaryHex  = hslToHex(tertiary.h, tertiary.s, tertiary.l, 100)
            const neutralHex   = hslToHex(primaryHsl.h, 10, primaryHsl.l, 100)
            if (!primaryHex || !secondaryHex || !tertiaryHex || !neutralHex) return prev

            return prev.map(r => {
                if (r.title === 'Primary')   return { ...r, rootColor: primaryHex,   colors: generateShadesFromBaseColor(primaryHex,   SHADE_KEYS.length) }
                if (r.title === 'Secondary') return { ...r, rootColor: secondaryHex, colors: generateShadesFromBaseColor(secondaryHex, SHADE_KEYS.length) }
                if (r.title === 'Tertiary')  return { ...r, rootColor: tertiaryHex,  colors: generateShadesFromBaseColor(tertiaryHex,  SHADE_KEYS.length) }
                if (r.title === 'Neutral')   return { ...r, rootColor: neutralHex,   colors: generateShadesFromBaseColor(neutralHex,   SHADE_KEYS.length) }
                return r
            })
        })
    }


    // When the user selects a non-auto harmony method, realign all rows from the current Primary.
    useEffect(() => {
        if (harmonyMethod === 'auto') return
        alignWithHarmony('Primary')
    // alignWithHarmony closes over harmonyMethod; only re-run when harmonyMethod itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [harmonyMethod])

    // Keep URL in sync with current base colors, harmony, and mode (mode preserved from current URL).
    useEffect(() => {
        const current = new URLSearchParams(window.location.search)
        const mode = current.get('mode') === 'inputs' ? 'inputs' : 'radial'
        const params = colorRowsToParams(colorRows, harmonyMethod, mode)
        const search = params.toString()
        const newSearch = search ? `?${search}` : ''
        if (window.location.search !== newSearch) {
            window.history.replaceState(null, '', window.location.pathname + newSearch)
        }
    }, [colorRows, harmonyMethod])

    return (
        <ColorsContext.Provider value={{ colorRows, setColorRows, updateRow, updateRowRootColor, alignWithHarmony, alignNeutralWithPrimary, setNonNeutralSaturationLightness, harmonyMethod, setHarmonyMethod }}>
            {children}
        </ColorsContext.Provider>
    )
}

export const useColors = () => useContext(ColorsContext)

/** Get the row for a given title. Reactive: updates when colorRows change. */
export function useRow(title: string): ColorRow | undefined {
    const { colorRows } = useColors()
    return colorRows.find(r => r.title === title)
}

/** Get the hex color for a shade index (0–10). Returns fallback if missing. */
export function getShadeColor(row: ColorRow, shadeIndex: number, fallback = '#000000'): string {
    return row.colors[shadeIndex] ?? fallback
}
