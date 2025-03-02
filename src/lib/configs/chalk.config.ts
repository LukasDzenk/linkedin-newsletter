import chalk from 'chalk'
import { isDevelopment } from './is-development.config.js'

// Global chalk settings
if (isDevelopment) {
    chalk.level = 3 // Enable colors in development mode
} else {
    chalk.level = 0 // Disable colors in production mode
}
