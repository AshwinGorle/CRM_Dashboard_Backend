import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import uploadAndGetAvatarUrl from "../../utils/uploadAndGetAvatarUrl.utils.js";
import UserModel from "../../models/UserModel.js";
import AuthController from "./authController.js";

const isSuperAdmin = (role) => role.name === "SUPER ADMIN";

class UserController {
  static getAllUser = catchAsyncError(async (req, res, next) => {
    console.log("getAll user called - allowed roleIds", req.allowedRoleIds);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { config } = req.query;

    // Check if config is provided and is true
    if (config === "true") {
      const users = await UserModel.find().select("firstName lastName");
      return res.status(200).json({
        status: "success",
        message: "Config users fetched successfully",
        data: { config: true, users },
      });
    }

    let baseQuery = {};

    // Check if user is not super admin
    if (!isSuperAdmin(req.user.role)) {
      const allowedRoleIds = req.allowedRoleIds;
      if (!allowedRoleIds || allowedRoleIds.length === 0) {
        return res.status(403).json({
          status: "error",
          message: "You do not have permission to access any users.",
        });
      }
      baseQuery.role = { $in: allowedRoleIds };
    }

    const totalCount = await UserModel.countDocuments(baseQuery);
    const users = await UserModel.find(baseQuery)
      .populate("role")
      .limit(limit)
      .skip(skip)
      .select("-password");

    const usersWithoutSuperAdmin = users.filter(
      (user) =>
        user.role.name != "SUPER ADMIN" &&
        user._id.toString() != req.user._id.toString()
    );

    return res.status(200).json({
      status: "success",
      message: "All user fetched successfully",
      data: { page, limit, totalCount, users: usersWithoutSuperAdmin },
    });
  });

  static generateAlphabetPassword = (length = 4) =>
    Array.from({ length }, () =>
      String.fromCharCode(
        Math.random() < 0.5
          ? 65 + Math.floor(Math.random() * 26)
          : 97 + Math.floor(Math.random() * 26)
      )
    ).join("");

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
      if (
        key != "_id" &&
        key != "password" &&
        key != "otp" &&
        key != "isVerified"
      )
        if (key == "city" || key == "country" || key == "state") {
          user["address"][key] = updateData[key];
        } else {
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
