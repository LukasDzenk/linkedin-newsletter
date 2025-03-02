import { CustomBaseError } from '../custom-base.error.js'

export class NetworkError extends CustomBaseError {
    constructor(
        customMessage: string,
        providerName: string,
        callerFunction: string,
        originalError: null | Error = null,
    ) {
        super(NetworkError.name, customMessage, providerName, callerFunction, originalError)
    }
}
