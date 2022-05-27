import { Router } from 'express'
const router: Router = Router()

import {
    getAuth as getAuth_CONTROLLER,
} from './controller'

import {
    authorize 
} from '../../utils/Authorize/middleware/verifyToken'



router.get('/', authorize, getAuth_CONTROLLER)



export default router