import { ErrorResponseDto } from 'src/lib/types/error-response-dto.type.js'

export type CreateSummaryResponseDto =
    | {
          summary: {
              topics: string[]
              dateFrom: string
              totalVideosCount: number
              text: string
              createdAt: Date
          }
      }
    | ErrorResponseDto
