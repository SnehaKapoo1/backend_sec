const jwt = require('jsonwebtoken');
const  UserModel  = require('../models/user.model');

const ExistingUser = async (req, res, next) => {
    const headertoken = await req.headers.authorization
    // console.log(headertoken)
    try {
        if (headertoken == undefined) { res.status(500).json({ message: "Invalid authorization header" }) }
        var [bearerKeyword, token] = headertoken.split(' ');
        if (bearerKeyword.toLowerCase() === 'bearer' && token) {
            var decodedtoken = jwt.verify(token, "121212WE");
            // console.log(decodedtoken);
        } else {
            res.status(500).json({ message: " unauthorization token" })
        }
        const User = await UserModel.findById(decodedtoken.id)
        
        if(User){
            req.User = User;
        }else{
            res.status(404).json("User Not found !")
        }
        next()
        
    } catch (error) {
        res.status(500).json({ error: error, });
    }
};

module.exports = {ExistingUser}