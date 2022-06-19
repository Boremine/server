
import { Request, Response, NextFunction } from 'express'
import socketIO from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import Prompt from '../../models/prompt'
import Chatto from '../../models/chatto'
import User from '../../models/user'
import Mural from '../../models/mural'

import { HandleSuccess } from '../../responses/success/HandleSuccess'

import { currentChattoes, clearChattoes } from '../Chatto/controllers'
import { CurrentPrompt } from './classes'

const promptColors: Array<string> = ['#fcba03', '#158eeb', '#1520eb', '#8415eb', '#d915eb', '#eb15b2', '#eb1579', '#eb152e', '#eb7c15', '#ebab15', '#d2eb15', '#72eb15', '#15eb15']
let currentPrompt: CurrentPrompt | undefined
export let state: 'display' | 'end_fail' | 'end_pass' | 'wait' = 'wait'
let promptGoTo: 'notPass' | 'Pass'

let interval: NodeJS.Timer

export const getLine = async (req: Request, res: Response, next: NextFunction) => {
    const line = await Prompt.find({}).lean().populate('user_id', 'username -_id').select('color')

    HandleSuccess.Ok(res, line)
}

export const postPrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, username } = res.locals
    const { text, title } = req.body

    const io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = req.app.get('socketio')

    const NewPrompt = new Prompt({
        user_id,
        text,
        title,
        color: promptColors[Math.floor(Math.random() * promptColors.length)]
    })

    const promptCreated = await NewPrompt.save()

    await User.findByIdAndUpdate(user_id, { prompt_id: promptCreated._id })

    io.emit('line', { _id: NewPrompt._id, color: NewPrompt.color, user_id: { username } })

    HandleSuccess.Created(res, 'Prompt in Line')
}

export const latestPrompt = async (req: Request, res: Response, next: NextFunction) => {
    HandleSuccess.Ok(res, { ...currentPrompt?.getPrompt(), state })
}

const waitState = async (io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    state = 'wait'
    io.emit('prompt', {
        body: {
            text: '',
            username: '',
            title: ''
        },
        countDown: 0,
        voteScale: 0,
        state,
        nextPrompt: true
    })

    if (promptGoTo === 'Pass') {
        const NewMural = new Mural({
            text: currentPrompt?.body.text,
            user_id: currentPrompt?.user_id,
            pops: currentPrompt?.voting.pops,
            drops: currentPrompt?.voting.drops,
            chattoes: currentChattoes
        })

        await NewMural.save()

        const user = await User.findById(currentPrompt?.user_id)
        user?.mural.push(NewMural)
        await user?.save()

        await Chatto.updateMany({ _id: { $in: currentChattoes } }, { mural_id: NewMural._id })

        clearChattoes()
    }

    await User.updateMany({ $or: [{ alreadyVoted: 'pop' }, { alreadyVoted: 'drop' }] }, { alreadyVoted: false })

    await Prompt.findByIdAndDelete(currentPrompt?.prompt_id)

    currentPrompt = undefined

    return setTimeout(() => {
        displayPrompt(io)
    }, 5000)
}

const endState = async (io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, statee: 'end_fail' | 'end_pass') => {
    state = statee
    switch (state) {
        case 'end_pass':
            promptGoTo = 'Pass'
            break
        case 'end_fail':
            promptGoTo = 'notPass'
            break
    }
    io.emit('prompt', { ...currentPrompt?.getPromptEmit(), state })

    clearInterval(interval)

    setTimeout(() => {
        return waitState(io)
    }, 3000)
}

export const votePrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { option } = res.locals

    const io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = req.app.get('socketio')

    switch (option) {
        case 'pop':
            currentPrompt?.increasePops()
            if ((currentPrompt!.voting.pops - currentPrompt!.voting.drops) >= currentPrompt!.majorityConnections) {
                state = 'end_pass'
                io.emit('prompt', { ...currentPrompt?.getPromptEmit(), state })
            }
            break
        case 'drop':
            currentPrompt?.increaseDrops()
            if ((currentPrompt!.voting.drops - currentPrompt!.voting.pops) >= currentPrompt!.majorityConnections) {
                endState(io, 'end_fail')
            }
            break
    }

    io.emit('votingScale', currentPrompt?.getVotingScale())

    HandleSuccess.Ok(res, 'Vote successful')
}

export const displayPrompt = async (io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    const prompt = await Prompt.findOne().populate('user_id', 'username').select('text color title')

    if (!prompt) {
        setTimeout(() => {
            displayPrompt(io)
        }, 10000)
        return
    }

    state = 'display'
    currentPrompt = new CurrentPrompt({
        prompt_id: prompt._id.toString(),
        user_id: prompt.user_id._id,
        body: {
            title: prompt.title,
            username: prompt.user_id.username,
            text: prompt.text
        },
        countDown: 30,
        voting: {
            pops: 0,
            drops: 0
        },
        barColor: prompt.color
    })

    io.emit('prompt', { ...currentPrompt.getPrompt(), state })

    interval = setInterval(async () => {
        currentPrompt?.updateCountDown()
        if (currentPrompt!.getCountDown() < 0) {
            if (state === 'end_pass' || currentPrompt!.voting.pops > currentPrompt!.voting.drops) {
                return endState(io, 'end_pass')
            } else {
                return endState(io, 'end_fail')
            }
        }

        io.emit('prompt', { ...currentPrompt?.getPromptEmit(), state })
    }, 1000)
}
