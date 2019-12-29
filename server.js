const express = require("express");
const mongoose = require("mongoose");

const app = express();

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

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
