import { Request, Response, NextFunction } from 'express'
import { HandleError } from '../../responses/error/HandleError'
import { findUserAgent, TokenFound } from '../../utils/Logs/functions/findLog'

import User from '../../models/user'
import RefreshToken from '../../models/refreshToken'
import { HandleSuccess } from '../../responses/success/HandleSuccess'
import { clearCookiesSettings } from '../../utils/Authentication/function/tokens'

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = res.locals

  const user = await User.findById(user_id).populate({
    path: 'logs',
    populate: { path: 'refreshToken_id' }
  })
  if (!user) return next(HandleError.Unauthorized('User not found'))

  const tokenOwner: TokenFound | boolean = findUserAgent(req.useragent, user.logs)

  res.clearCookie('refresh_token', clearCookiesSettings)
  res.clearCookie('access_token', clearCookiesSettings)

  if (!tokenOwner) return HandleSuccess.Ok(res, 'Logout Successful')

  await RefreshToken.findById(tokenOwner._id).deleteOne()

  HandleSuccess.Ok(res, 'Logout Successful')
}
