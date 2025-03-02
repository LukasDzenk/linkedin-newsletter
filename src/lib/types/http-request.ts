export type HttpRequest<TRequestDto = { body: unknown; query: unknown; params: unknown }> = {
    ip?: string
    body: TRequestDto extends { body: unknown } ? TRequestDto['body'] : unknown
    query: TRequestDto extends { query: unknown } ? TRequestDto['query'] : unknown
    params: TRequestDto extends { params: unknown } ? TRequestDto['params'] : unknown
    method: string
    path: string
    headers: {
        correlationId: string
        'Content-Type': string
        Referer: string
        'User-Agent': string
    }
    id: string
    hostname: string
    protocol: string
    session?: unknown
    user?: unknown
}
