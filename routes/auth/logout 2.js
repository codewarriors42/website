const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.clearCookie("auth-token").redirect("/auth/login");
});

// EXPORT
module.exports = router;
