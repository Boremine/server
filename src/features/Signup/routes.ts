import { Router } from 'express'
const router: Router = Router()
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 40000,
	max: 30,
	standardHeaders: true,
	message: 'To many requests, wait a moment',
})

import {
	signupRequest as signupRequest_CONTROLLER,
} from './controllers'

import {
	signupRequest as signupRequest_VALIDATOR
} from './validators'


import {
	signupRequest as signup_SANITIZE,
} from './sanitize'


router.post('/request', limiter, signup_SANITIZE, signupRequest_VALIDATOR, signupRequest_CONTROLLER)




export default router