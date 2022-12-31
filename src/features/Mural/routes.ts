import { Router } from 'express'

import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { createClient } from 'redis'

import {
    getMural as getMural_CONTROLLER,
    getOnePieceInfo as getOnePieceInfo_CONTROLLER,
    getOnePieceComments as getOnePieceComments_CONTROLLER,
    markPiece as markPiece_CONTROLLER,
    addComment as addComment_CONTROLLER,
    markComment as markComment_CONTROLLER
} from './controllers'

import {
    getMural as getMural_VALIDATOR,
    markPiece as markPiece_VALIDATOR,
    addComment as addComment_VALIDATOR,
    markComment as markComment_VALIDATOR,
    getOnePieceComments as getOnePieceComments_VALIDATOR
} from './validators'

import {
    getMural as getMural_SANITIZE,
    getOnePieceInfo as getOnePieceInfo_SANITIZE,
    getOnePieceComments as getOnePieceComments_SANITIZE,
    markPiece as markPiece_SANITIZE,
    addComment as addComment_SANITIZE,
    markComment as markComment_SANITIZE
} from './sanitize'

import { authorize, authorizeNotRequired } from '../../utils/Authorize/middleware/verifyToken'

const client = createClient({ url: process.env.REDIS_CONNECTION, password: process.env.REDIS_PASSWORD, username: process.env.REDIS_USERNAME })
client.connect()
client.on('connect', () => {
    console.log('Redis Connected (Mural/AddComment)')
})
client.on('error', (error) => {
    console.error(error)
})

const addComment_LIMITER = rateLimit({
    windowMs: 20000,
    max: 1,
    standardHeaders: true,
    message: 'To many requests, wait a moment',
    keyGenerator: (request, response) => `piece ${response.locals.user_id} ${request.useragent?.ip}`,
    store: new RedisStore({
        sendCommand: (...args: string[]) => client.sendCommand(args)
    })
})

const router: Router = Router()

router.get('/', getMural_SANITIZE, getMural_VALIDATOR, getMural_CONTROLLER)
router.get('/:piece_id', getOnePieceInfo_SANITIZE, getOnePieceInfo_CONTROLLER)

router.get('/:piece_id/comments', authorizeNotRequired, getOnePieceComments_SANITIZE, getOnePieceComments_VALIDATOR, getOnePieceComments_CONTROLLER)

router.put('/:piece_id/mark', authorize, markPiece_SANITIZE, markPiece_VALIDATOR, markPiece_CONTROLLER)

router.post('/:piece_id/comments/add', authorize, addComment_LIMITER, addComment_SANITIZE, addComment_VALIDATOR, addComment_CONTROLLER)
router.put('/comment/:comment_id/mark', authorize, markComment_SANITIZE, markComment_VALIDATOR, markComment_CONTROLLER)

export default router
