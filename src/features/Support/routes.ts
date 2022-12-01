import { Router } from 'express'
import { authorize } from '../../utils/Authorize/middleware/verifyToken'

import {
    support as support_SANITIZE
} from './sanitize'

import {
    authenticated as authenticated_VALIDATOR,
    notAuthenticated as notAuthenticated_VALIDATOR
} from './validators'

import {
    support as support_CONTROLLER
} from './controller'

const router: Router = Router()

router.post('/authenticated', authorize, support_SANITIZE, authenticated_VALIDATOR, support_CONTROLLER)
router.post('/notAuthenticated', support_SANITIZE, notAuthenticated_VALIDATOR, support_CONTROLLER)

export default router
