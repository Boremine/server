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
    // console.log(req.cookies)
    // console.log(req.header('x-appengine-user-ip')?.split(',')[0])
    // console.log(req.header('x-forwarded-for')?.split(',')[0])
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
