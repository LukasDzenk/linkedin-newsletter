/**
 * @param precision - The number of decimal places to round to. Defaults to 0.
 */
export const roundFloat = (value: number, precision = 0): number => {
    if (typeof value !== 'number') {
        throw new Error('Value must be a number')
    }

    if (typeof precision !== 'number') {
        throw new Error('Precision must be a number')
    }

    if (precision < 0) {
        throw new Error('Precision must be a non-negative number')
    }

    const multiplier = Math.pow(10, precision)

    return Math.round((value + Number.EPSILON) * multiplier) / multiplier
}
