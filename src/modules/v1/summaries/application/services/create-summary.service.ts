import { vendors } from '@vendors/vendors.js'

export const createSummary = async ({ channelIds }: { channelIds: string[] }) => {
    // TODO: add redis cache. Merge cached data with new data. Save new data to redis.
    // * Get the secUid for each channel name
    const channelSecIds = await Promise.all(
        channelIds.map(vendors.rapidApi.tiktokApi23.getChannelSecId),
    )

    // * Get the videos for each channel
    const channelVideos = await Promise.all(
        channelSecIds.map(vendors.rapidApi.tiktokApi23.getChannelVideos),
    )
    // TODO: filter videos by date

    // TODO: filter videos by topic

    // * Get transcript for each video
    const transcripts = await Promise.all(
        channelVideos.map(vendors.rapidApi.tiktokApi23.getTranscript),
    )

    // * Get summary for each transcript
    const summaries = await Promise.all(transcripts.map(vendors.rapidApi.tiktokApi23.getSummary))

    // * Combine all summaries into one
    const combinedSummary = summaries.join('\n')

    return combinedSummary
}
