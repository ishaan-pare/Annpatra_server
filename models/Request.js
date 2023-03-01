const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
    {
        source: {//email of from 
            type: String,
            required: true
        },
        destination: {//email of to
            type: String,
            required: true
        },
        for: {//number of person to feed
            type: Number,
            required: true
        },
        note: {//general note
            type: String,
            min: 3,
            max: 40
        },
        isAccepted: {//package preparation accepted or not
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Request", RequestSchema);