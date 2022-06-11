import {Schema, model} from 'mongoose'

interface Mural {
    text:string
    user_id:Schema.Types.ObjectId | any
    pops:number
    drops:number
    chattoes:Array<any>
}

const MuralSchema = new Schema<Mural>({
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
    pops: {
        type:Number,
        required:true
    },
    drops: {
        type:Number,
        required:true
    },
    chattoes:[{
        type:Schema.Types.ObjectId,
        ref: 'Chatto',
    }]


}, { timestamps: true })




export default model('Mural', MuralSchema)