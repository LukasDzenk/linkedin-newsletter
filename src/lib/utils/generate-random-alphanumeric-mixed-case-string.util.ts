import { constants } from '@constants/constants.js'
import { utils } from './utils.js'

/**
 * Generate a random alphanumeric mixed case string of specified length.
 */
export const generateRandomAlphanumericMixedCaseString = (length: number): string => {
    const charSet = constants.characterSets.ALPHANUMERIC_MIXED_CASE_CHAR_SET

    return utils.generateRandomString(length, charSet)
}
