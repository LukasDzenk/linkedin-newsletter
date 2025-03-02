/**
 * Returns true if date is older than the specified number of days counting from today.
 */
export const isDateOlderThanXDays = (date: Date, days: number): boolean => {
    const now = new Date()
    if (!date) {
        throw new Error("Invalid input: 'date' not given.")
    }
    if (!(date instanceof Date)) {
        throw new Error("Invalid input: 'date' must be a valid instance of the Date object.")
    }
    if (typeof days !== 'number' || days < 0) {
        throw new Error("Invalid input: 'days' must be a positive number.")
    }
    if (date > now) {
        throw new Error("Invalid input: 'date' cannot be in the future.")
    }

    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24))

    return diffInDays >= days
}
