import { Request, Response, NextFunction } from 'express'
import Mural from '../../models/mural'
import Commentary from '../../models/commentary'
import { HandleError } from '../../responses/error/HandleError'
import { HandleSuccess } from '../../responses/success/HandleSuccess'

import { isValidObjectId } from 'mongoose'

export const getMural = async (req: Request, res: Response, next: NextFunction) => {
    const mural = await Mural.find().populate(
        {
            path: 'user_id',
            select: 'usernameDisplay color -_id'
        }
    ).limit(50).select('chattoes_amount comments_amount pops drops dislikes likes dislikes_amount likes_amount title text createdAt _id').sort({ createdAt: -1 })

    HandleSuccess.Ok(res, mural)
}

export const getOnePieceInfo = async (req: Request, res: Response, next: NextFunction) => {
    const { piece_id } = req.params

    if (!isValidObjectId(piece_id)) return next(HandleError.NotFound('No piece found'))
    const piece = await Mural.findById(piece_id).populate(
        {
            path: 'user_id',
            select: 'usernameDisplay color _id'
        }
    ).select('chattoes_amount comments_amount pops drops dislikes likes dislikes_amount likes_amount title text createdAt _id')

    if (!piece) return next(HandleError.NotFound('No piece found'))

    HandleSuccess.Ok(res, piece)
}

const assignSort = (sort: string, type: string) => {
    const sortOptionsHolder: any = {}

    if (type === 'comments') {
        sortOptionsHolder.fromChatto = 1
    } else if (type === 'chatto') {
        sortOptionsHolder.fromChatto = -1
    }
    // sortOptionsHolder.fromChatto = 1
    if (sort === 'new') sortOptionsHolder.createdAt = -1
    else if (sort === 'top') {
        sortOptionsHolder.likes_amount = -1
    }
    // sortOptionsHolder.likes_amount = 1
    // sortOptionsHolder.dislikes_amount = -1

    // sortOptionsHolder.createdAt = -1

    return sortOptionsHolder
}

export const getOnePieceComments = async (req: Request, res: Response, next: NextFunction) => {
    // const { sort, type } = res.locals
    const { piece_id } = req.params
    const { limit } = req.body
    // console.log(sort, type)
    // let sortOptions: any = {}

    // sortOptions = assignSort(sort, type)
    // console.log(sortOptions)
    // const tete = likes_amount: -1

    if (!isValidObjectId(piece_id)) return next(HandleError.NotFound('No piece found'))
    const piece = await Mural.findById(piece_id).populate(
        {
            path: 'commentary',
            select: 'message user_id likes_amount dislikes_amount likes dislikes createdAt fromChatto _id',
            populate: {
                path: 'user_id',
                select: 'usernameDisplay color'
            },
            options: { sort: { createdAt: -1 }, limit }
        }
    ).select('commentary _id')
    if (!piece) return next(HandleError.NotFound('No piece found'))
    // console.log(piece.commentary)
    piece.commentary = piece.commentary.slice(limit - 8, limit)

    HandleSuccess.Ok(res, piece.commentary)
}

export const markPiece = async (req: Request, res: Response, next: NextFunction) => {
    const { piece_id } = req.params
    const { mark, user_id } = res.locals

    if (!isValidObjectId(piece_id)) return next(HandleError.NotFound('No prompt found'))
    const piece = await Mural.findById(piece_id)
    if (!piece) return next(HandleError.NotFound('No piece found'))

    const updateMarks = async (currentMark: string, oppositeMark: string) => {
        const currentMarks = piece[currentMark as keyof typeof piece].reduce((a: object, v: string) => ({ ...a, [v]: v.toString() }), {})
        if (!currentMarks[user_id]) {
            await piece.updateOne({
                $push: { [currentMark]: user_id },
                $pull: { [oppositeMark]: user_id },
                $inc: { [`${currentMark}_amount`]: 1 }
            })

            const oppositeMarks = piece[oppositeMark as keyof typeof piece].reduce((a: object, v: string) => ({ ...a, [v]: v.toString() }), {})

            if (oppositeMarks[user_id]) {
                await piece.updateOne({
                    $inc: { [`${oppositeMark}_amount`]: -1 }
                })
            }
        } else {
            await piece.updateOne({
                $pull: { [currentMark]: user_id },
                $inc: { [`${currentMark}_amount`]: -1 }
            })
        }
    }

    if (mark === 'likes') {
        updateMarks('likes', 'dislikes')
    } else if (mark === 'dislikes') {
        updateMarks('dislikes', 'likes')
    }

    HandleSuccess.Ok(res, 'tete')
}

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals
    const { comment } = req.body
    const { piece_id } = req.params

    if (!isValidObjectId(piece_id)) return next(HandleError.NotFound('No Piece found'))
    const piece = await Mural.findById(piece_id)
    if (!piece) return next(HandleError.BadRequest(`Piece doesn't exist`))

    const NewCommentary = new Commentary({
        message: comment,
        user_id,
        piece_id
    })

    await NewCommentary.save()

    piece.commentary.push(NewCommentary)
    piece.comments_amount++
    await piece?.save()

    HandleSuccess.Created(res, 'Comment created')
}

export const markComment = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, mark } = res.locals
    const { comment_id } = req.params

    if (!isValidObjectId(comment_id)) return next(HandleError.NotFound('No Comment found'))
    const comment = await Commentary.findById(comment_id)
    if (!comment) return next(HandleError.BadRequest(`Comment doesn't exist`))

    const updateMarks = async (currentMark: string, oppositeMark: string) => {
        const currentMarks = comment[currentMark as keyof typeof comment].reduce((a: object, v: string) => ({ ...a, [v]: v.toString() }), {})
        if (!currentMarks[user_id]) {
            await comment.updateOne({
                $push: { [currentMark]: user_id },
                $pull: { [oppositeMark]: user_id },
                $inc: { [`${currentMark}_amount`]: 1 }
            })

            const oppositeMarks = comment[oppositeMark as keyof typeof comment].reduce((a: object, v: string) => ({ ...a, [v]: v.toString() }), {})

            if (oppositeMarks[user_id]) {
                await comment.updateOne({
                    $inc: { [`${oppositeMark}_amount`]: -1 }
                })
            }
        } else {
            await comment.updateOne({
                $pull: { [currentMark]: user_id },
                $inc: { [`${currentMark}_amount`]: -1 }
            })
        }
    }

    if (mark === 'likes') {
        updateMarks('likes', 'dislikes')
    } else if (mark === 'dislikes') {
        updateMarks('dislikes', 'likes')
    }
    // await comment.updateOne({
    //     $push: { likes: user_id }
    // })
    // comment.

    HandleSuccess.Ok(res, 'sefse')
}
