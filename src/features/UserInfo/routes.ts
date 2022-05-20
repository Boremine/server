import { Router } from 'express'
const router: Router = Router()

import {
    userInfo as userInfo_CONTROLLER
} from './controller'

import {
    authenticate 
} from '../../utils/Authenticate/middleware/verifyToken'




router.get('/', authenticate, userInfo_CONTROLLER)


export default router