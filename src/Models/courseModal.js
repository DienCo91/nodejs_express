const { default: mongoose } = require("mongoose");

const courseSchemas = new mongoose.Schema({
    name:{
        type:String,
    },
    point:{
        type:Number,

    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
})

const Course = mongoose.model("Course",courseSchemas);
module.exports = Course;