import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'
import { newAuthentication } from '../../utils/Authentication/function/newAuthentication'
import { addLog } from '../../utils/Logs/functions/addLog'

export const loginTry = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, log_id } = res.locals

    newAuthentication({ user_id, log_id }, res)
}

export const loginVerified = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals.data

    const addLogRes = await addLog(req, user_id, next, 'sendEmailDetection')
    if (!addLogRes) return next(HandleError.BadRequest('There was a problem authenticating'))

    const newAuth = {
        user_id,
        log_id: addLogRes
    }

    newAuthentication(newAuth, res)
}
