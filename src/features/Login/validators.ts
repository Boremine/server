import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'

import crypto from 'crypto'
import bcrypt from 'bcrypt'

import User from '../../models/user'

interface TryBody {
    email: string,
    password: string,
}

export const loginTry = async (req: Request, res: Response, next: NextFunction) => {
    const body: TryBody = req.body

    const user = await User.findOne({ email: body.email })
    if (!user) return next(HandleError.NotAcceptable('Email or Password is incorrect'))

    const passwordHash = await crypto.createHash('sha256').update(body.password).digest('hex')
    const passwordValid = await bcrypt.compare(passwordHash, user.password)
    if (!passwordValid) return next(HandleError.NotAcceptable('Email or Password is incorrect'))

    res.locals = {
        user_id: user._id.toString(),
        username: user.usernameDisplay,
        email: user.email
    }

    next()
}
