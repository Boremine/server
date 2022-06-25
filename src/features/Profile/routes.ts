import { Router } from 'express'

import {
    // profileAdd as profileAdd_CONTROLLER,
    profileGet as profileGet_CONTROLLER
} from './controller'

// import {
//     authorize
// } from '../../utils/Authorize/middleware/verifyToken'

const router: Router = Router()

// router.post('/add', authorize, profileAdd_CONTROLLER)
router.get('/get', profileGet_CONTROLLER)

export default router
