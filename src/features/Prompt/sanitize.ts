import { Request, Response, NextFunction } from 'express'

interface PostBody {
    text: string
    title: string
}

export const postPrompt = (req: Request, res: Response, next: NextFunction) => {
    const body: PostBody = req.body

    body.text = body.text ? String(body.text).trim() : ''
    body.title = body.title ? String(body.title).trim() : ''

    next()
}

interface VoteBody {
    option: string
}

export const votePrompt = (req: Request, res: Response, next: NextFunction) => {
    const body: VoteBody = req.body

    body.option = body.option ? String(body.option) : ''

    next()
}
