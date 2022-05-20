import { Request, Response, NextFunction } from 'express'
import { HandleSuccess } from '../../responses/success/HandleSuccess'

interface Body{
    user_id:string,
    username:string
}

export const userInfo = async (req: Request, res: Response, next: NextFunction) => {
    const body:Body = req.body

    HandleSuccess.Ok(res, {user_id: body.user_id, username: body.username, auth: true})
  
}