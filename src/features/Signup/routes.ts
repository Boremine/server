import { Router } from 'express'
// import rateLimit from 'express-rate-limit'

import {
	signupRequest as signupRequest_CONTROLLER
} from './controllers'

import {
	signupRequest as signupRequest_VALIDATOR
} from './validators'

import {
	signupRequest as signup_SANITIZE
} from './sanitize'

const router: Router = Router()

// const limiter = rateLimit({
// 	windowMs: 40000,
// 	max: 30,
// 	standardHeaders: true,
// 	message: 'To many requests, wait a moment'
// })

router.post('/request', signup_SANITIZE, signupRequest_VALIDATOR, signupRequest_CONTROLLER)

export default router
