const mongoose=require("mongoose");
const comments=new mongoose.Schema({
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog",
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    body:{
        type:String,
        required:true
    }
},{timestamps:true})
module.exports=mongoose.model('Comment',comments);