const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { routeNotFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./Routes/userRoutes");
const questionRoutes = require("./Routes/questionRoutes");
const submissionRoutes = require("./Routes/submissionRoutes");
const app = express();

//db config
dotenv.config({ path: "backend/config/.env" });
connectDB();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.use("/api/user", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/submission", submissionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

//error handling
app.use(errorHandler);
app.use("/*", routeNotFound);

const PORT = process.env.PORT;
const server = app.listen(PORT, console.log(`Server Started on port ${PORT}`));
