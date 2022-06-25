import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'

import { HandleError } from '../../responses/error/HandleError'

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    let { refresh_token } = req.signedCookies
    // console.log(refresh_token, 'Refresh Token')
    if (process.env.NODE_ENV === 'test') refresh_token = req.cookies.refresh_token

    const secret: string = String(process.env.REFRESH_TOKEN_SECRET)

    if (!refresh_token) {
        res.clearCookie('refresh_token')
        return next(HandleError.Forbidden('Refresh Token Expired'))
    }

    jwt.verify(refresh_token, secret, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            res.clearCookie('refresh_token')
            return next(HandleError.Forbidden('Refresh Token Expired'))
        }
        // console.log(decoded, 'Decoded Refresh Token')
        res.locals = {
            username: decoded.username,
            user_id: decoded.user_id
        }
    })

    next()
}
