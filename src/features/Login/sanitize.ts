import { Request, Response, NextFunction } from 'express'

interface TryBody{
    email:string,
    password:string
}

export const loginTry = (req: Request, res: Response, next: NextFunction) => {
    const body:TryBody = req.body

    body.email = String(body.email).toLowerCase().trim()
    body.password = String(body.password)

    next()
}

interface GoogleBody{
    code:string
}

export const loginGoogle = (req: Request, res: Response, next: NextFunction) => {
    const body:GoogleBody = req.body

    body.code = String(body.code)

    next()
}
