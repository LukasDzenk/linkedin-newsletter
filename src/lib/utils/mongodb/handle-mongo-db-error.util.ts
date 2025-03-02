import { errors } from '@errors/errors.js'
import { logger } from '@logger/pino.logger.js'
import { serializeError } from '@utils/serialize-error.util.js'

export const handleMongoDbError = ({
    error,
    documentId,
}: {
    error: unknown
    documentId: string
}) => {
    if (!(error instanceof Error)) {
        logger.error(`🚨 MongoDB error - Unknown error type: ${error}`)
        return null
    }

    // @ts-expect-error - Not sure how to properly type this
    switch (error.code) {
        case errors.databases.mongoDb.errorCodes.DUPLICATE_KEY:
            logger.debug(`🚨 MongoDB error - Duplicate key`)

            return new errors.databases.mongoDb.DuplicateKey({
                message: `Duplicate entry for the provided document ID: ${documentId}.`,
            })
        default:
            logger.error(`🚨 MongoDB error - Unknown error ${serializeError(error)}`)

            throw error
    }
}
