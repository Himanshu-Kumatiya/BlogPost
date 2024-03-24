const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
exports.updateUser = async (req, res) => {
    console.log("update user", req.user, req.params.userId);
    if (req.user.id === req.params.userId) {
        let { name, email, password } = req.body;
        if (password) {
            password = await bcrypt.hash(password, 10);
        }
        try {
            const check = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    name: name,
                    email: email,
                    photo: req.body.photo,
                    password: password
                }
            }, { new: true });

            const payload = {
                email: check.email,
                id: check._id
            }

            let token = jwt.sign({ payload }, process.env.JWT_SECRET, {
                expiresIn: "2h"
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
                message: "User updated successfully"
            })

        } catch {
            res.status(400).json({
                success: false,
                message: "Failed to update"
            })
        }
    }
    else {
        res.status(403).json({
            message: "You are not allowed to update this user",
            status: 403, success: false
        })
    }
}
exports.deleteUser = async (req, res) => {
    if (req.user.id !== req.params.userId) {
        res.status(404).json({
            success: false,
            message: "No user exits"
        })

    }
    else {
        try {
            await User.findByIdAndDelete(req.params.userId);
            res.status(200).json({
                success: false,
                message: "User deleted successfully"
            })
        } catch (err) {
            res.status(400).json({
                success: false,
                message: "Server error"
            })
        }
    }
}