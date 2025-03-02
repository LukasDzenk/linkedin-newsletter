import { CustomBaseError } from '@errors/custom-base.error.js'

export class NoResultsFound extends CustomBaseError {
    constructor(message?: string) {
        super('NoResultsFound', message)
        this.name = 'NoResultsFound'
    }
}
