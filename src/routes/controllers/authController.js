const { User } = require("../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    const savedUser = await User.create({ email, password: hashedPass });

    if (!savedUser) {
      res.status(409).json({
        message: "Email or password is wrong",
      });
    }
    res.status(201).json({
      data: {
        user: savedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const storedUser = await User.findOne({ email });
    if (!storedUser) {
      res.status(401).json({
        message: "Email is wrong",
      });
    }

    const isPassValid = await bcrypt.compare(password, storedUser.password);
    if (!isPassValid) {
      res.status(401).json({
        message: "Password is wrong",
      });
    }

    const token = jwt.sign({ id: storedUser._id }, JWT_SECRET);

    res.status(200).json({
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { user } = req;
    const { email, _id: id } = user;
    res.status(200).json({
      data: {
        user: {
          email,
          id,
        },
      },
    });
  } catch (error) {
    next();
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, { token: null });
    if (!result) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    res.status(204).json();
  } catch (error) {
    next();
  }
};

module.exports = {
  register,
  login,
  getUser,
  logout,
};
