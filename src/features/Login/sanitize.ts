import { Request, Response, NextFunction } from 'express'

interface Login{
    email:string,
    password:string
}

export const loginTry = (req: Request, res: Response, next: NextFunction) => {
    const body:Login = req.body
    
    !body.email ? body.email = '':null
    !body.password ? body.password = '':null

    next()
}