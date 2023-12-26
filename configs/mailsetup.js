//const express = require('express');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "nehakapoor9332@gmail.com", 
      pass: "icbphvfinmdiexss", 
    }
    //store otp temporily 
  })

  module.exports=transporter;