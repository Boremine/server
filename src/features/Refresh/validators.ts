import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
// import { getSecretValue } from '../..'

import { HandleError } from '../../responses/error/HandleError'
// import { client } from '../../utils/Authentication/function/googleAuthConnection'
import { clearCookiesSettings } from '../../utils/Authentication/function/tokens'
import { getSecretValue } from '../../utils/SecretManager/getSecretValue'
// import User from '../../models/user'

// const authorizeGoogleAccount = async (req: Request) => {
//     try {
//         console.log(req.signedCookies.refresh_token)
//         // const payload = await (await client).getTokenInfo(req.signedCookies.refresh_token)
//         // const user = await User.findOne({ googleId: payload.sub })
//         // if (!user) return false
//         // return user._id.toString()
//         await (await client).setCredentials({ refresh_token: req.signedCookies.refresh_token })
//         const credentials = await (await client).refreshAccessToken()
//         if (!credentials.credentials.access_token) return false
//         const payload = await (await client).getTokenInfo(credentials.credentials.access_token)
//         const user = await User.findOne({ googleId: payload.sub })
//         console.log(user)
//         if (!user) return false
//         return user._id.toString()
//         // const payload = await (await client).verifyIdToken(req.signedCookies.refresh_token)
//         // const ticket = await (await client).verifyIdToken({
//         //     idToken: req.signedCookies.refresh_token,
//         //     audience: (await getSecretValue('GOOGLEAUTH_CLIENT_ID'))
//         // })
//         // console.log(ticket)
//         // return false
//     } catch {
//         return false
//     }
// }

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    let { refresh_token } = req.signedCookies
    if (process.env.NODE_ENV === 'test') refresh_token = req.cookies.refresh_token

    const secret: string = String(await getSecretValue('REFRESH_TOKEN_SECRET'))

    if (!refresh_token) {
        res.clearCookie('refresh_token', clearCookiesSettings)
        return next(HandleError.Forbidden('Refresh Token Expired'))
    }

    jwt.verify(refresh_token, secret, async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            // const userIdRes = await authorizeGoogleAccount(req)
            // if (userIdRes) {
            //     res.locals.user_id = userIdRes
            //     return next()
            // }
            res.clearCookie('access_token', clearCookiesSettings)
            return next(HandleError.Forbidden('Refresh Token Expired'))
        }

        res.locals = {
            user_id: decoded.user_id
        }

        return next()
    })
}
