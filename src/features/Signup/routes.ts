import { Router } from 'express'

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

router.post('/request', signup_SANITIZE, signupRequest_VALIDATOR, signupRequest_CONTROLLER)

export default router
