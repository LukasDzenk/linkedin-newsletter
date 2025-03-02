import { logger } from '@logger/pino.logger.js'
import { utils } from '../utils.js'

/**
 * A wrapper function to measure the performance of a function.
 *
 * @remarks
 * If a sync function is passed in, it will work, but become async.
 *
 * @example
 * const wrappedScrapingFunction = functionPerformanceWrapper(scrapingFunction)
 * const response = await wrappedScrapingFunction(req)
 *
 * @param fn - Function to measure
 * @returns Function that returns the same result as the original function, but also logs the performance
 */
export const getFunctionDuration = <T extends Array<unknown>, U>(
    // eslint-disable-next-line no-unused-vars
    fn: (...args: T) => U,
    // eslint-disable-next-line no-unused-vars
): ((...args: T) => Promise<U>) => {
    return async (...args: T): Promise<U> => {
        const startTime = performance.now()

        const functionResult = await fn(...args)

        const executionTimeInMilliseconds = performance.now() - startTime
        const executionTimeInSeconds = utils.millisecondsToSeconds(executionTimeInMilliseconds)
        const roundedExecutionTimeInSeconds = utils.roundFloat(executionTimeInSeconds, 2)

        logger.info(`Performance measurement: '${fn.name}' took ${roundedExecutionTimeInSeconds}s`)

        return functionResult
    }
}
