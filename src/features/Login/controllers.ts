import { Request, Response, NextFunction } from 'express'
import { newAuthentication } from '../../utils/Authentication/function/newAuthentication'


interface Locals{
    user_id:string,
    username:string,
    log_id:string
}

export const loginTry = async (req: Request, res: Response, next: NextFunction) => {
    const {user_id, username, log_id} = res.locals
    

    newAuthentication({user_id, username, log_id}, res)
}




