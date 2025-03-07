import { redisClient } from '@configs/databases/redis/redis.js'
import { logger } from '@logger/pino.logger.js'
import { utils } from '@utils/utils.js'
import { llmConfig } from '@vendors/openai/llm-config.js'
import { BooleanStructuredOutput } from '@vendors/openai/structured-outputs/boolean.structured-outputs.js'
import { structuredOutputs } from '@vendors/openai/structured-outputs/structured-outputs.js'
import { vendors } from '@vendors/vendors.js'
import { NoResultsFound } from '../../domain/errors/no-results-found.error.js'
import { generateSummary } from './generate-in-steps/generate-summary.js'
import { generateMetadataForSummary } from './generate-in-steps/generate-metadata-for-summary.js'
import { refineForLinkedIn } from './refine-for-linkedin.js'

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
}): Promise<string | NoResultsFound> => {
    logger.debug(
        `Starting summary creation process - channelNames: ${JSON.stringify(channelNames)}, topics: ${JSON.stringify(topics)}, dateFrom: ${dateFrom}`,
    )

    // * Get the secUid for each channel name, using Redis cache when available
    logger.debug(`Fetching channel secUids`)
    const channelSecIds = await Promise.all(
        channelNames.map(async (channelName) => {
            const cacheKey = `linkedin-newsletter:channel:name:${channelName}`

            // Try to get from cache first
            const cachedSecId = await redisClient.get(cacheKey)
            if (cachedSecId) {
                logger.debug(
                    `Found cached secUid for channelName: ${channelName}, secUid: ${cachedSecId}`,
                )
                return cachedSecId
            }

            // If not in cache, fetch from API
            logger.debug(`Cache miss, fetching secUid from API for channelName: ${channelName}`)
            const secId = await vendors.rapidApi.tiktokApi23.getChannelSecId(channelName)

            // Store in cache for future use (never expires)
            await redisClient.set(cacheKey, secId)
            logger.debug(`Stored secUid in cache for channelName: ${channelName}, secUid: ${secId}`)

            return secId
        }),
    )
    logger.debug(`Finished fetching channel secUids, count: ${channelSecIds.length}`)

    // * Get the videos for each channel
    logger.debug(`Fetching videos for each channel`)
    const channelVideos = await Promise.all(
        channelSecIds.map(async (secId) => {
            logger.debug(`Fetching videos for channel with secId: ${secId}`)
            const videos = await vendors.rapidApi.tiktokApi23.getChannelVideos(secId)
            logger.debug(
                `Finished fetching videos for channel with secId: ${secId}, video count: ${videos.data?.itemList?.length}`,
            )
            return videos
        }),
    )
    logger.debug(`Finished fetching videos, channelCount: ${channelVideos.length}`)

    // * Filter videos by date
    const maxDateAgo = new Date(dateFrom)
    logger.debug(`Filtering videos by date, dateFrom: ${dateFrom}, maxDateAgo: ${maxDateAgo}`)

    // Flatten all videos from all channels first
    const allVideos = channelVideos.flatMap((channel) => {
        return channel.data?.itemList || []
    })
    logger.debug(`Flattened all videos from all channels, total count: ${allVideos.length}`)

    // Filter individual videos by date
    const recentVideos = allVideos.filter((video) => {
        const timestampInSeconds = video.createTime
        if (!timestampInSeconds) {
            return false
        }
        // Convert seconds to milliseconds for JavaScript Date
        const timestampInMilliseconds = timestampInSeconds * 1000
        const videoDate = new Date(timestampInMilliseconds)
        return videoDate >= maxDateAgo
    })

    logger.debug(
        `Filtered videos by date, totalVideos: ${allVideos.length}, filteredVideos: ${recentVideos.length}`,
    )

    if (recentVideos.length === 0) {
        const message = 'No videos found after date filtering'
        logger.debug(message)
        return new NoResultsFound(message)
    }

    // * Extract all video IDs from the filtered videos
    logger.debug(`Extracting video IDs`)
    const videoIds = recentVideos
        .map((video) => {
            return video.video?.id
                ? {
                      id: video.video.id,
                      channelName: video.author?.uniqueId,
                  }
                : null
        })
        .filter(Boolean) as Array<{ id: string; channelName?: string }>
    logger.debug(`Extracted non undefined video IDs, count: ${videoIds.length}`)

    if (videoIds.length === 0) {
        const message = 'No valid video IDs found'
        logger.debug(message)
        return new NoResultsFound(message)
    }

    // * Filter videos by total count
    logger.debug(`Filtering video IDs by total count: ${totalVideosCount}`)
    const filteredVideoIds = videoIds.slice(0, totalVideosCount)
    logger.debug(
        `Filtered video IDs by total count, beforeCount: ${videoIds.length}, afterCount: ${filteredVideoIds.length}`,
    )

    // * Get transcript for each video
    logger.debug(`Fetching transcripts for videos`)
    const transcripts = await Promise.all(
        filteredVideoIds.map(async (videoData) => {
            // ! Clear all transcript cache keys if needed
            // logger.debug('Clearing all transcript cache keys')
            // const pattern = 'linkedin-newsletter:transcript:*'
            // const keys = await redisClient.keys(pattern)
            // if (keys.length > 0) {
            //     const result = await redisClient.del(...keys)
            //     logger.debug(`Cleared ${result} transcript cache keys`)
            // } else {
            //     logger.debug('No transcript cache keys found to clear')
            // }

            const { id: videoId, channelName } = videoData
            const cacheKey = `linkedin-newsletter:transcript:${videoId}`
            const cachedTranscript = await redisClient.get(cacheKey)

            if (cachedTranscript) {
                logger.debug(`Retrieved transcript from cache for videoId: ${videoId}`)
                return { transcript: cachedTranscript, videoId }
            }

            if (!channelName) {
                logger.warn(
                    `No channel name found for videoId: ${videoId}, skipping transcript fetch`,
                )
                return { transcript: '', videoId }
            }

            const transcript = await vendors.rapidApi.tiktokVideoTranscript.transcribeTikTokVideo({
                videoUrl: `https://www.tiktok.com/@${channelName}/video/${videoId}`,
            })
            logger.debug(`Transcript for videoId: ${videoId}, transcript: ${transcript}`)

            await redisClient.set(cacheKey, transcript)

            return { transcript, videoId }
        }),
    )
    logger.debug(`Finished fetching transcripts, count: ${transcripts.length}`)

    const validTranscripts = transcripts
        .filter((item) => {
            return item.transcript
        })
        .map((item) => {
            return item.transcript
        })

    if (validTranscripts.length === 0) {
        const message = 'No transcripts found'
        logger.debug(message)
        return new NoResultsFound(message)
    }

    // * Filter videos by topic
    logger.debug(`Filtering videos by topics: ${JSON.stringify(topics)}`)
    const topicFilteredTranscripts = await Promise.all(
        transcripts.map(async ({ transcript, videoId }) => {
            if (!transcript) {
                return null
            }

            logger.debug(
                `Checking if video matches topics, videoId: ${videoId}, topics: ${JSON.stringify(topics)}`,
            )

            const containsTopic = await checkTranscriptForTopics(transcript, topics, videoId)

            return containsTopic ? transcript : null
        }),
    )

    const filteredTranscripts = topicFilteredTranscripts.filter(
        (transcript): transcript is string => {
            return transcript !== null
        },
    )

    logger.debug(
        `Filtered videos by topics, beforeCount: ${transcripts.length}, afterCount: ${filteredTranscripts.length}`,
    )

    if (filteredTranscripts.length === 0) {
        const message = 'No transcripts found matching the topics'
        logger.debug(message)
        return new NoResultsFound(message)
    }

    const summary = await generateSummary({
        transcripts: filteredTranscripts,
        topics,
    })
    const metadata = await generateMetadataForSummary({ summary })

    const fullText = `${metadata}\n\n${summary}`

    const refinedSummary = await refineForLinkedIn({ summary: fullText })

    const finalSummary = utils.llm.replaceSymbols(refinedSummary)

    logger.debug(`Final summary generated: ${finalSummary}`)

    return finalSummary
}

async function checkTranscriptForTopics(transcript: string, topics: string[], videoId: string) {
    const response = await vendors.openai.fetchPromptResponseRateLimited<BooleanStructuredOutput>({
        userPrompt: `Check if the following transcript realistically contains any of these topics: ${topics.join(', ')}. 

Transcript:
${transcript}

Return a JSON with a single boolean field indicating if any topic is present.`,
        modelName: llmConfig.MODEL_NAME,
        temperature: 0,
        structuredOutputSchema: structuredOutputs.booleanStructuredOutput,
        callerFnName: 'filterVideosByTopic',
    })

    const containsTopic = response.response
    logger.debug(`Topic check result for videoId: ${videoId}, containsTopic: ${containsTopic}`)

    return containsTopic
}
