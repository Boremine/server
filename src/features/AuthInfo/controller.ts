import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'
import { HandleError } from '../../responses/error/HandleError'

import { HandleSuccess } from '../../responses/success/HandleSuccess'

export const getAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, username } = res.locals

    const user = await User.findById(user_id).select('alreadyVoted')
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    HandleSuccess.Ok(res, { user_id, username, auth: true, alreadyVoted: user.alreadyVoted === 'false' ? false : user.alreadyVoted })
}
