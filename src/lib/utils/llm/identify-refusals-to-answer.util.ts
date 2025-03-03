import { calculateSentenceCount } from './calculate-sentence-count.util.js'

const refusalPatternsEn = [
    /already (fluent|natural|good|fine)/i,
    /no (changes|edits|improvements) (needed|required|necessary)/i,
    /text (is|appears|seems) (good|fine|fluent)/i,
    /cannot|can't|won't|refuse|decline/i,
    /text (doesn't|does not) need/i,
]

const refusalPatternsLt = [
    /tekstas (yra|jau yra) (sklandus|optimalus|kokybiškas|aiškus)/i,
    /(aprašymas|tekstas) (yra|jau yra) (puikus|profesionaliai parengtas)/i,
    /nematau poreikio keisti/i,
    /negaliu pasiūlyti .* pakeitimų/i,
    /pakeitimų nereikia/i,
    /keisti nereikia/i,
    /nereikalauja (jokių |)(pakeitimų|taisymų|korekcijų)/i,
    /dabartinė versija yra .* tinkama/i,
    /atitinka .* reikalavimus/i,
    /gerai suformuluotas/i,
]

export function isRefusalOrNoChange({ text }: { text: string }): boolean {
    const sentenceCount = calculateSentenceCount(text)

    if (sentenceCount === 1) {
        return true
    }

    const isEnRefusal = refusalPatternsEn.some((pattern) => {
        return pattern.test(text.toLowerCase())
    })

    const isLtRefusal = refusalPatternsLt.some((pattern) => {
        return pattern.test(text.toLowerCase())
    })

    return isEnRefusal || isLtRefusal
}
