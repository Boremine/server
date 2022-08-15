import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'

import { HandleError } from '../../responses/error/HandleError'

import { HandleSuccess } from '../../responses/success/HandleSuccess'
import { checkIfFirstFive } from '../../utils/Prompts/functions/checkIfFirstFive'

export const getAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals

    const user = await User.findById(user_id).lean().populate([{
        path: 'logs',
        select: 'browser ip device os location machine _id'
    }, {
        path: 'prompt_id',
        select: '_id title text'
    }
    ]).select('usernameDisplay email alreadyVoted lastUsernameUpdate prompt_id _id')

    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    if (user.prompt_id) {
        user.prompt_id.promptInFirstFive = await checkIfFirstFive(user.prompt_id._id)
    }

    HandleSuccess.Ok(res, { ...user, auth: true })
}
