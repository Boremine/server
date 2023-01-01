import { Request, Response, NextFunction } from 'express'

import User from '../../models/user'
import { HandleError } from '../../responses/error/HandleError'

export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals
    const { title, topic } = req.body

    const user = await User.findById(user_id)
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    if (!title) return next(HandleError.NotAcceptable('Title is required'))
    if (topic === 'nothing') return next(HandleError.BadRequest('Topic is required'))

    res.locals.username = user.usernameDisplay
    res.locals.email = user.email

    next()
}

export const notAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const { title, email, topic } = req.body

    if (!/^[^\s@]+@[^\s@]+$/.test(email)) return next(HandleError.NotAcceptable('Enter a valid email address'))
    if (email.length > 254) return next(HandleError.NotAcceptable('Email must be less than 254 characters'))

    if (!title) return next(HandleError.NotAcceptable('Title is required'))
    if (topic === 'nothing') return next(HandleError.BadRequest('Topic is required'))

    res.locals.email = email

    next()
}
