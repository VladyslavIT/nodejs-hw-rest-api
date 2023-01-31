const express = require("express");
const authRouter = express.Router();
const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");
const {
  register,
  login,
  getUser,
  logout,
  uploadFile
} = require("../controllers/authController");
const { validateSchema } = require("../../middlewares/validateSchema");
const {
  registerSchema,
  loginSchema,
} = require("../../middlewares/authValidate");


authRouter.post("/signup", validateSchema(registerSchema), register);
authRouter.post("/login", validateSchema(loginSchema), login);
authRouter.get("/current", auth, getUser);
authRouter.get("/logout", auth, logout);
authRouter.post("/avatars", upload.single("avatar"), uploadFile);

module.exports = authRouter;
