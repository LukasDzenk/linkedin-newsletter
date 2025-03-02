// import { libs } from '@root/libs/libs.js'
// import axios from 'axios'
// import chalk from 'chalk'

// /**
//  * Axios request interceptor which logs every request made by the server.
//  */
// export const logAxiosReqAndResToConsole = () => {
//     axios.interceptors.request.use(
//         (config) => {
//             // const ctx = context.getStore() as Ctx

//             console.log(
//                 `➡️  ${libs.utils.getPrettyDate()}:     ${config.method?.toUpperCase()} ${
//                     config.url
//                 }`
//             )
//             return config
//         },
//         (error) => {
//             console.log(
//                 `➡️  ${libs.utils.getPrettyDate()}: Request failed with error: ${error.message}`
//             )
//             return Promise.reject(error)
//         }
//     )

//     axios.interceptors.response.use(
//         (response) => {
//             let statusString = ''
//             if (response.status === 200) {
//                 statusString = chalk.green(response.status)
//             } else {
//                 statusString = chalk.red(response.status)
//             }

//             // const ctx = context.getStore() as Ctx

//             console.log(
//                 `⬅️  ${libs.utils.getPrettyDate()}: ${statusString} ${response.config.method?.toUpperCase()} ${
//                     response.config.url
//                 }`
//             )
//             return response
//         },
//         (error) => {
//             console.log(`⬅️  ${libs.utils.getPrettyDate()}: Response Error: ${error.message}`)
//             return Promise.reject(error)
//         }
//     )
// }
