export const serializeError = (error: unknown): string => {
    if (!(error instanceof Error)) {
        return JSON.stringify(error, null, 2)
    }

    const simpleError: Record<string, unknown> = {
        name: error.name,
        message: error.message,
        stack: error.stack,
    }

    // Copying other properties
    for (const key of Object.getOwnPropertyNames(error)) {
        // Refine the type assertion for `error` to allow dynamic property access
        simpleError[key] = (error as unknown as Record<string, unknown>)[key]
    }

    // Handling circular references
    const seen = new WeakSet<object>()
    const replacer = (key: string, value: unknown): unknown => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return
            }
            seen.add(value)
        }
        return value
    }

    return JSON.stringify(simpleError, replacer, 2)
}
