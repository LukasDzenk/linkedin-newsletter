import { StatusCodes } from 'http-status-codes'
import { Controller } from 'src/lib/types/controller.type.js'
import { application } from '../../application/application.js'
import { errors } from '../../domain/errors/errors.js'
import { CreateSummaryRequestDto } from './create-summary.request.dto.js'
import { CreateSummaryResponseDto } from './create-summary.response.dto.js'

const DEFAULT_TOTAL_VIDEOS_COUNT = 20

// Note: Request DTO includes the body, query and params, and the response DTO includes only the body
export const createSummaryController: Controller<
    CreateSummaryRequestDto,
    CreateSummaryResponseDto
> = async ({ httpRequest }) => {
    const { channelUrls, topics, dateFrom, totalVideosCount } = httpRequest.body
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

    const videosCount = totalVideosCount ?? DEFAULT_TOTAL_VIDEOS_COUNT

    // * Mock response for testing
    const isMockEnabled = httpRequest.body.isMockEnabled
    if (isMockEnabled === true) {
        const mockHttpResponse = {
            headers: null,
            statusCode: StatusCodes.OK,
            body: {
                summary: {
                    text: 'Exploring the Future of Technology\n\nThe upcoming months promise groundbreaking advancements in technology, shaping industries and lifestyles globally. Key insights include:\n\n- Artificial Intelligence: Expanding into healthcare, education, and environmental solutions.\n- Sustainability Trends: Green energy and carbon-neutral technologies are gaining traction.\n- Digital Transformation: Businesses prioritize cloud computing and cybersecurity measures.\n\nA recent survey highlights that 78% of companies plan to increase tech investments in the coming quarters.',
                    topics,
                    dateFrom,
                    totalVideosCount: videosCount,
                    createdAt: new Date(),
                },
            } satisfies CreateSummaryResponseDto,
        }

        return mockHttpResponse
    }

    const summaryResult = await application.services.createSummary({
        channelNames,
        topics,
        dateFrom,
        totalVideosCount: videosCount,
    })

    if (summaryResult instanceof errors.NoResultsFound) {
        const errorHttpResponse = {
            headers: null,
            statusCode: StatusCodes.NOT_FOUND,
            body: {
                error: 'Not found',
                message: summaryResult.message,
            } satisfies CreateSummaryResponseDto,
        }

        return errorHttpResponse
    }

    const successHttpResponse = {
        headers: null,
        statusCode: StatusCodes.OK,
        body: {
            summary: {
                topics,
                dateFrom,
                totalVideosCount: videosCount,
                text: summaryResult,
                createdAt: new Date(),
            },
        } satisfies CreateSummaryResponseDto,
    }

    return successHttpResponse
}
