const mongoose = require("../db");

const collectionSchema = new mongoose.Schema({
    name: String,
    address: String,
    itemType: String,
    pickupDate: String
});

module.exports = mongoose.model("Collection", collectionSchema);