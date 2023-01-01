import { Request, Response, NextFunction } from 'express'

interface MuralQuery {
    limit?: number
}

export const getMural = async (req: Request, res: Response, next: NextFunction) => {
    const query: MuralQuery = req.query

    res.locals.limit = Number(query.limit)

    next()
}

interface OnePieceInfoParams {
    piece_id?: string
}

export const getOnePieceInfo = async (req: Request, res: Response, next: NextFunction) => {
    const params: OnePieceInfoParams = req.params

    params.piece_id = String(params.piece_id)

    next()
}

interface OnePieceCommentsParams {
    piece_id?: string
}

interface OnePieceCommentsQuery {
    limit?: number
    sort?: string
    type?: string
}

export const getOnePieceComments = async (req: Request, res: Response, next: NextFunction) => {
    const params: OnePieceCommentsParams = req.params
    const query: OnePieceCommentsQuery = req.query

    params.piece_id = String(params.piece_id)

    res.locals.limit = Number(query.limit)
    res.locals.sort = String(query.sort)
    res.locals.type = String(query.type)

    next()
}

interface markPieceParams {
    piece_id?: string
}
interface markPieceBody {
    mark: string
}

export const markPiece = async (req: Request, res: Response, next: NextFunction) => {
    const params: markPieceParams = req.params
    const body: markPieceBody = req.body

    params.piece_id = String(params.piece_id)

    if (body.mark === 'like') res.locals.mark = 'likes'
    else if (body.mark === 'dislike') res.locals.mark = 'dislikes'

    next()
}

interface addCommentParams {
    piece_id?: string
}
interface addCommentBody {
    comment: string
}

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    const params: addCommentParams = req.params
    const body: addCommentBody = req.body

    body.comment = String(body.comment)
    params.piece_id = String(params.piece_id)

    next()
}

interface markCommentParams {
    comment_id?: string
}
interface markCommentBody {
    mark: string
}

export const markComment = async (req: Request, res: Response, next: NextFunction) => {
    const params: markCommentParams = req.params
    const body: markCommentBody = req.body

    params.comment_id = String(params.comment_id)
    res.locals.comment_id = String(params.comment_id)

    if (body.mark === 'like') res.locals.mark = 'likes'
    else if (body.mark === 'dislike') res.locals.mark = 'dislikes'

    next()
}
