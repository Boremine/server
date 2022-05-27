import { Router } from 'express'
const router: Router = Router()


import {
    refreshToken as refreshToken_CONTROLLER
} from './controller'

import {
    refreshToken as refreshToken_VALIDATOR
} from './validators'

router.get('/', refreshToken_VALIDATOR, refreshToken_CONTROLLER)


export default router