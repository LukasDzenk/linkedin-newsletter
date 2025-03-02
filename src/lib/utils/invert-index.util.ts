/**
 * @example
 * const initialIndex = 42
 * const invertedIndex = invertIndex(initialIndex)
 * console.log(invertedIndex) // 58
 */
export const invertIndex = (index: number): number => {
    if (index < 0 || index > 100) {
        throw new Error('Index must be between 0 and 100')
    }

    return 100 - index
}
