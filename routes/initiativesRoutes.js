const express = require("express");
const router = express.Router();

// router.get("/", (req, res) => {
//     res.render("initiatives/initiatives");
// });

router.get("/coach-training", (req, res) => {
    res.render("initiatives/coach-training");
});

router.get("/tribal-outreach", (req, res) => {
    res.render("initiatives/tribal-outreach");
});

router.get("/marathons-run", (req, res) => {
    res.render("initiatives/marathons-run");
});

module.exports = router;