import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'

import { HandleError } from '../../responses/error/HandleError'
import { checkIfFirstFive } from '../../utils/Prompts/functions/checkIfFirstFive'
import { state } from './controllers'

interface PostBody {
    title: string
    text: string
}

export const postPrompt = async (req: Request, res: Response, next: NextFunction) => {
    const body: PostBody = req.body
    const { user_id } = res.locals

    const user = await User.findById(user_id).populate('prompt_id')
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    // if (user.prompt_id) return next(HandleError.NotAcceptable('Prompt Already in line'))
     // NOTAUTHENTICATED REQUIRED

    if (!body.title) return next(HandleError.NotAcceptable('Title is required'))

    if (body.title.length > 500) return next(HandleError.NotAcceptable('Title must be less than 500 characteres long'))
    if (body.text.length > 5000) return next(HandleError.NotAcceptable('Text must be less than 5000 characteres long'))

    next()
}

interface PostBodyNotAuthenticated {
    title: string
    text: string
    naid:string
}

export const postPromptNotAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const body: PostBodyNotAuthenticated = req.body

    if (!body.naid) return next(HandleError.NotAcceptable('naid is required'))
    if (body.naid.length > 20) return next(HandleError.NotAcceptable('naid max characters 20'))

    if (!body.title) return next(HandleError.NotAcceptable('Title is required'))

    if (body.title.length > 500) return next(HandleError.NotAcceptable('Title must be less than 500 characteres long'))
    if (body.text.length > 5000) return next(HandleError.NotAcceptable('Text must be less than 5000 characteres long'))

    next()
}

interface VoteBody {
    option: string
}

export const votePrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals
    const body: VoteBody = req.body

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

interface UpdateBody {
    title: string
    text: string
}

export const updatePrompt = async (req: Request, res: Response, next: NextFunction) => {
    const body: UpdateBody = req.body
    const { user_id } = res.locals

    const user = await User.findById(user_id).populate('prompt_id')
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))
    if (!user.prompt_id) return next(HandleError.NotAcceptable('No prompt in line'))

    const promptInFirstFive = await checkIfFirstFive(user.prompt_id._id)
    if (promptInFirstFive) return next(HandleError.NotAcceptable('Prompt is in first five'))

    if (!body.title) return next(HandleError.NotAcceptable('Title is required'))

    if (body.title.length > 500) return next(HandleError.NotAcceptable('Title must be less than 500 characteres long'))
    if (body.text.length > 5000) return next(HandleError.NotAcceptable('Text must be less than 5000 characteres long'))

    res.locals.prompt_id = user.prompt_id._id

    next()
}

export const deletePrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals

    const user = await User.findById(user_id).populate('prompt_id')
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))
    if (!user.prompt_id) return next(HandleError.NotAcceptable('No prompt in line'))

    const promptInFirstFive = await checkIfFirstFive(user.prompt_id._id)
    if (promptInFirstFive) return next(HandleError.NotAcceptable('Prompt is in first five'))

    res.locals.prompt_id = user.prompt_id._id

    next()
}
