export const llmConfig = {
    GENERATE_DESCRIPTION: true,
    GENERATE_PROS_AND_CONS: true,

    // MODEL_NAME: 'gpt-4o',
    // MODEL_NAME: 'gpt-4o-mini',
    // MODEL_NAME: 'gpt-4o-2024-08-06',
    MODEL_NAME: 'gpt-4o-2024-11-20',
    // MODEL_NAME: 'deepseek-chat',
    // MODEL_NAME: 'gemini-1.5-flash',
    // MODEL_NAME: 'gemini-2.0-flash-exp',
    MODEL_NAMES: {
        gpt4o: 'gpt-4o',
        gpt4oMini: 'gpt-4o-mini',
        gpt4o20240806: 'gpt-4o-2024-08-06',
        gpt4o20241120: 'gpt-4o-2024-11-20',
        gpt45Preview20250227: 'gpt-4.5-preview-2025-02-27',
        gemini15Pro: 'gemini-1.5-pro',
        gemini15Flash: 'gemini-1.5-flash',
        gemini20FlashExp: 'gemini-2.0-flash-exp',
    },

    generation: {
        TEMPERATURE: 0.7,
    },
    translations: {
        TEMPERATURE: 0.4,
    },
    refining: {
        TEMPERATURE: 0.7,
    },
    evaluator: {
        TEMPERATURE: 0,
    },
} as const
