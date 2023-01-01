import { Request, Response, NextFunction } from 'express'

interface RequestBody {
    email: string,
    password: string
}

export const forgotRequest = (req: Request, res: Response, next: NextFunction) => {
    const body: RequestBody = req.body

    body.email = String(body.email).toLowerCase().trim()

    next()
}

interface ValidateParams {
    token?: string
}

export const forgotValidate = (req: Request, res: Response, next: NextFunction) => {
    const params: ValidateParams = req.params

    params.token = String(params.token)

    next()
}

interface ConfirmBody {
    password: string
    passwordConfirm: string
}

interface ConfirmParams {
    token?: string
}

export const forgotConfirm = (req: Request, res: Response, next: NextFunction) => {
    const params: ConfirmParams = req.params
    const body: ConfirmBody = req.body

    params.token = String(params.token)
    body.password = String(body.password)
    body.passwordConfirm = String(body.passwordConfirm)

    next()
}
