import { Request, Response, NextFunction } from 'express'
import Verification from '../../models/verification'

import { HandleSuccess } from '../../responses/success/HandleSuccess'

import crypto from 'crypto'
import { signupVerified } from '../Signup/controllers'
import { newAuthentication } from '../../utils/Authentication/function/newAuthentication'
import { addLog } from '../../utils/Logs/functions/addLog'
import { HandleError } from '../../responses/error/HandleError'





export const verificationValidate = async (req: Request, res: Response, next: NextFunction) => {
    HandleSuccess.Ok(res, 'Path valid')
}




export const verificationGenerate_G = async (res: Response, body: Object, type: string) => {
    const path: string = crypto.randomBytes(40).toString('hex')

    const code: string = crypto.randomBytes(30).toString('hex')
    const codeHashed: string = crypto.createHash('sha256').update(code).digest('hex')

    let NewVerification = new Verification({
        path,
        codeHashed,
        type,
        data: body
    })

    await NewVerification.save()


    if (process.env.NODE_ENV == 'test') return HandleSuccess.MovedPermanently(res, { path, code })
    else {
        console.log(code)
        HandleSuccess.MovedPermanently(res, { path })
    }

}



export const verificationConfirm = async (req: Request, res: Response, next: NextFunction) => {
    const path: string = req.params.path
    const { type, data } = res.locals

    await Verification.findOneAndRemove({ path })

    if (type == 'signup') signupVerified(req, res, next)

    if (type == 'new_auth') {
        let addLogRes = await addLog(req, data.user_id, next)
        if (!addLogRes) return next(HandleError.BadRequest('There was a problem authenticating'))

        const newAuth = {
            user_id: data.user_id,
            username: data.username,
            log_id: addLogRes
        }

        newAuthentication(newAuth, res)
    }




}

