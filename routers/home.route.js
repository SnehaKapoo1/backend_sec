// routes/userRoutes.js
const express = require('express');
const HomeRouter = express.Router();
//const Controller = require('../controllers/userauth.controller');
const HomeController = require('../controllers/user.home.controller');
const {ExistingUser}  = require('../middleware/userauth.middleware');


// Register a new user
HomeRouter.post('/datasend', ExistingUser,HomeController.home);
//HomeRouter.post('/signIn', UserController.signIn);
module.exports = HomeRouter;