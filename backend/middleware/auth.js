const jwt=require("jsonwebtoken");
require("dotenv").config();
exports.auth=async (req,res,next)=>{
    try{
        // console.log("Body",req.body.token);
        // console.log("cookies",req.cookies.token);
        // console.log("header",req.header("Authorization"));
        const token=req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");
        if(!token || token===undefined)
        {
            return res.status(401).json({
                success:false,
                message:'Token Missing'
            });
        }
        try{
            const payload=await jwt.verify(token,process.env.JWT_SECRET);
            //console.log(payload);
            req.user=payload.payload;
        }
        catch(err)
        {
            return res.status(401).json({
                success:false,
                message:"fail to authenticate"
            })
        }
        next();
    }catch(err)
    {
        return res.status(401).json({
            success:false,
            message:"token not found"
        })
    }
}


