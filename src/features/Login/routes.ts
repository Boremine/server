import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { createClient } from 'redis'

import { compareLogs } from '../../utils/Logs/middleware/compareLogs'

import {
    loginTry as loginTry_SANITIZE
} from './sanitize'

import {
    loginTry as loginTry_VALIDATORS
} from './validators'

import {
    loginTry as loginTry_CONTROLLER
} from './controllers'

// const client = createClient({ url: process.env.REDIS_CONNECTION, password: process.env.REDIS_PASSWORD, username: process.env.REDIS_USERNAME })
// client.connect()
// client.on('connect', () => {
//     console.log('Redis Connected (Login/Try)')
// })
// client.on('error', (error) => {
//     console.error(error)
// })

// const loginTry_LIMITER = rateLimit({
//     windowMs: 10000,
//     max: 5,
//     standardHeaders: true,
//     message: 'To many requests, wait a moment',
//     keyGenerator: (request, response) => `login ${response.locals.user_id} ${request.useragent?.ip}`,
//     store: new RedisStore({
//         sendCommand: (...args: string[]) => client.sendCommand(args)
//     })
// })

const router: Router = Router()

router.post('/try', loginTry_SANITIZE, loginTry_VALIDATORS, compareLogs, loginTry_CONTROLLER)

export default router
