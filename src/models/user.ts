import { Schema, model } from 'mongoose'

interface User {
    username: string,
    usernameDisplay: string,
    email: string,
    password: string,
    logs: Array<any>
    commentaries: Array<any>,
    mural: Array<any>,
    prompt_id: Schema.Types.ObjectId | any
    color: string
    alreadyVoted: 'none' | 'drop' | 'pop'
    lastUsernameUpdate: Date
    googleId: string
}

const UserSchema = new Schema<User>({
    username: {
        type: String,
        trim: true,
        required: true,
        maxlength: 20,
        unique: true,
        index: true,
        lowercase: true
    },
    usernameDisplay: {
        type: String,
        trim: true,
        required: true,
        maxlength: 20
    },
    email: {
        type: String,
        maxlength: 254,
        index: true,
        lowercase: true
    },
    password: {
        type: String,
        maxlength: 256
    },
    color: {
        type: String,
        required: true
    },
    logs: [{
        type: Schema.Types.ObjectId,
        ref: 'Log'
    }],
    commentaries: [{
        type: Schema.Types.ObjectId,
        ref: 'Commentary'
    }],
    mural: [{
        type: Schema.Types.ObjectId,
        ref: 'Mural'
    }],
    prompt_id: {
        type: Schema.Types.ObjectId,
        ref: 'Prompt'
    },
    alreadyVoted: {
        type: String,
        required: true
    },
    lastUsernameUpdate: {
        type: Date
    },
    googleId: {
        type: String
    }

}, { timestamps: true })

export default model('User', UserSchema)
