const { default: mongoose } = require("mongoose");

 const ProfileSchema = new mongoose.Schema({
    age: {
        type: Number,
        validate: {
            validator:function(value) {
                return value > 0 && value < 100;
            },
            message: "Age must be between 0 and 100",
        },
        required: '{PATH} is required',
    },
    location: {
        type: String,
        required: '{PATH} is required',
    },
    
});
const ProfileUser = mongoose.model("ProfileUser", ProfileSchema);

module.exports = ProfileUser;