import { Request, Response, NextFunction } from 'express'

interface SendMessageBody {
    message:string
}

export const sendMessage = (req: Request, res: Response, next: NextFunction) => {
    const body:SendMessageBody = req.body

    body.message = String(body.message).trim()

    next()
}
