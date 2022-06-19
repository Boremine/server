import { Request, Response, NextFunction } from 'express'
import sanitize from 'mongo-sanitize'

const getIp = (req: Request) => {
    let ip: string | string[] | undefined

    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') ip = '1.1.1.1.1'
    else ip = req.headers['x-forwarded-for']

    return ip
}

export const global_sanitize = async (req: Request, res: Response, next: NextFunction) => {
    req.body = sanitize(req.body)
    req.params = sanitize(req.params)

    if (req.useragent) {
        req.useragent.device = req.cookies.device ? req.cookies.device : 'global'
        req.useragent.ip = getIp(req)
    }

    // await Stringify(req.body)
    // await Stringify(req.params)
    // await Stringify(req.useragent)

    // console.log(req.body)

    next()
}
