export type CreateSummaryResponseDto = {
    summary: {
        text: string
        topics: string[]
        dateFrom: string
        createdAt: Date
    }
}
