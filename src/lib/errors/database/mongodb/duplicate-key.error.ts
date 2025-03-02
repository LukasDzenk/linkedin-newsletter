import { errorCodes } from './error-codes.js'
import { MongoDbBaseError } from './mongodb.base.error.js'

export class DuplicateKey extends MongoDbBaseError {
    readonly code = errorCodes.DUPLICATE_KEY
}
