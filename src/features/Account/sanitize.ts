import { Request, Response, NextFunction } from 'express'

interface ChangeUsernameBody {
    password: string
    username: string
}

export const accountChangeUsername = async (req: Request, res: Response, next: NextFunction) => {
    const body: ChangeUsernameBody = req.body

    body.password = String(body.password)
    body.username = String(body.username).trim()

    next()
}

interface ChangeEmailBody {
    password: string
    email: string
}

export const accountChangeEmail = async (req: Request, res: Response, next: NextFunction) => {
    const body: ChangeEmailBody = req.body

    body.password = String(body.password)
    body.email = String(body.email).toLowerCase().trim()

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

    body.currentPassword = String(body.currentPassword)
    body.newPassword = String(body.newPassword)
    body.newPasswordConfirm = String(body.newPasswordConfirm)

    next()
}

interface DeleteDeviceParams {
    id?: string
}

export const accountDeleteDevice = async (req: Request, res: Response, next: NextFunction) => {
    const params: DeleteDeviceParams = req.params

    params.id = String(params.id)

    next()
}

interface DeleteAccountBody {
    password:string
}

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body
    const body:DeleteAccountBody = req.body

    body.password = String(body.password)
    res.locals.password = String(password)

    next()
}
