import { AsyncLocalStorage } from 'node:async_hooks'

// Set up a global AsyncLocalStorage instance for context
export const context = new AsyncLocalStorage<Ctx>()

// Define the context type
export type Ctx = { correlationId: string }
