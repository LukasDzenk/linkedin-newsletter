/**
 * Remove all non-word characters and non-whitespace characters from a string.
 *
 * @remark
 * This keeps '_' underscore characters.
 *
 * @param string
 * @return Cleaned string
 */
export const keepOnlyWordsAndSpacesFromString = (string: string): string => {
    // [^a-zA-Z0-9 ] would do the same but remove _ underscore characters
    return string.replace(/[^\w\s]/g, '')
}
