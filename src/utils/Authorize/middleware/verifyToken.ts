import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { HandleError } from '../../../responses/error/HandleError'
import { clearCookiesSettings } from '../../Authentication/function/tokens'
// import User from '../../../models/user'
import { getSecretValue } from '../../SecretManager/getSecretValue'
// import { client } from '../../Authentication/function/googleAuthConnection'

// const authorizeGoogleAccount = async (req: Request) => {
//     try {
//         const payload = await (await client).getTokenInfo(req.signedCookies.access_token)
//         const user = await User.findOne({ googleId: payload.sub })
//         if (!user) return false
//         return user._id.toString()
//     } catch {
//         return false
//     }
// }

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const { access_token } = req.signedCookies

    const secret: string = String(await getSecretValue('ACCESS_TOKEN_SECRET'))

    if (!access_token) {
        res.clearCookie('access_token', clearCookiesSettings)
        return next(HandleError.Forbidden('Access Token Expired'))
    }

    jwt.verify(access_token, secret, async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            // const userIdRes = await authorizeGoogleAccount(req)
            // if (userIdRes) {
            //     res.locals.user_id = userIdRes
            //     return next()
            // }
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
            // const userIdRes = await authorizeGoogleAccount(req)
            // if (userIdRes) {
            //     res.locals.user_id = userIdRes
            //     return next()
            // }
            res.clearCookie('access_token', clearCookiesSettings)
            return next(HandleError.Forbidden('Access Token Expired'))
        }

        res.locals = {
            user_id: decoded.user_id
        }
    })

    next()
}
