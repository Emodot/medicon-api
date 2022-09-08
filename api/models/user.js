const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
});

userSchema.statics.checkCredentials = async (email, password) => {
  //check if email is in the database
  const user = await User.findOne({ email });

  if (!user) {
    //if not rgistered throw error
    throw new Error("User Not Found");
  }

  const hashedPass = user.password;
  const validatePassword = await bcrypt.compare(password, hashedPass);

  if (!validatePassword) {
    throw new Error("Username and Password Not Correct");
  }

  return user;
};

userSchema.methods.generateTokens = async function () {
  //The user is now been represented with this keyword
  const user = this;
  if (!user) {
    throw new Error("User Not Found");
  }
  const token = await jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_KEY,
    { expiresIn: "5 days" }
  );
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  //Send Pre-notification details to user that his details will be removed from  the site and bla bla bla
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
