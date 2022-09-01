// @ts-nocheck
import { Request, NextFunction } from 'express'

import User from '../../../models/user'
import Log from '../../../models/log'

import { sendEmail } from '../../Nodemailer/functions/sendEmail'

export const addLog = async (req: Request, user_id: string, next: NextFunction, emailDetection: 'sendEmailDetection' | false = false) => {
    const userAgent = req.useragent

    const query = {
        user_id,
        browser: userAgent?.browser,
        platform: userAgent?.platform,
        device: userAgent?.device,
        ip: userAgent?.ip,
        location: userAgent?.location
    }

    const logFound = await Log.findOne(query)
    if (logFound) return false

    let machine: string

    if (userAgent?.isDesktop) machine = 'desktop'
    else if (userAgent?.isMobile) machine = 'mobile'

    const NewLog = new Log({ ...query, machine })

    const log = await NewLog.save()

    const user = await User.findById(user_id)
    user?.logs.push(NewLog)
    await user?.save()

    if (emailDetection) {
        const emailHtml = `
        <p>A new log in has been detected from:</p>
        <ul>
            <li>${query.browser} (${query.platform})</li>
            <li>${query.location}</li>
            <li>${query.ip}</li>
        </ul>

        <p>If this was you, you can ignore this message</p>
        
    `
        sendEmail(user?.email, `New Login Detected`, emailHtml)
    }

    return log._id.toString()
}
