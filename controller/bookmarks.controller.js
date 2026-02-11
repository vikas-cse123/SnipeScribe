import mongoose from "mongoose";
import User from "../models/user.model.js";

export const addBookmark = async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.user._id },
      {
        $addToSet: { bookmarks: req.note._id },
      },
    );
    if (result.modifiedCount === 0) {
      return res
        .status(200)
        .json({ success: true, message: "Note is already in bookmarks." });
    }
    return res
      .status(200)
      .json({ success: false, message: "Note added to bookmarks." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add  note to bookmarks. Please try again later.",
    });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const allBookmarks = req.user.bookmarks.map((bookmark) =>
      bookmark.toString(),
    );
    if (!allBookmarks.includes(req.params.noteId.toString())) {
      return res
        .status(404)
        .json({ success: true, message: "Bookmark not found" });
    }
    const updatedBookmarks = allBookmarks
      .filter((bookmark) => bookmark !== req.params.noteId)
      .map((bookmark) => new mongoose.Types.ObjectId(bookmark));
    await User.findByIdAndUpdate(
      req.user._id,
      { $set: { bookmarks: updatedBookmarks } },
      { new: true },
    );
    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to remove bookmark. Please try again later.",
      });
  }
};
