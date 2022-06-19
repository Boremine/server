import { Request, Response, NextFunction } from 'express'

interface Body {
    message:string
}

export const sendMessage = (req: Request, res: Response, next: NextFunction) => {
    const body:Body = req.body

    body.message = body.message ? String(body.message) : ''

    next()
}
