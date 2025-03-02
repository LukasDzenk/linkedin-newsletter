import { ClientError } from './Client.error.js'
import { InternalServerError } from './InternalServer.error.js'
import { NetworkError } from './NetworkError.js'

export const vendor = {
    ClientError,
    InternalServerError,
    NetworkError,
} as const
