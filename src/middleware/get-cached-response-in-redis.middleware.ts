// import { configs } from '@root/configs/configs.js'
// import { redisClient } from '@root/configs/databases/redis/redis.config.js'
// import { logger } from '@root/server.js'
// import { NextFunction, Request, Response } from 'express'

// // Usage:
// // [
// // (req: Request, res: Response, next: NextFunction) => {
// //   return cacheEndpointInRedisMiddleware({
// //     req,
// //     res,
// //     next,
// //     options: {
// //       durationInSeconds: sharedConstants.time.ONE_HOUR_IN_SECONDS,
// //       shouldCacheErrorResponses: false,
// //     },
// //   })
// // },
// // ],

// export const cacheEndpointInRedis = async ({
//     req,
//     res,
//     next,
//     options,
// }: {
//     req: Request
//     res: Response
//     next: NextFunction
//     options: {
//         durationInSeconds: number
//         shouldCacheErrorResponses: boolean
//     }
// }) => {
//     if (configs.env.system.APP_ENV === 'development') {
//         logger.debug(`Skipping Redis cache in development environment`)

//         next()

//         return
//     }

//     const key = `${req.originalUrl}`

//     try {
//         const cachedResponseDto = await redisUtils.jsonGet(redisClient, key)

//         if (cachedResponseDto) {
//             logger.debug(`✅ Cache hit`)

//             res.send(cachedResponseDto)

//             return
//         } else {
//             logger.debug(`❌ Cache miss`)

//             // Save original res.send
//             const sendResponse = res.send

//             // Monkey patch res.send
//             res.send = (body) => {
//                 res.send = sendResponse

//                 const resIsSuccess = res.statusCode === 200
//                 if (resIsSuccess || options.shouldCacheErrorResponses) {
//                     logger.debug(`📃 Caching response in Redis...`)

//                     redisUtils.jsonSet(redisClient, key, body, options.durationInSeconds)
//                 } else {
//                     logger.debug(`📃 Not caching response in Redis due to non-200 status code`)
//                 }

//                 return res.send(body)
//             }

//             next()
//         }
//     } catch (error) {
//         logger.error(`Failed to get cached response in Redis!`, error)

//         next()
//     }
// }
