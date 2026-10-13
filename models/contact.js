const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const contactSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        phone: {
            type: String,
            trim: true,
            maxlength: 20
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 150
        },

        subject: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200
        },

        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 5000
        },

        status: {
            type: String,
            enum: ["new", "read", "replied"],
            default: "new"
         },

        replies: [
            {
                message: {
                    type: String,
                    required: true,
                    trim: true
                },

                repliedAt: {
                    type: Date,
                    default: Date.now
                },

                repliedBy: {
                    type: String,
                    default: "Admin"
                }
            }
        ],

        adminNote: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;