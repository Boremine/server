import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

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

import clientRedis from '../../utils/Redis'

const loginTry_LIMITER = rateLimit({
    windowMs: 10000,
    max: 5,
    standardHeaders: true,
    message: 'To many requests, wait a moment',
    keyGenerator: (request, response) => `login ${response.locals.user_id} ${request.useragent?.ip}`,
    store: new RedisStore({
        sendCommand: async (...args: string[]) => (await clientRedis).sendCommand(args)
    })
})

const router: Router = Router()

router.post('/try', loginTry_LIMITER, loginTry_SANITIZE, loginTry_VALIDATORS, compareLogs, loginTry_CONTROLLER)

export default router
