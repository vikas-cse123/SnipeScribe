import User from "../models/user.model.js";

export const addBookmark = async (req, res) => {
  try {
  
    const result = await User.updateOne({_id:req.user._id}, {
      $addToSet: { bookmarks: req.note._id },
    });
    if(result.modifiedCount === 0){
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

