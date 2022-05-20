
import { Request, Response, NextFunction } from 'express'
import jwt, {  VerifyErrors } from 'jsonwebtoken'
import { HandleError } from '../../../responses/error/HandleError'


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const { access_token } = req.signedCookies
    const secret: string = String(process.env.ACCESS_TOKEN_SECRET)
    
    if(!access_token) return next(HandleError.Forbidden('Access Token Expired'))
    
    jwt.verify(access_token, secret, (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(HandleError.Forbidden('Access Token Expired'))
        
        req.body = {
            user_id: decoded.user_id,
            username: decoded.username,
        }

    })
    

    next()
}