import { Router } from 'express'
const router: Router = Router()

import {
    getAuth as getAuth_CONTROLLER,
} from './controller'

import {
    authenticate 
} from '../../utils/Authenticate/middleware/verifyToken'




router.get('/', authenticate, getAuth_CONTROLLER)



export default router