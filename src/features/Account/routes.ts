import { Router } from 'express'
import { authorize } from '../../utils/Authorize/middleware/verifyToken'

import {
    accountChangeUsername as accountChangeUsername_SANITIZE,
    accountChangeEmail as accountChangeEmail_SANITIZE,
    accountChangePassword as accountChangePassword_SANITIZE,
    accountDeleteDevice as accountDeleteDevice_SANITIZE,
    deleteAccount as deleteAccount_SANITIZE
} from './sanitize'

import {
    accountChangeUsername as accountChangeUsername_VALIDATOR,
    accountChangeEmail as accountChangeEmail_VALIDATOR,
    accountChangePassword as accountChangePassword_VALIDATOR,
    deleteAccount as deleteAccount_VALIDATOR
} from './validators'

import {
    accountChangeUsername as accountChangeUsername_CONTROLLER,
    accountChangeEmailRequest as accountChangeEmailRequest_CONTROLLER,
    accountChangePassword as accountChangePassword_CONTROLLER,
    accountDeleteDevice as accountDeleteDevice_CONTROLLER,
    deleteAccount as deleteAccount_CONTROLLER
} from './controllers'

const router: Router = Router()

router.post('/change/username', authorize, accountChangeUsername_SANITIZE, accountChangeUsername_VALIDATOR, accountChangeUsername_CONTROLLER)
router.post('/change/email', authorize, accountChangeEmail_SANITIZE, accountChangeEmail_VALIDATOR, accountChangeEmailRequest_CONTROLLER)
router.post('/change/password', authorize, accountChangePassword_SANITIZE, accountChangePassword_VALIDATOR, accountChangePassword_CONTROLLER)

router.delete('/device/delete/:id', authorize, accountDeleteDevice_SANITIZE, accountDeleteDevice_CONTROLLER)

router.delete('/delete', authorize, deleteAccount_SANITIZE, deleteAccount_VALIDATOR, deleteAccount_CONTROLLER)

export default router
