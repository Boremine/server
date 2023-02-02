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
    access_token:string
}

export const loginGoogle = (req: Request, res: Response, next: NextFunction) => {
    const body:GoogleBody = req.body

    body.access_token = String(body.access_token)

    next()
}
