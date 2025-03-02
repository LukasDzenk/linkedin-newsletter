export const millisecondsToSeconds = (ms: number): number => {
    if (typeof ms !== 'number') {
        throw new Error('Input must be a number')
    }

    return ms / 1000
}
