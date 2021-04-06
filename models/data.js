const mongoose = require("mongoose");
const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    lb: String,
    money: Number,
    daily: Number,
    currentbet: Number,
    prediction: String
})

module.exports = mongoose.model("Data", dataSchema);