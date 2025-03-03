import { describe, expect, it } from 'vitest'
import { replaceSymbols } from './replace-symbols.util.js'

describe('replaceSymbols', () => {
    it('should remove ** symbols', () => {
        const input = 'Hello **world**'
        const expected = 'Hello world'
        expect(replaceSymbols(input)).toBe(expected)
    })

    it('should replace single asterisks that are adjacent to words', () => {
        const input = 'Hello *world*'
        const expected = 'Hello world'
        expect(replaceSymbols(input)).toBe(expected)
    })

    it('should not replace single asterisks that are not adjacent to words', () => {
        const input = 'Hello - * world'
        const expected = 'Hello - * world'
        expect(replaceSymbols(input)).toBe(expected)
    })

    it('should replace en dash (–) with hyphen', () => {
        const input = 'Hello\u2013world'
        const expected = 'Hello-world'
        expect(replaceSymbols(input)).toBe(expected)
    })

    it('should replace em dash (—) with hyphen', () => {
        const input = 'Hello\u2014world'
        const expected = 'Hello-world'
        expect(replaceSymbols(input)).toBe(expected)
    })

    it('should replace figure dash (‒) with hyphen', () => {
        const input = 'Hello\u2012world'
        const expected = 'Hello-world'
        expect(replaceSymbols(input)).toBe(expected)
    })

    it('should replace left double quotation mark (") with straight quote', () => {
        const input = 'Hello\u201cworld'
        const expected = 'Hello"world'
        expect(replaceSymbols(input)).toBe(expected)
    })

    it('should replace right double quotation mark (") with straight quote', () => {
        const input = 'Hello\u201dworld'
        const expected = 'Hello"world'
        expect(replaceSymbols(input)).toBe(expected)
    })

    it('should handle multiple replacements in one string', () => {
        const input = '**Hello**\u2013world\u201ctest\u201d'
        const expected = 'Hello-world"test"'
        expect(replaceSymbols(input)).toBe(expected)
    })

    it('should return the same string if no replacements needed', () => {
        const input = 'Hello world'
        expect(replaceSymbols(input)).toBe(input)
    })

    it('should replace all types of quotes with standard double quote', () => {
        const input =
            'potyrių. „Serenity Spa" centre siūlomas platus atpalaiduojančių „Serenity Spa“ pasirinkimas. “Aktyviam“ laisvalaikiui viešbutyje yra dvi teniso aikštelės ir vaikų žaidimų aikštelė. Viešbutis, siekdamas tausoti aplinką, savo veikloje aktyviai taiko tvarumo principus.'
        const expected =
            'potyrių. "Serenity Spa" centre siūlomas platus atpalaiduojančių "Serenity Spa" pasirinkimas. "Aktyviam" laisvalaikiui viešbutyje yra dvi teniso aikštelės ir vaikų žaidimų aikštelė. Viešbutis, siekdamas tausoti aplinką, savo veikloje aktyviai taiko tvarumo principus.'
        expect(replaceSymbols(input)).toBe(expected)
    })
})
