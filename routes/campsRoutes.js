const express = require("express");
const router = express.Router();


// Main Camps Page
// router.get("/", (req, res) => {
//     res.render("camps/camps");
// });


// Residential Summer Camp
router.get("/residential-camp", (req, res) => {
    res.render("camps/residential-camp");
});


// International Summer Camp
router.get("/international-camp", (req, res) => {
    res.render("camps/international-camp");
});


// Adventures Summer Camp
router.get("/adventures-camp", (req, res) => {
    res.render("camps/adventures-camp");
});


module.exports = router;