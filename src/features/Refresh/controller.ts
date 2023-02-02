// @ts-nocheck
import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'
import { findUserAgent, TokenFound } from '../../utils/Logs/functions/findLog'

import RefreshToken from '../../models/refreshToken'
import crypto from 'crypto'
import { HandleError } from '../../responses/error/HandleError'

import {
  generateAccessToken,
  generateRefreshToken,
  setAccessToken,
  setRefreshToken
} from '../../utils/Authentication/function/tokens'
import { HandleSuccess } from '../../responses/success/HandleSuccess'
import { checkIfFirstFive } from '../../utils/Prompts/functions/checkIfFirstFive'

// const checkForHistory = (tokenHistory: string[], testToken: string) => {
//   let check: string | boolean = 'notInHistory'
//   for (let i = 0; i < tokenHistory.length; i++) {
//     const historyToken = tokenHistory[i]
//     if (historyToken === testToken) {
//       check = 'inHistory'
//       break
//     }
//   }

//   return check
// }

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = res.locals
  let { refresh_token } = req.signedCookies
  if (process.env.NODE_ENV === 'test') refresh_token = req.cookies.refresh_token

  const tokenSender = crypto
    .createHash('sha256')
    .update(refresh_token)
    .digest('hex')

  const user = await User.findById(user_id).lean().populate([
    {
      path: 'logs',
      select: 'browser ip device platform machine version refreshToken_id location _id',
      populate: {
        path: 'refreshToken_id',
        select: 'token history _id'
      }
    },
    {
      path: 'prompt_id',
      select: '_id title text'
    }
  ]).select('usernameDisplay email alreadyVoted lastUsernameUpdate prompt_id googleId _id')

  if (!user) return next(HandleError.Unauthorized('User not found'))

  if (user.prompt_id) {
    user.prompt_id.promptInFirstFive = await checkIfFirstFive(user.prompt_id._id)
  }

  const tokenOwner: TokenFound | boolean = findUserAgent(req.useragent, user.logs)
  if (!tokenOwner) return next(HandleError.Unauthorized('Invalid Refresh Token'))

  // if (tokenOwner.token !== tokenSender) {
  //   switch (checkForHistory(tokenOwner.history, tokenSender)) {
  //     case 'inHistory':
  //       console.log('inHIstory')
  //       await RefreshToken.findByIdAndDelete(tokenOwner._id)
  //       return next(HandleError.Unauthorized('Invalid Refresh Token 2'))
  //     case 'notInHistory':
  //       console.log('NotInHistory')
  //       return next(HandleError.Unauthorized('Invalid Refresh Token 3'))
  //   }
  // }

  const payload = {
    user_id
  }

  const newAccessToken = await generateAccessToken(payload)
  const newRefreshToken = await generateRefreshToken(payload)

  await RefreshToken.findByIdAndUpdate(tokenOwner._id, {
    $push: { history: tokenSender },
    token: crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex')
  })

  setAccessToken(res, newAccessToken)
  setRefreshToken(res, newRefreshToken)

  user.logs.forEach(v => {
    delete v.refreshToken_id
  })

  if (process.env.NODE_ENV === 'test') return HandleSuccess.Ok(res, { refreshToken: newRefreshToken })
  else HandleSuccess.Ok(res, { ...user, auth: true })
}
