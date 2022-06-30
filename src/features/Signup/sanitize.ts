import { Request, Response, NextFunction } from 'express'

interface RequestBody {
    username: string
    usernameDisplay: string
    email: string
    password: string
    passwordConfirm: string
}

export const signupRequest = (req: Request, res: Response, next: NextFunction) => {
    const body: RequestBody = req.body

    body.username = body.username ? String(body.username).trim() : ''
    body.email = body.email ? String(body.email).toLocaleLowerCase().trim() : ''
    body.password = body.password ? String(body.password) : ''
    body.passwordConfirm = body.passwordConfirm ? String(body.passwordConfirm) : ''

    next()
}
