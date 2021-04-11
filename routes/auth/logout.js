const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.clearCookie("auth-token").redirect('/');
});

// EXPORT
module.exports = router;
