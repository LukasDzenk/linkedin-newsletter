import { correlationIdPlugin } from './add-correlation-id.middleware.js'
import { apiKeyAuthorizationPlugin } from './api-key-authorization.middleware.js'
import { sendSlackAlertPlugin } from './send-slack-alert.middleware.js'

export const middlewares = {
    apiKeyAuthorizationPlugin,
    sendSlackAlertPlugin,
    correlationIdPlugin,
    // cacheEndpointInRedis,
} as const
