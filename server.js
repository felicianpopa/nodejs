const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3500;

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

//Custom middleware logger (custom middleware needs next)
app.use(logger);

// List of websites allowed to access the node back-end
const whitelist = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];

const corsOptions = {
  origin: (originFromWebsite, callback) => {
    if (whitelist.indexOf(originFromWebsite) !== -1 || !originFromWebsite) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, "/public")));

//serve static files for subdir
app.use("/subdir", express.static(path.join(__dirname, "/public")));

//add routing for subdir
app.use("/subdir", require("./routes/subdir"));

//add routing for root files
app.use("/", require("./routes/root"));

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
