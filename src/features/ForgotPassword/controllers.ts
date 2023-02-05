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

import { addLog } from '../../utils/Logs/functions/addLog'
import { newAuthentication } from '../../utils/Authentication/function/newAuthentication'
import { getSecretValue } from '../../utils/SecretManager/getSecretValue'

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

    const secret: string = String(await getSecretValue('FORGOTPASSWORD_TOKEN_SECRET'))
    const token: string = jwt.sign(payload, secret, { expiresIn: '1d' })

    const NewForgotPassword = new ForgotPassword({
        user_id: data.user_id,
        token
    })
    await NewForgotPassword.save()

    HandleSuccess.MovedPermanently(res, { token })
}

export const forgotValidate = async (req: Request, res: Response, next: NextFunction) => {
    HandleSuccess.Ok(res, 'Valid Token')
}

export const forgotConfirm = async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body
    const { user_id } = res.locals

    const passwordHashed = crypto.createHash('sha256').update(password).digest('hex')
    const passwordBcrypt = await bcrypt.hash(passwordHashed, 12)

    await User.findByIdAndUpdate(user_id, { password: passwordBcrypt, logs: [] })
    await Log.deleteMany({ user_id })
    await ForgotPassword.deleteMany({ user_id })

    const addLogRes = await addLog(req, user_id.toString(), next, 'forgotPassword')

    const newAuth = {
        user_id: user_id.toString(),
        log_id: addLogRes
    }

    newAuthentication(newAuth, res)
}
