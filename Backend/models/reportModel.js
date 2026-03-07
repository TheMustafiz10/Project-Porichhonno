const mongoose = require("../db");

const reportSchema = new mongoose.Schema({
    description: String,
    latitude: Number,
    longitude: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Report", reportSchema);