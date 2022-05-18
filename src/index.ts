import express, { Application } from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import slowDown from 'express-slow-down'


import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()



console.log(process.env.NODE_ENV)
export const app: Application = express()

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
// app.use(useragent.express())
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





if (process.env.NODE_ENV !== 'test') {
    app.listen(3002, () => console.log(`server running on port ${3002}`))
}
