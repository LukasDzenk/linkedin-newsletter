import { context } from '@configs/context.config.js'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

export const correlationIdPlugin: FastifyPluginAsync = fp(async (server) => {
    server.addHook('onRequest', async (_request, reply) => {
        const correlationId = context.getStore()?.correlationId || ''

        reply.header('correlation-id', correlationId)
    })
})
