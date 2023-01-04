import { Request, Response, NextFunction } from 'express'
import Verification from '../../models/verification'

import { HandleSuccess } from '../../responses/success/HandleSuccess'

import crypto from 'crypto'
import { sendEmail } from '../../utils/Nodemailer/functions/sendEmail'

import { signupVerified } from '../Signup/controllers'
import { forgotVerified } from '../ForgotPassword/controllers'
import { loginVerified } from '../Login/controllers'
import { accountChangeEmailVerified } from '../Account/controllers'
import { forCode } from '../../utils/Nodemailer/functions/templates/forCode'

export const verificationValidate = async (req: Request, res: Response, next: NextFunction) => {
    const { type, email } = res.locals

    HandleSuccess.Ok(res, { type, email })
}

interface GenerateBody {
    [key: string]: any;
}

export const verificationGenerate_G = async (res: Response, body: GenerateBody, type: 'new_auth' | 'signup' | 'forgot' | 'change_email') => {
    const path: string = crypto.randomBytes(40).toString('hex')

    const code: string = crypto.randomBytes(4).toString('hex')
    const codeHashed: string = crypto.createHash('sha256').update(code).digest('hex')

    const NewVerification = new Verification({
        path,
        codeHashed,
        type,
        data: body
    })

    await NewVerification.save()

    if (process.env.NODE_ENV === 'test') return HandleSuccess.MovedPermanently(res, { path, code })

    let emailSubject = ''
    let emailHtml = ''

    switch (type) {
        case 'signup':
            emailSubject = 'Account Creation'
            break
        case 'new_auth':
            emailSubject = 'Log In Confirmation'
            break
        case 'forgot':
            emailSubject = 'Reset Password'
            break
        case 'change_email':
            emailSubject = 'Change Email'
            break
    }

    emailHtml = forCode(emailSubject, code)

    sendEmail(body.email, emailSubject, emailHtml)

    HandleSuccess.MovedPermanently(res, { path })
}

export const verificationConfirm = async (req: Request, res: Response, next: NextFunction) => {
    const path: string = req.params.path
    const { type } = res.locals

    await Verification.findOneAndRemove({ path })

    if (type === 'signup') signupVerified(req, res, next)
    else if (type === 'new_auth') loginVerified(req, res, next)
    else if (type === 'forgot') forgotVerified(req, res, next)
    else if (type === 'change_email') accountChangeEmailVerified(req, res, next)
}
