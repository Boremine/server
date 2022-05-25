import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'


interface Body {
    message:string
}

export const sendMessage = (req: Request, res: Response, next: NextFunction) => {
    const body:Body = req.body

    if(!body.message) next(HandleError.NotAcceptable('Message is required'))
    

    next()
}