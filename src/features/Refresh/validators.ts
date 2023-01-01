import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { getSecretValue } from '../..'

import { HandleError } from '../../responses/error/HandleError'
import { clearCookiesSettings } from '../../utils/Authentication/function/tokens'

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    let { refresh_token } = req.signedCookies
    if (process.env.NODE_ENV === 'test') refresh_token = req.cookies.refresh_token

    const secret: string = String(await getSecretValue('REFRESH_TOKEN_SECRET'))

    if (!refresh_token) {
        res.clearCookie('refresh_token', clearCookiesSettings)
        return next(HandleError.Forbidden('Refresh Token Expired'))
    }

    jwt.verify(refresh_token, secret, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            res.clearCookie('refresh_token', clearCookiesSettings)
            return next(HandleError.Forbidden('Refresh Token Expired'))
        }

        res.locals = {
            user_id: decoded.user_id
        }
    })

    next()
}
