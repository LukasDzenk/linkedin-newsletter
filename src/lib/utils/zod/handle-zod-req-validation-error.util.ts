import { logger } from '@logger/pino.logger.js'
import { utils } from '@utils/utils.js'
import fastify from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export function handleRequestValidationError({
    error,
    reply,
}: {
    error: unknown
    reply: fastify.FastifyReply
}): void {
    if (error instanceof z.ZodError) {
        const errorResponseDto = formatZodErrorToResponseDto({ error })
        reply.code(StatusCodes.BAD_REQUEST).send(errorResponseDto)
    } else {
        logger.error(utils.serializeError(error))
        reply
            .code(StatusCodes.BAD_REQUEST)
            .send({ message: 'An unexpected error occurred. Please try again later.' })
    }
}

export function formatZodErrorToResponseDto({ error }: { error: z.ZodError }): {
    message: string
    errors: { path: string; message: string }[]
} {
    const formattedErrors = error.errors.map((err) => {
        return {
            path: err.path.join('.'),
            message: err.message,
        }
    })
    return {
        message: 'Validation failed',
        errors: formattedErrors,
    }
}
