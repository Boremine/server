import { Request, Response, NextFunction } from 'express'
import sanitize from 'mongo-sanitize'


const getIp = (req: Request) => {
    let ip: string | undefined
    // if (process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development') ip = req.socket.remoteAddress
    ip = req.socket.remoteAddress
    
    // else ip = req.headers['x-forwarded-for']

    return ip
}


const Stringify = (o:object|undefined) => {
    for(let key in o){
        // @ts-ignore: Unreachable code error
        if(typeof o[key] == 'object'){
            // @ts-ignore: Unreachable code error
            o[key] = JSON.stringify(o[key])
        }else{
            // @ts-ignore: Unreachable code error
            o[key] = JSON.stringify(o[key])
            // @ts-ignore: Unreachable code error
            o[key] = o[key].substring(1, o[key].length-1);
        }
        
        
    }
}

export const global_sanitize = async(req: Request, res: Response, next: NextFunction) => {
    req.body = sanitize(req.body)
    req.params = sanitize(req.params)
   
    await Stringify(req.body)
    await Stringify(req.params)

    next()
}