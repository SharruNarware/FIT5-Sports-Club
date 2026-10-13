const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");


// Admin Login
router.get("/login", adminController.showLogin);

router.post("/login", adminController.login);


// Admin Contact Requests
router.get("/contacts", adminAuth, adminController.showContacts);

// Get single contact
router.get("/contacts/:id", adminAuth, adminController.getContact);

// Update contact status
router.patch("/contacts/:id/status", adminAuth, adminController.updateContactStatus);

// Reply to contact
router.post("/contacts/:id/reply", adminAuth, adminController.replyToContact);

// Delete contact
router.delete("/contacts/:id", adminAuth, adminController.deleteContact);

// Save admin note
router.patch("/contacts/:id/note", adminAuth, adminController.saveContactNote);


// Protected Admin Dashboard
router.get("/", adminAuth, adminController.dashboard);

// Admin Logout
router.get("/logout", adminController.logout);


module.exports = router;