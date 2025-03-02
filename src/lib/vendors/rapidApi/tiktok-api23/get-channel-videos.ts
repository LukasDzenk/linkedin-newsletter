import { env } from '../../../configs/env-variables.config.js'
import { rateLimiter } from './helpers/rate-limiter.js'

/**
 * Fetches TikTok videos for a user using their secUid
 * @param secUid - TikTok user's secure ID
 * @param count - Number of videos to fetch (default: 35)
 * @param cursor - Pagination cursor (default: '0')
 * @returns TikTok user videos data
 */
export async function getChannelVideos(
    secUid: string,
    count: string = '35',
    cursor: string = '0',
): Promise<TikTokUserVideosResponse> {
    const url = new URL('https://tiktok-api23.p.rapidapi.com/api/user/posts')
    url.searchParams.append('secUid', secUid)
    url.searchParams.append('count', count)
    url.searchParams.append('cursor', cursor)

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
                `Failed to fetch TikTok user videos: ${response.status} ${response.statusText}`,
            )
        }

        const data: TikTokUserVideosResponse = await response.json()
        return data
    } catch (error) {
        throw error instanceof Error
            ? new Error(`Error fetching TikTok user videos: ${error.message}`)
            : new Error('Unknown error fetching TikTok user videos')
    }
}

export interface TikTokUserVideosResponse {
    data: Data
}

export interface Data {
    cursor: string
    extra: Extra
    hasMore: boolean
    itemList: ItemList[]
    log_pb: LogPb
    statusCode: number
    status_code: number
    status_msg: string
}

export interface Extra {
    fatal_item_ids: unknown[]
    logid: string
    now: number
}

export interface ItemList {
    AIGCDescription: string
    CategoryType: number
    HasPromoteEntry: number
    author: Author
    authorStats: AuthorStats
    backendSourceEventTracking: string
    challenges?: Challenge[]
    collected: boolean
    contents: Content[]
    createTime: number
    desc: string
    digged: boolean
    diversificationId?: number
    duetDisplay: number
    duetEnabled: boolean
    forFriend: boolean
    id: string
    itemCommentStatus: number
    item_control: ItemControl
    music: Music
    officalItem: boolean
    originalItem: boolean
    privateItem: boolean
    secret: boolean
    shareEnabled: boolean
    stats: Stats
    statsV2: StatsV2
    stitchDisplay: number
    stitchEnabled?: boolean
    textExtra?: TextExtra2[]
    textLanguage: string
    textTranslatable: boolean
    video: Video
    adAuthorization?: boolean
    isAd?: boolean
    maskType?: number
}

export interface Author {
    avatarLarger: string
    avatarMedium: string
    avatarThumb: string
    commentSetting: number
    downloadSetting: number
    duetSetting: number
    ftc: boolean
    id: string
    isADVirtual: boolean
    isEmbedBanned: boolean
    nickname: string
    openFavorite: boolean
    privateAccount: boolean
    relation: number
    secUid: string
    secret: boolean
    signature: string
    stitchSetting: number
    uniqueId: string
    verified: boolean
}

export interface AuthorStats {
    diggCount: number
    followerCount: number
    followingCount: number
    friendCount: number
    heart: number
    heartCount: number
    videoCount: number
}

export interface Challenge {
    coverLarger: string
    coverMedium: string
    coverThumb: string
    desc: string
    id: string
    profileLarger: string
    profileMedium: string
    profileThumb: string
    title: string
}

export interface Content {
    desc: string
    textExtra?: TextExtra[]
}

export interface TextExtra {
    awemeId: string
    end: number
    hashtagName: string
    isCommerce: boolean
    secUid?: string
    start: number
    subType: number
    type: number
    userId?: string
    userUniqueId?: string
}

export interface ItemControl {
    can_repost: boolean
    can_comment?: boolean
    can_creator_redirect?: boolean
    can_music_redirect?: boolean
    can_share?: boolean
}

export interface Music {
    album?: string
    authorName: string
    coverLarge: string
    coverMedium: string
    coverThumb: string
    duration: number
    id: string
    original: boolean
    playUrl: string
    title: string
}

export interface Stats {
    collectCount: number
    commentCount: number
    diggCount: number
    playCount: number
    shareCount: number
}

export interface StatsV2 {
    collectCount: string
    commentCount: string
    diggCount: string
    playCount: string
    repostCount: string
    shareCount: string
}

export interface TextExtra2 {
    awemeId: string
    end: number
    hashtagName: string
    isCommerce: boolean
    secUid?: string
    start: number
    subType: number
    type: number
    userId?: string
    userUniqueId?: string
}

export interface Video {
    VQScore: string
    bitrate: number
    bitrateInfo: BitrateInfo[]
    claInfo: ClaInfo
    codecType: string
    cover: string
    definition: string
    downloadAddr: string
    duration: number
    dynamicCover: string
    encodeUserTag: string
    encodedType: string
    format: string
    height: number
    id: string
    originCover: string
    playAddr: string
    ratio: string
    subtitleInfos?: SubtitleInfo[]
    videoQuality: string
    volumeInfo: VolumeInfo
    width: number
    zoomCover: ZoomCover
}

export interface BitrateInfo {
    Bitrate: number
    CodecType: string
    GearName: string
    MVMAF: string
    PlayAddr: PlayAddr
    QualityType: number
}

export interface PlayAddr {
    DataSize: number
    FileCs: string
    FileHash: string
    Height: number
    Uri: string
    UrlKey: string
    UrlList: string[]
    Width: number
}

export interface ClaInfo {
    captionInfos?: CaptionInfo[]
    captionsType?: number
    enableAutoCaption: boolean
    hasOriginalAudio: boolean
    originalLanguageInfo?: OriginalLanguageInfo
    noCaptionReason?: number
}

export interface CaptionInfo {
    captionFormat: string
    claSubtitleID: string
    expire: string
    isAutoGen: boolean
    isOriginalCaption: boolean
    language: string
    languageCode: string
    languageID: string
    subID: string
    subtitleType: string
    translationType: string
    url: string
    urlList: string[]
    variant: string
}

export interface OriginalLanguageInfo {
    canTranslateRealTimeNoCheck: boolean
    language: string
    languageCode: string
    languageID: string
}

export interface SubtitleInfo {
    Format: string
    LanguageCodeName: string
    LanguageID: string
    Size: number
    Source: string
    Url: string
    UrlExpire: number
    Version: string
}

export interface VolumeInfo {
    Loudness: number
    Peak: number
}

export interface ZoomCover {
    '240': string
    '480': string
    '720': string
    '960': string
}

export interface LogPb {
    impr_id: string
}
