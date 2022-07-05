import { Schema, model } from 'mongoose'

interface Verification {
    path: string,
    codeHashed: string,
    type: string,
    tries: number,
    data: {
        email?:string
        username?:string
        password?:string
        user_id?:string
        fakeVerification?:boolean
    }
    expireAt: Date
}

const VerificationSchema = new Schema<Verification>({
    path: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    codeHashed: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    tries: {
        type: Number,
        required: true,
        default: 10,
        min: 0
    },
    data: {
        type: Object,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }

}, { timestamps: true })

export default model('Verification', VerificationSchema)
