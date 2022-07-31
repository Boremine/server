import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'
import { HandleError } from '../../responses/error/HandleError'

export const getOnePieceComments = async (req: Request, res: Response, next: NextFunction) => {
    const { sort, type } = req.query

    if (sort === 'new') res.locals.sort = 'new'
    else res.locals.sort = 'top'

    if (type === 'comments') res.locals.type = 'comments'
    else if (type === 'chatto') res.locals.type = 'chatto'
    else res.locals.type = 'all'

    next()
}

export const markPiece = async (req: Request, res: Response, next: NextFunction) => {
    const { mark, user_id } = res.locals

    const user = await User.findById(user_id)
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    if (!mark) return next(HandleError.NotAcceptable('Mark Not Acceptable'))

    next()
}

interface addComentBody {
    comment: string
}

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals
    const body: addComentBody = req.body

    const user = await User.findById(user_id)
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    if (!body.comment) return next(HandleError.NotAcceptable('Comment is required'))
    if (body.comment.length > 300) return next(HandleError.NotAcceptable('Comment must be less than 300 characters'))

    next()
}

export const markComment = async (req: Request, res: Response, next: NextFunction) => {
    const { mark, user_id } = res.locals

    const user = await User.findById(user_id)
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    if (!mark) return next(HandleError.NotAcceptable('Mark Not Acceptable'))

    next()
}
