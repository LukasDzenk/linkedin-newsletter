import { utils } from './utils.js'

/**
 * Generate a random string from the given pattern.
 * @example
 * const pattern = '****-****--*'
 * const separator = '-'
 * const randomString = generateRandomString(pattern, separator)
 * console.log(randomString) // 'a1z4-c3k0'
 */
export const generateRandomStringByPattern = (
    pattern: string,
    separator: string | null,
    charSet: string,
): string => {
    return pattern
        .split('')
        .map((char) => {
            if (separator !== null && char === separator) {
                return separator
            } else {
                return utils.pickRandomCharacter(charSet)
            }
        })
        .join('')
}
