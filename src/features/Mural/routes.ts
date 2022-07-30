import { Router } from 'express'

import {
    getMural as getMural_CONTROLLER,
    getOnePieceInfo as getOnePieceInfo_CONTROLLER,
    getOnePieceComments as getOnePieceComments_CONTROLLER,
    markPiece as markPiece_CONTROLLER,
    addComment as addComment_CONTROLLER,
    markComment as markComment_CONTROLLER
} from './controllers'

import {
    markPiece as markPiece_VALIDATOR,
    addComment as addComment_VALIDATOR,
    markComment as markComment_VALIDATOR
} from './validators'

import {
    getOnePieceInfo as getOnePieceInfo_SANITIZE,
    getOnePieceComments as getOnePieceComments_SANITIZE,
    markPiece as markPiece_SANITIZE,
    addComment as addComment_SANITIZE,
    markComment as markComment_SANITIZE
} from './sanitize'

import { authorize } from '../../utils/Authorize/middleware/verifyToken'

const router: Router = Router()

router.get('/', getMural_CONTROLLER)
router.get('/:piece_id', getOnePieceInfo_SANITIZE, getOnePieceInfo_CONTROLLER)
router.post('/:piece_id/comments', getOnePieceComments_SANITIZE, getOnePieceComments_CONTROLLER)

router.put('/:piece_id/mark', authorize, markPiece_SANITIZE, markPiece_VALIDATOR, markPiece_CONTROLLER)

router.post('/:piece_id/comments/add', authorize, addComment_SANITIZE, addComment_VALIDATOR, addComment_CONTROLLER)
router.put('/comment/:comment_id/mark', authorize, markComment_SANITIZE, markComment_VALIDATOR, markComment_CONTROLLER)

export default router
