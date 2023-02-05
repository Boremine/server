import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { HandleError } from '../../../responses/error/HandleError'
import { clearCookiesSettings } from '../../Authentication/function/tokens'

import { getSecretValue } from '../../SecretManager/getSecretValue'

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const { access_token } = req.signedCookies

    const secret: string = String(await getSecretValue('ACCESS_TOKEN_SECRET'))

    if (!access_token) {
        res.clearCookie('access_token', clearCookiesSettings)
        return next(HandleError.Forbidden('Access Token Expired'))
    }

    jwt.verify(access_token, secret, async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            res.clearCookie('access_token', clearCookiesSettings)
            return next(HandleError.Forbidden('Access Token Expired'))
        }

        res.locals = {
            user_id: decoded.user_id
        }
    })
    next()
}

export const authorizeNotRequired = async (req: Request, res: Response, next: NextFunction) => {
    const { access_token } = req.signedCookies

    const secret: string = String(await getSecretValue('ACCESS_TOKEN_SECRET'))

    if (!access_token) {
        res.clearCookie('access_token', clearCookiesSettings)
        return next()
    }

    jwt.verify(access_token, secret, async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            res.clearCookie('access_token', clearCookiesSettings)
            return next(HandleError.Forbidden('Access Token Expired'))
        }

        res.locals = {
            user_id: decoded.user_id
        }
    })

    next()
}
