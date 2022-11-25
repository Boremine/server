import { Request, Response, NextFunction } from 'express'

import Log from '../../models/log'
import RefreshToken from '../../models/refreshToken'
import User from '../../models/user'

import { HandleSuccess } from '../../responses/success/HandleSuccess'
import crypto from 'crypto'
import { HandleError } from '../../responses/error/HandleError'
import { verificationGenerate_G } from '../Verification/controllers'
import { sendEmail } from '../../utils/Nodemailer/functions/sendEmail'
import { clearCookiesSettings } from '../../utils/Authentication/function/tokens'

export const accountChangeUsername = async (req: Request, res: Response, next: NextFunction) => {
    HandleSuccess.Ok(res, 'Username Changed')
}

export const accountChangeEmailRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals
    const { email } = req.body

    return verificationGenerate_G(res, { email, user_id }, 'change_email')
}

export const accountChangeEmailVerified = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, email } = res.locals.data

    const user = await User.findByIdAndUpdate(user_id, { email })
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    sendEmail(user.email, 'Email Changed Successfully', `tatata`)
    sendEmail(email, 'New Email Assigned', 'new email assign')

    HandleSuccess.Ok(res, 'Email Changed')
}

export const accountChangePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals
    const { refresh_token } = req.signedCookies
    const { allOut } = req.body

    if (allOut) {
        const refreshToken_ids: Array<string> = []
        for (let i = 0; i < user.logs.length; i++) {
            if (!user.logs[i].refreshToken_id) continue
            const id = user.logs[i].refreshToken_id._id
            const ownerRefreshToken = user.logs[i].refreshToken_id.token
            if (crypto.createHash('sha256').update(refresh_token).digest('hex') !== ownerRefreshToken) refreshToken_ids.push(id)
        }

        await RefreshToken.deleteMany({ _id: { $in: refreshToken_ids } })
    }

    HandleSuccess.Ok(res, 'Password Changed')
}

export const accountDeleteDevice = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals
    const { refresh_token } = req.signedCookies
    const log_id = req.params.id

    const log = await Log.findOneAndDelete({ _id: log_id, user_id }).populate({ path: 'refreshToken_id' })
    if (!log) return next(HandleError.BadRequest(`Device doesn't exist`))

    const currentRefreshToken = crypto
        .createHash('sha256')
        .update(refresh_token)
        .digest('hex')

    if (log.refreshToken_id) {
        if (currentRefreshToken === log.refreshToken_id.token) {
            res.clearCookie('access_token', clearCookiesSettings)
            res.clearCookie('refresh_token', clearCookiesSettings)
        }

        await RefreshToken.findByIdAndDelete(log.refreshToken_id).lean()
    }

    // if (!log) return next(HandleError.BadRequest(`Device doesn't exist`))

    HandleSuccess.Ok(res, 'Device deleted')
}

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals

    const user = await User.findById(user_id).populate({ path: 'logs', select: '_id refreshToken_id' }).select('_id')
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))
    // console.log(user)
    const refreshTokensIds: Array<string> = []
    const logsIds: Array<string> = []

    // console.log('----------------------')
    for (let i = 0; i < user.logs.length; i++) {
        const id = user.logs[i]
        refreshTokensIds.push(id.refreshToken_id)
        logsIds.push(id._id)
    }
    // console.log(refreshTokensIds)
    // console.log(logsIds)

    await RefreshToken.deleteMany({ _id: { $in: refreshTokensIds } })
    await Log.deleteMany({ _id: { $in: logsIds } })
    await User.findByIdAndDelete(user._id)

    HandleSuccess.Ok(res, 'Account deleted')
}
