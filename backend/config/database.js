const mongoose=require("mongoose");
require("dotenv").config();
const connectDB=()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("Connected with database");
    }).catch((error)=>{
        console.log("Error in connecting database")
        console.log(error.message);
        process.exit(1);
    })
}
module.exports=connectDB;