export abstract class MongoDbBaseError extends Error {
    constructor({ message }: { message: string }) {
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}
