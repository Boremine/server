import {Schema, model} from 'mongoose'

interface Prompt {
    text:string
    user_id:Schema.Types.ObjectId | any
    color:string
}

const PromptSchema = new Schema<Prompt>({
    text:{
        type:String,
        required:true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    color: {
        type:String,
        required:true
    }

}, { timestamps: true })




export default model('Prompt', PromptSchema)