import { Request, Response, NextFunction } from 'express'
import Verification from '../../models/verification'

import { HandleSuccess } from '../../responses/success/HandleSuccess'

import crypto from 'crypto'
import nodemailer from 'nodemailer'

import { signupVerified } from '../Signup/controllers'
import { newAuthentication } from '../../utils/Authentication/function/newAuthentication'
import { addLog } from '../../utils/Logs/functions/addLog'
import { HandleError } from '../../responses/error/HandleError'

export const verificationValidate = async (req: Request, res: Response, next: NextFunction) => {
    HandleSuccess.Ok(res, 'Path valid')
}

interface GenerateBody {
    [key: string]: any;
}

export const verificationGenerate_G = async (res: Response, body: GenerateBody, type: 'new_auth' | 'signup') => {
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

    let emailSubject = 'f'

    switch (type) {
        case 'signup':
            emailSubject = 'Creating Account: verification code'
            break
        case 'new_auth':
            emailSubject = 'New Login: verification code'
            break
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    })

    try {
        await transporter.sendMail({
            from: 'Boremine <noreply@boremine.com>',
            to: body.email,
            subject: emailSubject,
            html: `Code: ${code}`
        })
    } catch {
        // return HandleSuccess.MovedPermanently(res, { path })
    }
    console.log('pass')
    HandleSuccess.MovedPermanently(res, { path })
}

export const verificationConfirm = async (req: Request, res: Response, next: NextFunction) => {
    const path: string = req.params.path
    const { type, data } = res.locals

    await Verification.findOneAndRemove({ path })

    if (type === 'signup') signupVerified(req, res, next)

    if (type === 'new_auth') {
        const addLogRes = await addLog(req, data.user_id, next)
        if (!addLogRes) return next(HandleError.BadRequest('There was a problem authenticating'))

        const newAuth = {
            user_id: data.user_id,
            username: data.username,
            log_id: addLogRes
        }

        newAuthentication(newAuth, res)
    }
}
