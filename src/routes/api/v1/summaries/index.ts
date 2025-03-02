import { middlewares } from '@middleware/middlewares.js'
import { createSummaryController } from '@modules/v1/summaries/features/create-summary/create-summary.controller.js'
import { validateCreateSummaryRequest } from '@modules/v1/summaries/features/create-summary/create-summary.request.validator.js'
import { utils } from '@utils/utils.js'
import { FastifyInstance } from 'fastify'

export default async function (server: FastifyInstance) {
    server.register(middlewares.correlationIdPlugin)
    // server.register(middlewares.apiKeyAuthorizationPlugin)
    // server.register(middlewares.sendSlackAlertPlugin, {
    //     allowedHttpStatuses: [200],
    // })

    server.route({
        method: 'POST',
        url: '',
        preValidation: async (request, reply) => {
            try {
                validateCreateSummaryRequest({ httpRequest: request })
            } catch (error) {
                utils.zod.handleRequestValidationError({ error, reply })
            }
        },
        config: {},
        handler: utils.wrappers.fastifyControllerWrapper(createSummaryController),
        schema: {},
    })
}
