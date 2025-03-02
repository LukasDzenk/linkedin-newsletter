import { CustomBaseError } from '@errors/custom-base.error.js'

export class CouponAlreadyExists extends CustomBaseError {
    constructor() {
        super('Coupon already exists')
        this.name = 'CouponAlreadyExists'
    }
}
