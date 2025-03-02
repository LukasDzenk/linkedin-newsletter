// import crypto from 'crypto'
// import { NextFunction, Request, Response } from 'express'
// import { ReasonPhrases, StatusCodes } from 'http-status-codes'
// import { ZodError } from 'zod'
// import { Controller } from '../../types/Controller.type.js'
// import { HttpRequest } from '../../types/HttpRequest.js'
// import { HttpResponse } from '../../types/HttpResponse.js'

// export const expressCallbackWrapper = (controller: Controller<HttpResponse<unknown>>) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         // Random UID for each request for logging/debugging purposes
//         const correlationId = crypto.randomUUID()

//         const httpRequest: HttpRequest = {
//             body: req.body,
//             query: req.query,
//             params: req.params,
//             ip: req.ip,
//             method: req.method,
//             path: req.path,
//             headers: {
//                 correlationId,
//                 'Content-Type': req.get('Content-Type') ?? '',
//                 Referer: req.get('Referer') ?? '',
//                 'User-Agent': req.get('User-Agent') ?? '',
//             },
//         }

//         res.set({ correlationId })

//         try {
//             const httpResponse = await controller({ httpRequest })

//             if (httpResponse.headers) {
//                 res.set(httpResponse.headers)
//             }

//             res.status(httpResponse.statusCode).send(httpResponse.body)
//         } catch (error) {
//             if (error instanceof ZodError) {
//                 return res.status(StatusCodes.BAD_REQUEST).send({
//                     error: ReasonPhrases.BAD_REQUEST,
//                     message: (error as ZodError).issues
//                         .map((messages) => {
//                             const paths = messages.path.join(', ')
//                             const pathsFormattedText = paths ? `${paths}: ` : ''
//                             return `${pathsFormattedText}${messages.message}`
//                         })
//                         .join('; '),
//                 })
//             }

//             next(error)
//         }
//     }
// }
