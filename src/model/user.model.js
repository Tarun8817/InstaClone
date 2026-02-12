const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"user name already exists "],
        required:[true,"user name is required"]
    },

    email:{
        type:String,
        unique:[true,"Email alredy exists"],
        required:[true,"Email is required"]
    },

    password:{
        type:String,
        required:[true,"Password is required"]
    },
    bio:String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/6licivecx/User%20Image.webp"
    }
    
})


const userModel = mongoose.model("users",userSchema);

module.exports = userModel;