import { z } from 'zod'

export const CreateSummaryRequestSchema = z.object({
    // headers: z.object({}),
    params: z.object({}).strict(),
    query: z.object({}).strict(),
    body: z
        .object({
            channelUrls: z.array(z.string().url()),
        })
        .strict(),
})

export const validateCreateSummaryRequest = ({ httpRequest }: { httpRequest: unknown }) => {
    return CreateSummaryRequestSchema.parse(httpRequest)
}
