import { Request, Response, NextFunction } from 'express'

import { HandleSuccess } from '../../responses/success/HandleSuccess'


import Chatto from '../../models/chatto'


export const getAuth = async (req: Request, res: Response, next: NextFunction) => {
    const {user_id, username} = res.locals

    // let tete = await Profile.findById(user_id).populate({path: 'messages'})
    
   
    

    HandleSuccess.Ok(res, {user_id, username, auth: true})
}