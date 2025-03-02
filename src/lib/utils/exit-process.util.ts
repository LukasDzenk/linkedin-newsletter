import { logger } from '@logger/pino.logger.js'

export const exitCodes = {
    SUCCESS: 0,
    ERROR: 1,
} as const

type ExitCodes = (typeof exitCodes)[keyof typeof exitCodes]

export const exitProcess = ({ code }: { code: ExitCodes }): void => {
    if (code === exitCodes.SUCCESS) {
        logger.warn('Exiting process with code 0 (SUCCESS)')
    } else if (code === exitCodes.ERROR) {
        logger.error(`Exiting process with code 1 (ERROR)`)
    } else {
        throw new Error(`Unknown exit code: '${code}'`)
    }

    process.exit(code)
}
