import { Router } from 'express'
// import rateLimit from 'express-rate-limit'
// import RedisStore from 'rate-limit-redis'

import {
    forgotRequest as forgotRequest_CONTROLLER,
    forgotValidate as forgotValidate_CONTROLLER,
    forgotConfirm as forgotConfirm_CONTROLLER
} from './controllers'

import {
    forgotRequest as forgotRequest_VALIDATOR,
    forgotValidate as forgotValidate_VALIDATOR,
    forgotConfirm as forgotConfirm_VALIDATOR
} from './validators'

import {
    forgotRequest as forgotRequest_SANITIZE,
    forgotValidate as forgotValidate_SANITIZE,
    forgotConfirm as forgotConfirm_SANITIZE
} from './sanitize'
// import clientRedis from '../../utils/Redis'

// const forgotRequest_LIMITER = rateLimit({
//     windowMs: 30000,
//     max: 20,
//     standardHeaders: true,
//     message: 'To many requests, wait a moment',
//     keyGenerator: (request, response) => `forgot ${response.locals.user_id} ${request.useragent?.ip}`,
//     store: new RedisStore({
//         sendCommand: async (...args: string[]) => (await clientRedis).sendCommand(args)
//     })
// })

const router: Router = Router()

router.post('/request', forgotRequest_SANITIZE, forgotRequest_VALIDATOR, forgotRequest_CONTROLLER)
router.get('/validate/:token', forgotValidate_SANITIZE, forgotValidate_VALIDATOR, forgotValidate_CONTROLLER)
router.post('/confirm/:token', forgotConfirm_SANITIZE, forgotConfirm_VALIDATOR, forgotConfirm_CONTROLLER)

export default router
