import { Response } from 'express'
import jwt from 'jsonwebtoken'

interface Payload {
  username: string
  user_id: string
  iat?: number
}

export const generateAccessToken = (payload: Payload) => {
  if (process.env.NODE_ENV === 'test') payload.iat = Date.now()
  const secret: string = String(process.env.ACCESS_TOKEN_SECRET)
  const token: string = jwt.sign(payload, secret, { expiresIn: '5m' })
  return token
}

export const generateRefreshToken = (payload: Payload) => {
  if (process.env.NODE_ENV === 'test') payload.iat = Date.now()
  const secret: string = String(process.env.REFRESH_TOKEN_SECRET)
  const token: string = jwt.sign(payload, secret, { expiresIn: '1y' })
  return token
}

export const setAccessToken = (res: Response, token: string) => {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    signed: true,
    domain:
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
        ? ''
        : '.boremine.com',
    sameSite: 'none',
    maxAge: 1000 * 60 * 5
  })
}

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    signed: true,
    domain:
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
        ? ''
        : '.boremine.com',
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365
  })
}
