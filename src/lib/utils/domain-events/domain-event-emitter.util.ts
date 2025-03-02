import { logger } from '@logger/pino.logger.js'
import EventEmitter from 'events'

// Temporary disabled because of eslint error. Once an actual domain event is implemented, this can be enabled again.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type EventMap = {
    // [domainEventTypes.someDomainEvent]: SomeDomainEventHandlerInput
}

const eventEmitterInstance = new EventEmitter()

export const domainEventEmitter = () => {
    const emit = <T extends keyof EventMap>({
        eventType,
        payload,
    }: {
        eventType: T
        payload: EventMap[T]
    }) => {
        logger.info(`Event emitted. eventType: '${eventType}'`)

        eventEmitterInstance.emit(eventType, payload)
    }

    const register = <T extends keyof EventMap>({
        eventType,
        listener,
    }: {
        eventType: T
        listener: (_payload: EventMap[T]) => void
    }) => {
        eventEmitterInstance.on(eventType, listener)
    }

    return {
        emit,
        register,
    } as const
}
