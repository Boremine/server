import { Request, Response, NextFunction } from 'express'
import sanitize from 'mongo-sanitize'
import crypto from 'crypto'

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
        req.useragent.device = req.cookies.device ? crypto.createHash('sha256').update(req.cookies.device).digest('hex').slice(0, 20) : 'global'
        req.useragent.ip = getIp(req)

        console.log(req.header('X-AppEngine-City'), req.header('X-AppEngine-Region'), req.header('X-AppEngine-Country'), 'CIIIIIIIIIIIIIIIITTYYYYYYYYYYYYYYYYYYY')

        let locationHeaders: Array<string | undefined>
        if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
            locationHeaders = ['Kendall', 'FL', 'US']
        } else {
            locationHeaders = [req.header('X-AppEngine-City'), req.header('X-AppEngine-Region')?.toUpperCase(), req.header('X-AppEngine-Country')]
        }

        req.useragent.location = ''

        if (locationHeaders[0]) req.useragent.location += locationHeaders[0]
        if (locationHeaders[1]) {
            if (locationHeaders[0]) req.useragent.location += `, ${locationHeaders[1]}`
            else req.useragent.location += locationHeaders[1]
        }

        if (locationHeaders[2]) {
            if (locationHeaders[0] || locationHeaders[1]) req.useragent.location += `, ${locationHeaders[2]}`
            else req.useragent.location += locationHeaders[2]
        }
    }

    next()
}
