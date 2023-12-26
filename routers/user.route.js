const express = require('express');
const UserRoute = express.Router();
const UserController = require('../controllers/user.controller');


// Register a new user
UserRoute.get('/allUsers',UserController.AllUsers);


module.exports = UserRoute;
