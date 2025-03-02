import { utils } from './utils.js'

/**
 * Transform index scale from 0-100 (which is actually 20-80)
 * to actually 0-100
 *
 * @remarks
 * This transforms the original scale into a more sensitive scale.
 */
export const increaseIndexSensitivity = ({
    index,
    rangeStart,
    rangeEnd,
    increaseIndexBy,
}: {
    index: number
    rangeStart: number
    rangeEnd: number
    increaseIndexBy?: number
}) => {
    const MAXIMUM_INDEX = 100
    const MINIMUM_INDEX = 0

    if (index < MINIMUM_INDEX || index > MAXIMUM_INDEX) {
        throw new Error('Index must be between 0 and 100')
    }

    if (index < rangeStart) {
        index = rangeStart
    }
    if (index > rangeEnd) {
        index = rangeEnd
    }

    const zeroStartIndex = index - rangeStart
    const zeroToHundredIndex = zeroStartIndex * (MAXIMUM_INDEX / (rangeEnd - rangeStart))

    const roundedIndex = utils.roundFloat(zeroToHundredIndex)

    const increasedIndex = roundedIndex + (increaseIndexBy ?? 0)

    if (increasedIndex > MAXIMUM_INDEX) {
        return MAXIMUM_INDEX
    }

    return increasedIndex
}
