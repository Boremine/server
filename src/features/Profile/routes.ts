import { Router } from 'express'
const router: Router = Router()

import {
    // profileAdd as profileAdd_CONTROLLER,
    profileGet as profileGet_CONTROLLER
} from './controller'

import {
    authorize 
} from '../../utils/Authorize/middleware/verifyToken'




// router.post('/add', authorize, profileAdd_CONTROLLER)
router.get('/get', authorize, profileGet_CONTROLLER)


export default router