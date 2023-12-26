


// routes/userRoutes.js
const express = require('express');
const UserRouter = express.Router();
const UserController = require('../controllers/userauth.controller');
const { ExistingUser } = require('../middleware/userauth.middleware');


// Register a new user
UserRouter.post('/signUp',UserController.signUp);
UserRouter.post('/signIn', UserController.signIn);


//Forgot password
UserRouter.post('/otp-generate', UserController.forgotPassword);
UserRouter.post('/verify-otp', UserController.UserVerifyOtp);
UserRouter.put('/update-pass', UserController.Userupdatepassword);

module.exports = UserRouter;


