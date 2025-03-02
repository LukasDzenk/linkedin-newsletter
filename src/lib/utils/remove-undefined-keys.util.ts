/**
 * Remove undefined and null keys from an object.
 */
export const removeUndefinedKeys = (obj: Record<string, unknown>): Record<string, unknown> => {
    // Convert the object to an array of key-value pairs
    const keyValuePairs = Object.entries(obj)

    // Filter out pairs with undefined values
    const filteredPairs = keyValuePairs.filter(([, value]) => {
        return value !== undefined
    })

    // Create a new object from the filtered pairs
    const resultObj = filteredPairs.reduce(
        (accumulator: { [key: string]: unknown }, [key, value]) => {
            accumulator[key] = value
            return accumulator
        },
        {},
    )

    return resultObj
}
