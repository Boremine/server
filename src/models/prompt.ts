import { Schema, model } from 'mongoose'

interface Prompt {
    title: string
    text: string
    user_id: Schema.Types.ObjectId | any
    usernameDisplayNOTAUTH: string
    color: string
}

const PromptSchema = new Schema<Prompt>({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    text: {
        type: String,
        maxlength: 5000
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    usernameDisplayNOTAUTH: {
        type: String
    },
    color: {
        type: String,
        required: true
    }

}, { timestamps: true })

export default model('Prompt', PromptSchema)
