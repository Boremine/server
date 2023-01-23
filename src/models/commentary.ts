import { Schema, model } from 'mongoose'

interface Commentary {
    message: string,
    user_id: Schema.Types.ObjectId
    piece_id?: Schema.Types.ObjectId
    likes: Array<any>
    likes_amount: number
    dislikes: Array<any>
    dislikes_amount: number

    nestedComments?: Array<any>
    fromComment_id?: Schema.Types.ObjectId

    fromChatto: boolean

    usernameDisplayNOTAUTH: string
    colorNOTAUTH: string

    updatedAt?: Date
    createdAt: Date
}

const CommentarySchema = new Schema<Commentary>({
    message: {
        type: String,
        required: true,
        maxlength: 300
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    piece_id: {
        type: Schema.Types.ObjectId,
        ref: 'Mural',
        index: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes_amount: {
        type: Number,
        required: true,
        default: 0
    },
    dislikes_amount: {
        type: Number,
        required: true,
        default: 0
    },
    nestedComments: [{
        type: Schema.Types.ObjectId,
        ref: 'Commentary'
    }],
    fromComment_id: {
        type: Schema.Types.ObjectId
    },
    fromChatto: {
        type: Boolean,
        required: true,
        default: false
    },
    usernameDisplayNOTAUTH: {
        type: String
    },
    colorNOTAUTH: {
        type: String
    }

}, { timestamps: true })

export default model('Commentary', CommentarySchema)
