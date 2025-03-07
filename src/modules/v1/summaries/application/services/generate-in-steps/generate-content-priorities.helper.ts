export const contentPriorities = (topics: string[]): string => {
    if (topics.length === 0) {
        return ''
    }

    const topicPriorities = [
        {
            topic: 'ai',
            priority: 'AI advancements (model capabilities, adoption rates, performance metrics)',
        },
        {
            topic: 'healthcare',
            priority:
                'Healthcare innovations (clinical outcomes, treatment efficacy, regulatory approvals)',
        },
        {
            topic: 'business (software related)',
            priority:
                'Business strategy insights (market share changes, competitive positioning, ROI metrics)',
        },
        {
            topic: 'consulting',
            priority:
                'Consulting industry trends (methodologies, client demands, service offerings)',
        },
    ]

    let dynamicPrompt = ''

    for (const topic of topics) {
        const matchedPriority = topicPriorities.find((t) => {
            return t.topic === topic
        })
        if (matchedPriority) {
            dynamicPrompt += `- ${matchedPriority.priority}\n`
        }
    }

    return dynamicPrompt
}
