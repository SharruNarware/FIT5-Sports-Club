const express = require("express");
const router = express.Router();

const {
    showContactPage,
    submitContactForm
} = require("../controllers/contactController");


// GET - Show Contact Page
router.get("/", showContactPage);


// POST - Submit Contact Form
router.post("/", submitContactForm);


module.exports = router;