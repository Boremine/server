import { Router } from 'express'

// import rateLimit from 'express-rate-limit'
// import RedisStore from 'rate-limit-redis'

import {
    sendMessage as sendMessage_CONTROLLER,
    sendMessageNotAuthenticated as sendMessageNotAuthenticated_CONTROLLER,
    getMessages as getMessages_CONTROLLER
} from './controllers'

import {
    sendMessage as sendMessage_VALIDATOR,
    sendMessageNotAuthenticated as sendMessageNotAuthenticated_VALIDATOR
} from './validators'

import {
    sendMessage as sendMessage_SANITIZE,
    sendMessageNotAuthenticated as sendMessageNotAuthenticated_SANITIZE
} from './sanitize'

import {
    authorize
} from '../../utils/Authorize/middleware/verifyToken'
// import clientRedis from '../../utils/Redis'

// const sendMessage_LIMITER = rateLimit({
//     windowMs: 3000,
//     max: 1,
//     standardHeaders: true,
//     message: 'To many requests, wait a moment',
//     keyGenerator: (request, response) => `chatto ${response.locals.user_id} ${request.useragent?.ip}`,
//     store: new RedisStore({
//         sendCommand: async (...args: string[]) => (await clientRedis).sendCommand(args)
//     })
// })

const router: Router = Router()

router.get('/get', getMessages_CONTROLLER)

router.post('/post', authorize, sendMessage_SANITIZE, sendMessage_VALIDATOR, sendMessage_CONTROLLER)

router.post('/post/notAuthenticated', sendMessageNotAuthenticated_SANITIZE, sendMessageNotAuthenticated_VALIDATOR, sendMessageNotAuthenticated_CONTROLLER)

export default router
