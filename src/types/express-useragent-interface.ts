export interface UserAgent{
    browser: string
    version: string
    os: string
    platform: string
    device:string
    ip:string | string[] | undefined
}
