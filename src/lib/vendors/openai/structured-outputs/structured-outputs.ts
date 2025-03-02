import { booleanStructuredOutput } from './boolean.structured-outputs.js'
import { data } from './data.structured-outputs.js'
import { descriptionLtEvaluator } from './description-lt-evaluator.structured-outputs.js'
import { summary } from './description.structured-outputs.js'
import { prosAndCons } from './pros-and-cons.structured-outputs.js'
import { sellingPoints } from './selling-points.structured-outputs.js'
import { uniqueFacts } from './unique-facts.structured-outputs.js'

export const structuredOutputs = {
    data,
    sellingPoints,
    summary,
    prosAndCons,
    booleanStructuredOutput,
    descriptionLtEvaluator,
    uniqueFacts,
} as const
