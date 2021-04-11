require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SETTINGS
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// ROUTES
// Login
router.get("/login", (req, res) => {
  res.render("auth/login", { message: false });
});
router.post("/login", async (req, res) => {
  let body = req.body;
  const userFound = await User.findOne({ username: body.username });

  if (!userFound) {
    res.render("auth/login", { message: "No User found" });
  } else {
    let user = {
      id: userFound._id,
    };
    if (await bcrypt.compare(body.password, userFound.password)) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res
        .cookie("auth-token", accessToken, { maxAge: 2592000000 })
        .redirect("/admin");
    } else {
      res.render("auth/login", { message: "Incorrect Password" });
    }
  }
});

// EXPORT
module.exports = router;
