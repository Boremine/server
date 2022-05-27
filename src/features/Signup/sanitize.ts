import { Request, Response, NextFunction } from 'express'


interface Signup {
    username: string,
    email: string,
    password: string,
}

export const signupRequest = (req: Request, res: Response, next: NextFunction) => {
    const body: Signup = req.body

    !body.username ? body.username = '' : null
    !body.email ? body.email = '' : null
    !body.password ? body.password = '' : null
    

    next()
}

