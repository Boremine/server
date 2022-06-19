import { Router } from 'express'

import {
    getAuth as getAuth_CONTROLLER
} from './controller'

import {
    authorize
} from '../../utils/Authorize/middleware/verifyToken'

const router: Router = Router()

router.get('/', authorize, getAuth_CONTROLLER)

export default router
