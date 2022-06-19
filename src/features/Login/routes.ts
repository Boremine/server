import { Router } from 'express'
import rateLimit from 'express-rate-limit'

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

const limiter = rateLimit({
	windowMs: 60000,
	max: 10,
	standardHeaders: true,
	message: 'To many requests, wait a moment'
	// keyGenerator: (request, response) => response.locals.user_id
})

const router: Router = Router()

router.post('/try', limiter, loginTry_SANITIZE, loginTry_VALIDATORS, compareLogs, loginTry_CONTROLLER)

export default router
