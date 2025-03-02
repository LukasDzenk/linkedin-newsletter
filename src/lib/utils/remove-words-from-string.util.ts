import { utils } from './utils.js'

/**
 * @remark
 * Input can be a string or an array of strings.
 */
export const removeWordsFromString = (
    string: string,
    words: string | string[] | null | undefined,
): string => {
    if (!words) {
        return string
    }

    if (typeof words !== 'string' && !Array.isArray(words)) {
        throw new Error('Input words must be a string or an array of strings')
    }

    // Make the function work with both string and array of strings
    if (typeof words === 'string') {
        words = words.split(' ')
    }

    // If array is empty return the original string
    if (words.length === 0) {
        return string
    }

    for (const word of words) {
        const cleanedWord = word.toLowerCase().trim()
        string = utils.removeWordInstancesFromString(string, cleanedWord)
    }

    return string
}
