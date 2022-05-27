import { Router } from 'express'
const router: Router = Router()
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 40000,
	max: 30,
	standardHeaders: true,
	message: 'To many requests, wait a moment',
})

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




router.post('/try', limiter, loginTry_SANITIZE, loginTry_VALIDATORS, compareLogs, loginTry_CONTROLLER)



export default router