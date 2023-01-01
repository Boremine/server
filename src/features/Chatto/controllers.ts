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

    NewChatto.save()

    user.commentaries.push(NewChatto)
    await user.save()

    if (state !== 'wait') currentChattoes.push(NewChatto._id.toString())

    chattoBlock.push({ message: body.message, usernameDisplay: user.usernameDisplay, color: user.color })

    res.sendStatus(200)
}

interface SendBodyNotAuthenticated {
    message: string
    naid: string
    nact: number
}

export const sendMessageNotAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const body: SendBodyNotAuthenticated = req.body

    const usernameDisplay = await crypto.createHash('sha256').update(body.naid).digest('hex')

    chattoBlock.push({ message: body.message, usernameDisplay: `(${usernameDisplay.slice(0, 5)})`, color: userColors[body.nact - 1] })

    res.sendStatus(200)
}

export const displayChatto = (io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    setInterval(() => {
        if (chattoBlock.length) {
            io.emit('chatto', chattoBlock)
            chattoBlock = []
        }
    }, 500)
}
