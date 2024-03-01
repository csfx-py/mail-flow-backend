const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
});

userSchema.pre("save", async function (next) {
  const user = await this.model("User").findOne({ email: this.email });
  if (user) {
    throw new Error("User already exists");
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
