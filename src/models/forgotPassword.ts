import { Schema, model } from 'mongoose'

interface ForgotPassword {
    token: string,
    expireAt: Date,
    user_id: Schema.Types.ObjectId
}

const ForgotPasswordSchema = new Schema<ForgotPassword>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
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
