import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const summarySchema = z.object({
    summary: z.string(),
})

export type Summary = z.infer<typeof summarySchema>

export const summary = zodResponseFormat(summarySchema, 'summary')
