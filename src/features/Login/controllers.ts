import { Request, Response, NextFunction } from 'express'
import { newAuthentication } from '../../utils/Authentication/function/newAuthentication'
import { addLog } from '../../utils/Logs/functions/addLog'

export const loginTry = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, log_id } = res.locals

    newAuthentication({ user_id, log_id }, res)
}

export const loginVerified = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals.data

    const addLogRes = await addLog(req, user_id, next, 'login')

    const newAuth = {
        user_id,
        log_id: addLogRes
    }

    newAuthentication(newAuth, res)
}
