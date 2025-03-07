import { llmConfig } from '@vendors/openai/llm-config.js'
import { structuredOutputs } from '@vendors/openai/structured-outputs/structured-outputs.js'
import { vendors } from '@vendors/vendors.js'

export const generateAllOutputOnePrompt = async ({ transcripts }: { transcripts: string[] }) => {
    return await vendors.openai.fetchPromptResponseRateLimited<{
        summary: string
    }>({
        // 🔹Focus on business goals
        // Reference the source of the news in the summary whenever possible.
        userPrompt: `You're a graduate level journalist writing an article LinkedIn newsletter post.
Your main task is to write engaging content for given news transcripts. Focus on key insights, trends, numbers, statistics, facts, takeaways.

Include the following elements:
- A single-sentence short captivating summary that captures the essence of the content
- Key insights (in few words) formatted as bullet points
- An engaging hook/intro that would grab a reader's attention to read further
- Bullet point summary for each category of the news in few words

Do not include links.

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

Use these news transcripts for context:
${transcripts.join('\n\n')}`,
        modelName: llmConfig.MODEL_NAMES.gpt45Preview20250227,
        temperature: llmConfig.generation.TEMPERATURE,
        structuredOutputSchema: structuredOutputs.summary,
        callerFnName: 'generateAllOutputOnePrompt',
    })
}
