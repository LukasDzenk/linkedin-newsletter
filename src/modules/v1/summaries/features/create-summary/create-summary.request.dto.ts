import { z } from 'zod'
import { CreateSummaryRequestSchema } from './create-summary.request.validator.js'

export type CreateSummaryRequestDto = z.infer<typeof CreateSummaryRequestSchema>
