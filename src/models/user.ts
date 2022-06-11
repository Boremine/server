import {Schema, model} from 'mongoose'

interface User {
    username: string,
    usernameDisplay: string,
    email: string,
    password: string,
    logs:Array<any>
    chatties:Array<any>,
    mural:Array<any>
    prompt_id:Schema.Types.ObjectId
    color:string
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
        maxlength: 50,
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
    color:{
        type:String,
        required:true
    },
    logs:[{
        type:Schema.Types.ObjectId,
        ref: 'Log'
    }],
    chatties:[{
        type:Schema.Types.ObjectId,
        ref:'Chatto'
    }],
    mural:[{
        type:Schema.Types.ObjectId,
        ref: 'Mural'
    }],
    prompt_id:{
        type: Schema.Types.ObjectId,
        ref:'Prompt'
    }

}, { timestamps: true })




export default model('User', UserSchema)