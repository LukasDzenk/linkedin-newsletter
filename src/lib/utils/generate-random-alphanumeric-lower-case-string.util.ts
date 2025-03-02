import { constants } from '@constants/constants.js'
import { utils } from './utils.js'

/**
 * Generate a random alphanumeric lower case string of specified length.
 */
export const generateRandomAlphanumericLowerCaseString = (length: number): string => {
    const charSet = constants.characterSets.ALPHANUMERIC_LOWER_CASE_CHAR_SET

    return utils.generateRandomString(length, charSet)
}
