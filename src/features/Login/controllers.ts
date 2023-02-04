import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'

import { newAuthentication } from '../../utils/Authentication/function/newAuthentication'
import { userColors } from '../../utils/Authentication/function/userColors'
import { addLog, addLogGoogle } from '../../utils/Logs/functions/addLog'
import User from '../../models/user'
import { usernameGenerator } from '../../utils/Scripts/usernameGenerator'

import { UserAgent } from '../../types/express-useragent-interface'

export const loginTry = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, log_id } = res.locals

    newAuthentication({ user_id, log_id }, res)
}

export const loginVerified = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals.data

    const addLogRes = await addLog(req, user_id, next, 'login')

    const newAuth = {
        user_id,
        log_id: addLogRes
    }

    newAuthentication(newAuth, res)
}

interface LogType {
    _id: string,
}

const checkLogs = (logs: Array<UserAgent & LogType>, userAgent: UserAgent | undefined) => {
    let found: false | string = false

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

export const loginGoogle = async (req: Request, res: Response, next: NextFunction) => {
    const { googleEmail, googleId, alreadyUser, user_id, logs } = res.locals

    const username = usernameGenerator()

    if (!alreadyUser) {
        const NewUser = new User({
            username: username.toLowerCase(),
            usernameDisplay: username,
            email: googleEmail,
            googleId,
            color: userColors[Math.floor(Math.random() * userColors.length)],
            alreadyVoted: 'none'
        })
        await NewUser.save(async (err, user_created) => {
            if (err) return next(HandleError.Internal(err))

            const addLogRes = await addLogGoogle(req, user_created._id.toString(), next)

            const newAuth = {
                log_id: addLogRes,
                user_id: user_created._id.toString()
            }

            newAuthentication(newAuth, res)
        })
    } else {
        let log_id: boolean | string = checkLogs(logs, req.useragent)
        if (!log_id) log_id = await addLogGoogle(req, user_id.toString(), next)

        const newAuth = {
            log_id,
            user_id: user_id.toString()
        }

        newAuthentication(newAuth, res)
    }
}
