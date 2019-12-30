const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Controllers (#anis)
const userController = require("../../Controllers/user.controller");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Loading User model
const User = require("../../models/User");

// @route       POST api/users/register
// @desc        Register user route
// @access      Public
router.post("/register", userController.register);

// @route       POST api/users/login
// @desc        Login user route (returning JWT Token)
// @access      Public
router.post("/login", (req, res) => {
  // Check validation
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;
  // Find user by email
  User.findOne({ email }).then(user => {
    //check for user
    if (!user) {
      errors.email = "Unregistered Email";
      return res.status(404).json(errors);
    }
    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched

        const payload = { id: user._id, name: user.name, avatar: user.avatar };

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token // protocol
            });
          }
        );
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route       GET api/users/active-user
// @desc        Return current user
// @access      Private
router.get(
  "/active-user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
