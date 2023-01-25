const { User } = require("../../models/users");
const bcrypt = require('bcrypt');

const register =  async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    const savedUser = await User.create({email, password: hashedPass});
    console.log(email, password);
    if(!savedUser) {
      res.status(409).json({
        message: 'Email or password is wrong'
      })
    }
    res.status(201).json({
       data: {
        user: savedUser
       }
    })
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    console.log(email, password);
    const storedUser =  await User.findOne({email});
    if(!storedUser) {
      res.status(401).json({
        message: 'Email or password is wrong'
      });
    }

  const isPassValid = await bcrypt.compare(password, storedUser.password);
  if(!isPassValid) {
    res.status(401).json({
      message: 'Email or password is wrong'
    });
  }

   res.status(200).json({
    data: '*TOKEN*'
   });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register, login
};
