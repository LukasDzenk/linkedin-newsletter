import { env } from './env-variables.config.js'

export const isDevelopment = env.system.APP_ENV === 'development'
