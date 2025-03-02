import { describe, expect, it } from 'vitest'
import { convertSymbolsToUnicode } from './convert-symbols-to-unicode.util.js'

describe('convertSymbolsToUnicode', () => {
    it('should not convert alphanumeric characters', () => {
        const input = 'abc123'
        const expectedOutput = 'abc123'
        const output = convertSymbolsToUnicode({ input })
        expect(output).toEqual(expectedOutput)
    })

    it('should convert all symbols in a string', () => {
        const map = {
            '!': '\\u0021',
            '"': '\\u0022',
            '#': '\\u0023',
            $: '\\u0024',
            '%': '\\u0025',
            '&': '\\u0026',
            "'": '\\u0027',
            '(': '\\u0028',
            ')': '\\u0029',
            '*': '\\u002a',
            '+': '\\u002b',
            ',': '\\u002c',
            '-': '\\u002d',
            '.': '\\u002e',
            '/': '\\u002f',
            ':': '\\u003a',
            ';': '\\u003b',
            '<': '\\u003c',
            '=': '\\u003d',
            '>': '\\u003e',
            '?': '\\u003f',
            '@': '\\u0040',
            '[': '\\u005b',
            '\\': '\\u005c',
            ']': '\\u005d',
            '^': '\\u005e',
            // _: '\\u005f', // Underscore is not a symbol
            '`': '\\u0060',
            '{': '\\u007b',
            '|': '\\u007c',
            '}': '\\u007d',
            '~': '\\u007e',
        }
        const input = Object.keys(map).join('')
        const expectedOutput = Object.values(map).join('')
        const output = convertSymbolsToUnicode({ input })
        expect(output).toEqual(expectedOutput)
    })

    it('should correctly convert google hotel string', () => {
        const input = 'B&B La Corte dei Samidagi'
        const expectedOutput = 'B\\u0026B La Corte dei Samidagi'
        const output = convertSymbolsToUnicode({ input })
        expect(output).toEqual(expectedOutput)
    })
})
