import './background-workers.js'
import './cron-jobs.js'
import './event-listeners.js'

import '@configs/configs.js'

import { configs } from '@configs/configs.js'
import { isDevelopment } from '@configs/is-development.config.js'
import { setServerReady } from '@configs/is-server-ready.config.js'
import { logger } from '@logger/pino.logger.js'
import { exitManager } from '@utils/exit-manager.util.js'
import { exitCodes, exitProcess } from '@utils/exit-process.util.js'
import { utils } from '@utils/utils.js'
import { buildServer } from './server.js'

// Just call a random function from the imported modules to ensure they are loaded
exitManager.checkIfExitInProgress()

const startServer = async () => {
    const server = await buildServer()

    try {
        await server.listen({
            port: configs.env.server.PORT,
            // Reduce logging in localhost, meanwhile 0.0.0.0 is needed for running on docker
            host: isDevelopment ? 'localhost' : '0.0.0.0',
        })
        setServerReady(true)
    } catch (error) {
        logger.error(error)
        exitProcess({ code: exitCodes.ERROR })
    }

    // Graceful shutdown of HTTP server
    // Note: Graceful shutdown of background workers, etc. is handled by exitManager.util.ts
    const stopAcceptingRequests = async () => {
        setServerReady(false)
        logger.warn('Stopping server from accepting new requests')
        await server.close()
    }
    process.on('SIGINT', () => {
        stopAcceptingRequests()
    })
    process.on('SIGTERM', () => {
        stopAcceptingRequests()
    })
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
    logger.error(`Unhandled rejection: ${utils.serializeError(error)}`)
    exitProcess({ code: exitCodes.ERROR })
})
process.on('uncaughtException', (error) => {
    logger.error(`Unhandled rejection: ${utils.serializeError(error)}`)
    exitProcess({ code: exitCodes.ERROR })
})

// Start the server
startServer()
