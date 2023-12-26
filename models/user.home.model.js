
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    projectTitle: {
        type: String,
        required: true,
    },
    technology : {
        type: String,
        required: true
    },
    usd: {
        type: String,
    },
    duration: {
        type: String,
        required: true,
    },
    
});

const UserModel = mongoose.model('UserRequirements', UserSchema);

module.exports =  UserModel 



