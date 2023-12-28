const UserHomeModel = require('../models/user.home.model');
const UserModel = require('../models/user.model');
const mailTransporter = require("../configs/mailsetup");
//const { response } = require('express');


exports.home = async (req, res) => {

    try{

      //work of middleware
        const {id, mobileno, Name, email  } = await req ?.User;

            const detailsOfUser = await UserModel.findById({ _id : id}) ;
    
            if (detailsOfUser) {
                const response = {
                    mobileNo : detailsOfUser.mobileno,
                    name : detailsOfUser.Name,
                    email: detailsOfUser.email
                }
            
            } else {
                res.json({message : "No User Found"}).status(404)
            }

        const requiredField = {
            country,
            state, 
            city,
            projectTitle,
            technology,
            usd,
            duration
        } = req.body;

        if(!requiredField){
            return res.status(400).json({error: "Pleasse fill all the details correctly.."});
        }

        //making object and passing the data into the database
        const HomeModel = new UserHomeModel({
          country,
          state,
          city,
          projectTitle,
          technology,
          usd,
          duration 
        });

        //saving data into the database
        const saveModel = await HomeModel.save();

        //sending data on mail
        const mailOptions = {
            from: "sneha@weroute.ai", // Your email address
            to: "kp@weroute.ai",
            subject: "Users Data",
            html: `<div style="background-color: #ECF0F1; padding: 15px; border-style: solid; border-color:#E64391; border-width: 2px;">
              <h1 style="text-decoration: underline; color: #E64391; text-align: center; font-family: Arial, sans-serif;"> Client Data </h1>
          
              <div style="background-color:#E64391; color: #ECF0F1; padding: 20px; border-style: solid; border-color:#EA8DF2; border-width: 2px;">
          
          <div style= "text-align: center; color: #ECF0F1"> 
          <p><strong>Name: </strong> ${detailsOfUser.Name}</p>
          <p><strong>Email: </strong> ${detailsOfUser.email}</p>
          <p><strong>Phone no.: </strong> ${detailsOfUser.mobileno}</p>
          <p><strong>Country: </strong> ${saveModel.country}</p>
          <p><strong>State: </strong> ${saveModel.state}</p>
          <p><strong>City: </strong> ${saveModel.city}</p>
          <p><strong>Project-Title: </strong> ${saveModel.projectTitle}</p>
          <p><strong>Technology: </strong> ${saveModel.technology}</p>
          <p><strong>Usd: </strong> ${saveModel.usd}</p>
          <p><strong>Time Duration: </strong> ${saveModel.duration}</p>
          </div>
        </div>
              </div>`,
          };
      
          mailTransporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              return res.status(500).json({ error: "Failed to send OTP via email" });
            }else{
              return res.status(201).json({message: "mail has been sent"});
            }
          });


    }catch (error) {
        res.status(500).json({ error: error.message });
      }
}

// <div>${saveModel.country}</div>
          // <div>${saveModel.state}</div>
          // <div>${saveModel.city}</div>
          // <div>${saveModel.projectTitle}</div>

        //  <h2 style="text-decoration: underline; color: #EA8DF2; text-align: center; font-family: Arial, sans-serif;">User Information:</h2>