import { Response } from 'express'
import {
  generateAccessToken,
  generateRefreshToken,
  setAccessToken,
  setRefreshToken
} from './tokens'

import RefreshToken from '../../../models/refreshToken'
import Log from '../../../models/log'

import crypto from 'crypto'
import { HandleSuccess } from '../../../responses/success/HandleSuccess'

interface BodyAuth {
  user_id: string
  log_id: string
}

export const newAuthentication = async (body: BodyAuth, res: Response) => {
  const { user_id, log_id } = body

  const accessToken = await generateAccessToken({ user_id })
  const refreshToken = await generateRefreshToken({ user_id })

  const query = {
    token: crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex'),
    log_id,
    version: 1
  }

  await RefreshToken.deleteMany({ log_id })

  const NewRefreshToken = new RefreshToken(query)
  const refreshTokenCreated = await NewRefreshToken.save()

  await Log.findByIdAndUpdate(log_id, {
    refreshToken_id: refreshTokenCreated._id
  })

  setAccessToken(res, accessToken)
  setRefreshToken(res, refreshToken)

  if (process.env.NODE_ENV === 'test') return HandleSuccess.Ok(res, { accessToken, refreshToken })
  else return HandleSuccess.Ok(res, 'authenticated')
}

interface BodyAuthGoogle {
  access_token:string
  refresh_token:string
  log_id:string
}

export const newAuthenticationThirdParty = async (body: BodyAuthGoogle, res: Response) => {
  const { access_token, refresh_token, log_id } = body

  // const accessToken = await generateAccessToken({ user_id })
  // const refreshToken = await generateRefreshToken({ user_id })

  const query = {
    token: crypto
      .createHash('sha256')
      .update(refresh_token)
      .digest('hex'),
    log_id,
    version: 1
  }

  await RefreshToken.deleteMany({ log_id })

  const NewRefreshToken = new RefreshToken(query)
  const refreshTokenCreated = await NewRefreshToken.save()

  await Log.findByIdAndUpdate(log_id, {
    refreshToken_id: refreshTokenCreated._id
  })

  setAccessToken(res, access_token)
  setRefreshToken(res, refresh_token)

  if (process.env.NODE_ENV === 'test') return HandleSuccess.Ok(res, { access_token, refresh_token })
  else return HandleSuccess.Ok(res, 'authenticated')
}
