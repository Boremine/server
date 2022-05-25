import { Request, Response, NextFunction } from 'express'
import socketIO from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import Prompt from '../../models/prompt'
import User from '../../models/user'

import { HandleSuccess } from '../../responses/success/HandleSuccess'

export const postPrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, username } = res.locals
    const { text } = req.body


    const NewPrompt = new Prompt({
        user_id,
        text
    })

    let promptCreated = await NewPrompt.save()

    await User.findByIdAndUpdate(user_id, { prompt: promptCreated._id })


    HandleSuccess.Created(res, 'Prompt in Line')

}

export const latestPrompt = async (req: Request, res: Response, next: NextFunction) => {
    let prompt = await Prompt.findOne().populate('user_id', 'username').select('text')
    if (!prompt) return HandleSuccess.Ok(res, 'No latest Prompt')

    HandleSuccess.Ok(res, { username: prompt.user_id.username, text: prompt?.text })
}


export const promptDisplay = async (io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {

    let prompt = await Prompt.findOne().populate('user_id', 'username').select('text')

    if (!prompt) {
        console.log('hello')
        setTimeout(() => {
            promptDisplay(io)
        }, 10000)
        return

    }


    let promptEmit = {
        username: prompt?.user_id.username,
        text: prompt?.text
    }

    console.log(promptEmit)
    io.emit('prompt', promptEmit)

    let timer = 10


    let interval = setInterval(async() => {
        console.log(timer)
        io.emit('timer', timer)
        timer--
        if (timer == -1) {
            clearInterval(interval)
            await prompt?.delete()
            promptDisplay(io)
            return
        }
    }, 1000);

    // while (timer > 0) {
    //     io.emit('timer', timer)
    //     timer++
    // }



    // setTimeout(async() => {
    
    // }, 10000);






}