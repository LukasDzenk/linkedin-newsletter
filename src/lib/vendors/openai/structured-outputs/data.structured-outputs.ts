import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const dataSchema = z.object({
    data: z.string(),
})

export type Data = z.infer<typeof dataSchema>

export const data = zodResponseFormat(dataSchema, 'data')
