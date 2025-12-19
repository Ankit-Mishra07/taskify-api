const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    status: {type:String, required:true, unique:true}
}, {
    timestamps: true,
    versionKey:false
})

const StatusSchema = mongoose.model('status', statusSchema);
module.exports = StatusSchema;