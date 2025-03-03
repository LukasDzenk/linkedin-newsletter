export function calculateSentenceCount(text: string): number {
    // Remove extra whitespace and trim
    const cleanText = text.trim().replace(/\s+/g, ' ')

    // Split on sentence endings (., !, ?) followed by a space or end of string
    // Handle edge cases like abbreviations (e.g., "U.S.A.") and ellipses
    const sentences = cleanText.split(/[.!?]+(?=\s|$)/).filter((sentence) =>
        // Filter out empty strings and strings with only whitespace
        {
            return sentence.trim().length > 0
        },
    )

    return sentences.length
}
