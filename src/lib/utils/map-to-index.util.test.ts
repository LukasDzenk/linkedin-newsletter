import { describe, expect, test } from 'vitest'
import { mapToIndex } from './map-to-index.util.js'

describe('mapToIndex utility function', () => {
    test('should correctly map -2 to 0', () => {
        expect(mapToIndex(-2)).toBe(0)
    })

    test('should correctly map 2 to 100', () => {
        expect(mapToIndex(2)).toBe(100)
    })

    test('should correctly map 0 to 50', () => {
        expect(mapToIndex(0)).toBe(50)
    })

    test('should correctly map -1.5 to 13', () => {
        expect(mapToIndex(-1.5)).toBe(13) // Note: rounds to nearest integer.
    })

    test('should throw an error for values less than -2', () => {
        expect(() => {
            return mapToIndex(-2.1)
        }).toThrow('The provided value should be between -2 and 2.')
    })

    test('should throw an error for values greater than 2', () => {
        expect(() => {
            return mapToIndex(2.1)
        }).toThrow('The provided value should be between -2 and 2.')
    })
})
