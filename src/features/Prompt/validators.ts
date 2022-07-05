import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'

import { HandleError } from '../../responses/error/HandleError'
import { state } from './controllers'

interface PostValidation {
    title?: string,
    text?: string,
}

interface PostBody {
    title: string
    text: string
}

export const postPrompt = async (req: Request, res: Response, next: NextFunction) => {
    const body:PostBody = req.body
    const { user_id } = res.locals

    const val:PostValidation = {}

    const user = await User.findById(user_id).populate('prompt_id')
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))
    // if(user.prompt_id) return next(HandleError.NotAcceptable("Prompt Already in line"))
    if (!body.title) val.title = 'Title is required'

    if (body.title.length > 500) val.title = 'Title must be less than 500 characteres long'
    if (body.text.length > 2000) val.title = 'Text must be less than 500 characteres long'

    if (Object.keys(val).length) return next(HandleError.NotAcceptable(val))

    next()
}

interface VoteBody {
    option: string
}

export const votePrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals
    const body:VoteBody = req.body

    const user = await User.findByIdAndUpdate(user_id).select('alreadyVoted')
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    if (state === 'wait' || state === 'end_fail' || state === 'end_pass') return next(HandleError.BadRequest('Prompt not ready'))
    if (user.alreadyVoted === 'pop' || user.alreadyVoted === 'drop') return next(HandleError.NotAcceptable('Already voted'))

    if (body.option === 'drop') {
        res.locals.option = 'drop'
        await user.updateOne({ alreadyVoted: 'drop' })
    } else if (body.option === 'pop') {
        res.locals.option = 'pop'
        await user.updateOne({ alreadyVoted: 'pop' })
    } else {
        return next(HandleError.BadRequest('Invalid option'))
    }

    next()
}
