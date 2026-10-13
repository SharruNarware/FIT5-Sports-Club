const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const Contact = require("../models/contact");
const { layout } = require("ejs-mate");


// Show Admin Login Page
exports.showLogin = (req, res) => {
    res.render("admin/login", {
        layout: false
    });
};


// Handle Admin Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.render("admin/login", {
                layout: false,
                error: "Email and password are required."
            });
        }

        // Find admin by email
        const admin = await Admin.findOne({
            email: email.toLowerCase().trim()
        });

        // Admin not found
        if (!admin) {
            return res.render("admin/login", {
                layout: false,
                error: "Invalid email or password."
            });
        }

        // Compare entered password with hashed password
        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        // Password incorrect
        if (!isPasswordValid) {
            return res.render("admin/login", {
                layout: false,
                error: "Invalid email or password."
            });
        }

        // Create admin session
        req.session.adminId = admin._id.toString();
        req.session.adminRole = admin.role;
        req.session.adminName = admin.name;

        // Redirect to admin dashboard
        res.redirect("/admin");

    } catch (error) {
        console.error("Admin login error:", error);

        res.status(500).render("admin/login", {
            layout: false,
            error: "Something went wrong. Please try again."
        });
    }
};



// Admin Dashboard
exports.dashboard = async (req, res) => {
    try {

        // Total contact requests
        const totalContacts = await Contact.countDocuments();

        // New / unread contact requests
        const newContacts = await Contact.countDocuments({
            status: "new"
        });

        // Get latest 5 contact requests
        const recentContacts = await Contact.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.render("admin/dashboard", {
            totalContacts,
            newContacts,
            recentContacts
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).send("Unable to load dashboard.");
    }
};



// Admin Logout
exports.logout = (req, res) => {
    req.session.destroy((error) => {

        if (error) {
            console.error("Logout error:", error);
            return res.status(500).send("Unable to logout.");
        }

        res.redirect("/admin/login");
    });
};



// =========================
// Admin Contact Requests
// =========================
exports.showContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 });

        const totalContacts = await Contact.countDocuments();

        const newContacts = await Contact.countDocuments({
            status: "new"
        });

        const readContacts = await Contact.countDocuments({
            status: "read"
        });

        const repliedContacts = await Contact.countDocuments({
            status: "replied"
        });

        res.render("admin/contacts", {
            contacts,
            totalContacts,
            newContacts,
            readContacts,
            repliedContacts
        });

    } catch (error) {
        console.error("Admin contacts error:", error);
        
        res.status(500).send("Unable to load contact requests.");
    }
};


// ==========================================
// Get Single Contact
// ==========================================
exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.json({
            success: true,
            contact
        });

    } catch (error) {
        console.error("Get contact error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to get contact"
        });
    }
};


// ==========================================
// Update Contact Status
// ==========================================
exports.updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = ["new", "read", "replied"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.json({
            success: true,
            message: "Status updated successfully",
            contact
        });

    } catch (error) {
        console.error("Update status error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update status"
        });
    }
};


// ==========================================
// Reply To Contact
// ==========================================
exports.replyToContact = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Reply message is required"
            });
        }

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        contact.replies.push({
            message: message.trim(),
            repliedAt: new Date(),
            repliedBy: req.session.adminName || "Admin"
        });

        contact.status = "replied";

        await contact.save();

        res.json({
            success: true,
            message: "Reply saved successfully",
            contact
        });

    } catch (error) {
        console.error("Reply error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to save reply"
        });
    }
};


// ==========================================
// Delete Contact
// ==========================================
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.json({
            success: true,
            message: "Contact deleted successfully"
        });

    } catch (error) {
        console.error("Delete contact error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete contact"
        });
    }
};


// ==========================================
// Save Admin Note
// ==========================================
exports.saveContactNote = async (req, res) => {
    try {
        const { note } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                adminNote: note || ""
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.json({
            success: true,
            message: "Note saved successfully",
            contact
        });

    } catch (error) {
        console.error("Save note error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to save note"
        });
    }
};