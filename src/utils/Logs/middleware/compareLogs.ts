import { Request, Response, NextFunction } from 'express'

import Log from '../../../models/log'
import User from '../../../models/user'

import { verificationGenerate_G } from '../../../features/Verification/controllers'
import { Details } from 'express-useragent'


interface Log {
    _id: string,
}


const checkLogs = (logs: Array<Details & Log>, userAgent:Details | undefined) => {
    let found: boolean | string = true

    for (let i = 0; i < logs.length; i++) {
        const log = logs[i]
        found = log._id

        log.browser !== userAgent?.browser ? found = false : null
        log.version !== userAgent?.version ? found = false : null
        log.os !== userAgent?.os ? found = false : null
        log.platform !== userAgent?.platform ? found = false : null
        log.device !== userAgent?.device ? found = false : null
        log.ip !== userAgent?.ip ? found = false : null

        if (found) break
    }
    return found
}


export const compareLogs = async (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.useragent
    let { user_id } = res.locals
    
    const user = await User.findById(user_id).populate({ path: 'logs', model: Log }).select('logs username email')
    const logs: Array<Details & Log> | any = user?.logs
    
    const log_id: boolean | string = checkLogs(logs, userAgent)
    
    if (!logs.length || !log_id) return verificationGenerate_G(res, {...req.body, ...res.locals}, 'new_auth')
    
    res.locals.log_id = log_id.toString()


    next()
}