import { ErrorResponseDto } from './error-response-dto.type.js'

export type HttpResponse<TSuccessResponseDto> = {
    headers?: unknown
    statusCode: number
    body: TSuccessResponseDto | ErrorResponseDto
}
