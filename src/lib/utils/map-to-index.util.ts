import { utils } from './utils.js'

/**
 * Map a value from range [-2, 2] to [0, 100].
 */
export const mapToIndex = (value: number): number => {
    if (value > 2 || value < -2) {
        throw new Error('The provided value should be between -2 and 2.')
    }

    // Perform the linear transformation.
    const normalizedValue = (value + 2) / 4 // This will map [-2,2] -> [0,1]
    const index = utils.roundFloat(normalizedValue * 100) // Map [0,1] -> [0,100]

    return index
}
