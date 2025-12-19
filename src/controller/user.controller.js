const jwt = require('jsonwebtoken');

const UserSchema = require("../model/user.model");
const { isValidEmail } = require("../utils/ValidEmailCheck");

const createUser = async (req, res) => {
    try {

        if(!req.body.email || !isValidEmail(req.body.email)) {
            return res.status(400).json({
                success:false,
                message:'Please enter valid email',
            });
        };

        const userExist = await UserSchema.findOne({email: req.body.email});

        if(userExist) {
            return res.status(404).json({
                success:false,
                message:'User Already Exist',
            }); 
        }
        
        const user = await UserSchema.create({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin,
            isSuperAdmin: req.body.isSuperAdmin,
            employee_id: req.body.employee_id
        })
        return res.status(200).json({
            success:true, message: 'User created successfully',
            data: user
        })
    }catch(error) {
        res.status(500).json({success: false, message: 'Something went wrong', errorMessage: error});
    }
}

const updateUser = async (req, res) => {

    try {
        const user = await UserSchema.findByIdAndUpdate(req.params.userid, req.body, {new: true, runValidators: true});
        if(!user) {
            return res.status(400).json({
                success:false,
                message:'User not found!',
            });   
        }
        return res.status(200).json({
            success:true, message: 'User updated successfully',
            data: user
        })  

    }catch(error) {
        return res.status(500).json({success: false, message: 'Something went wrong', errorMessage: error});
    }
}

const getAllUserList = async (req, res) => {
    try {
        const users = await UserSchema.find({}).select('-password');
        return res.status(200).json({
            success:true, message: 'Users fetched successfully',
            data: users
        });

    }catch(error) {
        return res.status(500).json({success: false, message: 'Something went wrong', errorMessage: error});
    }
}

const loginUser = async (req, res) => {
    try {

        const user = await UserSchema.findOne({email: req.body.email, password: req.body.password}).select('-password');
        if(!user) {
            return res.status(200).json({
                success:false,
                message:'User not found, please contact admin',
            });
        }
        const token = jwt.sign({
            id:user._id,
            name:user.userName,
            email:user.email,
            isAdmin: user.isAdmin,
            isSuperAdmin:user.isSuperAdmin,
            employee_id: user.employee_id
        }, 'secret', {
            expiresIn: "1000h"
        });
        return res.status(200).json({
            success:true, message: 'Logged In Successfully',
            data: {user: user, token: token}
        });

    }catch(error) {
        return res.status(500).json({success: false, message: 'Something went wrong', errorMessage: error});
    }
}

module.exports = {createUser, updateUser, getAllUserList, loginUser};