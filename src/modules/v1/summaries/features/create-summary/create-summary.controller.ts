import { StatusCodes } from 'http-status-codes'
import { Controller } from 'src/lib/types/controller.type.js'
import { CreateSummaryRequestDto } from './create-summary.request.dto.js'
import { CreateSummaryResponseDto } from './create-summary.response.dto.js'
import { application } from '../../application/application.js'

// Note: Request DTO includes the body, query and params, and the response DTO includes only the body
export const createSummaryController: Controller<
    CreateSummaryRequestDto,
    CreateSummaryResponseDto
> = async ({ httpRequest }) => {
    const { channelUrls } = httpRequest.body
    const channelIds = channelUrls.map((url) => {
        const urlObj = new URL(url)
        // E.g. https://www.tiktok.com/@channel-name -> channel-name
        const channelId = urlObj.pathname.split('@').pop()
        return channelId
    })

    const summary = await application.services.createSummary({
        channelIds,
    })

    // if (either instanceof couponsModule.domain.errors.CouponAlreadyExists) {
    //     const errorHttpResponse = {
    //         headers: null,
    //         statusCode: StatusCodes.CONFLICT,
    //         body: {
    //             message: 'Coupon already exists',
    //         },
    //     }

    //     return errorHttpResponse
    // }

    const successHttpResponse = {
        headers: null,
        statusCode: StatusCodes.OK,
        body: {
            summary: {
                text: summary,
                createdAt: new Date(),
            },
        } satisfies CreateSummaryResponseDto,
    }

    return successHttpResponse
}
