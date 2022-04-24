const { default: mongoose } = require("mongoose")

function connectToDb(){
    mongoose.connect("mongodb://127.0.0.1:27017/")

    mongoose.connection.once("open", () => {
        console.log("connected")
    }).on("error", err => {
        console.log("Your error", err)
    })
}

module.exports = connectToDb;