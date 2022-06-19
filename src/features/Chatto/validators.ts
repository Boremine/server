import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'

interface SendBody {
    message: string
}

export const sendMessage = (req: Request, res: Response, next: NextFunction) => {
    const body:SendBody = req.body

    if (!body.message) return next(HandleError.NotAcceptable('Message is required'))
    if (body.message.length > 300) return next(HandleError.NotAcceptable('Message must be less than 300 characteres long'))

    next()
}
