import { HttpRequest } from './http-request.js'
import { HttpResponse } from './http-response.js'

export type Controller<TRequestDto, TResponseDto> = ({
    // eslint-disable-next-line no-unused-vars
    httpRequest,
}: {
    httpRequest: HttpRequest<TRequestDto>
}) => Promise<HttpResponse<TResponseDto>>
