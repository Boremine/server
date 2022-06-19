import { Schema, model } from 'mongoose'

interface RefreshToken {
    token: string,
    log_id: Schema.Types.ObjectId
    version: number
    expireAt: Date
    history: Array<string>
}

const RefreshTokenSchema = new Schema<RefreshToken>({
    token: {
        type: String,
        required: true,
        index: true
    },
    history: [{
        type: String
    }],
    log_id: {
        type: Schema.Types.ObjectId,
        ref: 'Log',
        index: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 31556952
    }

}, { timestamps: true })

export default model('RefreshToken', RefreshTokenSchema)
