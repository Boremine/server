import { Request, Response,NextFunction} from 'express'
import { HandleError } from './HandleError'

export const error_handler = async(err:any,req:Request, res:Response, next:NextFunction) => {
    
    if(err instanceof HandleError){
        res.status(err.code).json(err.message)
        return
    }

    res.status(500).json("Something wen't wrong")
}