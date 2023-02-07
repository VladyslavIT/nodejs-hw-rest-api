const { User } = require("../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const gravatar = require("gravatar");
const sendEmail = require("../../helpers/sendEmail");
const { v4 } = require("uuid");

const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    const avatarURL = gravatar.url(email);
    const verificationToken = v4();
    const savedUser = await User.create({
      email,
      password: hashedPass,
      avatarURL,
      verify: false,
      verificationToken,
    });

    await sendEmail({
      to: email,
      subject: "Please verify you account",
      html: `<h1>Hello, ${email} </h1>
      <a href = "http://localhost:3000/api/users/verify/${verificationToken}" target="_blank">Verify email</a>`,
    });

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

    if (!storedUser.verify) {
      res.status(401).json({
        message: "Email is not verified, Please, check your email",
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

const uploadAvatar = async (req, res, next) => {
  const { _id: id } = req.user;
  const { filename, path: tempPath } = req.file;
  const avatarName = `${id}.${filename}`;
  const publicPath = path.join(
    __dirname,
    "../../",
    "public",
    "avatars",
    filename
  );

  try {
    await fs.rename(tempPath, publicPath);

    Jimp.read(publicPath)
      .then((avatar) => {
        return avatar.resize(250, 250).write(publicPath);
      })
      .catch((error) => {
        throw error;
      });

    const avatarURL = path.join("public", "avatars", avatarName);

    const result = await User.findByIdAndUpdate(
      id,
      { avatarURL },
      { new: true }
    );

    if (!result) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    res.status(200).json({ data: { result } });
  } catch (error) {
    await fs.unlink(tempPath);
    throw error;
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = User.findOne({ verificationToken: token });

    if (!user) {
      res.status(404).json({
        message: 'User not found'
      });
    }

    User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({
      message: 'Verification successful',
    });

  } catch (error) {
    console.error(error);
    next();
  }
};

const secondVerifyEmail = async(req, res, next) => {
  try {
    console.log('hi');
  } catch (error) {
    console.error(error);
    next();
  }
};

module.exports = {
  register,
  login,
  getUser,
  logout,
  uploadAvatar,
  verifyEmail,
  secondVerifyEmail
};
