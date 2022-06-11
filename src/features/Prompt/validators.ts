import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'

import { HandleError } from '../../responses/error/HandleError'



export const postPrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals

    const user = await User.findById(user_id).populate('prompt_id')
    if(!user) return next(HandleError.BadRequest("User doesn't exist"))
    // if(user.prompt_id) return next(HandleError.NotAcceptable("Prompt Already in line"))


    next()

}

interface VoteBody {
    option:string
}

export const votePrompt = async (req: Request, res: Response, next: NextFunction) => {
    const body:VoteBody = req.body

    if(body.option == 'drop') res.locals.option = 'drop'
    else if(body.option == 'pop') res.locals.option = 'pop'


    next()

}