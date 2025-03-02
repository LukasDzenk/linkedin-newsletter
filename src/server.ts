import { configs } from '@configs/configs.js'
import { context } from '@configs/context.config.js'
import { isDevelopment } from '@configs/is-development.config.js'
import autoLoad from '@fastify/autoload'
import cors from '@fastify/cors'
import formbody from '@fastify/formbody'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import fastifyStatic from '@fastify/static'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import underPressure from '@fastify/under-pressure'
import { httpLoggerOptions, logger } from '@logger/pino.logger.js'
import { utils } from '@utils/utils.js'
import * as Fastify from 'fastify'
import { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'

export const buildServer = async (): Promise<Fastify.FastifyInstance> => {
    // Create Fastify instance
    const server = Fastify.fastify({
        logger: httpLoggerOptions,
        requestIdLogLabel: 'correlationId',
        genReqId: (request) => {
            const clientCorrelationId = request.headers['correlation-id']
            const correlationId =
                typeof clientCorrelationId === 'string' ? clientCorrelationId : crypto.randomUUID()
            context.enterWith({ correlationId })
            return correlationId
        },
    })

    // Register plugins
    server.register(formbody)
    server.register(cors, {
        origin: isDevelopment
            ? [/localhost:\d+$/, /http:\/\/0\.0\.0\.0:\d+$/] // Allow local development URLs in dev mode
            : configs.env.server.CORS_ORIGIN_WHITELIST, // Only allow the production URL in non-dev mode
        credentials: true, // Allow credentials (like cookies) to be included in CORS requests
    })
    server.register(helmet)
    server.register(underPressure, {
        maxEventLoopDelay: 1000, // Maximum event loop delay in milliseconds
        maxHeapUsedBytes: 8000000000, // Maximum heap memory usage in bytes (8000MB)
        maxRssBytes: 8000000000, // Maximum RSS (Resident Set Size) in bytes (8000MB)
        maxEventLoopUtilization: 0.98, // Maximum event loop utilization (98%)
        message: 'Please try again later.', // Custom message for 503 response
        retryAfter: 30, // Suggested retry time in seconds
        pressureHandler(_request, reply, type, value) {
            logger.warn(`Under pressure event triggered: ${type} = ${value}`)
            reply.send({ message: 'Please try again later.' })
        },
        // Can then be used as follows:
        // if (fastify.isUnderPressure()) {
        // skip complex computation
        //   }
    })

    server.register(rateLimit, {
        // Note: based on the IP address of the client making the request
        max: 100,
        timeWindow: '1 minute',
    })

    // * For serving static files. Note: a script is needed to copy public files to the dist folder
    // server.register(fastifyStatic, {
    //     root: utils.getCurrentDirectoryPath({
    //         importMetaUrl: import.meta.url,
    //         fileNameWithExtension: 'public',
    //     }),
    //     prefix: '/public/',
    // })

    await server.register(swagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'API Documentation',
                description: 'API documentation for the server',
                version: '1.0.0',
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Development server',
                },
            ],
            tags: [{ name: 'System', description: 'System related end-points' }],
            components: {
                securitySchemes: {
                    apiKey: {
                        type: 'apiKey',
                        name: 'apiKey',
                        in: 'header',
                    },
                },
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here',
            },
        },
    })
    server.register(swaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'list', // 'full'
            deepLinking: false,
        },
        uiHooks: {
            onRequest: function (_request: FastifyRequest, _reply: FastifyReply, next: () => void) {
                next()
            },
            preHandler: function (
                _request: FastifyRequest,
                _reply: FastifyReply,
                next: () => void,
            ) {
                next()
            },
        },
        staticCSP: true,
        transformStaticCSP: (header: string) => {
            return header
        },
        transformSpecification: (
            swaggerObject: Record<string, unknown>,
            _request: FastifyRequest,
            _reply: FastifyReply,
        ) => {
            return swaggerObject
        },
        transformSpecificationClone: true,
    })

    // Register routes using directory (via auto-load plugin)
    server.register(autoLoad, {
        dir: utils.getCurrentDirectoryPath({
            importMetaUrl: import.meta.url,
            fileNameWithExtension: 'routes',
        }),
        dirNameRoutePrefix: true, // routes/health folder -> /health endpoint
        routeParams: true, // _id -> /:id
        // options: { prefix: '/api' }, // prefix is not needed due to folder-to-route library
    })

    // Set error handler
    server.setErrorHandler((error, _request, reply) => {
        logger.error(utils.serializeError(error))
        if (error instanceof SyntaxError && error.message.includes('JSON')) {
            reply.status(StatusCodes.BAD_REQUEST).send({
                error: 'Invalid JSON',
                message: 'The request body contains invalid JSON',
            })
        } else {
            reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Something went wrong' })
        }
    })

    // Non-existing endpoint handler
    server.setNotFoundHandler((_request: FastifyRequest, reply: FastifyReply) => {
        reply
            .code(StatusCodes.NOT_FOUND)
            .send({ error: 'Not Found', message: 'Endpoint does not exist' })
    })

    return server
}
