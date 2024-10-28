import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import StaffModel from "../../models/StaffModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import uploadAndGetAvatarUrl from "../../utils/uploadAndGetAvatarUrl.utils.js";
import UserModel from "../../models/UserModel.js";
class StaffController {
  static getAllStaff = catchAsyncError(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { config } = req.query;

    // Check if config is provided and is true
    if (config === 'true') {
      const staffs = await StaffModel.find().select("firstName lastName");
      return res.status(200).json({
        status: "success",
        message: "Config staffs fetched successfully",
        data: { config: true, staffs },
      });
    }

    const totalCount = await StaffModel.countDocuments(); // Ensure this is awaited
    const staffs = await StaffModel.find().limit(limit).skip(skip);

    return res.status(200).json({
      status: "success",
      message: "All staff fetched successfully",
      data: { page, limit, totalCount, staffs },
    });
});


  static getStaff = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const staff = await StaffModel.findById(id);
    if (!staff) throw new ServerError("NotFound", "Staff");
    res.status(201).json({
      status: "success",
      message: " staff fetched successfully",
      data: staff,
    });
  });

  static createStaff = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, phone, email, address, role, gender, DOB } = req.body;
    const staff = await new StaffModel({
      firstName,
      lastName,
      phone,
      email,
      address,
      role,
      gender,
      DOB
    });
    console.log("creating staff");
    console.log("creating staff", staff);
    if (req.file) {
      console.log("file ", req.file);
      staff.avatar = await uploadAndGetAvatarUrl(
        req.file,
        "staff",
        staff._id,
        "stream"
      );
    }
    await staff.save();
    res.status(201).json({
      status: "success",
      message: "Staff created successfully",
      data: staff,
    });
  });

  static updateStaff = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const updateData = req.body;
    console.log("data to update : ", updateData)
    const staff = await StaffModel.findById(id);
    if (!staff) throw new ServerError("NotFound", "staff");
    Object.keys(updateData).forEach((key) => {
      staff[key] = updateData[key];
    });
    if (req.file) {
      staff.avatar = await uploadAndGetAvatarUrl(
        req.file,
        "staff",
        staff._id,
        "stream"
      );
    }
    await staff.save();
    res.status(201).json({
      status: "success",
      message: "Staff updated successfully",
      data: staff,
    });
  });

  static deleteStaff = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const staff = await StaffModel.findByIdAndDelete(id);
    res.status(201).json({
      status: "success",
      message: "Staff deleted successfully",
      data: staff,
    });
  });
}

export default StaffController;
