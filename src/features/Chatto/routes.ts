import { Router } from 'express'

import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { createClient } from 'redis'

import {
    sendMessage as sendMessage_CONTROLLER
} from './controllers'

import {
    sendMessage as sendMessage_VALIDATOR
} from './validators'

import {
    sendMessage as sendMessage_SANITIZE
} from './sanitize'

import {
    authorize
} from '../../utils/Authorize/middleware/verifyToken'

const client = createClient({ url: process.env.REDIS_CONNECTION, password: process.env.REDIS_PASSWORD, username: process.env.REDIS_USERNAME })
client.connect()
client.on('connect', () => {
    console.log('Redis Connected (Chatto/Post)')
})

const sendMessage_LIMITER = rateLimit({
    windowMs: 3000,
    max: 1,
    standardHeaders: true,
    message: 'To many requests, wait a moment',
    keyGenerator: (request, response) => `${response.locals.user_id} ${request.useragent?.ip}`,
    store: new RedisStore({
        sendCommand: (...args: string[]) => client.sendCommand(args)
    })
})

const router: Router = Router()

router.post('/post', authorize, sendMessage_LIMITER, sendMessage_SANITIZE, sendMessage_VALIDATOR, sendMessage_CONTROLLER)

export default router
