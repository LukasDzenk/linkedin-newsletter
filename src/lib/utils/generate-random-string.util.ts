import { utils } from './utils.js'

export const generateRandomString = (length: number, charSet: string) => {
    const pattern = '*'.repeat(length)

    return utils.generateRandomStringByPattern(pattern, null, charSet)
}
