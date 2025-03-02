import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const descriptionLtEvaluatorSchema = z.object({
    breaking_conditions: z.array(
        z.object({
            rule_name: z.string(),
            quote: z.string(),
            reason: z.string(),
        }),
    ),
})

export type DescriptionLtEvaluator = z.infer<typeof descriptionLtEvaluatorSchema>

export const descriptionLtEvaluator = zodResponseFormat(
    descriptionLtEvaluatorSchema,
    'description_lt_evaluation',
)
