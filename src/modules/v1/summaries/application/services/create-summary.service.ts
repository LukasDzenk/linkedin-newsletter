import { redisClient } from '@configs/databases/redis/redis.js'
import { logger } from '@logger/pino.logger.js'
import { utils } from '@utils/utils.js'
import { llmConfig } from '@vendors/openai/llm-config.js'
import { BooleanStructuredOutput } from '@vendors/openai/structured-outputs/boolean.structured-outputs.js'
import { structuredOutputs } from '@vendors/openai/structured-outputs/structured-outputs.js'
import { vendors } from '@vendors/vendors.js'
import { NoResultsFound } from '../../domain/errors/no-results-found.error.js'

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

    const filteredTranscripts = topicFilteredTranscripts.filter(Boolean)
    logger.debug(
        `Filtered videos by topics, beforeCount: ${transcripts.length}, afterCount: ${filteredTranscripts.length}`,
    )

    if (filteredTranscripts.length === 0) {
        const message = 'No transcripts found matching the topics'
        logger.debug(message)
        return new NoResultsFound(message)
    }

    //     // * Get summary for each transcript
    //     logger.debug('Generating summaries for transcripts')
    //     const summaries = await Promise.all(
    //         filteredTranscripts.map(async (transcript) => {
    //             const response = await vendors.openai.fetchPromptResponseRateLimited<{
    //                 summary: string
    //             }>({
    //                 userPrompt: `You're a graduate level journalist writing a article LinkedIn newsletter post. Write engaging and informative summaries for each topic. Focus on key insights, trends, numbers, statistics, facts, takeaways.

    // Transcript:
    // ${transcript}`,
    //                 modelName: llmConfig.MODEL_NAME,
    //                 temperature: 0.3,
    //                 structuredOutputSchema: structuredOutputs.summary,
    //                 callerFnName: 'generateTranscriptSummary',
    //             })

    //             return response.summary
    //         }),
    //     )
    //     logger.debug('Finished generating summaries', { count: summaries.length })

    // * Combine all summaries into one
    logger.debug(
        `Generating final combined summary using this context: ${filteredTranscripts.join('\n\n')}`,
    )

    const combinedSummary = await vendors.openai.fetchPromptResponseRateLimited<{
        summary: string
    }>({
        // 🔹Focus on business goals
        // Reference the source of the news in the summary whenever possible.
        userPrompt: `You're a graduate level journalist writing an article LinkedIn newsletter post.
Your man task is to write engaging content for given news transcripts. Focus on key insights, trends, numbers, statistics, facts, takeaways.

Include the following elements:
- A single-sentence short captivating summary that captures the essence of the content
- Key insights (in few words) formatted as bullet points
- An engaging hook/intro that would grab a reader's attention to read further

Do not include links.

---

Great output example:

<example-summary>
Each week in crypto just seems to get more action packed.

→ $2B SOL unlock incoming.
→ Ethereum rollback talks.
→ Signs the Fed might halt QT.

Here's what you missed this week 👇

📌 Macro mayhem

- Fed officials are considering pausing QT as the US debt ceiling remains unresolved. 
- Fed minutes hint at caution - "inflation remains somewhat elevated" - while reserves dip below $6.8T. 
- With key US data like Q4 GDP incoming, markets are on edge for policy signals.

📌 Dollar & Gold

- The dollar index (DXY) bounced back last week after Trump's aggressive tariff threats.
- Gold, riding the uncertainty wave, shot past $2,800. 
- Turbulent times. Safe-haven assets are flashing red. Don't blink.
</example-summary>

---

Use these news transcripts for context:
${filteredTranscripts.join('\n\n')}`,
        modelName: llmConfig.MODEL_NAMES.gpt45Preview20250227,
        temperature: llmConfig.generation.TEMPERATURE,
        structuredOutputSchema: structuredOutputs.summary,
        callerFnName: 'generateCombinedSummary',
    })

    logger.debug('Generating one-sentence summary, key insights, and hook')

    //     const enhancedSummary = await vendors.openai.fetchPromptResponseRateLimited<Data>({
    //         userPrompt: `You're a graduate level journalist writing an article LinkedIn newsletter post.
    // Write the following elements:
    // - A single-sentence short captivating summary that captures the essence of the content
    // - Three key insights (1-sentence, very short) formatted as bullet points
    // - An engaging hook/intro sentence that would grab a reader's attention to read further

    // For example:
    // """
    // Each week in crypto just seems to get more action packed.

    // → $2B SOL unlock incoming.
    // → Ethereum rollback talks.
    // → Signs the Fed might halt QT.

    // Here's what you missed this week 👇
    // """

    // Only allowed formatting:
    // Bullet points:
    // - Item 1
    // Numbered lists:
    // 1. Item 1
    // Emojis

    // Return only the text. No need for explanation or agreement to do the task.
    // You must respond with just the final text which is ready to be published.

    // Text to use:
    // ${combinedSummary.summary}`,
    //         modelName: llmConfig.MODEL_NAME,
    //         temperature: llmConfig.generation.TEMPERATURE,
    //         structuredOutputSchema: structuredOutputs.data,
    //         callerFnName: 'generateEnhancedSummaryElements',
    //     })

    // const finalSummary = utils.llm.replaceSymbols(
    //     `${enhancedSummary.data}\n\n${combinedSummary.summary}`,
    // )

    const finalSummary = utils.llm.replaceSymbols(`${combinedSummary.summary}`)

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
