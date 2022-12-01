import { Request, Response, NextFunction } from 'express'
import { HandleSuccess } from '../../responses/success/HandleSuccess'
import { sendEmail } from '../../utils/Nodemailer/functions/sendEmail'

import crypto from 'crypto'

export const support = async (req: Request, res: Response, next: NextFunction) => {
    const { email, username } = res.locals
    const { title, body, topic } = req.body

    const emailHtml = `
        <h1>${title}</h1>
        <label><strong>username:</strong> ${username || 'not login'}</label><br/>
        <label><strong>email:</strong> ${email}</label>
        <p>${body}</p>
    `

    sendEmail(`support@boremine.com`, `${topic} #${crypto.randomBytes(5).toString('hex')}`, emailHtml)

    HandleSuccess.Ok(res, 'Yess')
}
