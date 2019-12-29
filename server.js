const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();
app.use(express.json());

// DB config
const db = require("./config/keys").mongoURI;

// Connecting to MongoDB
mongoose.connect(
  db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  err => {
    err
      ? (process.exit(1), console.log("Unable to connect to DataBase"))
      : console.log("MongoDB Connected");
  }
);

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Using Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Running Server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
