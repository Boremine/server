
// eslint-disable-next-line no-unused-vars
declare namespace Express {
    export interface Request {
        useragent?: import('express-useragent').Details & {device:string, ip:string | undefined}
    }
}
