import { DuplicateKey } from './duplicate-key.error.js'
import { errorCodes } from './error-codes.js'

export const mongoDb = {
    DuplicateKey,

    errorCodes,
} as const
