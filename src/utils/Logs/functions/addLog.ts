// @ts-nocheck
import { Request, NextFunction } from 'express'

import User from '../../../models/user'
import Log from '../../../models/log'

import { sendEmail } from '../../Nodemailer/functions/sendEmail'

import { loginDetection } from '../../Nodemailer/functions/templates/loginDetection'

export const addLog = async (req: Request, user_id: string, next: NextFunction, detectionType: 'login' | 'forgotPassword' | false = false) => {
    const userAgent = req.useragent

    const query = {
        user_id,
        browser: userAgent?.browser,
        platform: userAgent?.platform,
        device: userAgent?.device,
        ip: userAgent?.ip,
        location: userAgent?.location
    }

    let machine: string

    if (userAgent?.isDesktop) machine = 'desktop'
    else if (userAgent?.isMobile) machine = 'mobile'

    const NewLog = new Log({ ...query, machine })

    const log = await NewLog.save()

    const user = await User.findById(user_id)
    user?.logs.push(NewLog)
    await user?.save()

    const loginDetectedBody = {
        text: '',
        browser: query.browser,
        platform: query.platform,
        location: query.location,
        ip: query.ip
    }

    if (detectionType === 'login') {
        const emailSubject = 'New Login Detected'
        loginDetectedBody.text = 'There is a new login detected on your account from:'
        const emailHtml = loginDetection(emailSubject, loginDetectedBody)
        sendEmail(user?.email, emailSubject, emailHtml)
    } else if (detectionType === 'forgotPassword') {
        const emailSubject = 'Password Reset Successful'
        loginDetectedBody.text = 'Your password was successfully changed, and it was from:'
        const emailHtml = loginDetection(emailSubject, loginDetectedBody)
        sendEmail(user?.email, emailSubject, emailHtml)
    }

    return log._id.toString()
}
