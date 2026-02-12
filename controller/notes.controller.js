import Note from "../models/notes.model.js";
import User from "../models/user.model.js";
import { formatValidationError } from "../utils/errorFormatter.js";

export const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const note = await Note.create({
      title,
      description,
      userId: req.user._id,
    });
    return res.status(201).json({
      success: true,
      message: "Note created successfully.",
      data: { id: note._id },
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const errors = formatValidationError(error);
      return res
        .status(400)
        .json({ success: false, message: "Validation failed", errors });
    }
  }
};



export const updateNote = async (req, res) => {
  try {
    const title = req.body.title ? req.body.title : undefined;
    const description = req.body.description ? req.body.description : undefined;
    await Note.updateOne(
      { _id: req.params.noteId, userId: req.user._id, isDeleted: false },
      { title, description },
    );
    return res
      .status(200)
      .json({ success: true, message: "Note updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update note. Please try again later.",
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    console.log({ page, limit });
    page = parseInt(page);
    limit = parseInt(limit);
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;
    if (limit > 50) limit = 50;
    const skip = (page - 1) * limit;

    const notes = await Note.find({ userId: req.user._id, isDeleted: false })
      .sort({ createdAt: -1 })

      .skip(skip)
      .limit(limit);
    const totalNotes = await Note.countDocuments({
      userId: req.user._id,
      isDeleted: false,
    });
    const totalPages = Math.ceil(totalNotes / limit);
    return res.status(200).json({
      success: true,
      data: notes,
      pagination: {
        currentPage: page,
        totalPages,
        totalNotes,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


export const moveNoteToTrash= async (req, res) => {
  try {
    const result = await Note.updateOne(
      { _id: req.note._id, isDeleted: false },
      { isDeleted: true, deletedAt: Date.now() },
    );
    if (result.modifiedCount === 1) {
      await User.updateOne(
        { _id: req.user._id },
        { $push: { deletedNotes: { noteId: req.note._id } } },
      );
    }

    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete note. Please try again later.",
    });
  }
};

export const permanentlyDeleteNote = async (req, res) => {
  try {
    console.log("111111111", req.note);
    if (!req.note.isDeleted) {
      return res.status(400).json({
        success: true,
        message: "Note must be in trash before permanent deletion.",
      });
    }
    await Note.findByIdAndDelete(req.note._id);

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { deletedNotes: { noteId: req.note._id } } },
    );

    return res.status(204).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const restoreNote = async (req, res) => {
  try {
    console.log(req.note);
    if (!req.note.isDeleted) {
      return res.status(409).json({
        success: false,
        message: "Note is not in trash.",
      });
    }
    await Note.updateOne(
      { _id: req.note._id },
      { $set: { isDeleted: false }, $unset: { deletedAt: "" } },
    );
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { deletedNotes: { noteId: req.note._id } } },
    );

    return res.status(200).json({
      success: true,
      message: "Note restored successfully.",
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

export const getTrashedNotes = async (req,res) => {
  try {

    let {page=1,limit=3} = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    if(page< 1) page =1
    if(limit<1) limit=1
    if(limit>50) limit = 50

    const startIdx = (page-1)*limit
    const currentPageNotesId = [...req.user.deletedNotes].reverse().slice(startIdx,startIdx+limit).map(({noteId} )=> noteId)
    const notes = await Note.find({_id:{$in:currentPageNotesId},userId:req.user._id}).sort({createdAt:-1})
    const totalNotes = req.user.deletedNotes.length
    const totalPages = Math.ceil(totalNotes/limit)
    return res.status(200).json({success:true,data:notes,pagination:{
      currentPage:page,
      totalPages,
      totalNotes,
      limit,
      hasNextPage:page<totalPages,
      hasPrevPage:page>1
    }})

  } catch (error) {
    next(error)
    
    
  }
}

export const emptyTrash = async (req,res) => {
  try {
    const allNotesId = req.user.deletedNotes.map(({noteId}) => noteId)
    await Note.deleteMany({_id:{$in:allNotesId}})
     await User.updateOne({_id:req.user._id},{$set:{deletedNotes:[]}})
    return res.status(204).end()


    
  } catch (error) {
    console.log(error);
    next(error)
  }
}