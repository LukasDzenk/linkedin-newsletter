import { llmConfig } from '@vendors/openai/llm-config.js'
import { structuredOutputs } from '@vendors/openai/structured-outputs/structured-outputs.js'
import { vendors } from '@vendors/vendors.js'

export const refineForLinkedIn = async ({ summary }: { summary: string }) => {
    const result = await vendors.openai.fetchPromptResponseRateLimited<{
        summary: string
    }>({
        userPrompt: `You are a LinkedIn content optimization specialist. Your task is to refine the provided content to ensure it's perfectly formatted for LinkedIn and maximizes engagement.

# Formatting Requirements
- Keep the total character count under 3,000 (LinkedIn's limit)
- Use proper spacing between sections
- Ensure bullet points and emojis display correctly
- Break up long paragraphs into shorter, more digestible ones
- Use line breaks strategically to improve readability

# Content Optimization
- Maintain a professional yet conversational tone
- Ensure the headline is attention-grabbing
- Keep key takeaways concise and impactful
- Make sure the hook creates curiosity
- Verify all bullet points are formatted consistently
- Include 1-3 relevant emojis where appropriate
- End with a clear call-to-action

# Example Format
"""
[Compelling headline]

→ [Key takeaway 1]
→ [Key takeaway 2]
→ [Key takeaway 3]

[Engaging hook] 👇

📌 [Category 1]
- [Insight 1]
- [Insight 2]

📌 [Category 2]
- [Insight 1]
- [Insight 2]

[Brief conclusion with call-to-action]
"""

Please refine the following content to meet LinkedIn's best practices while preserving the original message and insights:
${summary}`,
        modelName: llmConfig.MODEL_NAMES.gpt45Preview20250227,
        temperature: 0.5,
        structuredOutputSchema: structuredOutputs.summary,
        callerFnName: 'refineForLinkedIn',
    })

    return result.summary
}
