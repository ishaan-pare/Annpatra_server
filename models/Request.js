const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
    {
        from: {
            type: String,
            required: true
        },
        note: {
            type: String,
            min: 3,
            max: 40
        },
        isAccepted: {
            type: Boolean,
            default: false
        },
        deadline: {
            type: Date,
            require: true
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Request", RequestSchema);