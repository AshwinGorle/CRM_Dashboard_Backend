import mongoose from "mongoose";
import bcrypt from "bcrypt";
const AddressSchema = new mongoose.Schema({
  city : {
   type : String,
  },
  state : {
   type : String,
  },
  country : {
   type : String
  }
})
const UserSchema = new mongoose.Schema(
  {
    avatar : {
      type : String,
      default : ''
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    DOB : {
     type : Date
    },
    gender: {
      type: String,
      required: true,
      enum: ["M", "F", "O"],
    },
    // role: {
    //   type: String,
    //   enum: ["viewer", "admin", "user", "superuser"],
    //   default: "viewer",
    // },
    role : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Role'
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    address : {
     type : AddressSchema
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware to hash password before saving
// UserSchema.pre("save", async function(next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Method to compare password
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
