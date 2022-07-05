import { Schema, model } from 'mongoose'

interface ForgotPassword {
    token: string,
    expireAt: Date
}

const ForgotPasswordSchema = new Schema<ForgotPassword>({
    token: {
        type: String,
        required: true,
        index: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }

}, { timestamps: true })

export default model('ForgotPassword', ForgotPasswordSchema)
