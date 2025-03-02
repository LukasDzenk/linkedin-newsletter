import { characterSets } from './character-sets.constant.js'
import { redisKeyPrefixes } from './redis-key-prefixes.constant.js'
import { domainEvents } from './domain-events.constant.js'
import { generalEvents } from './general.events.constant.js'

export const constants = {
    characterSets,
    redisKeyPrefixes,
    generalEvents,
    domainEvents,
} as const
