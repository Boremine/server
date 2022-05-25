import express, { Application, Request } from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import slowDown from 'express-slow-down'

import socketIO from 'socket.io'
import http from 'http'

import { promptDisplay } from './features/Prompt/controllers'

import { error_handler } from './responses/error/error-handler'


import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()

import { global_sanitize } from './utils/Sanitize/middleware/global_sanitize'

import authRoute from './features/Authenticate/routes'
import profileRoute from './features/Profile/routes'
import chattoRoute from './features/Chatto/routes'
import promptRoute from './features/Prompt/routes'

export const app: Application = express()
const server = http.createServer(app)
const io = new socketIO.Server(server, {
    cors:{
        origin: process.env.CLIENT_DOMAIN
    }
})

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

const speedLimiter = slowDown({
    windowMs: 80000,
    delayAfter: 200,
    delayMs: 200

})

app.use(express.json())
app.use(helmet())
// app.set('trust proxy', 1)
app.use(cors({
    origin: process.env.CLIENT_DOMAIN,
    credentials: true,
}))

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))
app.use(speedLimiter)



mongoose.connect(`${process.env.DATABASE}`)
    .then(() => console.log(`Database connected! ${process.env.DATABASE}`))
    .catch(err => console.log(`Failed to connect to database: ${err.message}`))






app.set('socketio', io)

app.use(global_sanitize)

app.use('/profile', profileRoute)
app.use('/auth', authRoute)
app.use('/chatto', chattoRoute)
app.use('/prompt', promptRoute)

app.use(error_handler)



promptDisplay(io)

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
        socket.removeAllListeners()
    })
})
// Prompt.findOne()


// io.on('connection', (socket) => {
//     console.log('user connected')

    

    
//     socket.on('disconnect', () => {
//         console.log('user disconnected')
//         socket.removeAllListeners()
//     })
// })




if (process.env.NODE_ENV !== 'test') {
    server.listen(3002, () => console.log(`server running on port ${3002}`))
}
