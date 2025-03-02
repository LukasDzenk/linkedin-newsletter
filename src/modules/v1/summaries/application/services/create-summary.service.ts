import { redisClient } from '@configs/databases/redis/redis.js'
import { logger } from '@logger/pino.logger.js'
import { llmConfig } from '@vendors/openai/llm-config.js'
import { BooleanStructuredOutput } from '@vendors/openai/structured-outputs/boolean.structured-outputs.js'
import { structuredOutputs } from '@vendors/openai/structured-outputs/structured-outputs.js'
import { vendors } from '@vendors/vendors.js'

export const createSummary = async ({
    channelNames,
    topics,
    dateFrom,
    totalVideosCount,
}: {
    channelNames: string[]
    topics: string[]
    dateFrom: string
    totalVideosCount: number
}): Promise<string> => {
    logger.debug('Starting summary creation process', { channelNames, topics, dateFrom })

    // * Get the secUid for each channel name, using Redis cache when available
    logger.debug('Fetching channel secUids')
    const channelSecIds = await Promise.all(
        channelNames.map(async (channelName) => {
            const cacheKey = `linkedin-newsletter:channel:name:${channelName}`

            // Try to get from cache first
            const cachedSecId = await redisClient.get(cacheKey)
            if (cachedSecId) {
                logger.debug('Found cached secUid', { channelName, secUid: cachedSecId })
                return cachedSecId
            }

            // If not in cache, fetch from API
            logger.debug('Cache miss, fetching secUid from API', { channelName })
            const secId = await vendors.rapidApi.tiktokApi23.getChannelSecId(channelName)

            // Store in cache for future use (never expires)
            await redisClient.set(cacheKey, secId)
            logger.debug('Stored secUid in cache', { channelName, secUid: secId })

            return secId
        }),
    )
    logger.debug('Finished fetching channel secUids', { count: channelSecIds.length })

    // * Get the videos for each channel
    logger.debug('Fetching videos for each channel')
    const channelVideos = await Promise.all(
        channelSecIds.map((secId) => {
            logger.debug('Fetching videos for channel', { secId })
            return vendors.rapidApi.tiktokApi23.getChannelVideos(secId)
        }),
    )
    logger.debug('Finished fetching videos', { channelCount: channelVideos.length })

    // * Filter videos by date
    const maxDateAgo = new Date(dateFrom)
    logger.debug('Filtering videos by date', { dateFrom, maxDateAgo })
    const recentChannelVideos = channelVideos.filter((video) => {
        const timestampMs = video.data?.itemList[0]?.createTime
        if (!timestampMs) {
            return false
        }
        const videoDate = new Date(timestampMs)
        return videoDate >= maxDateAgo
    })
    logger.debug('Filtered videos by date', {
        totalVideos: channelVideos.length,
        filteredVideos: recentChannelVideos.length,
    })

    // * Extract all video IDs from the filtered channel videos
    logger.debug('Extracting video IDs')
    const videoIds = recentChannelVideos.flatMap((channelVideo) => {
        return (
            channelVideo.data?.itemList.map((item) => {
                return item.video.id
            }) || []
        )
    })

    // * Filter out any undefined or null video IDs
    const validVideoIds = videoIds.filter(Boolean)
    logger.debug('Extracted valid video IDs', { count: validVideoIds.length })

    // * Filter videos by total count
    logger.debug('Filtering video IDs by total count', { totalVideosCount })
    const filteredVideoIds = validVideoIds.slice(0, totalVideosCount)
    logger.debug('Filtered video IDs by total count', {
        beforeCount: validVideoIds.length,
        afterCount: filteredVideoIds.length,
    })

    // * Get transcript for each video
    logger.debug('Fetching transcripts for videos')
    const transcripts = await Promise.all(
        filteredVideoIds.map((videoId) => {
            logger.debug('Fetching transcript', { videoId })
            return vendors.rapidApi.tiktokVideoTranscript.transcribeTikTokVideo(videoId)
        }),
    )
    logger.debug('Finished fetching transcripts', { count: transcripts.length })

    // * Filter videos by topic
    logger.debug('Filtering videos by topics', { topics })
    const topicFilteredTranscripts = await Promise.all(
        transcripts.map(async (transcript, index) => {
            const videoId = filteredVideoIds[index]
            if (!videoId) {
                logger.warn('No video ID found for transcript', { transcript })
                return null
            }
            logger.debug('Checking if video matches topics', { videoId, topics })

            const containsTopic = await checkTranscriptForTopics(transcript, topics, videoId)

            return containsTopic ? transcript : null
        }),
    )

    const filteredTranscripts = topicFilteredTranscripts.filter(Boolean)
    logger.debug('Filtered videos by topics', {
        beforeCount: transcripts.length,
        afterCount: filteredTranscripts.length,
    })

    // * Get summary for each transcript
    logger.debug('Generating summaries for transcripts')
    const summaries = await Promise.all(
        filteredTranscripts.map(async (transcript) => {
            const response = await vendors.openai.fetchPromptResponseRateLimited<{
                summary: string
            }>({
                userPrompt: `Summarize the following TikTok video transcript concisely:
                
"${transcript}"

Provide a clear, informative summary that captures the key points.`,
                modelName: llmConfig.MODEL_NAME,
                temperature: 0.3,
                structuredOutputSchema: structuredOutputs.summary,
                callerFnName: 'generateTranscriptSummary',
            })

            return response.summary
        }),
    )
    logger.debug('Finished generating summaries', { count: summaries.length })

    // * Combine all summaries into one
    // * Combine all summaries into one
    logger.debug('Generating final combined summary')
    const combinedSummary = await vendors.openai.fetchPromptResponseRateLimited<{
        summary: string
    }>({
        userPrompt: `You're a graduate level journalist working on an summary article LinkedIn post. Write a succinct summary in engaging and informative tone. Focus on key insights, trends, numbers, statistics, facts, takeaways. Use emojis sparingly.

Only allowed formatting:

Bold: **bold text**
Italic: *italic text*
Links: [Link text](URL)
Bullet points:
- Item 1
- Item 2
Numbered lists:
1. Item 1
2. Item 2
Emojis

Use this information / context:
${summaries.join('\n\n')}`,
        modelName: llmConfig.MODEL_NAME,
        temperature: llmConfig.generation.TEMPERATURE,
        structuredOutputSchema: structuredOutputs.summary,
        callerFnName: 'generateCombinedSummary',
    })

    logger.debug(`Finished generating combined summary: ${combinedSummary.summary}`)
    return combinedSummary.summary
}

async function checkTranscriptForTopics(transcript: string, topics: string[], videoId: string) {
    const response = await vendors.openai.fetchPromptResponseRateLimited<BooleanStructuredOutput>({
        userPrompt: `Check if the following transcript realistically contains any of these topics: ${topics.join(', ')}. 
Transcript: "${transcript}"
Return a JSON with a single boolean field indicating if any topic is present.`,
        modelName: llmConfig.MODEL_NAME,
        temperature: 0,
        structuredOutputSchema: structuredOutputs.booleanStructuredOutput,
        callerFnName: 'filterVideosByTopic',
    })

    const containsTopic = response.response
    logger.debug('Topic check result', { videoId, containsTopic })

    return containsTopic
}
