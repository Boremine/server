import { Router } from 'express'

import {
    postPrompt as postPrompt_CONTROLLER,
    latestPrompt as lastestPrompt_CONTROLLER,
    votePrompt as votePrompt_CONTROLLER,
    getLine as getLine_CONTROLLER,
    updatePrompt as updatePrompt_CONTROLLER,
    deletePrompt as deletePrompt_CONTROLLER,

    postPromptNotAuthenticated as postPromptNotAuthenticated_CONTROLLER
} from './controllers'

import {
    postPrompt as postPrompt_VALIDATOR,
    votePrompt as votePrompt_VALIDATOR,
    updatePrompt as updatePrompt_VALIDATOR,
    deletePrompt as deletePrompt_VALIDATOR,

    postPromptNotAuthenticated as postPromptNotAuthenticated_VALIDATOR
} from './validators'

import {
    postPrompt as postPrompt_SANITIZE,
    votePrompt as votePrompt_SANITIZE,
    updatePrompt as updatePrompt_SANITIZE,

    postPromptNotAuthenticated as postPromptNotAuthenticate_SANITIZE
} from './sanitize'

import {
    authorize
} from '../../utils/Authorize/middleware/verifyToken'

const router: Router = Router()

router.post('/post', authorize, postPrompt_SANITIZE, postPrompt_VALIDATOR, postPrompt_CONTROLLER)
router.post('/post/notAuthenticated', postPromptNotAuthenticate_SANITIZE, postPromptNotAuthenticated_VALIDATOR, postPromptNotAuthenticated_CONTROLLER)

router.put('/update', authorize, updatePrompt_SANITIZE, updatePrompt_VALIDATOR, updatePrompt_CONTROLLER)
router.delete('/delete', authorize, deletePrompt_VALIDATOR, deletePrompt_CONTROLLER)
router.post('/vote', authorize, votePrompt_SANITIZE, votePrompt_VALIDATOR, votePrompt_CONTROLLER)
router.get('/latest', lastestPrompt_CONTROLLER)
router.get('/line', getLine_CONTROLLER)

// router.get('/info', authorize, getPromptInfo_CONTROLLER)

export default router
