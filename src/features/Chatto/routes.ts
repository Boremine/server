import { Router } from 'express'
const router: Router = Router()

import rateLimit from 'express-rate-limit'

import RedisStore from "rate-limit-redis";
import {createClient} from 'redis'

export const client = createClient({ url: 'redis://redis-16221.c258.us-east-1-4.ec2.cloud.redislabs.com:16221', password: 'r22PYXrhlCPWotxZaW4ZHt5T852SZeU4', username: 'default' })
client.connect()
client.on('connect', ()=>{
    console.log('Redis Connected')
})

const limiter = rateLimit({
    windowMs: 30000,
    max: 10,
    standardHeaders: true,
    message: 'To many requests, wait a moment',
    keyGenerator: (request, response) => response.locals.user_id,
    store: new RedisStore({
        sendCommand: (...args: string[]) => client.sendCommand(args),
    }),
})


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


router.post('/post', authorize, limiter, sendMessage_SANITIZE, sendMessage_VALIDATOR, sendMessage_CONTROLLER)


export default router