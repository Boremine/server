import { Router } from 'express'
const router: Router = Router()

import {
    postPrompt as postPrompt_CONTROLLER,
    latestPrompt as lastestPrompt_CONTROLLER
} from './controllers'


import {
    authorize 
} from '../../utils/Authorize/middleware/verifyToken'


router.post('/post', authorize, postPrompt_CONTROLLER)
router.get('/latest', lastestPrompt_CONTROLLER)


export default router