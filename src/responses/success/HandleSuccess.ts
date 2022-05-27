import { Response } from 'express'

export class HandleSuccess {


    static Created(res: Response, msg: object | string) {
        return res.status(201).json(msg)
    }


    static Ok(res: Response, msg: object | string) {
        return res.status(200).json(msg)
    }

    static MovedPermanently(res:Response, msg: object | string){
        return res.status(301).json(msg)
    }

}





