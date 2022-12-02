import { Request, Response, NextFunction } from 'express'
import Verification from '../../models/verification'
import { HandleError } from '../../responses/error/HandleError'

import crypto from 'crypto'

export const verificationValidate = async (req: Request, res: Response, next: NextFunction) => {
    const path: string = req.params.path

    const verification = await Verification.findOne({ path })
    if (!verification) return next(HandleError.NotFound('Path expired'))

    res.locals = {
        type: verification.type,
        email: verification.data.email
    }

    next()
}

export const verificationConfirm = async (req: Request, res: Response, next: NextFunction) => {
    const code: string = req.body.code
    const path: string = req.params.path

    if (code.length > 8) return next(HandleError.NotAcceptable('Code is 8 characters long'))

    const verification = await Verification.findOneAndUpdate({ path }, { $inc: { tries: -1 } }, { new: true })
    if (!verification) return next(HandleError.NotFound('Path expired'))

    const yourCodeHashed: string = crypto.createHash('sha256').update(code).digest('hex')

    if (verification.codeHashed !== yourCodeHashed && verification.tries <= 0) {
        await Verification.findOneAndRemove({ path })
        return next(HandleError.NotFound('Path expired'))
    }

    if (verification.data.fakeVerification) return next(HandleError.NotAcceptable('Code incorrect'))
    if (verification.codeHashed !== yourCodeHashed) return next(HandleError.NotAcceptable('Code incorrect'))

    res.locals = {
        data: verification.data,
        type: verification.type
    }

    next()
}
