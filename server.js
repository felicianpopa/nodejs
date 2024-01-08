require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

//Connect to MongoDB
connectDB();

//Custom middleware logger (custom middleware needs next)
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, "/public")));

//serve static files for subdir
app.use("/subdir", express.static(path.join(__dirname, "/public")));

//add routing for subdir
app.use("/subdir", require("./routes/subdir"));

//add routing for root files
app.use("/", require("./routes/root"));

//add routing for register
app.use("/register", require("./routes/register"));

//add routing for auth
app.use("/auth", require("./routes/auth"));

//add routing for refresh
app.use("/refresh", require("./routes/refresh"));

//add routing for logout
app.use("/logout", require("./routes/logout"));

// all routes after this will need to first validate the verifyJWT
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.warn("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
