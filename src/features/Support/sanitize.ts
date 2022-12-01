import { Request, Response, NextFunction } from 'express'

interface SupportBody {
    title: string
    body: string
    topic: string
    email:string
}

export const support = async (req: Request, res: Response, next: NextFunction) => {
    const body: SupportBody = req.body

    body.title = String(body.title).trim()
    body.body = String(body.body).trim()
    body.email = String(body.email).toLocaleLowerCase().trim()

    if (body.topic === 'bug') body.topic = 'bug'
    else if (body.topic === 'feedback') body.topic = 'feedback'
    else if (body.topic === 'help') body.topic = 'help'
    else body.topic = 'nothing'

    next()
}
