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
    alreadyVoted: 'false' | 'drop' | 'pop'
    lastUsernameUpdate: Date
}

const UserSchema = new Schema<User>({
    username: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50,
        unique: true,
        index: true,
        lowercase: true
    },
    usernameDisplay: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        maxlength: 254,
        index: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
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
        type: Date,
        default: Date.now
    }

}, { timestamps: true })

export default model('User', UserSchema)
