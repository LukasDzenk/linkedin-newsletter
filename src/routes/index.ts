import { middlewares } from '@middleware/middlewares.js'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'

export default async function (server: FastifyInstance) {
    server.register(middlewares.correlationIdPlugin)
    // server.register(middlewares.apiKeyAuthorizationPlugin)
    // server.register(middlewares.sendSlackAlertPlugin, {
    //     allowedHttpStatuses: [200],
    // })

    server.route({
        method: 'GET',
        url: '/',
        handler: async (_request: FastifyRequest, reply: FastifyReply) => {
            reply.code(StatusCodes.OK).send('OK')
        },
        logLevel: 'silent',
        config: {
            rateLimit: {
                max: 100,
                timeWindow: '1 minute',
            },
        },
        schema: {
            description: 'Root endpoint',
            tags: ['System'],
            response: {
                200: {
                    description: 'Server is running',
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                    },
                },
            },
        },
    })
}
