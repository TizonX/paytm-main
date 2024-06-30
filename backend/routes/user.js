const express = require("express");
const router = express.Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  password: z.string(),
});
router.get("/signup", (req, res) => {
  const { success } = signupSchema.parse(req.body);
  if (!success) return res.status(400).send("Invalid data");
  const user = Users.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User already exists");
  const dbUser = Users.create(req.body);
  const token = jwt.sign(
    {
      id: dbUser._id,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      username: dbUser.username,
    },
    process.env.JWT_SECRET
  );
  res.send({ token });
});

module.exports = router;
