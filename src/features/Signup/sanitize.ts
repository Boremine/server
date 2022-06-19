import { Request, Response, NextFunction } from 'express'

interface RequestBody {
    username: string,
    email: string,
    password: string,
}

export const signupRequest = (req: Request, res: Response, next: NextFunction) => {
    const body:RequestBody = req.body

    body.username = body.username ? String(body.username) : ''
    body.email = body.email ? String(body.email) : ''
    body.password = body.password ? String(body.password) : ''

    next()
}
