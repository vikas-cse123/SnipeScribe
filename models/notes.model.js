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
    }

},{timestamps:true})


const Note = mongoose.model("Note",notesSchema)
export default Note
