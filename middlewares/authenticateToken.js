import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js"; // Assuming this is the path to your User model

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token; // Retrieve the token from cookies

  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "No token provided, please login.",
    });
  }

  try {
    // Decode and verify the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user by the decoded userId
    const user = await UserModel.findById(decodedToken.userId)
      .populate({
        path: "role",
        populate: {
          path: "permissions.entity", // Deep populate the entity inside permissions
          model: "Entity", // Replace with your entity model name if different
        },
      })
      .exec();

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "User not found, please login.",
      });
    }

    req.user = user; // Attach the user to the request object for further processing
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({
      status: "failed",
      message: "Invalid or expired token.",
    });
  }
};

export default authenticateToken;
