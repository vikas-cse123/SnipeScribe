import Note from "../models/notes.model.js";
import { formatValidationError } from "../utils/errorFormatter.js";

export const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const note = await Note.create({
      title,
      description,
      userId: req.user._id,
    });
    return res
      .status(201)
      .json({
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

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found." });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You do not have permission to delete this note.",
        });
    }
    await note.deleteOne();
    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete note. Please try again later.",
    });
  }
};
