const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("about/about");
});

router.get("/our-team", (req, res) => {
    res.render("about/our-team");
});

module.exports = router;