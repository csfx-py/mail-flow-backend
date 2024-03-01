const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const createToken = (user, secret, exp) => {
  const { userName } = user;
  return jwt.sign(
    {
      userName,
      _id: user._id,
    },
    secret,
    { expiresIn: exp }
  );
};

router.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user, process.env.SECRET, "1h");
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({
        success: true,
        token,
        msg: "User created",
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: err,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw Error("User does not exist");
    const validated = await bcrypt.compare(password, user.password);
    if (!validated) throw Error("Password is incorrect");
    const token = createToken(user, process.env.SECRET, "1h");
    res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      token,
      msg: "User logged in",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: err,
    });
  }
});

router.get("/refresh", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) throw Error("No token found");

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SEC);
    if (!verified) throw Error("Token verification failed");

    const user = await User.findById(verified._id);
    if (!user) throw Error("User does not exist");

    const newToken = createToken(user, process.env.ACCESS_TOKEN_SEC, "168h");

    res
      .cookie("token", newToken, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        token: newToken,
        message: "Token refreshed successfully",
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
});

router.get("/logout", async (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .status(200)
      .json({
        success: true,
        msg: "User logged out",
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: err,
    });
  }
});

module.exports = router;
