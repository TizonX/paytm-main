const express = require("express");
const { authMiddleware } = require("../middleware");
require("dotenv").config();
const router = express.Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const Account = require("../models/Account");

const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  password: z.string(),
});
router.post("/signup", async (req, res) => {
  try {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) return res.status(400).send("Invalid data");
    const user = await Users.findOne({ username: req.body.username });
    if (user) return res.status(400).send("User already exists");
    const dbUser = await Users.create(req.body);
    const userId = dbUser._id;
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });
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
  } catch (error) {
    return res.status(500).send(error);
  }
});

// other auth routes

const updateBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
 try {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  const a = await Users.updateOne({
    _id: req.userId,
  },req.body, );

  res.json({
    message: "Updated successfully",
  });
 } catch (error) {
  return res.status(500).send(error.message);
 }
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await Users.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
