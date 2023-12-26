




const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config();
const connectToDatabase = require("./configs/db");
const UserRouter = require('./routers/userauth.route');
const UserDetailsRouter = require("./routers/user.route");
//const ProfileRouter = require ('./Routers/UserProfile.route');
const homeRouter = require('./routers/home.route');


const app = express();
const port = process.env.PORT || 2026;
const http = require('http');
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors());


// USE OF ROUTES

app.use("/backend_sec/User" , UserRouter);
app.use("/backend_sec" , UserDetailsRouter);
app.use("/backend/data", homeRouter);
//app.use('/backend_sec/UserProfile' , ProfileRouter);


server.listen(port, async () => {
    try {
        await connectToDatabase();
        console.log(`Server App is running on port No. ${port}`);
        console.log(`for using the localhost please use the url - localhost:${port}/`)
    } catch (err) {
        console.log({ message: "Failed to connect Database", err });
    }
});