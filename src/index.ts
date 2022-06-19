import express, { Application } from 'express'
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
import dotenv from 'dotenv'
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

dotenv.config()
dotenvSafe.config({
  allowEmptyValues: false
})

export const app: Application = express()
const server = http.createServer(app)
export const io = new socketIO.Server(server, {
  cors: {
    origin: process.env.CLIENT_DOMAIN,
    credentials: true
  }
})

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// const speedLimiter = slowDown({
//   windowMs: 80000,
//   delayAfter: 200,
//   delayMs: 200
// })

app.use(express.json())
app.use(helmet())
app.use(useragent.express())
// app.set('trust proxy', '192.168.0.199')
app.use(
  cors({
    origin: process.env.CLIENT_DOMAIN,
    exposedHeaders: 'RateLimit-Reset',
    credentials: true
  })
)

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))
// app.use(speedLimiter)

mongoose
  .connect(`${process.env.DATABASE}`)
  .then(() => console.log(`Database connected! ${process.env.DATABASE}`))
  .catch(err => console.log(`Failed to connect to database: ${err.message}`))

// export const client = createClient({ url: 'redis://redis-16221.c258.us-east-1-4.ec2.cloud.redislabs.com:16221', password: 'r22PYXrhlCPWotxZaW4ZHt5T852SZeU4', username: 'default' })
// client.connect()
// client.on('connect', () => {
//   console.log('Redis Connected')
// })

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

// interface Connection{
//     socket_id:string
//     user_id:string
// }

// export let authorizeConnections:Array<Connection> = []

// io.on('connection', (socket) => {
//     console.log('user connected', socket.id)
//     let allCookies
//     if(socket.handshake.headers.cookie) {

//         allCookies = cookie.parse(socket.handshake.headers.cookie)
//         const signedCookie = cookieParser.signedCookie(allCookies.refresh_token, String(process.env.COOKIE_PARSER_SECRET))
//         const secret: string = String(process.env.REFRESH_TOKEN_SECRET)
//         if(signedCookie) jwt.verify(signedCookie, secret, (err: VerifyErrors | null, decoded: any) => {
//             if (err) return

//             if(authorizeConnections.filter(e => e.user_id === decoded.user_id).length == 0) {
//                 authorizeConnections.push({socket_id: socket.id, user_id: decoded.user_id})
//             }
//         })

//     }

//     socket.on('disconnect', () => {
//         authorizeConnections = authorizeConnections.filter(e => e.socket_id !== socket.id)

//         console.log('user disconnected')
//         socket.removeAllListeners()
//     })
// })

if (process.env.NODE_ENV !== 'test') {
  server.listen(3001, () => console.log(`server running on port ${3001}`))
}
