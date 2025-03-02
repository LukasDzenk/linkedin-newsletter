// import { utils } from '@utils/utils.js'
// import { CouponEntity } from '../../domain/entities/coupon.entity.js'
// import { logger } from '@logger/pino.logger.js'

// export const createCoupon = async ({ couponEntity }: { couponEntity: CouponEntity }) => {
//     try {
//         // await CouponModel.create(couponEntity)

//         logger.info(`✅ Coupon created:\n${JSON.stringify(couponEntity, null, 4)}`)

//         return true
//     } catch (error) {
//         const mongoDbError = utils.mongodb.handleMongoDbError({
//             error,
//             documentId: '',
//         })

//         return mongoDbError
//     }
// }
