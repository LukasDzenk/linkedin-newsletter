import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const booleanSchema = z.object({
    response: z.boolean(),
})

export type BooleanStructuredOutput = z.infer<typeof booleanSchema>

export const booleanStructuredOutput = zodResponseFormat(booleanSchema, 'boolean')
