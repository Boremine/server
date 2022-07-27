import { Schema, model } from 'mongoose'

interface Commentary {
    message: string,
    user_id: Schema.Types.ObjectId
    mural_id: Schema.Types.ObjectId
    likes: number
    dislikes: number
    fromChatto: boolean
}

const CommentarySchema = new Schema<Commentary>({
    message: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    mural_id: {
        type: Schema.Types.ObjectId,
        ref: 'Mural',
        index: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    dislikes: {
        type: Number,
        required: true,
        default: 0
    },
    fromChatto: {
        type: Boolean,
        required: true,
        default: false
    }

}, { timestamps: true })

export default model('Commentary', CommentarySchema)
