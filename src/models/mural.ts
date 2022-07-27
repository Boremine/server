import { Schema, model } from 'mongoose'

interface Mural {
    title: string
    text: string
    user_id: Schema.Types.ObjectId | any
    pops: number
    drops: number
    commentary: Array<any>
    chattoes_amount:number
    comments_amount:number
    likes: Array<any>
    likes_amount:number
    dislikes: Array<any>
    dislikes_amount:number
}

const MuralSchema = new Schema<Mural>({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: false
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    pops: {
        type: Number,
        required: true
    },
    drops: {
        type: Number,
        required: true
    },
    commentary: [{
        type: Schema.Types.ObjectId,
        ref: 'Commentary'
    }],
    chattoes_amount: {
        type: Number,
        required: true
    },
    comments_amount: {
        type: Number,
        required: true,
        default: 0
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
    }
}, { timestamps: true })

export default model('Mural', MuralSchema)
