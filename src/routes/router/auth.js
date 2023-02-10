const express = require("express");
const authRouter = express.Router();
const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");
const {
  register,
  login,
  getUser,
  logout,
  uploadAvatar,
  verifyEmail,
  secondVerifyEmail,
} = require("../controllers/authController");
const { validateSchema } = require("../../middlewares/validateSchema");
const {
  registerSchema,
  loginSchema,
  verifySchema,
} = require("../../middlewares/authValidate");

authRouter.post("/signup", validateSchema(registerSchema), register);
authRouter.post("/login", validateSchema(loginSchema), login);
authRouter.get("/current", auth, getUser);
authRouter.get("/logout", auth, logout);
authRouter.patch("/avatars", auth, upload.single("avatar"), uploadAvatar);
authRouter.get("/verify/:token", verifyEmail);
authRouter.post("/verify", validateSchema(verifySchema), secondVerifyEmail);

module.exports = authRouter;
