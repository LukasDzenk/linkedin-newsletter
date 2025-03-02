import Bottleneck from 'bottleneck'

// Rate limits: https://rapidapi.com/Lundehund/api/tiktok-api23/pricing

const MAX_CONCURRENT = 1
const REQUESTS_PER_SECOND = 1

export const rateLimiter = new Bottleneck({
    maxConcurrent: MAX_CONCURRENT,
    minTime: 1000 / REQUESTS_PER_SECOND,
})
