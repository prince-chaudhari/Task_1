const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullname:String,
    email:{
        type:String,
        unique:[true, "User already exists!!"]
    },
    number:Number,
    city:{
        type:String,
        enum:["Mehsana", "Ahmedabad", "Surat"]
    },
    state:{
        type:String,
        enum:["Gujarat", "Delhi", "Bihar"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },

})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel