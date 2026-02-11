import Note from "../models/notes.model.js";
import { formatValidationError } from "../utils/errorFormatter.js";

export const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const note = await Note.create({ title, description, userId: req.user._id });
    return res
      .status(201)
      .json({ success: true, message: "Note created successfully.",data:{id:note._id}});
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
