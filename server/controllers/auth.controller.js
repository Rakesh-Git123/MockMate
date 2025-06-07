import User from "../models/user.model.js"
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { name, email, picture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        picture,
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // MS
      secure: true,
      httpOnly: true, // prevent XSS attacks cross-site scripting attacks
      sameSite: "none", // CSRF attacks cross-site request forgery attacks
      expires: new Date(0)
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",

    });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(0),
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const checkAuth = (req, res) => {
  try {
    const { _id, email, name, picture, role } = req.user;
    res.status(200).json({ success: true, user: { _id, email, name, picture, role } });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};