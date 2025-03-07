import { describe, expect, it } from 'vitest'
import { contentPriorities } from './generate-content-priorities.helper.js'

describe('contentPriorities', () => {
    it('should return empty string for empty topics array', () => {
        const result = contentPriorities([])
        expect(result).toBe('')
    })

    it('should return correct priorities for single topic', () => {
        const result = contentPriorities(['ai'])
        expect(result).toBe(
            '- AI advancements (model capabilities, adoption rates, performance metrics)\n',
        )
    })

    it('should return correct priorities for multiple topics', () => {
        const result = contentPriorities(['ai', 'healthcare'])
        expect(result).toBe(
            '- AI advancements (model capabilities, adoption rates, performance metrics)\n' +
                '- Healthcare innovations (clinical outcomes, treatment efficacy, regulatory approvals)\n',
        )
    })

    it('should ignore topics that do not match predefined priorities', () => {
        const result = contentPriorities(['ai', 'unknown-topic'])
        expect(result).toBe(
            '- AI advancements (model capabilities, adoption rates, performance metrics)\n',
        )
    })

    it('should handle all predefined topics', () => {
        const result = contentPriorities([
            'ai',
            'healthcare',
            'business (software related)',
            'consulting',
        ])
        expect(result).toBe(
            '- AI advancements (model capabilities, adoption rates, performance metrics)\n' +
                '- Healthcare innovations (clinical outcomes, treatment efficacy, regulatory approvals)\n' +
                '- Business strategy insights (market share changes, competitive positioning, ROI metrics)\n' +
                '- Consulting industry trends (methodologies, client demands, service offerings)\n',
        )
    })
})
