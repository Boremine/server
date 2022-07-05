import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'
import { HandleError } from '../../responses/error/HandleError'

import { HandleSuccess } from '../../responses/success/HandleSuccess'

export const getAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals

    const user = await User.findById(user_id).lean().populate({
        path: 'logs',
        select: 'browser ip device os platform version -_id'
    }).select('username email alreadyVoted -_id')

    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    HandleSuccess.Ok(res, { ...user, auth: true })
}
