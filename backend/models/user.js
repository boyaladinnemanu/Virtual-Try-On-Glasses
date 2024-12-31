const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name : String,
    price : Number,
    category : String,
    image : String,
    isAvailable :Boolean,
})

const UserModel = mongoose.model("item", UserSchema)

module.exports = UserModel