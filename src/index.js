require("dotenv").config();

const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");

const morgan = require("morgan");

const mongoose = require("mongoose");

const authRoutes = require("./routes/Auth");
const dataRoutes = require("./routes/Node");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

mongoose.connect(process.env.MONGO_URI);

app.use("/auth", authRoutes);
app.use("/node", dataRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
