import { Router } from 'express'
const router: Router = Router()


import {
    sendMessage as sendMessage_CONTROLLER
} from './controllers'

import {
    sendMessage as sendMessage_VALIDATOR
} from './validators'

import {
    sendMessage as sendMessage_SANITIZE
} from './sanitize'


import {
    authenticate 
} from '../../utils/Authenticate/middleware/verifyToken'


router.post('/post', authenticate, sendMessage_SANITIZE, sendMessage_VALIDATOR, sendMessage_CONTROLLER)


export default router