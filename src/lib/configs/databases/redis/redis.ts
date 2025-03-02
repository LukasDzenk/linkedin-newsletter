import chalk from 'chalk'
import { Redis } from 'ioredis'
import { logger } from '@logger/pino.logger.js'
import { configs } from '@configs/configs.js'

let isFriendlyErrorStackEnabled = false

if (configs.env.system.NODE_ENV !== 'production') {
    isFriendlyErrorStackEnabled = true
}

export const redisClient = new Redis(configs.env.databases.redis.REDIS_URL, {
    lazyConnect: true, // Do not connect automatically. Allow redisClient.connect() to initialize the connection
    showFriendlyErrorStack: isFriendlyErrorStackEnabled,
})

redisClient.on('ready', () => {
    return logger.info(`Redis ${chalk.green('connected')}!`)
})

redisClient.on('error', (error) => {
    return logger.error(`Redis ${chalk.red('connection error')}: ${error}`)
})

redisClient.on('reconnecting', () => {
    return logger.info(`Redis ${chalk.yellow('reconnecting')}...`)
})

redisClient.on('end', () => {
    return logger.error(`Redis ${chalk.red('disconnected')}`)
})

// Function to flush the current database
export const clearRedisCache = async () => {
    try {
        await redisClient.flushdb()
        logger.info(chalk.green('All keys in the current database have been deleted.'))
    } catch (error) {
        logger.error(chalk.red('Error flushing the current database:'), error)
    }
}
