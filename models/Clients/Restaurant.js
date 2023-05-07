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
        rphoto: [{
            type: String
        }],
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
        rmenu: [{
            type: mongoose.Schema.Types.Mixed
        }]
    }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema)