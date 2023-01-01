import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { getSecretValue } from '../../..'

interface Payload {
  user_id: string
  iat?: number
}

export const generateAccessToken = async (payload: Payload) => {
  if (process.env.NODE_ENV === 'test') payload.iat = Date.now()
  const secret: string = String(await getSecretValue('ACCESS_TOKEN_SECRET'))
  const token: string = jwt.sign(payload, secret, { expiresIn: '2m' })
  return token
}

export const generateRefreshToken = async (payload: Payload) => {
  if (process.env.NODE_ENV === 'test') payload.iat = Date.now()
  const secret: string = String(await getSecretValue('REFRESH_TOKEN_SECRET'))
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
        : 'boremine.com',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 2
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
        : 'boremine.com',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 365
  })
}

export const clearCookiesSettings = {
  path: '/',
  domain: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? '' : 'boremine.com'
}
