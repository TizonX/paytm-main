const mongoose = require("mongoose");

// auth schema

const authSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const Users = mongoose.model("users", authSchema);

module.exports = Users;
