require("dotenv").config();

const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const Admin = require("../models/admin");

async function createAdmin() {
    try {
        await connectDB();

        const name = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!name || !email || !password) {
            throw new Error(
                "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required."
            );
        }

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log("Admin with this email already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully.");
        console.log("Admin ID:", admin._id.toString());
        console.log("Admin Email:", admin.email);

        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
}

createAdmin();