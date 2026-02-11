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

export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.note._id);
    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete note. Please try again later.",
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const title = req.body.title ? req.body.title : undefined;
    const description = req.body.description ? req.body.description : undefined;
    await Note.updateOne(
      { _id: req.params.noteId, userId: req.user._id },
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

    const notes = await Note.find({ userId: req.user._id })
      .sort({ createdAt: -1 })

      .skip(skip)
      .limit(limit);
    const totalNotes = await Note.countDocuments({ userId: req.user._id });
    const totalPages = Math.ceil(totalNotes / limit);
    return res.status(200).json({
      success: true,
      message: "",
      data: {
        notes,
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
  }
};
