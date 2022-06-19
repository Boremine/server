import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'
// import Log from '../../models/log'
import RefreshToken from '../../models/refreshToken'
import crypto from 'crypto'
import { HandleError } from '../../responses/error/HandleError'
import { Details } from 'express-useragent'
import {
  generateAccessToken,
  generateRefreshToken,
  setAccessToken,
  setRefreshToken
} from '../../utils/Authentication/function/tokens'
import { HandleSuccess } from '../../responses/success/HandleSuccess'
// import { token } from 'morgan'

// interface Locals {
//   username: string
//   user_id: string
// }

interface UserAgent {
  browser: string
  version: string
  os: string
  platform: string
  ip: string
  device: string
  refreshToken_id: {
    _id: string
    version: number
    token: string
    history: string[]
  }
}

interface Token {
  _id: string
  token: string
  history: string[]
}

const validUserAgent = (
  testAgent: Details | undefined,
  ownerAgents: Array<UserAgent>
) => {
  let tokenFound: Token | boolean = false

  for (let i = 0; i < ownerAgents.length; i++) {
    const log = ownerAgents[i]
    if (!log.refreshToken_id) continue
    tokenFound = {
      _id: log.refreshToken_id._id,
      token: log.refreshToken_id.token,
      history: log.refreshToken_id.history
    }

    if (log.browser !== testAgent?.browser) tokenFound = false
    if (log.version !== testAgent?.version) tokenFound = false
    if (log.os !== testAgent?.os) tokenFound = false
    if (log.platform !== testAgent?.platform) tokenFound = false
    if (log.device !== testAgent?.device) tokenFound = false
    if (log.ip !== testAgent?.ip) tokenFound = false
    // log.browser !== testAgent?.browser ? (tokenFound = false) : null
    // log.version !== testAgent?.version ? (tokenFound = false) : null
    // log.os !== testAgent?.os ? (tokenFound = false) : null
    // log.platform !== testAgent?.platform ? (tokenFound = false) : null
    // log.device !== testAgent?.device ? (tokenFound = false) : null
    // log.ip !== testAgent?.ip ? (tokenFound = false) : null

    if (tokenFound) break
  }
  return tokenFound
}

// const checkForHistory = (tokenHistory: string[], testToken: string) => {
//   let check: string | boolean = 'notInHistory'
//   for (let i = 0; i < tokenHistory.length; i++) {
//     const historyToken = tokenHistory[i]
//     historyToken == testToken ? (check = 'inHistory') : null
//     if (check == 'inHistory') break
//   }

//   return check
// }

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { username, user_id } = res.locals
  let { refresh_token } = req.signedCookies
  if (process.env.NODE_ENV === 'test') refresh_token = req.cookies.refresh_token

  const tokenSender = crypto
    .createHash('sha256')
    .update(refresh_token)
    .digest('hex')

  const user = await User.findById(user_id).populate({
    path: 'logs',
    populate: { path: 'refreshToken_id' }
  })
  if (!user) return next(HandleError.Unauthorized('User not found'))

  const tokenOwner: Token | boolean = validUserAgent(req.useragent, user.logs)
  if (!tokenOwner) return next(HandleError.Unauthorized('Invalid Refresh Token 1'))

  // if (tokenOwner.token !== tokenSender) {
  //     switch (checkForHistory(tokenOwner.history, tokenSender)) {
  //         case 'inHistory':
  //             await RefreshToken.findByIdAndDelete(tokenOwner._id)
  //             return next(HandleError.Unauthorized('Invalid Refresh Token 2'))
  //         case 'notInHistory':
  //             return next(HandleError.Unauthorized('Invalid Refresh Token 3'))
  //     }
  // }

  const payload = {
    username,
    user_id
  }

  const newAccessToken = generateAccessToken(payload)
  const newRefreshToken = generateRefreshToken(payload)

  await RefreshToken.findByIdAndUpdate(tokenOwner._id, {
    $push: { history: tokenSender },
    token: crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex')
  })

  setAccessToken(res, newAccessToken)
  setRefreshToken(res, newRefreshToken)

  if (process.env.NODE_ENV === 'test') return HandleSuccess.Ok(res, { refreshToken: newRefreshToken })
  else HandleSuccess.Ok(res, { user_id, username, auth: true })
}
