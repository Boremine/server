import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'

import { HandleError } from '../../responses/error/HandleError'
import { HandleSuccess } from '../../responses/success/HandleSuccess'

import crypto from 'crypto'
import bcrypt from 'bcrypt'


import { verificationGenerate_G } from '../Verification/controllers'
import { addLog } from '../../utils/Logs/functions/addLog'
import { newAuthentication } from '../../utils/Authentication/function/newAuthentication'
// import { newAuthentication } from '../../utils/middlewares/newAuthentication'




interface Body {
    username: string,
    email: string,
    password: string,
}

export const signupRequest = async (req: Request, res: Response, next: NextFunction) => {
    let body: Body = req.body

    const passwordHashed = crypto.createHash('sha256').update(body.password).digest('hex')
    body.password = await bcrypt.hash(passwordHashed, 12)

    verificationGenerate_G(res, body, 'signup')
}





export const signupVerified = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = res.locals.data

    const user = await User.findOne({ username: username })
    if (user) return next(HandleError.NotAcceptable(`Path expired`))

    const NewUser = new User({
        username: username,
        usernameDisplay: username,
        email: email,
        password: password
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





