import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'

export const markPrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { mark } = res.locals

    if (!mark) return next(HandleError.NotAcceptable('Mark Not Acceptable'))

    next()
}
