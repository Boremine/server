import { Router } from 'express'
const router: Router = Router()

import {
    postPrompt as postPrompt_CONTROLLER,
    latestPrompt as lastestPrompt_CONTROLLER,
    votePrompt as votePrompt_CONTROLLER,
    getLine as getLine_CONTROLLER
} from './controllers'

import {
    postPrompt as postPrompt_VALIDATOR,
    votePrompt as votePrompt_VALIDATOR
} from './validators'


import {
    postPrompt as postPrompt_SANITIZE,
    votePrompt as votePrompt_SANITIZE
} from './sanitize'


import {
    authorize,
} from '../../utils/Authorize/middleware/verifyToken'


router.post('/post', authorize, postPrompt_SANITIZE, postPrompt_VALIDATOR, postPrompt_CONTROLLER)

router.post('/vote', authorize, votePrompt_SANITIZE, votePrompt_VALIDATOR, votePrompt_CONTROLLER)

router.get('/latest', lastestPrompt_CONTROLLER)

router.get('/line', getLine_CONTROLLER)


export default router