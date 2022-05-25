import { Router } from 'express'
const router: Router = Router()

import {
    // profileAdd as profileAdd_CONTROLLER,
    profileGet as profileGet_CONTROLLER
} from './controller'

import {
    authenticate 
} from '../../utils/Authenticate/middleware/verifyToken'




// router.post('/add', authenticate, profileAdd_CONTROLLER)
router.get('/get', authenticate, profileGet_CONTROLLER)


export default router