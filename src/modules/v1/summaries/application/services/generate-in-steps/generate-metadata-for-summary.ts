import { llmConfig } from '@vendors/openai/llm-config.js'
import { structuredOutputs } from '@vendors/openai/structured-outputs/structured-outputs.js'
import { vendors } from '@vendors/vendors.js'

interface Data {
    data: string
}

export const generateMetadataForSummary = async ({ summary }: { summary: string }) => {
    const result = await vendors.openai.fetchPromptResponseRateLimited<Data>({
        userPrompt: `# Role and Goal
You are an expert content strategist specializing in creating high-engagement LinkedIn newsletter headers that drive clicks and shares.

# Task
Create a compelling, professional newsletter header for the provided content summary that will maximize reader engagement.

# Required Elements
1. A concise, attention-grabbing headline (max 10 words) that captures the essence of the content
2. Three key takeaways (5-7 words each) formatted as arrow bullet points (→)
3. A strong hook sentence that creates curiosity and encourages readers to continue

# Style Guidelines
- Use a professional yet conversational tone
- Incorporate relevant emojis strategically (1-3 total)
- Ensure the content feels timely and valuable to busy professionals
- End with a clear call-to-action phrase

# Example Format
"""
[Headline: Concise and compelling statement]

→ [Key takeaway 1 with specific insight]
→ [Key takeaway 2 with specific insight]
→ [Key takeaway 3 with specific insight]

[Hook sentence that creates curiosity] 👇
"""

# Formatting Rules
- Only use bullet points (→), numbered lists (1.), or emojis for formatting
- Keep the entire header under 75 words
- Ensure each component is separated by appropriate spacing

Return only the final, publication-ready text without explanations or meta-commentary.

# Content to Summarize
${summary}`,
        modelName: llmConfig.MODEL_NAMES.gpt45Preview20250227,
        temperature: 0.7,
        structuredOutputSchema: structuredOutputs.data,
        callerFnName: 'generateEnhancedSummaryElements',
    })

    return result.data
}
