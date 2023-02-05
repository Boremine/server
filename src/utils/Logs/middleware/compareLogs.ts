import { Request, Response, NextFunction } from 'express'

import Log from '../../../models/log'
import User from '../../../models/user'

import { verificationGenerate_G } from '../../../features/Verification/controllers'

import { UserAgent } from '../../../types/express-useragent-interface'

interface LogType {
    _id: string,
}

const checkLogs = (logs: Array<UserAgent & LogType>, userAgent: UserAgent | undefined) => {
    let found: boolean | string = true

    for (let i = 0; i < logs.length; i++) {
        const log = logs[i]
        found = log._id

        if (log.browser !== userAgent?.browser) found = false
        if (log.platform !== userAgent?.platform) found = false
        if (log.location !== userAgent?.location) found = false
        if (log.device !== userAgent?.device) found = false
        if (log.ip !== userAgent?.ip) found = false

        if (found) break
    }
    return found
}

export const compareLogs = async (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.useragent
    const { user_id } = res.locals

    const user = await User.findById(user_id).populate({ path: 'logs', model: Log }).select('logs username email')
    const logs: Array<UserAgent & LogType> | any = user?.logs

    const log_id: boolean | string = checkLogs(logs, userAgent)
    if (!logs.length || !log_id) return verificationGenerate_G(res, { ...res.locals }, 'new_auth')

    res.locals.log_id = log_id.toString()

    next()
}
