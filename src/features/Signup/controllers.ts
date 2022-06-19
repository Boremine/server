import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'

import { HandleError } from '../../responses/error/HandleError'

import crypto from 'crypto'
import bcrypt from 'bcrypt'

import { verificationGenerate_G } from '../Verification/controllers'
import { addLog } from '../../utils/Logs/functions/addLog'
import { newAuthentication } from '../../utils/Authentication/function/newAuthentication'
// import { newAuthentication } from '../../utils/middlewares/newAuthentication'

const userColors: Array<string> = ['#fcba03', '#158eeb', '#1520eb', '#8415eb', '#d915eb', '#eb15b2', '#eb1579', '#eb152e', '#eb7c15', '#ebab15', '#d2eb15', '#72eb15', '#15eb15']

interface RequestBody {
    username: string,
    email: string,
    password: string,
}

export const signupRequest = async (req: Request, res: Response, next: NextFunction) => {
    const body:RequestBody = req.body

    const passwordHashed = crypto.createHash('sha256').update(body.password).digest('hex')
    body.password = await bcrypt.hash(passwordHashed, 12)

    verificationGenerate_G(res, body, 'signup')
}

export const signupVerified = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = res.locals.data

    const user = await User.findOne({ username })
    if (user) return next(HandleError.NotAcceptable('Path expired'))

    const NewUser = new User({
        username,
        usernameDisplay: username,
        email,
        password,
        color: userColors[Math.floor(Math.random() * userColors.length)],
        alreadyVoted: false
    })
    await NewUser.save(async (err, user_created) => {
        if (err) return next(HandleError.Internal(err))

        const addLogRes = await addLog(req, user_created._id.toString(), next)
        if (!addLogRes) return next(HandleError.BadRequest('There was a problem adding log'))

        const newAuth = {
            user_id: user_created._id.toString(),
            username: user_created.usernameDisplay,
            log_id: addLogRes
        }

        newAuthentication(newAuth, res)
    })
}
