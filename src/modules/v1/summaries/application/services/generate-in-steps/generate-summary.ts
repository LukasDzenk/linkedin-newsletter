import { llmConfig } from '@vendors/openai/llm-config.js'
import { structuredOutputs } from '@vendors/openai/structured-outputs/structured-outputs.js'
import { vendors } from '@vendors/vendors.js'
import { contentPriorities } from './generate-content-priorities.helper.js'

export const generateSummary = async ({
    transcripts,
    topics,
}: {
    transcripts: string[]
    topics: string[]
}) => {
    const response = await vendors.openai.fetchPromptResponseRateLimited<{
        summary: string
    }>({
        userPrompt: `# Role and Goal
You are an expert journalist with graduate-level expertise in news analysis and synthesis.

# Task
Create concise, insightful summaries of news transcripts that highlight key information for busy professionals.
You specialize in topics: ${topics.join(', ')}.

# Output Format
- Organize content into clear categories with emoji headers (📌)
- Each category should contain 2-4 bullet points (1-2 sentences each)
- Focus on actionable insights, specific numbers, notable trends, and factual takeaways
- Use concise, engaging language with occasional punchy statements
- Maintain a professional but conversational tone
- NO links, citations, or introductory text

# Content Priorities
${contentPriorities(topics)}

# Example Output Format
📌 Macro Economic Outlook

- Fed officials are considering pausing QT as the US debt ceiling remains unresolved. 
- Fed minutes hint at caution - "inflation remains somewhat elevated" - while reserves dip below $6.8T. 
- With key US data like Q4 GDP incoming, markets are on edge for policy signals.

📌 Currency & Commodities

- The dollar index (DXY) bounced back last week after Trump's aggressive tariff threats.
- Gold, riding the uncertainty wave, shot past $2,800. 
- Turbulent times. Safe-haven assets are flashing red. Don't blink.

# Source Material
${transcripts.join('\n\n')}`,
        modelName: llmConfig.MODEL_NAMES.gpt45Preview20250227,
        temperature: llmConfig.generation.TEMPERATURE,
        structuredOutputSchema: structuredOutputs.summary,
        callerFnName: 'generateSummariesOnly',
    })

    return response.summary
}
