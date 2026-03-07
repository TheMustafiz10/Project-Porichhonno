const mongoose = require("../db");

const binSchema = new mongoose.Schema({
    locationName: String,
    latitude: Number,
    longitude: Number
});

module.exports = mongoose.model("Bin", binSchema);