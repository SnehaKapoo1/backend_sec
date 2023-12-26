


const UserModel = require("./../models/user.model");


const AllUsers = async (req,res) => {

    try{

        let allUsers = await UserModel.find();

      if(allUsers) {
         let result = allUsers.map ((user) => ({
           mobileno: user.mobileno,
           email : user.email,
           Name : user.Name
         }))
         res.json({message : "Users list Found...", Users_list : result})
      } else {
        res.json({message : "No Users Found..."})
      }

    }catch (error) {
        res.status(500).json({ error: error.message }); 
      }
      
}

module.exports = {AllUsers}