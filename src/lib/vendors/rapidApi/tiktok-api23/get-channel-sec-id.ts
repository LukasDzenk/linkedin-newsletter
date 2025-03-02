import { env } from '../../../configs/env-variables.config.js'
import { rateLimiter } from './helpers/rate-limiter.js'

/**
 * Fetches TikTok user information by username
 * @param uniqueId - TikTok username
 * @returns User information including secUid
 */
export async function getChannelSecId(
    uniqueId: string,
): Promise<TikTokUserResponse['userInfo']['user']['secUid']> {
    const url = new URL('https://tiktok-api23.p.rapidapi.com/api/user/info')
    url.searchParams.append('uniqueId', uniqueId)

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': env.app.vendors.rapidApi.API_KEY,
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
        },
    }

    try {
        // Use rate limiter to respect API limits
        const response = await rateLimiter.schedule(() => {
            return fetch(url, options)
        })

        if (!response.ok) {
            throw new Error(
                `Failed to fetch TikTok user info: ${response.status} ${response.statusText}`,
            )
        }

        const data: TikTokUserResponse = await response.json()
        const secUid = data.userInfo.user.secUid
        return secUid
    } catch (error) {
        // Using throw without console.error to avoid linting issues
        throw error instanceof Error
            ? new Error(`Error fetching TikTok user info: ${error.message}`)
            : new Error('Unknown error fetching TikTok user info')
    }
}

export interface TikTokUserResponse {
    userInfo: {
        user: {
            id: string
            shortId: string
            uniqueId: string
            nickname: string
            avatarLarger: string
            avatarMedium: string
            avatarThumb: string
            signature: string
            createTime: number
            verified: boolean
            secUid: string
            ftc: boolean
            relation: number
            openFavorite: boolean
            bioLink?: {
                link: string
                risk: number
            }
            commentSetting: number
            commerceUserInfo: {
                commerceUser: boolean
            }
            duetSetting: number
            stitchSetting: number
            privateAccount: boolean
            secret: boolean
            isADVirtual: boolean
            roomId: string
            uniqueIdModifyTime: number
            ttSeller: boolean
            region: string
            downloadSetting: number
            profileTab: {
                showMusicTab: boolean
                showQuestionTab: boolean
                showPlayListTab: boolean
            }
            followingVisibility: number
            recommendReason: string
            nowInvitationCardUrl: string
            nickNameModifyTime: number
            isEmbedBanned: boolean
            canExpPlaylist: boolean
            profileEmbedPermission: number
            language: string
            eventList: unknown[]
            suggestAccountBind: boolean
        }
        stats: {
            followerCount: number
            followingCount: number
            heart: number
            heartCount: number
            videoCount: number
            diggCount: number
            friendCount: number
        }
        itemList: unknown[]
    }
    shareMeta: {
        title: string
        desc: string
    }
    statusCode: number
    statusMsg: string
    needFix: boolean
}
