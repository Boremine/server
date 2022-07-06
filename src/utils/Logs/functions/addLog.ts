// @ts-nocheck
import { Request, NextFunction } from 'express'

import User from '../../../models/user'
import Log from '../../../models/log'

export const addLog = async (req: Request, user_id: string, next: NextFunction) => {
    const userAgent = req.useragent

    const query = {
        user_id,
        browser: userAgent?.browser,
        version: userAgent?.version,
        os: userAgent?.os,
        platform: userAgent?.platform,
        device: userAgent?.device,
        ip: userAgent?.ip,
        location: userAgent?.location
    }

    const logFound = await Log.findOne(query)
    if (logFound) return false

    const NewLog = new Log(query)

    const log = await NewLog.save()

    const user = await User.findById(user_id)
    user?.logs.push(NewLog)
    await user?.save()

    return log._id.toString()
}
