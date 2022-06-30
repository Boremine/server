import { Request, Response, NextFunction } from 'express'

interface ParamsValidate {
    path?: string
}

export const verificationValidate = (req: Request, res: Response, next: NextFunction) => {
    const params: ParamsValidate = req.params

    params.path = params.path ? String(params.path) : ''

    next()
}

interface BodyConfirm {
    code: string
}
interface ParamsConfirm {
    path?: string
}

export const verificationConfirm = (req: Request, res: Response, next: NextFunction) => {
    const body: BodyConfirm = req.body
    const params: ParamsConfirm = req.params

    body.code = body.code ? String(body.code).toLowerCase().trim() : ''
    params.path = params.path ? String(params.path) : ''

    next()
}
