export class CustomBaseError extends Error {
    // Additional properties
    providerName?: string
    callerFunctionName?: string
    originalError?: string
    originalStack?: string

    constructor(
        errorName: string,

        customMessage?: string,
        providerName?: string,
        callerFunctionName?: string,

        originalError: null | Error = null,
    ) {
        super()
        this.message = customMessage ?? ''
        this.name = errorName

        // this.stack -> included by default

        this.providerName = providerName
        this.callerFunctionName = callerFunctionName

        this.originalError = JSON.stringify(originalError, null, 2)
    }
}
