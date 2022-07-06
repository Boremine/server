import { Router } from 'express'

import {
    logout as logout_CONTROLLER
} from './controllers'

// import { authorize } from '../../utils/Authorize/middleware/verifyToken'

const router: Router = Router()

router.post('/', logout_CONTROLLER)

export default router
