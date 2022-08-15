import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'

import User from '../../models/user'

import crypto from 'crypto'
import bcrypt from 'bcrypt'

const validatePassword = async (inputPassword: string, ownerPassword: string) => {
    const passwordHash = await crypto.createHash('sha256').update(inputPassword).digest('hex')
    const passwordValid = await bcrypt.compare(passwordHash, ownerPassword)
    if (!passwordValid) return false
    else return true
}

interface ChangeUsernameBody {
    password: string
    username: string
}

interface ChangeUsernameValidation {
    password?: string
    username?: string
}

export const accountChangeUsername = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals

    const body: ChangeUsernameBody = req.body
    const val: ChangeUsernameValidation = {}

    const user = await User.findById(user_id)
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    const matchPassword: boolean = await validatePassword(body.password, user.password)
    if (!matchPassword) val.password = 'Incorrect Password'

    if (!body.username.match('^[A-Za-z0-9-_]+$')) val.username = 'Letters, numbers, dashes, and underscores only'
    if (body.username.length > 20 || body.username.length < 3) val.username = 'Username must be between 3 and 20 characters'
    await User.findOne({ username: body.username.toLowerCase() }).then(otherUser => {
        if (otherUser && otherUser.username !== user.username) val.username = 'Username is taken'
    })
    if (user.username === body.username) val.username = 'This is your current username'

    const changeDate = new Date(user.lastUsernameUpdate.setDate(user.lastUsernameUpdate.getDate() + 12))
    const currentDate = new Date()

    const diffMiliseconds = changeDate.valueOf() - currentDate.valueOf()
    const diffDays = Math.ceil(diffMiliseconds / (1000 * 60 * 60 * 24))

    if (diffMiliseconds > 0) val.username = `${diffDays} day${diffDays > 1 ? 's' : ''} remaining before you can change your username`

    if (Object.keys(val).length) return next(HandleError.NotAcceptable(val))

    await user.updateOne({ username: body.username, usernameDisplay: body.username, lastUsernameUpdate: Date.now() })

    next()
}

interface ChangeEmailBody {
    password: string
    email: string
}

interface ChangeEmailValidation {
    password?: string
    email?: string
}

export const accountChangeEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals

    const body: ChangeEmailBody = req.body
    const val: ChangeEmailValidation = {}

    const user = await User.findById(user_id)
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    const matchPassword: boolean = await validatePassword(body.password, user.password)
    if (!matchPassword) val.password = 'Incorrect Password'

    if (!/^[^\s@]+@[^\s@]+$/.test(body.email)) val.email = 'Enter a valid email address'
    if (body.email.length > 254) val.email = 'Email must be less than 254 characters'
    await User.findOne({ email: body.email }).then(user => { if (user) val.email = 'Email is taken' })
    if (user.email === body.email) val.email = 'This is your current email'

    if (Object.keys(val).length) return next(HandleError.NotAcceptable(val))

    next()
}

interface ChangePasswordBody {
    currentPassword: string
    newPassword: string
    newPasswordConfirm: string
}

interface ChangePasswordValidation {
    currentPassword?: string
    newPassword?: string
    newPasswordConfirm?: string
}

export const accountChangePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals

    const body: ChangePasswordBody = req.body
    const val: ChangePasswordValidation = {}

    const user = await User.findById(user_id).populate({ path: 'logs', populate: { path: 'refreshToken_id' } })
    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    const matchPassword: boolean = await validatePassword(body.currentPassword, user.password)
    if (!matchPassword) val.currentPassword = 'Incorrect Password'

    if (body.newPassword !== body.newPasswordConfirm) val.newPasswordConfirm = `Passwords don't match`
    if (body.newPassword.length < 8) { val.newPassword = 'Password must be at least 8 characters long'; delete val.newPasswordConfirm }
    if (body.newPassword.length > 256) val.newPassword = 'Password must be less than 256 characteres long'

    if (Object.keys(val).length) return next(HandleError.NotAcceptable(val))

    const newPasswordHash = await crypto.createHash('sha256').update(body.newPassword).digest('hex')
    const newPasswordBcrypt = await bcrypt.hash(newPasswordHash, 12)

    await user.updateOne({ password: newPasswordBcrypt })

    res.locals.user = user

    next()
}
