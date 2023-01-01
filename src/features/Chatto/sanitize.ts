import { Request, Response, NextFunction } from 'express'

interface SendMessageBody {
    message:string
}

export const sendMessage = (req: Request, res: Response, next: NextFunction) => {
    const body:SendMessageBody = req.body

    body.message = String(body.message).trim()

    next()
}

interface sendMessageBodyNotAuthenticated {
    message:string
    nact: number
    naid: string
}

export const sendMessageNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const body:sendMessageBodyNotAuthenticated = req.body

    body.message = String(body.message).trim()
    body.nact = Number(body.nact)
    body.naid = String(body.naid)

    next()
}
