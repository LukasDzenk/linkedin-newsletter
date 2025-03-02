import { context } from '@configs/context.config.js'
import { isDevelopment } from '@configs/is-development.config.js'
import { logger } from '@logger/pino.logger.js'
import { utils } from '@utils/utils.js'
import { vendors } from '@vendors/vendors.js'
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

interface SlackAlertOptions {
    allowedHttpStatuses: number[]
}

const slackAlertPlugin: FastifyPluginAsync<SlackAlertOptions> = async (fastify, options) => {
    fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
        if (!shouldSendAlert(reply.statusCode, options.allowedHttpStatuses)) {
            return
        }

        try {
            await sendAlertToSlack(request, reply)
        } catch (error) {
            logger.error('Failed to send Slack alert!', error)
            await sendErrorAlertToSlack(error)
        }
    })
}

function shouldSendAlert(statusCode: number, allowedHttpStatuses: number[]): boolean {
    const shouldSendAlert = !isDevelopment && !allowedHttpStatuses.includes(statusCode)

    return shouldSendAlert
}

async function sendAlertToSlack(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    logger.debug('📃 Sending an alert in Slack!...')
    await vendors.slack.sendMessage({
        message: `❌ Error occurred:
* status: ${reply.statusCode}
* method: ${request.method.toUpperCase()}
* url: ${request.url}
* clickable url: <${request.protocol}://${request.hostname}${request.url}>
* correlation-id: ${context.getStore()?.correlationId}
* user-agent: ${request.headers['user-agent']}`,
    })
}

async function sendErrorAlertToSlack(error: unknown): Promise<void> {
    try {
        await vendors.slack.sendMessage({
            message: `❌ Error occurred while sending a Slack alert: \`\`\`${utils.serializeError(error)}\`\`\``,
        })
    } catch (slackError) {
        logger.error('Failed to send Slack alert error!', slackError)
    }
}

export const sendSlackAlertPlugin = fp(slackAlertPlugin, {
    name: 'sendSlackAlert',
})

// import { configs } from '@configs/configs.js'
// import { logger } from '@logger/pino.logger.js'
// import { utils } from '@utils/utils.js'
// import { vendors } from '@vendors/vendors.js'
// import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
// import fp from 'fastify-plugin'

// interface SendSlackAlertOptions {
//     allowedHttpStatuses: number[]
// }

// const sendSlackAlertFn: FastifyPluginAsync<SendSlackAlertOptions> = async (fastify, options) => {
//     fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
//         const originalSend = reply.send

//         reply.send = function (payload: unknown) {
//             const shouldResStatusTriggerMessage = !options.allowedHttpStatuses.includes(
//                 reply.statusCode,
//             )

//             if (
//                 configs.env.system.APP_ENV === 'production' &&
//                 configs.env.system.NODE_ENV === 'production' &&
//                 shouldResStatusTriggerMessage
//             ) {
//                 logger.debug('📃 Sending an alert in Slack!...')

//                 vendors.slack
//                     .sendMessage({
//                         message: `❌ Error occurred:
// * status: ${reply.statusCode}
// * method: ${request.method.toUpperCase()}
// * url: ${request.url}
// * clickable url: <${request.protocol}://${request.hostname}${request.url}>
// * correlation-id: ${reply.getHeader('correlation-id')}
// * user-agent: ${request.headers['user-agent']}`,
//                     })
//                     .catch((error) => {
//                         logger.error('Failed to send Slack alert!', error)
//                     })
//             }

//             return originalSend.call(this, payload)
//         }
//     })

//     fastify.addHook('onError', async (request, reply, error) => {
//         logger.error('Failed to send Slack alert!', error)

//         try {
//             await vendors.slack.sendMessage({
//                 message: `❌ Error occurred while sending a Slack alert: \n${utils.serializeError(error)}\n`,
//             })
//         } catch (slackError) {
//             logger.error('Failed to send Slack alert error!', slackError)
//         }
//     })
// }

// export const sendSlackAlertPlugin = fp(sendSlackAlertFn, {
//     name: 'sendSlackAlert',
// })

// ! ---------------

// import { configs } from '@root/configs/configs.js'
// import { libs } from '@root/libs/libs.js'
// import { sendSlackMessage } from '@root/loggers/slack.logger.js'
// import { mainLogger } from '@root/server.js'
// import { NextFunction, Request, Response } from 'express'

// export const sendSlackAlert = ({
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     req,
//     res,
//     next,
//     options,
// }: {
//     req: Request
//     res: Response
//     next: NextFunction
//     options: {
//         allowedHttpStatuses: number[]
//     }
// }) => {
//     try {
//         // Save original res.send
//         const sendResponse = res.send

//         // Monkey patch res.send
//         res.send = (body) => {
//             res.send = sendResponse

//             const shouldResStatusTriggerMessage = !options.allowedHttpStatuses.includes(
//                 res.statusCode
//             )

//             if (
//                 configs.env.system.APP_ENV === 'production' &&
//                 configs.env.system.NODE_ENV === 'production' &&
//                 shouldResStatusTriggerMessage
//             ) {
//                 mainLogger.debug(`📃 Sending an alert in Slack!...`)

//                 sendSlackMessage({
//                     message: `❌ Error occurred:
// * status: ${res.statusCode}
// * method: ${req.method.toUpperCase()}
// * url: ${req.originalUrl}
// * clickable url: <${req.protocol}://${req.get('host')}${req.originalUrl}>
// * correlation-id: ${res.getHeader('correlation-id')}
// * user-agent: ${req.headers['user-agent']}`,
//                 })
//             }

//             return res.send(body)
//         }

//         next()
//     } catch (error) {
//         mainLogger.error(`Failed to send Slack alert!`, error)

//         try {
//             sendSlackMessage({
//                 message: `❌ Error occurred while sending a Slack alert: \`\`\`${libs.utils.error.serializeError(error)}\`\`\``,
//             })
//         } catch (error) {
//             mainLogger.error(`Failed to send Slack alert error!`, error)
//         }

//         next()
//     }
// }
