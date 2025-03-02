import { utils } from './utils.js'

/**
 * Call a function every X amount of seconds.
 *
 * @remarks
 * Initial call is made after X amount of seconds.
 */
export const callFunctionEveryXSeconds = (seconds: number, fn: () => void): void => {
    const interval = seconds * 1000

    setTimeout(() => {
        fn()
        utils.callFunctionEveryXSeconds(seconds, fn)
    }, interval)
}
