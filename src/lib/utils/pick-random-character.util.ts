/**
 * Pick a random character from the given string.
 * @example
 * const charSet = 'abcdefghijklmnopqrstuvwxyz'
 * const randomChar = randomCharacter(charSet)
 * console.log(randomChar) // 'k'
 */
export const pickRandomCharacter = (charSet: string): string => {
    const randomIndex = Math.floor(Math.random() * charSet.length)

    const randomCharacter = charSet[randomIndex]

    if (!randomCharacter) {
        throw new Error('Random character not found')
    }

    return randomCharacter
}
