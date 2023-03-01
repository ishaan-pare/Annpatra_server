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
        requests: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request"
        }]
    }
);

module.exports = mongoose.model("Customer", CustomerSchema);