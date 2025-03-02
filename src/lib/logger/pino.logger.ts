import { context } from '@configs/context.config.js'
import { isDevelopment } from '@configs/is-development.config.js'
import { pino } from 'pino'
import { REDACTED_FIELDS } from './redacted-fields.constant.js'

export const httpLoggerOptions: pino.LoggerOptions = {
    level: isDevelopment ? 'debug' : 'info',
    redact: REDACTED_FIELDS,
    errorKey: 'error',
    transport: isDevelopment
        ? {
              target: 'pino-pretty',
              options: {
                  colorize: true,
              },
          }
        : undefined,
}

export const loggerOptions: pino.LoggerOptions = {
    ...httpLoggerOptions,
    hooks: {
        logMethod(args, method) {
            const correlationId = context.getStore()?.correlationId ?? ''
            if (typeof args[0] === 'object') {
                args[0] = Object.assign({}, args[0], { correlationId })
            } else {
                args.unshift({ correlationId })
            }
            return method.apply(this, args)
        },
    },
}

export const logger = pino(loggerOptions)
