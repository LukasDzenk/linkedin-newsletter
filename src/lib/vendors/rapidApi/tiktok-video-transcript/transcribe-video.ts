import { configs } from '@configs/configs.js'
import { logger } from '@logger/pino.logger.js'
import Bottleneck from 'bottleneck'

// Rate limits: https://rapidapi.com/ikousiyb/api/tiktok-video-transcript/pricing

const MAX_CONCURRENT = 1
const REQUESTS_PER_SECOND = 1

export const rateLimiter = new Bottleneck({
    maxConcurrent: MAX_CONCURRENT,
    minTime: 1000 / REQUESTS_PER_SECOND,
})

/**
 * Transcribes a TikTok video using the RapidAPI TikTok Video Transcript service.
 * @param videoUrl The URL of the TikTok video to transcribe
 * @param language The language code for transcription (default: 'EN')
 * @param timestamps Whether to include timestamps in the transcription (default: false)
 * @returns The transcription result
 */
export async function transcribeTikTokVideo({
    videoUrl,
    language = 'EN',
    timestamps = false,
}: {
    videoUrl: string
    language?: string
    timestamps?: boolean
}): Promise<string> {
    const encodedUrl = encodeURIComponent(videoUrl)
    const url = `https://tiktok-video-transcript.p.rapidapi.com/transcribe?url=${encodedUrl}&language=${language}&timestamps=${timestamps}`

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': configs.env.app.vendors.rapidApi.API_KEY,
            'x-rapidapi-host': 'tiktok-video-transcript.p.rapidapi.com',
        },
    }

    try {
        const response = await rateLimiter.schedule(() => {
            return fetch(url, options)
        })

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`)
        }

        const result: TikTokVideoTranscriptResponse = await response.json()
        return result.text
    } catch (error) {
        logger.error('Error transcribing TikTok video:', error)
        throw error
    }
}

// APP_ENV=production NODE_ENV=production ./node_modules/.bin/tsx src/lib/vendors/rapidApi/tiktok-video-transcript/transcribe-video.ts
// transcribeTikTokVideo('https://www.tiktok.com/@tiktok/video/7427117204686179630')

// Response example JSON:
// {"success":true,"text":"I'm about to tell you the funniest joke of all time. So to find this, 40,000 jokes were submitted and 350,000 people from 70 different countries voted. The winner by a wide margin was the following. Now read a verbatim so I don't butcher it. 2 hunters are out in the woods when one of them collapses. He doesn't seem to be breathing and his eyes are glazed. The other guy whips out his phone and calls the emergency services. He gasps, my friend is dead. What can I do? The operator says, calm down, I can help. First, let's make sure he's dead. There's the silence. Then a shot is heard. Back on the phone, the guy says, okay, now what? Did you laugh"}

type TikTokVideoTranscriptResponse = {
    success: boolean
    text: string
}
