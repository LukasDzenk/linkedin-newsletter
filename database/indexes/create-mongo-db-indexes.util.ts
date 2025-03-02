// import { time } from '@root/libs/constants/time.constant.js'
// import { runScriptWithLogging } from '@root/libs/utils/runScriptWithLogging.util.js'
// import { sleep } from '@root/libs/utils/sleep.util.js'
// import { runServer } from '@root/server.js'
// import mongoose from 'mongoose'

// /**
//  * Create TTL indexes on MongoDB collections which:
//  *
//  * - Do not have mongoose models (e.g. req_and_res_logs, logs)
//  * - Need compound indexes
//  *
//  * * Note: Creating indexes is problematic. Please apply one by one.
//  */
// // SYSTEM_NODE_ENV=development SYSTEM_APP_ENV=development ./node_modules/.bin/tsx ./database/indexes/create-mongo-db-indexes.util.ts
// export const makeCreateMongoDbIndexes = () => {
//     return async () => {
//         console.log('🦖 Creating indexes...')

//         await sleep(5_000)

//         // Note: if errors - apply one by one

//         await mongoose.connection.db
//             .collection('req_and_res_logs')
//             .createIndex({ timestamp: 1 }, { expireAfterSeconds: time.ONE_DAY_IN_SECONDS * 14 })

//         await mongoose.connection.db
//             .collection('logs')
//             .createIndex({ timestamp: 1 }, { expireAfterSeconds: time.ONE_DAY_IN_SECONDS * 14 })

//         await mongoose.connection.db
//             .collection('coupons')
//             .createIndex({ wasClaimed: 1, generatedAt: 1 })

//         await mongoose.connection.db
//             .collection('coupons')
//             .createIndex({ wasClaimed: 1, createdByUserId: 1 })

//         console.log('🦖 Indexes created!')
//     }
// }

// // TODO: script, just like app, should make "made" first, and only then ran

// // await runServer(async () => {
// //     await runScriptWithLogging(async () => {
// //         const createMongoDbIndexes = makeCreateMongoDbIndexes()
// //         await createMongoDbIndexes()
// //     })
// // })

// // await runScriptWithLogging(async () => {
// //     await runServer(async () => {
// //         const createMongoDbIndexes = makeCreateMongoDbIndexes()
// //         await createMongoDbIndexes()
// //     })
// // })

// await runServer()
// const createMongoDbIndexes = makeCreateMongoDbIndexes()
// await runScriptWithLogging(createMongoDbIndexes)
