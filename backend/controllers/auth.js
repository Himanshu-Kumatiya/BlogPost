const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("body1 ", req.body);
        if (name == "" || email == "" || password == "") {
            console.log("not all fields...");
            return res.json({
                status: 400,
                message: "Please fill all fields"
            });
        }
        let check = await User.findOne({ email });
        //console.log(check);
        if (check) {
            return res.json({
                status: 400,
                success: false,
                message: "User already exist"
            });
        }
        let hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, email, password: hashedPass
        });
        //let user;
        try {
            //console.log("hi")
            // user=await User.create({
            //     name,email,password:hashedPass });
            // console.log(user)
            await newUser.save();
            res.json({
                status: 200,
                success: true,
                message: 'user created successfully'
            });
        } catch (err) {
            //console.log(err);
            res.json({
                status: 400,
                success: false,
                message: "Failed to create new user"
            });
        }

    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "Error while sending post request"
        });
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Fill all details"
            })
        }
        let check = await User.findOne({ email });
        console.log("user data in db ", check, typeof (check));
        if (!check) {
            return res.status(401).json({

                success: false,
                message: "User is not registered"
            });
        }
        const payload = {
            email: check.email,
            id: check._id
        }
        if(await bcrypt.compare(password, check.password)) {
            let token = jwt.sign({ payload }, process.env.JWT_SECRET, {
                expiresIn: "28h"
            });
            let user = check.toObject();
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.status(200).cookie("token", token, options).json({
                success: true,
                token,
                user,
                message: "User logged in successfully"
            })
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Password Invalid"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "failed to fetch data"
        })
    }
}
exports.googleAuth = async (req, res) => {
    const { name, email, photo } = req.body;
    console.log("email ",email);
    try {
        let check = await User.findOne({ email });
        console.log("user data in db ", check, typeof (check));
        if (!check) {
            let hashedPass = await bcrypt.hash("sfgd", 10);
            const newUser = new User({
                name, email, password: hashedPass, photo
            });
            try {
                check = await newUser.save();
                console.log("check", check);
            } catch (err) {
                console.log(err);
                res.json({
                    status: 400,
                    success: false,
                    message: "Failed to create new user"
                });
            }
        }
        const payload = {
            email: check.email,
            id: check._id,
        }
        let token = jwt.sign({ payload }, process.env.JWT_SECRET);
        let user = check.toObject();
        user.token = token;
        user.password = undefined;
        const options = {
            expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
            httpOnly: true
        }
        res.status(200).cookie("token", token, options).json({
            success: true,
            token,
            user,
            message: "User logged in successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "failed to fetch data"
        })
    }
}
exports.signOut=async(req,res)=>{
        res.clearCookie('token').status(200)

}