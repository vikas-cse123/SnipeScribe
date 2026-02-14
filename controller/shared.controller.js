import Note from "../models/notes.model.js";

import crypto from "crypto"
export const enableNoteSharing = async (req,res,next) => {
  try {
    if(req.note.isDeleted){
       return res.status(404).json({
        success: false,
        message: "Note not found",
      });

    }
    const shareToken = crypto.randomBytes(32).toString("hex")

   await Note.updateOne({_id:req.note._id,userId:req.user._id},{$set:{isPublic:true,shareToken}})
   return res.status(200).json({success:true,data:{shareUrl:`${process.env.FRONTEND_URL}/shared/${shareToken}`}})
    
    
  } catch (error) {
    console.log(error);
    next(error)
    
  }
}

export const getSharedNote = async (req,res,next) => {
  try {
    const { shareToken } = req.params;
    const note = await Note.findOne({shareToken,isPublic:true,isDeleted:false})
    if(!note){
       return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    return res.status(200).json({success:true,data:note})

  } catch (error) {
    console.log(error);
    next(error);
  }
};
