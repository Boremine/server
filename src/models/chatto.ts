import {Schema, model} from 'mongoose'

interface Chatto {
    message:string,
    user_id:Schema.Types.ObjectId
    mural_id:Schema.Types.ObjectId

}

const ChattoSchema = new Schema<Chatto>({
    message:{
        type:String,
        required:true,
        maxlength: 200
    },
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    mural_id:{
        type:Schema.Types.ObjectId,
        ref:'Mural',
        index:true
    }

}, { timestamps: true })





export default model('Chatto', ChattoSchema)



