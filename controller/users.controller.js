export const getCurrentUser = async (req, res) => {
  try {
    return res
      .status(200)
      .json({
        success: true,
        data: { user: { name: req.user.name, email: req.user.email } },
      });
  } catch (error) {
    console.log(error);
    next(error)
  }
};
