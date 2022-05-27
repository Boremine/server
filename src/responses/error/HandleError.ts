export class HandleError {
    code:number;
    message: object | string

    constructor(code:number, message:object | string){
        this.code = code;
        this.message = message
    }

    static NotAcceptable(msg:object | string){
        return new HandleError(406, msg)
    }

    static NotFound(msg:object | string){
        return new HandleError(404, msg)
    }

    static BadRequest(msg:object | string){
        return new HandleError(400, msg)
    }

    static Internal(err:any){
        process.env.NODE_ENV == 'development' ? console.log(err):null
        return new HandleError(500, "Something wen't wrong, try again later.")
    }

    static Unauthorized(msg:object |string){
        return new HandleError(401, msg)
    }

    static Forbidden(msg:object | string){
        return new HandleError(403, msg)
    }


}





