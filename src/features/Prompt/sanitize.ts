import { Request, Response, NextFunction } from 'express'

interface PostBody {
    text: string
    title: string
}

const trimRegex = /\s+/g

export const postPrompt = (req: Request, res: Response, next: NextFunction) => {
    const body: PostBody = req.body

    body.text = String(body.text).trim().replace(trimRegex, ' ')
    body.title = String(body.title).trim().replace(trimRegex, ' ')

    next()
}

interface PostBodyNoAuthenticated {
    text: string
    title: string
    naid:string
}

export const postPromptNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const body: PostBodyNoAuthenticated = req.body

    body.text = String(body.text).trim().replace(trimRegex, ' ')
    body.title = String(body.title).trim().replace(trimRegex, ' ')
    body.naid = String(body.naid)

    next()
}

interface VoteBody {
    option: string
}

export const votePrompt = (req: Request, res: Response, next: NextFunction) => {
    const body: VoteBody = req.body

    body.option = String(body.option)

    next()
}

interface UpdateBody {
    text: string
    title: string
}

export const updatePrompt = async (req: Request, res: Response, next: NextFunction) => {
    const body: UpdateBody = req.body

    body.text = String(body.text).trim()
    body.title = String(body.title).trim()

    next()
}
