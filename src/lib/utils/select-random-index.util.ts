/**
 * Select random index from an array.
 */
export const selectRandomIndex = (array: Array<unknown>): number => {
    return Math.floor(Math.random() * array.length)
}
