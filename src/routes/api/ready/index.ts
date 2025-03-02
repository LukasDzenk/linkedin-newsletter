import { isServerReady } from '@configs/is-server-ready.config.js'
import { middlewares } from '@middleware/middlewares.js'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'

export default async function (server: FastifyInstance) {
    server.register(middlewares.correlationIdPlugin)
    // server.register(middlewares.apiKeyAuthorizationPlugin)
    server.register(middlewares.sendSlackAlertPlugin, {
        allowedHttpStatuses: [200],
    })

    server.route({
        method: 'GET',
        url: '',
        handler: async (_request: FastifyRequest, reply: FastifyReply) => {
            if (isServerReady()) {
                reply.code(StatusCodes.OK).send({ status: 'Ready' })
            } else {
                reply.code(StatusCodes.SERVICE_UNAVAILABLE).send({ status: 'Not Ready' })
            }
        },
        logLevel: 'silent',
        config: {},
        schema: {
            description: 'Server readiness check endpoint',
            tags: ['System'],
            response: {
                200: {
                    description: 'Server is ready',
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                    },
                },
                503: {
                    description: 'Server is not ready',
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                    },
                },
            },
        },
    })
}
