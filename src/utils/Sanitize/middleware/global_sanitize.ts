import { Request, Response, NextFunction } from 'express'
import sanitize from 'mongo-sanitize'
import crypto from 'crypto'
import geoip from 'geoip-lite'

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

        let geo
        if (req.useragent.ip) {
            geo = geoip.lookup('73.138.87.140')
        }
        // console.log(req.useragent.ip)
        // console.log(geo)

        let locationHeaders: Array<string | undefined>
        // const locationHeaders = ['Kendall', 'FL', 'US']
        if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' || !geo) {
            locationHeaders = ['Unknown', '', '']
        } else {
            locationHeaders = [geo.city, geo.region, geo.country]
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
