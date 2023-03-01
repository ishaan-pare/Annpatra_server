const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
    {
        cemail: {
            type: String,
            required: true,
            unique: true
        },
        rname: {
            type: String,
            required: true,
            min: 3,
            max: 20
        },
        rcon: {
            type: String,
            required: true,
            min: 8,
            max: 12
        },
        rpin: {
            type: String,
            required: true,
        },
        raddr: {
            type: String,
            required: true
        },
        requests: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request"
        }],
        rcanfeed: {
            type: Number,
            required: true
        }
    }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema)