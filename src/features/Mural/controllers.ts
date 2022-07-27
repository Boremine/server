import { Request, Response, NextFunction } from 'express'
import Mural from '../../models/mural'
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

export const getOnePromptInfo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    // console.log(req.params.id)
    // console.log(isValidObjectId(req.params.id))
    // await Comment.find()
    if (!isValidObjectId(id)) return next(HandleError.NotFound('No prompt found'))
    // const prompt = await Mural.findById(id).populate([
    //     {
    //         path: 'user_id',
    //         select: 'usernameDisplay color _id'
    //     },
    //     {
    //         path: 'chattoes',
    //         select: 'message user_id likes dislikes _id',
    //         populate: {
    //             path: 'user_id',
    //             select: 'usernameDisplay color'
    //         }
    //     },
    //     {
    //         path: 'comments',
    //         select: 'message user_id likes dislikes _id',
    //         populate: {
    //             path: 'user_id',
    //             select: 'usernameDisplay color'
    //         }
    //     }
    // ]).select('chattoes_amount comments_amount pops drops dislikes likes dislikes_amount likes_amount title text createdAt _id')
    const prompt = await Mural.findById(id).populate(
        {
            path: 'user_id',
            select: 'usernameDisplay color _id'
        }
    ).select('chattoes_amount comments_amount pops drops dislikes likes dislikes_amount likes_amount title text createdAt _id')

    if (!prompt) return next(HandleError.NotFound('No prompt found'))

    HandleSuccess.Ok(res, prompt)
}

export const getOnePromptComments = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    if (!isValidObjectId(id)) return next(HandleError.NotFound('No prompt found'))
    const prompt = await Mural.findById(id).populate(
        {
            path: 'commentary',
            select: 'message user_id likes dislikes createdAt fromChatto _id',
            populate: {
                path: 'user_id',
                select: 'usernameDisplay color'
            }
        }
    ).select('commentary _id')
    if (!prompt) return next(HandleError.NotFound('No prompt found'))

    HandleSuccess.Ok(res, prompt.commentary)
}

export const markPrompt = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { mark, user_id } = res.locals

    if (!isValidObjectId(id)) return next(HandleError.NotFound('No prompt found'))
    const prompt = await Mural.findById(id)
    if (!prompt) return next(HandleError.NotFound('No prompt found'))

    const updateMarks = async (currentMark: string, oppositeMark: string) => {
        const currentMarks = prompt[currentMark as keyof typeof prompt].reduce((a: object, v: string) => ({ ...a, [v]: v.toString() }), {})
        if (!currentMarks[user_id]) {
            await prompt.updateOne({
                $push: { [currentMark]: user_id },
                $pull: { [oppositeMark]: user_id },
                $inc: { [`${currentMark}_amount`]: 1 }
            })

            const oppositeMarks = prompt[oppositeMark as keyof typeof prompt].reduce((a: object, v: string) => ({ ...a, [v]: v.toString() }), {})

            if (oppositeMarks[user_id]) {
                await prompt.updateOne({
                    $inc: { [`${oppositeMark}_amount`]: -1 }
                })
            }
        } else {
            await prompt.updateOne({
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
