const mongoose = require("./db");

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

module.exports = mongoose.model("User", userSchema);