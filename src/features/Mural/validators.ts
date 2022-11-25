import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'
import { HandleError } from '../../responses/error/HandleError'

export const getMural = async (req: Request, res: Response, next: NextFunction) => {
    const { limit } = res.locals

    if (isNaN(limit)) return next(HandleError.BadRequest('Invalid limit'))

    next()
}

export const getOnePieceComments = async (req: Request, res: Response, next: NextFunction) => {
    const { limit, sort, type } = res.locals

    if (limit === 0) return next(HandleError.BadRequest('Invalid limit'))

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

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, comment } = res.locals

    const user = await User.findById(user_id)
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    if (!comment) return next(HandleError.NotAcceptable('Comment is required'))
    if (comment.length > 300) return next(HandleError.NotAcceptable('Comment must be less than 300 characters'))

    res.locals.usernameDisplay = user.usernameDisplay

    next()
}

export const markComment = async (req: Request, res: Response, next: NextFunction) => {
    const { mark, user_id } = res.locals

    const user = await User.findById(user_id)
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    if (!mark) return next(HandleError.NotAcceptable('Mark Not Acceptable'))

    next()
}
