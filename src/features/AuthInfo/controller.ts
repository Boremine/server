import { Request, Response, NextFunction } from 'express'

import { HandleSuccess } from '../../responses/success/HandleSuccess'



export const getAuth = async (req: Request, res: Response, next: NextFunction) => {
    const {user_id, username} = res.locals   
    

    HandleSuccess.Ok(res, {user_id, username, auth: true})
}