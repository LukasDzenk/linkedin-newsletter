import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const uniqueFactsSchema = z.object({
    uniqueFacts: z.array(z.string()),
})

export type UniqueFacts = z.infer<typeof uniqueFactsSchema>

export const uniqueFacts = zodResponseFormat(uniqueFactsSchema, 'unique_facts')
