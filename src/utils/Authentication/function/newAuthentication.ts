import { Request, Response, NextFunction } from 'express'
import { generateAccessToken, generateRefreshToken, setAccessToken, setRefreshToken } from './tokens'
import { addLog } from '../../Logs/functions/addLog'
import { Schema } from 'mongoose'
import RefreshToken from '../../../models/refreshToken'
import Log from '../../../models/log'
import { HandleError } from '../../../responses/error/HandleError'
import crypto from 'crypto'
import { HandleSuccess } from '../../../responses/success/HandleSuccess'
import mongoose from 'mongoose'

interface Body {
    user_id: string,
    username: string,
    log_id: string | void
}






export const newAuthentication = async (body: Body, res: Response) => {
    const { username, user_id, log_id } = body


    const accessToken = generateAccessToken({ username, user_id })
    const refreshToken = generateRefreshToken({ username,user_id })

    const query = {
        token: crypto.createHash('sha256').update(refreshToken).digest('hex'),
        log_id: log_id,
        version: 1
    }

    await RefreshToken.deleteMany({ log_id: log_id })

    const NewRefreshToken = new RefreshToken(query)
    let refreshTokenCreated = await NewRefreshToken.save()

    await Log.findByIdAndUpdate(log_id, { refreshToken_id: refreshTokenCreated._id })


    setAccessToken(res, accessToken)
    setRefreshToken(res, refreshToken)

    
    if(process.env.NODE_ENV == 'test') return HandleSuccess.Ok(res, {accessToken, refreshToken})
    else return HandleSuccess.Ok(res, 'authenticated')
}