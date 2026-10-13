const express = require("express");
const router = express.Router();


// Privacy Policy
router.get("/privacy-policy", (req, res) => {
    res.render("legal/privacy-policy");
});


// Terms & Conditions
router.get("/terms-and-conditions", (req, res) => {
    res.render("legal/terms-and-conditions");
});


// Disclaimer
router.get("/disclaimer", (req, res) => {
    res.render("legal/disclaimer");
});


// Refund Policy
router.get("/refund-policy", (req, res) => {
    res.render("legal/refund-policy");
});


module.exports = router;