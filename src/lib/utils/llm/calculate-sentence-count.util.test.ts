import { describe, expect, it } from 'vitest'
import { calculateSentenceCount } from './calculate-sentence-count.util.js'

describe('getSentenceCount', () => {
    it('should count basic sentences correctly', () => {
        expect(calculateSentenceCount('This is one. This is two.')).toBe(2)
        expect(calculateSentenceCount('Single sentence.')).toBe(1)
        expect(calculateSentenceCount('One! Two? Three.')).toBe(3)
    })

    it('should handle empty and whitespace strings', () => {
        expect(calculateSentenceCount('')).toBe(0)
        expect(calculateSentenceCount('   ')).toBe(0)
        expect(calculateSentenceCount('\n\t')).toBe(0)
    })

    it('should handle multiple spaces between sentences', () => {
        expect(calculateSentenceCount('One.    Two.  Three.')).toBe(3)
    })

    // it('should handle sentences with abbreviations', () => {
    //     expect(getSentenceCount('I live in the U.S.A. This is another sentence.')).toBe(2)
    //     expect(getSentenceCount('Mr. Smith went to Washington D.C. Then he came back.')).toBe(2)
    // })

    it('should handle sentences with special characters', () => {
        expect(calculateSentenceCount('Hello... Is anyone there? Yes!')).toBe(3)
        expect(calculateSentenceCount('This is (very) complex! But it works.')).toBe(2)
    })

    it('should ignore empty sentences', () => {
        expect(calculateSentenceCount('One.. Two... Three.')).toBe(3)
        expect(calculateSentenceCount('Test..')).toBe(1)
    })
})
