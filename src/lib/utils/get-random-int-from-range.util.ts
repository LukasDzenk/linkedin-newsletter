/**
 * Return a random integer between min and max (inclusive).
 *
 * @example
 * const randomInt = getRandomIntFromRange(1, 1000)
 * console.log(randomInt) // 5
 * console.log(randomInt) // 323
 *
 * @example
 * const randomInt = getRandomIntFromRange(100, 200)
 * console.log(randomInt) // 100
 * console.log(randomInt) // 173
 */
export const getRandomIntFromRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
