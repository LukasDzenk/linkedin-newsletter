import { StatusCodes } from 'http-status-codes'
import { Controller } from 'src/lib/types/controller.type.js'
import { application } from '../../application/application.js'
import { CreateSummaryRequestDto } from './create-summary.request.dto.js'
import { CreateSummaryResponseDto } from './create-summary.response.dto.js'

const DEFAULT_TOTAL_VIDEOS_COUNT = 20

// Note: Request DTO includes the body, query and params, and the response DTO includes only the body
export const createSummaryController: Controller<
    CreateSummaryRequestDto,
    CreateSummaryResponseDto
> = async ({ httpRequest }) => {
    const { channelUrls, topics, dateFrom } = httpRequest.body
    const channelNames = channelUrls
        .map((url) => {
            const urlObj = new URL(url)
            // E.g. https://www.tiktok.com/@channel-name -> channel-name
            const channelName = urlObj.pathname.split('@').pop()
            return channelName
        })
        .filter((name) => {
            return name !== undefined
        })

    const summary = await application.services.createSummary({
        channelNames,
        topics,
        dateFrom,
        totalVideosCount: DEFAULT_TOTAL_VIDEOS_COUNT,
    })

    const successHttpResponse = {
        headers: null,
        statusCode: StatusCodes.OK,
        body: {
            summary: {
                text: summary,
                topics,
                dateFrom,
                createdAt: new Date(),
            },
        } satisfies CreateSummaryResponseDto,
    }

    return successHttpResponse
}
