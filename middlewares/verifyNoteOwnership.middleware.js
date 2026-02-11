import Note from "../models/notes.model.js";

export const verifyNoteOwnership = async (req, res, next) => {
  try {
    const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    return res.status(404).json({ success: false, message: "Note not found." });
  }

  if (note.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to  this note.",
    });
  }
  req.note = note;
  next();
    
  } catch (error) {
    console.log(error)
    next()
    
  }
};
