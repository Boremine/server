import { Router } from 'express'

import {
    getMural as getMural_CONTROLLER,
    getOnePromptInfo as getOnePromptInfo_CONTROLLER,
    getOnePromptComments as getOnePromptComments_CONTROLLER,
    markPrompt as markPrompt_CONTROLLER
} from './controllers'

import {
    markPrompt as markPrompt_VALIDATOR
} from './validators'

import {
    getOnePromptInfo as getOnePromptInfo_SANITIZE,
    getOnePromptComments as getOnePromptComments_SANITIZE,
    markPrompt as markPrompt_SANITIZE
} from './sanitize'

import { authorize } from '../../utils/Authorize/middleware/verifyToken'

const router: Router = Router()

router.get('/', getMural_CONTROLLER)
router.get('/:id', getOnePromptInfo_SANITIZE, getOnePromptInfo_CONTROLLER)
router.get('/comments/:id', getOnePromptComments_SANITIZE, getOnePromptComments_CONTROLLER)

router.put('/mark/:id', authorize, markPrompt_SANITIZE, markPrompt_VALIDATOR, markPrompt_CONTROLLER)

export default router
