import { configs } from '@configs/configs.js'
import { isDevelopment } from '@configs/is-development.config.js'
import { logger } from '@logger/pino.logger.js'
import { exitCodes, exitProcess } from './exit-process.util.js'
import { sleep } from './sleep.util.js'

type ExitHandler = SyncFunction | AsyncFunction
type SyncFunction = () => void
type AsyncFunction = (_args?: { [key: string]: unknown }) => Promise<void>

/**
 * This is a helper class to handle graceful exit of the process.
 * It is used to handle SIGINT and SIGTERM OS signals.
 * It is useful for scripts that run for a long time and need to be stopped manually (e.g. during deployment).
 */
class ExitManager {
    private exitHandlers: ExitHandler[]
    private isExitInProgress = false
    private sigintCount = 0

    constructor() {
        this.exitHandlers = []

        // Default graceful exit handlers
        this.exitHandlers.push(async () => {
            logger.info(
                `Sleeping for ${configs.env.system.SHUTDOWN_GRACE_PERIOD_IN_SECONDS} seconds before shutting down...`,
            )
            await sleep(configs.env.system.SHUTDOWN_GRACE_PERIOD_IN_SECONDS * 1_000)
        })
        // ? this.exitHandlers.push(disconnectFromMongoDb)
        this.exitHandlers.push(() => {
            return exitProcess({ code: exitCodes.SUCCESS })
        })

        if (!isDevelopment) {
            // SIGINT is sent from the terminal with Ctrl+C
            // * Note: Node.js fires SIGINT 2x when Ctrl+C is pressed
            process.on('SIGINT', () => {
                this.sigintCount++
                this._handleExitSignal('SIGINT')
            })

            // SIGTERM is sent from the terminal with kill command (e.g. kill <pid>) (used in render.com)
            process.on('SIGTERM', () => {
                this._handleExitSignal('SIGTERM')
            })
        }
    }

    private async _handleExitSignal(signal: string): Promise<void> {
        logger.warn(`${signal} signal received.`)

        const isKeyboardForceExit = signal === 'SIGINT' && this.sigintCount >= 3
        if (isKeyboardForceExit) {
            logger.warn(
                `${signal} keyboard signal received ${this.sigintCount} times. Forcing exit...`,
            )
            exitProcess({ code: exitCodes.SUCCESS })
            return
        }

        if (this.isExitInProgress) {
            logger.warn('Exit is already in progress. Waiting for it to complete...')
            return
        }

        this.isExitInProgress = true

        for (const handler of this.exitHandlers) {
            await handler()
        }
    }

    public checkIfExitInProgress(): boolean {
        return this.isExitInProgress
    }

    public async forceExitIfPending(): Promise<void> {
        if (this.isExitInProgress) {
            exitProcess({ code: exitCodes.SUCCESS })
        }
    }
}

export const exitManager = new ExitManager()
