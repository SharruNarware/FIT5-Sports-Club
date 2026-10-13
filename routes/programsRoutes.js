const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("programs/programs");
});

module.exports = router;