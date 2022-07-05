import { Request, Response, NextFunction } from 'express'

import User from '../../models/user'
import { HandleSuccess } from '../../responses/success/HandleSuccess'

export const accountInfo = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals

    const user = await User.findById(user_id).lean().populate('logs', 'browser ip device os platform version -_id').select('username email _id')

    HandleSuccess.Ok(res, { ...user })
}
