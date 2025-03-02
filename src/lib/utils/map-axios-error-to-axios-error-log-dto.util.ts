// import { AxiosResponse } from 'axios'

// export const mapAxiosErrorResponseToAxiosErrorLogWriteRecord = ({
//     axiosErrorResponse,
//     functionName,
// }: {
//     axiosErrorResponse: AxiosResponse
//     functionName: string
// }) => {
//     const log = {
//         message: `Error logged by ${functionName}`,
//         meta: {
//             request: {
//                 url: axiosErrorResponse.request.res.responseUrl,
//                 baseURL: axiosErrorResponse.request.baseURL,
//                 method: axiosErrorResponse.request.method,
//                 headers: axiosErrorResponse.request._header,
//                 params: axiosErrorResponse.request.params,
//                 timeout: axiosErrorResponse.request.timeout,
//                 data: axiosErrorResponse.request._data,
//             },
//             response: {
//                 status: axiosErrorResponse.status,
//                 statusText: axiosErrorResponse.statusText,
//                 headers: axiosErrorResponse.headers,
//                 config: axiosErrorResponse.config,
//                 data: axiosErrorResponse.data,
//             },
//         },
//     }

//     return log
// }
