
import { Request, Response, NextFunction } from 'express'
import socketIO from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import Prompt from '../../models/prompt'
import Commentary from '../../models/commentary'
import User from '../../models/user'
import Mural from '../../models/mural'

import { HandleSuccess } from '../../responses/success/HandleSuccess'

import { currentChattoes, clearChattoes } from '../Chatto/controllers'
import { CurrentPrompt } from './classes'
import { checkIfFirstFive } from '../../utils/Prompts/functions/checkIfFirstFive'

import mongoose from 'mongoose'
import crypto from 'crypto'

import { saveToFacebook, saveToInstagram, saveToReddit, saveToTwitter } from '../../utils/Prompts/functions/saveTo'
import { sendEmail } from '../../utils/Nodemailer/functions/sendEmail'

import fs from 'fs'
import path from 'path'
import { HandleError } from '../../responses/error/HandleError'

const promptColors: Array<string> = ['blue', 'red', 'green', 'orange', 'purple']
let currentPrompt: CurrentPrompt | undefined
export let state: 'display' | 'end_fail' | 'end_pass' | 'wait' = 'wait'
let promptGoTo: 'notPass' | 'Pass'

let interval: NodeJS.Timer

export const getLine = async (req: Request, res: Response, next: NextFunction) => {
    const line = await Prompt.find({}).lean().populate('user_id', 'usernameDisplay -_id').select('color')

    HandleSuccess.Ok(res, line)
}

export const updatePrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { title, text } = req.body
    const { prompt_id } = res.locals

    await Prompt.findByIdAndUpdate(prompt_id, { title, text })

    HandleSuccess.Ok(res, { _id: prompt_id, title, text, promptInFirstFive: false })
}

export const deletePrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { prompt_id } = res.locals

    const io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = req.app.get('socketio')

    await Prompt.findByIdAndRemove(prompt_id)

    io.emit('line', { _id: prompt_id, deletion: true })

    HandleSuccess.Ok(res, 'Prompt Deleted')
}

export const postPrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals
    const { text, title } = req.body

    const io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = req.app.get('socketio')

    const NewPrompt = new Prompt({
        user_id,
        text,
        title,
        color: promptColors[Math.floor(Math.random() * promptColors.length)]
    })

    const promptCreated = await NewPrompt.save()

    const user = await User.findByIdAndUpdate(user_id, { prompt_id: promptCreated._id })

    if (process.env.NODE_ENV !== 'development') sendEmail('boremine.business@gmail.com', `Prompt FROM: ${user?.usernameDisplay}`, `${title}\n\n${text}`)

    io.emit('line', { _id: NewPrompt._id, color: NewPrompt.color, user_id: { usernameDisplay: user?.usernameDisplay } })

    const promptInFirstFive = await checkIfFirstFive(NewPrompt._id.toString())

    HandleSuccess.Created(res, { _id: NewPrompt._id, title: NewPrompt.title, text: NewPrompt.text, promptInFirstFive })
}

export const postPromptNotAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const { text, title, naid } = req.body

    const io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = req.app.get('socketio')

    const NewPrompt = new Prompt({
        user_id: new mongoose.Types.ObjectId('111111111111111111111111'),
        text,
        title,
        color: promptColors[Math.floor(Math.random() * promptColors.length)]
    })

    NewPrompt.save()

    const usernameDisplay = await crypto.createHash('sha256').update(naid).digest('hex').slice(0, 5)

    if (process.env.NODE_ENV !== 'development') sendEmail('boremine.business@gmail.com', `Prompt FROM: ${usernameDisplay}`, `${title}\n\n${text}`)

    io.emit('line', { _id: NewPrompt._id, color: NewPrompt.color, user_id: { usernameDisplay: `(unauthenticated)` } })

    HandleSuccess.Created(res, { _id: NewPrompt._id, title: NewPrompt.title, text: NewPrompt.text })
}

export const latestPrompt = async (req: Request, res: Response, next: NextFunction) => {
    HandleSuccess.Ok(res, { ...currentPrompt?.getPrompt(), state })
}

const saveToMural = async () => {
    const NewMural = new Mural({
        title: currentPrompt?.body.title,
        text: currentPrompt?.body.text,
        user_id: currentPrompt?.user_id,
        pops: currentPrompt?.voting.pops,
        drops: currentPrompt?.voting.drops,
        commentary: currentChattoes,
        chattoes_amount: currentChattoes.length
    })

    await NewMural.save()

    if (process.env.NODE_ENV !== 'development') {
        saveToReddit(currentPrompt?.body.username!, currentPrompt?.body.title!, currentPrompt?.body.text!, NewMural._id.toString())
        saveToTwitter(currentPrompt?.body.username!, currentPrompt?.body.title!, NewMural._id.toString())
        saveToInstagram(currentPrompt?.body.username!, currentPrompt?.body.title!, currentPrompt?.body.text!, NewMural._id.toString())
        saveToFacebook(currentPrompt?.body.username!, currentPrompt?.body.title!, currentPrompt?.body.text!, NewMural._id.toString())
    }

    const user = await User.findById(currentPrompt?.user_id)
    user?.mural.push(NewMural)
    await user?.save()

    await Commentary.updateMany({ _id: { $in: currentChattoes } }, { piece_id: NewMural._id })

    clearChattoes()
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
        voteScale: {
            pops: 0,
            drops: 0,
            scale: 0
        },
        state,
        nextPrompt: true,
        barColor: 'none'
    })

    // NOTAUTHENTICATED REQUIRED
    if (promptGoTo === 'Pass' && currentPrompt?.body.username !== '(unauthenticated)') saveToMural()

    await User.updateMany({ $or: [{ alreadyVoted: 'pop' }, { alreadyVoted: 'drop' }] }, { alreadyVoted: 'none' })

    await Prompt.findByIdAndDelete(currentPrompt?.prompt_id)

    currentPrompt = undefined

    return setTimeout(() => {
        clearChattoes()
        displayPrompt(io)
    }, 5000)
}

const endState = async (io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, endState: 'end_fail' | 'end_pass') => {
    state = endState
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
            if (currentPrompt!.voting.pops >= currentPrompt!.majorityConnections) {
                state = 'end_pass'
                io.emit('prompt', { ...currentPrompt?.getPromptEmit(), state })
            }
            break
        case 'drop':
            currentPrompt?.increaseDrops()
            if (currentPrompt!.voting.drops >= currentPrompt!.majorityConnections) {
                endState(io, 'end_fail')
            }
            break
    }

    io.emit('votingScale', currentPrompt?.getVotingScale())

    HandleSuccess.Ok(res, 'Vote successful')
}

export const votePromptNotAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const { option } = res.locals

    const io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = req.app.get('socketio')

    if (currentPrompt?.getPrompt().body.username !== '(unauthenticated)') return next(HandleError.NotAcceptable(`You need to login to vote on this prompt`))

    switch (option) {
        case 'pop':
            currentPrompt?.increasePops()
            if (currentPrompt!.voting.pops >= currentPrompt!.majorityConnections) {
                state = 'end_pass'
                io.emit('prompt', { ...currentPrompt?.getPromptEmit(), state })
            }
            break
        case 'drop':
            currentPrompt?.increaseDrops()
            if (currentPrompt!.voting.drops >= currentPrompt!.majorityConnections) {
                endState(io, 'end_fail')
            }
            break
    }

    io.emit('votingScale', currentPrompt?.getVotingScale())

    HandleSuccess.Ok(res, 'Vote successful')
}

let botIteration = 0
export const displayBotPrompt = async (io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    const jsonData = fs.readFileSync(path.join(__dirname, '/opinions.json'))
    const data = JSON.parse(jsonData.toString())

    const NewPrompt = new Prompt({
        user_id: new mongoose.Types.ObjectId('111111111111111111111111'),
        text: '',
        title: data.opinions[botIteration],
        color: promptColors[Math.floor(Math.random() * promptColors.length)]
    })

    NewPrompt.save()

    io.emit('line', { _id: NewPrompt._id, color: NewPrompt.color, user_id: { usernameDisplay: `(BoremineBot)` } })

    botIteration = botIteration + 1

    if (botIteration > data.opinions.length) botIteration = 0

    setTimeout(() => {
        displayBotPrompt(io)
    }, 42000)
}

export const displayPrompt = async (io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    const prompt_ids: Array<string> = []

    const prompt = await Prompt.findOne().populate('user_id', 'usernameDisplay email').select('text color title')

    if (!prompt) {
        setTimeout(() => {
            displayPrompt(io)
        }, 10000)
        return
    }

    // NOTAUTHENTICATED REQUIRED

    const userInfo: { id: string, usernameDisplay: string } = { id: '', usernameDisplay: '' }

    if (prompt.user_id) {
        userInfo.id = prompt.user_id._id
        userInfo.usernameDisplay = prompt.user_id.usernameDisplay
    } else {
        userInfo.id = '111111111111111111111111'
        userInfo.usernameDisplay = '(unauthenticated)'
    }

    // NOTAUTHENTICATED REQUIRED

    state = 'display'
    currentPrompt = new CurrentPrompt({
        prompt_id: prompt._id.toString(),
        user_id: userInfo.id,
        body: {
            title: prompt.title,
            username: userInfo.usernameDisplay,
            text: prompt.text
        },
        countDown: 30,
        voting: {
            pops: 0,
            drops: 0
        },
        barColor: prompt.color,
        fiveLatestPrompts: prompt_ids
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
