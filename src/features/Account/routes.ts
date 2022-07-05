import { Router } from 'express'
import { authorize } from '../../utils/Authorize/middleware/verifyToken'

// import {
//     accountInfo as accountInfo_SANITIZE
// } from './sanitize'

// import {
//     accountInfo as accountInfo_VALIDATORS
// } from './validators'

import {
    accountInfo as accountInfo_CONTROLLER
} from './controllers'

const router: Router = Router()

router.get('/info', authorize, accountInfo_CONTROLLER)

export default router
