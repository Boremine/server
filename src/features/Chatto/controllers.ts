import { Request, Response, NextFunction } from 'express'
import { HandleSuccess } from '../../responses/success/HandleSuccess'
import socketIO from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import User from '../../models/user'
import Chatto from '../../models/chatto'

import { currentPrompt, state } from '../Prompt/controllers'
import { HandleError } from '../../responses/error/HandleError'


interface ChattoBlock {
    message: string
    username: string
    color: string
}

export let currentChattoes: Array<string> = []
let chattoBlock: Array<ChattoBlock> = []

interface Body {
    message: string
}

export const clearChattoes = () => currentChattoes = []


export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    
    const body: Body = req.body
    const { user_id, username } = res.locals

    const io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = req.app.get('socketio')


    const NewChatto = new Chatto({
        user_id,
        message: body.message,
    })

    NewChatto.save()
    const user = await User.findById(user_id)
    if (!user) return next(HandleError.BadRequest("User doesn't exist"))

    user.chatties.push(NewChatto)
    await user.save()

    if (state !== 'wait') currentChattoes.push(NewChatto._id.toString())


    // currentChattoes.push()
    chattoBlock.push({ message: body.message, username, color: user.color })
    // io.emit('chatto', {message: body.message, username})




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