import { Router } from 'express'
const router: Router = Router()

import {
    postPrompt as postPrompt_CONTROLLER,
    latestPrompt as lastestPrompt_CONTROLLER
} from './controllers'


import {
    authenticate 
} from '../../utils/Authenticate/middleware/verifyToken'


router.post('/post', authenticate, postPrompt_CONTROLLER)
router.get('/latest', lastestPrompt_CONTROLLER)


export default router