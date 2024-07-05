const mongoose = require("mongoose");

// account schema

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  balance: {
    type: Number,
    require: true,
  },
});

const Account = mongoose.model("account", accountSchema);
module.exports = Account;
