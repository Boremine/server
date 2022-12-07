import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'

interface SendBody {
    message: string
}

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const body: SendBody = req.body

    if (!body.message) return next(HandleError.NotAcceptable('Message is required'))
    if (body.message.length > 300) return next(HandleError.NotAcceptable('Message must be less than 300 characteres long'))

    next()
}

interface SendBodyNotAuthenticated {
    message: string
    nact: number
    naid: string
}

export const sendMessageNotAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const body: SendBodyNotAuthenticated = req.body

    if (!body.naid) return next(HandleError.NotAcceptable('naid is required'))
    if (body.naid.length > 20) return next(HandleError.NotAcceptable('naid max characters 20'))

    if (isNaN(body.nact)) return next(HandleError.NotAcceptable('nact is required'))
    if (body.nact > 5 || body.nact < 1) return next(HandleError.NotAcceptable('nact numbers between 1 and 5'))

    if (!body.message) return next(HandleError.NotAcceptable('Message is required'))
    if (body.message.length > 300) return next(HandleError.NotAcceptable('Message must be less than 300 characteres long'))

    next()
}
