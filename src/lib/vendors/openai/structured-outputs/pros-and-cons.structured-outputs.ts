import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const prosAndConsSchema = z.object({
    pros: z.array(z.string()),
    cons: z.array(z.string()),
})

export type ProsAndCons = z.infer<typeof prosAndConsSchema>

export const prosAndCons = zodResponseFormat(prosAndConsSchema, 'pros_and_cons')
