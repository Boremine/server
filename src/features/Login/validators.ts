import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'

import crypto from 'crypto'
import bcrypt from 'bcrypt'

import User from '../../models/user'
import { client } from '../../utils/Authentication/function/googleAuthConnection'

// import { OAuth2Client } from 'google-auth-library'

interface TryBody {
    email: string,
    password: string,
}

export const loginTry = async (req: Request, res: Response, next: NextFunction) => {
    const body: TryBody = req.body

    if (body.password) return next(HandleError.NotAcceptable('Password is required'))
    if (body.email) return next(HandleError.NotAcceptable('Email is required'))
    if (body.password.length > 256) return next(HandleError.NotAcceptable('Password must be less than 256 characteres long'))
    if (body.email.length > 254) return next(HandleError.NotAcceptable('Email must be less than 254 characters'))

    const user = await User.findOne({ email: body.email })
    if (!user) return next(HandleError.NotAcceptable('Email or Password is incorrect'))

    const passwordHash = await crypto.createHash('sha256').update(body.password).digest('hex')
    const passwordValid = await bcrypt.compare(passwordHash, user.password)
    if (!passwordValid) return next(HandleError.NotAcceptable('Email or Password is incorrect'))

    res.locals = {
        user_id: user._id.toString(),
        email: user.email
    }

    next()
}

interface GoogleBody {
    access_token: string
}

export const loginGoogle = async (req: Request, res: Response, next: NextFunction) => {
    const body: GoogleBody = req.body

    try {
        const credentials = await (await client).getToken(body.access_token)

        const userInfo = await (await client).getTokenInfo(credentials.tokens.access_token!)
        // const tete = await (await client).verifyIdToken({
        //     idToken: credentials.tokens.id_token!,
        //     audience: '1083677348762-3de3pif9lq7lb4v87500g2up1h0591m1.apps.googleusercontent.com'
        // })
        // console.log(tete)
        const user = await User.findOne({ googleId: userInfo.sub }).lean().populate([{
            path: 'logs',
            select: 'browser ip device platform location machine _id'
        }, {
            path: 'prompt_id',
            select: '_id title text'
        }
        ]).select('usernameDisplay email alreadyVoted lastUsernameUpdate prompt_id _id')

        if (!user) {
            res.locals.googleId = userInfo.sub
            res.locals.googleEmail = userInfo.email
        } else {
            res.locals.alreadyUser = true
            res.locals.user_id = user._id
            res.locals.logs = user.logs
        }
    } catch {
        return next(HandleError.BadRequest('Invalid Google Account'))
    }
    // client.setCredentials({ access_token: credentials.tokens.access_token, refresh_token: credentials.tokens.refresh_token })
    // const tete = await client.refreshAccessToken()
    // const ticket3 = await client.getTokenInfo(tete.credentials.access_token!)

    // const ticket2 = await client.verifyIdToken({
    //     idToken: ticket.tokens.access_token!,
    //     audience: '1083677348762-3de3pif9lq7lb4v87500g2up1h0591m1.apps.googleusercontent.com'
    // })
    // console.log(ticket2)
    // payload = ticket.getPayload()
    // } catch {
    //     return next(HandleError.BadRequest('Invalid Google Account'))
    // }
    // if (!payload) return next(HandleError.BadRequest('Invalid Google Account'))

    // res.locals.googleId = payload.sub

    next()
}
