import { Request, Response, NextFunction } from 'express'
import socketIO from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import User from '../../models/user'
import Commentary from '../../models/commentary'

import { state } from '../Prompt/controllers'
import { HandleError } from '../../responses/error/HandleError'
// import mongoose from 'mongoose'

import { userColors } from '../../utils/Authentication/function/userColors'
import crypto from 'crypto'
import { sendEmail } from '../../utils/Nodemailer/functions/sendEmail'
import mongoose from 'mongoose'
import { HandleSuccess } from '../../responses/success/HandleSuccess'

interface ChattoBlock {
    message: string
    usernameDisplay: string
    color: string
}

export let currentChattoes: Array<string> = []
let chattoBlock: Array<ChattoBlock> = []

interface SendBody {
    message: string
}

// NOT FINAL
export const getMessages = async (req: Request, res: Response) => {
    const chatto = await Commentary.find({ fromChatto: true }).lean().populate({
        path: 'user_id',
        select: 'usernameDisplay -_id color'
    }).select('user_id message usernameDisplayNOTAUTH colorNOTAUTH -_id').limit(70).sort({ createdAt: -1 })

    HandleSuccess.Ok(res, chatto)
}
// NOT FINAL

export const clearChattoes = () => { currentChattoes = [] }

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const body: SendBody = req.body
    const { user_id } = res.locals

    const user = await User.findById(user_id)
    if (!user) return next(HandleError.BadRequest("User doesn't exist"))

    const NewChatto = new Commentary({
        user_id,
        message: body.message,
        fromChatto: true
    })

    if (process.env.NODE_ENV !== 'development') sendEmail('boremine.business@gmail.com', `Chatto FROM: ${user.usernameDisplay}`, body.message)

    NewChatto.save()

    user.commentaries.push(NewChatto)
    await user.save()

    if (state !== 'wait') currentChattoes.push(NewChatto._id.toString())

    chattoBlock.push({ message: body.message, usernameDisplay: user.usernameDisplay, color: user.color })

    HandleSuccess.Ok(res, 'Message Posted')
}

interface SendBodyNotAuthenticated {
    message: string
    naid: string
    nact: number
}

export const sendMessageNotAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const body: SendBodyNotAuthenticated = req.body

    const usernameDisplay = await crypto.createHash('sha256').update(body.naid).digest('hex').slice(0, 5)

    const NewChatto = new Commentary({
        user_id: new mongoose.Types.ObjectId('111111111111111111111111'),
        usernameDisplayNOTAUTH: `(${usernameDisplay})`,
        colorNOTAUTH: userColors[body.nact - 1],
        message: body.message,
        fromChatto: true
    })

    if (process.env.NODE_ENV !== 'development') sendEmail('boremine.business@gmail.com', `Chatto FROM: ${usernameDisplay}`, body.message)

    NewChatto.save()

    chattoBlock.push({ message: body.message, usernameDisplay: `(${usernameDisplay})`, color: userColors[body.nact - 1] })

    HandleSuccess.Ok(res, 'Message Posted')
}

export const displayChatto = (io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    setInterval(() => {
        if (chattoBlock.length) {
            io.emit('chatto', chattoBlock)
            chattoBlock = []
        }
    }, 500)
}
