import { Request, Response, NextFunction } from 'express'
import { HandleSuccess } from '../../responses/success/HandleSuccess'

import User from '../../models/user'
import Chatto from '../../models/chatto'

interface Body {
    message:string
}


export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const body:Body = req.body
    const {user_id, username} = res.locals
    
    const io = req.app.get('socketio')

    const NewChatto = new Chatto({
        user_id,
        message: body.message
    })
    
    NewChatto.save()

    const user = await User.findOne({user_id}) 
    user?.chatties.push(NewChatto)
    await user?.save()

    
    io.emit('chatto', {message: body.message, username})

   


    res.sendStatus(200)
}