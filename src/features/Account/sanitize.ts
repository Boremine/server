import { Request, Response, NextFunction } from 'express'

interface ChangeUsernameBody {
    password: string
    username: string
}

export const accountChangeUsername = async (req: Request, res: Response, next: NextFunction) => {
    const body: ChangeUsernameBody = req.body

    body.password = body.password ? String(body.password) : ''
    body.username = body.username ? String(body.username).trim() : ''

    next()
}

interface ChangeEmailBody {
    password: string
    email: string
}

export const accountChangeEmail = async (req: Request, res: Response, next: NextFunction) => {
    const body: ChangeEmailBody = req.body

    body.password = body.password ? String(body.password) : ''
    body.email = body.email ? String(body.email).toLowerCase().trim() : ''

    next()
}

interface ChangePasswordBody {
    currentPassword: string
    newPassword: string
    newPasswordConfirm: string
    allOut: boolean
}

export const accountChangePassword = async (req: Request, res: Response, next: NextFunction) => {
    const body: ChangePasswordBody = req.body

    body.currentPassword = body.currentPassword ? String(body.currentPassword) : ''
    body.newPassword = body.newPassword ? String(body.newPassword) : ''
    body.newPasswordConfirm = body.newPasswordConfirm ? String(body.newPasswordConfirm) : ''

    next()
}

interface DeleteDeviceParams {
    id?: string
}

export const accountDeleteDevice = async (req: Request, res: Response, next: NextFunction) => {
    const params: DeleteDeviceParams = req.params

    params.id = params.id ? String(params.id) : ''

    next()
}

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body

    res.locals.password = String(password)

    next()
}
