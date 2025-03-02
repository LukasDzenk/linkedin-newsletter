// import { config } from '@scripts/clients/novaturas/config.js'
// import { getContext } from '@utils/context.js'
// import { fileLogger } from '@utils/file-logger.js'
// import { configs } from '@configs/configs.js'
import Bottleneck from 'bottleneck'
import OpenAI from 'openai'

// import containsChinese from 'contains-chinese'

const MAX_CONCURRENT_REQUESTS = 20 // this doesn't matter, all that matters is the RPM
const MAX_REQUESTS_PER_MINUTE = 30 // gemini-1.5-flash: 15, gemini-2.0-flash-exp: 10
const MIN_TIME_BETWEEN_REQUESTS_IN_MS = (60 * 1000) / MAX_REQUESTS_PER_MINUTE

// const MAX_CHINESE_RETRIES = 3

// OpenAI limiter
const limiter = new Bottleneck({
    maxConcurrent: MAX_CONCURRENT_REQUESTS,
    minTime: MIN_TIME_BETWEEN_REQUESTS_IN_MS,
})

const KEY_COUNT = 2
const MAX_REQUESTS_PER_MINUTE_GEMINI = 9 // For gemini-2.0-flash
// const MAX_REQUESTS_PER_MINUTE_GEMINI = 999 // For gemini-1.5-pro
const MIN_TIME_BETWEEN_REQUESTS_IN_MS_GEMINI =
    (60 * 1000) / (MAX_REQUESTS_PER_MINUTE_GEMINI * KEY_COUNT)

// Gemini limiter with lower RPM
const geminiLimiter = new Bottleneck({
    maxConcurrent: MAX_CONCURRENT_REQUESTS,
    minTime: MIN_TIME_BETWEEN_REQUESTS_IN_MS_GEMINI,
})

let currentGeminiKeyIndex = 0
const getNextGeminiApiKey = () => {
    const keys = [process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2].filter(Boolean)
    if (keys.length === 0) {
        throw new Error('No Gemini API keys configured')
    }
    const key = keys[currentGeminiKeyIndex]
    currentGeminiKeyIndex = (currentGeminiKeyIndex + 1) % keys.length
    return key
}

// * Main config
// Note: change 'modelName' in fetchPromptResponse.vendor.ts
const buildMainConfig = () => {
    // const apiKey = config.MODEL_NAME === 'gemini-1.5-flash' ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY
    // if (configs.MODEL_NAME.includes('gemini')) {
    //     return {
    //         apiKey: process.env.GEMINI_API_KEY,
    //         baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    //     }
    // }
    // Default to OpenAI
    return {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: null,
    }
}
const builtConfig = buildMainConfig()

// * Main client
// Docs: https://platform.openai.com/docs/api-reference/chat/create
export const openAi = new OpenAI({
    maxRetries: 2, // default is 2
    timeout: 90 * 1_000, // in MS (default results in 10 minutes)
    apiKey: builtConfig.apiKey,
    ...(builtConfig.baseURL ? { baseURL: builtConfig.baseURL } : {}),
})

// 2 reqs needed per hotel, so 5 hotels per minute.
const createGeminiClient = () => {
    return new OpenAI({
        maxRetries: 2, // default is 2
        timeout: 90 * 1_000, // in MS (default results in 10 minutes)
        apiKey: getNextGeminiApiKey(),
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    })
}

type FetchPromptResponseOptions = {
    userPrompt: string
    modelName: string
    temperature?: number
    frequencyPenalty?: number
    structuredOutputSchema: unknown
    callerFnName: string
}

export const fetchPromptResponseRateLimited = <T>(
    options: FetchPromptResponseOptions,
): Promise<T> => {
    const isGemini = options.modelName.includes('gemini')
    const appropriateLimiter = isGemini ? geminiLimiter : limiter

    return appropriateLimiter.schedule(() => {
        return fetchPromptResponse(options)
    })
}

// https://platform.openai.com/tokenizer
async function fetchPromptResponse<T>(
    options: FetchPromptResponseOptions,
    // retryCount = 0,
): Promise<T> {
    const {
        userPrompt,
        modelName,
        temperature,
        frequencyPenalty,
        structuredOutputSchema,
        // callerFnName,
    } = options

    const isGemini = modelName.includes('gemini')

    const client = isGemini ? createGeminiClient() : openAi
    const chatCompletion = await client.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: '', // systemPrompt
            },
            { role: 'user', content: userPrompt },
        ],
        model: modelName,
        // response_format: shouldFormatAsJson ? { type: 'json_object' } : undefined,
        // @ts-expect-error ! temporary
        response_format: structuredOutputSchema,
        stream: false,
        // seed: 1, // when regenerating data, seed should be random. Consistent seed is used for testing
        temperature: temperature ?? undefined,
        // max_tokens: 256,
        // top_p: 1,
        // ! If a value is provided, Gemini will return a 400 error
        frequency_penalty: isGemini ? undefined : (frequencyPenalty ?? 0),
        // presence_penalty: 0,
    })

    const responseBody = chatCompletion.choices[0]?.message.content
    if (!responseBody) {
        throw new Error('No response from OpenAI')
    }

    if (chatCompletion.choices[0]?.finish_reason !== 'stop') {
        throw new Error('Chat completion did not finish properly')
    }

    if (!chatCompletion.usage) {
        throw new Error('No usage data from OpenAI')
    }

    // Gemini

    // if (isGemini) {
    //     await utils.sleep(2000)
    // }

    // DeepSeek

    // const doesResponseContainChinese = containsChinese(responseBody)
    // if (doesResponseContainChinese) {
    //     if (retryCount >= MAX_CHINESE_RETRIES) {
    //         throw new Error(`Response contains Chinese after ${MAX_CHINESE_RETRIES} retries`)
    //     }
    //     console.log(`Response contains Chinese! Retry ${retryCount + 1}/${MAX_CHINESE_RETRIES}`)
    //     return fetchPromptResponse(options, retryCount + 1)
    // }

    // calculateLlmCostGivenUsage({
    //     promptTokens: chatCompletion.usage.prompt_tokens,
    //     completionTokens: chatCompletion.usage.completion_tokens,
    // })

    // const generationId = getContext().generationId
    // fileLogger({
    //     generationId,
    //     callerFnName,
    //     message: `LLM prompt: ${userPrompt}`,
    // })

    // fileLogger({
    //     generationId,
    //     callerFnName,
    //     message: `LLM response: ${responseBody}`,
    // })

    const responseJson = JSON.parse(responseBody)

    return responseJson
}
