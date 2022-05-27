import { Request, Response, NextFunction } from 'express'


export const verificationValidate = (req: Request, res: Response, next: NextFunction) => {

    req.params.path = String(req.params.path)
    
    next()
}





interface Confirm{
    code:string
}

export const verificationConfirm = (req: Request, res: Response, next: NextFunction) => {
    let body:Confirm = req.body

    !body.code ? body.code = '':null
    req.params.path = String(req.params.path)
    
    next()
}