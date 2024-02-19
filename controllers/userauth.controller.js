const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const mailTransporter = require("../configs/mailsetup");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");

exports.signUp = async (req, res) => {
  try {
    const requiredField = ({ password, mobileno, email, Name } = req.body);

    // Check if the mobile number already exists in the database
    const existingUser = await UserModel.findOne({ mobileno });
    if (existingUser) {
      return res.status(400).json({ error: "Mobile number already exists" });
    }

    if (!requiredField) {
      return res
        .status(400)
        .json({
          error: "Pleasse fill all the details for successfully register...",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const CreateUser = new UserModel({
      mobileno: mobileno,
      email: email,
      Name: Name,
      password: hashedPassword,
    });

    await CreateUser.save();

    const result = {
      mobileno: CreateUser.mobileno,
      email: CreateUser.email,
      Name: CreateUser.Name,
    };

    //Send the OTP via email
    //   const mailOptions = {
    //     from: "nehakapoor9332@gmail.com", // Your email address
    //     to: "sneha@weroute.ai",
    //     subject: "Users Data",
    //     html: `<div style="background-color: #000; padding: 20px; border-radius: 1%;">
    //       <h1 style="color: #ff0; font-family: Arial, sans-serif;">Users Registration data</h1>

    //       <div style="background-color: red; color: skyblue; padding: 20px; border-radius: 10px;">
    //   <h2>User Information:</h2>
    //   <p><strong>Name:</strong> ${result.Name}</p>
    //   <p><strong>Email -:</strong> ${result.email}</p>
    //   <p><strong>Phone no. -:</strong> ${result.mobileno}</p>
    // </div>
    //       </div>`,
    //   };

    //   mailTransporter.sendMail(mailOptions, async (error, info) => {
    //     if (error) {
    //       return res.status(500).json({ error: "Failed to send OTP via email" });
    //     }
    //   });

    // Omit sensitive information from the response
    const User = await UserModel.findOne({ mobileno }).select({
      password: 0,
    });

    const token = jwt.sign({ id: CreateUser._id }, "121212WE", {
      expiresIn: "1h", // Set the expiration time for the token
    });

    res.status(201).json({
      message: `One User registered successfully with Name - ${CreateUser.Name}`,
      accessToken: token,
      User,
    });
    console.log(`One User registered successfully. Name - ${CreateUser.Name}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { mobileno, password } = req.body;

    // Find the user by mobile number
    const User = await UserModel.findOne({ mobileno });

    // Check if the user exists
    if (!User) {
      return res
        .status(404)
        .json({ error: "User not found with provided details..." });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, User.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: User._id }, "121212WE", {
      expiresIn: "1h", // Set the expiration time for the token
    });

    // Return the token in the response
    return res.status(200).json({
      message: `hey ${User.Name} , you are successfully logged In...`,
      Email: User.email,
      mobileno: User.mobileno,
      accessToken: token,
    });
    console.log(`${User.Name} just logged in...`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const User = await UserModel.findOne({ email });

    //check if user doesn't exists
    if (!User) {
      return res
        .status(404)
        .json({ error: "User not found with provided email id" });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      uppercase: false,
      specialChars: false,
    });
    // Save the OTP to the database
    await UserModel.updateOne({ email: email }, { otp });

    //sending otp on client mail id
    const mailOptions = {
      from: "sneha@weroute.ai", // Your email address
      to: email,
      subject: "Hey, we've made it easy to get back to Weroute",
      html: `
      <table border="0" width="430px" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 auto 0 auto;width:430px">
      <tbody><tr><td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td><td><p style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
      Hi, </p><p style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">We're sorry to hear that you're having trouble with logging in to Weroute.
       We've received a message that you've <span class="il">forgotten</span> your <span class="il">password</span>. If this was you, you can use this secret code to reset your <span class="il">password</span> now.
       </p></td></tr><tr><td height="20" style="line-height:20px">&nbsp;</td></tr><tr><td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td><td>
       <a href="#" style="color:#1b74e4;text-decoration:none;display:block;width:370px" target="_blank"><table border="0" width="390" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
       <tbody><tr><td style="border-collapse:collapse;border-radius:3px;text-align:center;display:block;border:solid 1px #009fdf;padding:10px 16px 14px 16px;margin:0 2px 0 auto;min-width:80px;background-color:#47a2ea">
      <a href="#" style="color:#1b74e4;text-decoration:none;display:block" target="_blank"><center><font size="3"><span style="font-family:Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;white-space:nowrap;font-weight:bold;vertical-align:middle;color:#fdfdfd;font-size:16px;line-height:16px">${otp}</span></font></center></a>
      </td></tr></tbody></table></a></td></tr><tr><td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td><td><table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse"><tbody><tr><td><table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse"><tbody><tr><td><table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
      <tbody><tr></tr><tr><td height="20" style="line-height:20px">&nbsp;</td>
      </tr>
      </tbody></table></a></td></tr><tr><td height="20" style="line-height:20px">&nbsp;</td></tr><tr><td width="15" style="display:block;width:15px">&nbsp;&nbsp;&nbsp;</td></tr><tr></tr><tr><td><div><div style="padding:0;margin:10px 0 10px 0;color:#565a5c;font-size:16px">If you didn't request a login link or <span class="il">password</span> reset, you can ignore this message. <span></span><br><br>Only people who know your Weroute <span class="il">password,
      </span> can use the security code of this email can log in to your account.</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>`,
    };

    mailTransporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Failed to send OTP via email" });
      } else {
        return res.status(201).json({ success: " Otp has been sent successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Verify otp
exports.UserVerifyOtp = async (req, res) => {
  try {
    let email = req.body.email;
    let otp = req.body.otp;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and otp is required" });
    }
    let isuser = await UserModel.findOne({ email, otp });

    if (!isuser) {
      return res
        .status(404)
        .send({ status: false, message: "you entered wrong email or otp" });
    }

    let userID = isuser._id;
    const token = jwt.sign({ _id: userID }, "noUser2466", { expiresIn: "24h" });

    return res
      .status(200)
      .json({ status: true, msg: "OTP send", token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//save password
exports.Userupdatepassword = async (req, res) => {
  // try {
  let password = req.body.password;
  let confirmpassword = req.body.confirmpassword;
  let token = req.body.token;
  console.log(req.body);
  if (!password || !confirmpassword) {
    return res
      .status(400)
      .json({
        status: false,
        message: "Password or confirm password is missing",
      });
  }
  if (confirmpassword !== password) {
    return res
      .status(400)
      .json({ status: false, message: "Password or confirm password must" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedconfirmpassword = await bcrypt.hash(confirmpassword, 10);

  const tokenVerify = jwt.verify(token, "User2466");

  let changepassword = await UserModel.findOneAndUpdate(
    { _id: tokenVerify._id },
    {
      $set: {
        password: hashedPassword,
        confirmpassword: hashedconfirmpassword,
        Timewhenyouupadted: new Date(),
      },
    },
    { new: true }
  );

  res.status(200).send({ status: true, data: " Password Reset Successful..." });
};
