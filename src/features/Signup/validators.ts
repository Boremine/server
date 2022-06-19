import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'

import User from '../../models/user'

interface RequestBody {
    username: string,
    email: string,
    password: string,
}

interface RequestValidation {
    username?: string,
    email?: string,
    password?: string,
}

export const signupRequest = async (req: Request, res: Response, next: NextFunction) => {
    const body: RequestBody = req.body
    const val:RequestValidation = {}

    if (!body.username.match('^[A-Za-z0-9-_]+$')) val.username = 'Letters, numbers, dashes, and underscores only'
    if (body.username.length > 20 || body.username.length < 3) val.username = 'Username must be between 3 and 20 characters'
    await User.findOne({ username: body.username.toLowerCase() }).then(user => { if (user) val.username = 'Username is taken' })

    if (!/^[^\s@]+@[^\s@]+$/.test(body.email)) val.email = 'Enter a valid email address'
    await User.findOne({ email: body.email.toLowerCase() }).then(user => { if (user) val.email = 'Email is taken' })

    if (body.password.length < 8) val.password = 'Password must be at least 8 characters long'
    if (body.password.length > 256) val.password = 'Password must be less than 256 characteres long'

    if (Object.keys(val).length) return next(HandleError.NotAcceptable(val))

    next()
}
