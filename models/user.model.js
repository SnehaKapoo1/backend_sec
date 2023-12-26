
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    mobileno: {
        type: Number,
        unique: true,
        required: true,
    },
    Name : {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        //required: true,
        default:' '
    },
    
});

const UserModel = mongoose.model('User', UserSchema);

module.exports =  UserModel 



