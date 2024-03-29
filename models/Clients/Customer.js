const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
    {
        cemail: {
            type: String,
            required: true,
            unique: true
        },
        cname: {
            type: String,
            required: true,
        },
        cphoto: [{
            type: String,
        }],
        isorg: {
            type: Boolean,
            default: false
        },
        ccon: {
            type: String,
            required: true,
            min: 8,
            max: 12
        },
    }
);

module.exports = mongoose.model("Customer", CustomerSchema);