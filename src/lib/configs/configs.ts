import { env } from './env-variables.config.js'
import { isDevelopment } from './is-development.config.js'
import { vendors } from './vendors/vendors.js'

import './chalk.config.js'

export const configs = {
    env,
    // context,
    // databases,
    vendors,
    isDevelopment,
} as const
