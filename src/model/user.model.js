const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {type:String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type:String, required: true},
    isAdmin: {type: Boolean, required: false, default:false},
    isSuperAdmin: {type: Boolean, required: false, default:false},
    employee_id: {type: Number, required: true, unique: true},
    role: {type: String, required: true},
}
,{
    timestamps:true,
    versionKey:false
}
);

const UserSchema = mongoose.model('user', userSchema);

module.exports = UserSchema;