import { Router } from 'express'

import {
    verificationValidate as verificationValidate_CONTROLLER,
    verificationConfirm as verificationConfirm_CONTROLLER
} from './controllers'

import {
    verificationValidate as verificationValidate_VALIDATOR,
    verificationConfirm as verificationConfirm_VALIDATOR
} from './validators'

import {
    verificationValidate as verificationValidate_SANITIZE,
    verificationConfirm as verificationConfirm_SANITIZE
} from './sanitize'

const router: Router = Router()

router.get('/validate/:path', verificationValidate_SANITIZE, verificationValidate_VALIDATOR, verificationValidate_CONTROLLER)
router.post('/confirm/:path', verificationConfirm_SANITIZE, verificationConfirm_VALIDATOR, verificationConfirm_CONTROLLER)

export default router
