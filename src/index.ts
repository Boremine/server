import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import useragent from 'express-useragent'

import socketIO from 'socket.io'
import http from 'http'

import { displayPrompt } from './features/Prompt/controllers'
import { displayChatto } from './features/Chatto/controllers'

import { validateConnections } from './utils/Socket/functions/validateConnection'

import { error_handler } from './responses/error/error-handler'

import morgan from 'morgan'

import dotenvSafe from 'dotenv-safe'

import './models/commentary'
import './models/forgotPassword'
import './models/log'
import './models/mural'
import './models/prompt'
import './models/refreshToken'
import './models/user'
import './models/verification'

import { global_sanitize } from './utils/Sanitize/middleware/global_sanitize'

import authInfoRoute from './features/AuthInfo/routes'
import chattoRoute from './features/Chatto/routes'
import promptRoute from './features/Prompt/routes'
import forgotRoute from './features/ForgotPassword/routes'
import muralRoute from './features/Mural/routes'
import signupRoute from './features/Signup/routes'
import loginRoute from './features/Login/routes'
import verificationRoute from './features/Verification/routes'
import refreshRoute from './features/Refresh/routes'
import logoutRoute from './features/Logout/routes'
import accountRoute from './features/Account/routes'
import supportRoute from './features/Support/routes'

import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

export const app: Application = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  dotenvSafe.config({
    allowEmptyValues: false
  })
}

const secretManagerClient = new SecretManagerServiceClient()

const getSecretValueFromManager = async (secretName: string) => {
  const path = `projects/boremine/secrets/${secretName}/versions/latest`
  try {
    const [secret] = await secretManagerClient.accessSecretVersion({
      name: path
    })
    return secret.payload?.data?.toString()
  } catch {
    return undefined
  }
}

export const getSecretValue = async (secretName: string): Promise<string | undefined> => {
  return process.env[secretName] || await getSecretValueFromManager(secretName)
}

const server = http.createServer(app)

const startServer = async () => {
  app.get('/', (req: Request, res: Response) => {
    res.redirect('https://boremine.com')
  })

  const io = new socketIO.Server(server, {
    cors: {
      origin: [String(await getSecretValue('CLIENT_DOMAIN2')), String(await getSecretValue('CLIENT_DOMAIN'))],
      credentials: true
    }
  })

  app.use(express.json())
  app.set('trust proxy', true)
  app.use(helmet())
  app.use(useragent.express())
  app.use(
    cors({
      origin: [String(await getSecretValue('CLIENT_DOMAIN2')), String(await getSecretValue('CLIENT_DOMAIN'))],
      exposedHeaders: 'RateLimit-Reset',
      credentials: true
    })
  )

  app.use(cookieParser(await getSecretValue('COOKIE_PARSER_SECRET')))

  mongoose
    .connect(`${await getSecretValue('DATABASE')}`)
    .then(async () => console.log(`Database connected!`))
    .catch(err => console.log(`Failed to connect to database: ${err.message}`))

  app.set('socketio', io)

  app.use(global_sanitize)

  app.use('/mural', muralRoute)
  app.use('/authInfo', authInfoRoute)
  app.use('/chatto', chattoRoute)
  app.use('/prompt', promptRoute)
  app.use('/account', accountRoute)
  app.use('/signup', signupRoute)
  app.use('/logout', logoutRoute)
  app.use('/login', loginRoute)
  app.use('/forgot', forgotRoute)
  app.use('/verification', verificationRoute)
  app.use('/refresh', refreshRoute)
  app.use('/support', supportRoute)

  app.use(error_handler)

  displayChatto(io)
  displayPrompt(io)
  validateConnections(io)

  const port: any = process.env.PORT || 3001
  if (port !== 'test') {
    server.listen(port, () => console.log(`server running on port ${port}`))
  }
}
startServer()
