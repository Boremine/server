import { Router } from 'express'

import {
    refreshToken as refreshToken_CONTROLLER
} from './controller'

import {
    refreshToken as refreshToken_VALIDATOR
} from './validators'

const router: Router = Router()

router.get('/', refreshToken_VALIDATOR, refreshToken_CONTROLLER)

export default router
