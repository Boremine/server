import { Request, Response, NextFunction } from 'express'
import Mural from '../../models/mural'
import Commentary from '../../models/commentary'

import { HandleError } from '../../responses/error/HandleError'
import { HandleSuccess } from '../../responses/success/HandleSuccess'

import { isValidObjectId, Types } from 'mongoose'

export const getMural = async (req: Request, res: Response, next: NextFunction) => {
    const { limit } = res.locals
    const mural = await Mural.aggregate([
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_id',
                pipeline: [
                    { $project: { usernameDisplay: 1, _id: 0 } }
                ]
            }
        },
        {
            $limit: limit
        },
        {
            $unwind: {
                path: '$user_id',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                title: '$title',
                text: '$text',
                chattoes_amount: '$chattoes_amount',
                comments_amount: '$comments_amount',
                pops: '$pops',
                drops: '$drops',
                likes: '$likes',
                dislikes: '$dislikes',
                likes_amount: '$likes_amount',
                dislikes_amount: '$dislikes_amount',
                createdAt: '$createdAt',
                user_id: { $ifNull: ['$user_id', { usernameDisplay: '(deleted)' }] }
            }
        }
    ])

    const muralHold = mural.slice(limit - 12, limit)

    HandleSuccess.Ok(res, muralHold)
}

export const getOnePieceInfo = async (req: Request, res: Response, next: NextFunction) => {
    const { piece_id } = req.params

    if (!isValidObjectId(piece_id)) return next(HandleError.NotFound('No piece found'))

    const piece = await Mural.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(piece_id)

            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_id',
                pipeline: [
                    { $project: { usernameDisplay: 1, _id: 0 } }
                ]
            }
        },
        {
            $unwind: {
                path: '$user_id',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                title: '$title',
                text: '$text',
                chattoes_amount: '$chattoes_amount',
                comments_amount: '$comments_amount',
                pops: '$pops',
                drops: '$drops',
                likes: '$likes',
                dislikes: '$dislikes',
                likes_amount: '$likes_amount',
                dislikes_amount: '$dislikes_amount',
                createdAt: '$createdAt',
                user_id: { $ifNull: ['$user_id', { usernameDisplay: '(deleted)' }] }
            }
        }
    ])

    if (!piece[0]) return next(HandleError.NotFound('No piece found'))

    HandleSuccess.Ok(res, piece[0])
}

const assignSort = (sort: string, type: string) => {
    const sortOptionsHolder: { fromChatto?: number, likes_amount?: number, createdAt?: number } = {}

    if (type === 'comments') {
        sortOptionsHolder.fromChatto = 1
    } else if (type === 'chatto') {
        sortOptionsHolder.fromChatto = -1
    }
    if (sort === 'new') sortOptionsHolder.createdAt = -1
    else if (sort === 'top') {
        sortOptionsHolder.likes_amount = -1
    }

    sortOptionsHolder.createdAt = -1

    return sortOptionsHolder
}

const getPieceCommentsFacetLookup = {
    $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user_id',
        pipeline: [
            {
                $project: {
                    _id: 0,
                    usernameDisplay: 1
                }
            }
        ]
    }
}

const getPieceCommentsFacetProject = {
    $project: {
        message: 1,
        likes_amount: 1,
        dislikes_amount: 1,
        likes: 1,
        dislikes: 1,
        createdAt: 1,
        fromChatto: 1,
        user_id: { $ifNull: ['$user_id', { usernameDisplay: '(deleted)' }] }
    }
}

const getPieceCommentsFacetUnwind = {
    $unwind: {
        path: '$user_id',
        preserveNullAndEmptyArrays: true
    }
}

export const getOnePieceComments = async (req: Request, res: Response, next: NextFunction) => {
    const { sort, type, limit, user_id } = res.locals
    const { piece_id } = req.params

    let sortOptions: any = {}

    sortOptions = assignSort(sort, type)

    if (!isValidObjectId(piece_id)) return next(HandleError.NotFound('No piece found'))

    const piece = await Mural.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(piece_id)

            }
        },
        {
            $lookup: {
                from: 'commentaries',
                localField: 'commentary',
                foreignField: '_id',
                as: 'commentary',
                pipeline: [
                    {
                        $facet: {
                            yourPieces: [
                                { $match: { user_id: new Types.ObjectId(user_id) } },
                                getPieceCommentsFacetLookup,
                                {
                                    $sort: sortOptions
                                },
                                getPieceCommentsFacetUnwind,
                                getPieceCommentsFacetProject
                            ],
                            otherPieces: [
                                { $match: { user_id: { $ne: new Types.ObjectId(user_id) } } },
                                getPieceCommentsFacetLookup,
                                {
                                    $sort: sortOptions
                                },
                                getPieceCommentsFacetUnwind,
                                getPieceCommentsFacetProject
                            ]
                        }
                    },
                    {
                        $project: {
                            message: 1,
                            likes_amount: 1,
                            dislikes_amount: 1,
                            likes: 1,
                            dislikes: 1,
                            createdAt: 1,
                            fromChatto: 1,

                            documents: {
                                $slice: [
                                    {
                                        $concatArrays: ['$yourPieces', '$otherPieces']
                                    },
                                    limit
                                ]

                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                commentary: 1
            }
        }
    ])

    if (!piece) return next(HandleError.NotFound('No piece found'))
    const comments = piece[0].commentary[0].documents.slice(limit - 8, limit)

    HandleSuccess.Ok(res, comments)
}

export const markPiece = async (req: Request, res: Response, next: NextFunction) => {
    const { mark, user_id } = res.locals
    const { piece_id } = req.params

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
    const { user_id, usernameDisplay } = res.locals
    const { piece_id } = req.params
    const { comment } = req.body

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

    const yourComment = {
        likes: NewCommentary.likes,
        likes_amount: NewCommentary.likes_amount,
        dislikes: NewCommentary.dislikes,
        dislikes_amount: NewCommentary.dislikes_amount,
        message: NewCommentary.message,
        fromChatto: NewCommentary.fromChatto,
        createdAt: NewCommentary.createdAt,
        user_id: {
            usernameDisplay
        },
        _id: NewCommentary._id
    }

    HandleSuccess.Created(res, yourComment)
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

    HandleSuccess.Ok(res, 'sefse')
}
