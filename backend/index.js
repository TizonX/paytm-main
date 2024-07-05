const express = require("express");
require("dotenv").config();
const { connectMongoDB } = require("./db");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
connectMongoDB(process.env.MONGODB_URL);

const mainRouter = require("./routes");
app.use("/api/v1", mainRouter);
app.listen(5000);
