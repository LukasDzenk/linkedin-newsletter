import { FastifyReply, FastifyRequest } from 'fastify'
import { Controller } from 'src/lib/types/controller.type.js'
import { HttpRequest } from 'src/lib/types/http-request.js'

export const fastifyControllerWrapper = (controller: Controller<unknown, unknown>) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const httpRequest: HttpRequest = {
            body: request.body,
            query: request.query,
            params: request.params,
            ip: request.ip,
            method: request.method,
            path: request.url,
            headers: {
                correlationId: request.headers['correlation-id'] as string,
                'Content-Type': request.headers['content-type'] || '',
                Referer: request.headers['referer'] || '',
                'User-Agent': request.headers['user-agent'] || '',
            },
            id: request.id,
            hostname: request.hostname,
            protocol: request.protocol,
        }

        const httpResponse = await controller({ httpRequest })

        if (httpResponse.headers) {
            reply.headers(httpResponse.headers)
        }

        return reply.status(httpResponse.statusCode).send(httpResponse.body)
    }
}
