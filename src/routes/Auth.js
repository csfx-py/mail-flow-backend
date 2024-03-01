const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const createToken = (user, secret, exp) => {
  const { name } = user;
  return jwt.sign(
    {
      name,
      shopName,
    },
    secret,
    { expiresIn: exp }
  );
};

router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    !user && res.status(400).json("Wrong credentials!");
    const validated = await bcrypt.compare(password, user.password);
    !validated && res.status(400).json("Wrong credentials!");
    const token = createToken(user, process.env.SECRET, "1h");
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
