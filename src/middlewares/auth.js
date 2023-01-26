const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer") {
      res.status(401).json({
        message: "type of header is not valid",
      });
      return;
    }

    if (!token) {
      res.status(401).json({
        message: "token is not valid",
      });
      return;
    }

    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      console.log(error.name);
      res.status(401).json({
        message: "token invalid",
      });
    }
    next(error);
  }
};

module.exports = auth;
