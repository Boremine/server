import { Request, Response, NextFunction } from 'express'
// import { HandleError } from '../../responses/error/HandleError'
// import { findUserAgent, TokenFound } from '../../utils/Logs/functions/findLog'

// import User from '../../models/user'
// import RefreshToken from '../../models/refreshToken'
import { HandleSuccess } from '../../responses/success/HandleSuccess'

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  // const { user_id } = res.locals

  // const user = await User.findById(user_id).populate({
  //   path: 'logs',
  //   populate: { path: 'refreshToken_id' }
  // })
  // if (!user) return next(HandleError.Unauthorized('User not found'))

  // const tokenOwner: TokenFound | boolean = findUserAgent(req.useragent, user.logs)
  // if (!tokenOwner) return next(HandleError.Unauthorized('Invalid Refresh Token'))

  // await RefreshToken.findById(tokenOwner._id).remove()

  res.clearCookie('refresh_token', { path: '/', domain: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? '' : '.boremine.com' })
  res.clearCookie('access_token', { path: '/', domain: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? '' : '.boremine.com' })

  HandleSuccess.Ok(res, 'Logout Successful')
}
