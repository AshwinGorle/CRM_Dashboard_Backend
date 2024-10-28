import express from "express";
import AuthController from "../../controllers/Authentication/authController.js";
import authenticateToken from "../../middlewares/authenticateToken.js";
const authRouter = express.Router();

authRouter.get("/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

authRouter.post("/signup", AuthController.signup);
authRouter.post("/login", AuthController.login);
authRouter.post("/verify-otp", AuthController.verifyOtp);
authRouter.post("/send-otp", AuthController.resendOtp);
authRouter.post("/send-reset-password-email", AuthController.sendResetPasswordEmail);
authRouter.post("/reset-password-with-otp", AuthController.resetPasswordWithOtp);
authRouter.post("/change-password", authenticateToken, AuthController.changePassword);
authRouter.get("/logout", AuthController.logout);

export default authRouter;
