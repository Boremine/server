import { Router } from 'express'
import { authorize } from '../../utils/Authorize/middleware/verifyToken'

import {
    accountChangeUsername as accountChangeUsername_SANITIZE,
    accountChangeEmail as accountChangeEmail_SANITIZE,
    accountChangePassword as accountChangePassword_SANITIZE,
    accountDeleteDevice as accountDeleteDevice_SANITIZE
} from './sanitize'

import {
    accountChangeUsername as accountChangeUsername_VALIDATOR,
    accountChangeEmail as accountChangeEmail_VALIDATOR,
    accountChangePassword as accountChangePassword_VALIDATOR
} from './validators'

import {
    accountChangeUsername as accountChangeUsername_CONTROLLER,
    accountChangeEmailRequest as accountChangeEmailRequest_CONTROLLER,
    accountChangePassword as accountChangePassword_CONTROLLER,
    accountDeleteDevice as accountDeleteDevice_CONTROLLER
} from './controllers'

const router: Router = Router()

// router.get('/info', authorize, accountInfo_CONTROLLER)

router.post('/change/username', authorize, accountChangeUsername_SANITIZE, accountChangeUsername_VALIDATOR, accountChangeUsername_CONTROLLER)
router.post('/change/email', authorize, accountChangeEmail_SANITIZE, accountChangeEmail_VALIDATOR, accountChangeEmailRequest_CONTROLLER)
router.post('/change/password', authorize, accountChangePassword_SANITIZE, accountChangePassword_VALIDATOR, accountChangePassword_CONTROLLER)

router.delete('/device/delete/:id', authorize, accountDeleteDevice_SANITIZE, accountDeleteDevice_CONTROLLER)

export default router
