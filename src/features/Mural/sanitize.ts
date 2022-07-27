import { Request, Response, NextFunction } from 'express'

interface OnePromptInfoParams {
    id?: string
}

export const getOnePromptInfo = async (req: Request, res: Response, next: NextFunction) => {
    const params: OnePromptInfoParams = req.params

    params.id = params.id ? String(params.id) : ''

    next()
}

interface OnePromptCommentsParams {
    id?: string
}

export const getOnePromptComments = async (req: Request, res: Response, next: NextFunction) => {
    const params: OnePromptCommentsParams = req.params

    params.id = params.id ? String(params.id) : ''

    next()
}

interface markPromptParams {
    id?: string
}
interface markPromptBody {
    mark: string
}

export const markPrompt = async (req: Request, res: Response, next: NextFunction) => {
    const params: markPromptParams = req.params
    const body: markPromptBody = req.body

    params.id = params.id ? String(params.id) : ''

    if (body.mark === 'like') res.locals.mark = 'likes'
    else if (body.mark === 'dislike') res.locals.mark = 'dislikes'

    next()
}
