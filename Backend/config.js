const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/task1").then(() => {
    console.log("Database connetion successfully!!");
    
}).catch(() => {
    console.log("Somthing went wrong!!");

})



