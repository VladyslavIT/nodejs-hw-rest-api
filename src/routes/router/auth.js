const express = require("express");
const authRouter = express.Router();
const auth = require("../../middlewares/auth");
const {
  register,
  login,
  getUser,
  logout,
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

module.exports = authRouter;
