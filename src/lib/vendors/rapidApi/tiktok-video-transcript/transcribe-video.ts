import { configs } from '@configs/configs.js'
import { logger } from '@logger/pino.logger.js'

/**
 * Transcribes a TikTok video using the RapidAPI TikTok Video Transcript service.
 * @param videoUrl The URL of the TikTok video to transcribe
 * @param language The language code for transcription (default: 'EN')
 * @param timestamps Whether to include timestamps in the transcription (default: false)
 * @returns The transcription result
 */
export async function transcribeTikTokVideo(
    videoUrl: string,
    language: string = 'EN',
    timestamps: boolean = false,
): Promise<string> {
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
        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`)
        }

        const result = await response.text()
        return result
    } catch (error) {
        logger.error('Error transcribing TikTok video:', error)
        throw error
    }
}
