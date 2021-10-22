const mongoose = require("mongoose")

const secretSchema = mongoose.Schema({
    belongsTo: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true, 
        trim: true
    },
    password: {
        type: String,
        default: "password",
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

const Secret = mongoose.model("Secret", secretSchema)

module.exports = Secret