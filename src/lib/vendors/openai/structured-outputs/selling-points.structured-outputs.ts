import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const sellingPointsSchema = z.object({
    sellingPoints: z.array(
        z.object({
            summary: z.string(),
            details: z.string(),
        }),
    ),
})

// const sellingPointsInitialSchema = z.array(z.string())
// export type SellingPointsInitialInput = z.infer<typeof sellingPointsInitialSchema>
// export const sellingPointsInitial = zodResponseFormat(sellingPointsInitialSchema, 'selling_points_initial')

export type SellingPointsOutput = z.infer<typeof sellingPointsSchema>
export type SellingPointsInput = SellingPointsOutput['sellingPoints']

export const sellingPoints = zodResponseFormat(sellingPointsSchema, 'selling_points')
