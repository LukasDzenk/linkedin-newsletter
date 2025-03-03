import { calculateSentenceCount } from './calculate-sentence-count.util.js'
import { isRefusalOrNoChange } from './identify-refusals-to-answer.util.js'
import { replaceSymbols } from './replace-symbols.util.js'
import { replaceWrongLtWords } from './replace-wrong-lt-words.util.js'

export const llm = {
    replaceWrongLtWords,
    replaceSymbols,
    calculateSentenceCount,
    isRefusalOrNoChange,
} as const
