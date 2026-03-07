const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://mdmustafizurrahman2_db_user:123456Dhaka@cluster0.hdoh4kh.mongodb.net/myWebsiteDB?retryWrites=true&w=majority";

mongoose.connect(mongoURL)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

module.exports = mongoose;