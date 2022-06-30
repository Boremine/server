import { Request, Response, NextFunction } from 'express'

interface TryBody{
    email:string,
    password:string
}

export const loginTry = (req: Request, res: Response, next: NextFunction) => {
    const body:TryBody = req.body

    body.email = body.email ? String(body.email).toLowerCase().trim() : ''
    body.password = body.password ? String(body.password) : ''

    next()
}
