import { Schema, model } from 'mongoose'

interface Log {
    browser: string
    os: string
    ip: string
    device: string
    location: string
    user_id: Schema.Types.ObjectId,
    refreshToken_id: Schema.Types.ObjectId | any
}

const LogSchema = new Schema<Log>({
    browser: {
        type: String
    },
    os: {
        type: String
    },
    ip: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    refreshToken_id: {
        type: Schema.Types.ObjectId,
        ref: 'RefreshToken',
        index: true
    }

}, { timestamps: true })

export default model('Log', LogSchema)
