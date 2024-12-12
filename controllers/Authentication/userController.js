import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import uploadAndGetAvatarUrl from "../../utils/uploadAndGetAvatarUrl.utils.js";
import UserModel from "../../models/UserModel.js";
import AuthController from "./authController.js";
class UserController {
  static getAllUser = catchAsyncError(async (req, res, next) => {
    console.log("getAll user called ")
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { config } = req.query;

    // Check if config is provided and is true
    if (config === 'true') {
      const users = await UserModel.find().select("firstName lastName");
      return res.status(200).json({
        status: "success",
        message: "Config users fetched successfully",
        data: { config: true, users },
      });
    }

    const totalCount = await UserModel.countDocuments(); // Ensure this is awaited
    const users = await UserModel.find().populate("role").limit(limit).skip(skip).select("-password");

    return res.status(200).json({
      status: "success",
      message: "All user fetched successfully",
      data: { page, limit, totalCount, users }
    });
});
 
static generateAlphabetPassword = (length = 4) =>
  Array.from({ length }, () =>
    String.fromCharCode(Math.random() < 0.5 ? 65 + Math.floor(Math.random() * 26) : 97 + Math.floor(Math.random() * 26))
  ).join('');

  static getUser = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const user = await UserModel.findById(id).select("-password");
    if (!user) throw new ServerError("NotFound", "User");
    res.status(201).json({
      status: "success",
      message: " user fetched successfully",
      data: user,
    });
  });

  static createUser = catchAsyncError(async (req, res, next) => {
    const password = `AXRC${this.generateAlphabetPassword()}`;
    req.body.password = password;
    req.body.password_confirmation = password;
    AuthController.signup(req, res, true); // true for not sending otp
  });

  static updateUser = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const updateData = req.body;

    const user = await UserModel.findById(id);
    if (!user) throw new ServerError("NotFound", "user");
    Object.keys(updateData).forEach((key) => {
      if(key != "_id" && key != "password" && key != "otp" && key != "isVerified" )
      if(key == 'city' || key == 'country' || key == 'state' ){
        user['address'][key] = updateData[key];
      }else{
        user[key] = updateData[key];
      }
    });
    if (req.file) {
      user.avatar = await uploadAndGetAvatarUrl(
        req.file,
        "user",
        user._id,
        "stream"
      );
    }
    await user.save();
    res.status(201).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  });

  static deleteUser = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const user = await UserModel.findByIdAndDelete(id);
    res.status(201).json({
      status: "success",
      message: "User deleted successfully",
      data: user,
    });
  });
}

export default UserController;
