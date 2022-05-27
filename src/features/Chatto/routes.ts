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
    authorize 
} from '../../utils/Authorize/middleware/verifyToken'


router.post('/post', authorize, sendMessage_SANITIZE, sendMessage_VALIDATOR, sendMessage_CONTROLLER)


export default router