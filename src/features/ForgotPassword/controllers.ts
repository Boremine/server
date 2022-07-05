import { Request, Response, NextFunction } from 'express'
import { verificationGenerate_G } from '../Verification/controllers'
import crypto from 'crypto'
import Verification from '../../models/verification'
import { HandleSuccess } from '../../responses/success/HandleSuccess'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import User from '../../models/user'
import Log from '../../models/log'
import ForgotPassword from '../../models/forgotPassword'

export const forgotRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { email, user_id, fakeVerification } = res.locals

    if (!fakeVerification) return verificationGenerate_G(res, { email, user_id }, 'forgot')

    const path: string = crypto.randomBytes(40).toString('hex')

    const code: string = crypto.randomBytes(4).toString('hex')
    const codeHashed: string = crypto.createHash('sha256').update(code).digest('hex')

    const NewVerification = new Verification({
        path,
        codeHashed,
        type: 'forgot',
        data: {
            email,
            fakeVerification: true
        }
    })

    await NewVerification.save()

    HandleSuccess.MovedPermanently(res, { path })
}

export const forgotVerified = async (req: Request, res: Response, next: NextFunction) => {
    const { data } = res.locals

    const payload = {
        user_id: data.user_id
    }

    const secret: string = String(process.env.FORGOTPASSWORD_TOKEN_SECRET)
    const token: string = jwt.sign(payload, secret, { expiresIn: '1d' })

    HandleSuccess.MovedPermanently(res, { token })
}

export const forgotValidate = async (req: Request, res: Response, next: NextFunction) => {
    HandleSuccess.Ok(res, 'Valid Token')
}

export const forgotConfirm = async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body
    const { user_id } = res.locals
    const { token } = req.params

    const passwordHashed = crypto.createHash('sha256').update(password).digest('hex')
    const passwordBcrypt = await bcrypt.hash(passwordHashed, 12)

    await User.findByIdAndUpdate(user_id, { password: passwordBcrypt, logs: [] })
    await Log.deleteMany({ user_id })

    const NewForgotPassword = new ForgotPassword({ token })
    await NewForgotPassword.save()

    HandleSuccess.Ok(res, 'Password Reset')
}
