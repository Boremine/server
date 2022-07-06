import { Request, Response, NextFunction } from 'express'
import sanitize from 'mongo-sanitize'

const getIp = (req: Request) => {
    let ip: string | undefined

    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') ip = '1.1.1.1.1'
    else ip = req.header('x-forwarded-for')?.split(',')[0]

    return ip
}

export const global_sanitize = async (req: Request, res: Response, next: NextFunction) => {
    req.body = sanitize(req.body)
    req.params = sanitize(req.params)

    if (req.useragent) {
        req.useragent.device = req.cookies.device ? req.cookies.device : 'global'
        req.useragent.ip = getIp(req)
        req.useragent.location = `${req.header('X-AppEngine-Region')}, ${req.header('X-AppEngine-City')}, ${req.header('X-AppEngine-Country')}`
    }

    next()
}
