import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'

import User from '../../models/user'

import axios from 'axios'
import { getSecretValue } from '../../utils/SecretManager/getSecretValue'
// import { getSecretValue } from '../..'

interface RequestBody {
    username: string
    email: string
    password: string
    passwordConfirm: string
    cftToken: string
}

interface RequestValidation {
    username?: string
    email?: string
    password?: string
    passwordConfirm?: string
}

export const signupRequest = async (req: Request, res: Response, next: NextFunction) => {
    const body: RequestBody = req.body
    const val: RequestValidation = {}

    if (!body.username.match('^[A-Za-z0-9-_]+$')) val.username = 'Letters, numbers, dashes, and underscores only'
    if (body.username.length < 3) val.username = 'Username must be between 3 and 20 characters'
    if (body.username.length > 20) return next(HandleError.NotAcceptable('Username must be between 3 and 20 characters'))
    await User.findOne({ username: body.username.toLowerCase() }).then(user => { if (user) val.username = 'Username is taken' })

    if (!/^[^\s@]+@[^\s@]+$/.test(body.email)) val.email = 'Enter a valid email address'
    if (body.email.length > 254) return next(HandleError.NotAcceptable('Email must be less than 254 characters'))
    await User.findOne({ email: body.email, googleId: { $exists: false } }).then(user => { if (user) val.email = 'Email is taken' })

    if (body.password !== body.passwordConfirm) val.passwordConfirm = `Passwords don't match`
    if (body.password.length < 8) { val.password = 'Password must be at least 8 characters long'; delete val.passwordConfirm }
    if (body.password.length > 256) return next(HandleError.NotAcceptable('Password must be less than 256 characteres long'))

    if (Object.keys(val).length) return next(HandleError.NotAcceptable(val))

    let cftPass = false

    const formData = new URLSearchParams()

    formData.append('secret', String(await getSecretValue('CLOUDFLARE_TURNSTILE_SECRET_KEY')))
    formData.append('response', req.body.cftToken)
    if (req.useragent?.ip) formData.append('remoteip', req.useragent?.ip)

    await axios({
        url: `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
        data: formData,
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
        method: 'post'
    }).then((res) => {
        if (res.data.success) cftPass = true
    }).catch(() => {
    })

    if (!cftPass) return next(HandleError.BadRequest('Click the checkbox above'))

    next()
}
