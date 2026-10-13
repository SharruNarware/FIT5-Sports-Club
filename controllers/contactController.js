const Contact = require("../models/contact");


const showContactPage = (req, res) => {
    res.render("contact/contact");
};


// =========================
// Handle Contact Form
// =========================
const submitContactForm = async (req, res, next) => {
    try {
        const { fullName, phone, email, subject, message } = req.body;

        const contact = new Contact({
            fullName,
            phone,
            email,
            subject,
            message
        });


        // Save to MongoDB
        await contact.save();


        // Send JSON response to frontend
        return res.status(201).json({
            success: true,
            message: "message saved successfully"
        });

    } catch (error) {
        console.error("Contact form submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to save your message"
        });
    }
};


module.exports = {
    showContactPage,
    submitContactForm
};