import { llmConfig } from '@vendors/openai/llm-config.js'
import { structuredOutputs } from '@vendors/openai/structured-outputs/structured-outputs.js'
import { vendors } from '@vendors/vendors.js'

export const generateSummaryForEachTranscript = async ({
    transcripts,
}: {
    transcripts: string[]
}) => {
    return await Promise.all(
        transcripts.map(async (transcript) => {
            const response = await vendors.openai.fetchPromptResponseRateLimited<{
                summary: string
            }>({
                userPrompt: `You're a graduate level journalist writing a article LinkedIn newsletter post.
Write engaging and informative summaries for each topic.
Focus on key insights, trends, numbers, statistics, facts, takeaways.

Transcript:
${transcript}`,
                modelName: llmConfig.MODEL_NAME,
                temperature: 0.3,
                structuredOutputSchema: structuredOutputs.summary,
                callerFnName: 'generateTranscriptSummary',
            })

            return response.summary
        }),
    )
}
