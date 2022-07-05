import { Request, Response, NextFunction } from 'express'
import socketIO from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import User from '../../models/user'
import Chatto from '../../models/chatto'

import { state } from '../Prompt/controllers'
import { HandleError } from '../../responses/error/HandleError'

interface ChattoBlock {
    message: string
    username: string
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
    const { user_id, username } = res.locals

    const user = await User.findById(user_id)
    if (!user) return next(HandleError.BadRequest("User doesn't exist"))

    const NewChatto = new Chatto({
        user_id,
        message: body.message
    })

    NewChatto.save()

    user.chatties.push(NewChatto)
    await user.save()

    if (state !== 'wait') currentChattoes.push(NewChatto._id.toString())

    chattoBlock.push({ message: body.message, username, color: user.color })

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
