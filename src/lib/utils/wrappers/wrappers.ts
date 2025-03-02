// import { expressCallbackWrapper } from './expressCallback.wrapper.js'
import { fastifyControllerWrapper } from './fastify-controller.wrapper.js'
import { getFunctionDuration } from './get-function-duration.wrapper.js'

export const wrappers = {
    // expressCallbackWrapper,
    fastifyControllerWrapper,
    getFunctionDuration,
} as const
