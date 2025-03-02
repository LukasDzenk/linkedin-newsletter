// // Response object example:
// // {
// //     "id": "chatcmpl-123",
// //     "object": "chat.completion",
// //     "created": 1677652288,
// //     "model": "gpt-3.5-turbo-0125",
// //     "system_fingerprint": "fp_44709d6fcb",
// //     "choices": [{
// //       "index": 0,
// //       "message": {
// //         "role": "assistant",
// //         "content": "\n\nHello there, how may I assist you today?",
// //       },
// //       "logprobs": null,
// //       "finish_reason": "stop"
// //     }],
// //     "usage": {
// //       "prompt_tokens": 9,
// //       "completion_tokens": 12,
// //       "total_tokens": 21
// //     }
// //   }

// import { contentModule } from '@modules/v1/content/content.module.js'

// const logId = Math.random().toString(36).substring(2, 7)
// let totalCost = 0

// /**
//  * https://openai.com/api/pricing/
//  * Note: returns cost in dollars
//  */
// export const calculateLlmCostGivenUsage = ({
//     promptTokens,
//     completionTokens,
// }: {
//     promptTokens: number
//     completionTokens: number
// }) => {
//     // console.log(`📊 Prompt tokens: ${promptTokens}, Completion tokens: ${completionTokens}`)

//     const INPUT_COST_PER_MILLION_TOKENS = 2.5
//     const OUTPUT_COST_PER_MILLION_TOKENS = 10

//     const inputCostPerToken = INPUT_COST_PER_MILLION_TOKENS / 1_000_000
//     const outputCostPerToken = OUTPUT_COST_PER_MILLION_TOKENS / 1_000_000

//     const inputCost = promptTokens * inputCostPerToken
//     const outputCost = completionTokens * outputCostPerToken

//     const PRECISION = 7
//     const roundedInputCost = Number(inputCost.toFixed(PRECISION))
//     const roundedOutputCost = Number(outputCost.toFixed(PRECISION))

//     const inputAndOutputCost = roundedInputCost + roundedOutputCost

//     totalCost += inputAndOutputCost

//     const message = `[logId:${logId}] 💸 promptTokens: ${promptTokens} , completionTokens: ${completionTokens} . Total cost for all requests: ${totalCost}, Cost per request: ${inputAndOutputCost} $ (input cost: ${roundedInputCost} $, output cost: ${roundedOutputCost} $)\n`

//     const currentPath = contentModule.utils.getCurrentDirectoryPath({
//         importMetaUrl: import.meta.url,
//         // fileNameWithExtension: `llm-cost-${coreApiModule.utils.getPrettyDate({
//         // 	includeTime: true,
//         // 	formatAsSlug: true
//         // })}.gitignore.txt`
//         fileNameWithExtension: `llm-cost.gitignore.txt`,
//     })
//     contentModule.utils.appendStringToFile({
//         path: currentPath,
//         string: message,
//     })
// }
