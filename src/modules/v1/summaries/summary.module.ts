import { cronJobs } from './application/cron-jobs/cron-jobs.js'
import { data } from './data/data.js'
import { domain } from './domain/domain.js'

export const couponsModule = {
    // application,
    // features,
    data,
    domain,
    cronJobs,
} as const
