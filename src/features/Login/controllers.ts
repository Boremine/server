import { Request, Response, NextFunction } from 'express'
import { newAuthentication } from '../../utils/Authentication/function/newAuthentication'

export const loginTry = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, username, log_id } = res.locals

    newAuthentication({ user_id, username, log_id }, res)
}
