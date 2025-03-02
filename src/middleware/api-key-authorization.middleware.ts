import { configs } from '@configs/configs.js'
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { StatusCodes } from 'http-status-codes'

const apiKeyAuthorizationFn: FastifyPluginAsync = async (server) => {
    server.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
        const authHeader = request.headers.authorization
        if (typeof authHeader !== 'string') {
            reply.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' })
            return
        }

        const apiKey = authHeader.split(' ')[1]
        if (!apiKey) {
            reply.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' })
            return
        }

        const VALID_API_KEYS = configs.env.server.API_KEYS
        const apiKeyIsValid = VALID_API_KEYS.includes(apiKey)
        if (!apiKeyIsValid) {
            reply.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' })
            return
        }
    })
}

export const apiKeyAuthorizationPlugin = fp(apiKeyAuthorizationFn, {
    name: 'apiKeyAuthorization',
})
