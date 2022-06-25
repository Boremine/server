import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
// import slowDown from 'express-slow-down'
import useragent from 'express-useragent'

import socketIO from 'socket.io'
import http from 'http'

import { displayPrompt } from './features/Prompt/controllers'
import { displayChatto } from './features/Chatto/controllers'

import { validateConnections } from './utils/Socket/function/validateConnection'

import { error_handler } from './responses/error/error-handler'

import morgan from 'morgan'
// import dotenv from 'dotenv'
import dotenvSafe from 'dotenv-safe'

import { global_sanitize } from './utils/Sanitize/middleware/global_sanitize'

import authInfoRoute from './features/AuthInfo/routes'
import profileRoute from './features/Profile/routes'
import chattoRoute from './features/Chatto/routes'
import promptRoute from './features/Prompt/routes'

import signupRoute from './features/Signup/routes'
import loginRoute from './features/Login/routes'
import verificationRoute from './features/Verification/routes'
import refreshRoute from './features/Refresh/routes'

export const app: Application = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  dotenvSafe.config({
    allowEmptyValues: false
  })
}

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Test V4.16 db Connection')
})

const server = http.createServer(app)
export const io = new socketIO.Server(server, {
  cors: {
    origin: process.env.CLIENT_DOMAIN,
    credentials: true
  }
})

app.use(express.json())
app.set('trust proxy', true)
app.use(helmet())
app.use(useragent.express())
app.use(
  cors({
    origin: process.env.CLIENT_DOMAIN,
    exposedHeaders: 'RateLimit-Reset',
    credentials: true
  })
)

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))

mongoose
  .connect(`${process.env.DATABASE}`)
  .then(() => console.log(`Database connected! ${process.env.DATABASE}`))
  .catch(err => console.log(`Failed to connect to database: ${err.message}`))

app.set('socketio', io)

app.use(global_sanitize)

app.use('/profile', profileRoute)
app.use('/authInfo', authInfoRoute)
app.use('/chatto', chattoRoute)
app.use('/prompt', promptRoute)

app.use('/signup', signupRoute)
app.use('/login', loginRoute)
app.use('/verification', verificationRoute)
app.use('/refresh', refreshRoute)

app.use(error_handler)

displayChatto(io)
displayPrompt(io)

validateConnections(io)

const port: any = process.env.PORT || 3001
if (port !== 'test') {
  server.listen(port, () => console.log(`server running on port ${port}`))
}
