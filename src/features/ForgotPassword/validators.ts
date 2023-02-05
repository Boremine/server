import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'

import User from '../../models/user'
import ForgotPassword from '../../models/forgotPassword'

import jwt, { VerifyErrors } from 'jsonwebtoken'
import { getSecretValue } from '../../utils/SecretManager/getSecretValue'

interface RequestBody {
    email: string
}

export const forgotRequest = async (req: Request, res: Response, next: NextFunction) => {
    const body: RequestBody = req.body

    if (!body.email) return next(HandleError.NotAcceptable('Email is required'))
    if (body.email.length > 254) return next(HandleError.NotAcceptable('Email must be less than 254 characters'))
    if (!/^[^\s@]+@[^\s@]+$/.test(body.email)) return next(HandleError.NotAcceptable('Enter a valid email address'))

    const user = await User.findOne({ email: body.email })
    if (!user) {
        res.locals = {
            email: body.email,
            fakeVerification: true
        }
    } else {
        res.locals = {
            user_id: user._id.toString(),
            email: user.email
        }
    }

    next()
}

export const forgotValidate = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params
    const secret: string = String(await getSecretValue('FORGOTPASSWORD_TOKEN_SECRET'))
    if (!token) return next(HandleError.NotFound('Token Expired'))
    await jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(HandleError.NotFound('Token Expired'))

        const forgetPasswordToken = await ForgotPassword.findOne({ token })
        if (!forgetPasswordToken) return next(HandleError.NotFound('Token Expired'))
    })

    next()
}

interface ConfirmBody {
    password: string
    passwordConfirm: string
}

interface ConfirmValidation {
    password?: string
    passwordConfirm?: string
}

export const forgotConfirm = async (req: Request, res: Response, next: NextFunction) => {
    const body: ConfirmBody = req.body
    const val: ConfirmValidation = {}

    if (body.password !== body.passwordConfirm) val.passwordConfirm = `Passwords don't match`
    if (body.password.length < 8) { val.password = 'Password must be at least 8 characters long'; delete val.passwordConfirm }
    if (body.password.length > 256) val.password = 'Password must be less than 256 characters long'

    if (Object.keys(val).length) return next(HandleError.NotAcceptable(val))

    const { token } = req.params
    const secret: string = String(await getSecretValue('FORGOTPASSWORD_TOKEN_SECRET'))
    if (!token) return next(HandleError.NotFound('Token Expired'))
    await jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(HandleError.NotFound('Token Expired'))

        const forgetPasswordToken = await ForgotPassword.findOne({ token })
        if (!forgetPasswordToken) return next(HandleError.NotFound('Token Expired'))

        res.locals.user_id = decoded.user_id.toString()
    })

    next()
}
