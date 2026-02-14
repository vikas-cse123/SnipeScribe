import mongoose from "mongoose";
const notesSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true

    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
        expires:60*60*24*30
    },
    isPublic:{
        type:Boolean,
        default:false
    },
    shareToken:{
        type:String,
        
    }

},{timestamps:true})


notesSchema.index({title:"text",description:"text"})

const Note = mongoose.model("Note",notesSchema)
export default Note
